import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function luminance(hex) {
  return hex
    .match(/../g)
    .map((pair) => parseInt(pair, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    )
    .reduce(
      (sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index],
      0,
    );
}
function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("shared premium palette keeps readable text, visible fields and dark-header focus", () => {
  const css = readFileSync(
    new URL("../styles/premium-theme.css", import.meta.url),
    "utf8",
  );
  const token = (name) => {
    const value = css.match(
      new RegExp(`--${name}:\\s*#([\\da-f]{6})`, "i"),
    )?.[1];
    assert.ok(value, `${name} must have a color`);
    return value;
  };
  for (const background of [
    "ffffff",
    token("surface-page"),
    token("surface-muted"),
  ]) {
    for (const text of [token("ink-primary"), token("ink-secondary")]) {
      assert.ok(
        contrast(text, background) >= 4.5,
        `Text #${text} on #${background}`,
      );
    }
  }
  for (const background of ["ffffff", "fffcfd"]) {
    assert.ok(
      contrast(token("border-control"), background) >= 3,
      "Form fields remain distinguishable",
    );
  }
  for (const background of ["391e2b", "84384f"]) {
    assert.ok(
      contrast("f0d4e0", background) >= 4.5,
      "Dashboard supporting text remains readable",
    );
    assert.ok(
      contrast("ffe1ec", background) >= 3,
      "Dashboard hero focus remains visible",
    );
  }
});

test("freelancer disclosure text and marketplace hero link focus retain sufficient static color contrast", () => {
  const freelancerCSS = readFileSync(
    new URL("../features/freelancers/freelancers.css", import.meta.url),
    "utf8",
  );
  const catalogueCSS = readFileSync(
    new URL("../features/services/services-catalogue.css", import.meta.url),
    "utf8",
  );
  const note = freelancerCSS.match(
    /\.freelancer-card__note,[\s\S]*?color:\s*#([\da-f]{6})/i,
  )?.[1];
  assert.ok(note, "Disclosure text needs an explicit color");
  for (const background of ["ffffff", "eee9ed"])
    assert.ok(
      contrast(note, background) >= 4.5,
      `Normal disclosure text against #${background}`,
    );
  const focus = catalogueCSS.match(
    /\.services-catalogue \.services-hero a:focus-visible\s*{[^}]*outline-color:\s*#([\da-f]{6})/i,
  )?.[1];
  assert.ok(focus, "Dark hero links need a visible focus outline");
  for (const background of ["351923", "602637", "8c3c55"])
    assert.ok(
      contrast(focus, background) >= 3,
      `Focus outline against hero color #${background}`,
    );
});
