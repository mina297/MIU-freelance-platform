import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

let server;
let LanguageSwitcher;
const options = Object.freeze([
  Object.freeze({
    value: "example-ltr",
    label: "Example LTR",
    lang: "und",
    dir: "ltr",
  }),
  Object.freeze({
    value: "example-rtl",
    label: "Example RTL",
    lang: "und",
    dir: "rtl",
  }),
  Object.freeze({
    value: "unavailable",
    label: "Example unavailable",
    disabled: true,
  }),
]);
const render = (props = {}) =>
  renderToStaticMarkup(
    createElement(LanguageSwitcher, {
      options,
      value: "example-ltr",
      onValueChange: () => {},
      ...props,
    }),
  );

before(async () => {
  server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  ({ default: LanguageSwitcher } = await server.ssrLoadModule(
    "/src/components/navigation/LanguageSwitcher.jsx",
  ));
});
after(async () => server?.close());

test("switcher composes the existing labeled native Select and controlled option", () => {
  const markup = render({
    id: "language-example",
    helperText: "Example helper",
    error: "Example error",
    "aria-describedby": "external",
  });
  assert.match(markup, /<label[^>]*for="language-example"[^>]*>Language/);
  assert.match(markup, /<select[^>]*id="language-example"/);
  assert.match(
    markup,
    /aria-describedby="external language-example-helper language-example-error"/,
  );
  assert.match(markup, /aria-invalid="true"/);
  assert.match(markup, /value="example-ltr"[^>]*selected=""/);
  assert.doesNotMatch(markup, /role="menu"|role="listbox"|aria-live=/);
});

test("options are supplied unchanged with language/direction metadata and disabled state", () => {
  const markup = render();
  assert.match(markup, /value="example-rtl" lang="und" dir="rtl"/);
  assert.match(markup, /value="unavailable" disabled=""/);
  assert.equal((markup.match(/<option /g) || []).length, 4);
  assert.doesNotMatch(markup, /value="en"|value="ar"|flag|currency/i);
});

test("selection emits only a permitted next value without mutating the controlled input", () => {
  const requests = [];
  const element = LanguageSwitcher({
    options,
    value: "example-ltr",
    onValueChange: (next) => requests.push(next),
  });
  for (const value of [
    "",
    "unknown",
    "unavailable",
    "example-ltr",
    "example-rtl",
  ])
    element.props.onChange({ target: { value } });
  assert.deepEqual(requests, ["example-rtl"]);
  assert.equal(element.props.value, "example-ltr");
  assert.equal(options[0].value, "example-ltr");
});

test("empty, disabled, all-disabled and missing-handler controls cannot request a switch", () => {
  for (const props of [
    { options: [] },
    { disabled: true },
    { options: options.map((option) => ({ ...option, disabled: true })) },
    { onValueChange: null },
  ]) {
    const element = LanguageSwitcher({
      options,
      value: "example-ltr",
      onValueChange: () => assert.fail("Unavailable control emitted"),
      ...props,
    });
    assert.equal(element.props.disabled, true);
    element.props.onChange({ target: { value: "example-rtl" } });
    assert.match(render(props), /<select[^>]*disabled=""/);
  }
  const empty = render({
    options: [],
    emptyLabel: "No approved options supplied",
  });
  assert.match(empty, /No approved options supplied/);
  assert.equal((empty.match(/<option /g) || []).length, 1);
});

test("unknown or missing current values remain unselected instead of choosing the first language", () => {
  for (const value of ["unknown", ""]) {
    const markup = render({ value, placeholder: "Choose an approved option" });
    assert.match(
      markup,
      /<option value="" disabled="" selected="">Choose an approved option/,
    );
    assert.doesNotMatch(markup, /value="example-ltr"[^>]*selected/);
  }
});

test("caller labels and native integration props are preserved without application side effects", () => {
  const ref = { current: null };
  const element = LanguageSwitcher({
    options,
    value: "example-rtl",
    onValueChange: () => {},
    ref,
    name: "locale",
    form: "settings",
    dir: "rtl",
    lang: "und",
    className: "consumer-control",
  });
  assert.equal(element.props.ref, ref);
  assert.equal(element.props.name, "locale");
  assert.equal(element.props.form, "settings");
  assert.equal(element.props.dir, "rtl");
  assert.equal(element.props.lang, "und");
  assert.match(element.props.className, /consumer-control/);
  const text = "Long example ".repeat(40) + "<script>";
  const markup = render({
    label: text,
    helperText: text,
    options: [{ value: "example", label: text }],
  });
  assert.equal((markup.match(/&lt;script&gt;/g) || []).length, 3);
  assert.doesNotMatch(markup, /<script>|<button|<form|<a /);
});

test("generated Select labels remain unique when multiple switchers render", () => {
  const markup = renderToStaticMarkup(
    createElement(
      "div",
      null,
      createElement(LanguageSwitcher),
      createElement(LanguageSwitcher),
    ),
  );
  const ids = [...markup.matchAll(/<select[^>]*id="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.equal(ids.length, 2);
  assert.notEqual(ids[0], ids[1]);
  for (const id of ids) assert.ok(markup.includes(`for="${id}"`));
});

test("malformed option contracts fail clearly rather than silently exposing bogus choices", () => {
  for (const props of [
    { options: null },
    { value: null },
    { label: " " },
    { placeholder: "" },
    { emptyLabel: "" },
    { options: [null] },
    { options: [{ value: "", label: "Example" }] },
    { options: [{ value: "example", label: "" }] },
    { options: [options[0], options[0]] },
    { options: [{ ...options[0], lang: "" }] },
    { options: [{ ...options[0], dir: "sideways" }] },
    { options: [{ ...options[0], disabled: "yes" }] },
  ])
    assert.throws(() => render(props), /LanguageSwitcher/);
});
