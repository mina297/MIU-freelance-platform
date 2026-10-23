import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { join } from "node:path";
const { puppeteer } = await import(pathToFileURL(process.argv[2]).href);
const browser = await puppeteer.launch({
  headless: true,
  executablePath: process.argv[3],
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewport({ width: 1440, height: 1100 });
  await page.goto("http://127.0.0.1:5180/", { waitUntil: "networkidle0" });
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
    2,
  );
  await page.click(".ac-heading button");
  await page.type('input[name="name"]', "Fictional Reviewer");
  await page.type('input[name="email"]', "reviewer@example.test");
  await page.select('select[name="committee"]', "finance");
  await page.type("dialog textarea", "Demo workload coverage.");
  await page.click("dialog .ac-primary");
  await page.click(".ac-sidebar nav button:nth-child(3)");
  assert.match(
    await page.$eval("main", (e) => e.textContent),
    /Fictional Reviewer/,
  );
  await page.click(".ac-sidebar nav button:nth-child(2)");
  await page.type(".ac-filters input", "Salma");
  assert.equal(
    await page.$$(".ac-table-wrap tbody tr").then((r) => r.length),
    1,
  );
  await page.click(".ac-table-wrap button");
  await page.type("dialog textarea", "Demo account review.");
  await page.click("dialog .ac-primary");
  assert.match(
    await page.$eval(".ac-table-wrap", (e) => e.textContent),
    /suspended/,
  );
  await page.click(".ac-sidebar nav button:nth-child(4)");
  await page.click(".ac-table-wrap button");
  await page.type("dialog textarea", "Scoped review access test.");
  await page.click("dialog .ac-primary");
  assert.equal(
    await page.$eval(".ac-table-wrap button", (e) =>
      e.getAttribute("aria-pressed"),
    ),
    "false",
  );
  await page.click(".ac-sidebar nav button:nth-child(7)");
  assert.equal(
    await page.$$(".ac-table-wrap tbody tr").then((r) => r.length),
    4,
  );
  await page.click(".ac-sidebar nav button:first-child");
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
    await page.click(".ac-sidebar nav button:nth-child(3)");
    await page.evaluate(
      (i) => document.querySelectorAll(".ac-padded button")[i].click(),
      index,
    );
    await page.waitForSelector("#demo-account");
    assert.match(
      await page.$eval("#main-content", (e) => e.textContent),
      /routing placeholder/,
    );
    await page.select("#demo-account", "admin_001");
    await page.evaluate(() =>
      [...document.querySelectorAll("button")]
        .find((b) => b.textContent === "Start demo session")
        .click(),
    );
    await page.click('a[href="/admin"]');
    await page.waitForSelector(".ac-stats");
  }
  assert.deepEqual(errors, []);
  console.log(
    "PASS: authenticated navigation, case decision, provisioning, suspension, scoped permissions, audit records, empty/error/retry, all five committee demo links, and no overflow at 1440/1024/768/390/320px. Screenshots in OS temp directory.",
  );
} finally {
  await browser.close();
}
