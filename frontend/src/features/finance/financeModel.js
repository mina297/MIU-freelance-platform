// Fictional display ledger. Integer minor units avoid floating-point money arithmetic.
export const financeOrders = [
  {
    id: "fin_order_01",
    title: "Robotics club identity",
    source: "Project",
    client: "Demo Robotics Club",
    student: "Demo Mariam",
    stage: "Work in progress",
  },
  {
    id: "fin_order_02",
    title: "Landing page design package",
    source: "Service",
    client: "Demo Nile Studio",
    student: "Demo Omar",
    stage: "Released",
  },
  {
    id: "fin_order_03",
    title: "Event poster series",
    source: "Project",
    client: "Demo Arts Club",
    student: "Demo Salma",
    stage: "Disputed",
  },
  {
    id: "fin_order_04",
    title: "Presentation design package",
    source: "Service",
    client: "Demo Campus Team",
    student: "Demo Nour",
    stage: "Release pending",
  },
  {
    id: "fin_order_05",
    title: "Student society website",
    source: "Project",
    client: "Demo Science Club",
    student: "Demo Karim",
    stage: "Awaiting funding",
  },
];
export const financeTransactions = [
  {
    id: "fin_txn_01",
    orderId: "fin_order_01",
    type: "Funding",
    amountMinor: 750000,
    status: "Completed",
    timestamp: "2026-10-20T09:00:00Z",
  },
  {
    id: "fin_txn_02",
    orderId: "fin_order_02",
    type: "Funding",
    amountMinor: 400000,
    status: "Completed",
    timestamp: "2026-10-19T09:00:00Z",
  },
  {
    id: "fin_txn_03",
    orderId: "fin_order_02",
    type: "Payout",
    amountMinor: 380000,
    status: "Completed",
    timestamp: "2026-10-21T09:00:00Z",
  },
  {
    id: "fin_txn_04",
    orderId: "fin_order_02",
    type: "Fee",
    amountMinor: 20000,
    status: "Completed",
    timestamp: "2026-10-21T09:01:00Z",
  },
  {
    id: "fin_txn_05",
    orderId: "fin_order_03",
    type: "Funding",
    amountMinor: 250000,
    status: "Completed",
    timestamp: "2026-10-21T12:00:00Z",
  },
  {
    id: "fin_txn_06",
    orderId: "fin_order_03",
    type: "Refund",
    amountMinor: 250000,
    status: "Pending",
    timestamp: "2026-10-23T09:00:00Z",
    note: "Disputed delivery; refund authority requires escalation review.",
  },
  {
    id: "fin_txn_07",
    orderId: "fin_order_04",
    type: "Funding",
    amountMinor: 300000,
    status: "Completed",
    timestamp: "2026-10-22T09:00:00Z",
  },
  {
    id: "fin_txn_08",
    orderId: "fin_order_04",
    type: "Payout",
    amountMinor: 285000,
    status: "Pending",
    timestamp: "2026-10-23T09:30:00Z",
    note: "Fictional payout awaiting financial review. No payout schedule is assumed.",
  },
  {
    id: "fin_txn_09",
    orderId: "fin_order_04",
    type: "Fee",
    amountMinor: 15000,
    status: "Pending",
    timestamp: "2026-10-23T09:31:00Z",
    note: "Illustrative fee amount, not an approved commission rate.",
  },
  {
    id: "fin_txn_10",
    orderId: "fin_order_05",
    type: "Funding",
    amountMinor: 180000,
    status: "Failed",
    timestamp: "2026-10-23T10:00:00Z",
    note: "Simulated funding failure. No money entered escrow; no automatic retry is performed.",
  },
];
export function financeSummary(transactions) {
  const sum = (type, status) =>
    transactions
      .filter((t) => t.type === type && t.status === status)
      .reduce((total, t) => total + t.amountMinor, 0);
  const funding = sum("Funding", "Completed");
  const payouts = sum("Payout", "Completed");
  const revenue = sum("Fee", "Completed");
  const refunds = sum("Refund", "Completed");
  return {
    funding,
    payouts,
    revenue,
    refunds,
    held: funding - payouts - revenue - refunds,
    pendingPayouts: sum("Payout", "Pending"),
    pendingRefunds: sum("Refund", "Pending"),
    pendingFees: sum("Fee", "Pending"),
  };
}
export function filterTransactions(
  transactions,
  { query = "", status = "All", type = "All" } = {},
) {
  const needle = query.trim().toLowerCase();
  return transactions.filter((t) => {
    const order = financeOrders.find((o) => o.id === t.orderId);
    return (
      (status === "All" || status === t.status) &&
      (type === "All" || type === t.type) &&
      `${t.id} ${t.orderId} ${order?.title || ""} ${order?.client || ""} ${order?.student || ""} DEMO-${t.id}`
        .toLowerCase()
        .includes(needle)
    );
  });
}
export function createFinanceReviewState() {
  return { reviews: {}, audit: [] };
}
// Review annotations never alter the financial ledger, balances or payment status.
export function financeReviewReducer(state, action) {
  const transaction = financeTransactions.find(
    (t) => t.id === action.transactionId,
  );
  if (
    !transaction ||
    !["Pending", "Failed"].includes(transaction.status) ||
    !["review", "escalate"].includes(action.type) ||
    !action.reason?.trim() ||
    !action.actor ||
    !action.eventId ||
    !Number.isFinite(Date.parse(action.timestamp)) ||
    state.audit.some((e) => e.id === action.eventId) ||
    state.reviews[transaction.id] === "Escalated"
  )
    return state;
  const after = action.type === "escalate" ? "Escalated" : "Reviewed";
  const event = {
    id: action.eventId,
    transactionId: transaction.id,
    actor: action.actor,
    timestamp: action.timestamp,
    action: action.type,
    reason: action.reason.trim(),
    before: state.reviews[transaction.id] || "Unreviewed",
    after,
    destination: action.type === "escalate" ? "Super Admin" : null,
  };
  return {
    reviews: { ...state.reviews, [transaction.id]: after },
    audit: [event, ...state.audit],
  };
}
