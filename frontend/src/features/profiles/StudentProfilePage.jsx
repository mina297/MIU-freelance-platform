import { useContext, useState, useSyncExternalStore } from "react";
import { AuthContext } from "../../contexts/AuthContext.js";
import { ApplicationShellContext } from "../../components/navigation/NavigationContext.js";
import { ownsProfile } from "./utils/profileOwnership.js";
import { reviewClientAllowed, reviewStore } from "../reviews/reviewStore.js";
import ReviewFormModal from "../reviews/components/ReviewFormModal.jsx";
import CompletedJobsSection from "./components/CompletedJobsSection.jsx";
import PortfolioSection from "./components/PortfolioSection.jsx";
import ProfileHeader from "./components/ProfileHeader.jsx";
import StudentProfileOverview, {
  SkillsCard,
  EducationCard,
  ExperienceCard,
} from "./components/StudentProfileOverview.jsx";
import "./studentProfile.css";
import {
  ProfileLoadingState,
  ProfileNotFoundState,
} from "./components/ProfileStates.jsx";
import ProfileTabs from "./components/ProfileTabs.jsx";
import ReviewsSection from "./components/ReviewsSection.jsx";
import { DEFAULT_STUDENT_PROFILE_ID } from "./constants.js";
import { useStudentProfile } from "./hooks/useStudentProfile.js";

/** Student profile overview, portfolio, qualifications and review tabs. */
export default function StudentProfilePage({
  studentId = DEFAULT_STUDENT_PROFILE_ID,
  viewerMode = "visitor",
  initialTabId = "about",
  onContact,
  onEditProfile,
  onViewPublicProfile,
  onLeaveReview,
  simulateDelay = true,
}) {
  const auth = useContext(AuthContext);
  const Content = useContext(ApplicationShellContext) ? "main" : "div";
  useSyncExternalStore(
    reviewStore.subscribe,
    reviewStore.getSnapshot,
    reviewStore.getSnapshot,
  );
  const [activeTabId, setActiveTabId] = useState(initialTabId || "about");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);
  const { status, data } = useStudentProfile(studentId, {
    simulateDelay,
    refreshKey: reviewRefreshKey,
  });
  const isOwner =
    viewerMode === "owner" && ownsProfile(auth?.session, studentId, "student");

  if (status === "loading") {
    return (
      <Content className="w-full bg-surface-page px-5 py-8 sm:px-8 md:px-[120px] md:pb-16 md:pt-8">
        <ProfileLoadingState />
      </Content>
    );
  }

  if (status === "not_found" || !data) {
    return (
      <Content className="w-full bg-surface-page px-5 py-8 sm:px-8 md:px-[120px] md:pb-16 md:pt-8">
        <ProfileNotFoundState studentId={studentId} />
      </Content>
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
    <Content className="student-profile-page">
      <div className="student-profile-shell">
        <ProfileHeader
          profile={profile}
          onViewPublicProfile={isOwner ? onViewPublicProfile : undefined}
          onEditProfile={isOwner ? onEditProfile : undefined}
          onContact={
            isOwner
              ? undefined
              : (onContact ??
                (() => {
                  window.alert(
                    "Contact is a mock integration callback. Messaging is owned by other modules.",
                  );
                }))
          }
          contactLabel={isOwner ? "Owner view" : "Contact"}
        />

        <div className="student-profile-tabs">
          <ProfileTabs activeTabId={activeTabId} onTabSelect={setActiveTabId} />
        </div>
        {activeTabId === "about" && (
          <div
            role="tabpanel"
            id="profile-panel-about"
            aria-labelledby="profile-tab-about"
          >
            <StudentProfileOverview
              profile={profile}
              studentId={studentId}
              isOwner={isOwner}
              reviews={reviews}
              onSelectTab={setActiveTabId}
            />
          </div>
        )}
        {activeTabId === "skills" && (
          <div
            role="tabpanel"
            id="profile-panel-skills"
            aria-labelledby="profile-tab-skills"
          >
            <SkillsCard skills={profile.skills} />
          </div>
        )}
        {activeTabId === "experience" && (
          <div
            role="tabpanel"
            id="profile-panel-experience"
            aria-labelledby="profile-tab-experience"
          >
            <ExperienceCard />
          </div>
        )}
        {activeTabId === "education" && (
          <div
            role="tabpanel"
            id="profile-panel-education"
            aria-labelledby="profile-tab-education"
          >
            <EducationCard profile={profile} />
          </div>
        )}

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
              onLeaveReview={
                !isOwner && reviewClientAllowed(auth?.session)
                  ? handleLeaveReview
                  : undefined
              }
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
        defaultStudentId={studentId}
        onSuccess={() => setReviewRefreshKey((key) => key + 1)}
        onViewReview={() => {
          setReviewRefreshKey((key) => key + 1);
          setActiveTabId("reviews");
        }}
      />
    </Content>
  );
}
