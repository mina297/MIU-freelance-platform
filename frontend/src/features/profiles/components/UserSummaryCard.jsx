import { BadgeCheck } from "lucide-react";
import { getRatingAriaLabel, getStarDisplay } from "../utils/ratingDisplay.js";
import SafeImage from "./SafeImage.jsx";

/** Compact user card for lists and tickets (not the full profile header). */
export default function UserSummaryCard({
  displayName = "Unknown user",
  headline = "",
  roleLabel = "",
  profileImage = null,
  profileImageAlt = "",
  verified = false,
  ratingSummary = null,
  onSelect,
  className = "",
}) {
  const name = String(displayName || "Unknown user").trim() || "Unknown user";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const subtitle = headline || roleLabel || "MIU Freelance member";
  const showRating =
    ratingSummary &&
    Number.isFinite(Number(ratingSummary.average)) &&
    Number(ratingSummary.count) > 0;
  const stars = showRating
    ? getStarDisplay(Number(ratingSummary.average))
    : null;

  const content = (
    <>
      <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-[#f1f1f3] ring-1 ring-[#e5e7eb] sm:size-14">
        <SafeImage
          key={profileImage || name}
          src={profileImage}
          alt={profileImageAlt || `Photo of ${name}`}
          className="size-full object-cover"
          width={56}
          height={56}
          placeholderClassName="flex size-full items-center justify-center bg-miu-red-tint text-sm font-semibold text-miu-red"
          placeholderLabel={initials || "?"}
        />
      </div>

      <div className="min-w-0 flex-1 text-left">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-miu-black sm:text-base">
            {name}
          </p>
          {verified ? (
            <BadgeCheck
              className="size-4 shrink-0 text-miu-red"
              aria-label="Verified"
            />
          ) : null}
        </div>
        <p className="truncate text-xs text-[#4b5563] sm:text-sm">{subtitle}</p>
        {showRating && stars ? (
          <p
            className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[#4b5563]"
            aria-label={getRatingAriaLabel(
              Number(ratingSummary.average),
              Number(ratingSummary.count),
            )}
          >
            <span className="text-star" aria-hidden="true">
              {"★".repeat(stars.filled)}
              <span className="text-[#d1d5db]">{"★".repeat(stars.empty)}</span>
            </span>
            <span className="font-medium text-miu-black">{stars.label}</span>
            <span>({Number(ratingSummary.count)})</span>
          </p>
        ) : null}
      </div>
    </>
  );

  const baseClass = `flex w-full items-center gap-3 rounded-[10px] border border-[#e5e7eb] bg-white p-3 shadow-[0px_4px_12px_0px_rgba(17,17,17,0.04)] sm:gap-4 sm:p-4 ${className}`;

  if (typeof onSelect === "function") {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={`${baseClass} text-left transition hover:border-miu-red/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red`}
      >
        {content}
      </button>
    );
  }

  return <div className={baseClass}>{content}</div>;
}
