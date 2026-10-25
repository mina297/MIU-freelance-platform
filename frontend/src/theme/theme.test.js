import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { readFileSync } from "node:fs";

test("every registered route has one accessible theme control in light and dark presentations", async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  try {
    // Inspect Vite's client graph, not just source colors: a missing stylesheet
    // made SSR checks pass while the browser displayed an incomplete theme.
    const clientProvider = await vite.transformRequest("/src/theme/ThemeProvider.jsx");
    assert.match(clientProvider.code, /theme\/theme\.css/);
    assert.match(clientProvider.code, /styles\/premium-theme\.css/);
    const clientStyles = await vite.transformRequest("/src/theme/theme.css");
    assert.match(clientStyles.code, /--theme-canvas/);
    assert.match(clientStyles.code, /\.theme-toggle-track/);
    const { default: AppRouter } = await vite.ssrLoadModule(
      "/src/app/router.jsx",
    );
    const { default: StandaloneThemeControl } = await vite.ssrLoadModule(
      "/src/theme/StandaloneThemeControl.jsx",
    );
    const { ThemeContext } = await vite.ssrLoadModule(
      "/src/theme/ThemeContext.js",
    );
    const { AuthContext } = await vite.ssrLoadModule(
      "/src/contexts/AuthContext.js",
    );
    const { routeConfig } = await vite.ssrLoadModule("/src/app/routeConfig.js");
    const { default: ThemeProvider } = await vite.ssrLoadModule(
      "/src/theme/ThemeProvider.jsx",
    );
    const { default: ThemeToggle } = await vite.ssrLoadModule(
      "/src/theme/ThemeToggle.jsx",
    );
    const render = (path, role, theme) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: [path] },
          React.createElement(
            ThemeContext.Provider,
            { value: { theme, toggleTheme() {} } },
            React.createElement(
              AuthContext.Provider,
              {
                value: {
                  session: {
                    status: "authenticated",
                    user: {
                      id: role === "client" ? "client_001" : "student_001",
                      displayName: "Theme review account",
                      role,
                      accountStatus: "active",
                      verificationStatus: "approved",
                    },
                  },
                  logout() {},
                },
              },
              React.createElement(AppRouter),
              React.createElement(StandaloneThemeControl),
            ),
          ),
        ),
      );
    for (const route of routeConfig) {
      const path = route.path
        .replace(":studentId", "student_001")
        .replace(":clientId", "client_001")
        .replace(/:[\w]+/g, "theme-review-missing-record")
        .replace("*", "/theme-review-not-found");
      const role = route.roles?.[0] ?? "student";
      for (const theme of ["light", "dark"]) {
        const html = render(path, role, theme);
        assert.equal(
          (html.match(/aria-label="Dark mode"/g) ?? []).length,
          1,
          `${path} ${theme}: one control`,
        );
        assert.match(
          html,
          new RegExp(
            `aria-label="Dark mode" aria-pressed="${theme === "dark"}"`,
          ),
          path,
        );
      }
    }
    // A new provider always resets to light, even inside an existing dark context.
    const initial = renderToStaticMarkup(
      React.createElement(
        ThemeContext.Provider,
        { value: { theme: "dark" } },
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(ThemeToggle),
        ),
      ),
    );
    assert.match(initial, /aria-pressed="false"/);
    let activations = 0;
    function CaptureToggle() {
      const button = ThemeToggle({});
      button.props.onClick();
      return button;
    }
    renderToStaticMarkup(
      React.createElement(
        ThemeContext.Provider,
        { value: { theme: "dark", toggleTheme: () => activations++ } },
        React.createElement(CaptureToggle),
      ),
    );
    assert.equal(activations, 1, "toggle delegates to the shared provider");
  } finally {
    await vite.close();
  }
});

function luminance(hex) {
  return hex
    .match(/../g)
    .map((pair) => parseInt(pair, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
test("global dark palette keeps body, supporting, semantic text and focus readable", () => {
  const css = readFileSync(new URL("./theme.css", import.meta.url), "utf8");
  const token = (name) =>
    css.match(new RegExp(`--theme-${name}:\\s*#([a-f0-9]{6})`))[1];
  for (const bg of ["canvas", "surface", "subtle-surface", "accent-surface"]) {
    for (const text of ["text", "muted-text", "accent"])
      assert.ok(contrast(token(text), token(bg)) >= 4.5, `${text} on ${bg}`);
    assert.ok(contrast(token("focus"), token(bg)) >= 3);
    assert.ok(
      contrast(token("border"), token(bg)) >= 3,
      `control border on ${bg}`,
    );
  }
  for (const semantic of ["success", "info", "warning", "danger"])
    assert.ok(
      contrast(token(`${semantic}-text`), token(`${semantic}-surface`)) >= 4.5,
      semantic,
    );
});
