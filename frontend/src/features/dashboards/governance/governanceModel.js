import { mockUsers } from "../../../data/fixtures/users.js";
import { ROLES } from "../../auth/session.js";

export const userRoleOptions = [
  { value: ROLES.STUDENT, label: "Student" },
  { value: ROLES.VERIFICATION, label: "Verification" },
  { value: ROLES.MARKETPLACE, label: "Marketplace Operations" },
  { value: ROLES.FINANCE, label: "Finance" },
  { value: ROLES.SUPPORT, label: "Support & Disputes" },
  { value: ROLES.AI_QUALITY, label: "AI & Quality" },
];

export const userStatusOptions = ["Active", "Verified", "In Progress"];
export const initialPlatformSettings = Object.freeze({
  commissionPercent: null,
  minProjectBudgetEGP: null,
  maxProjectBudgetEGP: null,
  maintenanceMode: false,
});
export const committees = [
  {
    id: "verification",
    name: "Verification",
    account: "committee_verification_001",
    description: "MIU ID and external government ID reviews",
    scope: "Identity cases",
  },
  {
    id: "marketplace",
    name: "Marketplace Operations",
    account: "committee_marketplace_001",
    description: "Jobs, services, proposals and content reports",
    scope: "Marketplace content",
  },
  {
    id: "finance",
    name: "Finance",
    account: "committee_finance_001",
    description: "Transactions, escrow, refunds, payouts and fees",
    scope: "Sandbox finance",
  },
  {
    id: "support",
    name: "Support & Disputes",
    account: "committee_support_001",
    description: "Tickets, disputes, evidence and resolutions",
    scope: "Support cases",
  },
  {
    id: "ai-quality",
    name: "AI & Quality",
    account: "committee_ai_quality_001",
    description: "Matching, chatbot, moderation and error reports",
    scope: "Quality reports",
  },
];
export const initialCases = [
  {
    id: "case_01",
    title: "External profile resubmission",
    category: "Identity verification",
    committee: "verification",
    priority: "Normal",
    status: "Pending",
    detail:
      "A fictional external client requested another identity review. Government ID evidence is represented by a placeholder; no identity documents are stored.",
  },
  {
    id: "case_02",
    title: "Reported service description",
    category: "Flagged content",
    committee: "marketplace",
    priority: "High",
    status: "Escalated",
    detail:
      "Marketplace Operations escalated a reported service description for a final human decision. This preview contains no real reported content.",
  },
  {
    id: "case_03",
    title: "Disputed project delivery",
    category: "Escalated dispute",
    committee: "support",
    priority: "High",
    status: "Escalated",
    detail:
      "Fictional delivery evidence: the client reports missing source files; the student requests clarification. Review the issue before recording a final decision. No financial action is performed.",
  },
  {
    id: "case_04",
    title: "Escrow reconciliation check",
    category: "Finance exception",
    committee: "finance",
    priority: "Normal",
    status: "Pending",
    detail:
      "A simulated checkout record needs reconciliation against its recorded EGP amounts. No funds are transferred.",
  },
  {
    id: "case_05",
    title: "Matching quality feedback",
    category: "AI quality review",
    committee: "ai-quality",
    priority: "Normal",
    status: "Pending",
    detail:
      "A fictional user flagged a skills-matching result for human quality review. No production AI decision is made.",
  },
];

export function getCommitteeQueueCount(cases, committeeId) {
  return cases.filter(
    (record) =>
      record.committee === committeeId &&
      ["Pending", "Escalated"].includes(record.status),
  ).length;
}

export function searchAdminRecords(query, { users, marketplace, audit }) {
  const term = query.trim().toLocaleLowerCase();
  if (!term) return [];
  const matches = (values) =>
    values.some((value) =>
      String(value ?? "")
        .toLocaleLowerCase()
        .includes(term),
    );
  return [
    ...users
      .filter((user) => matches([user.displayName, user.email, user.role]))
      .map((user) => ({
        kind: "user",
        id: user.id,
        title: user.displayName,
        detail: `${user.email} · ${user.role}`,
      })),
    ...marketplace
      .filter((record) =>
        matches([
          record.title,
          record.owner,
          record.moderationStatus ?? record.status,
          record.kind,
        ]),
      )
      .map((record) => ({
        kind: "marketplace",
        id: record.id,
        title: record.title,
        detail: `${record.kind === "job" ? "Job" : "Service"} · ${
          record.moderationStatus ?? record.status
        }`,
      })),
    ...audit
      .filter((record) =>
        matches([record.actor, record.action, record.target, record.reason]),
      )
      .map((record) => ({
        kind: "audit",
        id: record.id,
        title: record.action,
        detail: `${record.target} · ${record.reason}`,
      })),
  ].slice(0, 8);
}

