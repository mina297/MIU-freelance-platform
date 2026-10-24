import { clientEligibility } from "./projectCreation.js";
import {
  ORDER_SOURCE,
  PROJECT_STATUS,
  PROPOSAL_STATUS,
} from "../marketplace/constants.js";

/** Conservative Phase 1 transitions; funded/order cancellation rules remain undecided. */
export function projectTransitionError(project, session, action, commitments) {
  const access = clientEligibility(session);
  if (access) return access;
  if (!project || project.clientId !== session.user.id)
    return "This project is unavailable or does not belong to your account.";
  if (!["close", "cancel"].includes(action))
    return "Choose a supported project action.";
  if (
    commitments.orders.some(
      (order) =>
        order.sourceType === ORDER_SOURCE.PROJECT &&
        order.sourceId === project.id,
    ) ||
    commitments.proposals.some(
      (proposal) =>
        proposal.projectId === project.id &&
        proposal.status === PROPOSAL_STATUS.ACCEPTED,
    )
  )
    return "This project has a linked order or accepted proposal. Closing and cancellation for committed work are not supported in this demo.";
  const allowed =
    action === "close"
      ? [PROJECT_STATUS.OPEN]
      : [PROJECT_STATUS.OPEN, PROJECT_STATUS.CLOSED];
  if (!allowed.includes(project.status))
    return action === "close"
      ? "Only open projects can be closed."
      : "Only open or closed projects without commitments can be cancelled.";
  return null;
}
