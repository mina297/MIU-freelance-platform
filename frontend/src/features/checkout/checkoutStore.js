import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { isActiveUser, ROLES } from "../auth/session.js";
import { ORDER_STATUS } from "../marketplace/constants.js";
import {
  escrowBreakdown,
  getServiceOrder,
  savedCards,
  sampleCardPresets,
  validateCheckout,
} from "./checkoutModel.js";

export function canUseClientPayments(session) {
  return (
    session?.status === "authenticated" &&
    isActiveUser(session.user) &&
    session.user.role === ROLES.CLIENT
  );
}
export function createCheckoutStore(data = marketplaceData) {
  let snapshot = Object.freeze({ transactions: Object.freeze([]) });
  const listeners = new Set();
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    fundInitial({
      orderId,
      session,
      payment,
      outcome = "success",
      now = new Date(),
    }) {
      if (!canUseClientPayments(session))
        return {
          ok: false,
          code: "access",
          message: "An active client session is required.",
        };
      const order = getServiceOrder(orderId, data);
      if (!order || order.clientId !== session.user.id)
        return {
          ok: false,
          code: "access",
          message: "This service order is unavailable to your account.",
        };
      const existing = snapshot.transactions.find(
        (item) => item.orderId === orderId && item.clientId === session.user.id,
      );
      if (existing) return { ok: true, transaction: existing, duplicate: true };
      if (order.status !== ORDER_STATUS.AWAITING_PAYMENT)
        return {
          ok: false,
          code: "status",
          message: "This order is not awaiting an initial payment.",
        };
      const errors = validateCheckout(payment ?? {}, now);
      if (Object.keys(errors).length)
        return {
          ok: false,
          code: "validation",
          errors,
          message: "Check your payment selection before continuing.",
        };
      if (outcome !== "success")
        return {
          ok: false,
          code: outcome === "cancelled" ? "cancelled" : "failure",
          message:
            outcome === "cancelled"
              ? "The demo payment was cancelled. Nothing was charged."
              : "The demo payment failed. Nothing was charged; your order is unchanged.",
        };
      const amounts = escrowBreakdown(order.priceMinor);
      const card =
        payment.cardId === "new"
          ? sampleCardPresets[payment.preset]
          : savedCards.find((item) => item.id === payment.cardId);
      const transaction = Object.freeze({
        id: "DEMO-PAY-" + order.id,
        orderId: order.id,
        serviceId: order.serviceId,
        clientId: order.clientId,
        studentId: order.studentId,
        serviceTitle: order.title,
        freelancer: order.freelancer,
        currency: "EGP",
        servicePriceMinor: amounts.priceMinor,
        amountPaidMinor: amounts.initialMinor,
        remainingMinor: amounts.remainingMinor,
        feeMinor: amounts.feeMinor,
        escrowHeldMinor: amounts.initialMinor,
        releasedMinor: 0,
        paymentDate: now.toISOString(),
        paymentMethod: payment.method,
        last4: payment.method === "apple_pay" ? null : card.last4,
        demo: true,
        serviceStatus: ORDER_STATUS.IN_PROGRESS,
        paymentStatus: "partially_paid_escrow_held",
        escrowStatus: "held",
        completedAt: null,
        workProgress: 0,
      });
      snapshot = Object.freeze({
        transactions: Object.freeze([...snapshot.transactions, transaction]),
      });
      listeners.forEach((listener) => listener());
      return { ok: true, transaction, duplicate: false };
    },
  };
}
export const checkoutStore = createCheckoutStore();
export function clientTransactions(snapshot, session) {
  return canUseClientPayments(session)
    ? snapshot.transactions.filter((item) => item.clientId === session.user.id)
    : [];
}
export function clientServiceOrders(snapshot, session, data = marketplaceData) {
  if (!canUseClientPayments(session)) return [];
  return data.orders
    .filter((item) => item.clientId === session.user.id)
    .map((item) => {
      const order = getServiceOrder(item.id, data);
      if (!order) return null;
      const transaction = snapshot.transactions.find(
        (item) =>
          item.orderId === order.id && item.clientId === session.user.id,
      );
      return {
        ...order,
        status: transaction?.serviceStatus ?? order.status,
        transaction: transaction ?? null,
      };
    })
    .filter(Boolean);
}
