import {
  clientProfiles,
  studentProfiles,
} from "../../../data/fixtures/profiles.js";
import { getCompletedProjectsForClient } from "../../../data/fixtures/reviews.js";
import { PROFILE_EDIT_STORAGE_KEY } from "../constants.js";

function readEditOverrides(profileId) {
  try {
    const raw = window.sessionStorage.getItem(PROFILE_EDIT_STORAGE_KEY);
    if (!raw) return null;
    const all = JSON.parse(raw);
    return all?.[profileId] ?? null;
  } catch {
    return null;
  }
}

/**
 * @param {string | undefined} clientId
 */
export function getClientProfileById(clientId) {
  if (!clientId) return null;
  const base = clientProfiles.find((profile) => profile.id === clientId);
  if (!base) return null;

  const overrides = typeof window !== "undefined" ? readEditOverrides(clientId) : null;
  const profile = overrides ? { ...base, ...overrides, id: base.id, role: "client" } : base;

  const projectHistory = getCompletedProjectsForClient(clientId).map((project) => {
    const student = studentProfiles.find((s) => s.id === project.studentId);
    return {
      ...project,
      studentName: student?.displayName ?? "Student freelancer",
    };
  });

  return { profile, projectHistory };
}
