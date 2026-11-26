import { isActiveUser } from "../auth/session.js";
import { createLocalAuthStore } from "../auth/localAuthStore.js";

// New-account profile shells contain public fields only and reset with the app.
const profiles = new Map();

export function createRegistrationProfile(user) {
  if (!isActiveUser(user) || !["student", "client"].includes(user.role)) return;
  if (profiles.has(user.id)) return profiles.get(user.id);
  const profile = {
    id: user.id,
    role: user.role,
    displayName: user.displayName,
    firstName: user.displayName.split(" ")[0],
    headline: "",
    shortBio: "",
    aboutParagraphs: [],
    location: "",
    links: [],
    profileImage: null,
    profileImageAlt: "",
    verified: false,
    ...(user.role === "student"
      ? {
          skills: [],
          languages: [],
          availability: "",
          rateEGP: null,
          fieldOfStudy: "",
          yearLabel: "",
          communityNote: "",
          completedJobsCount: 0,
          portfolioItemIds: [],
          completedProjectIds: [],
          ratingSummary: { average: 0, count: 0, distribution: [] },
        }
      : { organizationName: "", projectHistoryIds: [] }),
  };
  profiles.set(user.id, profile);
  return profile;
}

export function getRegistrationProfile(id, role) {
  const savedUser = createLocalAuthStore().getPublicProfileUser(id, role);
  const profile =
    profiles.get(id) ?? (savedUser && createRegistrationProfile(savedUser));
  return profile?.role === role ? profile : null;
}
