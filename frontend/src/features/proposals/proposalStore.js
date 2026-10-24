import { validateProposal } from "./validateProposal.js";
import { getProjectById } from "../marketplace/selectors.js";
import { PROPOSAL_STATUS } from "../marketplace/constants.js";
import { proposals as fixtureProposals } from "../../data/fixtures/marketplace.js";
import { clientEligibility } from "../projects/projectCreation.js";
import { projectStore } from "../projects/projectStore.js";

export function createProposalStore(
  findProject = getProjectById,
  seed = [],
  acceptProposal = null,
) {
  const records = new Map();
  const keyFor = (projectId, studentId) =>
    JSON.stringify([projectId, studentId]);
  for (const proposal of seed)
    records.set(
      keyFor(proposal.projectId, proposal.studentId),
      Object.freeze({
        ...proposal,
        attachmentIds: Object.freeze([...proposal.attachmentIds]),
      }),
    );
  let snapshot = Object.freeze([...records.values()]);
  const listeners = new Set();
  const notify = () => {
    snapshot = Object.freeze([...records.values()]);
    listeners.forEach((listener) => listener());
  };
  return {
    getSnapshot: () => snapshot,
    decide(proposalId, session, decision) {
      const access = clientEligibility(session, decision === "accept");
      if (access) return { ok: false, error: access };
      if (!["accept", "reject"].includes(decision))
        return {
          ok: false,
          error: "Choose an acceptance or rejection action.",
        };
      const proposal = snapshot.find(({ id }) => id === proposalId);
      const project = proposal && findProject(proposal.projectId);
      if (!project || project.clientId !== session.user.id)
        return {
          ok: false,
          error:
            "This proposal is unavailable or does not belong to one of your projects.",
        };
      if (decision === "reject" && proposal.status === PROPOSAL_STATUS.REJECTED)
        return { ok: true, proposal, duplicate: true };
      if (
        decision === "accept" &&
        proposal.status === PROPOSAL_STATUS.ACCEPTED
      ) {
        const existing = acceptProposal?.(proposal, session);
        return existing?.ok
          ? { ...existing, proposal }
          : {
              ok: false,
              error: existing?.error ?? "The order handoff is unavailable.",
            };
      }
      if (
        project.status !== "open" ||
        ![PROPOSAL_STATUS.SUBMITTED, PROPOSAL_STATUS.SHORTLISTED].includes(
          proposal.status,
        )
      )
        return {
          ok: false,
          error:
            "Only submitted or shortlisted proposals on an open project can receive a decision.",
        };
      let handoff;
      if (decision === "accept") {
        handoff = acceptProposal?.(proposal, session);
        if (!handoff?.ok)
          return {
            ok: false,
            error:
              handoff?.error ??
              "The order handoff is unavailable. No decision was recorded.",
          };
      }
      const next = Object.freeze({
        ...proposal,
        status:
          decision === "accept"
            ? PROPOSAL_STATUS.ACCEPTED
            : PROPOSAL_STATUS.REJECTED,
        updatedAt: new Date().toISOString(),
      });
      records.set(keyFor(proposal.projectId, proposal.studentId), next);
      notify();
      return {
        ok: true,
        proposal: next,
        ...(handoff
          ? { order: handoff.order, duplicate: handoff.duplicate }
          : {}),
      };
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    shortlist(proposalId, session, selected) {
      const access = clientEligibility(session);
      if (access) return { ok: false, error: access };
      const proposal = snapshot.find(({ id }) => id === proposalId);
      const project = proposal && findProject(proposal.projectId);
      if (!project || project.clientId !== session.user.id)
        return {
          ok: false,
          error:
            "This proposal is unavailable or does not belong to one of your projects.",
        };
      if (
        project.status !== "open" ||
        ![PROPOSAL_STATUS.SUBMITTED, PROPOSAL_STATUS.SHORTLISTED].includes(
          proposal.status,
        )
      )
        return {
          ok: false,
          error:
            "Only submitted or shortlisted proposals on an open project can be changed.",
        };
      if (typeof selected !== "boolean")
        return { ok: false, error: "Choose a valid shortlist action." };
      const status = selected
        ? PROPOSAL_STATUS.SHORTLISTED
        : PROPOSAL_STATUS.SUBMITTED;
      if (proposal.status === status) return { ok: true, proposal };
      const next = Object.freeze({
        ...proposal,
        status,
        updatedAt: new Date().toISOString(),
      });
      records.set(keyFor(proposal.projectId, proposal.studentId), next);
      notify();
      return { ok: true, proposal: next };
    },
    find(projectId, studentId) {
      return records.get(keyFor(projectId, studentId)) ?? null;
    },
    submit(values, projectId, session) {
      const errors = validateProposal(values, findProject(projectId), session);
      if (Object.keys(errors).length) return { ok: false, errors };
      const key = keyFor(projectId, session.user.id);
      if (records.has(key))
        return { ok: true, proposal: records.get(key), duplicate: true };
      const timestamp = new Date().toISOString();
      const proposal = Object.freeze({
        id: `demo_proposal_${crypto.randomUUID()}`,
        projectId,
        studentId: session.user.id,
        priceEGP: Number(values.priceEGP),
        deliveryDays: Number(values.deliveryDays),
        coverMessage: values.coverMessage.trim(),
        attachmentIds: Object.freeze([...(values.attachmentIds ?? [])]),
        status: PROPOSAL_STATUS.SUBMITTED,
        submittedAt: timestamp,
        updatedAt: timestamp,
      });
      records.set(key, proposal);
      notify();
      return { ok: true, proposal, duplicate: false };
    },
  };
}

// Memory only: route changes retain demo records; refreshing resets them.
export const proposalStore = createProposalStore(
  getProjectById,
  fixtureProposals,
  (proposal, session) => projectStore.acceptProposal(proposal, session),
);
