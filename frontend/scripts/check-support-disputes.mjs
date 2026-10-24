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
    await page.goto(`${base}/SupportDisputes`, { waitUntil: "networkidle0" });
    await page.waitForSelector(".sdc-case-details");
  };
  const confirm = async (reason) => {
    await page.type("dialog[open] textarea", reason);
    await page.click('dialog[open] button[type="submit"]');
    await page.waitForSelector("dialog[open]", { hidden: true });
  };
  await page.setViewport({ width: 1440, height: 1200 });
  await fresh();
  assert.equal(await page.$$("tbody tr").then((nodes) => nodes.length), 5);
  assert.deepEqual(
    await page.$$eval(".miu-stat-card__value", (nodes) =>
      nodes.map((n) => n.textContent.trim()),
    ),
    ["3", "1", "2", "2"],
  );
  await page.screenshot({
    path: join(tmpdir(), "miu-support-desktop.png"),
    fullPage: true,
  });
  await page.click(".sdc-case-details .sdc-case-actions button:first-child");
  await confirm("Assigned for a fictional case review.");
  assert.match(
    await page.$eval(".sdc-case-history", (n) => n.textContent),
    /Assigned for a fictional case review/,
  );
  assert.match(
    await page.$eval(".sdc-case-meta", (n) => n.textContent),
    /Demo Support Reviewer/,
  );
  await page.click(".sdc-case-details .sdc-case-actions button:first-child");
  await page.type("dialog[open] textarea", "   ");
  await page.click('dialog[open] button[type="submit"]');
  assert.match(
    await page.$eval("dialog[open]", (n) => n.textContent),
    /Enter a case note/,
  );
  await page.keyboard.press("Escape");
  await page.waitForSelector("dialog[open]", { hidden: true });
  assert.equal(
    await page.$eval(
      ".sdc-case-details .sdc-case-actions button:first-child",
      (n) => n === document.activeElement,
    ),
    true,
  );
  await page.click(".sdc-case-details .sdc-case-actions button:first-child");
  await confirm("Internal guidance noted, with no message sent.");
  await page.click(".sdc-case-details .sdc-case-actions button:nth-child(2)");
  await page.select("dialog[open] select", "High");
  await confirm("Raised priority for the fictional review.");
  assert.match(
    await page.$eval(".sdc-case-history", (n) => n.textContent),
    /Normal → High/,
  );
  await page.click(".sdc-case-details .sdc-case-actions button:nth-child(3)");
  await confirm("Nonfinancial navigation guidance documented.");
  assert.match(
    await page.$eval(".sdc-case-details", (n) => n.textContent),
    /Read-only/,
  );
  assert.match(
    await page.$eval(".sdc-case-history", (n) => n.textContent),
    /Resolved/,
  );
  await fresh();
  await page.click(".sdc-sidebar nav button:last-child");
  await page.waitForFunction(
    () =>
      new URLSearchParams(location.search).get("type") === "Dispute" &&
      document.querySelectorAll("tbody tr").length === 2,
  );
  assert.match(
    await page.$eval(".sdc-case-details", (n) => n.textContent),
    /DEMO-SUPPORT-TXN-02/,
  );
  assert.equal(
    await page.$$eval(".sdc-case-details .sdc-case-actions button", (nodes) =>
      nodes.some((n) => n.textContent === "Resolve case"),
    ),
    false,
  );
  await page.click(".sdc-evidence button:first-of-type");
  await page.waitForSelector("dialog[open]");
  assert.match(
    await page.$eval("dialog[open]", (n) => n.textContent),
    /Sample scope/,
  );
  await page.keyboard.press("Escape");
  await page.waitForSelector("dialog[open]", { hidden: true });
  await page.click(".sdc-case-details .sdc-case-actions button:last-child");
  assert.equal(
    await page.$eval("dialog[open] select", (n) => n.value),
    "Finance",
  );
  await confirm("Financial dispute requires authorized finance review.");
  assert.match(
    await page.$eval(".sdc-case-history", (n) => n.textContent),
    /Destination: Finance/,
  );
  assert.match(
    await page.$eval(".sdc-order-context", (n) => n.textContent),
    /2,500/,
  );
  assert.match(
    await page.$eval(".sdc-case-details", (n) => n.textContent),
    /Read-only/,
  );
  await fresh();
  await page.select(".sdc-filters select:first-of-type", "Open");
  const selects = await page.$$(".sdc-filters select");
  await selects[1].select("High");
  assert.equal(await page.$$("tbody tr").then((nodes) => nodes.length), 1);
  await page.type('input[type="search"]', "not found");
  assert.equal(await page.$(".sdc-case-details"), null);
  await page.click(".sdc-filters button");
  await page.waitForFunction(
    () => document.querySelectorAll("tbody tr").length === 5,
  );
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
        path: join(tmpdir(), "miu-support-mobile.png"),
        fullPage: true,
      });
  }
  await page.click(".sdc-footer summary");
  await page.select(".sdc-footer select", "empty");
  await page.waitForFunction(() =>
    document
      .querySelector("main")
      ?.textContent.includes("No matching support cases"),
  );
  assert.deepEqual(
    await page.$$eval(".miu-stat-card__value", (nodes) =>
      nodes.map((n) => n.textContent.trim()),
    ),
    ["0", "0", "0", "0"],
  );
  await page.select(".sdc-footer select", "error");
  await page.waitForSelector(".miu-feedback-state--error");
  await page.click(".miu-stat-card button");
  await page.waitForSelector(".sdc-case-details");
  await page.goto(`${base}/supportdisputes`, { waitUntil: "networkidle0" });
  await page.waitForSelector(".sdc-case-details");
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector(".sdc-case-details");
  assert.equal(await page.$$("tbody tr").then((nodes) => nodes.length), 5);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: direct/case-variant route and refresh, metrics, search/status/priority/type filters, assignment, internal notes, priority changes, nonfinancial resolution, safe evidence preview, financial escalation restrictions/history, whitespace validation, read-only outcomes, Escape/focus, empty/error/retry and no overflow at 1440/1024/768/390/320px. Screenshots in OS temp.",
  );
} finally {
  await browser.close();
}
