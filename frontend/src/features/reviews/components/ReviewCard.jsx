import { useLanguage } from "../../../i18n/LanguageContext.js";
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
  const { t, locale } = useLanguage();

  const { filled, empty, label } = getStarDisplay(review.rating);
  const initials =
    review.reviewerInitials ||
    review.reviewerName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");

  const dateLabel = new Date(review.createdAt).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="rounded-panel border border-border-soft bg-[var(--theme-surface,#fff)] p-5 shadow-[var(--shadow-panel)] sm:p-6">
      <div className="flex items-start gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-miu-red-tint text-sm font-semibold text-[var(--theme-accent,var(--color-miu-red))]"
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
              <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-ink-secondary">
                {t("Simulated submission")}
              </span>
            ) : null}
          </div>
          {review.reviewerOrganization ? (
            <p className="text-sm text-ink-secondary">
              {review.reviewerOrganization}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-star" aria-hidden="true">
              {"★".repeat(filled)}
              <span className="text-[#d1d5db]">{"★".repeat(empty)}</span>
            </span>
            <span className="font-semibold text-miu-black">{t(label)}</span>
            <span className="text-ink-secondary">{dateLabel}</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-ink-secondary">
        {review.body}
      </p>

      {review.jobLabel ? (
        <p className="mt-3 text-sm font-medium text-miu-black">
          {t("Project:")}{" "}
          <span className="font-normal text-ink-secondary">
            {review.jobLabel}
          </span>
        </p>
      ) : null}
    </article>
  );
}
