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
  await page.setViewport({ width: 1440, height: 1200 });
  const fresh = async () => {
    await page.goto(`${base}/AIQuality`, { waitUntil: "networkidle0" });
    await page.waitForSelector(".aq-review");
  };
  await fresh();
  assert.deepEqual(
    await page.$$eval(".miu-stat-card__value", (nodes) =>
      nodes.map((n) => n.textContent.trim()),
    ),
    ["60", "11.7%", "2", "4"],
  );
  assert.equal(
    await page.$$(".aq-queue tbody tr").then((nodes) => nodes.length),
    4,
  );
  await page.screenshot({
    path: join(tmpdir(), "miu-ai-quality-desktop.png"),
    fullPage: true,
  });
  await page.click(".aq-review .aq-actions button:first-child");
  await page.type("dialog textarea", "   ");
  await page.click('dialog button[type="submit"]');
  assert.match(
    await page.$eval("dialog", (n) => n.textContent),
    /Enter a review note/,
  );
  await page.keyboard.press("Escape");
  await page.waitForSelector("dialog", { hidden: true });
  assert.equal(
    await page.$eval(
      ".aq-review .aq-actions button:first-child",
      (n) => n === document.activeElement,
    ),
    true,
  );
  await page.click(".aq-review .aq-actions button:first-child");
  await page.type("dialog textarea", "Assigned for fictional review.");
  await page.click('dialog button[type="submit"]');
  await page.waitForSelector("dialog", { hidden: true });
  assert.match(
    await page.$eval(".aq-history", (n) => n.textContent),
    /Assigned for fictional review/,
  );
  await page.click(".aq-review .aq-actions button:first-child");
  await page.select("dialog select", "Resolved");
  await page.type(
    "dialog textarea",
    "Finding documented in the fictional sample.",
  );
  await page.click('dialog button[type="submit"]');
  await page.waitForSelector("dialog", { hidden: true });
  assert.match(
    await page.$eval(".aq-review", (n) => n.textContent),
    /Read-only/,
  );
  assert.match(
    await page.$eval(".aq-history", (n) => n.textContent),
    /Resolved/,
  );
  assert.equal(
    await page.$eval(".miu-stat-card:nth-child(2) .miu-stat-card__value", (n) =>
      n.textContent.trim(),
    ),
    "11.7%",
  );
  await fresh();
  await page.click(".aq-sidebar nav button:last-child");
  await page.waitForFunction(
    () =>
      document.querySelectorAll(".aq-queue tbody tr").length === 2 &&
      new URLSearchParams(location.search).get("area") === "Moderation",
  );
  assert.equal(
    await page.$$(".aq-queue tbody tr").then((nodes) => nodes.length),
    2,
  );
  await page.click(".aq-review .aq-actions button:last-child");
  await page.select("dialog select", "Marketplace Operations");
  await page.type(
    "dialog textarea",
    "Moderation requires the authorized content team.",
  );
  await page.click('dialog button[type="submit"]');
  await page.waitForSelector("dialog", { hidden: true });
  assert.match(
    await page.$eval(".aq-history", (n) => n.textContent),
    /Marketplace Operations/,
  );
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForFunction(() =>
    document
      .querySelector(".aq-queue")
      ?.textContent.includes("No matching quality reports"),
  );
  await fresh();
  await page.type('input[type="search"]', "no matches");
  assert.equal(await page.$(".aq-review"), null);
  await page.click(".aq-filters button");
  await page.waitForSelector(".aq-review");
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewport({ width, height: 1000 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `Overflow at ${width}px`,
    );
    if (width === 390)
      await page.screenshot({
        path: join(tmpdir(), "miu-ai-quality-mobile.png"),
        fullPage: true,
      });
  }
  await page.click(".aq-footer summary");
  await page.select(".aq-footer select", "empty");
  await page.waitForFunction(() =>
    document
      .querySelector(".aq-queue")
      ?.textContent.includes("No matching quality reports"),
  );
  assert.equal(await page.$(".aq-review"), null);
  assert.deepEqual(
    await page.$$eval(".miu-stat-card__value", (nodes) =>
      nodes.map((n) => n.textContent.trim()),
    ),
    ["0", "—", "0", "0"],
  );
  await page.select(".aq-footer select", "error");
  await page.waitForSelector(".miu-feedback-state--error");
  await page.click(".miu-stat-card button");
  await page.waitForSelector(".aq-review");
  await page.goto(`${base}/aiquality`, { waitUntil: "networkidle0" });
  await page.waitForSelector(".aq-review");
  assert.deepEqual(errors, []);
  console.log(
    "PASS: direct route/capitalization/refresh, exact metric denominators, search/area/status filters, assignment, finding/resolution, scoped escalation/history, required reasons, Escape/focus, read-only outcomes, empty/error/retry, and no overflow at 1440/1024/768/390/320px. Screenshots in OS temp.",
  );
} finally {
  await browser.close();
}
