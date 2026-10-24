import test from "node:test";
import assert from "node:assert/strict";
import { createAdminState, adminReducer, committees } from "./adminModel.js";
const event = {
  reason: "Reviewed fictional case",
  eventId: "event_01",
  timestamp: "2026-10-23T10:00:00Z",
};
test("a decision and complete audit record commit together without mutating fixtures", () => {
  const before = createAdminState();
  const after = adminReducer(before, {
    ...event,
    type: "decision",
    target: "case_02",
    value: "Rejected",
  });
  assert.equal(after.cases[1].status, "Rejected");
  assert.equal(before.cases[1].status, "Escalated");
  assert.equal(after.audit[0].before, "Escalated");
  assert.equal(after.audit[0].after, "Rejected");
  assert.equal(after.audit[0].reason, event.reason);
  assert.equal(
    adminReducer(after, {
      ...event,
      type: "decision",
      target: "case_02",
      value: "Approved",
    }),
    after,
  );
});
test("invalid and reasonless actions leave all records unchanged", () => {
  const state = createAdminState();
  for (const action of [
    { type: "status", target: "student_001", value: "deleted" },
    { type: "decision", target: "missing", value: "Approved" },
    { type: "permission", target: "unknown", value: true },
  ])
    assert.equal(adminReducer(state, { ...event, ...action }), state);
  assert.equal(
    adminReducer(state, {
      ...event,
      reason: " ",
      type: "status",
      target: "student_001",
      value: "suspended",
    }),
    state,
  );
});
test("committee provisioning validates domains and duplicate emails", () => {
  const state = createAdminState();
  const action = {
    ...event,
    type: "create",
    target: "new_01",
    value: {
      name: "Demo Reviewer",
      email: "reviewer@example.test",
      committee: "finance",
    },
  };
  const created = adminReducer(state, action);
  assert.equal(created.users.at(-1).role, "finance_committee");
  assert.equal(created.audit.length, 1);
  assert.equal(adminReducer(created, { ...action, target: "new_02" }), created);
  assert.equal(
    adminReducer(state, {
      ...action,
      value: { ...action.value, committee: "super_admin" },
    }),
    state,
  );
});
test("account and scoped permission changes remain independent of other domains", () => {
  let state = createAdminState();
  state = adminReducer(state, {
    ...event,
    type: "status",
    target: "student_001",
    value: "suspended",
  });
  assert.equal(
    state.users.find((u) => u.id === "student_001").accountStatus,
    "suspended",
  );
  state = adminReducer(state, {
    ...event,
    type: "permission",
    target: "finance",
    value: false,
  });
  assert.equal(state.grants.finance, false);
  assert.equal(state.grants.verification, true);
  assert.equal(committees.length, 5);
});
