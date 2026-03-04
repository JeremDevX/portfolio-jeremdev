/**
 * Service centralisé pour les appels à l'API GitHub GraphQL.
 */

import { GITHUB_CONFIG } from "./constants";
import {
  extractContributionsFromCalendar,
  getGraphQLDataOrThrow,
  sortAndFilterRepositories,
} from "./github.transformers";

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

export interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface GitHubRepositoriesData {
  user?: {
    repositories?: {
      nodes?: Repository[];
    };
  };
}

interface GitHubContributionsData {
  user?: {
    contributionsCollection?: {
      contributionCalendar?: {
        totalContributions?: number;
        weeks?: {
          contributionDays?: ContributionDay[];
        }[];
      };
    };
  };
}

interface GitHubGraphQLResponse<TData> {
  data?: TData;
  errors?: { message: string }[];
}

export class GitHubApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitHubApiError";
  }
}

// ==========================================
// QUERIES GRAPHQL
// ==========================================

const REPOSITORIES_QUERY = `
  query GetRepositories($username: String!) {
    user(login: $username) {
      repositories(first: 50, isFork: false, privacy: PUBLIC) {
        nodes {
          name
          description
          url
          homepageUrl
          openGraphImageUrl
          createdAt
          updatedAt
          object(expression: "HEAD:metadata.json") {
            ... on Blob {
              text
            }
          }
        }
      }
    }
  }
`;

const CONTRIBUTIONS_QUERY = `
  query GetContributions($username: String!) {
    user(login: $username) {
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

function getGitHubToken(): string {
  const token = process.env.GITHUB_TOKEN_USER_DATA;
  if (!token) {
    throw new GitHubApiError(
      "Missing GitHub token. Set GITHUB_TOKEN_USER_DATA in environment variables."
    );
  }

  return token;
}

async function fetchGitHubGraphQL<T>(
  query: string,
  variables: Record<string, string> = {}
): Promise<T> {
  const token = getGitHubToken();
  const response = await fetch(GITHUB_CONFIG.apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: GITHUB_CONFIG.revalidateTime },
  });

  if (!response.ok) {
    throw new GitHubApiError(
      `GitHub API error: ${response.status} ${response.statusText}`
    );
  }

  const payload = (await response.json()) as GitHubGraphQLResponse<T>;
  try {
    return getGraphQLDataOrThrow(payload);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "GitHub GraphQL response cannot be parsed.";
    throw new GitHubApiError(message);
  }
}

// ==========================================
// PUBLIC API
// ==========================================

export async function fetchRepositories(): Promise<Repository[]> {
  const data = await fetchGitHubGraphQL<GitHubRepositoriesData>(
    REPOSITORIES_QUERY,
    { username: GITHUB_CONFIG.username }
  );

  const repositories = data.user?.repositories?.nodes;
  if (!Array.isArray(repositories)) {
    throw new GitHubApiError("GitHub repositories response has an invalid shape.");
  }

  return sortAndFilterRepositories(repositories);
}

export async function fetchContributions(): Promise<{
  totalContributions: number;
  days: ContributionDay[];
}> {
  const data = await fetchGitHubGraphQL<GitHubContributionsData>(
    CONTRIBUTIONS_QUERY,
    { username: GITHUB_CONFIG.username }
  );

  const calendar = data.user?.contributionsCollection?.contributionCalendar;
  try {
    return extractContributionsFromCalendar(calendar);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "GitHub contributions cannot be extracted.";
    throw new GitHubApiError(message);
  }
}
