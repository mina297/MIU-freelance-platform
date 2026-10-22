import RatingSummary from "../../reviews/components/RatingSummary.jsx";
import ReviewCard from "../../reviews/components/ReviewCard.jsx";
import { ProfileEmptyState } from "./ProfileStates.jsx";

/**
 * @param {{
 *   ratingSummary: object,
 *   reviews: object[],
 *   isOwner?: boolean,
 *   onLeaveReview?: () => void,
 * }} props
 */
export default function ReviewsSection({
  ratingSummary,
  reviews,
  isOwner = false,
  onLeaveReview,
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-miu-black">Reviews</h2>
        {!isOwner && onLeaveReview ? (
          <button
            type="button"
            onClick={onLeaveReview}
            className="h-10 rounded-full border border-miu-red px-4 text-sm font-semibold text-miu-red hover:bg-miu-red-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
          >
            Leave a review
          </button>
        ) : null}
      </div>

      <RatingSummary ratingSummary={ratingSummary} />

      {reviews.length === 0 ? (
        <ProfileEmptyState message="No reviews yet for this profile." />
      ) : (
        <ul className="flex flex-col gap-4">
          {reviews.map((review) => (
            <li key={review.id}>
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
