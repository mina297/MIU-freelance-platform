import { PROFILE_EDIT_STORAGE_KEY } from "../constants.js";

export function loadProfileEdits() {
  try {
    const raw = window.sessionStorage.getItem(PROFILE_EDIT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * @param {string} profileId
 * @param {Record<string, unknown>} patch
 */
export function saveProfileEdit(profileId, patch) {
  const all = loadProfileEdits();
  all[profileId] = { ...(all[profileId] ?? {}), ...patch };
  window.sessionStorage.setItem(PROFILE_EDIT_STORAGE_KEY, JSON.stringify(all));
  return all[profileId];
}

export function getProfileEdit(profileId) {
  return loadProfileEdits()[profileId] ?? null;
}
