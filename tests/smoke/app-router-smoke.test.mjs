import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const readRepoFile = (relativePath) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

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
  assert.match(homePageSource, /languages:\s*\{\s*fr:\s*`\$\{baseUrl\}\/fr`/);
  assert.match(homePageSource, /languages:\s*\{[\s\S]*en:\s*`\$\{baseUrl\}\/en`/);
  assert.doesNotMatch(layoutSource, /rel="canonical"/);
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
  const layoutSource = readRepoFile("src/app/[locale]/layout.tsx");

  assert.match(
    layoutSource,
    /generateStaticParams\(\)\s*\{\s*return routing\.locales\.map\(\(locale\) => \(\{ locale \}\)\);\s*\}/
  );
  assert.match(layoutSource, /if \(!routing\.locales\.includes\(locale/);
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
