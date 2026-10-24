import { SUPPORT_SUBMISSIONS_STORAGE_KEY } from "../../profiles/constants.js";

export function loadSupportSubmissions() {
  try {
    const raw = window.sessionStorage.getItem(SUPPORT_SUBMISSIONS_STORAGE_KEY);
    const value = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function saveSupportSubmission(ticket) {
  const all = loadSupportSubmissions();
  all.unshift(ticket);
  window.sessionStorage.setItem(
    SUPPORT_SUBMISSIONS_STORAGE_KEY,
    JSON.stringify(all),
  );
  return ticket;
}
