import GitHubProjectsList from "./GitHubProjectsList";

export interface Repository {
  name: string;
  description: string;
  url: string;
  homepageUrl: string;
  openGraphImageUrl: string;
  createdAt: string;
  updatedAt: string;
  object?: {
    text?: string;
  } | null;
}

export interface Repositories {
  nodes: Repository[];
}

interface GitHubProjectsResponse {
  data: {
    user: {
      repositories: Repositories;
    };
  };
  errors?: { message: string }[];
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN_USER_DATA;

const fetchGitHubRepositories = async () => {
  if (!GITHUB_TOKEN) {
    throw new Error("Missing GitHub Token. Set GITHUB_TOKEN in env variables.");
  }

  const query = `
{
  user(login: "jeremdevx") {
    repositories(first: 50, isFork: false, privacy: PUBLIC) {
      nodes {
        name
        description
        url
        homepageUrl
        openGraphImageUrl
        createdAt
        updatedAt
        object(expression: "HEAD:README.md") {
          ... on Blob {
            text
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

  const data: GitHubProjectsResponse = await response.json();

  if (data.errors) {
    console.error("GraphQL Error:", data.errors);
    return [];
  }

  const repos = data.data.user.repositories.nodes;

  const publicReposWithSite = repos.filter((repo) => repo.homepageUrl);
  const publicReposWithSiteSorted = publicReposWithSite.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return publicReposWithSiteSorted;
};

export default async function GitHubProjectsFetcher() {
  const repositories = await fetchGitHubRepositories();

  return repositories ? (
    <GitHubProjectsList repositories={repositories} />
  ) : (
    <p>No data</p>
  );
}
