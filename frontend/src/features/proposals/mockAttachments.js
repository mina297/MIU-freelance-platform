// Metadata only. These fictional samples have no file contents or download URLs.
export const MOCK_PROPOSAL_ATTACHMENTS = Object.freeze([
  Object.freeze({ id: "demo_attachment_portfolio", name: "Sample portfolio.pdf", description: "Fictional examples of previous work" }),
  Object.freeze({ id: "demo_attachment_plan", name: "Sample project plan.pdf", description: "Fictional approach and delivery outline" }),
]);

export function validateAttachmentIds(ids = []) {
  if (!Array.isArray(ids) || ids.some((id) => !MOCK_PROPOSAL_ATTACHMENTS.some((sample) => sample.id === id)))
    return "Choose only the available fictional sample attachments.";
  if (new Set(ids).size !== ids.length)
    return "Select each sample attachment only once.";
  return null;
}
