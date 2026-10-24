import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

let vite;
let ProjectDetails;

before(async () => {
  vite = await createServer({
    root: fileURLToPath(new URL("../../../", import.meta.url)),
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
  ({ default: ProjectDetails } = await vite.ssrLoadModule(
    "/src/features/projects/ProjectDetails.jsx",
  ));
});

after(async () => {
  await vite?.close();
});

function renderProject(projectId) {
  return renderToStaticMarkup(
    createElement(ProjectDetails, { projectId, onBack: () => {} }),
  );
}

test("open project shows a distinct scope, deliverables, EGP budget, and preview notice", () => {
  const html = renderProject("project_001");

  assert.match(html, /Build a responsive event website/);
  assert.match(html, /Scope of work/);
  assert.match(html, /Expected deliverables/);
  assert.match(html, /Clear event schedule/);
  assert.match(html, /6,000/);
  assert.match(html, /EGP/);
  assert.match(html, /Open for proposals/);
  assert.match(html, /Verified students can submit a simulated proposal/);
  assert.match(html, /No client is contacted/);
});

test("selected project clearly says it is unavailable for proposals", () => {
  const html = renderProject("project_002");

  assert.match(html, /Not accepting proposals/);
  assert.match(html, /This project is not accepting proposals/);
  assert.match(html, /Editable social media assets/);
});

test("missing project displays a recovery action without project information", () => {
  const html = renderProject("project_missing");

  assert.match(html, /Project not found/);
  assert.match(html, /All projects/);
  assert.doesNotMatch(html, /Project budget/);
});
