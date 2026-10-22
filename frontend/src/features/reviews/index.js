/** Reviews feature exports. */

export { default as NewReviewPage } from "./NewReviewPage.jsx";
export { default as ReviewCard } from "./components/ReviewCard.jsx";
export { default as RatingSummary } from "./components/RatingSummary.jsx";
export { default as ReviewForm } from "./components/ReviewForm.jsx";
export { default as ReviewFormModal } from "./components/ReviewFormModal.jsx";
/** Same as ReviewFormModal; handy name for Member 3. */
export { default as LeaveReviewModal } from "./components/ReviewFormModal.jsx";
export { default as ReviewSubjectSummary } from "./components/ReviewSubjectSummary.jsx";
export { default as StarRatingInput } from "./components/StarRatingInput.jsx";
export { validateReviewForm } from "./utils/validateReview.js";
export {
  loadSubmittedReviews,
  saveSubmittedReview,
} from "./utils/reviewStorage.js";

export const MEMBER5_REVIEW_ROUTES = [
  {
    path: "/reviews/new",
    elementExport: "NewReviewPage",
    access: "Authenticated client (demo: any visitor in Phase 1 preview)",
    notes: "Eligibility uses fictional completedOrders fixtures.",
  },
];
