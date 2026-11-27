import test from "node:test";
import assert from "node:assert/strict";
import {
  createAdminState,
  adminReducer,
  committees,
  getCommitteeQueueCount,
  getFinanceOverview,
  initialPlatformSettings,
  searchAdminRecords,
  validatePlatformSettings,
  userRoleOptions,
  userStatusOptions,
} from "./governanceModel.js";
import { createCheckoutStore } from "../../checkout/checkoutStore.js";
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
test("unsupported committee provisioning actions leave records unchanged", () => {
  const state = createAdminState();
  assert.equal(
    adminReducer(state, {
      ...event,
      type: "create",
      target: "new_01",
      value: {
        name: "Reviewer",
        email: "reviewer@example.test",
        committee: "finance",
      },
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

test("committee queue counts follow decisions and global search covers all record types", () => {
  const state = createAdminState();
  assert.equal(getCommitteeQueueCount(state.cases, "finance"), 1);
  const resolved = adminReducer(state, {
    ...event,
    type: "decision",
    target: "case_04",
    value: "Approved",
  });
  assert.equal(getCommitteeQueueCount(resolved.cases, "finance"), 0);

  const results = searchAdminRecords("paused", {
    users: [
      {
        id: "user_1",
        displayName: "A Student",
        email: "student@example.test",
        role: "student",
      },
    ],
    marketplace: [
      {
        id: "job_1",
        title: "Website redesign",
        owner: "A Client",
        kind: "job",
        moderationStatus: "paused",
      },
    ],
    audit: [
      {
        id: "audit_1",
        actor: "Preview Super Admin",
        action: "Paused",
        target: "Website redesign",
        reason: "Needs review",
      },
    ],
  });
  assert.deepEqual(
    results.map((result) => result.kind),
    ["marketplace", "audit"],
  );
  assert.equal(
    searchAdminRecords("student", {
      users: [
        {
          id: "user_1",
          displayName: "A Student",
          email: "student@example.test",
          role: "student",
        },
      ],
      marketplace: [],
      audit: [],
    })[0].kind,
    "user",
  );
});

test("settings validation and moderation commit changes with audit records", () => {
  assert.equal(validatePlatformSettings(initialPlatformSettings), null);
  const settings = {
    commissionPercent: 7.5,
    minProjectBudgetEGP: 100,
    maxProjectBudgetEGP: 10000,
    maintenanceMode: true,
  };
  assert.equal(validatePlatformSettings(settings), null);
  assert.match(
    validatePlatformSettings({ ...settings, maxProjectBudgetEGP: 99 }),
    /maximum at least the minimum/,
  );
  assert.match(
    validatePlatformSettings({ ...settings, commissionPercent: 101 }),
    /commission percentage from 0 to 100/,
  );

  let state = createAdminState();
  const saved = adminReducer(state, {
    ...event,
    type: "settings",
    target: "platform",
    targetLabel: "Platform settings",
    value: settings,
  });
  assert.deepEqual(saved.settings, settings);
  assert.equal(saved.audit[0].before.commissionPercent, null);
  assert.deepEqual(saved.audit[0].after, settings);

  state = adminReducer(state, {
    ...event,
    type: "moderation",
    target: "job_1",
    targetLabel: "Website redesign",
    recordId: "job_1",
    recordType: "job",
    before: "open",
    value: "paused",
  });
  assert.equal(state.moderation["job:job_1"], "paused");
  assert.equal(state.audit[0].before, "open");
  assert.equal(state.audit[0].after, "paused");
  assert.equal(
    adminReducer(state, {
      ...event,
      type: "moderation",
      target: "job_1",
      recordId: "job_1",
      recordType: "job",
      value: "paused",
    }),
    state,
  );
});

test("user directory controls expose the requested role and status choices", () => {
  assert.deepEqual(
    userRoleOptions.map((option) => option.label),
    [
      "Student",
      "Verification",
      "Marketplace Operations",
      "Finance",
      "Support & Disputes",
      "AI & Quality",
    ],
  );
  assert.deepEqual(userStatusOptions, ["Active", "Verified", "In Progress"]);
});

test("financial overview only totals successful EGP checkout records", () => {
  const checkout = createCheckoutStore();
  const initial = getFinanceOverview(checkout.getSnapshot());
  assert.equal(initial.transactions.length, 0);

  const funded = checkout.fundInitial({
    orderId: "order_002",
    session: {
      status: "authenticated",
      user: {
        id: "client_001",
        displayName: "Nile Studio",
        role: "client",
        accountStatus: "active",
      },
    },
    payment: { method: "visa", cardId: "card_visa", acknowledged: true },
    now: new Date("2026-10-24T12:00:00Z"),
  });
  assert.equal(funded.ok, true);

  const overview = getFinanceOverview(checkout.getSnapshot());
  assert.equal(overview.transactions.length, 1);
  assert.equal(overview.transactions[0].id, "PAY-order_002");
  assert.equal(overview.amountPaidMinor, funded.transaction.amountPaidMinor);
  assert.equal(overview.escrowHeldMinor, funded.transaction.escrowHeldMinor);
  assert.equal(overview.remainingMinor, funded.transaction.remainingMinor);
});

test("financial overview rejects invalid currencies and unsafe values", () => {
  const makeSnapshot = (record) => ({
    transactions: [{ demo: true, ...record }],
  });
  assert.throws(
    () =>
      getFinanceOverview(
        makeSnapshot({
          currency: "USD",
          amountPaidMinor: 100,
          escrowHeldMinor: 100,
          remainingMinor: 100,
        }),
      ),
    TypeError,
  );
  assert.throws(
    () =>
      getFinanceOverview(
        makeSnapshot({
          currency: "EGP",
          amountPaidMinor: -1,
          escrowHeldMinor: 0,
          remainingMinor: 0,
        }),
      ),
    RangeError,
  );
});
