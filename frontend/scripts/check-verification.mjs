import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { join } from "node:path";
const module = await import(pathToFileURL(process.argv[2]).href);
const browser = await (module.puppeteer ?? module.default).launch({
  headless: true,
  executablePath: process.argv[3],
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewport({ width: 1440, height: 1200 });
  await page.goto(
    `${process.argv[4] || "http://localhost:5173"}/Verification`,
    { waitUntil: "networkidle0" },
  );
  await page.waitForSelector(".vd-details");
  assert.equal(await page.$$("tbody tr").then((r) => r.length), 2);
  await page.screenshot({
    path: join(tmpdir(), "miu-verification-desktop.png"),
    fullPage: true,
  });
  await page.type('input[type="search"]', "Nile");
  assert.equal(await page.$$("tbody tr").then((r) => r.length), 1);
  assert.match(
    await page.$eval(".vd-details", (n) => n.textContent),
    /Government ID/,
  );
  await page.click(".vd-details .vd-decision-actions button:first-child");
  await page.type("dialog textarea", "   ");
  await page.click('dialog button[type="submit"]');
  assert.match(
    await page.$eval("dialog", (n) => n.textContent),
    /Enter a reason/,
  );
  await page.keyboard.press("Escape");
  await page.waitForSelector("dialog", { hidden: true });
  assert.equal(
    await page.$eval(
      ".vd-details .vd-decision-actions button",
      (n) => n === document.activeElement,
    ),
    true,
  );
  await page.$eval('input[type="search"]', (input) => {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ).set;
    setter.call(input, "");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  for (const [index, expected] of [
    [1, "Approved"],
    [2, "Rejected"],
    [3, "Resubmission Requested"],
  ]) {
    await page.goto(
      `${process.argv[4] || "http://localhost:5173"}/Verification`,
      { waitUntil: "networkidle0" },
    );
    await page.waitForSelector(".vd-details");
    await page.click(
      `.vd-details .vd-decision-actions button:nth-child(${index})`,
    );
    await page.type(
      "dialog textarea",
      "Fictional evidence reviewed with a recorded reason.",
    );
    await page.click('dialog button[type="submit"]');
    await page.waitForSelector("dialog", { hidden: true });
    assert.match(
      await page.$eval(".vd-history", (n) => n.textContent),
      new RegExp(expected),
    );
    assert.match(
      await page.$eval(".vd-history", (n) => n.textContent),
      /Fictional evidence reviewed/,
    );
    assert.equal(await page.$(".vd-details .vd-decision-actions"), null);
  }
  await page.goto(
    `${process.argv[4] || "http://localhost:5173"}/Verification`,
    { waitUntil: "networkidle0" },
  );
  await page.waitForSelector(".vd-details");
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
        path: join(tmpdir(), "miu-verification-mobile.png"),
        fullPage: true,
      });
  }
  await page.click(".vd-footer summary");
  await page.select(".vd-footer select", "empty");
  await page.waitForSelector(".vd-queue .miu-feedback-state");
  assert.equal(await page.$(".vd-details"), null);
  await page.select(".vd-footer select", "error");
  await page.waitForSelector(".miu-feedback-state--error");
  await page.click(".miu-stat-card button");
  await page.waitForSelector(".vd-details");
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector(".vd-details");
  assert.equal(await page.$$("tbody tr").then((r) => r.length), 2);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: direct route/refresh, queue/search, MIU/government ID details, all three decisions with reasons/history, whitespace validation, read-only outcomes, Escape/focus, empty/error/retry, and no overflow at 1440/1024/768/390/320px. Screenshots saved in OS temp.",
  );
} finally {
  await browser.close();
}
