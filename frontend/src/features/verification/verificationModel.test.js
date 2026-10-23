import test from "node:test";
import assert from "node:assert/strict";
import {
  createVerificationState,
  filterVerificationCases,
  verificationReducer,
} from "./verificationModel.js";
const action = {
  type: "decide",
  caseId: "verification_001",
  outcome: "Approved",
  reason: "Fictional evidence reviewed.",
  actor: "Demo reviewer",
  eventId: "event_01",
  timestamp: "2026-10-23T12:00:00Z",
};
test("filters combine status, affiliation and normalized search without mutating fixtures", () => {
  const state = createVerificationState();
  assert.equal(
    filterVerificationCases(state.cases, { status: "Pending" }).length,
    2,
  );
  assert.deepEqual(
    filterVerificationCases(state.cases, {
      status: "Pending",
      affiliation: "External",
      query: "  NILE ",
    }).map((c) => c.id),
    ["verification_002"],
  );
  assert.equal(
    filterVerificationCases(state.cases, { query: "unknown" }).length,
    0,
  );
});
test("all three decisions atomically record actor, reason, time and before/after status", () => {
  for (const outcome of ["Approved", "Rejected", "Resubmission Requested"]) {
    const state = createVerificationState();
    const next = verificationReducer(state, { ...action, outcome });
    assert.equal(state.cases[0].status, "Pending");
    assert.equal(next.cases[0].status, outcome);
    assert.deepEqual(next.cases[0].history[0], {
      id: action.eventId,
      actor: action.actor,
      timestamp: action.timestamp,
      before: "Pending",
      after: outcome,
      reason: action.reason,
    });
    assert.equal(next.cases[1], state.cases[1]);
    assert.equal(verificationReducer(next, action), next);
  }
});
test("missing reasons, unknown records, unsupported transitions and invalid times are rejected", () => {
  const state = createVerificationState();
  for (const patch of [
    { reason: " " },
    { caseId: "missing" },
    { caseId: "verification_005" },
    { outcome: "Auto approved" },
    { timestamp: "invalid" },
    { actor: "" },
  ])
    assert.equal(verificationReducer(state, { ...action, ...patch }), state);
});
