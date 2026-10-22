/**
 * Phase 1 marketplace status vocabulary.
 *
 * These values reflect the proposed workflows in the module documentation.
 * They are not approved production state machines or permission rules.
 */

/** @see docs/06-MODULES/PROJECTS_AND_PROPOSALS.md */
export const PROJECT_STATUS = Object.freeze({
  DRAFT: "draft",
  OPEN: "open",
  UNDER_REVIEW: "under_review",
  SELECTED: "selected",
  CLOSED: "closed",
  CANCELLED: "cancelled",
});

/** @see docs/06-MODULES/PROJECTS_AND_PROPOSALS.md */
export const PROPOSAL_STATUS = Object.freeze({
  SUBMITTED: "submitted",
  SHORTLISTED: "shortlisted",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
});

/** A service can be prepared, visible to clients, or temporarily unavailable. */
export const SERVICE_STATUS = Object.freeze({
  DRAFT: "draft",
  PUBLISHED: "published",
  PAUSED: "paused",
});

/** @see docs/06-MODULES/SERVICES_AND_ORDERS.md */
export const ORDER_STATUS = Object.freeze({
  AWAITING_PAYMENT: "awaiting_payment",
  FUNDED: "funded",
  IN_PROGRESS: "in_progress",
  DELIVERED: "delivered",
  REVISION_REQUESTED: "revision_requested",
  COMPLETED: "completed",
  DISPUTED: "disputed",
  CANCELLED: "cancelled",
});

/** The marketplace path that created an order. */
export const ORDER_SOURCE = Object.freeze({
  PROJECT: "project",
  SERVICE: "service",
});
