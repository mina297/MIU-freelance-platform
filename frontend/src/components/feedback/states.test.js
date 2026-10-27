import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

let server;
const components = {};

before(async () => {
  server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  for (const [name, path] of Object.entries({
    LoadingSpinner: "components/ui/LoadingSpinner",
    Skeleton: "components/ui/Skeleton",
    ProgressIndicator: "components/ui/ProgressIndicator",
    LoadingState: "components/feedback/LoadingState",
    PageLoadingScreen: "components/feedback/PageLoadingScreen",
    EmptyState: "components/feedback/EmptyState",
    ErrorState: "components/feedback/ErrorState",
    LoadingDemoPage: "features/public/LoadingDemoPage",
    ErrorDemoPage: "features/public/ErrorDemoPage",
  })) {
    components[name] = (await server.ssrLoadModule(`/src/${path}.jsx`)).default;
  }
});

after(async () => server?.close());

const render = (name, props) =>
  renderToStaticMarkup(createElement(components[name], props));

test("branded page loading has one status, no fake percentage and translated Arabic copy", async () => {
  const english = render("PageLoadingScreen");
  assert.equal((english.match(/role="status"/g) || []).length, 1);
  assert.match(english, /Preparing your next chapter/);
  assert.doesNotMatch(english, /aria-valuenow|tabindex|<button/);
  const { LanguageContext } = await server.ssrLoadModule(
    "/src/i18n/LanguageContext.js",
  );
  const { translate } = await server.ssrLoadModule("/src/i18n/translate.js");
  const arabic = renderToStaticMarkup(
    createElement(
      LanguageContext.Provider,
      { value: { language: "ar", t: (key) => translate("ar", key) } },
      createElement(components.PageLoadingScreen, { embedded: true }),
    ),
  );
  assert.match(arabic, /نجهّز خطوتك القادمة/);
  assert.doesNotMatch(arabic, /Preparing your next chapter/);
  assert.doesNotMatch(arabic, /miu-page-loading--page/);
});

test("standalone spinner has an accessible loading message; decorative spinner is silent", () => {
  assert.match(
    render("LoadingSpinner", { label: "Loading records" }),
    /role="status"/,
  );
  assert.match(
    render("LoadingSpinner", { label: "Loading records" }),
    /Loading records/,
  );
  const decorative = render("LoadingSpinner", { decorative: true });
  assert.match(decorative, /aria-hidden="true"/);
  assert.doesNotMatch(decorative, /role=|Loading/);
});

test("loading state announces once and hides placeholder artwork", () => {
  const markup = render("LoadingState", { message: "Loading examples" });
  assert.equal((markup.match(/role="status"/g) || []).length, 1);
  assert.match(markup, /aria-atomic="true"/);
  assert.match(markup, /Loading examples/);
  assert.match(markup, /miu-skeleton/);
  assert.doesNotMatch(markup, /tabindex|aria-busy/);
  assert.doesNotMatch(
    render("LoadingState", { showSkeleton: false }),
    /miu-skeleton/,
  );
});

test("skeleton shapes are decorative and line counts are bounded", () => {
  for (const [lines, expected] of [
    [0, 1],
    [2.9, 2],
    [200, 10],
    [NaN, 3],
  ]) {
    const markup = render("Skeleton", { lines });
    assert.equal(
      (markup.match(/class="miu-skeleton__block"/g) || []).length,
      expected,
    );
    assert.match(markup, /aria-hidden="true"/);
    assert.doesNotMatch(markup, /role=|tabindex/);
  }
  for (const variant of ["circle", "rectangle"]) {
    const markup = render("Skeleton", { variant });
    assert.match(markup, new RegExp(`miu-skeleton--${variant}`));
    assert.equal((markup.match(/miu-skeleton__block/g) || []).length, 1);
  }
  assert.match(
    render("Skeleton", { variant: "unknown" }),
    /miu-skeleton--text/,
  );
});

test("native determinate progress has an associated visible label and accurate values", () => {
  const markup = render("ProgressIndicator", {
    label: "Example progress",
    id: "progress",
    value: 1,
    max: 4,
  });
  assert.match(markup, /<label for="progress">Example progress<\/label>/);
  assert.match(markup, /<progress id="progress"[^>]*max="4" value="1"/);
  assert.match(markup, /25%/);
});

