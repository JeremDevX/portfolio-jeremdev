import styles from "./GithubLanguages.module.scss";

interface GitHubLanguage {
  name: string;
  size: number;
}

interface GitHubRepository {
  languages: {
    edges: {
      size: number;
      node: {
        name: string;
      };
    }[];
  };
}

interface GitHubResponse {
  data: {
    user: {
      repositories: {
        nodes: GitHubRepository[];
      };
    };
  };
  errors?: { message: string }[];
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN_USER_DATA;

const fetchGitHubLanguages = async () => {
  if (!GITHUB_TOKEN) {
    throw new Error("Missing GitHub Token. Set GITHUB_TOKEN in env variables.");
  }

  const query = `
    {
      user(login: "jeremdevx") {
        repositories(first: 100, isFork: false) {
          nodes {
            languages(first: 10) {
              edges {
                size
                node {
                  name
                }
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
    return [];
  }

  const repos = data.data.user.repositories.nodes;
  const languageStats: Record<string, number> = {};
  let totalSize = 0;

  repos.forEach((repo) => {
    repo.languages.edges.forEach((lang) => {
      const { name } = lang.node;
      const size = lang.size;
      totalSize += size;
      languageStats[name] = (languageStats[name] || 0) + size;
    });
  });

  const sortedLanguages = Object.entries(languageStats)
    .map(([name, size]) => ({
      name,
      size,
      percentage: Number(((size / totalSize) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.size - a.size);

  const topLanguages = sortedLanguages.slice(0, 5);
  const otherLanguage = sortedLanguages.slice(5).map((lang) => lang.percentage);

  return [
    ...topLanguages,
    {
      name: "Other",
      percentage: otherLanguage.reduce((a, b) => a + b, 0),
    },
  ];
};

export default async function GitHubLanguages() {
  const languages = await fetchGitHubLanguages();

  return (
    <div className={styles.languages}>
      <h3 className="">Top Languages</h3>
      <ul className={styles.languages__list}>
        {languages.length > 0 ? (
          languages.map((lang) => (
            <li key={lang.name} className={styles.languages__item}>
              <span className={styles.languages__item_name}>{lang.name}</span>
              <div className={styles.languages__percentage}>
                {/* {Array.from({ length: lang.percentage }, (_, i) => (
                  <span key={i} className={styles.languages__bar} />
                  ))} */}
                <span
                  className={styles.languages__bar}
                  style={{ width: `${lang.percentage * 1.5}%` }}
                />
                <span className={styles.languages__percentageStr}>
                  {lang.percentage}%
                </span>
              </div>
            </li>
          ))
        ) : (
          <p>Aucune donnée disponible</p>
        )}
      </ul>
    </div>
  );
}
