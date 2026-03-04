import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

import { buildRobots, buildSitemap } from "../../src/lib/seo.ts";
import {
  DEFAULT_LOCALE,
  isLocaleValue,
  LOCALES,
} from "../../src/i18n/locales.ts";

const readLocale = (relativePath) =>
  JSON.parse(
    readFileSync(path.join(process.cwd(), relativePath), {
      encoding: "utf8",
    })
  );

const flattenLeafPaths = (value, basePath = "") => {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      flattenLeafPaths(item, `${basePath}[${index}]`)
    );
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, nestedValue]) =>
      flattenLeafPaths(
        nestedValue,
        basePath ? `${basePath}.${key}` : `${key}`
      )
    );
  }

  return [basePath];
};

test("routing locale guard accepts only configured locales", () => {
  assert.deepEqual(LOCALES, ["en", "fr"]);
  assert.equal(DEFAULT_LOCALE, "fr");

  assert.equal(isLocaleValue("fr"), true);
  assert.equal(isLocaleValue("en"), true);
  assert.equal(isLocaleValue("de"), false);
  assert.equal(isLocaleValue(undefined), false);
});

test("robots metadata uses SITE_CONFIG base URL", () => {
  const baseUrl = "https://jeremdevx.com";
  const robotsConfig = buildRobots(baseUrl);

  assert.equal(robotsConfig.sitemap, `${baseUrl}/sitemap.xml`);
  assert.equal(robotsConfig.rules.userAgent, "*");
  assert.equal(robotsConfig.rules.allow, "/");
  assert.equal(robotsConfig.rules.disallow, "/private/");
});

test("sitemap exposes root route plus one entry per locale", () => {
  const baseUrl = "https://jeremdevx.com";
  const entries = buildSitemap(baseUrl, LOCALES);
  const urls = entries.map((entry) => entry.url);

  assert.ok(urls.includes(baseUrl));
  for (const locale of LOCALES) {
    assert.ok(urls.includes(`${baseUrl}/${locale}`));
  }

  assert.equal(new Set(urls).size, urls.length);
});

test("FR and EN translations keep the same Home and Github key contracts", () => {
  const fr = readLocale("content/fr/fr.json");
  const en = readLocale("content/en/en.json");

  const homeLeafKeysFr = flattenLeafPaths(fr.Home).sort();
  const homeLeafKeysEn = flattenLeafPaths(en.Home).sort();
  const githubLeafKeysFr = flattenLeafPaths(fr.Github).sort();
  const githubLeafKeysEn = flattenLeafPaths(en.Github).sort();

  assert.deepEqual(homeLeafKeysFr, homeLeafKeysEn);
  assert.deepEqual(githubLeafKeysFr, githubLeafKeysEn);

  assert.equal(typeof fr.MetaData?.home?.title, "string");
  assert.equal(typeof en.MetaData?.home?.title, "string");
  assert.equal(typeof fr.Github?.projects?.fetchError, "string");
  assert.equal(typeof en.Github?.projects?.fetchError, "string");
  assert.equal(typeof fr.Github?.contributions?.dayAriaLabel, "string");
  assert.equal(typeof en.Github?.contributions?.dayAriaLabel, "string");
});
