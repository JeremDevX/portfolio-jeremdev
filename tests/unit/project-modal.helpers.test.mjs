import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeLocale,
  parseRepositoryDescription,
  resolveModalKeyboardAction,
} from "../../src/components/custom/GithubData/GitHubProjects/projectModal.helpers.ts";

test("normalizeLocale keeps 'en' and falls back to 'fr'", () => {
  assert.equal(normalizeLocale("en"), "en");
  assert.equal(normalizeLocale("fr"), "fr");
  assert.equal(normalizeLocale(undefined), "fr");
  assert.equal(normalizeLocale(["en"]), "en");
  assert.equal(normalizeLocale(["de"]), "fr");
});

test("parseRepositoryDescription returns localized content when valid", () => {
  const metadataText = JSON.stringify({
    description: {
      fr: "Description FR",
      en: "English description",
    },
  });

  assert.equal(
    parseRepositoryDescription(metadataText, "fr", "Pas de description"),
    "Description FR"
  );
  assert.equal(
    parseRepositoryDescription(metadataText, "en", "No description"),
    "English description"
  );
});

test("parseRepositoryDescription falls back on malformed or missing content", () => {
  const fallbackFr = "Pas de description";
  const fallbackEn = "No description";

  assert.equal(parseRepositoryDescription(undefined, "fr", fallbackFr), fallbackFr);
  assert.equal(parseRepositoryDescription("{ bad-json", "en", fallbackEn), fallbackEn);
  assert.equal(
    parseRepositoryDescription(JSON.stringify({}), "en", fallbackEn),
    fallbackEn
  );
  assert.equal(
    parseRepositoryDescription(
      JSON.stringify({ description: { en: "   " } }),
      "en",
      fallbackEn
    ),
    fallbackEn
  );
});

test("resolveModalKeyboardAction handles close and focus trap transitions", () => {
  assert.equal(
    resolveModalKeyboardAction({
      key: "Escape",
      shiftKey: false,
      focusableCount: 3,
      activeIndex: 1,
    }),
    "close"
  );

  assert.equal(
    resolveModalKeyboardAction({
      key: "Tab",
      shiftKey: false,
      focusableCount: 0,
      activeIndex: -1,
    }),
    "trap-empty"
  );

  assert.equal(
    resolveModalKeyboardAction({
      key: "Tab",
      shiftKey: false,
      focusableCount: 3,
      activeIndex: -1,
    }),
    "focus-first"
  );

  assert.equal(
    resolveModalKeyboardAction({
      key: "Tab",
      shiftKey: true,
      focusableCount: 3,
      activeIndex: 0,
    }),
    "focus-last"
  );

  assert.equal(
    resolveModalKeyboardAction({
      key: "Tab",
      shiftKey: false,
      focusableCount: 3,
      activeIndex: 2,
    }),
    "focus-first"
  );

  assert.equal(
    resolveModalKeyboardAction({
      key: "Tab",
      shiftKey: false,
      focusableCount: 3,
      activeIndex: 1,
    }),
    "none"
  );

  assert.equal(
    resolveModalKeyboardAction({
      key: "Enter",
      shiftKey: false,
      focusableCount: 3,
      activeIndex: 1,
    }),
    "none"
  );
});
