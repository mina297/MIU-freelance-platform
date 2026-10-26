import { useLanguage } from "../../../i18n/LanguageContext.js";
import {
  getRatingAriaLabel,
  getStarDisplay,
} from "../../profiles/utils/ratingDisplay.js";

/**
 * @param {{
 *   ratingSummary: {
 *     average: number,
 *     count: number,
 *     distribution: { stars: number, count: number }[],
 *   },
 * }} props
 */
export default function RatingSummary({ ratingSummary }) {
  const { t, language } = useLanguage();

  const { average, count, distribution } = ratingSummary;
  const { filled, empty, label } = getStarDisplay(average);
  const maxBar = Math.max(1, ...distribution.map((d) => d.count));

  return (
    <section
      className="rounded-panel border border-border-soft bg-[var(--theme-surface,#fff)] p-5 shadow-[var(--shadow-panel)] sm:p-6"
      aria-label={t(getRatingAriaLabel(average, count, language))}
    >
      <h2 className="text-lg font-semibold text-miu-black">
        {t("Rating summary")}
      </h2>
      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="text-center sm:min-w-[120px]">
          <p className="text-4xl font-bold text-miu-black">{t(label)}</p>
          <p className="mt-1 text-star" aria-hidden="true">
            {"★".repeat(filled)}
            <span className="text-[#d1d5db]">{"★".repeat(empty)}</span>
          </p>
          <p className="mt-1 text-sm text-ink-secondary">
            {count} {t("reviews")}
          </p>
        </div>

        <ul className="flex w-full flex-col gap-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const entry = distribution.find((d) => d.stars === stars) ?? {
              stars,
              count: 0,
            };
            const widthPct = Math.round((entry.count / maxBar) * 100);
            return (
              <li key={stars} className="flex items-center gap-3 text-sm">
                <span className="w-12 shrink-0 text-ink-secondary">
                  {stars} {t("star")}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-star"
                    style={{ width: `${widthPct}%` }}
                    aria-hidden="true"
                  />
                </div>
                <span className="w-8 text-end font-medium text-miu-black">
                  {entry.count}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
