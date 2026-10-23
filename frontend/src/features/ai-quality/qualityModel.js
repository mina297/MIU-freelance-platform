// Fixed fictional evaluation samples, not live telemetry or approved quality thresholds.
export const evaluations = [
  {
    id: "eval_matching",
    service: "Matching",
    samples: 20,
    errors: 3,
    criterion: "Recommendation fits the stated skills and task.",
    date: "2026-10-23",
  },
  {
    id: "eval_chatbot",
    service: "Chatbot",
    samples: 20,
    errors: 2,
    criterion:
      "Answer follows documented guidance without inventing account decisions.",
    date: "2026-10-23",
  },
  {
    id: "eval_moderation",
    service: "Moderation",
    samples: 20,
    errors: 2,
    criterion: "Flag agrees with the fictional human reference label.",
    date: "2026-10-23",
  },
];
export const qualityServices = ["Matching", "Chatbot", "Moderation"];
export const qualityStatuses = ["Open", "In review", "Resolved", "Escalated"];
export function createQualityState() {
  return {
    reports: [
      {
        id: "quality_001",
        title: "Recommendation misses required skill",
        service: "Matching",
        category: "Relevance feedback",
        status: "Open",
        priority: "Normal",
        date: "2026-10-23",
        input:
          "Fictional project brief: build an accessible React event website.",
        output:
          "A sample recommendation emphasizes illustration instead of React.",
        expected:
          "Review skill relevance and document why this recommendation was unhelpful.",
        assignee: null,
        history: [],
      },
      {
        id: "quality_002",
        title: "Chatbot claims a refund was approved",
        service: "Chatbot",
        category: "Incorrect answer",
        status: "Open",
        priority: "High",
        date: "2026-10-23",
        input: "Fictional question: how do I request a refund?",
        output: "Sample incorrect answer: your refund has been approved.",
        expected:
          "Explain the support workflow; a chatbot cannot confirm a financial decision.",
        assignee: null,
        history: [],
      },
      {
        id: "quality_003",
        title: "Benign review incorrectly flagged",
        service: "Moderation",
        category: "False positive",
        status: "Open",
        priority: "Normal",
        date: "2026-10-22",
        input:
          "Fictional review: the first draft needed changes, and the student addressed them.",
        output: "Sample automated flag: potentially abusive content.",
        expected:
          "Human reference label: benign. Record a false-positive finding; Marketplace Operations owns content action.",
        assignee: null,
        history: [],
      },
      {
        id: "quality_004",
        title: "Reported comment missed by moderation",
        service: "Moderation",
        category: "False negative",
        status: "In review",
        priority: "High",
        date: "2026-10-22",
        input:
          "Fictional comment: [hostile language omitted from this safe sample].",
        output: "Sample automated result: no flag.",
        expected:
          "Human reference label: needs moderation review. Examine the missed flag without taking enforcement action.",
        assignee: "Demo AI Quality Reviewer",
        history: [
          {
            id: "quality_event_seed",
            timestamp: "2026-10-22T11:00:00Z",
            actor: "Demo AI Quality Reviewer",
            action: "assign",
            before: "Open",
            after: "In review",
            reason: "Assigned for a fictional quality review.",
            destination: null,
          },
        ],
      },
    ],
  };
}
export function filterQualityReports(
  reports,
  { service = "All", status = "All", query = "" } = {},
) {
  const needle = query.trim().toLowerCase();
  return reports.filter(
    (r) =>
      (service === "All" || r.service === service) &&
      (status === "All" || r.status === status) &&
      `${r.title} ${r.id} ${r.category}`.toLowerCase().includes(needle),
  );
}
export function qualitySummary(reports, samples = evaluations) {
  const total = samples.reduce((sum, item) => sum + item.samples, 0);
  const errors = samples.reduce((sum, item) => sum + item.errors, 0);
  return {
    total,
    errors,
    errorRate: total ? `${((errors / total) * 100).toFixed(1)}%` : "—",
    open: reports.filter((r) => ["Open", "In review"].includes(r.status))
      .length,
    flagged: reports.filter((r) => r.service === "Moderation").length,
  };
}
export function qualityReducer(state, action) {
  const record = state.reports.find((r) => r.id === action.reportId);
  if (
    !record ||
    !["Open", "In review"].includes(record.status) ||
    !action.reason?.trim() ||
    !action.actor ||
    !action.eventId ||
    !Number.isFinite(Date.parse(action.timestamp))
  )
    return state;
  let after;
  if (action.type === "assign" && !record.assignee) after = "In review";
  else if (
    action.type === "finding" &&
    ["In review", "Resolved"].includes(action.outcome)
  )
    after = action.outcome;
  else if (
    action.type === "escalate" &&
    (action.destination === "Super Admin" ||
      (record.service === "Moderation" &&
        action.destination === "Marketplace Operations"))
  )
    after = "Escalated";
  else return state;
  const event = {
    id: action.eventId,
    timestamp: action.timestamp,
    actor: action.actor,
    action: action.type,
    before: record.status,
    after,
    reason: action.reason.trim(),
    destination: action.type === "escalate" ? action.destination : null,
  };
  return {
    ...state,
    reports: state.reports.map((r) =>
      r.id === record.id
        ? {
            ...r,
            status: after,
            assignee:
              action.type === "assign"
                ? "Demo AI Quality Reviewer"
                : r.assignee,
            history: [...r.history, event],
          }
        : r,
    ),
  };
}
