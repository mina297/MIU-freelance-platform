import {
  clientProfiles,
  studentProfiles,
} from "../../../data/fixtures/profiles.js";
import { getCompletedProjectsForClient } from "../../../data/fixtures/reviews.js";
import { getProfileEdit } from "./profileEditStorage.js";
import { getRegistrationProfile } from "../registrationProfiles.js";

function readEditOverrides(profileId) {
  try {
    return getProfileEdit(profileId);
  } catch {
    return null;
  }
}

/**
 * @param {string | undefined} clientId
 */
export function getClientProfileById(clientId) {
  if (!clientId) return null;
  const base =
    clientProfiles.find((profile) => profile.id === clientId) ??
    getRegistrationProfile(clientId, "client");
  if (!base) return null;

  const overrides =
    typeof window !== "undefined" ? readEditOverrides(clientId) : null;
  const profile = overrides
    ? {
        ...base,
        ...overrides,
        id: base.id,
        role: "client",
        verified: base.verified,
      }
    : base;

  const projectHistory = getCompletedProjectsForClient(clientId).map(
    (project) => {
      const student = studentProfiles.find((s) => s.id === project.studentId);
      return {
        ...project,
        studentName: student?.displayName ?? "Student freelancer",
      };
    },
  );

  return { profile, projectHistory };
}
