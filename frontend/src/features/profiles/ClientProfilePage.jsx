import { BadgeCheck } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext.js";
import { ownsProfile } from "./utils/profileOwnership.js";
import ProfileBreadcrumb from "./components/ProfileBreadcrumb.jsx";
import {
  ProfileLoadingState,
  ProfileNotFoundState,
  ProfileEmptyState,
} from "./components/ProfileStates.jsx";
import SafeImage from "./components/SafeImage.jsx";
import { DEFAULT_CLIENT_PROFILE_ID } from "./constants.js";
import { useClientProfile } from "./hooks/useClientProfile.js";
import { formatEGP } from "./utils/formatCurrency.js";

/**
 * Client public profile with organization info and project history.
 * Expected route: `/clients/:clientId`
 *
 * @param {{
 *   clientId?: string,
 *   viewerMode?: 'visitor' | 'owner',
 *   onBack?: () => void,
 *   onEditProfile?: () => void,
 *   onViewStudent?: (studentId: string) => void,
 *   simulateDelay?: boolean,
 * }} props
 */
export default function ClientProfilePage({
  clientId = DEFAULT_CLIENT_PROFILE_ID,
  viewerMode = "visitor",
  onBack,
  onEditProfile,
  onViewStudent,
  simulateDelay = true,
}) {
  const { status, data } = useClientProfile(clientId, { simulateDelay });
  const auth = useContext(AuthContext);
  const isOwner =
    viewerMode === "owner" && ownsProfile(auth?.session, clientId, "client");

  if (status === "loading") {
    return (
      <div className="w-full bg-surface-page px-5 py-8 sm:px-8 md:px-[120px] md:pb-16 md:pt-8">
        <ProfileLoadingState />
      </div>
    );
  }

  if (status === "not_found" || !data) {
    return (
      <div className="w-full bg-surface-page px-5 py-8 sm:px-8 md:px-[120px] md:pb-16 md:pt-8">
        <ProfileNotFoundState studentId={clientId} />
      </div>
    );
  }

  const { profile, projectHistory } = data;
  const initials = profile.displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="w-full bg-surface-page">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-5 py-8 sm:px-8 md:px-[120px] md:pb-16 md:pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ProfileBreadcrumb onBack={onBack} />
          {isOwner && onEditProfile ? (
            <button
              type="button"
              onClick={onEditProfile}
              className="h-10 rounded-full border border-miu-red px-4 text-sm font-semibold text-[var(--theme-accent,var(--color-miu-red))] hover:bg-miu-red-tint"
            >
              Edit profile
            </button>
          ) : null}
        </div>

        <header className="flex w-full flex-col gap-6 rounded-panel border border-border-soft bg-[var(--theme-surface,#fff)] p-5 shadow-[var(--shadow-panel)] sm:p-8 md:flex-row">
          <div className="size-[120px] shrink-0 overflow-hidden rounded-full bg-miu-red-tint md:size-[132px]">
            <SafeImage
              src={profile.profileImage}
              alt={profile.profileImageAlt}
              className="size-full object-cover"
              placeholderClassName="flex size-full items-center justify-center text-2xl font-semibold text-[var(--theme-accent,var(--color-miu-red))]"
              placeholderLabel={initials || "?"}
            />
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[28px] font-bold text-miu-black md:text-[32px]">
                {profile.displayName}
              </h1>
              {profile.verified ? (
                <BadgeCheck
                  className="size-[22px] text-[var(--theme-accent,var(--color-miu-red))]"
                  aria-label="Verified"
                />
              ) : null}
            </div>
            <p className="text-base font-medium text-miu-black">
              {profile.organizationName}
            </p>
            <p className="text-base text-ink-secondary">{profile.headline}</p>
            <p className="max-w-[720px] text-[15px] leading-relaxed text-ink-secondary">
              {profile.shortBio}
            </p>
            <p className="text-sm text-ink-secondary">{profile.location}</p>
          </div>
        </header>

        <section className="rounded-panel border border-border-soft bg-[var(--theme-surface,#fff)] p-5 shadow-[var(--shadow-panel)] sm:p-6">
          <h2 className="text-xl font-semibold text-miu-black">About</h2>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-secondary">
            {profile.aboutParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-miu-black">
            Project history
          </h2>
          {projectHistory.length === 0 ? (
            <ProfileEmptyState message="No completed projects linked to this client yet." />
          ) : (
            <ul className="overflow-hidden rounded-panel border border-border-soft bg-[var(--theme-surface,#fff)] shadow-[var(--shadow-panel)]">
              {projectHistory.map((project, index) => {
                const dateLabel = new Date(
                  project.completedAt,
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                return (
                  <li
                    key={project.id}
                    className={`flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
                      index > 0 ? "border-t border-border-soft" : ""
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-miu-black">
                        {project.title}
                      </p>
                      <p className="mt-1 text-sm text-ink-secondary">
                        {project.category} · {dateLabel} · with{" "}
                        {onViewStudent ? (
                          <button
                            type="button"
                            className="font-medium text-[var(--theme-accent,var(--color-miu-red))] underline-offset-2 hover:underline"
                            onClick={() => onViewStudent(project.studentId)}
                          >
                            {project.studentName}
                          </button>
                        ) : (
                          project.studentName
                        )}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-miu-black">
                      {formatEGP(project.amountEGP)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
