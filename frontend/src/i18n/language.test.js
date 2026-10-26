import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { en, ar } from "./messages.js";
import { translate } from "./translate.js";
import { readLanguage, LANGUAGE_KEY } from "./locale.js";
import { formatCount } from "./formatCount.js";
import { formatEGP } from "../utils/formatEGP.js";
import { formatDate } from "../utils/formatDate.js";
import { searchHelpContent } from "../data/fixtures/help.js";

test("pre-paint initialization uses only the language preference and leaves the theme light", () => {
  const source = readFileSync(
    new URL("../../public/language-init.js", import.meta.url),
    "utf8",
  );
  for (const saved of [null, "en", "ar", "invalid"]) {
    const root = { dataset: { theme: "light" } };
    const requests = [];
    vm.runInNewContext(source, {
      document: { documentElement: root },
      localStorage: {
        getItem(key) {
          requests.push(key);
          return saved;
        },
      },
    });
    assert.equal(root.lang, saved === "ar" ? "ar" : "en");
    assert.equal(root.dir, saved === "ar" ? "rtl" : "ltr");
    assert.equal(root.dataset.theme, "light");
    assert.deepEqual(requests, [LANGUAGE_KEY]);
  }
  const root = {};
  vm.runInNewContext(source, {
    document: { documentElement: root },
    localStorage: {
      getItem() {
        throw Error("blocked");
      },
    },
  });
  assert.equal(root.lang, "en");
  assert.equal(root.dir, "ltr");
  assert.equal(
    readLanguage({
      getItem() {
        throw Error("blocked");
      },
    }),
    "en",
  );
});

test("dictionary parity, placeholders and every literal UI lookup are covered", () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(ar).sort());
  for (const key of Object.keys(en)) {
    assert.equal(en[key], key);
    assert.ok(typeof ar[key] === "string" && ar[key].trim(), key);
    // Some legacy English star/plural suffix interpolation is deliberately
    // omitted in Arabic; named record placeholders must always be preserved.
    for (const placeholder of key.match(/\{(?:title|name|rating|count)\}/g) ??
      [])
      assert.ok(ar[key].includes(placeholder), key);
  }
  const root = fileURLToPath(new URL("../", import.meta.url));
  function walk(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory()
        ? walk(path.join(dir, entry.name))
        : [path.join(dir, entry.name)],
    );
  }
  const missing = new Set();
  for (const file of walk(root).filter(
    (file) => file.endsWith(".jsx") && !file.includes(".test."),
  )) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/\bt\(\s*("(?:\\.|[^"\\])*")/g)) {
      const key = JSON.parse(match[1]);
      if (/[a-zA-Z]{2}/.test(key) && !Object.hasOwn(ar, key)) missing.add(key);
    }
  }
  assert.deepEqual([...missing], []);
});

test("Arabic interpolation, all six plural categories, currency and dates preserve values", () => {
  const name = "Search <script>";
  assert.equal(translate("ar", "Save {title}", { title: name }), `حفظ ${name}`);
  assert.equal(
    translate("en", "Save {title}", { title: name }),
    `Save ${name}`,
  );
  for (const [value, expected] of [
    [0, "لا توجد مشاريع"],
    [1, "مشروع واحد"],
    [2, "مشروعان"],
    [3, "٣ مشاريع"],
    [11, "١١ مشروعًا"],
    [100, "١٠٠ مشروع"],
  ])
    assert.equal(formatCount("ar", "project", value), expected);
  assert.equal(formatCount("en", "service", 1), "1 service");
  assert.equal(formatCount("en", "service", 2), "2 services");
  assert.equal(
    formatEGP(1234.5, "ar-EG"),
    new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(1234.5),
  );
  assert.match(formatDate("2026-10-26", "ar-EG"), /٢٠٢٦/);
  assert.throws(() => formatEGP(NaN, "ar-EG"), TypeError);
  assert.throws(() => formatDate("2026-02-31", "ar-EG"), RangeError);
});

