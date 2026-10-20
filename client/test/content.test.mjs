import assert from "node:assert/strict";
import test from "node:test";
import { access } from "node:fs/promises";
import { articles, galleryItems } from "../src/config/content.js";
import { media } from "../src/config/media.js";
import { translations, locales } from "../src/i18n/messages.js";

test("every gallery and article image resolves to a local asset and translated context", async () => {
  for (const key of new Set([...Object.keys(media), ...galleryItems.map((item) => item.media), ...articles.map((item) => item.media)])) {
    assert.ok(media[key], `missing media: ${key}`);
    await access(new URL(`../public${media[key].src}`, import.meta.url));
    for (const locale of locales) {
      const copy = translations[locale].media[key];
      assert.ok(copy?.title && copy?.alt && copy?.description, `${locale}.${key}`);
    }
  }
});

test("article routes have bilingual bodies and distinguish examples from sourced archive reports", () => {
  assert.equal(new Set(articles.map(({ slug }) => slug)).size, articles.length);
  for (const locale of locales) {
    const copy = translations[locale].journal;
    assert.equal(copy.articles.length, articles.length);
    articles.forEach((article, index) => {
      assert.ok(copy.categories[article.category]);
      assert.ok(copy.kinds[article.kind]);
      assert.ok(copy.articles[index].title && copy.articles[index].excerpt);
      assert.ok(copy.articles[index].paragraphs.length >= 3);
      if (article.kind === "archive") {
        assert.match(article.date, /^\d{4}-\d{2}-\d{2}$/);
        assert.ok(media[article.media].source.startsWith("https://tjp.org.pk/"));
      }
      if (article.kind === "editorial") assert.equal(article.date, undefined);
    });
    for (const item of galleryItems) assert.ok(translations[locale].gallery[item.category]);
  }
});
