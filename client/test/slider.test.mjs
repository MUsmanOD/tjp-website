import assert from "node:assert/strict";
import test from "node:test";
import { access } from "node:fs/promises";
import { wrapSlide, horizontalWheelDelta } from "../src/lib/slider.js";
import { heroSlides } from "../src/config/hero-slides.js";
import { translations } from "../src/i18n/messages.js";

test("carousel wraps in both directions", () => {
  assert.equal(wrapSlide(-1, 4), 3);
  assert.equal(wrapSlide(4, 4), 0);
  assert.equal(wrapSlide(2, 4), 2);
});

test("trackpad navigation preserves vertical scrolling and pinch zoom", () => {
  assert.equal(horizontalWheelDelta({ deltaX: 0, deltaY: 100 }), 0);
  assert.equal(horizontalWheelDelta({ deltaX: 20, deltaY: 100 }), 0);
  assert.equal(horizontalWheelDelta({ deltaX: 100, deltaY: 0, ctrlKey: true }), 0);
  assert.equal(horizontalWheelDelta({ deltaX: 80, deltaY: 2 }), 80);
  assert.equal(horizontalWheelDelta({ deltaX: 80, deltaY: 2 }, "rtl"), -80);
  assert.equal(horizontalWheelDelta({ deltaX: 0, deltaY: 80, shiftKey: true }), 80);
  assert.equal(horizontalWheelDelta({ deltaX: 5, deltaY: 0, deltaMode: 1 }), 80);
});

test("all four slides have local assets, credits, and bilingual copy", async () => {
  assert.equal(heroSlides.length, 4);
  for (const locale of ["en", "ur"]) assert.equal(translations[locale].home.slides.length, 4);
  for (const slide of heroSlides) {
    await access(new URL(`../public${slide.src}`, import.meta.url));
    assert.ok(["tjp", "commons"].includes(slide.credit));
    assert.equal(new URL(slide.source).protocol, "https:");
    if (slide.credit === "commons") {
      assert.ok(slide.photographer);
      assert.ok(slide.source.startsWith("https://commons.wikimedia.org/wiki/File:"));
    } else {
      assert.ok(slide.original.startsWith("https://tjp.org.pk/wp-content/uploads/"));
    }
  }
});
