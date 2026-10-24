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
