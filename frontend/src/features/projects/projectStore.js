import {
  clientEligibility,
  normalizeProject,
  validateProject,
  validateProjectDraft,
  EMPTY_PROJECT,
} from "./projectCreation.js";
import { PROJECT_STATUS } from "../marketplace/constants.js";
import { projects as fixtureProjects } from "../../data/fixtures/marketplace.js";

export const mergeProjects = (base, changes) => [
  ...new Map(
    [...base, ...changes].map((record) => [record.id, record]),
  ).values(),
];

export function createProjectStore(seed = []) {
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
