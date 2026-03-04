type GraphQLError = {
  message: string;
};

type GraphQLPayload<TData> = {
  data?: TData;
  errors?: GraphQLError[];
};

type RepositoryListItem = {
  homepageUrl: string;
  createdAt: string;
};

type ContributionDayItem = {
  date: string;
  contributionCount: number;
};

type ContributionCalendar = {
  totalContributions?: number;
  weeks?: {
    contributionDays?: ContributionDayItem[];
  }[];
};

export function getGraphQLDataOrThrow<TData>(
  payload: GraphQLPayload<TData>
): TData {
  if (payload.errors && payload.errors.length > 0) {
    const messages = payload.errors.map((error) => error.message).join("; ");
    throw new Error(`GitHub GraphQL error: ${messages}`);
  }

  if (!payload.data) {
    throw new Error("GitHub GraphQL response is missing data.");
  }

  return payload.data;
}

export function sortAndFilterRepositories<TRepository extends RepositoryListItem>(
  repositories: TRepository[]
): TRepository[] {
  return repositories
    .filter((repository) => Boolean(repository.homepageUrl))
    .sort(
      (leftRepository, rightRepository) =>
        new Date(rightRepository.createdAt).getTime() -
        new Date(leftRepository.createdAt).getTime()
    );
}

export function extractContributionsFromCalendar(
  calendar: ContributionCalendar | undefined
): {
  totalContributions: number;
  days: ContributionDayItem[];
} {
  if (!calendar) {
    throw new Error("GitHub contributions response has an invalid calendar shape.");
  }

  const totalContributions = calendar.totalContributions;
  const weeks = calendar.weeks;
  if (typeof totalContributions !== "number" || !Array.isArray(weeks)) {
    throw new Error(
      "GitHub contributions response has invalid contribution values."
    );
  }

  return {
    totalContributions,
    days: weeks.flatMap((week) => week.contributionDays ?? []),
  };
}
