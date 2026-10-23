import { mockUsers } from "../../data/fixtures/users.js";
export const committees = [
  {
    id: "verification",
    name: "Verification",
    account: "committee_verification_001",
    description: "MIU ID and external government ID reviews",
    scope: "Identity cases",
    pending: 8,
  },
  {
    id: "marketplace",
    name: "Marketplace Operations",
    account: "committee_marketplace_001",
    description: "Jobs, services, proposals and content reports",
    scope: "Marketplace content",
    pending: 12,
  },
  {
    id: "finance",
    name: "Finance",
    account: "committee_finance_001",
    description: "Transactions, escrow, refunds, payouts and fees",
    scope: "Sandbox finance",
    pending: 3,
  },
  {
    id: "support",
    name: "Support & Disputes",
    account: "committee_support_001",
    description: "Tickets, disputes, evidence and resolutions",
    scope: "Support cases",
    pending: 6,
  },
  {
    id: "ai-quality",
    name: "AI & Quality",
    account: "committee_ai_quality_001",
    description: "Matching, chatbot, moderation and error reports",
    scope: "Quality reports",
    pending: 4,
  },
];
export const initialCases = [
  {
    id: "case_01",
    title: "External profile resubmission",
    committee: "verification",
    priority: "Normal",
    status: "Pending",
    detail:
      "A fictional external client requested another identity review. Government ID evidence is represented by a placeholder; no identity documents are stored.",
  },
  {
    id: "case_02",
    title: "Reported service description",
    committee: "marketplace",
    priority: "High",
    status: "Escalated",
    detail:
      "Marketplace Operations escalated a reported service description for a final human decision. The demo contains no real reported content.",
  },
  {
    id: "case_03",
    title: "Disputed project delivery",
    committee: "support",
    priority: "High",
    status: "Escalated",
    detail:
      "Fictional delivery evidence: the client reports missing source files; the student requests clarification. Review the issue before recording a final decision. No financial action is performed.",
  },
];
export const transactions = [
  { id: "txn_01", type: "Escrow held", amount: 7500, status: "Held" },
  { id: "txn_02", type: "Payout", amount: 3200, status: "Pending" },
  { id: "txn_03", type: "Refund", amount: 1200, status: "Pending" },
  { id: "txn_04", type: "Platform fee", amount: 350, status: "Recorded" },
];
export function createAdminState() {
  return {
    users: mockUsers
      .filter((u) => u.role !== "super_admin")
      .map((u) => ({ ...u })),
    cases: initialCases.map((c) => ({ ...c })),
    audit: [],
    grants: Object.fromEntries(committees.map((c) => [c.id, true])),
  };
}
// Mutations and their audit event commit together; timestamps/IDs are supplied by the caller.
export function adminReducer(state, action) {
  if (!action.reason?.trim() || !action.eventId || !action.timestamp)
    return state;
  let next;
  let before;
  let after;
  if (action.type === "status") {
    const user = state.users.find((u) => u.id === action.target);
    if (
      !user ||
      !["active", "suspended"].includes(action.value) ||
      user.accountStatus === action.value
    )
      return state;
    before = user.accountStatus;
    after = action.value;
    next = {
      ...state,
      users: state.users.map((u) =>
        u.id === user.id ? { ...u, accountStatus: after } : u,
      ),
    };
  } else if (action.type === "decision") {
    const record = state.cases.find((c) => c.id === action.target);
    if (
      !record ||
      !["Pending", "Escalated"].includes(record.status) ||
      !["Approved", "Rejected", "Resubmission requested"].includes(action.value)
    )
      return state;
    before = record.status;
    after = action.value;
    next = {
      ...state,
      cases: state.cases.map((c) =>
        c.id === record.id ? { ...c, status: after } : c,
      ),
    };
  } else if (action.type === "permission") {
    if (
      !committees.some((c) => c.id === action.target) ||
      typeof action.value !== "boolean"
    )
      return state;
    before = state.grants[action.target];
    after = action.value;
    if (before === after) return state;
    next = { ...state, grants: { ...state.grants, [action.target]: after } };
  } else if (action.type === "create") {
    const { name, email, committee } = action.value;
    if (
      !name?.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !committees.some((c) => c.id === committee) ||
      state.users.some((u) => u.email?.toLowerCase() === email.toLowerCase())
    )
      return state;
    before = "Not created";
    after = committee;
    next = {
      ...state,
      users: [
        ...state.users,
        {
          id: action.target,
          displayName: name.trim(),
          email,
          role: mockUsers.find(
            (u) => u.id === committees.find((c) => c.id === committee).account,
          ).role,
          accountStatus: "active",
        },
      ],
    };
  } else return state;
  return {
    ...next,
    audit: [
      {
        id: action.eventId,
        timestamp: action.timestamp,
        actor: "Demo Super Admin",
        action: action.type,
        target: action.target,
        reason: action.reason.trim(),
        before,
        after,
        result: "Simulated success",
      },
      ...state.audit,
    ],
  };
}
