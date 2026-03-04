import assert from "node:assert/strict";
import test from "node:test";

import {
  extractContributionsFromCalendar,
  getGraphQLDataOrThrow,
  sortAndFilterRepositories,
} from "../../src/lib/github.transformers.ts";

test("getGraphQLDataOrThrow returns payload data when no GraphQL error is present", () => {
  const data = { user: { id: "123" } };
  assert.deepEqual(getGraphQLDataOrThrow({ data }), data);
});

test("getGraphQLDataOrThrow throws an explicit message on GraphQL errors", () => {
  assert.throws(
    () =>
      getGraphQLDataOrThrow({
        errors: [{ message: "Bad credentials" }],
      }),
    /GitHub GraphQL error: Bad credentials/
  );
});

test("sortAndFilterRepositories removes items without homepageUrl and sorts by createdAt desc", () => {
  const repositories = [
    { name: "alpha", homepageUrl: "https://example.com/alpha", createdAt: "2024-01-01" },
    { name: "beta", homepageUrl: "", createdAt: "2025-01-01" },
    { name: "gamma", homepageUrl: "https://example.com/gamma", createdAt: "2026-01-01" },
  ];

  const result = sortAndFilterRepositories(repositories);

  assert.deepEqual(result.map((repository) => repository.name), [
    "gamma",
    "alpha",
  ]);
});

test("extractContributionsFromCalendar returns total and flattened days", () => {
  const result = extractContributionsFromCalendar({
    totalContributions: 4,
    weeks: [
      {
        contributionDays: [
          { date: "2026-01-01", contributionCount: 1 },
          { date: "2026-01-02", contributionCount: 3 },
        ],
      },
      {
        contributionDays: [{ date: "2026-01-03", contributionCount: 0 }],
      },
    ],
  });

  assert.equal(result.totalContributions, 4);
  assert.deepEqual(result.days, [
    { date: "2026-01-01", contributionCount: 1 },
    { date: "2026-01-02", contributionCount: 3 },
    { date: "2026-01-03", contributionCount: 0 },
  ]);
});

test("extractContributionsFromCalendar fails on invalid shape", () => {
  assert.throws(
    () =>
      extractContributionsFromCalendar({
        totalContributions: undefined,
        weeks: [],
      }),
    /invalid contribution values/
  );
});
