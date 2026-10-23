import test from "node:test";
import assert from "node:assert/strict";
import {
  createQualityState,
  filterQualityReports,
  qualityReducer,
  qualitySummary,
  evaluations,
} from "./qualityModel.js";
const event = {
  reportId: "quality_001",
  reason: "Fictional sample reviewed.",
  actor: "Demo AI Quality Reviewer",
  eventId: "event_test",
  timestamp: "2026-10-23T12:00:00Z",
};
test("quality metrics expose exact sample denominators and handle no samples", () => {
  assert.deepEqual(qualitySummary(createQualityState().reports), {
    total: 60,
    errors: 7,
    errorRate: "11.7%",
    open: 4,
    flagged: 2,
  });
  assert.equal(
    evaluations.every((e) => e.errors <= e.samples),
    true,
  );
  assert.deepEqual(qualitySummary([], []), {
    total: 0,
    errors: 0,
    errorRate: "—",
    open: 0,
    flagged: 0,
  });
});
test("quality search combines area, status and normalized terms", () => {
  const reports = createQualityState().reports;
  assert.deepEqual(
    filterQualityReports(reports, {
      service: "Moderation",
      status: "Open",
      query: " FALSE POSITIVE ",
    }).map((r) => r.id),
    ["quality_003"],
  );
  assert.equal(filterQualityReports(reports, { query: "missing" }).length, 0);
});
test("assignment and resolution record auditable immutable transitions without changing metrics", () => {
  const state = createQualityState();
  const assigned = qualityReducer(state, { ...event, type: "assign" });
  assert.equal(assigned.reports[0].status, "In review");
  assert.equal(assigned.reports[0].assignee, event.actor);
  assert.equal(state.reports[0].status, "Open");
  assert.equal(assigned.reports[1], state.reports[1]);
  const resolved = qualityReducer(assigned, {
    ...event,
    eventId: "event_2",
    type: "finding",
    outcome: "Resolved",
  });
  assert.equal(resolved.reports[0].history[1].before, "In review");
  assert.equal(resolved.reports[0].history[1].after, "Resolved");
  assert.equal(qualitySummary(resolved.reports).errorRate, "11.7%");
  assert.equal(
    qualityReducer(resolved, { ...event, type: "assign" }),
    resolved,
  );
});
test("escalation respects committee scope and rejects invalid or reasonless actions", () => {
  const state = createQualityState();
  for (const patch of [
    { type: "escalate", destination: "Finance" },
    { type: "escalate", destination: "Marketplace Operations" },
    { type: "finding", outcome: "Resolved", reason: " " },
    { type: "assign", timestamp: "invalid" },
    { type: "assign", reportId: "missing" },
  ])
    assert.equal(qualityReducer(state, { ...event, ...patch }), state);
  const escalated = qualityReducer(state, {
    ...event,
    type: "escalate",
    reportId: "quality_003",
    destination: "Marketplace Operations",
  });
  assert.equal(escalated.reports[2].status, "Escalated");
  assert.equal(
    escalated.reports[2].history[0].destination,
    "Marketplace Operations",
  );
});
