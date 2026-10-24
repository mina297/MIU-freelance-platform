import { marketplaceParticipants } from "../../data/fixtures/marketplace.js";

export const studentName = (id) =>
  marketplaceParticipants.students.find((student) => student.id === id)
    ?.displayName ?? `Student freelancer (${id})`;
export const proposalLabel = (status) =>
  ({
    submitted: "Submitted",
    shortlisted: "Shortlisted",
    accepted: "Accepted",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
  })[status] ?? "Unavailable";

export function filterClientProposals(
  proposals,
  { query = "", status = "all", sort = "newest" } = {},
) {
  const text = query.trim().toLocaleLowerCase();
  return proposals
    .filter(
      (proposal) =>
        (status === "all" || proposal.status === status) &&
        `${studentName(proposal.studentId)} ${proposal.coverMessage}`
          .toLocaleLowerCase()
          .includes(text),
    )
    .sort((a, b) =>
      sort === "price"
        ? a.priceEGP - b.priceEGP || a.id.localeCompare(b.id)
        : sort === "delivery"
          ? a.deliveryDays - b.deliveryDays || a.id.localeCompare(b.id)
          : b.submittedAt.localeCompare(a.submittedAt) ||
            a.id.localeCompare(b.id),
    );
}
