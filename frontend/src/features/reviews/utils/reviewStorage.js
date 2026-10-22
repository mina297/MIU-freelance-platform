import { REVIEW_SUBMISSIONS_STORAGE_KEY } from "../../profiles/constants.js";

export function loadSubmittedReviews() {
  try {
    const raw = window.sessionStorage.getItem(REVIEW_SUBMISSIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * @param {object} review
 */
export function saveSubmittedReview(review) {
  const all = loadSubmittedReviews();
  all.unshift(review);
  window.sessionStorage.setItem(
    REVIEW_SUBMISSIONS_STORAGE_KEY,
    JSON.stringify(all),
  );
  return review;
}
