import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { getPaginationItems } from "./paginationModel.js";

let server;
let Tabs;
let Pagination;
const items = [
  { id: "first", label: "First section", content: "First content" },
  { id: "second", label: "Second section", content: "Second content" },
  {
    id: "unavailable",
    label: "Unavailable section",
    content: "Unavailable content",
    disabled: true,
  },
];
const renderTabs = (props = {}) =>
  renderToStaticMarkup(
    createElement(Tabs, {
      items,
      value: "first",
      onValueChange: () => {},
      ...props,
    }),
  );
const renderPagination = (props = {}) =>
  renderToStaticMarkup(
    createElement(Pagination, {
      page: 1,
      pageCount: 16,
      onPageChange: () => {},
      ...props,
    }),
  );

before(async () => {
  server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  ({ default: Tabs } = await server.ssrLoadModule(
    "/src/components/ui/Tabs.jsx",
  ));
  ({ default: Pagination } = await server.ssrLoadModule(
    "/src/components/ui/Pagination.jsx",
  ));
});
after(async () => server?.close());

test("tabs expose a named horizontal list with one selected tab and one tab stop", () => {
  const markup = renderTabs({ label: "Example sections" });
  assert.match(
    markup,
    /role="tablist" aria-label="Example sections" aria-orientation="horizontal"/,
  );
  assert.equal((markup.match(/role="tab"/g) || []).length, 3);
  assert.equal((markup.match(/aria-selected="true"/g) || []).length, 1);
  const buttons = [...markup.matchAll(/<button[^>]*>/g)].map(
    (match) => match[0],
  );
  assert.equal(
    buttons.filter((button) => button.includes('tabindex="0"')).length,
    1,
  );
  assert.ok(buttons.every((button) => button.includes('type="button"')));
});

test("each tab and panel have reciprocal ARIA relationships and inactive panels remain hidden", () => {
  const markup = renderTabs();
  const tabs = [
    ...markup.matchAll(/<button[^>]*id="([^"]+)"[^>]*aria-controls="([^"]+)"/g),
  ];
  for (const [, tabId, panelId] of tabs) {
    assert.ok(
      markup.includes(
        `id="${panelId}" role="tabpanel" aria-labelledby="${tabId}"`,
      ),
    );
  }
  const panels = [...markup.matchAll(/<div[^>]*role="tabpanel"[^>]*>/g)].map(
    (match) => match[0],
  );
  assert.equal(panels.filter((panel) => panel.includes('hidden=""')).length, 2);
  assert.match(markup, /First content/);
  assert.match(markup, /Second content/);
});

test("selection is controlled and does not silently choose an invalid or disabled value", () => {
  for (const value of ["missing", "unavailable", undefined]) {
    const markup = renderTabs({ value });
    assert.doesNotMatch(markup, /aria-selected="true"/);
    assert.equal((markup.match(/hidden=""/g) || []).length, 3);
  }
  assert.match(
    renderTabs({ value: "second" }),
    /aria-selected="true"[^>]*aria-controls="[^"]*second"/,
  );
});

test("disabled tabs and missing selection handlers do not expose working-looking controls", () => {
  for (const props of [{ disabled: true }, { onValueChange: undefined }]) {
    const markup = renderTabs(props);
    assert.match(markup, /aria-disabled="true"/);
    assert.equal((markup.match(/disabled=""/g) || []).length, 3);
    assert.equal((markup.match(/aria-selected="true"/g) || []).length, 1);
  }
});

test("empty tabs render nothing and all-disabled items have no keyboard entry point", () => {
  assert.equal(renderTabs({ items: [] }), "");
  const markup = renderTabs({
    items: items.map((item) => ({ ...item, disabled: true })),
  });
  const buttons = [...markup.matchAll(/<button[^>]*>/g)].map(
    (match) => match[0],
  );
  assert.ok(buttons.every((button) => button.includes('tabindex="-1"')));
});