export function validatePlatformSettings(settings) {
  if (
    !settings ||
    (settings.commissionPercent !== null &&
      (!Number.isFinite(settings.commissionPercent) ||
        settings.commissionPercent < 0 ||
        settings.commissionPercent > 100))
  )
    return "Enter a commission percentage from 0 to 100.";
  if (typeof settings.maintenanceMode !== "boolean")
    return "Choose a valid maintenance mode setting.";
  const { minProjectBudgetEGP: minimum, maxProjectBudgetEGP: maximum } =
    settings;
  if (
    (minimum === null) !== (maximum === null) ||
    (minimum !== null &&
      (!Number.isSafeInteger(minimum) ||
        !Number.isSafeInteger(maximum) ||
        minimum < 1 ||
        maximum < minimum))
  )
    return "Set both project budget limits to whole EGP amounts, with the maximum at least the minimum.";
  return null;
}

export function getFinanceOverview(snapshot) {
  const transactions = snapshot.transactions.filter(
    (transaction) => transaction.demo,
  );
  const totals = {
    transactions,
    amountPaidMinor: 0,
    escrowHeldMinor: 0,
    remainingMinor: 0,
  };
  for (const transaction of transactions) {
    if (transaction.currency !== "EGP")
      throw new TypeError("Finance records must use EGP.");
    for (const amount of [
      transaction.amountPaidMinor,
      transaction.escrowHeldMinor,
      transaction.remainingMinor,
    ]) {
      if (!Number.isSafeInteger(amount) || amount < 0)
        throw new RangeError(
          "Finance amounts must be non-negative minor units.",
        );
    }
    totals.amountPaidMinor += transaction.amountPaidMinor;
    totals.escrowHeldMinor += transaction.escrowHeldMinor;
    totals.remainingMinor += transaction.remainingMinor;
    if (
      !Number.isSafeInteger(totals.amountPaidMinor) ||
      !Number.isSafeInteger(totals.escrowHeldMinor) ||
      !Number.isSafeInteger(totals.remainingMinor)
    )
      throw new RangeError("Finance totals exceed the safe integer range.");
  }
  return totals;
}
export function createAdminState() {
  return {
    users: mockUsers
      .filter((u) => u.role !== "super_admin")
      .map((u) => ({
        ...u,
        email: u.email ?? `${u.id}@example.test`,
      })),
    cases: initialCases.map((c) => ({ ...c })),
    audit: [],
    grants: Object.fromEntries(committees.map((c) => [c.id, true])),
    moderation: {},
    settings: { ...initialPlatformSettings },
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
  } else if (action.type === "moderation") {
    if (
      !["job", "service"].includes(action.recordType) ||
      typeof action.recordId !== "string" ||
      !action.recordId.trim() ||
      !["approved", "paused", "removed"].includes(action.value)
    )
      return state;
    const key = `${action.recordType}:${action.recordId}`;
    before = state.moderation[key] ?? action.before;
    after = action.value;
    if (before === after) return state;
    next = {
      ...state,
      moderation: { ...state.moderation, [key]: after },
    };
  } else if (action.type === "settings") {
    if (validatePlatformSettings(action.value)) return state;
    before = state.settings;
    after = {
      commissionPercent: action.value.commissionPercent,
      minProjectBudgetEGP: action.value.minProjectBudgetEGP,
      maxProjectBudgetEGP: action.value.maxProjectBudgetEGP,
      maintenanceMode: action.value.maintenanceMode,
    };
    if (JSON.stringify(before) === JSON.stringify(after)) return state;
    next = { ...state, settings: after };
  } else return state;
  return {
    ...next,
    audit: [
      {
        id: action.eventId,
        timestamp: action.timestamp,
        actor: "Preview Super Admin",
        action: action.actionLabel ?? action.type,
        target: action.targetLabel ?? action.target,
        reason: action.reason.trim(),
        before,
        after,
        result: "Simulated success",
      },
      ...state.audit,
    ],
  };
}
