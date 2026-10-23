import { validateProposal } from "./validateProposal.js";
import { getProjectById } from "../marketplace/selectors.js";
import { PROPOSAL_STATUS } from "../marketplace/constants.js";

export function createProposalStore(findProject = getProjectById) {
  const records = new Map();
  const keyFor = (projectId, studentId) =>
    JSON.stringify([projectId, studentId]);
  return {
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
        attachmentIds: Object.freeze([]),
        status: PROPOSAL_STATUS.SUBMITTED,
        submittedAt: timestamp,
        updatedAt: timestamp,
      });
      records.set(key, proposal);
      return { ok: true, proposal, duplicate: false };
    },
  };
}

// Memory only: route changes retain demo records; refreshing resets them.
export const proposalStore = createProposalStore();
