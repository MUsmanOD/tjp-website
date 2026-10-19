import assert from "node:assert/strict";
import test from "node:test";
import { translations, locales, normalizeLocale } from "../src/i18n/messages.js";
import { siteConfig } from "../src/config/site.js";

function leaves(value, prefix = "") {
  return Object.entries(value).flatMap(([key, entry]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof entry === "object" && entry !== null
      ? leaves(entry, path)
      : [[path, entry]];
  });
}

test("English and Urdu have matching, nonempty translation entries", () => {
  const english = leaves(translations.en);
  const urdu = leaves(translations.ur);
  assert.deepEqual(english.map(([key]) => key), urdu.map(([key]) => key));
  for (const locale of locales) {
    for (const [key, value] of leaves(translations[locale])) {
      assert.equal(typeof value, "string", `${locale}.${key} must be a string`);
      assert.ok(value.trim(), `${locale}.${key} must not be empty`);
    }
  }
  assert.ok(english.length > 50, "shared chrome and page copy must be covered");
});

test("unsupported stored language values safely fall back to English", () => {
  assert.equal(normalizeLocale("ur"), "ur");
  assert.equal(normalizeLocale("en"), "en");
  for (const value of [null, undefined, "", "fr", "UR", {}, 1]) {
    assert.equal(normalizeLocale(value), "en");
  }
});

test("every shared navigation item has a label in each supported language", () => {
  for (const item of siteConfig.navigation) {
    for (const locale of locales) {
      assert.ok(translations[locale].navigation[item.key], `${locale}: missing ${item.key}`);
    }
  }
});
