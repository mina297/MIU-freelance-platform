import { orders as fixtureOrders } from "../../data/fixtures/marketplace.js";
import { clientEligibility } from "../projects/projectCreation.js";
import { ORDER_SOURCE, ORDER_STATUS } from "../marketplace/constants.js";
import {
  deliveryActorError,
  deliveryActionError,
  validateDelivery,
} from "./orderDeliveryModel.js";
import {
  quoteServiceOrder,
  serviceBuyerError,
} from "../services/serviceOrderModel.js";

export function createOrderStore(seed = []) {
  let records = Object.freeze(
    seed.map((record) =>
      Object.freeze({
        ...record,
        serviceExtraIds: Object.freeze([...record.serviceExtraIds]),
      }),
    ),
  );
  const listeners = new Set();
  const serviceRequests = new Map();
  const deliveryRequests = new Map();
  function changeDelivery(
    orderId,
    values,
    session,
    action,
    latestId,
    requestId,
  ) {
    const current = records.find(({ id }) => id === orderId);
    const actorError = deliveryActorError(current, session, action);
    if (actorError) return { ok: false, errors: { form: actorError } };
    const errors = validateDelivery(values, action);
    if (Object.keys(errors).length) return { ok: false, errors };
    if (typeof requestId !== "string" || !requestId.trim())
      return {
        ok: false,
        errors: {
          form: "Reopen the confirmation before submitting this demo action.",
        },
      };
    const key = JSON.stringify([orderId, session.user.id, action, requestId]);
    const fingerprint = JSON.stringify([
      latestId,
      action === "accept" ? null : values.text.trim(),
      action === "submit" ? [...values.attachmentIds].sort() : null,
    ]);
    const repeat = deliveryRequests.get(key);
    if (repeat)
      return repeat.fingerprint === fingerprint
        ? {
            ok: true,
            order: current,
            delivery: repeat.delivery,
            duplicate: true,
          }
        : {
            ok: false,
            errors: {
              form: "This confirmation was already used with different content.",
            },
          };
    const invalid = deliveryActionError(current, session, action, latestId);
    if (invalid) return { ok: false, errors: { form: invalid } };
    const now = new Date().toISOString();
    let deliveries = [...(current.deliveries ?? [])];
    let delivery;
    let status;
    if (action === "submit") {
      delivery = Object.freeze({
        id: `demo_delivery_${crypto.randomUUID()}`,
        text: values.text.trim(),
        attachmentIds: Object.freeze([...values.attachmentIds]),
        submittedBy: session.user.id,
        submittedName: session.user.displayName,
        submittedAt: now,
        status: "submitted",
      });
      deliveries.push(delivery);
      status = ORDER_STATUS.DELIVERED;
    } else {
      const previous = deliveries.at(-1);
      delivery = Object.freeze({
        ...previous,
        status: action === "revise" ? "revision_requested" : "accepted",
        ...(action === "revise"
          ? {
              revision: Object.freeze({
                text: values.text.trim(),
                requestedBy: session.user.id,
                requestedAt: now,
              }),
            }
          : { acceptedBy: session.user.id, acceptedAt: now }),
      });
      deliveries = deliveries.map((item) =>
        item.id === previous.id ? delivery : item,
      );
      status =
        action === "revise"
          ? ORDER_STATUS.REVISION_REQUESTED
          : ORDER_STATUS.COMPLETED;
    }
    const event = Object.freeze({
      id: `delivery_event_${crypto.randomUUID()}`,
      label:
        action === "submit"
          ? "Student submitted demo delivery"
          : action === "revise"
            ? "Client requested demo revisions"
            : "Client accepted delivery — demo order completed",
      actorId: session.user.id,
      actorName: session.user.displayName,
      createdAt: now,
    });
    const order = Object.freeze({
      ...current,
      status,
      deliveries: Object.freeze(deliveries),
      deliveryEvents: Object.freeze([...(current.deliveryEvents ?? []), event]),
      ...(action === "accept" ? { completedAt: now } : {}),
    });
    deliveryRequests.set(key, { fingerprint, delivery });
    records = Object.freeze(
      records.map((item) => (item.id === orderId ? order : item)),
    );
    listeners.forEach((listener) => listener());
    return { ok: true, order, delivery };
  }
  return {
    getSnapshot: () => records,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    submitDelivery(orderId, values, session, latestId, requestId) {
      return changeDelivery(
        orderId,
        values,
        session,
        "submit",
        latestId,
        requestId,
      );
    },
    requestRevision(orderId, values, session, latestId, requestId) {
      return changeDelivery(
        orderId,
        values,
        session,
        "revise",
        latestId,
        requestId,
      );
    },
    acceptDelivery(orderId, session, latestId, requestId) {
      return changeDelivery(
        orderId,
        {},
        session,
        "accept",
        latestId,
        requestId,
      );
    },
    createFromService(
      serviceId,
      selection,
      session,
      submissionId,
      readServices,
    ) {
      const access = serviceBuyerError(session);
      if (access) return { ok: false, error: access };
      if (
        typeof submissionId !== "string" ||
        !submissionId.trim() ||
        typeof readServices !== "function" ||
        !selection ||
        !Array.isArray(selection.extraIds)
      )
        return {
          ok: false,
          error: "Reopen the ordering form and review your selection.",
        };
      const key = JSON.stringify([session.user.id, submissionId]);
      const fingerprint = JSON.stringify([
        serviceId,
        selection.packageId,
        [...selection.extraIds].sort(),
        selection.expectedRevision,
      ]);
      const previous = serviceRequests.get(key);
      if (previous)
        return previous.fingerprint === fingerprint
          ? { ok: true, order: previous.order, duplicate: true }
          : {
              ok: false,
              error:
                "This confirmation has already been used for different terms. Open a new order form.",
            };
      const quote = quoteServiceOrder(
        serviceId,
        selection,
        session,
        readServices(),
      );
      if (!quote.ok) return quote;
      if (selection.expectedRevision !== quote.revision)
        return {
          ok: false,
          error:
            "Service terms changed. Review the latest price, scope and delivery estimate before confirming again.",
        };
      const terms = Object.freeze({
        ...quote.terms,
        includedFeatures: Object.freeze([...quote.terms.includedFeatures]),
        extras: Object.freeze(
          quote.terms.extras.map((extra) => Object.freeze({ ...extra })),
        ),
      });
      const order = Object.freeze({
        id: `demo_order_${crypto.randomUUID()}`,
        sourceType: ORDER_SOURCE.SERVICE,
        sourceId: serviceId,
        proposalId: null,
        servicePackageId: quote.packageId,
        serviceExtraIds: Object.freeze([...quote.extraIds]),
        clientId: session.user.id,
        studentId: quote.studentId,
        agreedAmountEGP: quote.amountEGP,
        deliveryDays: quote.deliveryDays,
        serviceTerms: terms,
        status: ORDER_STATUS.AWAITING_PAYMENT,
        createdAt: new Date().toISOString(),
        completedAt: null,
      });
      serviceRequests.set(key, { fingerprint, order });
      records = Object.freeze([...records, order]);
      listeners.forEach((listener) => listener());
      return { ok: true, order, duplicate: false };
    },
    createFromProposal(project, proposal, session) {
      const access = clientEligibility(session, true);
      if (access) return { ok: false, error: access };
      if (
        !project ||
        project.clientId !== session.user.id ||
        !proposal ||
        proposal.projectId !== project.id
      )
        return {
          ok: false,
          error: "This proposal is unavailable for your account.",
        };
      const existing = records.find(
        (record) =>
          record.sourceType === ORDER_SOURCE.PROJECT &&
          record.sourceId === project.id,
      );
      if (existing)
        return existing.proposalId === proposal.id &&
          existing.clientId === session.user.id &&
          existing.studentId === proposal.studentId
          ? { ok: true, order: existing, duplicate: true }
          : {
              ok: false,
              error: "This project already has an order for another proposal.",
            };
      if (
        project.status !== "open" ||
        !["submitted", "shortlisted"].includes(proposal.status) ||
        !Number.isFinite(proposal.priceEGP) ||
        proposal.priceEGP <= 0 ||
        !Number.isSafeInteger(proposal.deliveryDays) ||
        proposal.deliveryDays < 1
      )
        return {
          ok: false,
          error:
            "Only a valid submitted or shortlisted offer on an open project can create an order.",
        };
      const order = Object.freeze({
        id: `demo_order_${crypto.randomUUID()}`,
        sourceType: ORDER_SOURCE.PROJECT,
        sourceId: project.id,
        proposalId: proposal.id,
        servicePackageId: null,
        serviceExtraIds: Object.freeze([]),
        clientId: project.clientId,
        studentId: proposal.studentId,
        agreedAmountEGP: proposal.priceEGP,
        deliveryDays: proposal.deliveryDays,
        status: ORDER_STATUS.AWAITING_PAYMENT,
        createdAt: new Date().toISOString(),
        completedAt: null,
      });
      records = Object.freeze([...records, order]);
      listeners.forEach((listener) => listener());
      return { ok: true, order, duplicate: false };
    },
  };
}

export const orderStore = createOrderStore(fixtureOrders);