test("unknown progress omits value and fabricated percentages", () => {
  for (const value of [undefined, NaN, Infinity, "50"]) {
    const markup = render("ProgressIndicator", { value });
    assert.match(markup, /In progress/);
    assert.doesNotMatch(markup, / value=|%|aria-valuenow/);
  }
});

test("progress clamps out-of-range values and safely handles invalid maxima", () => {
  assert.match(render("ProgressIndicator", { value: -5 }), /value="0"/);
  assert.match(render("ProgressIndicator", { value: 150 }), /value="100"/);
  for (const max of [0, -1, NaN, Infinity]) {
    assert.match(
      render("ProgressIndicator", { value: 50, max }),
      /max="100" value="50"/,
    );
  }
});

test("generated progress IDs are unique when multiple indicators render together", () => {
  const markup = renderToStaticMarkup(
    createElement(
      "div",
      null,
      createElement(components.ProgressIndicator, { label: "First" }),
      createElement(components.ProgressIndicator, { label: "Second" }),
    ),
  );
  const ids = [...markup.matchAll(/<progress id="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.equal(new Set(ids).size, 2);
  for (const id of ids) assert.ok(markup.includes(`for="${id}"`));
});

test("feedback sections are named by their headings and support correct nesting", () => {
  for (const name of ["EmptyState", "ErrorState"]) {
    const markup = render(name, { title: "Example heading", headingLevel: 3 });
    const id = markup.match(/aria-labelledby="([^"]+)"/)[1];
    assert.ok(markup.includes(`<h3 id="${id}">Example heading</h3>`));
    assert.match(markup, /<section/);
    assert.match(render(name, { headingLevel: 9 }), /<h2/);
    assert.doesNotMatch(markup, /<button|role="alert"/);
  }
});

test("recovery buttons require working callbacks and keep native button semantics", () => {
  for (const [name, handler, labelProp] of [
    ["EmptyState", "onAction", "actionLabel"],
    ["ErrorState", "onRetry", "retryLabel"],
  ]) {
    assert.doesNotMatch(render(name, { [handler]: true }), /<button/);
    const markup = render(name, {
      [handler]: () => {},
      [labelProp]: "Recover example",
    });
    assert.match(markup, /<button[^>]*type="button"/);
    assert.match(markup, /Recover example/);
  }
});

test("retrying blocks duplicate activation and exposes busy semantics", () => {
  const markup = render("ErrorState", { onRetry: () => {}, retrying: true });
  assert.match(markup, /disabled=""/);
  assert.match(markup, /aria-busy="true"/);
});

test("error announcement is opt-in and action is outside the live message", () => {
  const markup = render("ErrorState", { announce: true, onRetry: () => {} });
  assert.match(markup, /role="alert" aria-atomic="true"/);
  assert.match(markup, /<\/div><button/);
});

test("feedback renders long labels and descriptions as escaped text", () => {
  const text = "Long example label ".repeat(30) + "<script>";
  for (const name of ["EmptyState", "ErrorState"]) {
    const markup = render(name, { title: text, description: text });
    assert.match(markup, /&lt;script&gt;/);
    assert.doesNotMatch(markup, /<script>/);
  }
});

test("demo pages disclose simulation and provide content without nested public landmarks", () => {
  for (const name of ["LoadingDemoPage", "ErrorDemoPage"]) {
    const markup = render(name);
    assert.equal((markup.match(/<h1/g) || []).length, 1);
    assert.match(markup, /Phase 1 component demonstration/);
    assert.doesNotMatch(markup, /<main|<nav|<footer|href="#/);
  }
  const loading = render("LoadingDemoPage");
  for (const label of [
    "Start loading",
    "Advance 25%",
    "Complete",
    "Reset",
    "Static appearance examples",
  ]) {
    assert.ok(loading.includes(label));
  }
  const error = render("ErrorDemoPage");
  assert.match(error, /Simulate error/);
  assert.match(error, /Clear filters/);
});
