import { fetchRepositories } from "@/lib/github";
import GitHubProjectsList from "./GitHubProjectsList";
import { getTranslations } from "next-intl/server";

// Re-export Repository type from the centralized service
export type { Repository } from "@/lib/github";

export default async function GitHubProjectsFetcher() {
  const t = await getTranslations("Github.projects");

  try {
    const repositories = await fetchRepositories();

    if (repositories.length === 0) {
      return <p>{t("noData")}</p>;
    }

    return <GitHubProjectsList repositories={repositories} />;
  } catch (error) {
    console.error("Failed to fetch GitHub repositories:", error);
    return <p>{t("fetchError")}</p>;
  }
}
