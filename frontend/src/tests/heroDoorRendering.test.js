import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { getHeroDoorGeometry } from "../features/public/heroDoorGeometry.js";

test("hero door leaves clear their frame and reflection fixes both threshold endpoints", () => {
  for (const theme of ["light", "dark"]) {
    const door = getHeroDoorGeometry(theme);
    assert.ok(door.split - door.leftTravel < door.left);
    assert.ok(door.split + door.rightTravel > door.right);
    const values = door.reflection.slice(7, -1).split(" ").map(Number);
    for (const [x, y] of [
      [door.left, door.bottomLeft],
      [door.right, door.bottomRight],
    ]) {
      const reflectedY = values[1] * x + values[3] * y + values[5];
      assert.ok(
        Math.abs(reflectedY - y) < 0.000001,
        `${theme}: threshold stays fixed`,
      );
    }
  }
});

test("both themes clip the hero cavity and moving leaves to the same inner frame", async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  try {
    const { default: HeroScene } = await vite.ssrLoadModule(
      "/src/features/public/HeroScene.jsx",
    );
    const { ThemeContext } = await vite.ssrLoadModule(
      "/src/theme/ThemeContext.js",
    );
    for (const theme of ["light", "dark"]) {
      const html = renderToStaticMarkup(
        React.createElement(
          ThemeContext.Provider,
          { value: { theme } },
          React.createElement(HeroScene),
        ),
      );
      const opening = html.match(
        /<clipPath id="[^"]+-opening"><path d="([^"]+)"/,
      )[1];
      const leaves = html.match(
        /<clipPath id="[^"]+-door"><path d="([^"]+)"/,
      )[1];
      assert.equal(
        opening,
        leaves,
        `${theme}: cavity cannot expand beyond the leaf outline`,
      );
      assert.ok(html.includes(`<path d="${opening}" fill="black"`));
      assert.doesNotMatch(html, /original-rim/);
      const images = [...html.matchAll(/<image href="([^"]*miu-crimson[^"]*)"/g)].map(
        (match) => match[1],
      );
      assert.equal(images.length, 3);
      assert.equal(
        new Set(images).size,
        1,
        "plate and both leaves use the selected theme asset",
      );
      assert.match(
        images[0],
        theme === "dark"
          ? /miu-crimson-dark-ivory\.webp/
          : /miu-crimson-light\.webp/,
      );
      const objects = [...html.matchAll(/<image href="([^"]*miu-journey-objects[^"]*)"/g)].map((match) => match[1]);
      assert.equal(objects.length, 7, "Every decorative object uses raster artwork");
      assert.equal(new Set(objects).size, 1, "Objects share one atlas per theme");
      assert.match(objects[0], theme === "dark"
        ? /miu-journey-objects-dark-ivory-v2\.webp/
        : /miu-journey-objects-light-crimson-v3\.webp/);
    }
  } finally {
    await vite.close();
  }
});
