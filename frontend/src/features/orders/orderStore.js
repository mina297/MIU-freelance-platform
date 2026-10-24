import { orders as fixtureOrders } from "../../data/fixtures/marketplace.js";
import { clientEligibility } from "../projects/projectCreation.js";
import { ORDER_SOURCE, ORDER_STATUS } from "../marketplace/constants.js";

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
  return {
    getSnapshot: () => records,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
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
