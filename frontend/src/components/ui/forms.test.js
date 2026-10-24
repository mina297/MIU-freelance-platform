import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

let server;
const controls = {};

before(async () => {
  server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  for (const name of [
    "Input",
    "Select",
    "Textarea",
    "Checkbox",
    "RadioGroup",
  ]) {
    controls[name] = (
      await server.ssrLoadModule(`/src/components/ui/${name}.jsx`)
    ).default;
  }
});

after(async () => server?.close());

const render = (name, props, children) =>
  renderToStaticMarkup(createElement(controls[name], props, children));

test("text controls associate labels, helper text and errors without losing caller descriptions", () => {
  for (const name of ["Input", "Select", "Textarea", "Checkbox"]) {
    const markup = render(name, {
      id: "example",
      label: "Example label",
      helperText: "Helpful context",
      error: "Specific validation error",
      "aria-describedby": "external-description",
      "aria-invalid": false,
      required: true,
    });
    assert.match(markup, /for="example"/);
    assert.match(markup, /id="example"/);
    assert.match(
      markup,
      /aria-describedby="external-description example-helper example-error"/,
    );
    assert.match(markup, /id="example-helper"/);
    assert.match(markup, /id="example-error"/);
    assert.match(markup, /aria-invalid="true"/);
    assert.match(markup, /required=""/);
    assert.match(markup, /Specific validation error/);
    assert.match(markup, /aria-hidden="true"/);
  }
});

test("generated IDs are unique within a form and have matching labels", () => {
  const markup = renderToStaticMarkup(
    createElement(
      "form",
      null,
      createElement(controls.Input, { label: "First" }),
      createElement(controls.Input, { label: "Second" }),
    ),
  );
  const ids = [...markup.matchAll(/<input[^>]* id="([^"]+)"/g)].map(
    (match) => match[1],
  );
  const labels = [...markup.matchAll(/<label[^>]* for="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.equal(ids.length, 2);
  assert.equal(new Set(ids).size, 2);
  assert.deepEqual(labels, ids);
});

test("optional feedback does not leave dangling description references", () => {
  const markup = render("Input", { label: "Name" });
  assert.doesNotMatch(markup, /aria-describedby|aria-invalid|role="alert"/);
  assert.match(
    render("Input", { label: "Name", "aria-invalid": true }),
    /aria-invalid="true"/,
  );
});

test("inputs preserve native validation and form attributes without business rules", () => {
  for (const type of ["text", "email", "password", "number", "search"]) {
    assert.match(
      render("Input", { label: "Value", type }),
      new RegExp(`type="${type}"`),
    );
  }
  const markup = render("Input", {
    label: "Amount",
    type: "number",
    name: "amount",
    form: "example",
    min: 0,
    max: 20,
    step: 0.5,
    defaultValue: 2,
    disabled: true,
  });
  for (const attribute of [
    'name="amount"',
    'form="example"',
    'min="0"',
    'max="20"',
    'step="0.5"',
    'value="2"',
    'disabled=""',
  ]) {
    assert.ok(markup.includes(attribute));
  }
});

test("text controls forward controlled values, callbacks and React 19 refs", () => {
  const onChange = () => {};
  const ref = { current: null };
  for (const name of ["Input", "Select", "Textarea"]) {
    const field = controls[name]({
      label: "Example",
      value: "chosen",
      onChange,
      ref,
    });
    const control = field.props.children({ id: "example" });
    assert.equal(control.props.value, "chosen");
    assert.equal(control.props.onChange, onChange);
    assert.equal(control.props.ref, ref);
  }
});

test("selects retain native options, selection, optgroups and disabled choices", () => {
  const markup = render(
    "Select",
    { label: "Choice", defaultValue: "two", disabled: true },
    createElement(
      "optgroup",
      { label: "Examples" },
      createElement("option", { value: "one", disabled: true }, "First"),
      createElement("option", { value: "two" }, "Second"),
    ),
  );
  assert.match(markup, /<select[^>]*disabled=""/);
  assert.match(markup, /<optgroup label="Examples">/);
  assert.match(markup, /<option value="one" disabled="">/);
  assert.match(markup, /<option value="two" selected="">/);
});

test("textarea supports multiline defaults and native length constraints", () => {
  const markup = render("Textarea", {
    label: "Details",
    rows: 6,
    maxLength: 200,
    defaultValue: "First line\nSecond line",
  });
  assert.match(markup, /rows="6"/);
  assert.match(markup, /maxLength="200"/);
  assert.match(markup, />First line\nSecond line<\/textarea>/);
});

test("checkbox retains native checked and disabled semantics", () => {
  const markup = render("Checkbox", {
    label: "Choose this",
    defaultChecked: true,
    disabled: true,
    name: "choice",
    value: "yes",
  });
  assert.match(markup, /type="checkbox"/);
  assert.match(markup, /checked=""/);
  assert.match(markup, /disabled=""/);
  const onChange = () => {};
  const field = controls.Checkbox({
    label: "Choice",
    checked: false,
    onChange,
  });
  const input = field.props.children({ id: "choice" });
  assert.equal(input.props.checked, false);
  assert.equal(input.props.onChange, onChange);
});

const options = [
  { value: "first", label: "First option" },
  { value: "second", label: "Second option", disabled: true },
];

test("radio groups use a legend and same-name native radios with independent labels", () => {
  const markup = render("RadioGroup", {
    id: "choice",
    label: "Choose one",
    name: "choice",
    options,
    defaultValue: "first",
    required: true,
    helperText: "Choose carefully",
    error: "Choose an available option",
  });
  assert.match(markup, /<fieldset/);
  assert.match(markup, /<legend[^>]*>Choose one/);
  assert.equal([...markup.matchAll(/name="choice"/g)].length, 2);
  assert.equal([...markup.matchAll(/type="radio"/g)].length, 2);
  assert.match(markup, /for="choice-0"/);
  assert.match(markup, /id="choice-0"/);
  const firstRadio = markup.match(/<input[^>]*value="first"[^>]*>/)?.[0];
  assert.ok(firstRadio);
  assert.match(firstRadio, /checked=""/);
  assert.match(markup, /disabled=""[^>]*value="second"/);
  assert.match(markup, /aria-describedby="choice-helper choice-error"/);
});

test("radio group controlled selection, callbacks, and whole-group disabled state are preserved", () => {
  const onChange = () => {};
  const field = controls.RadioGroup({
    label: "Choose",
    options,
    value: "second",
    onChange,
  });
  const group = field.props.children({ id: "example" });
  const inputs = group.props.children.map((label) => label.props.children[0]);
  assert.equal(inputs[0].props.checked, false);
  assert.equal(inputs[1].props.checked, true);
  assert.equal(inputs[0].props.name, inputs[1].props.name);
  assert.equal(inputs[0].props.onChange, onChange);
  assert.match(
    render("RadioGroup", { label: "Choose", options, disabled: true }),
    /<fieldset[^>]*disabled=""/,
  );
});

test("long labels and feedback remain intact and caller content is escaped", () => {
  const label = "A long label ".repeat(30);
  const markup = render("Input", {
    label,
    error: '<script>alert("example")</script>',
  });
  assert.ok(markup.includes(label));
  assert.doesNotMatch(markup, /<script>/);
  assert.match(markup, /&lt;script&gt;/);
});
