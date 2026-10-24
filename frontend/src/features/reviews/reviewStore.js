import { orderStore } from "../orders/orderStore.js";
import { isActiveUser } from "../auth/session.js";
import { validateReviewForm } from "./utils/validateReview.js";

export function reviewClientAllowed(session) {
  return (
    session?.status === "authenticated" &&
    isActiveUser(session.user) &&
    session.user.role === "client"
  );
}

/** Memory-only reviews; eligibility is rechecked at the mutation boundary. */
export function createReviewStore(readOrders = orderStore.getSnapshot) {
  let records = Object.freeze([]);
  const listeners = new Set();
  const eligible = (order, session) =>
    reviewClientAllowed(session) &&
    order?.clientId === session.user.id &&
    order.status === "completed" &&
    ["project", "service"].includes(order.sourceType);
  return {
    getSnapshot: () => records,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    eligibleOrders(session, studentId) {
      return readOrders().filter(
        (order) =>
          eligible(order, session) &&
          (!studentId || order.studentId === studentId) &&
          !records.some((review) => review.relatedOrderId === order.id),
      );
    },
    submit(values, session, studentId) {
      const errors = validateReviewForm(values);
      const order = readOrders().find(({ id }) => id === values.orderId);
      if (
        !eligible(order, session) ||
        (studentId && order.studentId !== studentId)
      )
        errors.orderId = "Choose your own completed order for this student.";
      if (records.some((review) => review.relatedOrderId === values.orderId))
        errors.orderId = "This order has already been reviewed.";
      if (Object.keys(errors).length) return { ok: false, errors };
      const review = Object.freeze({
        id: `demo_review_${crypto.randomUUID()}`,
        relatedOrderId: order.id,
        targetStudentId: order.studentId,
        reviewerClientId: session.user.id,
        reviewerName: session.user.displayName,
        reviewerInitials: session.user.displayName
          .split(" ")
          .map((word) => word[0])
          .slice(0, 2)
          .join(""),
        rating: values.rating,
        body: values.body.trim(),
        createdAt: new Date().toISOString(),
        jobLabel:
          order.serviceTerms?.serviceTitle ??
          `Completed ${order.sourceType} order`,
        simulated: true,
      });
      records = Object.freeze([review, ...records]);
      listeners.forEach((listener) => listener());
      return { ok: true, review };
    },
  };
}

export const reviewStore = createReviewStore();
