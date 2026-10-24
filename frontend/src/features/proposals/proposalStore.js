import { validateProposal } from "./validateProposal.js";
import { getProjectById } from "../marketplace/selectors.js";
import { PROPOSAL_STATUS } from "../marketplace/constants.js";
import { proposals as fixtureProposals } from "../../data/fixtures/marketplace.js";
import { clientEligibility } from "../projects/projectCreation.js";

export function createProposalStore(findProject = getProjectById, seed = []) {
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
);
