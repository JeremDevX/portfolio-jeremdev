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
    assert.equal(typeof locale.MetaData?.home?.title, "string");
    assert.equal(typeof locale.MetaData?.home?.description, "string");
  }

  assert.match(fr.Home.title, /React et Next\.js/i);
  assert.match(en.Home.title, /React and Next\.js/i);
});

test("Home metadata keeps locale-aware canonical and language alternates", () => {
  const homePageSource = readRepoFile("src/app/[locale]/page.tsx");

  assert.match(homePageSource, /canonical:\s*`\$\{baseUrl\}\/\$\{locale\}`/);
  assert.match(homePageSource, /languages:\s*\{\s*fr:\s*`\$\{baseUrl\}\/fr`/);
  assert.match(homePageSource, /languages:\s*\{[\s\S]*en:\s*`\$\{baseUrl\}\/en`/);
});

test("Locale routing and static params are aligned on the same locale source", () => {
  const layoutSource = readRepoFile("src/app/[locale]/layout.tsx");

  assert.match(
    layoutSource,
    /generateStaticParams\(\)\s*\{\s*return routing\.locales\.map\(\(locale\) => \(\{ locale \}\)\);\s*\}/
  );
  assert.match(layoutSource, /if \(!routing\.locales\.includes\(locale/);
});
