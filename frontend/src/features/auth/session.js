/** Phase 1 vocabulary only; these values do not define production policies. */
export const ROLES = Object.freeze({
  STUDENT: "student",
  CLIENT: "client",
  SUPER_ADMIN: "super_admin",
  VERIFICATION: "verification_committee",
  MARKETPLACE: "marketplace_operations_committee",
  FINANCE: "finance_committee",
  SUPPORT: "support_disputes_committee",
  AI_QUALITY: "ai_quality_committee",
});

export const PUBLIC_REGISTRATION_ROLES = Object.freeze([
  ROLES.STUDENT,
  ROLES.CLIENT,
]);

/**
 * @typedef {object} MockUser
 * @property {string} id Stable account ID shared with related module records.
 * @property {string} displayName Fictional display name.
 * @property {string} role One of ROLES; visitors have no user record.
 * @property {"active"|"suspended"|"deactivated"} accountStatus Account access state.
 * @property {"pending"|"approved"|"rejected"|"resubmission_requested"|"escalated"} verificationStatus Separate from account access; gating is deferred.
 */

/**
 * @typedef {object} MockSession
 * @property {"anonymous"|"authenticated"|"expired"} status
 * @property {MockUser|null} user No passwords, tokens, documents or persistence.
 */

/** @type {MockSession} */
export const INITIAL_SESSION = Object.freeze({
  status: "anonymous",
  user: null,
});

export function isActiveUser(user) {
  return Boolean(
    user &&
    typeof user.id === "string" &&
    user.id.trim() &&
    typeof user.displayName === "string" &&
    user.displayName.trim() &&
    Object.values(ROLES).includes(user.role) &&
    user.accountStatus === "active",
  );
}

/** Demo transitions only. Expiry is explicit; no automatic timing policy. */
export function sessionReducer(state, action) {
  switch (action.type) {
    case "start":
      return isActiveUser(action.user)
        ? { status: "authenticated", user: { ...action.user } }
        : INITIAL_SESSION;
    case "logout":
      return INITIAL_SESSION;
    case "expire":
      return state.status === "authenticated"
        ? { status: "expired", user: null }
        : state;
    default:
      return state;
  }
}

/** Role-level checks only. Ownership and verification checks belong to later tasks. */
export function getRouteAccess(session, route) {
  if (route.access === "public") return "allowed";
  if (session.status === "expired") return "expired";
  if (session.status !== "authenticated") return "login";
  if (!isActiveUser(session.user)) return "denied";
  if (route.access === "authenticated") return "allowed";
  if (route.access === "roles" && route.roles?.includes(session.user.role))
    return "allowed";
  return "denied";
}
