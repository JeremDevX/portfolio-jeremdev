import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const readRepoFile = (relativePath) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const readConfiguredLocales = () => {
  const routingSource = readRepoFile("src/i18n/routing.ts");
  const localesDefinition = routingSource.match(/locales:\s*\[([^\]]+)\]/);

  assert.ok(localesDefinition, "routing.locales should be defined");

  return [...localesDefinition[1].matchAll(/"([^"]+)"/g)].map(
    (match) => match[1]
  );
};

test("FR and EN locale content expose the required Home and MetaData shape", () => {
  const fr = JSON.parse(readRepoFile("content/fr/fr.json"));
  const en = JSON.parse(readRepoFile("content/en/en.json"));

  for (const locale of [fr, en]) {
    assert.equal(typeof locale.Home?.title, "string");
    assert.equal(typeof locale.Home?.text, "string");
    assert.ok(Array.isArray(locale.Home?.aboutContent));
    assert.ok(locale.Home.aboutContent.length > 0);
    assert.equal(typeof locale.Home?.contactTitle, "string");
    assert.equal(typeof locale.Home?.contactLinkedInLabel, "string");
    assert.equal(typeof locale.Home?.contactEmailLabel, "string");
    assert.equal(typeof locale.Home?.footerBuiltWith, "string");
    assert.equal(typeof locale.MetaData?.home?.title, "string");
    assert.equal(typeof locale.MetaData?.home?.description, "string");
  }

  assert.match(fr.Home.title, /React et Next\.js/i);
  assert.match(en.Home.title, /React and Next\.js/i);
  assert.notEqual(fr.Home.contact, en.Home.contact);
  assert.notEqual(fr.Home.footerBuiltWith, en.Home.footerBuiltWith);
});

