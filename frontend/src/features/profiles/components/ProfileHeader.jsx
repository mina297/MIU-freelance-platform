import { useLanguage } from "../../../i18n/LanguageContext.js";
import {
  BadgeCheck,
  MessageCircle,
  Eye,
  Settings,
  MapPin,
  BriefcaseBusiness,
  Star,
} from "lucide-react";
import { getRatingAriaLabel, getStarDisplay } from "../utils/ratingDisplay.js";
import SafeImage from "./SafeImage.jsx";

/** Public profile header with photo, name, rating, and bio. */
export default function ProfileHeader({
  profile,
  onContact,
  contactLabel = "Contact",
  onViewPublicProfile,
  onEditProfile,
}) {
  const { t, language } = useLanguage();

  const { label } = getStarDisplay(profile.ratingSummary.average);
  const initials = profile.displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <header className="profile-hero">
      <div className="profile-hero__photo">
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

      <div className="profile-hero__identity">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1>{profile.displayName}</h1>
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

        {profile.headline && (
          <p className="text-base leading-normal text-ink-secondary">
            {profile.headline}
          </p>
        )}

        <div className="profile-hero__meta">
          {profile.location && (
            <span>
              <MapPin size={14} aria-hidden="true" />
              {profile.location}
            </span>
          )}
          {profile.availability?.trim() && (
            <span>
              {profile.availability !== "Not specified" && (
                <i className="profile-availability-dot" aria-hidden="true" />
              )}
              {profile.availability.trim()}
            </span>
          )}
        </div>

        <div
          className="profile-hero__meta"
          aria-label={t(
            getRatingAriaLabel(
              profile.ratingSummary.average,
              profile.ratingSummary.count,
              language,
            ),
          )}
        >
          <span>
            <Star size={15} className="profile-accent" aria-hidden="true" />
            <b>{t(label)}</b> ({profile.ratingSummary.count} {t("reviews)")}
          </span>
          <span>
            <BriefcaseBusiness size={15} aria-hidden="true" />
            {profile.completedJobsCount} {t("Projects")}
          </span>
        </div>
      </div>

      {(onViewPublicProfile || onEditProfile) && (
        <div className="profile-hero__actions">
          {onViewPublicProfile && (
            <button
              type="button"
              className="profile-action profile-action--primary"
              onClick={onViewPublicProfile}
            >
              <Eye size={17} aria-hidden="true" />
              {t("View public profile")}
            </button>
          )}
          {onEditProfile && (
            <button
              type="button"
              className="profile-action"
              onClick={onEditProfile}
            >
              <Settings size={17} aria-hidden="true" />
              {t("Profile settings")}
            </button>
          )}
        </div>
      )}

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
