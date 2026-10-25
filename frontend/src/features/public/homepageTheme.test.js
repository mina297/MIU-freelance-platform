import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

function browser({ saved = null, dark = false, blocked = false } = {}) {
  return {
    localStorage: {
      getItem() {
        if (blocked) throw new Error("Storage blocked");
        return saved;
      },
    },
    matchMedia: () => ({ matches: dark }),
  };
}

test("every fresh load starts light even with saved dark mode, a dark OS or blocked storage", () => {
  const html = readFileSync(
    new URL("../../../index.html", import.meta.url),
    "utf8",
  );
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const options of [
    { dark: true },
    { saved: "light", dark: true },
    { saved: "dark" },
    { saved: "bad", dark: true },
    { blocked: true, dark: true },
  ]) {
    for (const pathname of ["/", "/login", "/projects", "/services"]) {
      const client = browser(options);
      const document = { documentElement: { dataset: {} } };
      runInNewContext(script, { ...client, document, location: { pathname } });
      assert.equal(
        document.documentElement.dataset.homeTheme,
        pathname === "/" ? "light" : undefined,
      );
    }
  }
});

function luminance(hex) {
  return hex
    .match(/../g)
    .map((pair) => parseInt(pair, 16) / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    )
    .reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
}
function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

test("dark homepage text and keyboard focus contrast against each principal surface", () => {
  const css = readFileSync(
    new URL("./homepageTheme.css", import.meta.url),
    "utf8",
  );
  const token = (name) =>
    css.match(new RegExp(`--home-${name}:\\s*#([a-f0-9]{6})`))[1];
  for (const surface of ["canvas", "surface", "raised", "wine"]) {
    for (const text of ["text", "secondary", "accent"]) {
      assert.ok(
        contrast(token(surface), token(text)) >= 4.5,
        `${text} on ${surface}`,
      );
    }
    assert.ok(contrast(token(surface), "ffc3d2") >= 3);
  }
  assert.ok(contrast("ffffff", "b91c35") >= 4.5);
  assert.ok(contrast("a0e2ba", "213b30") >= 4.5);
});
