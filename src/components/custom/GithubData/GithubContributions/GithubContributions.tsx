import { fetchContributions } from "@/lib/github";
import styles from "./GithubContributions.module.scss";
import ContributionDay from "./ContributionDay";
import { getLocale, getTranslations } from "next-intl/server";

export default async function GitHubContributions() {
  const { totalContributions, days } = await fetchContributions();
  const locale = await getLocale();
  const t = await getTranslations("Github.contributions");

  return (
    <div className={styles.contributions}>
      <h3 className={styles.contributions__title}>{t("title")}</h3>
      <div className={styles.contributions__grid}>
        {days.length > 0 ? (
          days.map((day) => (
            <ContributionDay
              key={day.date}
              date={day.date}
              count={day.contributionCount}
              locale={locale}
            />
          ))
        ) : (
          <p>{t("noData")}</p>
        )}
      </div>
      <p className={styles.contributions__total}>
        <span className="bold">{totalContributions}</span>{" "}
        {t("inLastYear", { count: totalContributions })}
      </p>
    </div>
  );
}
