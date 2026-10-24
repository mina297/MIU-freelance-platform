import {
  clientEligibility,
  normalizeProject,
  validateProject,
} from "./projectCreation.js";
import { PROJECT_STATUS } from "../marketplace/constants.js";

export function createProjectStore() {
  let records = Object.freeze([]);
  const listeners = new Set();
  return {
    getSnapshot: () => records,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
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
      const existing = records.find((record) => record.id === id);
      if (existing) return { ok: true, project: existing };
      const timestamp = new Date().toISOString();
      const data = normalizeProject(values);
      const project = Object.freeze({
        ...data,
        requiredSkillIds: Object.freeze(data.requiredSkillIds),
        deliverables: Object.freeze(data.deliverables),
        id,
        clientId: session.user.id,
        status: PROJECT_STATUS.OPEN,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      records = Object.freeze([...records, project]);
      listeners.forEach((listener) => listener());
      return { ok: true, project };
    },
  };
}

// Fictional records only; reloading the application clears this store.
export const projectStore = createProjectStore();
