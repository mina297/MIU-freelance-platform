import { studentProfiles } from "../../../data/fixtures/profiles.js";
import {
  getCompletedProjectsForStudent,
  getReviewsForStudent,
} from "../../../data/fixtures/reviews.js";
import { getProfileEdit } from "./profileEditStorage.js";
import { getResolvedPortfolioItems } from "./portfolioStorage.js";
import { mergeSubmittedIntoRatingSummary } from "./ratingDisplay.js";
import { loadSubmittedReviews } from "../../reviews/utils/reviewStorage.js";

export {
  formatLanguagesLabel,
  formatCompletedJobsLabel,
  formatClientFeedbackLabel,
} from "./formatProfileLabels.js";

/** Loads one student profile plus portfolio, reviews, and completed jobs. */
export function getStudentProfileById(studentId) {
  if (!studentId || typeof studentId !== "string") {
    return null;
  }

  const base = studentProfiles.find((entry) => entry.id === studentId);
  if (!base) {
    return null;
  }

  const overrides =
    typeof window !== "undefined" ? getProfileEdit(studentId) : null;
  const profile = overrides
    ? { ...base, ...overrides, id: base.id, role: "student" }
    : base;

  const fixtureReviews = getReviewsForStudent(studentId);
  const submitted =
    typeof window !== "undefined"
      ? loadSubmittedReviews().filter((r) => r.targetStudentId === studentId)
      : [];
  const reviews = [...submitted, ...fixtureReviews];

  return {
    profile: {
      ...profile,
      ratingSummary: mergeSubmittedIntoRatingSummary(
        profile.ratingSummary,
        submitted,
      ),
    },
    portfolioItems: getResolvedPortfolioItems(studentId),
    reviews,
    completedProjects: getCompletedProjectsForStudent(studentId),
  };
}
