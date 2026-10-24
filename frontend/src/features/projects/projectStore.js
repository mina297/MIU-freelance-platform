import {
  clientEligibility,
  normalizeProject,
  validateProject,
  validateProjectDraft,
  EMPTY_PROJECT,
} from "./projectCreation.js";
import { PROJECT_STATUS } from "../marketplace/constants.js";
import { projects as fixtureProjects } from "../../data/fixtures/marketplace.js";
import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { projectTransitionError } from "./projectLifecycle.js";
import { orderStore } from "../orders/orderStore.js";

export const mergeProjects = (base, changes) => [
  ...new Map(
    [...base, ...changes].map((record) => [record.id, record]),
  ).values(),
];

export function createProjectStore(
  seed = [],
  getCommitments = null,
  orders = orderStore,
) {
  const commitments =
    getCommitments ??
    (() => ({ ...marketplaceData, orders: orders.getSnapshot() }));
  let records = Object.freeze([]);
  let drafts = Object.freeze([]);
  let workspace = Object.freeze([...seed]);
  const listeners = new Set();
  const find = (id) =>
    drafts.find((record) => record.id === id) ??
    records.find((record) => record.id === id) ??
    seed.find((record) => record.id === id);
  const owned = (id, session) =>
    !clientEligibility(session) && find(id)?.clientId === session.user.id
      ? find(id)
      : null;
  const notify = () => {
    workspace = Object.freeze([...mergeProjects(seed, records), ...drafts]);
    listeners.forEach((listener) => listener());
  };
  const failure = (message) => ({ ok: false, errors: { session: message } });
  function commit(values, session, id, previous) {
    const access = clientEligibility(session, true);
    if (access) return failure(access);
    const errors = validateProject(values);
    if (Object.keys(errors).length) return { ok: false, errors };
    const timestamp = new Date().toISOString();
    const data = normalizeProject(values);
    const project = Object.freeze({
      ...data,
      requiredSkillIds: Object.freeze(data.requiredSkillIds),
      deliverables: Object.freeze(data.deliverables),
      id,
      clientId: session.user.id,
      status: PROJECT_STATUS.OPEN,
      createdAt: previous?.createdAt ?? timestamp,
      updatedAt: timestamp,
    });
    records = Object.freeze([
      ...records.filter((record) => record.id !== id),
      project,
    ]);
    drafts = Object.freeze(drafts.filter((record) => record.id !== id));
    notify();
    return { ok: true, project };
  }
  return {
    getSnapshot: () => records,
    getWorkspaceSnapshot: () => workspace,
    findOwned: owned,
    acceptProposal(proposal, session) {
      const access = clientEligibility(session, true);
      if (access) return { ok: false, error: access };
      const previous = proposal && owned(proposal.projectId, session);
      if (!previous)
        return {
          ok: false,
          error:
            "This project is unavailable or does not belong to your account.",
        };
      const existing = orders
        .getSnapshot()
        .find(
          (order) =>
            order.sourceType === "project" && order.sourceId === previous.id,
        );
      if (existing)
        return existing.proposalId === proposal.id &&
          existing.clientId === session.user.id &&
          previous.status === PROJECT_STATUS.SELECTED
          ? { ok: true, order: existing, duplicate: true }
          : {
              ok: false,
              error:
                "This project already has a commitment. A second acceptance is unavailable.",
            };
      if (
        previous.status !== PROJECT_STATUS.OPEN ||
        !["submitted", "shortlisted"].includes(proposal.status)
      )
        return {
          ok: false,
          error:
            "Only submitted or shortlisted proposals on an open project can be accepted.",
        };
      if (
        commitments().proposals.some(
          (record) =>
            record.projectId === previous.id && record.status === "accepted",
        ) ||
        commitments().orders.some(
          (order) =>
            order.sourceType === "project" && order.sourceId === previous.id,
        )
      )
        return {
          ok: false,
          error:
            "This project already has a commitment. A second acceptance is unavailable.",
        };
      const result = orders.createFromProposal(previous, proposal, session);
      if (!result.ok) return result;
      const selected = Object.freeze({
        ...previous,
        status: PROJECT_STATUS.SELECTED,
        updatedAt: new Date().toISOString(),
      });
      records = Object.freeze([
        ...records.filter((record) => record.id !== selected.id),
        selected,
      ]);
      notify();
      return { ok: true, order: result.order, duplicate: result.duplicate };
    },
    transitionError(id, session, action) {
      return projectTransitionError(find(id), session, action, commitments());
    },
    transition(id, session, action) {
      const previous = find(id);
      const error = projectTransitionError(
        previous,
        session,
        action,
        commitments(),
      );
      if (error) return failure(error);
      const project = Object.freeze({
        ...previous,
        status:
          action === "close" ? PROJECT_STATUS.CLOSED : PROJECT_STATUS.CANCELLED,
        updatedAt: new Date().toISOString(),
      });
      records = Object.freeze([
        ...records.filter((record) => record.id !== id),
        project,
      ]);
      notify();
      return { ok: true, project };
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    saveDraft(values, session, submissionId, existingId = null) {
      const access = clientEligibility(session);
      if (access) return failure(access);
      if (typeof submissionId !== "string" || !submissionId.trim())
        return failure("Reopen the form and try again.");
      const id =
        existingId ?? `demo_project_${session.user.id}_${submissionId}`;
      const previous = find(id);
      if (
        previous &&
        (!owned(id, session) || previous.status !== PROJECT_STATUS.DRAFT)
      )
        return failure("This project cannot be saved as a draft.");
      if (existingId && !previous)
        return failure("This draft is unavailable. Return to My projects.");
      const errors = validateProjectDraft(values);
      if (Object.keys(errors).length) return { ok: false, errors };
      const safeValues = Object.fromEntries(
        Object.keys(EMPTY_PROJECT).map((key) => [
          key,
          key === "requiredSkillIds"
            ? Object.freeze([...values[key]])
            : values[key],
        ]),
      );
      const timestamp = new Date().toISOString();
      const draft = Object.freeze({
        id,
        clientId: session.user.id,
        status: PROJECT_STATUS.DRAFT,
        values: Object.freeze(safeValues),
        createdAt: previous?.createdAt ?? timestamp,
        updatedAt: timestamp,
      });
      drafts = Object.freeze([
        ...drafts.filter((record) => record.id !== id),
        draft,
      ]);
      notify();
      return { ok: true, project: draft };
    },
    publish(values, session, submissionId) {
      const access = clientEligibility(session, true);
      if (access) return { ok: false, errors: { session: access } };
      const errors = validateProject(values);
      if (Object.keys(errors).length) return { ok: false, errors };
      if (typeof submissionId !== "string" || !submissionId.trim())
        return {
          ok: false,
          errors: { session: "Please reopen the project form and try again." },
        };
      const id = `demo_project_${session.user.id}_${submissionId}`;
      const previous = find(id);
      if (previous && !owned(id, session))
        return failure("This project does not belong to your account.");
      const existing = records.find((record) => record.id === id);
      if (existing) return { ok: true, project: existing };
      return commit(values, session, id, previous);
    },
    update(values, session, id) {
      const previous = owned(id, session);
      if (!previous)
        return failure(
          "This project is unavailable or does not belong to your account.",
        );
      if (
        ![PROJECT_STATUS.DRAFT, PROJECT_STATUS.OPEN].includes(previous.status)
      )
        return failure(
          "Only drafts and open projects can be edited in this demo.",
        );
      return commit(values, session, id, previous);
    },
  };
}

// Fictional records only; reloading the application clears this store.
export const projectStore = createProjectStore(fixtureProjects);
