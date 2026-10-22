import { useState } from "react";
import ReviewFormModal from "../reviews/components/ReviewFormModal.jsx";
import AboutSection from "./components/AboutSection.jsx";
import AtAGlanceCard from "./components/AtAGlanceCard.jsx";
import CommunityCard from "./components/CommunityCard.jsx";
import CompletedJobsSection from "./components/CompletedJobsSection.jsx";
import LinksCard from "./components/LinksCard.jsx";
import PortfolioSection from "./components/PortfolioSection.jsx";
import ProfileBreadcrumb from "./components/ProfileBreadcrumb.jsx";
import ProfileHeader from "./components/ProfileHeader.jsx";
import {
  ProfileLoadingState,
  ProfileNotFoundState,
} from "./components/ProfileStates.jsx";
import ProfileTabs from "./components/ProfileTabs.jsx";
import ReviewsSection from "./components/ReviewsSection.jsx";
import { DEFAULT_STUDENT_PROFILE_ID } from "./constants.js";
import { useStudentProfile } from "./hooks/useStudentProfile.js";

/** Student profile page (About, Portfolio, Reviews, Completed Jobs). */
export default function StudentProfilePage({
  studentId = DEFAULT_STUDENT_PROFILE_ID,
  viewerMode = "visitor",
  initialTabId = "about",
  onBack,
  onContact,
  onEditProfile,
  onLeaveReview,
  simulateDelay = true,
}) {
  const [activeTabId, setActiveTabId] = useState(initialTabId || "about");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);
  const { status, data } = useStudentProfile(studentId, {
    simulateDelay,
    refreshKey: reviewRefreshKey,
  });
  const isOwner = viewerMode === "owner";

  if (status === "loading") {
    return (
      <div className="w-full bg-[#f8f8f9] px-5 py-8 sm:px-8 md:px-[120px] md:pb-16 md:pt-8">
        <ProfileLoadingState />
      </div>
    );
  }

  if (status === "not_found" || !data) {
    return (
      <div className="w-full bg-[#f8f8f9] px-5 py-8 sm:px-8 md:px-[120px] md:pb-16 md:pt-8">
        <ProfileNotFoundState studentId={studentId} />
      </div>
    );
  }

  const { profile, portfolioItems, reviews, completedProjects } = data;

  function handleLeaveReview() {
    if (onLeaveReview) {
      onLeaveReview();
      return;
    }
    setReviewModalOpen(true);
  }

  return (
    <div className="w-full bg-[#f8f8f9]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-5 py-8 sm:px-8 md:gap-7 md:px-[120px] md:pb-16 md:pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ProfileBreadcrumb onBack={onBack} />
          {isOwner && onEditProfile ? (
            <button
              type="button"
              onClick={onEditProfile}
              className="h-10 rounded-full border border-miu-red px-4 text-sm font-semibold text-miu-red hover:bg-miu-red-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
            >
              Edit profile
            </button>
          ) : null}
        </div>

        <ProfileHeader
          profile={profile}
          onContact={
            isOwner
              ? undefined
              : onContact ??
                (() => {
                  window.alert(
                    "Contact is a mock integration callback. Messaging is owned by other modules.",
                  );
                })
          }
          contactLabel={isOwner ? "Owner view" : "Contact"}
        />

        {isOwner ? (
          <p className="rounded-lg bg-miu-red-tint px-4 py-2 text-sm text-miu-black">
            You are viewing your profile as the owner. Visitors see the public
            Contact action instead of Edit profile.
          </p>
        ) : null}

        <ProfileTabs activeTabId={activeTabId} onTabSelect={setActiveTabId} />

        {activeTabId === "about" ? (
          <div
            role="tabpanel"
            id="profile-panel-about"
            aria-labelledby="profile-tab-about"
            className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:gap-6"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-6">
              <AboutSection
                firstName={profile.firstName}
                paragraphs={profile.aboutParagraphs}
                skills={profile.skills}
              />
              <LinksCard links={profile.links} />
            </div>

            <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-[360px]">
              <AtAGlanceCard
                completedJobsCount={profile.completedJobsCount}
                ratingSummary={profile.ratingSummary}
                location={profile.location}
                languages={profile.languages}
                availability={profile.availability}
              />
              <CommunityCard description={profile.communityNote} />
            </aside>
          </div>
        ) : null}

        {activeTabId === "portfolio" ? (
          <div
            role="tabpanel"
            id="profile-panel-portfolio"
            aria-labelledby="profile-tab-portfolio"
          >
            <PortfolioSection
              key={studentId}
              studentId={studentId}
              items={portfolioItems}
              isOwner={isOwner}
            />
          </div>
        ) : null}

        {activeTabId === "reviews" ? (
          <div
            role="tabpanel"
            id="profile-panel-reviews"
            aria-labelledby="profile-tab-reviews"
          >
            <ReviewsSection
              ratingSummary={profile.ratingSummary}
              reviews={reviews}
              isOwner={isOwner}
              onLeaveReview={isOwner ? undefined : handleLeaveReview}
            />
          </div>
        ) : null}

        {activeTabId === "completed-jobs" ? (
          <div
            role="tabpanel"
            id="profile-panel-completed-jobs"
            aria-labelledby="profile-tab-completed-jobs"
          >
            <CompletedJobsSection
              projects={completedProjects}
              isOwner={isOwner}
            />
          </div>
        ) : null}
      </div>

      <ReviewFormModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        defaultClientId="client_001"
        defaultStudentId={studentId}
        onSuccess={() => setReviewRefreshKey((key) => key + 1)}
        onViewReview={() => {
          setReviewRefreshKey((key) => key + 1);
          setActiveTabId("reviews");
        }}
      />
    </div>
  );
}
