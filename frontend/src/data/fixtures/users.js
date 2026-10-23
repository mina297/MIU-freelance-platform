import { ROLES } from "../../features/auth/session.js";

// Fictional demo accounts. Preserve marketplace participant IDs and names.
// Committee entries represent provisioned accounts, never public registration.
export const mockUsers = Object.freeze(
  [
    { id: "student_001", displayName: "Salma Farid", role: ROLES.STUDENT },
    { id: "student_002", displayName: "Omar Nabil", role: ROLES.STUDENT },
    { id: "client_001", displayName: "Nile Studio", role: ROLES.CLIENT },
    {
      id: "admin_001",
      displayName: "Super Admin",
      role: ROLES.SUPER_ADMIN,
    },
    {
      id: "committee_verification_001",
      displayName: "Verification Reviewer",
      role: ROLES.VERIFICATION,
    },
    {
      id: "committee_marketplace_001",
      displayName: "Marketplace Reviewer",
      role: ROLES.MARKETPLACE,
    },
    {
      id: "committee_finance_001",
      displayName: "Finance Reviewer",
      role: ROLES.FINANCE,
    },
    {
      id: "committee_support_001",
      displayName: "Support Reviewer",
      role: ROLES.SUPPORT,
    },
    {
      id: "committee_ai_quality_001",
      displayName: "AI Quality Reviewer",
      role: ROLES.AI_QUALITY,
    },
  ].map((user) =>
    Object.freeze({
      ...user,
      accountStatus: "active",
      verificationStatus: "pending",
    }),
  ),
);
