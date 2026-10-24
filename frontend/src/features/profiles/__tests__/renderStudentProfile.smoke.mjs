/**
 * Member 5 render smoke check (Vite SSR).
 * Verifies StudentProfilePage compiles and renders fixture content.
 * Does not modify App.jsx or the main router.
 *
 * Run from frontend/: node src/features/profiles/__tests__/renderStudentProfile.smoke.mjs
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(__dirname, "../../../..");

const server = await createServer({
  root: frontendRoot,
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

try {
  const mod = await server.ssrLoadModule(
    "/src/features/profiles/StudentProfilePage.jsx",
  );
  const StudentProfilePage = mod.default;

  const readyHtml = renderToString(
    React.createElement(StudentProfilePage, {
      studentId: "m5_sample_student_nour",
      simulateDelay: false,
    }),
  );

  const notFoundHtml = renderToString(
    React.createElement(StudentProfilePage, {
      studentId: "student_missing",
      simulateDelay: false,
    }),
  );

  // React SSR may insert comment separators between adjacent text nodes
  // (e.g. "About <!-- -->Nour"), so avoid brittle exact substring checks.
  const checks = [
    ["contains display name", readyHtml.includes("Nour El-Sayed")],
    [
      "contains About heading",
      readyHtml.includes('id="about-heading"') && readyHtml.includes("Nour"),
    ],
    ["contains skill chip", readyHtml.includes("Branding")],
    ["contains At a glance", readyHtml.includes("At a glance")],
    ["contains Links", readyHtml.includes("github.com/nour-design-demo")],
    [
      "contains community card",
      readyHtml.includes("Part of the MIU community"),
    ],
    ["contains Contact CTA", readyHtml.includes("Contact")],
    ["not-found state works", notFoundHtml.includes("Profile not found")],
  ];

  const failed = checks.filter(([, ok]) => !ok);
  for (const [label, ok] of checks) {
    console.log(`${ok ? "PASS" : "FAIL"} — ${label}`);
  }

  if (failed.length > 0) {
    console.error("\nSmoke render failed.");
    process.exitCode = 1;
  } else {
    console.log("\nSmoke render passed.");
  }
} finally {
  await server.close();
}
