import { readFileSync } from "node:fs";

const brand = readFileSync(
  new URL("../../styles/brand-palette.css", import.meta.url),
  "utf8",
).match(/:root\s*\{([^}]+)\}/)[1];
const dark = readFileSync(
  new URL("../../theme/theme.css", import.meta.url),
  "utf8",
).match(/:root\[data-theme="dark"\]\s*\{([^}]+)\}/)[1];
const tokens = Object.fromEntries(
  [...`${brand}\n${dark}`.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((match) => [
    match[1],
    match[2].trim(),
  ]),
);

// Resolve the opaque sRGB tokens used by the contrast checks, including mixes.
function resolve(value) {
  if (/^#[\da-f]{6}$/i.test(value)) return value.slice(1);
  if (value === "white") return "ffffff";
  if (value === "black") return "000000";
  const variable = value.match(/^var\(--([\w-]+)\)$/);
  if (variable) return getDarkThemeColor(variable[1]);
  const mix = value.match(
    /^color-mix\(\s*in srgb,\s*(var\(--[\w-]+\))\s+([\d.]+)%,\s*(var\(--[\w-]+\)|white|black)\s*\)$/,
  );
  if (!mix) throw new Error(`Unsupported contrast color: ${value}`);
  const first = resolve(mix[1]).match(/../g);
  const second = resolve(mix[3]).match(/../g);
  const weight = Number(mix[2]) / 100;
  return first
    .map((channel, index) =>
      Math.round(
        parseInt(channel, 16) * weight +
          parseInt(second[index], 16) * (1 - weight),
      )
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
}

export function getDarkThemeColor(name) {
  if (!tokens[name]) throw new Error(`Missing color token: ${name}`);
  return resolve(tokens[name]);
}
