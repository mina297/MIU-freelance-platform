import { getRatingAriaLabel, getStarDisplay } from "../../profiles/utils/ratingDisplay.js";

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
  const { average, count, distribution } = ratingSummary;
  const { filled, empty, label } = getStarDisplay(average);
  const maxBar = Math.max(1, ...distribution.map((d) => d.count));

  return (
    <section
      className="rounded-[10px] border border-[#e5e7eb] bg-white p-5 shadow-[0px_8px_24px_0px_rgba(17,17,17,0.05)] sm:p-6"
      aria-label={getRatingAriaLabel(average, count)}
    >
      <h2 className="text-lg font-semibold text-miu-black">Rating summary</h2>
      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="text-center sm:min-w-[120px]">
          <p className="text-4xl font-bold text-miu-black">{label}</p>
          <p className="mt-1 text-star" aria-hidden="true">
            {"★".repeat(filled)}
            <span className="text-[#d1d5db]">{"★".repeat(empty)}</span>
          </p>
          <p className="mt-1 text-sm text-[#4b5563]">{count} reviews</p>
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
                <span className="w-12 shrink-0 text-[#4b5563]">{stars} star</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f1f1f3]">
                  <div
                    className="h-full rounded-full bg-star"
                    style={{ width: `${widthPct}%` }}
                    aria-hidden="true"
                  />
                </div>
                <span className="w-8 text-right font-medium text-miu-black">
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
