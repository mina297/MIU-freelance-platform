/**
 * Member 5 fixture barrel.
 * Member 1 / other modules may import stable IDs from here later.
 */

export {
  STUDENT_PROFILE_IDS,
  CLIENT_PROFILE_IDS,
  studentProfiles,
  clientProfiles,
} from "./profiles.js";

export {
  portfolioItems,
  getPortfolioItemsForStudent,
} from "./portfolio.js";

export {
  reviews,
  completedProjects,
  completedOrders,
  getReviewsForStudent,
  getCompletedProjectsForStudent,
  getCompletedProjectsForClient,
  getEligibleOrdersForReview,
  getOrderById,
} from "./reviews.js";

export {
  helpCategories,
  helpArticles,
  faqItems,
  getHelpArticleBySlug,
  searchHelpContent,
} from "./help.js";

export { getPortfolioItemById } from "./portfolio.js";
