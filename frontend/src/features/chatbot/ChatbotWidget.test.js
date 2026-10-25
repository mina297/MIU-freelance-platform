import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { ROLES } from "../auth/session.js";

let vite, Widget, Messages, AuthContext, App;
before(async () => {
  vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  ({ default: Widget, ChatbotMessages: Messages } = await vite.ssrLoadModule(
    "/src/features/chatbot/ChatbotWidget.jsx",
  ));
  ({ AuthContext } = await vite.ssrLoadModule("/src/contexts/AuthContext.js"));
  ({ default: App } = await vite.ssrLoadModule("/src/App.jsx"));
});
after(async () => {
  await vite?.close();
});
const user = {
  id: "chat-test",
  displayName: "Test Student",
  role: ROLES.STUDENT,
  accountStatus: "active",
  verificationStatus: "pending",
};
const active = { status: "authenticated", user };
const render = (session, child = createElement(Widget), path = "/") =>
  renderToStaticMarkup(
    createElement(
      MemoryRouter,
      { initialEntries: [path] },
      createElement(
        AuthContext.Provider,
        { value: { session, logout() {} } },
        child,
      ),
    ),
  );

test("widget is absent for anonymous, expired, inactive and malformed sessions", () => {
  for (const session of [
    { status: "anonymous", user: null },
    { status: "expired", user: null },
    { status: "expired", user },
    { status: "authenticated", user: null },
    ...["suspended", "deactivated"].map((accountStatus) => ({
      ...active,
      user: { ...user, accountStatus },
    })),
    { ...active, user: { ...user, role: "unknown" } },
  ])
    assert.equal(render(session), "");
});

test("every recognized active role gets an initially minimized, named nonmodal widget", () => {
  for (const role of Object.values(ROLES)) {
    const html = render({ ...active, user: { ...user, role } });
    assert.match(html, /Open assistant/);
    assert.match(html, /aria-expanded="false"/);
    assert.match(html, /<section[^>]*hidden=""/);
    assert.match(html, /not a real AI service/);
    assert.match(html, /role="log"/);
    assert.match(html, /aria-live="polite"/);
    assert.match(html, /maxLength="500"/i);
    assert.match(html, /Your message/);
    assert.doesNotMatch(html, /aria-modal|<dialog/);
    const panelId = html.match(/<section[^>]*id="([^"]+)"/)[1];
    assert.ok(html.includes(`aria-controls="${panelId}"`));
  }
});

test("conversation text is escaped rather than interpreted as HTML", () => {
  const html = renderToStaticMarkup(
    createElement(Messages, {
      messages: [
        {
          id: "sample",
          author: "user",
          text: '<img src=x onerror="alert(1)"><script>test</script>',
        },
      ],
    }),
  );
  assert.match(html, /&lt;img/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<img|<script/);
});

test("redesigned presentation retains named controls, suggested question intents and simulation disclosure", () => {
  const html = render(active);
  assert.match(html, />MIU Assistant<\/h2>/);
  assert.match(html, /PROTOTYPE ASSISTANT/);
  assert.match(html, /aria-label="Open assistant"/);
  assert.match(html, /aria-label="Minimize assistant"/);
  assert.match(html, /aria-label="Send message"/);
  assert.match(html, /aria-label="How do I find projects\?"/);
  assert.match(html, /aria-label="How do proposals work\?"/);
  assert.match(html, /aria-label="Where can I browse services and orders\?"/);
  assert.match(html, /aria-label="How does verification work\?"/);
  assert.match(html, /aria-label="Where can I find help\?"/);
  assert.match(html, /Simulated responses/);
  assert.match(html, /not a real AI service/);
  assert.match(html, /Temporary chat/);
  assert.match(html, /Ready to help · Simulated/);
  assert.match(html, /lucide-x/);
  assert.doesNotMatch(html, /chatbot-launcher-copy|chatbot-launcher-badge/);
  assert.equal(
    (html.match(/<img[^>]*src="[^"]*miu-assistant-character\.jpg"/g) ?? [])
      .length,
    3,
  );
  assert.doesNotMatch(html, /Online|Live agent/);
});

test("actual App composition mounts one widget beside the router under its existing provider across layouts", () => {
  // Render App's actual children with MemoryRouter and a supplied session.
  // BrowserRouter and AuthProvider themselves remain the production owners.
  const theme = App();
  const browser = theme.props.children;
  const provider = browser.props.children;
  const children = provider.props.children;
  assert.equal(children.length, 3);
  assert.equal(children.filter((child) => child.type === Widget).length, 1);
  for (const role of [ROLES.STUDENT, ROLES.CLIENT, ROLES.SUPER_ADMIN]) {
    const session = { ...active, user: { ...user, role } };
    const dashboard =
      role === ROLES.SUPER_ADMIN ? "/admin" : `/${role}/dashboard`;
    for (const path of ["/", "/projects", "/services", "/login", dashboard]) {
      const html = render(session, children, path);
      assert.equal(
        (html.match(/class="chatbot-widget"/g) ?? []).length,
        1,
        path,
      );
    }
  }
  assert.doesNotMatch(
    render({ status: "anonymous", user: null }, children),
    /class="chatbot-widget"/,
  );
});
