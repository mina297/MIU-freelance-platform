import { isActiveUser, ROLES } from "../auth/session.js";
import { PROJECT_STATUS } from "../marketplace/constants.js";
import { validateAttachmentIds } from "./mockAttachments.js";

export function validateProposal(values, project, session) {
  const errors = {};
  if (
    session?.status !== "authenticated" ||
    !isActiveUser(session.user) ||
    session.user.role !== ROLES.STUDENT
  )
    errors.eligibility = "An active student account is required.";
  else if (session.user.verificationStatus !== "approved")
    errors.eligibility = "Student verification is required before submission.";
  if (!project || project.status !== PROJECT_STATUS.OPEN)
    errors.project = "This project is not accepting proposals.";
  const price = String(values.priceEGP ?? "").trim();
  if (
    !/^\d+(\.\d{1,2})?$/.test(price) ||
    !Number.isFinite(Number(price)) ||
    Number(price) <= 0 ||
    Number(price) > Number.MAX_SAFE_INTEGER / 100
  )
    errors.priceEGP =
      "Enter a positive EGP price with at most two decimal places.";
  const days = String(values.deliveryDays ?? "").trim();
  if (
    !/^\d+$/.test(days) ||
    !Number.isSafeInteger(Number(days)) ||
    Number(days) < 1
  )
    errors.deliveryDays = "Enter a whole number of days greater than zero.";
  if (typeof values.coverMessage !== "string" || !values.coverMessage.trim())
    errors.coverMessage = "Write a cover message explaining your approach.";
  const attachmentError = validateAttachmentIds(values.attachmentIds);
  if (attachmentError) errors.attachmentIds = attachmentError;
  return errors;
}
