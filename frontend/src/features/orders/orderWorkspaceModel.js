import { isActiveUser, ROLES } from "../auth/session.js";
import { ORDER_STATUS } from "../marketplace/constants.js";

// Metadata only. No real files, contents, URLs, uploads or downloads.
export const ORDER_SAMPLE_ATTACHMENTS = Object.freeze([
  Object.freeze({
    id: "order_sample_requirements",
    name: "Sample requirements.pdf",
  }),
  Object.freeze({ id: "order_sample_reference", name: "Sample reference.png" }),
]);
export const EMPTY_ORDER_WORKSPACE = Object.freeze({
  requirements: null,
  messages: Object.freeze([]),
  events: Object.freeze([]),
});

export function orderParticipantError(order, session) {
  if (session?.status !== "authenticated" || !isActiveUser(session.user))
    return "An active order-participant session is required.";
  if (
    !order ||
    !["project", "service"].includes(order.sourceType) ||
    !(
      (session.user.role === ROLES.CLIENT &&
        order.clientId === session.user.id) ||
      (session.user.role === ROLES.STUDENT &&
        order.studentId === session.user.id)
    )
  )
    return "This order is unavailable or you are not one of its participants.";
  return null;
}

export function workspaceActionError(order, session, action) {
  const access = orderParticipantError(order, session);
  if (access) return access;
  if (action === "requirements") {
    if (session.user.role !== ROLES.CLIENT)
      return "Only the owning client can save requirements notes.";
    if (
      ![
        ORDER_STATUS.AWAITING_PAYMENT,
        ORDER_STATUS.FUNDED,
        ORDER_STATUS.IN_PROGRESS,
        ORDER_STATUS.REVISION_REQUESTED,
      ].includes(order.status)
    )
      return "Requirements notes are read-only in this order status.";
  } else if (action === "message") {
    if (
      !Object.values(ORDER_STATUS).includes(order.status) ||
      [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(order.status)
    )
      return "Messages are read-only for completed or cancelled orders.";
  } else return "Choose a supported workspace action.";
  return null;
}

export function validateWorkspaceText(values, limit) {
  const errors = {};
  if (typeof values?.text !== "string" || !values.text.trim())
    errors.text = "Write a message or requirements note.";
  else if (values.text.length > limit)
    errors.text = `Use ${limit} characters or fewer.`;
  const ids = values?.attachmentIds;
  if (
    !Array.isArray(ids) ||
    new Set(ids).size !== ids.length ||
    ids.some((id) => !ORDER_SAMPLE_ATTACHMENTS.some((item) => item.id === id))
  )
    errors.attachmentIds =
      "Choose only the listed fictional samples, without duplicates.";
  return errors;
}

export function workspaceTimeline(order, workspace) {
  return [
    {
      id: `created-${order.id}`,
      label: "Demo order created",
      createdAt: order.createdAt,
    },
    ...workspace.events,
  ].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
