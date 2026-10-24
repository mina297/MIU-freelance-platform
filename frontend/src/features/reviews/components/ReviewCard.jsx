import { getStarDisplay } from "../../profiles/utils/ratingDisplay.js";

/**
 * @param {{
 *   review: {
 *     id: string,
 *     reviewerName: string,
 *     reviewerOrganization?: string,
 *     reviewerInitials?: string,
 *     rating: number,
 *     createdAt: string,
 *     body: string,
 *     jobLabel?: string,
 *     simulated?: boolean,
 *   },
 * }} props
 */
export default function ReviewCard({ review }) {
  const { filled, empty, label } = getStarDisplay(review.rating);
  const initials =
    review.reviewerInitials ||
    review.reviewerName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");

  const dateLabel = new Date(review.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="rounded-[10px] border border-[#e5e7eb] bg-white p-5 shadow-[0px_8px_24px_0px_rgba(17,17,17,0.05)] sm:p-6">
      <div className="flex items-start gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-miu-red-tint text-sm font-semibold text-miu-red"
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="text-base font-semibold text-miu-black">
              {review.reviewerName}
            </h3>
            {review.simulated ? (
              <span className="rounded-full bg-[#f1f1f3] px-2 py-0.5 text-[11px] font-medium text-[#4b5563]">
                Simulated submission
              </span>
            ) : null}
          </div>
          {review.reviewerOrganization ? (
            <p className="text-sm text-[#4b5563]">
              {review.reviewerOrganization}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-star" aria-hidden="true">
              {"★".repeat(filled)}
              <span className="text-[#d1d5db]">{"★".repeat(empty)}</span>
            </span>
            <span className="font-semibold text-miu-black">{label}</span>
            <span className="text-[#4b5563]">{dateLabel}</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-[#4b5563]">
        {review.body}
      </p>

      {review.jobLabel ? (
        <p className="mt-3 text-sm font-medium text-miu-black">
          Project:{" "}
          <span className="font-normal text-[#4b5563]">{review.jobLabel}</span>
        </p>
      ) : null}
    </article>
  );
}
