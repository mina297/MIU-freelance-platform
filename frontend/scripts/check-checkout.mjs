// node scripts/check-checkout.mjs <puppeteer-module> <chrome-path> [base-url]
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { tmpdir } from "node:os";
const module = await import(pathToFileURL(process.argv[2]).href);
const puppeteer = module.puppeteer ?? module.default ?? module;
const browser = await puppeteer.launch({
  executablePath: process.argv[3],
  headless: true,
});
const page = await browser.newPage();
const base = process.argv[4] || "http://localhost:5173";
const errors = [],
  requests = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("request", (request) => {
  if (
    ["xhr", "fetch"].includes(request.resourceType()) &&
    new URL(request.url()).pathname.startsWith("/api")
  )
    requests.push(request.url());
});
const text = () =>
  page.$eval("body", (node) => node.innerText.replace(/\s+/g, " "));
async function waitText(value) {
  await page.waitForFunction(
    (value) => document.body.innerText.includes(value),
    {},
    value,
  );
}
async function clickButton(label) {
  for (const button of await page.$$("button")) {
    if ((await button.evaluate((node) => node.textContent)).includes(label)) {
      await button.click();
      return;
    }
  }
  throw Error("Missing button: " + label);
}
async function link(selector) {
  const href = await page.$eval(selector, (node) => node.getAttribute("href"));
  await page.click(selector);
  await page.waitForFunction(
    (href) => location.pathname === new URL(href, location.href).pathname,
    {},
    href,
  );
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
}
async function setOutcome(value) {
  await page.$eval(".ec-footer details", (node) => {
    node.open = true;
  });
  await page.select(".ec-footer select", value);
}
async function noOverflow(label) {
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    label,
  );
}
try {
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto(base + "/Checkout", { waitUntil: "networkidle0" });
  await clickButton("Start client demo");
  await waitText("A clear start to great work");
  assert.match(await text(), /Responsive landing page design/);
  assert.match(await text(), /Salma Farid/);
  assert.match(await text(), /2,200/);
  assert.match(await text(), /1,100/);
  assert.equal(
    await page.$$eval(".ec-methods input", (nodes) => nodes.length),
    3,
  );
  await clickButton("Review escrow payment");
  await waitText("Confirm the 50% escrow payment and remaining balance.");
  await page.click('.ec-methods input[value="mastercard"]');
  assert.match(await text(), /Business Mastercard/);
  await page.click(".ec-saved label:last-child input");
  await clickButton("Review escrow payment");
  await waitText("Load a sample cardholder name.");
  assert.equal(
    await page.$$eval(
      ".ec-fields input",
      (nodes) => nodes.length === 4 && nodes.every((node) => node.readOnly),
    ),
    true,
  );
  await page.click("#checkout-acknowledge");
  await clickButton("Try expired card");
  await clickButton("Review escrow payment");
  await waitText("This sample card has expired.");
  await clickButton("Load sample card");
  await clickButton("Review escrow payment");
  await waitText("Review before you confirm");
  assert.match(await text(), /9001/);
  await clickButton("Edit payment details");
  await page.click('.ec-methods input[value="apple_pay"]');
  await clickButton("Review escrow payment");
  await waitText("Review before you confirm");
  assert.match(await text(), /Apple Pay/);
  await clickButton("Edit payment details");
  await page.click('.ec-methods input[value="visa"]');
  // A failed attempt must not create a payment or activate the order.
  await setOutcome("failure");
  await clickButton("Review escrow payment");
  await clickButton("Confirm demo payment");
  assert.equal(await page.$eval(".ec-confirm", (node) => node.disabled), true);
  await waitText("Demo payment failed");
  await link('.ec-header a[href="/client/dashboard"]');
  await waitText("No payments yet");
  assert.match(await text(), /Awaiting Payment/);
  await link('.cp-checkout-link[href="/checkout/order_002"]');
  await page.click("#checkout-acknowledge");
  await setOutcome("cancelled");
  await clickButton("Review escrow payment");
  await clickButton("Confirm demo payment");
  await waitText("Demo payment cancelled");
  await clickButton("Return to payment review");
  await setOutcome("success");
  // Two rapid confirmation clicks must still create exactly one transaction.
  await page.$eval(".ec-confirm", (node) => {
    node.click();
    node.click();
  });
  await waitText("Demo payment confirmed");
  assert.match(await text(), /Partially Paid — Escrow Held/);
  assert.match(await text(), /Service completion 0%/);
  assert.equal(await page.$eval("progress", (node) => node.value), 0);
  assert.match(await page.$eval(".ec-due dd", (node) => node.textContent), /0/);
  assert.equal(await page.$$(".ec-confirm").then((nodes) => nodes.length), 0);
  await link('a[href="/client/payments"].ec-primary-link');
  await waitText("Payment history");
  await waitText("DEMO-PAY-order_002");
  assert.equal(
    await page.$$eval(".cp-history tbody tr", (nodes) => nodes.length),
    1,
  );
  assert.match(await text(), /1,100/);
  await clickButton("View details");
  assert.match(await text(), /Total service price/);
  assert.match(await text(), /2,200/);
  assert.match(await text(), /Service not complete/);
  await clickButton("Close details");
  await page.type(".cp-history input", "no-match");
  await waitText("No matching payments");
  await clickButton("Clear search");
  assert.equal(
    await page.$$eval(".cp-history tbody tr", (nodes) => nodes.length),
    1,
  );
  await page.$eval(".cp-preview-controls", (node) => {
    node.open = true;
  });
  await page.select(".cp-preview-controls select", "loading");
  await waitText("Loading demo payment history");
  await page.select(".cp-preview-controls select", "error");
  await waitText("The demo payment history could not be displayed");
  await clickButton("Try again");
  assert.equal(
    await page.$$eval(".cp-history tbody tr", (nodes) => nodes.length),
    1,
  );
  await link('.cp-nav a[href="/client/dashboard"]');
  await waitText("In Progress");
  assert.match(await text(), /50% funded/);
  assert.equal(await page.$eval("progress", (node) => node.value), 0);
  await noOverflow("client dashboard desktop");
  await page.screenshot({
    path: join(tmpdir(), "miu-client-escrow.png"),
    fullPage: true,
  });
  await link(".cp-checkout-link");
  await waitText("Demo payment confirmed");
  assert.equal(await page.$$(".ec-confirm").then((nodes) => nodes.length), 0);
  await link('a[href="/client/payments"].ec-primary-link');
  assert.equal(
    await page.$$eval(".cp-history tbody tr", (nodes) => nodes.length),
    1,
  );
  // A full refresh intentionally clears both the demo session and its in-memory payments.
  await page.goto(base + "/Checkout", { waitUntil: "networkidle0" });
  await clickButton("Start client demo");
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewport({ width, height: 1000 });
    await noOverflow("checkout at " + width);
    const positions = await page.evaluate(() => {
      const left = document
        .querySelector(".ec-content")
        .getBoundingClientRect();
      const right = document.querySelector(".ec-aside").getBoundingClientRect();
      return {
        leftX: left.x,
        leftBottom: left.bottom,
        rightX: right.x,
        rightTop: right.top,
      };
    });
    assert.ok(
      width > 900
        ? positions.rightX > positions.leftX
        : positions.rightTop >= positions.leftBottom,
      "responsive columns " + width,
    );
    if (width === 1440 || width === 390)
      await page.screenshot({
        path: join(tmpdir(), "miu-escrow-" + width + ".png"),
        fullPage: true,
      });
  }
  await page.click(".ec-saved label:last-child input");
  await clickButton("Load sample card");
  await noOverflow("new card form at 320");
  await link('.ec-header a[href="/client/dashboard"]');
  await waitText("No payments yet");
  await noOverflow("client dashboard empty at 320");
  // Fund via Apple Pay after navigating from an owned service order.
  await link(".cp-checkout-link");
  await page.click('.ec-methods input[value="apple_pay"]');
  await page.click("#checkout-acknowledge");
  await clickButton("Review escrow payment");
  await clickButton("Confirm demo payment");
  await waitText("Demo payment confirmed");
  await link('a[href="/client/payments"].ec-primary-link');
  await waitText("DEMO-PAY-order_002");
  await noOverflow("client history populated at 320");
  await clickButton("View details");
  await noOverflow("transaction detail at 320");
  // Existing role switching must not expose client payment history to a student.
  await page.select("#demo-account", "student_002");
  await clickButton("Start demo session");
  await waitText("This account cannot access the requested page.");
  assert.doesNotMatch(
    await text(),
    /DEMO-PAY-order_002|Partially Paid — Escrow Held/,
  );
  await page.goto(base + "/checkout", { waitUntil: "networkidle0" });
  await page.reload({ waitUntil: "networkidle0" });
  await waitText("Start client demo");
  assert.deepEqual(errors, []);
  assert.deepEqual(requests, []);
  console.log(
    "PASS: Visa/Mastercard/Apple Pay, validation, processing, failure/cancel/retry, 50% escrow funding, single transaction, client history/details/search/states, no automatic completion/release, ownership/role guards, navigation/refresh, and 5 responsive sizes. No API requests or browser errors.",
  );
  console.log(
    "Screenshots saved to " +
      tmpdir() +
      ": miu-escrow-1440.png, miu-escrow-390.png, miu-client-escrow.png",
  );
} finally {
  await browser.close();
}
