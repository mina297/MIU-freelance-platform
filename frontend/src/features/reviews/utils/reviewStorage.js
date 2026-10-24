import { reviewStore } from "../reviewStore.js";

// Persisted legacy review data is deliberately ignored.
export const loadSubmittedReviews = reviewStore.getSnapshot;
export function saveSubmittedReview(review, session) {
  const result = reviewStore.submit(
    {
      orderId: review.relatedOrderId,
      rating: review.rating,
      body: review.body,
    },
    session,
    review.targetStudentId,
  );
  if (!result.ok) throw new Error(Object.values(result.errors).join(" "));
  return result.review;
}
