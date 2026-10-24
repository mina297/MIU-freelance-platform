// Pass a Puppeteer-compatible module path and optional Chrome executable.
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const module = await import(pathToFileURL(process.argv[2]).href);
const browser = await (module.puppeteer ?? module.default).launch({
  headless: true,
  executablePath: process.argv[3],
});
const errors = [];
try {
  const page = await browser.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewport({ width: 1440, height: 1800 });
  await page.goto("http://localhost:5173/client/dashboard", {
    waitUntil: "networkidle0",
  });
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector(".cd-job-row");
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
      "Dashboard starts at the top without a bar or spacer",
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
  await page.click(".dev-dashboard-switcher summary");
  await page.click('.dev-dashboard-switcher a[href="/client/dashboard"]');
  await page.waitForSelector(".cd-job-row");
  await page.evaluate(() => document.fonts.ready);
  assert.equal(
    await page.$$(".sd-supplement .sd-summary").then((nodes) => nodes.length),
    2,
  );
  assert.equal(await page.$$eval(".cd-job-row", (rows) => rows.length), 4);
  assert.deepEqual(
    await page.$$eval(".sd-stat > strong", (nodes) =>
      nodes.map((node) => node.textContent),
    ),
    ["2", "3", "1", "18"],
  );
  assert.equal(
    await page.$$eval(
      ".dev-dashboard-switcher [aria-disabled]",
      (nodes) => nodes.length,
    ),
    6,
  );
  await mkdir("artifacts/client-dashboard", { recursive: true });
  await page.screenshot({
    path: "artifacts/client-dashboard/desktop.png",
    fullPage: true,
  });
  // Every visible static asset must be loaded and retain its intended geometry.
  const inspectAssets = async () => {
    await page.waitForFunction(() =>
      [...document.images].every((img) => img.complete && img.naturalWidth > 0),
    );
    const assets = await page.$$eval(".client-dashboard img", (nodes) =>
      nodes
        .filter((node) => node.checkVisibility())
        .map((node) => ({
          source: node.src,
          fit: getComputedStyle(node).objectFit,
          width: node.getBoundingClientRect().width,
          height: node.getBoundingClientRect().height,
          naturalWidth: node.naturalWidth,
          naturalHeight: node.naturalHeight,
        })),
    );
    for (const item of assets) {
      assert.ok(item.width > 0 && item.height > 0, item.source);
      assert.ok(
        ["contain", "cover"].includes(item.fit) ||
          Math.abs(
            item.width / item.height - item.naturalWidth / item.naturalHeight,
          ) < 0.03,
        `Asset proportions: ${item.source}`,
      );
      if (item.source.includes(".svg"))
        assert.equal(
          item.width,
          item.naturalWidth,
          `SVG root size: ${item.source}`,
        );
    }
    return assets;
  };
  await inspectAssets();
  await page.click(".cd-review-reminder button");
  assert.equal(await page.$eval("dialog", (node) => node.open), true);
  await inspectAssets();
  await page.type(
    "#review-comment",
    "Nour understood our brief, communicated clearly, and delivered a polished campaign kit. The editable files were organized and easy for our team to use.",
  );
  await page.screenshot({
    path: "artifacts/client-dashboard/review-desktop.png",
    fullPage: true,
  });
  await page.keyboard.press("Escape");
  await page.waitForSelector("dialog", { hidden: true });
  assert.equal(
    await page.$eval(
      ".cd-review-reminder button",
      (node) => document.activeElement === node,
    ),
    true,
  );
  await page.click(".cd-review-reminder button");
  await page.click("dialog form button:last-child");
  assert.match(
    await page.$eval("#review-error", (node) => node.textContent),
    /enter a comment/,
  );
  await page.click('input[name="rating"][value="4"]');
  await page.type(
    "#review-comment",
    "Great communication and thoughtful design.",
  );
  await page.click("dialog form button:last-child");
  await page.waitForSelector("dialog", { hidden: true });
  assert.equal(
    await page.$eval(".cd-review-reminder button", (node) => node.disabled),
    true,
  );
  assert.match(
    await page.$eval(".cd-announcement", (node) => node.textContent),
    /not been published/,
  );
  await page.click(".cd-approval button");
  await page.click("dialog .cd-actions button:first-child");
  assert.equal(await page.$$(".cd-active").then((nodes) => nodes.length), 1);
  await page.click(".cd-approval button");
  await page.click("dialog .cd-actions button:last-child");
  assert.deepEqual(
    await page.$$eval(".sd-stat > strong", (nodes) =>
      nodes.map((node) => node.textContent),
    ),
    ["2", "3", "0", "19"],
  );
  assert.equal(await page.$$(".cd-active").then((nodes) => nodes.length), 0);
  assert.equal(
    await page.$$(".cd-review-reminder").then((nodes) => nodes.length),
    2,
  );
  await page.click(".sd-navigation button:nth-child(2)");
  await page.waitForSelector(".cd-filters select");
  await page.select(".cd-filters select", "Open");
  assert.equal(await page.$$(".cd-job-row").then((nodes) => nodes.length), 2);
  await page.type(".cd-filters input", "no match");
  assert.equal(await page.$$(".cd-job-row").then((nodes) => nodes.length), 0);
  await page.click(".cd-filters button");
  assert.equal(await page.$$(".cd-job-row").then((nodes) => nodes.length), 4);
  await page.goBack();
  await page.waitForSelector(".sd-stats");
  await page.click(".sd-demo-controls summary");
  await page.select(".sd-demo-controls select", "empty");
  await page.waitForSelector(".sd-empty");
  assert.deepEqual(
    await page.$$eval(".sd-stat > strong", (nodes) =>
      nodes.map((node) => node.textContent),
    ),
    ["0", "0", "0", "0"],
  );
  await page.select(".sd-demo-controls select", "error");
  await page.waitForSelector('section[role="alert"]');
  await page.click('section[role="alert"] button');
  await page.waitForSelector(".cd-job-row");
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector(".cd-job-row");
  assert.equal(
    await page.$eval(".cd-review-reminder button", (node) => node.disabled),
    false,
  );
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
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `No overflow at ${width}px`,
    );
    await inspectAssets();
    if (width === 390) {
      await page.screenshot({
        path: "artifacts/client-dashboard/mobile.png",
        fullPage: true,
      });
      await page.click(".sd-menu");
      assert.equal(
        await page.$eval(".sd-menu", (node) =>
          node.getAttribute("aria-expanded"),
        ),
        "true",
      );
      await page.screenshot({
        path: "artifacts/client-dashboard/navigation-mobile.png",
        fullPage: true,
      });
      await page.click(".sd-navigation button:last-child");
      await page.click(".sd-summary input");
      assert.match(
        await page.$eval(
          '.sd-summary [role="status"]',
          (node) => node.textContent,
        ),
        /disabled/,
      );
      await page.goBack();
      await page.waitForSelector(".cd-job-row");
      await page.click(".cd-review-reminder button");
      await page.type("#review-comment", "Thoughtful, clear work.");
      await page.screenshot({
        path: "artifacts/client-dashboard/review-mobile.png",
        fullPage: true,
      });
      assert.equal(
        await page.$eval(
          "dialog",
          (node) => node.scrollWidth <= node.clientWidth,
        ),
        true,
      );
      await page.keyboard.press("Escape");
    }
  }
  await page.setViewport({ width: 1440, height: 900 });
  await page.click(".dev-dashboard-switcher summary");
  await page.click('.dev-dashboard-switcher a[href="/student/dashboard"]');
  await page.waitForSelector(".sd-table-row");
  assert.equal(await page.$$(".sd-table-row").then((nodes) => nodes.length), 6);
  await page.goto("http://127.0.0.1:5173/client/dashboard?section=applicants", {
    waitUntil: "networkidle0",
  });
  assert.equal(
    await page.$$(".cd-applicant-job").then((nodes) => nodes.length),
    2,
  );
  await page.click(".cd-applicant-job button");
  assert.match(
    await page.$eval("dialog", (node) => node.textContent),
    /await the marketplace module/,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: switcher/routes, client metrics, filters/history, review validation/rating/submission/duplicate prevention, completion/cancel, loading/empty/error/retry, reset, settings, student regression, assets, dialogs/Escape/focus, desktop/mobile screenshots and no overflow at 1440/1024/768/390/320px.",
  );
} finally {
  await browser.close();
}
