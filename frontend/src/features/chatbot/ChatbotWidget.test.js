import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { ROLES } from "../auth/session.js";

let vite, Widget, Messages, AuthContext, Router;
before(async () => {
  vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  ({ default: Widget, ChatbotMessages: Messages } = await vite.ssrLoadModule(
    "/src/features/chatbot/ChatbotWidget.jsx",
  ));
  ({ AuthContext } = await vite.ssrLoadModule("/src/contexts/AuthContext.js"));
  ({ default: Router } = await vite.ssrLoadModule("/src/app/router.jsx"));
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

test("public guidance remains available for guests, expired and invalid sessions without account data", () => {
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
  ]) {
    const html = render(session);
    assert.match(html, /aria-label="Open assistant"/);
    assert.match(html, /About the platform/);
    assert.doesNotMatch(html, /Test Student|chat-test/);
  }
});

test("every recognized active role gets an initially minimized, named nonmodal widget", () => {
  for (const role of Object.values(ROLES)) {
    const html = render({ ...active, user: { ...user, role } });
    assert.match(html, /Open assistant/);
    assert.match(html, /aria-expanded="false"/);
    assert.match(html, /<section[^>]*hidden=""/);
    assert.match(html, /Not a real AI service/);
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

test("approved compact design exposes public starter buttons, action menu and simulation disclosure", () => {
  const html = render(active);
  assert.match(html, /MIU Assistant<\/h2>/);
  assert.match(html, /aria-label="Open assistant"/);
  assert.match(html, /aria-label="Send message"/);
  for (const label of [
    "About the platform",
    "How it works",
    "Find work",
    "Hire talent",
    "Quick Actions",
    "Minimize chat",
    "Collapse view",
    "New conversation",
  ])
    assert.ok(html.includes(label), label);
  assert.match(html, /Demo replies · Not a real AI service/);
  assert.match(html, /Demo assistant · Predefined replies/);
  assert.match(html, /Compose your message…/);
  assert.match(html, /lucide-x/);
  assert.doesNotMatch(html, /chatbot-launcher-copy|chatbot-launcher-badge/);
  assert.equal(
    (html.match(/<img[^>]*src="[^"]*miu-assistant-character\.jpg"/g) ?? [])
      .length,
    1,
  );
  assert.match(html, /class="chatbot-character"/);
  assert.match(html, /miu-assistant-cutout\.png/);
  assert.match(html, /class="chatbot-character-arm"/);
  assert.match(html, /class="chatbot-character-eyes"/);
  assert.doesNotMatch(html, /Online|Live agent/);
});

test("App declares one widget under authentication and routed layouts retain its role visibility", async () => {
  // Check wiring without invoking App outside React (App has startup hooks).
  const source = await readFile(
    new URL("../../App.jsx", import.meta.url),
    "utf8",
  );
  assert.equal((source.match(/<ChatbotWidget\s*\/>/g) ?? []).length, 1);
  assert.match(
    source,
    /<AuthProvider>[\s\S]*<AppRouter\s*\/>[\s\S]*<ChatbotWidget\s*\/>[\s\S]*<\/AuthProvider>/,
  );
  const children = [
    createElement(Router, { key: "router" }),
    createElement(Widget, { key: "assistant" }),
  ];
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
  assert.equal(
    (
      render({ status: "anonymous", user: null }, children).match(
        /class="chatbot-widget"/g,
      ) ?? []
    ).length,
    1,
  );
});

test("guidance renders only approved public destinations and escapes link labels", () => {
  const html = render(
    active,
    createElement(Messages, {
      messages: [
        {
          id: "guidance",
          author: "assistant",
          text: "Public guidance",
          links: [
            { label: "Browse projects <script>", to: "/projects" },
            { label: "Unsafe", to: "javascript:alert(1)" },
            { label: "Private", to: "/admin" },
          ],
        },
      ],
    }),
  );
  assert.match(html, /href="\/projects"/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /javascript:|href="\/admin"|>Unsafe<|>Private</);
});
