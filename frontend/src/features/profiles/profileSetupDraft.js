import { isActiveUser, ROLES } from "../auth/session.js";
import { selectResume } from "./resumeSelection.js";
import { getProfileWorkCategory } from "./profileWorkCategories.js";

export function canContinueProfileSetup(draft) {
  if (draft?.method === "manual") return true;
  return (
    ["resume", "linkedin"].includes(draft?.method) &&
    Boolean(draft.resume) &&
    Boolean(
      selectResume([draft.resume], { pdfOnly: draft.method === "linkedin" })
        .file,
    )
  );
}

// The session's user object is the key: navigation preserves it, a new login
// creates a different key. No draft data is written to browser storage.
const drafts = new WeakMap();
const eligible = (session) =>
  session?.status === "authenticated" &&
  isActiveUser(session.user) &&
  session.user.role === ROLES.STUDENT;

export function getProfileSetupDraft(session) {
  return eligible(session) ? (drafts.get(session.user) ?? null) : null;
}

export function saveProfileSetupDraft(session, patch) {
  if (!eligible(session)) return;
  const previous = getProfileSetupDraft(session) ?? {
    method: "",
    resume: null,
    resumeError: "",
    scrollY: 0,
    workScrollY: 0,
    categoryId: "",
  };
  const method = ["", "manual", "resume", "linkedin"].includes(patch.method)
    ? patch.method
    : previous.method;
  const resume = Object.hasOwn(patch, "resume")
    ? patch.resume
    : previous.resume;
  const safeResume =
    ["resume", "linkedin"].includes(method) && resume
      ? (selectResume([resume], { pdfOnly: method === "linkedin" }).file ??
        null)
      : null;
  const next = Object.freeze({
    method,
    resume: safeResume ? Object.freeze(safeResume) : null,
    resumeError: ["resume", "linkedin"].includes(method)
      ? String(patch.resumeError ?? previous.resumeError).slice(0, 200)
      : "",
    scrollY: Number.isFinite(patch.scrollY)
      ? Math.max(0, patch.scrollY)
      : previous.scrollY,
    workScrollY: Number.isFinite(patch.workScrollY)
      ? Math.max(0, patch.workScrollY)
      : previous.workScrollY,
    categoryId: Object.hasOwn(patch, "categoryId")
      ? (getProfileWorkCategory(patch.categoryId)?.id ?? "")
      : previous.categoryId,
  });
  drafts.set(session.user, next);
  return next;
}
