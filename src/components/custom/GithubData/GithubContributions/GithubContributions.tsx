import styles from "./GithubContributions.module.scss";

interface GitHubResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: {
              date: string;
              contributionCount: number;
            }[];
          }[];
        };
      };
    };
  };
  errors?: { message: string }[];
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN_USER_DATA;

const fetchGitHubContributions = async () => {
  if (!GITHUB_TOKEN) {
    throw new Error("Missing GitHub Token. Set GITHUB_TOKEN in env variables.");
  }

  const query = `
    {
      user(login: "jeremdevx") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 },
  });

  const data: GitHubResponse = await response.json();

  if (data.errors) {
    console.error("GraphQL Error:", data.errors);
    return { totalContributions: 0, days: [] };
  }

  const calendar = data.data.user.contributionsCollection.contributionCalendar;
  const totalContributions = calendar.totalContributions;

  const days = calendar.weeks.flatMap((week) => week.contributionDays);

  return { totalContributions, days };
};

export default async function GitHubContributions() {
  const { totalContributions, days } = await fetchGitHubContributions();

  return (
    <div className={styles.contributions}>
      <h3 className={styles.contributions__title}>GitHub Contributions</h3>
      <div className={styles.contributions__grid}>
        {days.length > 0 ? (
          days.map((day) => (
            <div
              key={day.date}
              className={`${styles.contributions__day} ${
                day.contributionCount > 0 ? "bg-[var(--accent)]" : "bg-zinc-900"
              }`}
              style={{
                opacity:
                  day.contributionCount > 0
                    ? day.contributionCount * 0.1 > 0.25
                      ? day.contributionCount * 0.1
                      : 0.25
                    : "",
              }}
              title={`${new Date(day.date).toLocaleDateString()}: ${
                day.contributionCount
              } contributions`}
            />
          ))
        ) : (
          <p>Error: No data</p>
        )}
      </div>
      <p className={styles.contributions__total}>
        <span className="bold">{totalContributions}</span> contributions in the
        last year
      </p>
    </div>
  );
}
