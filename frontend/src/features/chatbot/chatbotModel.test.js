import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_MESSAGE_LENGTH,
  FALLBACK_REPLY,
  SUGGESTED_QUESTIONS,
  getChatbotReply,
  validateMessage,
  createConversation,
  syncConversation,
  sendMessage,
} from "./chatbotModel.js";
import { INITIAL_SESSION, ROLES, sessionReducer } from "../auth/session.js";

const user = {
  id: "chat-student",
  displayName: "Test Student",
  role: ROLES.STUDENT,
  accountStatus: "active",
  verificationStatus: "pending",
};
const signedIn = sessionReducer(INITIAL_SESSION, { type: "start", user });

test("supported suggestions match each topic deterministically and whole words avoid false matches", () => {
  const topics = [
    "projects",
    "proposals",
    "services",
    "verification",
    "navigation",
  ];
  SUGGESTED_QUESTIONS.forEach((question, index) => {
    const reply = getChatbotReply(question);
    assert.equal(reply.topic, topics[index]);
    assert.deepEqual(getChatbotReply(`  ${question.toUpperCase()}  `), reply);
    assert.equal(getChatbotReply(question).text, reply.text);
  });
  assert.equal(
    getChatbotReply("How do verification and proposals work?").topic,
    "verification",
  );
  assert.equal(getChatbotReply("shipping forecast").topic, "fallback");
});

test("generic work and browse wording does not turn unsupported questions into projects", () => {
  for (const question of [
    "Why does my camera not work?",
    "How do notification settings work?",
    "How do I browse reviews?",
    "What's the weather?",
    "work",
    "browse",
  ]) {
    assert.deepEqual(
      getChatbotReply(question),
      {
        topic: "fallback",
        text: FALLBACK_REPLY,
      },
      question,
    );
  }
});

test("common sign-in phrases select account-access guidance", () => {
  const expected = getChatbotReply("login");
  assert.equal(expected.topic, "verification");
  for (const question of [
    "How does sign in work?",
    "How do I sign in?",
    "How do I sign-in?",
    "How do I log in?",
    "SIGN IN",
    "signin",
  ])
    assert.deepEqual(getChatbotReply(question), expected, question);
});

test("explicit project questions retain the existing project response", () => {
  const expected = getChatbotReply("projects");
  assert.equal(expected.topic, "projects");
  for (const question of [
    "How do I find projects?",
    "Where can I browse projects?",
    "How does a project work?",
    "Where can I browse jobs?",
    "Where can I find work?",
    "Help finding work",
  ])
    assert.deepEqual(getChatbotReply(question), expected, question);
});

test("unsupported requests fall back without pretending to perform actions or inspect accounts", () => {
  assert.deepEqual(getChatbotReply("What's the weather?"), {
    topic: "fallback",
    text: FALLBACK_REPLY,
  });
  assert.equal(
    getChatbotReply("What is my payment status?").text,
    FALLBACK_REPLY,
  );
  assert.match(
    getChatbotReply("Approve my verification").text,
    /cannot.*approve/i,
  );
  assert.match(getChatbotReply("Submit my proposal").text, /cannot submit/i);
  assert.match(
    getChatbotReply("Create an order").text,
    /cannot create an order/i,
  );
  assert.match(
    getChatbotReply("Contact support").text,
    /no support request is sent/i,
  );
});

test("empty and overlong messages fail without modifying conversation history", () => {
  for (const value of [
    undefined,
    null,
    42,
    "",
    " \n\t ",
    "x".repeat(MAX_MESSAGE_LENGTH + 1),
  ]) {
    assert.ok(validateMessage(value));
    assert.ok(getChatbotReply(value).error);
    const state = syncConversation(createConversation(), signedIn);
    const next = sendMessage(state, value);
    assert.equal(next.messages, state.messages);
    assert.ok(next.error);
  }
  assert.equal(validateMessage("x".repeat(MAX_MESSAGE_LENGTH)), "");
});

test("valid sends append a user/reply pair with stable unique IDs without mutating prior state", () => {
  const state = syncConversation(createConversation(), signedIn);
  const next = sendMessage(
    { ...state, draft: "  Browse projects  ", error: "old" },
    "  Browse projects  ",
  );
  assert.equal(state.messages.length, 1);
  assert.equal(next.messages.length, 3);
  assert.equal(next.messages[1].text, "Browse projects");
  assert.equal(next.draft, "");
  assert.equal(next.error, "");
  const again = sendMessage(next, "Help");
  assert.equal(new Set(again.messages.map(({ id }) => id)).size, 5);
  assert.equal(sendMessage(createConversation(), "Help").messages.length, 1);
});

test("same-account navigation and minimize/reopen preserve history; logout, expiry and account changes clear all private state", () => {
  const started = syncConversation(createConversation(), signedIn);
  const history = {
    ...sendMessage(started, "private fictional text"),
    open: true,
    draft: "unsent fictional text",
  };
  assert.equal(syncConversation(history, { ...signedIn }), history);
  const minimized = { ...history, open: false };
  assert.equal(syncConversation(minimized, signedIn), minimized);
  assert.equal(
    syncConversation({ ...minimized, open: true }, signedIn).messages,
    history.messages,
  );
  const other = sessionReducer(signedIn, {
    type: "start",
    user: { ...user, id: "other-account" },
  });
  for (const session of [
    sessionReducer(signedIn, { type: "logout" }),
    sessionReducer(signedIn, { type: "expire" }),
    other,
    { ...signedIn, user: { ...user, accountStatus: "suspended" } },
  ]) {
    const cleared = syncConversation(history, session);
    assert.equal(cleared.messages.length, 1);
    assert.equal(cleared.open, false);
    assert.equal(cleared.draft, "");
    assert.equal(cleared.error, "");
    assert.doesNotMatch(
      JSON.stringify(cleared),
      /private fictional|unsent fictional/,
    );
    assert.equal(syncConversation(cleared, signedIn).messages.length, 1);
  }
});
