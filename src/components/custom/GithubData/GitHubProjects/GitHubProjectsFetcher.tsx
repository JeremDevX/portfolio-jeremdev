import { fetchRepositories } from "@/lib/github";
import GitHubProjectsList from "./GitHubProjectsList";
import { getTranslations } from "next-intl/server";

// Re-export Repository type from the centralized service
export type { Repository } from "@/lib/github";

export default async function GitHubProjectsFetcher() {
  const repositories = await fetchRepositories();
  const t = await getTranslations("Github.projects");

  if (!repositories || repositories.length === 0) {
    return <p>{t("noData")}</p>;
  }

  return <GitHubProjectsList repositories={repositories} />;
}
