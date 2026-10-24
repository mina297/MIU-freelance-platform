import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

let server;
const components = {};
const rows = Object.freeze([
  Object.freeze({ id: "row-b", title: "Second alphabetically", value: 0 }),
  Object.freeze({ id: "row-a", title: "First alphabetically", value: 12 }),
]);
const columns = [
  {
    id: "title",
    header: "Title",
    rowHeader: true,
    sortable: true,
    render: (row) => row.title,
  },
  { id: "value", header: "Value", align: "end", render: (row) => row.value },
];
const render = (name, props) =>
  renderToStaticMarkup(createElement(components[name], props));
const table = (props = {}) =>
  render("DataTable", { caption: "Example records", rows, columns, ...props });

before(async () => {
  server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  for (const name of [
    "DataTable",
    "StatCard",
    "Input",
    "Select",
    "Pagination",
    "Button",
  ]) {
    components[name] = (
      await server.ssrLoadModule(`/src/components/ui/${name}.jsx`)
    ).default;
  }
});
after(async () => server?.close());

test("table has a caption, named section and native explicit table semantics", () => {
  const markup = table({ description: "Example context" });
  assert.match(markup, /<section[^>]*aria-labelledby=/);
  assert.match(markup, /<table[^>]*role="table"[^>]*aria-describedby=/);
  assert.match(markup, /<caption[^>]*>Example records<\/caption>/);
  assert.match(markup, /<thead[^>]*role="rowgroup"/);
  assert.match(markup, /<tbody role="rowgroup"/);
  assert.equal((markup.match(/scope="col"/g) || []).length, 2);
  assert.equal((markup.match(/scope="row"/g) || []).length, 2);
});

test("cells reference unique column and row headers, with mobile labels hidden from AT", () => {
  const markup = table();
  const headers = [...markup.matchAll(/<th id="([^"]+)" scope="col"/g)].map(
    (match) => match[1],
  );
  const rowHeaders = [...markup.matchAll(/<th id="([^"]+)" scope="row"/g)].map(
    (match) => match[1],
  );
  assert.equal(headers.length, 2);
  assert.equal(rowHeaders.length, 2);
  assert.equal(new Set([...headers, ...rowHeaders]).size, 4);
  for (const rowId of rowHeaders)
    assert.ok(markup.includes(`headers="${headers[1]} ${rowId}"`));
  assert.match(markup, /miu-data-table__mobile-label" aria-hidden="true"/);
  assert.match(markup, /data-align="end"/);
  assert.match(
    table({ columns: columns.map((column) => ({ ...column, width: "50%" })) }),
    /<col style="width:50%"/,
  );
});

