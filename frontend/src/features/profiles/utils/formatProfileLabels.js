/**
 * Pure label formatters for profile UI (easy to unit test without Vite assets).
 */

export function formatLanguagesLabel(languages) {
  if (!Array.isArray(languages) || languages.length === 0) {
    return "Not specified";
  }
  if (languages.length === 1) {
    return languages[0];
  }
  if (languages.length === 2) {
    return `${languages[0]} & ${languages[1]}`;
  }
  return `${languages.slice(0, -1).join(", ")}, & ${languages.at(-1)}`;
}

export function formatCompletedJobsLabel(count) {
  const safeCount = Number.isFinite(count) ? count : 0;
  return `${safeCount} ${safeCount === 1 ? "project" : "projects"}`;
}

export function formatClientFeedbackLabel(ratingSummary) {
  const average = ratingSummary?.average ?? 0;
  const count = ratingSummary?.count ?? 0;
  return `${average} from ${count} ${count === 1 ? "review" : "reviews"}`;
}
