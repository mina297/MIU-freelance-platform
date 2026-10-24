// Safe fictional case records; no private messages, uploads, credentials or payment data.
export const supportTypes = ["Ticket", "Complaint", "Dispute"];
export const supportStatuses = ["Open", "In review", "Resolved", "Escalated"];
export const supportPriorities = ["High", "Normal", "Low"];
export const supportAgent = "Demo Support Reviewer";
export function createSupportState() {
  return {
    cases: [
      {
        id: "support_001",
        title: "Help finding the password reset form",
        type: "Ticket",
        status: "Open",
        priority: "Normal",
        requester: "Demo Mariam",
        assignee: null,
        submitted: "2026-10-23",
        financial: false,
        summary:
          "A fictional student cannot find the password recovery page. Provide navigation guidance without requesting credentials.",
        order: null,
        messages: [
          {
            id: "msg_01",
            sender: "Demo Mariam",
            text: "Where can I find password recovery?",
            timestamp: "2026-10-23T09:00:00Z",
          },
        ],
        evidence: [],
        history: [],
      },
      {
        id: "support_002",
        title: "Delivery files do not include the source layout",
        type: "Complaint",
        status: "In review",
        priority: "High",
        requester: "Demo Nile Studio",
        assignee: supportAgent,
        submitted: "2026-10-22",
        financial: false,
        summary:
          "The client and student are discussing a missing editable layout. Support can record a nonfinancial resolution after reviewing the fictional evidence.",
        order: {
          id: "support_order_01",
          title: "Campaign design package",
          source: "Service",
          client: "Demo Nile Studio",
          student: "Demo Salma",
          status: "Revision requested",
          amountEGP: 4000,
          transaction: null,
        },
        messages: [
          {
            id: "msg_02",
            sender: "Demo Nile Studio",
            text: "The final preview is available, but I cannot find the editable source.",
            timestamp: "2026-10-22T10:00:00Z",
          },
          {
            id: "msg_03",
            sender: "Demo Salma",
            text: "I will clarify the source-file handover in the order workspace.",
            timestamp: "2026-10-22T11:00:00Z",
          },
        ],
        evidence: [
          {
            id: "evidence_01",
            name: "Delivery checklist · fictional text",
            detail:
              "Sample checklist: preview supplied; editable source handover requires clarification. This is a text placeholder, not an uploaded file.",
          },
        ],
        history: [],
      },
      {
        id: "support_003",
        title: "Refund requested for disputed project delivery",
        type: "Dispute",
        status: "Open",
        priority: "High",
        requester: "Demo Arts Club",
        assignee: null,
        submitted: "2026-10-23",
        financial: true,
        summary:
          "A fictional client requests a refund after a delivery disagreement. Support reviews context and escalates the financial decision; no refund authority is assumed.",
        order: {
          id: "support_order_02",
          title: "Festival poster series",
          source: "Project",
          client: "Demo Arts Club",
          student: "Demo Omar",
          status: "Disputed",
          amountEGP: 2500,
          transaction: "DEMO-SUPPORT-TXN-02",
        },
        messages: [
          {
            id: "msg_04",
            sender: "Demo Arts Club",
            text: "The submitted work differs from our agreed brief. We request a review.",
            timestamp: "2026-10-23T08:00:00Z",
          },
          {
            id: "msg_05",
            sender: "Demo Omar",
            text: "Please compare the fictional delivery checklist with the requested scope.",
            timestamp: "2026-10-23T09:00:00Z",
          },
        ],
        evidence: [
          {
            id: "evidence_02",
            name: "Agreed scope · fictional text",
            detail:
              "Sample scope: three poster layouts and editable source files. No real agreement or private attachment is stored.",
          },
          {
            id: "evidence_03",
            name: "Delivery summary · fictional text",
            detail:
              "Sample delivery: two draft previews; parties disagree about the final deliverables. This preview does not determine entitlement to funds.",
          },
        ],
        history: [],
      },
      {
        id: "support_004",
        title: "Payout status requires finance review",
        type: "Dispute",
        status: "Escalated",
        priority: "Normal",
        requester: "Demo Nour",
        assignee: supportAgent,
        submitted: "2026-10-21",
        financial: true,
        summary:
          "A payout inquiry was escalated to the Finance Committee. Support cannot change payout status.",
        order: {
          id: "support_order_03",
          title: "Student society identity",
          source: "Project",
          client: "Demo Science Club",
          student: "Demo Nour",
          status: "Completed",
          amountEGP: 3800,
          transaction: "DEMO-SUPPORT-TXN-03",
        },
        messages: [
          {
            id: "msg_06",
            sender: "Demo Nour",
            text: "Please help me understand this fictional payout status.",
            timestamp: "2026-10-21T09:00:00Z",
          },
        ],
        evidence: [],
        history: [
          {
            id: "support_event_seed",
            actor: supportAgent,
            timestamp: "2026-10-22T12:00:00Z",
            action: "escalate",
            before: "In review",
            after: "Escalated",
            reason:
              "Financial status requires the authorized Finance Committee.",
            destination: "Finance",
            priorityBefore: "Normal",
            priorityAfter: "Normal",
          },
        ],
      },
      {
        id: "support_005",
        title: "Service package guidance provided",
        type: "Ticket",
        status: "Resolved",
        priority: "Low",
        requester: "Demo Campus Team",
        assignee: supportAgent,
        submitted: "2026-10-20",
        financial: false,
        summary:
          "A fictional client received guidance on comparing a package and its permitted extras.",
        order: null,
        messages: [
          {
            id: "msg_07",
            sender: "Demo Campus Team",
            text: "Where can I compare the package scope and extras?",
            timestamp: "2026-10-20T08:00:00Z",
          },
        ],
        evidence: [],
        history: [
          {
            id: "support_event_seed_2",
            actor: supportAgent,
            timestamp: "2026-10-20T10:00:00Z",
            action: "resolve",
            before: "In review",
            after: "Resolved",
            reason:
              "Package guidance was documented in this fictional example.",
            destination: null,
            priorityBefore: "Low",
            priorityAfter: "Low",
          },
        ],
      },
    ],
  };
}
export function filterSupportCases(
  cases,
  { type = "All", status = "All", priority = "All", query = "" } = {},
) {
  const needle = query.trim().toLowerCase();
  return cases.filter(
    (c) =>
      (type === "All" || c.type === type) &&
      (status === "All" || c.status === status) &&
      (priority === "All" || c.priority === priority) &&
      `${c.id} ${c.title} ${c.requester} ${c.assignee || ""} ${c.order?.id || ""} ${c.order?.transaction || ""}`
        .toLowerCase()
        .includes(needle),
  );
}
export function supportSummary(cases) {
  const active = cases.filter((c) => ["Open", "In review"].includes(c.status));
  return {
    active: active.length,
    disputes: active.filter((c) => c.type === "Dispute").length,
    high: active.filter((c) => c.priority === "High").length,
    unassigned: active.filter((c) => !c.assignee).length,
  };
}
export function supportReducer(state, action) {
  const record = state.cases.find((c) => c.id === action.caseId);
  if (
    !record ||
    !["Open", "In review"].includes(record.status) ||
    !action.reason?.trim() ||
    !action.actor ||
    !action.eventId ||
    !Number.isFinite(Date.parse(action.timestamp)) ||
    state.cases.some((c) => c.history.some((e) => e.id === action.eventId))
  )
    return state;
  let after = record.status;
  if (action.type === "assign" && !record.assignee) after = "In review";
  else if (action.type === "resolve" && !record.financial) after = "Resolved";
  else if (
    action.type === "escalate" &&
    (action.destination === "Super Admin" ||
      (record.financial && action.destination === "Finance"))
  )
    after = "Escalated";
  else if (
    action.type === "priority" &&
    supportPriorities.includes(action.priority) &&
    action.priority !== record.priority
  )
    after = record.status;
  else if (action.type !== "note") return state;
  const priority =
    action.type === "priority" ? action.priority : record.priority;
  const event = {
    id: action.eventId,
    actor: action.actor,
    timestamp: action.timestamp,
    action: action.type,
    before: record.status,
    after,
    reason: action.reason.trim(),
    destination: action.type === "escalate" ? action.destination : null,
    priorityBefore: record.priority,
    priorityAfter: priority,
  };
  return {
    cases: state.cases.map((c) =>
      c.id === record.id
        ? {
            ...c,
            status: after,
            priority,
            assignee: action.type === "assign" ? supportAgent : c.assignee,
            history: [...c.history, event],
          }
        : c,
    ),
  };
}
