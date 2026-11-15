// Pass an existing Puppeteer-compatible module path and Chrome executable path.
// Uses ordinary mock reset/login flows; no app dependency or test-only route.
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { join } from "node:path";
const module = await import(pathToFileURL(process.argv[2]).href);
const browser = await (module.puppeteer ?? module.default).launch({
  headless: true,
  executablePath: process.argv[3],
});
const base = process.argv[4] ?? "http://127.0.0.1:5173";
const errors = [];
try {
  const page = await browser.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  async function spa(path) {
    await page.evaluate((path) => {
      history.pushState({}, "", path);
      dispatchEvent(new PopStateEvent("popstate"));
    }, path);
  }
  async function login(id, route) {
    await page.goto(`${base}/reset-password`, { waitUntil: "networkidle0" });
    const fields = await page.$$(".auth-fields input");
    for (const [i, value] of [
      `${id}@example.test`,
      "Dashboard123",
      "Dashboard123",
    ].entries())
      await fields[i].type(value);
    await page.click('.auth-fields button[type="submit"]');
    await page.waitForFunction(() =>
      document
        .querySelector('.auth-feedback[role="status"]')
        ?.textContent.includes("updated"),
    );
    await page.click('.auth-links a[href="/login"]');
    await page.waitForSelector('.auth-fields input[type="email"]');
    await page.type('.auth-fields input[type="email"]', `${id}@example.test`);
    await page.type('.auth-fields input[type="password"]', "Dashboard123");
    await page.click('.auth-fields button[type="submit"]');
    await page.waitForFunction(() => location.pathname === "/");
    await spa(route);
  }
  async function nav(label, admin = false) {
    const selector = admin
      ? ".ac-sidebar nav button"
      : ".sd-sidebar nav button";
    await page.$$eval(
      selector,
      (buttons, label) =>
        buttons.find((button) => button.textContent.includes(label)).click(),
      label,
    );
    await page.waitForFunction(
      (selector, label) =>
        [...document.querySelectorAll(selector)].some(
          (button) =>
            button.getAttribute("aria-current") === "page" &&
            button.textContent.includes(label),
        ),
      {},
      selector,
      label,
    );
  }
  async function scenario(value, admin = false) {
    await page.select(
      admin ? ".ac-footer select" : ".sd-demo-controls select",
      value,
    );
    await page.waitForFunction(
      () =>
        !document.querySelector(".sd-loading") &&
        !document.body.textContent.includes("Loading control center"),
    );
  }
  for (const [id, route, admin] of [
    ["student_001", "/student/dashboard", false],
    ["client_001", "/client/dashboard", false],
    ["admin_001", "/admin", true],
  ]) {
    await page.setViewport({ width: 1440, height: 1100 });
    await login(id, `${route}?keep=retained`);
    await page.waitForSelector(admin ? ".ac-stats" : ".sd-stats");
    const firstLabel =
      id === "student_001" ? "My Applications" : admin ? "Users" : "My Jobs";
    await nav(firstLabel, admin);
    await page.waitForFunction(() => location.search.includes("section="));
    assert.ok(new URL(page.url()).searchParams.has("keep"));
    await page.goBack();
    await page.waitForSelector(admin ? ".ac-stats" : ".sd-stats");
    await page.goForward();
    await page.waitForFunction(() => location.search.includes("section="));
    if (admin) {
      await page.type(".ac-filters input", "does-not-match");
      await nav("Committees", true);
      await nav("Users", true);
      assert.equal(await page.$eval(".ac-filters input", (el) => el.value), "");
    } else {
      await nav("Settings");
      await page.click('.sd-summary input[type="checkbox"]');
      await nav("Overview");
      await nav("Settings");
      assert.equal(
        await page.$eval(
          '.sd-summary input[type="checkbox"]',
          (el) => el.checked,
        ),
        false,
      );
      await nav("Overview");
      const opener = await page.$('button[aria-label="View notifications"]');
      await opener.click();
      await page.waitForSelector("dialog[open]");
      await page.keyboard.press("Escape");
      await page.waitForFunction(() => !document.querySelector("dialog[open]"));
      assert.equal(
        await page.evaluate((el) => document.activeElement === el, opener),
        true,
      );
    }
    await nav("Overview", admin);
    for (const value of ["empty", "error", "sample"]) {
      await scenario(value, admin);
      if (value === "error") assert.ok(await page.$('[role="alert"]'));
    }
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewport({ width, height: 1000 });
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${id}: overflow at ${width}`,
      );
      if (width === 1440 || width === 390)
        await page.screenshot({
          path: join(tmpdir(), `miu-m3-${id}-${width}.png`),
          fullPage: true,
        });
      if (!admin && width === 390) {
        // The existing application shell hides this menu and keeps contextual
        // navigation visible. Standalone rendering retains the collapsible menu.
        if (
          await page.$eval(
            ".sd-menu",
            (el) =>
              !el.closest(".application-shell") &&
              getComputedStyle(el).display !== "none",
          )
        ) {
          await page.click(".sd-menu");
          await page.waitForFunction(
            () =>
              document
                .querySelector(".sd-menu")
                .getAttribute("aria-expanded") === "true",
          );
          assert.equal(
            await page.$eval(".sd-menu", (el) =>
              el.getAttribute("aria-expanded"),
            ),
            "true",
          );
          await nav("Settings");
          assert.equal(
            await page.$eval(".sd-menu", (el) =>
              el.getAttribute("aria-expanded"),
            ),
            "false",
          );
        } else
          assert.equal(
            await page.$eval(
              ".sd-navigation",
              (el) => getComputedStyle(el).display,
            ),
            "block",
          );
      }
    }
    await page.evaluate(() =>
      document.documentElement.setAttribute("data-theme", "dark"),
    );
    assert.ok(
      await page.evaluate(
        () =>
          getComputedStyle(document.querySelector(".ac-main, .sd-main"))
            .color !== "rgb(53, 33, 44)",
      ),
    );
    await page.evaluate(() => {
      document.documentElement.dir = "rtl";
    });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      `${id}: RTL overflow`,
    );
    console.log(
      `${id}: navigation/history/state/dialogs/scenarios and five widths passed`,
    );
  }
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
