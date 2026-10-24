import { isActiveUser, ROLES } from "../auth/session.js";

export function studentProposalError(
  proposal,
  project,
  session,
  action,
  committed = false,
) {
  if (
    session?.status !== "authenticated" ||
    !isActiveUser(session.user) ||
    session.user.role !== ROLES.STUDENT
  )
    return "An active student session is required.";
  if (!proposal || proposal.studentId !== session.user.id)
    return "This proposal is unavailable or does not belong to your account.";
  if (!["edit", "withdraw"].includes(action))
    return "Choose a supported proposal action.";
  if (
    !project ||
    project.status !== "open" ||
    !["submitted", "shortlisted"].includes(proposal.status) ||
    committed
  )
    return "Only submitted or shortlisted offers on an open project without commitments can be changed.";
  if (action === "edit" && session.user.verificationStatus !== "approved")
    return "Student verification must be approved before editing an offer.";
  return null;
}

export function filterStudentProposals(
  records,
  studentId,
  { query = "", status = "all" },
  findProject,
) {
  const text = query.trim().toLocaleLowerCase();
  return records
    .filter(
      (proposal) =>
        proposal.studentId === studentId &&
        (status === "all" || proposal.status === status) &&
        `${findProject(proposal.projectId)?.title ?? "Project unavailable"} ${proposal.coverMessage}`
          .toLocaleLowerCase()
          .includes(text),
    )
    .sort(
      (a, b) =>
        b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id),
    );
}
