import { fetchRepositories } from "@/lib/github";
import GitHubProjectsList from "./GitHubProjectsList";

// Re-export Repository type from the centralized service
export type { Repository } from "@/lib/github";

export default async function GitHubProjectsFetcher() {
  const repositories = await fetchRepositories();

  if (!repositories || repositories.length === 0) {
    return <p>No data</p>;
  }

  return <GitHubProjectsList repositories={repositories} />;
}
