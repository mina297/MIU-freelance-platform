import { useLanguage } from "../../../i18n/LanguageContext.js";
import { BadgeCheck, MessageCircle } from "lucide-react";
import { getRatingAriaLabel, getStarDisplay } from "../utils/ratingDisplay.js";
import SafeImage from "./SafeImage.jsx";

/** Public profile header with photo, name, rating, and bio. */
export default function ProfileHeader({
  profile,
  onContact,
  contactLabel = "Contact",
}) {
  const { t, language } = useLanguage();

  const { filled, empty, label } = getStarDisplay(
    profile.ratingSummary.average,
  );
  const initials = profile.displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <header className="premium-profile-header flex w-full flex-col items-start gap-6 overflow-hidden rounded-panel border border-border-soft bg-[var(--theme-surface,#fff)] p-5 shadow-[var(--shadow-panel)] sm:p-8 md:flex-row md:gap-7">
      <div className="relative size-[120px] shrink-0 overflow-hidden rounded-full bg-surface-muted md:size-[132px]">
        <SafeImage
          src={profile.profileImage}
          alt={
            profile.profileImageAlt || `Profile photo of ${profile.displayName}`
          }
          className="size-full object-cover"
          width={132}
          height={132}
          placeholderClassName="flex size-full items-center justify-center text-2xl font-semibold text-[var(--theme-accent,var(--color-miu-red))]"
          placeholderLabel={initials || "?"}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-[28px] font-bold leading-normal text-miu-black md:text-[32px]">
            {profile.displayName}
          </h1>
          {profile.verified ? (
            <span
              className="inline-flex items-center"
              title={t("Verified profile")}
            >
              <BadgeCheck
                className="size-[22px] text-[var(--theme-accent,var(--color-miu-red))]"
                aria-label={t("Verified")}
              />
            </span>
          ) : null}
        </div>

        <p className="text-base leading-normal text-ink-secondary">
          {profile.headline}
        </p>

        {profile.availability?.trim() ? (
          <p className="inline-flex max-w-full items-center rounded-full bg-miu-red-tint px-3 py-1 text-xs font-semibold text-[var(--theme-accent,var(--color-miu-red))] sm:text-sm">
            {profile.availability.trim()}
          </p>
        ) : null}

        <div
          className="flex flex-wrap items-center gap-2"
          aria-label={t(
            getRatingAriaLabel(
              profile.ratingSummary.average,
              profile.ratingSummary.count,
              language,
            ),
          )}
        >
          <span className="text-base leading-none text-star" aria-hidden="true">
            {"★".repeat(filled)}
            <span className="text-[#d1d5db]">{"★".repeat(empty)}</span>
          </span>
          <span className="text-sm font-semibold text-miu-black">
            {t(label)}
          </span>
          <span className="text-[13px] text-ink-secondary">
            ({profile.ratingSummary.count} {t("reviews)")}
          </span>
        </div>

        <p className="max-w-[710px] text-[15px] leading-[1.6] text-ink-secondary">
          {profile.shortBio}
        </p>
      </div>

      {typeof onContact === "function" ? (
        <button
          type="button"
          onClick={onContact}
          className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full border border-miu-red bg-miu-red px-[18px] text-sm font-semibold text-white transition-colors hover:bg-miu-red-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red md:w-auto"
        >
          <MessageCircle className="size-[18px]" aria-hidden="true" />
          {t(contactLabel)}
        </button>
      ) : null}
    </header>
  );
}
