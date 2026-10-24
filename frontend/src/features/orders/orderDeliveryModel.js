import { orderParticipantError } from "./orderWorkspaceModel.js";

export const DELIVERY_SAMPLES = Object.freeze([
  Object.freeze({
    id: "delivery_sample_work",
    name: "Sample completed work.pdf",
  }),
  Object.freeze({
    id: "delivery_sample_notes",
    name: "Sample handover notes.txt",
  }),
]);

export function deliveryActorError(order, session, action) {
  const access = orderParticipantError(order, session);
  if (access) return access;
  if (!["submit", "revise", "accept"].includes(action))
    return "Choose a supported delivery action.";
  if (session.user.role !== (action === "submit" ? "student" : "client"))
    return action === "submit"
      ? "Only the assigned student can submit delivery."
      : "Only the owning client can review delivery.";
  if (
    (action === "submit" || action === "accept") &&
    session.user.verificationStatus !== "approved"
  )
    return "Approved demo verification is required for delivery submission or acceptance.";
  return null;
}

export function deliveryActionError(order, session, action, latestId) {
  const access = deliveryActorError(order, session, action);
  if (access) return access;
  const latest = order.deliveries?.at(-1);
  if ((latest?.id ?? null) !== latestId)
    return "The latest delivery changed. Review it before confirming again.";
  if (action === "submit") {
    if (!["in_progress", "revision_requested"].includes(order.status))
      return "Delivery is available only for in-progress orders or requested revisions. Awaiting-payment orders cannot start work here.";
    if (
      order.status === "revision_requested" &&
      latest?.status !== "revision_requested"
    )
      return "The saved revision history is unavailable. No delivery was added.";
  } else if (order.status !== "delivered" || latest?.status !== "submitted")
    return "Only the latest submitted delivery on an awaiting-review order can be reviewed.";
  return null;
}

export function validateDelivery(values, action) {
  const errors = {};
  if (
    action !== "accept" &&
    (typeof values?.text !== "string" ||
      !values.text.trim() ||
      values.text.length > 3000)
  )
    errors.text = "Write a clear note of 1–3,000 characters.";
  if (action === "submit") {
    const ids = values?.attachmentIds;
    if (
      !Array.isArray(ids) ||
      new Set(ids).size !== ids.length ||
      ids.some((id) => !DELIVERY_SAMPLES.some((sample) => sample.id === id))
    )
      errors.attachmentIds =
        "Choose only listed fictional delivery samples, without duplicates.";
  }
  return errors;
}
