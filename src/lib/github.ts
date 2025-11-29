/**
 * Service centralisé pour les appels à l'API GitHub GraphQL
 * Évite la duplication de code entre les différents composants
 */

import { GITHUB_CONFIG } from "./constants";

// ==========================================
// TYPES
// ==========================================

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

interface GitHubRepositoriesResponse {
  data: {
    user: {
      repositories: {
        nodes: Repository[];
      };
    };
  };
  errors?: { message: string }[];
}

interface GitHubContributionsResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: ContributionDay[];
          }[];
        };
      };
    };
  };
  errors?: { message: string }[];
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

// ==========================================
// FETCH HELPER
// ==========================================

const GITHUB_TOKEN = process.env.GITHUB_TOKEN_USER_DATA;

async function fetchGitHubGraphQL<T>(
  query: string,
  variables: Record<string, string> = {}
): Promise<T> {
  if (!GITHUB_TOKEN) {
    throw new Error(
      "Missing GitHub Token. Set GITHUB_TOKEN_USER_DATA in env variables."
    );
  }

  const response = await fetch(GITHUB_CONFIG.apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: GITHUB_CONFIG.revalidateTime },
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// ==========================================
// PUBLIC API
// ==========================================

/**
 * Récupère les repositories publics avec un site déployé
 * Triés par date de création (plus récent en premier)
 */
export async function fetchRepositories(): Promise<Repository[]> {
  try {
    const data = await fetchGitHubGraphQL<GitHubRepositoriesResponse>(
      REPOSITORIES_QUERY,
      { username: GITHUB_CONFIG.username }
    );

    if (data.errors) {
      console.error("GraphQL Error:", data.errors);
      return [];
    }

    const repos = data.data.user.repositories.nodes;

    // Filtrer les repos avec un site et trier par date
    return repos
      .filter((repo) => repo.homepageUrl)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return [];
  }
}

/**
 * Récupère les contributions GitHub de l'année
 */
export async function fetchContributions(): Promise<{
  totalContributions: number;
  days: ContributionDay[];
}> {
  try {
    const data = await fetchGitHubGraphQL<GitHubContributionsResponse>(
      CONTRIBUTIONS_QUERY,
      { username: GITHUB_CONFIG.username }
    );

    if (data.errors) {
      console.error("GraphQL Error:", data.errors);
      return { totalContributions: 0, days: [] };
    }

    const calendar =
      data.data.user.contributionsCollection.contributionCalendar;

    return {
      totalContributions: calendar.totalContributions,
      days: calendar.weeks.flatMap((week) => week.contributionDays),
    };
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return { totalContributions: 0, days: [] };
  }
}
