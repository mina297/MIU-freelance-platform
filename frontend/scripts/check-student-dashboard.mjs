// Run with a Puppeteer module URL/path as argv[2], and an optional Chrome path.
// Keeps browser tooling outside the application dependencies.
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const browserModule = await import(pathToFileURL(process.argv[2]).href);
const puppeteer = browserModule.puppeteer ?? browserModule.default;
const browser = await puppeteer.launch({
  headless: true,
  executablePath: process.argv[3],
});
const errors = [];
try {
  const page = await browser.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewport({ width: 1440, height: 1800 });
  await page.goto("http://localhost:5173/student/dashboard", {
    waitUntil: "networkidle0",
  });
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector(".sd-table-row");
  const inspectSwitcher = async () => {
    assert.equal(
      await page.$eval(
        ".dev-dashboard-navigation",
        (node) => getComputedStyle(node).position,
      ),
      "fixed",
    );
    assert.equal(
      await page.$eval(".student-dashboard", (node) => node.offsetTop),
      0,
    );
    const badge = await page.$eval(
      ".dev-dashboard-switcher summary",
      (node) => {
        const rect = node.getBoundingClientRect();
        return {
          label: node.textContent.trim(),
          height: rect.height,
          width: rect.width,
          right: innerWidth - rect.right,
          bottom: innerHeight - rect.bottom,
        };
      },
    );
    assert.equal(badge.label, "Switch dashboard");
    assert.ok(badge.height <= 34 && badge.width <= 200);
    assert.equal(badge.right, 16);
    assert.equal(badge.bottom, 16);
  };
  await inspectSwitcher();
  await page.click(".dev-dashboard-switcher summary");
  await page.keyboard.press("Escape");
  assert.equal(
    await page.$eval(".dev-dashboard-switcher", (node) => node.open),
    false,
  );
  assert.equal(
    await page.$eval(
      ".dev-dashboard-switcher summary",
      (node) => document.activeElement === node,
    ),
    true,
  );
  await page.keyboard.press("Enter");
  await page.click("h1");
  assert.equal(
    await page.$eval(".dev-dashboard-switcher", (node) => node.open),
    false,
  );
  await page.goto("http://127.0.0.1:5173/projects", {
    waitUntil: "networkidle0",
  });
  assert.equal(await page.$(".demo-toolbar"), null);
  assert.equal(
    await page.$$eval(".dev-dashboard-switcher li", (nodes) => nodes.length),
    8,
  );
  assert.equal(
    await page.$$eval(
      '.dev-dashboard-switcher [aria-disabled="true"]',
      (nodes) => nodes.length,
    ),
    7,
  );
  await page.click(".dev-dashboard-switcher summary");
  await page.click('.dev-dashboard-switcher a[href="/student/dashboard"]');
  await page.waitForSelector(".sd-table-row");
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.$$eval(".sd-table-row", (nodes) => nodes.length), 6);
  assert.equal(await page.$$eval(".sd-job", (nodes) => nodes.length), 2);
  assert.equal(
    await page.$$eval(
      ".student-dashboard img",
      (nodes) =>
        nodes.filter((node) => !node.complete || node.naturalWidth === 0)
          .length,
    ),
    0,
  );
  await mkdir("artifacts/student-dashboard", { recursive: true });
  await page.screenshot({
    path: "artifacts/student-dashboard/desktop.png",
    fullPage: true,
  });
  await page.click(".sd-more");
  assert.equal(await page.$eval("dialog", (node) => node.open), true);
  await page.keyboard.press("Escape");
  await page.waitForSelector("dialog", { hidden: true });
  assert.equal(
    await page.$eval(".sd-more", (node) => document.activeElement === node),
    true,
  );
  await page.click(".sd-navigation button:nth-child(3)");
  await page.waitForSelector(".sd-table-row", { hidden: true });
  assert.equal(await page.$$(".sd-table-row").then((nodes) => nodes.length), 0);
  await page.goBack();
  await page.waitForSelector(".sd-table-row");
  await page.click(".sd-demo-controls summary");
  await page.select(".sd-demo-controls select", "empty");
  await page.waitForSelector(".sd-empty");
  assert.equal(await page.$$eval(".sd-table-row", (nodes) => nodes.length), 0);
  await page.select(".sd-demo-controls select", "error");
  await page.waitForSelector('[role="alert"]');
  await page.click('[role="alert"] button');
  await page.waitForSelector(".sd-table-row");
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewport({ width, height: 900 });
    await inspectSwitcher();
    await page.click(".dev-dashboard-switcher summary");
    assert.equal(
      await page.$eval(".dev-dashboard-switcher ul", (node) => {
        const rect = node.getBoundingClientRect();
        return rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0;
      }),
      true,
    );
    await page.keyboard.press("Escape");
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
      `No overflow at ${width}px`,
    );
    assert.equal(
      await page.$$eval(
        ".student-dashboard img",
        (nodes) =>
          nodes.filter(
            (node) =>
              node.getBoundingClientRect().width === 0 &&
              node.checkVisibility(),
          ).length,
      ),
      0,
    );
    if (width === 390) {
      await page.screenshot({
        path: "artifacts/student-dashboard/mobile.png",
        fullPage: true,
      });
      await page.click(".sd-menu");
      assert.equal(
        await page.$eval(".sd-menu", (node) =>
          node.getAttribute("aria-expanded"),
        ),
        "true",
      );
      await page.click(".sd-navigation button:nth-child(6)");
      await page.waitForSelector(".sd-summary input");
      await page.click(".sd-summary input");
      await page.waitForFunction(() =>
        document
          .querySelector('[role="status"]')
          ?.textContent.includes("disabled"),
      );
      assert.match(
        await page.$eval('[role="status"]', (node) => node.textContent),
        /disabled/,
      );
      await page.goBack();
    }
  }
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector(".sd-table-row");
  assert.equal(await page.$(".demo-toolbar"), null);
  await page.click(".sd-welcome a");
  await page.waitForFunction(() => location.pathname === "/projects");
  assert.deepEqual(errors, []);
  console.log(
    "PASS: dashboard switcher, seven disabled dashboards, removed demo bar, direct route, 6 applications, 2 jobs, assets, dialogs/focus, history, states/retry, settings, navigation, and no overflow at 1440/1024/768/390/320px.",
  );
} finally {
  await browser.close();
}
