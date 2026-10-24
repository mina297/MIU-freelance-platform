import test from "node:test";
import assert from "node:assert/strict";
import {
  createSupportState,
  filterSupportCases,
  supportAgent,
  supportReducer,
  supportSummary,
} from "./supportModel.js";
const event = {
  caseId: "support_001",
  actor: supportAgent,
  eventId: "event_test",
  timestamp: "2026-10-24T08:00:00Z",
  reason: "Fictional case reviewed.",
};
test("case metrics count active work only and filters combine queue, status, priority and text", () => {
  const cases = createSupportState().cases;
  assert.deepEqual(supportSummary(cases), {
    active: 3,
    disputes: 1,
    high: 2,
    unassigned: 2,
  });
  assert.deepEqual(supportSummary([]), {
    active: 0,
    disputes: 0,
    high: 0,
    unassigned: 0,
  });
  assert.deepEqual(
    filterSupportCases(cases, {
      type: "Dispute",
      status: "Open",
      priority: "High",
      query: " DEMO ARTS ",
    }).map((c) => c.id),
    ["support_003"],
  );
  assert.equal(
    filterSupportCases(cases, { query: "DEMO-SUPPORT-TXN-03" })[0].id,
    "support_004",
  );
  assert.equal(filterSupportCases(cases, { query: "missing" }).length, 0);
});
test("assignment and internal notes append an audit event without mutating source data", () => {
  const state = createSupportState();
  const next = supportReducer(state, { ...event, type: "assign" });
  assert.equal(next.cases[0].assignee, supportAgent);
  assert.equal(next.cases[0].status, "In review");
  assert.equal(state.cases[0].assignee, null);
  assert.equal(next.cases[1], state.cases[1]);
  const noted = supportReducer(next, {
    ...event,
    eventId: "event_2",
    type: "note",
  });
  assert.equal(noted.cases[0].history.length, 2);
  assert.equal(noted.cases[0].history[1].reason, event.reason);
  assert.equal(noted.cases[0].messages, state.cases[0].messages);
  assert.equal(supportReducer(noted, { ...event, type: "note" }), noted);
});
test("priority changes and nonfinancial resolution update only permitted fields", () => {
  const state = createSupportState();
  const prioritized = supportReducer(state, {
    ...event,
    type: "priority",
    priority: "High",
  });
  assert.equal(prioritized.cases[0].priority, "High");
  assert.equal(prioritized.cases[0].history[0].priorityBefore, "Normal");
  const resolved = supportReducer(prioritized, {
    ...event,
    eventId: "event_resolve",
    type: "resolve",
  });
  assert.equal(resolved.cases[0].status, "Resolved");
  assert.equal(
    supportReducer(resolved, { ...event, eventId: "new", type: "note" }),
    resolved,
  );
});
test("financial disputes cannot be resolved by Support and escalation preserves financial context", () => {
  const state = createSupportState();
  const financial = { ...event, caseId: "support_003" };
  assert.equal(supportReducer(state, { ...financial, type: "resolve" }), state);
  const escalated = supportReducer(state, {
    ...financial,
    type: "escalate",
    destination: "Finance",
  });
  assert.equal(escalated.cases[2].status, "Escalated");
  assert.equal(escalated.cases[2].history[0].destination, "Finance");
  assert.equal(escalated.cases[2].order, state.cases[2].order);
  assert.equal(
    supportReducer(state, {
      ...event,
      type: "escalate",
      destination: "Finance",
    }),
    state,
  );
  assert.equal(
    supportReducer(state, {
      ...event,
      type: "escalate",
      destination: "Super Admin",
    }).cases[0].status,
    "Escalated",
  );
});
test("invalid reasons, actions, dates, priorities and terminal cases leave all records unchanged", () => {
  const state = createSupportState();
  for (const patch of [
    { reason: " ", type: "note" },
    { type: "refund" },
    { type: "priority", priority: "Urgent" },
    { type: "priority", priority: "Normal" },
    { type: "assign", caseId: "missing" },
    { type: "assign", timestamp: "bad date" },
    { type: "note", caseId: "support_005" },
    { type: "note", caseId: "support_004" },
    { type: "note", actor: "" },
  ])
    assert.equal(supportReducer(state, { ...event, ...patch }), state);
});
