/**
 * @param {{
 *   rating: number,
 *   body: string,
 *   orderId: string,
 * }} values
 * @returns {Record<string, string>}
 */
export function validateReviewForm(values) {
  /** @type {Record<string, string>} */
  const errors = {};

  if (!values.orderId) {
    errors.orderId = "Select a completed order you are eligible to review.";
  }

  if (
    !Number.isInteger(values.rating) ||
    values.rating < 1 ||
    values.rating > 5
  ) {
    errors.rating = "Choose a rating from 1 to 5 stars.";
  }

  const body = String(values.body ?? "").trim();
  if (body.length < 20) {
    errors.body = "Write at least 20 characters so the feedback is useful.";
  } else if (body.length > 800) {
    errors.body = "Keep the review under 800 characters.";
  }

  return errors;
}
