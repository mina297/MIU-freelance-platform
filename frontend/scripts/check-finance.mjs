import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { tmpdir } from "node:os";
const module = await import(pathToFileURL(process.argv[2]).href);
const browser = await (module.puppeteer ?? module.default).launch({
  headless: true,
  executablePath: process.argv[3],
});
const base = process.argv[4] || "http://localhost:5173";
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const fresh = async () => {
    await page.goto(`${base}/Finance`, { waitUntil: "networkidle0" });
    await page.waitForSelector("tbody tr");
  };
  await page.setViewport({ width: 1440, height: 1100 });
  await fresh();
  assert.equal(await page.$$("tbody tr").then((nodes) => nodes.length), 10);
  const metrics = await page.$$eval(".miu-stat-card__value", (nodes) =>
    nodes.map((n) => n.textContent.trim().replace(/\s+/g, " ")),
  );
  assert.deepEqual(metrics, [
    "EGP 17,000",
    "EGP 13,000",
    "EGP 3,800",
    "EGP 200",
  ]);
  await page.screenshot({
    path: join(tmpdir(), "miu-finance-desktop.png"),
    fullPage: true,
  });
  await page.select(".fd-filters select", "Pending");
  assert.equal(await page.$$("tbody tr").then((nodes) => nodes.length), 3);
  await page.type('input[type="search"]', "fin_txn_06");
  assert.equal(await page.$$("tbody tr").then((nodes) => nodes.length), 1);
  await page.click('button[aria-label="View fin_txn_06"]');
  await page.waitForSelector("dialog[open] .fd-detail");
  assert.match(
    await page.$eval(".fd-detail", (n) => n.textContent),
    /DEMO-fin_txn_06/,
  );
  assert.match(
    await page.$eval(".fd-detail", (n) => n.textContent),
    /Related order events/,
  );
  await page.keyboard.press("Escape");
  await page.waitForSelector("dialog[open]", { hidden: true });
  assert.equal(
    await page.$eval(
      'button[aria-label="View fin_txn_06"]',
      (n) => n === document.activeElement,
    ),
    true,
  );
  await page.click('button[aria-label="View fin_txn_06"]');
  await page.waitForSelector(".fd-detail .fd-actions button");
  await page.click(".fd-detail .fd-actions button:first-child");
  await page.type("dialog[open] textarea", "   ");
  await page.click('dialog[open] button[type="submit"]');
  assert.match(
    await page.$eval("dialog[open]", (n) => n.textContent),
    /Enter a financial review reason/,
  );
  await page.click("dialog[open] textarea", { clickCount: 3 });
  await page.type(
    "dialog[open] textarea",
    "Fictional dispute and refund request reviewed.",
  );
  await page.click('dialog[open] button[type="submit"]');
  await page.waitForSelector(".fd-detail");
  assert.match(
    await page.$eval(".fd-history", (n) => n.textContent),
    /Fictional dispute and refund request reviewed/,
  );
  assert.match(
    await page.$eval(".fd-detail-amount", (n) => n.textContent),
    /Pending/,
  );
  await page.click(".fd-detail .fd-actions button:last-child");
  await page.type(
    "dialog[open] textarea",
    "Approval authority requires Super Admin review.",
  );
  await page.click('dialog[open] button[type="submit"]');
  await page.waitForSelector(".fd-detail");
  assert.match(
    await page.$eval(".fd-history", (n) => n.textContent),
    /Super Admin/,
  );
  assert.equal(await page.$(".fd-detail .fd-actions"), null);
  await page.keyboard.press("Escape");
  await page.waitForSelector("dialog[open]", { hidden: true });
  assert.deepEqual(
    await page.$$eval(".miu-stat-card__value", (nodes) =>
      nodes.map((n) => n.textContent.trim().replace(/\s+/g, " ")),
    ),
    metrics,
  );
  await page.click(".fd-sidebar nav button:nth-child(3)");
  await page.waitForFunction(
    () => new URLSearchParams(location.search).get("section") === "escrow",
  );
  assert.equal(await page.$$("tbody tr").then((nodes) => nodes.length), 5);
  await page.click("tbody tr:first-child button");
  await page.waitForFunction(
    () =>
      new URLSearchParams(location.search).get("section") === "transactions",
  );
  await page.waitForFunction(
    () =>
      document.querySelector(".fd-filters input")?.value === "fin_order_01" &&
      document.querySelectorAll("tbody tr").length === 1,
  );
  assert.equal(await page.$$("tbody tr").then((nodes) => nodes.length), 1);
  await fresh();
  await page.select(".fd-filters select", "Failed");
  assert.equal(await page.$$("tbody tr").then((nodes) => nodes.length), 1);
  await page.type('input[type="search"]', "no match");
  assert.equal(await page.$$("tbody tr").then((nodes) => nodes.length), 0);
  await page.click(".fd-filters button");
  await page.waitForSelector("tbody tr");
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
        path: join(tmpdir(), "miu-finance-mobile.png"),
        fullPage: true,
      });
  }
  await page.click(".fd-footer summary");
  await page.select(".fd-footer select", "empty");
  await page.waitForFunction(() =>
    document
      .querySelector("main")
      ?.textContent.includes("No matching transactions"),
  );
  assert.deepEqual(
    await page.$$eval(".miu-stat-card__value", (nodes) =>
      nodes.map((n) => n.textContent.trim().replace(/\s+/g, " ")),
    ),
    ["EGP 0", "EGP 0", "EGP 0", "EGP 0"],
  );
  await page.select(".fd-footer select", "error");
  await page.waitForSelector(".miu-feedback-state--error");
  await page.click(".miu-stat-card button");
  await page.waitForSelector("tbody tr");
  await page.goto(`${base}/finance?section=fees`, {
    waitUntil: "networkidle0",
  });
  await page.waitForSelector("tbody tr");
  assert.equal(await page.$$("tbody tr").then((nodes) => nodes.length), 2);
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector("tbody tr");
  assert.equal(await page.$$("tbody tr").then((nodes) => nodes.length), 2);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: direct route/case/refresh, reconciled amounts, search/status filters, transaction/order details, review reasons/audit, escalation, unchanged financial statuses/balances, escrow navigation, zero/error/retry states, Escape/focus and no overflow at 1440/1024/768/390/320px. Screenshots in OS temp.",
  );
} finally {
  await browser.close();
}
