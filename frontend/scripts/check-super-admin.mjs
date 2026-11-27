import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { join } from "node:path";
const { puppeteer } = await import(pathToFileURL(process.argv[2]).href);
const baseUrl = process.argv[4] ?? "http://localhost:5173";
const browser = await puppeteer.launch({
  headless: true,
  executablePath: process.argv[3],
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const assertNoCommitteeProvisioning = async () => {
    assert.equal(await page.$(".ac-heading button"), null);
    assert.doesNotMatch(
      await page.$eval("body", (node) => node.textContent),
      /Create committee account/i,
    );
  };
  const selectSection = async (index) => {
    const selector = `.ac-sidebar nav button:nth-child(${index})`;
    await page.click(selector);
    await page.waitForFunction(
      (target) =>
        document.querySelector(target)?.getAttribute("aria-current") === "page",
      {},
      selector,
    );
    await assertNoCommitteeProvisioning();
  };
  await page.setViewport({ width: 1440, height: 1100 });
  await page.goto(`${baseUrl}/SuperAdmin`, { waitUntil: "networkidle0" });
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector(".ac-stats");
  await assertNoCommitteeProvisioning();
  const inspectDashboardShell = async () => {
    assert.doesNotMatch(
      await page.$eval("body", (node) => node.textContent),
      /Development:\s*Switch dashboard/,
    );
    assert.equal(await page.$(".dev-dashboard-navigation"), null);
    assert.equal(
      await page.$eval(".admin-center", (node) => node.offsetTop),
      0,
      "No development bar, empty header or top spacer",
    );
    assert.equal(await page.$$(".ac-topbar").then((nodes) => nodes.length), 1);
    assert.equal(await page.$('[aria-label="Demo session controls"]'), null);
  };
  await inspectDashboardShell();
  await page.click(".ac-header-icon");
  await page.waitForSelector(".ac-notifications-popover");
  await page.click(".ac-text-button");
  await page.click(".ac-profile-button");
  await page.waitForSelector(".ac-profile-popover");
  await page.click(".ac-profile-popover button");
  await page.type(".ac-global-search input", "Salma");
  await page.waitForSelector(".ac-search-results button");
  await page.click(".ac-search-results button");
  await page.waitForFunction(
    () => document.querySelectorAll(".ac-user-table tbody tr").length === 1,
  );
  await selectSection(1);
  await selectSection(3);
  await page.click(".ac-committee button");
  await page.waitForSelector("dialog.ac-dialog");
  assert.match(
    await page.$eval("dialog.ac-dialog", (node) => node.textContent),
    /open cases in this queue/i,
  );
  await page.click('dialog.ac-dialog button[aria-label="Close dialog"]');
  await page.waitForSelector("dialog.ac-dialog", { hidden: true });
  await selectSection(1);
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewport({ width, height: 1000 });
    await inspectDashboardShell();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    if (width === 1440 || width === 390)
      await page.screenshot({
        path: join(tmpdir(), `miu-super-admin-direct-${width}.png`),
        fullPage: true,
      });
  }
  await selectSection(6);
  assert.equal(await page.$(".ac-heading"), null);
  assert.doesNotMatch(
    await page.$eval("#admin-content", (node) => node.textContent),
    /\bDemo\b|MIU FREELANCE · GOVERNANCE|Clarity across the platform/i,
  );
  await selectSection(1);
  await selectSection(7);
  await page.select(".ac-table-wrap tbody select", "paused");
  await page.type("dialog textarea", "Listing reviewed for this preview.");
  await page.click("dialog .ac-primary");
  await page.waitForSelector("dialog", { hidden: true });
  assert.match(
    await page.$eval(".ac-table-wrap tbody tr", (row) => row.textContent),
    /Paused/,
  );
  await selectSection(8);
  await page.type('input[name="commissionPercent"]', "7.5");
  await page.type('input[name="minProjectBudgetEGP"]', "100");
  await page.type('input[name="maxProjectBudgetEGP"]', "50");
  await page.click('input[name="maintenanceMode"]');
  await page.type(
    '.ac-settings-form textarea[name="settingsReason"]',
    "Reviewed local preview settings.",
  );
  await page.click('.ac-settings-form button[type="submit"]');
  await page.waitForSelector(".ac-form-error");
  assert.match(
    await page.$eval(".ac-form-error", (node) => node.textContent),
    /maximum at least the minimum/i,
  );
  await page.click('input[name="maxProjectBudgetEGP"]');
  await page.keyboard.press("Control+A");
  await page.type('input[name="maxProjectBudgetEGP"]', "200");
  await page.click('.ac-settings-form button[type="submit"]');
  await page.waitForFunction(() =>
    document
      .querySelector(".ac-notice")
      ?.textContent.includes("Platform settings updated"),
  );
  await selectSection(9);
  assert.match(
    await page.$eval(".ac-table-wrap tbody", (node) => node.textContent),
    /Platform settings|Updated platform settings/,
  );
  await selectSection(1);
  await page.setViewport({ width: 1440, height: 1100 });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle0" });
  await page.select("#demo-account", "admin_001");
  await page.evaluate(() =>
    [...document.querySelectorAll("button")]
      .find((b) => b.textContent === "Start demo session")
      .click(),
  );
  await page.click('a[href="/admin"]');
  await page.waitForSelector(".ac-stats");
  assert.equal(await page.$$(".ac-stat").then((r) => r.length), 4);
  await page.screenshot({
    path: join(tmpdir(), "miu-admin-desktop.png"),
    fullPage: true,
  });
  await page.click(".ac-table-wrap button");
  await page.select("dialog select", "Rejected");
  await page.type("dialog textarea", "Fictional evidence reviewed.");
  await page.click("dialog .ac-primary");
  await page.waitForSelector("dialog", { hidden: true });
  assert.equal(
    await page.$$(".ac-table-wrap tbody tr").then((r) => r.length),
    4,
  );
  await selectSection(3);
  await selectSection(2);
  await page.waitForSelector(".ac-filters input");
  await page.type(".ac-filters input", "Salma");
  assert.equal(
    await page.$$(".ac-table-wrap tbody tr").then((r) => r.length),
    1,
  );
  const roleSelect = '.ac-user-table select[aria-label^="Role for"]';
  const actionSelect =
    '.ac-user-table select[aria-label^="Status and actions for"]';
  await page.select(roleSelect, "verification_committee");
  assert.equal(
    await page.$eval(roleSelect, (select) => select.value),
    "verification_committee",
  );
  await page.select(actionSelect, "In Progress");
  assert.equal(
    await page.$eval(actionSelect, (select) => select.value),
    "In Progress",
  );
  await page.select(actionSelect, "suspend");
  await page.type("dialog textarea", "Account review.");
  await page.click("dialog .ac-primary");
  assert.equal(
    await page.$eval(actionSelect, (select) => select.value),
    "restore",
  );
  await selectSection(4);
  await page.click(".ac-table-wrap button");
  await page.type("dialog textarea", "Scoped review access test.");
  await page.click("dialog .ac-primary");
  assert.equal(
    await page.$eval(".ac-table-wrap button", (e) =>
      e.getAttribute("aria-pressed"),
    ),
    "false",
  );
  await selectSection(10);
  assert.equal(
    await page.$$(".ac-table-wrap tbody tr").then((r) => r.length),
    5,
  );
  await selectSection(1);
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewport({ width, height: 1000 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `Overflow at ${width}`,
    );
    if (width === 390)
      await page.screenshot({
        path: join(tmpdir(), "miu-admin-mobile.png"),
        fullPage: true,
      });
  }
  await page.click(".ac-footer summary");
  await page.select(".ac-footer select", "empty");
  await page.waitForSelector(".ac-empty");
  assert.equal(
    await page.$$(".ac-table-wrap tbody tr").then((r) => r.length),
    0,
  );
  await page.select(".ac-footer select", "error");
  await page.waitForSelector('div[role="alert"]');
  await page.click('div[role="alert"] button');
  await page.waitForSelector(".ac-stats");
  await page.setViewport({ width: 1440, height: 1000 });
  for (let index = 0; index < 5; index++) {
    await selectSection(3);
    await page.click(`.ac-padded .ac-committee:nth-child(${index + 1}) button`);
    await page.waitForSelector("dialog.ac-dialog");
    assert.match(
      await page.$eval("dialog.ac-dialog h2", (e) => e.textContent),
      /Inspect workspace/,
    );
    await page.click('dialog.ac-dialog button[aria-label="Close dialog"]');
    await page.waitForSelector("dialog.ac-dialog", { hidden: true });
  }
  assert.deepEqual(errors, []);
  console.log(
    "PASS: direct /SuperAdmin and refresh without a development bar or top spacing, global search, notifications, profile menu, committee inspection, reason-required review/moderation/settings actions, audit records, suspension, scoped permissions, empty/error/retry, all five committee workspaces and no overflow at 1440/1024/768/390/320px. Screenshots in OS temp directory.",
  );
} finally {
  await browser.close();
}
