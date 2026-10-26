import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { isActiveUser, ROLES } from "../auth/session.js";
import { ORDER_STATUS } from "../marketplace/constants.js";
import { createOrderStore, orderStore } from "../orders/orderStore.js";
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
export function createCheckoutStore(
  data = marketplaceData,
  orders = createOrderStore(data.orders),
) {
  let previousOrders;
  let snapshot;
  const getSnapshot = () => {
    const records = orders.getSnapshot();
    if (records !== previousOrders) {
      previousOrders = records;
      snapshot = Object.freeze({
        orders: records,
        transactions: Object.freeze(
          records.flatMap((order) =>
            order.initialPayment ? [order.initialPayment] : [],
          ),
        ),
      });
    }
    return snapshot;
  };
  return {
    getSnapshot,
    subscribe: orders.subscribe,
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
      const order = getServiceOrder(orderId, data, orders.getSnapshot());
      if (!order || order.clientId !== session.user.id)
        return {
          ok: false,
          code: "access",
          message: "This service order is unavailable to your account.",
        };
      const existing = getSnapshot().transactions.find(
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
      return orders.fundServiceOrder(orderId, session, transaction);
    },
  };
}
export const checkoutStore = createCheckoutStore(marketplaceData, orderStore);
export function clientTransactions(snapshot, session) {
  return canUseClientPayments(session)
    ? snapshot.transactions.filter((item) => item.clientId === session.user.id)
    : [];
}
export function clientServiceOrders(snapshot, session, data = marketplaceData) {
  if (!canUseClientPayments(session)) return [];
  return snapshot.orders
    .filter((item) => item.clientId === session.user.id)
    .map((item) => {
      const order = getServiceOrder(item.id, data, snapshot.orders);
      if (!order) return null;
      const transaction = snapshot.transactions.find(
        (item) =>
          item.orderId === order.id && item.clientId === session.user.id,
      );
      return {
        ...order,
        status: order.status,
        transaction: transaction ?? null,
      };
    })
    .filter(Boolean);
}
