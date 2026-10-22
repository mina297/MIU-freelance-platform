/**
 * Profile tab definitions — all Member 5 tabs are interactive.
 */
export const PROFILE_TABS = [
  { id: "about", label: "About", implemented: true },
  { id: "portfolio", label: "Portfolio", implemented: true },
  { id: "reviews", label: "Reviews", implemented: true },
  { id: "completed-jobs", label: "Completed Jobs", implemented: true },
];

export const DEFAULT_STUDENT_PROFILE_ID = "student_001";
export const DEFAULT_CLIENT_PROFILE_ID = "client_001";

/** Simulated fixture load delay (ms) for loading-state demos. */
export const PROFILE_LOAD_DELAY_MS = 200;

/** sessionStorage key for simulated profile edit persistence. */
export const PROFILE_EDIT_STORAGE_KEY = "miu-m5-profile-edits-v1";

/** sessionStorage key for simulated review submissions. */
export const REVIEW_SUBMISSIONS_STORAGE_KEY = "miu-m5-review-submissions-v1";

/** sessionStorage key for simulated support tickets. */
export const SUPPORT_SUBMISSIONS_STORAGE_KEY = "miu-m5-support-submissions-v1";

/** sessionStorage key for simulated per-student portfolio overrides. */
export const PORTFOLIO_OVERRIDES_STORAGE_KEY = "miu-m5-portfolio-overrides-v1";
