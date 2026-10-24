import { isActiveUser, ROLES } from "../auth/session.js";
import { ORDER_STATUS } from "../marketplace/constants.js";

export const orderStatusLabels = {
  [ORDER_STATUS.AWAITING_PAYMENT]: "Awaiting payment",
  [ORDER_STATUS.FUNDED]: "Funded",
  [ORDER_STATUS.IN_PROGRESS]: "In progress",
  [ORDER_STATUS.DELIVERED]: "Delivered",
  [ORDER_STATUS.REVISION_REQUESTED]: "Revision requested",
  [ORDER_STATUS.COMPLETED]: "Completed",
  [ORDER_STATUS.DISPUTED]: "Disputed",
  [ORDER_STATUS.CANCELLED]: "Cancelled",
};
export const emptyOrderFilters = Object.freeze({
  query: "",
  status: "all",
  source: "all",
  sort: "newest",
});

export function orderListAllowed(session, role) {
  return (
    session?.status === "authenticated" &&
    isActiveUser(session.user) &&
    [ROLES.CLIENT, ROLES.STUDENT].includes(role) &&
    session.user.role === role
  );
}

/** Ownership is applied before joins, search, filtering, counts or amounts. */
export function ownOrders(records, session, role) {
  if (!orderListAllowed(session, role)) return [];
  const key = role === ROLES.CLIENT ? "clientId" : "studentId";
  return records.filter(
    (order) =>
      order[key] === session.user.id &&
      ["project", "service"].includes(order.sourceType),
  );
}

export function describeOrder(order, role, data) {
  const project =
    order.sourceType === "project"
      ? data.projects.find(({ id }) => id === order.sourceId)
      : null;
  const service =
    order.sourceType === "service"
      ? data.services.find(({ id }) => id === order.sourceId)
      : null;
  const people =
    role === ROLES.CLIENT
      ? data.participants.students
      : data.participants.clients;
  const personId = role === ROLES.CLIENT ? order.studentId : order.clientId;
  const name =
    people.find(({ id }) => id === personId)?.displayName ??
    `${role === ROLES.CLIENT ? "Student" : "Client"} information unavailable`;
  return {
    order,
    name,
    title:
      order.serviceTerms?.serviceTitle ??
      project?.title ??
      service?.title ??
      (order.sourceType === "project"
        ? "Project unavailable"
        : "Service unavailable"),
    titleNote:
      order.sourceType === "service" && !order.serviceTerms
        ? "Current listing title; historical scope was not saved."
        : null,
    packageName: order.serviceTerms?.packageName ?? null,
    statusLabel: orderStatusLabels[order.status] ?? "Status unavailable",
  };
}

export function filterOrders(records, session, role, filters, data) {
  const options = { ...emptyOrderFilters, ...filters };
  const query = options.query.trim().toLocaleLowerCase();
  return ownOrders(records, session, role)
    .map((order) => describeOrder(order, role, data))
    .filter(
      ({ order, title, name, packageName }) =>
        (options.status === "all" || order.status === options.status) &&
        (options.source === "all" || order.sourceType === options.source) &&
        `${title} ${name} ${order.id} ${packageName ?? ""}`
          .toLocaleLowerCase()
          .includes(query),
    )
    .sort((a, b) => {
      const difference =
        options.sort === "amount_low"
          ? a.order.agreedAmountEGP - b.order.agreedAmountEGP
          : options.sort === "amount_high"
            ? b.order.agreedAmountEGP - a.order.agreedAmountEGP
            : options.sort === "oldest"
              ? a.order.createdAt.localeCompare(b.order.createdAt)
              : b.order.createdAt.localeCompare(a.order.createdAt);
      return difference || a.order.id.localeCompare(b.order.id);
    });
}

/** All owned orders, all statuses: not a paid balance, escrow total or earnings. */
export function orderListStats(records, session, role) {
  const own = ownOrders(records, session, role);
  let totalCents = 0;
  for (const order of own) {
    const amount = order.agreedAmountEGP;
    const cents = Math.round(amount * 100);
    if (
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !Number.isSafeInteger(cents) ||
      Math.abs(amount * 100 - cents) > 0.000001 ||
      !Number.isSafeInteger(totalCents + cents)
    ) {
      totalCents = null;
      break;
    }
    totalCents += cents;
  }
  return {
    count: own.length,
    awaitingPayment: own.filter(
      (order) => order.status === ORDER_STATUS.AWAITING_PAYMENT,
    ).length,
    amountEGP: totalCents === null ? null : totalCents / 100,
  };
}