test("Arabic help search finds translated content without changing the stored articles", () => {
  const original = searchHelpContent("");
  const result = searchHelpContent("الجنيه المصري", (key) =>
    translate("ar", key),
  );
  assert.ok(
    result.articles.some((article) => article.slug === "egp-payments-overview"),
  );
  assert.equal(
    original.articles.find(
      (article) => article.slug === "egp-payments-overview",
    ).title,
    "Payments are in EGP only",
  );
});

let vite;
before(async () => {
  vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
});
after(async () => {
  await vite?.close();
});

test("all registered routes render in both languages with one language control and unchanged access metadata", async () => {
  const load = (file) => vite.ssrLoadModule(`/src/${file}`);
  const [
    { default: Router },
    { default: Controls },
    { routeConfig },
    { LanguageContext },
    { AuthContext },
  ] = await Promise.all([
    load("app/router.jsx"),
    load("theme/StandaloneThemeControl.jsx"),
    load("app/routeConfig.js"),
    load("i18n/LanguageContext.js"),
    load("contexts/AuthContext.js"),
  ]);
  const beforeRoutes = JSON.stringify(routeConfig);
  for (const route of routeConfig) {
    assert.ok(ar[route.title], `document title: ${route.title}`);
    const url = route.path
      .replace(":studentId", "student_001")
      .replace(":clientId", "client_001")
      .replace(/:[\w]+/g, "language-missing-record")
      .replace("*", "/language-not-found");
    const role = route.roles?.[0] ?? "student";
    for (const language of ["en", "ar"]) {
      const html = renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: [url] },
          React.createElement(
            LanguageContext.Provider,
            {
              value: {
                language,
                setLanguage() {},
                t: (key, values) => translate(language, key, values),
              },
            },
            React.createElement(
              AuthContext.Provider,
              {
                value: {
                  session: {
                    status: "authenticated",
                    user: {
                      id: role === "client" ? "client_001" : "student_001",
                      displayName: "Language test",
                      role,
                      accountStatus: "active",
                      verificationStatus: "approved",
                    },
                  },
                  logout() {},
                },
              },
              React.createElement(Controls),
              React.createElement(Router),
            ),
          ),
        ),
      );
      assert.equal(
        (html.match(/class="language-control"/g) ?? []).length,
        1,
        `${url}: ${language}`,
      );
      assert.ok(html.includes(language === "ar" ? "اللغة" : "Language"));
    }
  }
  assert.equal(JSON.stringify(routeConfig), beforeRoutes);
});

test("Arabic presentation escapes and preserves user messages and project titles", async () => {
  const [{ ChatbotMessages }, { default: ProjectCard }, { LanguageContext }] =
    await Promise.all([
      vite.ssrLoadModule("/src/features/chatbot/ChatbotWidget.jsx"),
      vite.ssrLoadModule("/src/features/projects/ProjectCard.jsx"),
      vite.ssrLoadModule("/src/i18n/LanguageContext.js"),
    ]);
  const value = {
    language: "ar",
    setLanguage() {},
    t: (key, values) => translate("ar", key, values),
  };
  const messages = renderToStaticMarkup(
    React.createElement(
      LanguageContext.Provider,
      { value },
      React.createElement(ChatbotMessages, {
        messages: [{ id: "user-1", author: "user", text: "Search <script>" }],
      }),
    ),
  );
  assert.ok(messages.includes("Search &lt;script&gt;"));
  const card = renderToStaticMarkup(
    React.createElement(
      LanguageContext.Provider,
      { value },
      React.createElement(ProjectCard, {
        project: {
          id: "user-project",
          title: "Search",
          description: "Save changes <script>",
          budgetEGP: 1000,
          deadline: "2026-12-01",
          createdAt: "2026-10-20",
          requiredSkillIds: [],
          categoryId: "category_001",
          clientId: "client_001",
          status: "open",
        },
        onToggleSaved() {},
        onOpenProject() {},
      }),
    ),
  );
  assert.ok(card.includes(">Search</h3>"));
  assert.ok(card.includes("Save changes &lt;script&gt;"));
});
