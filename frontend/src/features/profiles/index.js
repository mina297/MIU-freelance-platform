/** Profiles feature exports for Member 1 integration. */

export { default as StudentProfilePage } from "./StudentProfilePage.jsx";
export { default as StudentProfilePreview } from "./StudentProfilePreview.jsx";
export { default as ClientProfilePage } from "./ClientProfilePage.jsx";
export { default as ProfileEditPage } from "./ProfileEditPage.jsx";

export { default as ProfileHeader } from "./components/ProfileHeader.jsx";
export { default as UserSummaryCard } from "./components/UserSummaryCard.jsx";
export { default as SafeImage } from "./components/SafeImage.jsx";
export { default as FileUploadField } from "./components/FileUploadField.jsx";
export { resolveExternalLink } from "./utils/safeExternalUrl.js";
export { default as ProfileTabs } from "./components/ProfileTabs.jsx";
export { default as AboutSection } from "./components/AboutSection.jsx";
export { default as AtAGlanceCard } from "./components/AtAGlanceCard.jsx";
export { default as LinksCard } from "./components/LinksCard.jsx";
export { default as SkillsDisplay } from "./components/SkillsDisplay.jsx";
export { default as CommunityCard } from "./components/CommunityCard.jsx";
export { default as ProfileBreadcrumb } from "./components/ProfileBreadcrumb.jsx";
export { default as PortfolioGallery } from "./components/PortfolioGallery.jsx";
export { default as PortfolioItemModal } from "./components/PortfolioItemModal.jsx";
export { default as PortfolioItemForm } from "./components/PortfolioItemForm.jsx";
export { default as PortfolioSection } from "./components/PortfolioSection.jsx";
export { validatePortfolioItem } from "./utils/validatePortfolioItem.js";
export {
  getResolvedPortfolioItems,
  upsertPortfolioItem,
  deletePortfolioItem,
} from "./utils/portfolioStorage.js";
export { PORTFOLIO_OVERRIDES_STORAGE_KEY } from "./constants.js";
export { default as ReviewsSection } from "./components/ReviewsSection.jsx";
export { default as CompletedJobsSection } from "./components/CompletedJobsSection.jsx";
export {
  ProfileLoadingState,
  ProfileNotFoundState,
  ProfileEmptyState,
} from "./components/ProfileStates.jsx";

export { useStudentProfile } from "./hooks/useStudentProfile.js";
export { useClientProfile } from "./hooks/useClientProfile.js";
export { getStudentProfileById } from "./utils/getStudentProfile.js";
export { getClientProfileById } from "./utils/getClientProfile.js";
export { formatEGP } from "./utils/formatCurrency.js";
export {
  formatLanguagesLabel,
  formatCompletedJobsLabel,
  formatClientFeedbackLabel,
} from "./utils/formatProfileLabels.js";
export { getStarDisplay, getRatingAriaLabel } from "./utils/ratingDisplay.js";
export {
  PROFILE_TABS,
  DEFAULT_STUDENT_PROFILE_ID,
  DEFAULT_CLIENT_PROFILE_ID,
  PROFILE_LOAD_DELAY_MS,
  PROFILE_EDIT_STORAGE_KEY,
} from "./constants.js";

/** Documented route contracts for Member 1. */
export const MEMBER5_PROFILE_ROUTES = [
  {
    path: "/students/:studentId",
    elementExport: "StudentProfilePage",
    access: "Public (visitor) / owner via viewerMode prop",
    notes: "Tabs: About, Portfolio, Reviews, Completed Jobs.",
  },
  {
    path: "/clients/:clientId",
    elementExport: "ClientProfilePage",
    access: "Public",
  },
  {
    path: "/profile/edit",
    elementExport: "ProfileEditPage",
    access: "Authenticated owner (demo: pass profileId + role props)",
    notes:
      "Simulated persistence via sessionStorage. Does not touch AuthProvider.",
  },
];

/** @deprecated Use MEMBER5_PROFILE_ROUTES */
export const MEMBER5_STAGE1_ROUTES = MEMBER5_PROFILE_ROUTES;
