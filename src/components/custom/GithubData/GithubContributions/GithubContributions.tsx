import { fetchContributions } from "@/lib/github";
import styles from "./GithubContributions.module.scss";

export default async function GitHubContributions() {
  const { totalContributions, days } = await fetchContributions();

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