test("Home metadata keeps locale-aware canonical/languages without layout duplication", () => {
  const homePageSource = readRepoFile("src/app/[locale]/page.tsx");
  const layoutSource = readRepoFile("src/app/[locale]/layout.tsx");

  assert.match(homePageSource, /canonical:\s*`\$\{baseUrl\}\/\$\{locale\}`/);
  assert.match(homePageSource, /const languageAlternates = Object\.fromEntries\(/);
  assert.match(
    homePageSource,
    /routing\.locales\.map\(\(supportedLocale\) => \[\s*supportedLocale,\s*`\$\{baseUrl\}\/\$\{supportedLocale\}`/
  );
  assert.match(homePageSource, /languages:\s*languageAlternates/);
  assert.doesNotMatch(homePageSource, /languages:\s*\{\s*fr:/);
  assert.doesNotMatch(layoutSource, /rel="canonical"/);
  assert.doesNotMatch(layoutSource, /name="viewport"/);
});

test("SEO metadata and touch icon point to existing assets", () => {
  const homePageSource = readRepoFile("src/app/[locale]/page.tsx");
  const layoutSource = readRepoFile("src/app/[locale]/layout.tsx");

  assert.match(homePageSource, /`\$\{baseUrl\}\/og-image\.png`/);
  assert.match(layoutSource, /rel="apple-touch-icon"\s+href="\/apple-touch-icon\.png"/);

  assert.ok(
    existsSync(path.join(process.cwd(), "public/og-image.png")),
    "public/og-image.png should exist"
  );
  assert.ok(
    existsSync(path.join(process.cwd(), "public/apple-touch-icon.png")),
    "public/apple-touch-icon.png should exist"
  );
});

test("Robots sitemap is derived from SITE_CONFIG.baseUrl", () => {
  const robotsSource = readRepoFile("src/app/robots.ts");

  assert.match(
    robotsSource,
    /import\s+\{\s*SITE_CONFIG\s*\}\s+from\s+"@\/lib\/constants"/
  );
  assert.match(
    robotsSource,
    /sitemap:\s*`\$\{SITE_CONFIG\.baseUrl\}\/sitemap\.xml`/
  );
  assert.doesNotMatch(robotsSource, /sitemap:\s*"https?:\/\//);
});

test("Locale routing and static params are aligned on the same locale source", () => {
  const configuredLocales = readConfiguredLocales();
  const layoutSource = readRepoFile("src/app/[locale]/layout.tsx");
  const sitemapSource = readRepoFile("src/app/sitemap.ts");
  const constantsSource = readRepoFile("src/lib/constants.ts");

  assert.ok(configuredLocales.length > 0);

  assert.match(
    layoutSource,
    /generateStaticParams\(\)\s*\{\s*return routing\.locales\.map\(\(locale\) => \(\{ locale \}\)\);\s*\}/
  );
  assert.match(layoutSource, /if \(!isLocale\(locale\)\)/);
  assert.match(sitemapSource, /routing\.locales\.map\(\(locale\) => \(\{/);
  assert.doesNotMatch(sitemapSource, /SEO_CONFIG/);
  assert.doesNotMatch(constantsSource, /defaultLocale:\s*"fr"/);
  assert.doesNotMatch(constantsSource, /locales:\s*\[/);
});

test("Locale validation uses an explicit type guard and avoids any casts", () => {
  const routingSource = readRepoFile("src/i18n/routing.ts");
  const layoutSource = readRepoFile("src/app/[locale]/layout.tsx");
  const requestSource = readRepoFile("src/i18n/request.ts");

  assert.match(
    routingSource,
    /export function isLocale\(value: unknown\): value is Locale/
  );
  assert.match(layoutSource, /if \(!isLocale\(locale\)\)/);
  assert.match(requestSource, /if \(!isLocale\(locale\)\)/);
  assert.doesNotMatch(layoutSource, /\sas any/);
  assert.doesNotMatch(requestSource, /\sas any/);
});

test("Home page source keeps translatable contact/footer copy and avoids hardcoded UI strings", () => {
  const homePageSource = readRepoFile("src/app/[locale]/page.tsx");

  assert.match(homePageSource, /t\("contactTitle"\)/);
  assert.match(homePageSource, /t\("contactLinkedInLabel"\)/);
  assert.match(homePageSource, /t\("contactEmailLabel"\)/);
  assert.match(homePageSource, /t\("footerBuiltWith"\)/);

  assert.doesNotMatch(homePageSource, /<h2 className=\{styles\.hero__title\}>/);
  assert.doesNotMatch(homePageSource, /Built with Next\.js, TypeScript & ❤️/);
});

test("Home page keeps a single h1 and all main sections rendered", () => {
  const homePageSource = readRepoFile("src/app/[locale]/page.tsx");
  const h1Matches = homePageSource.match(/<h1\b/g) ?? [];

  assert.equal(h1Matches.length, 1);

  assert.match(homePageSource, /<section className=\{styles\.hero\}>/);
  assert.match(homePageSource, /<section className=\{styles\.skills\}>/);
  assert.match(homePageSource, /<section className=\{styles\.projects\}>/);
  assert.match(homePageSource, /<section className=\{styles\.about\}>/);
  assert.match(homePageSource, /<section className=\{styles\.contact\}>/);
});

test("Home page stylesheet removes unused module classes and keeps one global light class", () => {
  const pageStyles = readRepoFile("src/app/[locale]/page.module.scss");
  const globalStyles = readRepoFile("src/app/globals.scss");

  assert.doesNotMatch(pageStyles, /^\s*\.github\s*\{/m);
  assert.doesNotMatch(pageStyles, /^\s*\.skillList\s*\{/m);
  assert.doesNotMatch(pageStyles, /^\s*\.light\s*\{/m);
  assert.match(globalStyles, /^\s*\.light\s*\{/m);
});

test("FR and EN locale content expose required GitHub i18n keys", () => {
  const fr = JSON.parse(readRepoFile("content/fr/fr.json"));
  const en = JSON.parse(readRepoFile("content/en/en.json"));

  for (const locale of [fr, en]) {
    assert.equal(typeof locale.Github?.projects?.noData, "string");
    assert.equal(typeof locale.Github?.projects?.emptyStateMessage, "string");
    assert.equal(typeof locale.Github?.projects?.retryButton, "string");
    assert.equal(typeof locale.Github?.projects?.tooltip, "string");
    assert.equal(typeof locale.Github?.projects?.liveSite, "string");
    assert.equal(typeof locale.Github?.projects?.codeRepo, "string");
    assert.equal(
      typeof locale.Github?.projects?.previousProjectAriaLabel,
      "string"
    );
    assert.equal(
      typeof locale.Github?.projects?.nextProjectAriaLabel,
      "string"
    );
    assert.equal(typeof locale.Github?.projects?.closeModalAriaLabel, "string");
    assert.equal(typeof locale.Github?.projects?.descriptionFallback, "string");

    assert.equal(typeof locale.Github?.contributions?.title, "string");
    assert.equal(typeof locale.Github?.contributions?.noData, "string");
    assert.equal(typeof locale.Github?.contributions?.inLastYear, "string");
    assert.equal(typeof locale.Github?.contributions?.dayTooltipCount, "string");
  }

  assert.notEqual(
    fr.Github.projects.emptyStateMessage,
    en.Github.projects.emptyStateMessage
  );
  assert.notEqual(fr.Github.projects.retryButton, en.Github.projects.retryButton);
});

test("GitHub project modal parsing is guarded and no longer parses metadata inline", () => {
  const projectsListSource = readRepoFile(
    "src/components/custom/GithubData/GitHubProjects/GitHubProjectsList.tsx"
  );

  assert.match(projectsListSource, /function parseRepositoryDescription\(/);
  assert.match(projectsListSource, /try\s*\{\s*const parsedMetadata = JSON\.parse/);
  assert.match(projectsListSource, /\}\s*catch\s*\{/);
  assert.match(projectsListSource, /fallbackDescription=\{t\("descriptionFallback"\)\}/);
  assert.match(
    projectsListSource,
    /parseRepositoryDescription\(\s*repo\.object\?\.text,\s*locale,\s*fallbackDescription\s*\)/
  );
  assert.doesNotMatch(projectsListSource, /JSON\.parse\(repo\.object\?\.text/);
});

test("GitHub UI copy is sourced from i18n keys across projects and contributions components", () => {
  const projectsListSource = readRepoFile(
    "src/components/custom/GithubData/GitHubProjects/GitHubProjectsList.tsx"
  );
  const projectsFetcherSource = readRepoFile(
    "src/components/custom/GithubData/GitHubProjects/GitHubProjectsFetcher.tsx"
  );
  const contributionsSource = readRepoFile(
    "src/components/custom/GithubData/GithubContributions/GithubContributions.tsx"
  );
  const contributionDaySource = readRepoFile(
    "src/components/custom/GithubData/GithubContributions/ContributionDay.tsx"
  );

  assert.match(projectsListSource, /useTranslations\("Github\.projects"\)/);
  assert.match(projectsFetcherSource, /getTranslations\("Github\.projects"\)/);
  assert.match(contributionsSource, /getTranslations\("Github\.contributions"\)/);
  assert.match(contributionDaySource, /useTranslations\("Github\.contributions"\)/);

  assert.doesNotMatch(projectsListSource, />\s*Live Site\s*</);
  assert.doesNotMatch(projectsListSource, />\s*Code Repo\s*</);
  assert.doesNotMatch(contributionsSource, />\s*GitHub Contributions\s*</);
  assert.doesNotMatch(contributionsSource, />\s*Error: No data\s*</);
});