test("tab IDs are unique across instances and safely encode special item IDs", () => {
  const data = [
    { id: "a b", label: "First", content: "One" },
    { id: "a%20b", label: "Second", content: "Two" },
  ];
  const markup = renderToStaticMarkup(
    createElement(
      "div",
      null,
      createElement(Tabs, { items: data, value: "a b" }),
      createElement(Tabs, { items: data, value: "a%20b" }),
    ),
  );
  const ids = [...markup.matchAll(/ id="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, 8);
  assert.equal(new Set(ids).size, 8);
  assert.ok(ids.every((id) => !/\s/.test(id)));
});

test("invalid or duplicate tab IDs fail clearly instead of breaking associations", () => {
  for (const data of [null, [{}], [{ id: "" }], [{ id: "a" }, { id: "a" }]]) {
    assert.throws(() => renderTabs({ items: data }), /IDs/);
  }
});

test("tab text is escaped and caller classes and long labels remain intact", () => {
  const markup = renderTabs({
    className: "example",
    items: [
      {
        id: "example",
        label: "Long label ".repeat(40) + "<script>",
        content: "<img>",
      },
    ],
    value: "example",
  });
  assert.match(markup, /class="miu-tabs example"/);
  assert.match(markup, /&lt;script&gt;/);
  assert.match(markup, /&lt;img&gt;/);
  assert.doesNotMatch(markup, /<script>|<img>/);
});

test("pagination matches the approved first-page number pattern and handles a middle and final page", () => {
  assert.deepEqual(getPaginationItems(1, 16), [1, 2, 3, "gap-16", 16]);
  assert.deepEqual(getPaginationItems(8, 16), [
    1,
    "gap-7",
    7,
    8,
    9,
    "gap-16",
    16,
  ]);
  assert.deepEqual(getPaginationItems(16, 16), [1, "gap-14", 14, 15, 16]);
  assert.deepEqual(getPaginationItems(1, 1), [1]);
  assert.deepEqual(getPaginationItems(3, 5), [1, 2, 3, 4, 5]);
});

test("page windows stay bounded and contain ordered valid numbers and the selected page", () => {
  for (const count of [1, 2, 5, 6, 16, 1000, Number.MAX_SAFE_INTEGER]) {
    for (const page of [...new Set([1, Math.ceil(count / 2), count])]) {
      const result = getPaginationItems(page, count);
      const numbers = result.filter((item) => typeof item === "number");
      assert.ok(result.length <= 7);
      assert.ok(numbers.includes(page));
      assert.equal(numbers[0], 1);
      assert.equal(numbers.at(-1), count);
      assert.deepEqual(
        numbers,
        [...new Set(numbers)].sort((a, b) => a - b),
      );
      assert.ok(numbers.every((number) => number >= 1 && number <= count));
    }
  }
});

test("invalid or empty pagination inputs never silently clamp the consumer's page", () => {
  for (const [page, count] of [
    [0, 16],
    [17, 16],
    [1.5, 16],
    [1, 0],
    [1, -1],
    [NaN, 16],
    [1, Infinity],
    [1, 3.5],
    ["1", 16],
  ]) {
    assert.deepEqual(getPaginationItems(page, count), []);
    assert.equal(renderPagination({ page, pageCount: count }), "");
  }
  const markup = renderPagination({
    page: 30,
    pageCount: 16,
    summary: "Consumer summary",
  });
  assert.match(markup, /Consumer summary/);
  assert.doesNotMatch(markup, /<button|aria-current/);
});

test("pagination is labeled navigation with exactly one current page and decorative gaps", () => {
  const markup = renderPagination({
    label: "Example pages",
    summary: "Example summary",
  });
  assert.match(markup, /<nav[^>]*aria-label="Example pages"/);
  assert.equal((markup.match(/aria-current="page"/g) || []).length, 1);
  assert.match(markup, /aria-label="Page 1"/);
  assert.match(markup, /aria-hidden="true">…/);
  assert.match(markup, /Example summary/);
  assert.doesNotMatch(markup, /href=|role="tab"|role="status"/);
});

test("pagination boundaries and disabled state use native unavailable buttons", () => {
  assert.match(
    renderPagination(),
    /<button[^>]*aria-label="Previous page"[^>]*disabled=""/,
  );
  assert.match(
    renderPagination({ page: 16 }),
    /<button[^>]*aria-label="Next page"[^>]*disabled=""/,
  );
  for (const props of [{ disabled: true }, { onPageChange: undefined }]) {
    const markup = renderPagination(props);
    const buttons = [...markup.matchAll(/<button[^>]*>/g)].map(
      (match) => match[0],
    );
    assert.ok(buttons.every((button) => button.includes('disabled=""')));
  }
});

test("pagination labels are supplied by callers without inventing records or translations", () => {
  const markup = renderPagination({
    previousLabel: "Previous example",
    nextLabel: "Next example",
    getPageLabel: (number) => `Example page ${number}`,
  });
  assert.match(markup, /aria-label="Previous example"/);
  assert.match(markup, /aria-label="Next example"/);
  assert.match(markup, /aria-label="Example page 1"/);
  assert.doesNotMatch(markup, /124|jobs|EGP/);
});

test("pagination icons are local decorative 16px artwork and actions never submit forms", () => {
  const markup = renderPagination();
  assert.equal(
    (markup.match(/alt="" width="16" height="16"/g) || []).length,
    2,
  );
  const buttons = [...markup.matchAll(/<button[^>]*>/g)].map(
    (match) => match[0],
  );
  assert.ok(buttons.every((button) => button.includes('type="button"')));
  assert.doesNotMatch(markup, /figma.com|https:\/\//);
});
