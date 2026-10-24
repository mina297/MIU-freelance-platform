import { orders as fixtureOrders } from "../../data/fixtures/marketplace.js";
import { clientEligibility } from "../projects/projectCreation.js";
import { ORDER_SOURCE, ORDER_STATUS } from "../marketplace/constants.js";
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
  return {
    getSnapshot: () => records,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
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
