import { orderStore } from "./orderStore.js";
import {
  EMPTY_ORDER_WORKSPACE,
  orderParticipantError,
  workspaceActionError,
  validateWorkspaceText,
} from "./orderWorkspaceModel.js";

export function createOrderWorkspaceStore(
  findOrder = (id) => orderStore.getSnapshot().find((order) => order.id === id),
) {
  const records = new Map();
  const requests = new Map();
  let snapshot = Object.freeze([]);
  const listeners = new Set();
  const workspace = (id) => records.get(id) ?? EMPTY_ORDER_WORKSPACE;
  function update(id, next) {
    const frozen = Object.freeze({ ...next, orderId: id });
    records.set(id, frozen);
    snapshot = Object.freeze([...records.values()]);
    listeners.forEach((listener) => listener());
  }
  function event(session, label, timestamp) {
    return Object.freeze({
      id: `workspace_event_${crypto.randomUUID()}`,
      label,
      actorId: session.user.id,
      actorName: session.user.displayName,
      createdAt: timestamp,
    });
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    read(orderId, session) {
      return orderParticipantError(findOrder(orderId), session)
        ? null
        : workspace(orderId);
    },
    actionError(orderId, session, action) {
      return workspaceActionError(findOrder(orderId), session, action);
    },
    saveRequirements(orderId, values, session, expectedVersion) {
      const access = workspaceActionError(
        findOrder(orderId),
        session,
        "requirements",
      );
      if (access) return { ok: false, errors: { form: access } };
      const errors = validateWorkspaceText(values, 5000);
      if (Object.keys(errors).length) return { ok: false, errors };
      const previous = workspace(orderId);
      const version = previous.requirements?.version ?? 0;
      if (expectedVersion !== version)
        return {
          ok: false,
          errors: {
            form: "Requirements changed. Reopen the editor and review the latest notes before saving.",
          },
        };
      if (
        previous.requirements?.text === values.text.trim() &&
        JSON.stringify(previous.requirements.attachmentIds) ===
          JSON.stringify(values.attachmentIds)
      )
        return {
          ok: true,
          requirements: previous.requirements,
          duplicate: true,
        };
      const now = new Date().toISOString();
      const requirements = Object.freeze({
        text: values.text.trim(),
        attachmentIds: Object.freeze([...values.attachmentIds]),
        savedBy: session.user.id,
        savedAt: now,
        version: version + 1,
      });
      update(orderId, {
        ...previous,
        requirements,
        events: Object.freeze([
          ...previous.events,
          event(session, "Client requirements notes saved", now),
        ]),
      });
      return { ok: true, requirements };
    },
    sendMessage(orderId, values, session, submissionId) {
      const access = workspaceActionError(
        findOrder(orderId),
        session,
        "message",
      );
      if (access) return { ok: false, errors: { form: access } };
      const errors = validateWorkspaceText(values, 2000);
      if (Object.keys(errors).length) return { ok: false, errors };
      if (typeof submissionId !== "string" || !submissionId.trim())
        return {
          ok: false,
          errors: {
            form: "Reopen the composer before sending a demo message.",
          },
        };
      const key = JSON.stringify([orderId, session.user.id, submissionId]);
      const fingerprint = JSON.stringify([
        values.text.trim(),
        [...values.attachmentIds].sort(),
      ]);
      const repeat = requests.get(key);
      if (repeat)
        return repeat.fingerprint === fingerprint
          ? { ok: true, message: repeat.message, duplicate: true }
          : {
              ok: false,
              errors: {
                form: "This send request was already used for different content.",
              },
            };
      const now = new Date().toISOString();
      const message = Object.freeze({
        id: `demo_message_${crypto.randomUUID()}`,
        orderId,
        senderId: session.user.id,
        senderRole: session.user.role,
        senderName: session.user.displayName,
        text: values.text.trim(),
        attachmentIds: Object.freeze([...values.attachmentIds]),
        createdAt: now,
      });
      requests.set(key, { fingerprint, message });
      const previous = workspace(orderId);
      update(orderId, {
        ...previous,
        messages: Object.freeze([...previous.messages, message]),
        events: Object.freeze([
          ...previous.events,
          event(session, "Demo message added", now),
        ]),
      });
      return { ok: true, message };
    },
  };
}

export const orderWorkspaceStore = createOrderWorkspaceStore();