test("supplied row order and zero values remain intact without sorting or mutating records", () => {
  const markup = table({
    sort: { columnId: "title", direction: "ascending" },
    onSortChange: () => {},
  });
  assert.ok(
    markup.indexOf("Second alphabetically") <
      markup.indexOf("First alphabetically"),
  );
  assert.match(markup, /miu-data-table__value">0<\/div>/);
  assert.deepEqual(
    rows.map((row) => row.id),
    ["row-b", "row-a"],
  );
});

test("sort state is controlled with one aria-sort and a next-direction request label", () => {
  const markup = table({
    sort: { columnId: "title", direction: "ascending" },
    onSortChange: () => {},
  });
  assert.equal((markup.match(/aria-sort=/g) || []).length, 1);
  assert.match(markup, /aria-sort="ascending"/);
  assert.match(markup, /aria-label="Sort Title descending"/);
  assert.match(
    table({ sort: { columnId: "title", direction: "descending" } }),
    /aria-label="Sort Title ascending"/,
  );
  assert.match(table(), /<button[^>]*disabled=""/);
  assert.doesNotMatch(
    table({ sort: { columnId: "value", direction: "ascending" } }),
    /aria-sort=/,
  );
  assert.doesNotMatch(
    table({ sort: { columnId: "title", direction: "unknown" } }),
    /aria-sort=/,
  );
});

test("caller-supplied filter controls and pagination compose without automatic data operations", () => {
  const toolbar = createElement(
    "div",
    null,
    createElement(components.Input, { label: "Example filter", id: "filter" }),
    createElement(
      components.Select,
      { label: "Example category", id: "category" },
      createElement("option", { value: "all" }, "All examples"),
    ),
  );
  const pagination = createElement(components.Pagination, {
    page: 1,
    pageCount: 2,
    onPageChange: () => {},
    summary: "Supplied summary",
  });
  const markup = table({ toolbar, pagination });
  assert.match(markup, /for="filter"/);
  assert.match(markup, /for="category"/);
  assert.match(markup, /miu-data-table__footer/);
  assert.match(markup, /Supplied summary/);
  assert.match(markup, /Second alphabetically/);
  assert.doesNotMatch(
    table({ toolbar: false, pagination: false }),
    /miu-data-table__toolbar|miu-data-table__footer/,
  );
});

test("loading hides stale records and pagination and keeps one status outside the busy region", () => {
  const markup = table({
    state: "loading",
    pagination: "Stale pager",
    columns: [
      {
        id: "example",
        header: "Example",
        render: () => assert.fail("stale row renderer called"),
      },
    ],
  });
  assert.match(markup, /aria-busy="true"/);
  assert.equal((markup.match(/role="status"/g) || []).length, 1);
  assert.ok(
    markup.indexOf('role="status"') < markup.indexOf('aria-busy="true"'),
  );
  assert.doesNotMatch(markup, /<table|Stale pager|Second alphabetically/);
});

test("empty and error states reuse existing feedback without fake recovery actions", () => {
  const empty = table({ rows: [], pagination: "Stale pager" });
  assert.match(empty, /No records to display/);
  assert.doesNotMatch(empty, /<table|<button|Stale pager/);
  assert.match(table({ rows: [], onEmptyAction: () => {} }), /Clear filters/);
  const error = table({
    state: "error",
    errorMessage: "Example failure",
    pagination: "Stale pager",
  });
  assert.match(error, /Example failure/);
  assert.doesNotMatch(
    error,
    /<table|<button|Second alphabetically|Stale pager/,
  );
  assert.match(table({ state: "error", onRetry: () => {} }), /Try again/);
});

test("stable custom row IDs and column IDs work without index keys or forced field names", () => {
  const markup = table({
    rows: [{ key: 0, title: "Zero ID" }],
    getRowId: (row) => row.key,
    columns: [{ id: "a b", header: "Example", render: (row) => row.title }],
  });
  assert.match(markup, /column-a%20b/);
  assert.match(markup, /Zero ID/);
  assert.doesNotMatch(markup, /scope="row"/);
});

test("invalid column and row identities fail clearly rather than corrupting associations", () => {
  for (const props of [
    { columns: [] },
    { columns: [{ id: "x", header: "Example" }] },
    { columns: [columns[0], columns[0]] },
    { columns: columns.map((column) => ({ ...column, rowHeader: true })) },
    { rows: [{ id: "same" }, { id: "same" }] },
    { rows: [{ id: 1 }, { id: "1" }] },
    { rows: [{ id: "" }] },
    { rows: [{ id: Infinity }] },
    { rows: null },
    { getRowId: null },
  ])
    assert.throws(() => table(props), /DataTable/);
});

test("multiple tables have independent IDs and configurable heading levels", () => {
  const markup = renderToStaticMarkup(
    createElement(
      "div",
      null,
      createElement(components.DataTable, { columns, rows }),
      createElement(components.DataTable, { columns, rows, headingLevel: 3 }),
    ),
  );
  const ids = [...markup.matchAll(/ id="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  assert.match(markup, /<h3/);
  assert.doesNotMatch(table(), /aria-describedby=/);
});

test("stat card associates a definition-list label with a real zero metric", () => {
  const markup = render("StatCard", {
    label: "Example count",
    value: 0,
    description: "Supplied context",
  });
  const labelId = markup.match(/aria-labelledby="([^"]+)"/)[1];
  assert.ok(markup.includes(`<dt id="${labelId}"`));
  assert.match(markup, /<dl>/);
  assert.match(markup, /<dd[^>]*>0<\/dd>/);
  assert.match(markup, /Supplied context/);
  assert.doesNotMatch(markup, /<button|role="status"|role="alert"/);
});

test("missing or invalid statistics remain unavailable, never fabricated zero", () => {
  for (const value of [undefined, null, "", " ", NaN, Infinity, false, {}]) {
    const markup = render("StatCard", { value });
    assert.match(markup, /Unavailable/);
    assert.doesNotMatch(markup, />0<|>NaN</);
  }
});

test("stat card preserves preformatted caller values without currency or trend inference", () => {
  assert.match(
    render("StatCard", { label: "Example budget", value: "EGP 1,250" }),
    /EGP 1,250/,
  );
  const markup = render("StatCard", { label: "Example count", value: 12 });
  assert.doesNotMatch(markup, /EGP|USD|%|increase|verified|Open jobs/);
});

test("stat loading suppresses stale values and separates busy value from status", () => {
  const markup = render("StatCard", {
    state: "loading",
    value: "STALE METRIC",
  });
  assert.doesNotMatch(markup, /STALE METRIC|Unavailable/);
  assert.match(markup, /aria-busy="true"/);
  assert.match(markup, /miu-skeleton/);
  assert.equal((markup.match(/role="status"/g) || []).length, 1);
  assert.ok(markup.indexOf("</dd>") < markup.indexOf('role="status"'));
});

test("stat error hides stale figures and only exposes a provided retry callback", () => {
  const props = {
    state: "error",
    value: "STALE METRIC",
    errorMessage: "Example metric error",
  };
  assert.doesNotMatch(
    render("StatCard", props),
    /STALE METRIC|<button|role="alert"/,
  );
  assert.match(render("StatCard", props), /Example metric error/);
  assert.match(
    render("StatCard", { ...props, onRetry: () => {} }),
    /Try again/,
  );
});

test("metric icons are supplied decorative content and missing optional slots stay absent", () => {
  const markup = render("StatCard", {
    value: 1,
    icon: createElement("span", null, "Example decoration"),
  });
  assert.match(markup, /miu-stat-card__icon" aria-hidden="true"/);
  assert.match(markup, /Example decoration/);
  assert.doesNotMatch(
    render("StatCard", { value: 1 }),
    /miu-stat-card__icon|miu-stat-card__description/,
  );
  assert.doesNotMatch(
    render("StatCard", { value: 1, icon: false }),
    /miu-stat-card__icon/,
  );
});

test("long caller text is preserved and escaped in both components", () => {
  const text = "Long example ".repeat(30) + "<script>";
  for (const markup of [
    table({ caption: text, description: text }),
    render("StatCard", { label: text, value: text, description: text }),
  ]) {
    assert.match(markup, /&lt;script&gt;/);
    assert.doesNotMatch(markup, /<script>/);
  }
});

test("unknown state names fail instead of silently exposing stale content", () => {
  assert.throws(() => table({ state: "unknown" }), /state must be/);
  assert.throws(
    () => render("StatCard", { state: "unknown" }),
    /state must be/,
  );
});
