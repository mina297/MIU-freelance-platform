/**
 * @param {{
 *   title: string,
 *   category: string,
 *   summary: string,
 *   monthLabel?: string,
 * }} values
 * @returns {Record<string, string>}
 */
export function validatePortfolioItem(values) {
  /** @type {Record<string, string>} */
  const errors = {};

  const title = String(values.title ?? "").trim();
  const category = String(values.category ?? "").trim();
  const summary = String(values.summary ?? "").trim();
  const monthLabel = String(values.monthLabel ?? "").trim();

  if (title.length < 3) {
    errors.title = "Title must be at least 3 characters.";
  } else if (title.length > 80) {
    errors.title = "Keep the title under 80 characters.";
  }

  if (category.length < 2) {
    errors.category = "Category is required.";
  }

  if (summary.length < 20) {
    errors.summary = "Summary must be at least 20 characters.";
  } else if (summary.length > 400) {
    errors.summary = "Keep the summary under 400 characters.";
  }

  if (monthLabel && monthLabel.length > 20) {
    errors.monthLabel = "Keep the month label short (e.g. OCT 2026).";
  }

  return errors;
}
