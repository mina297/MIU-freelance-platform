/** Help and support feature exports. */

export { default as HelpCenterPage } from "./HelpCenterPage.jsx";
export { default as HelpArticlePage } from "./HelpArticlePage.jsx";
export { default as SupportContactPage } from "./SupportContactPage.jsx";
export { default as FaqAccordion } from "./components/FaqAccordion.jsx";
export { default as SupportRequestForm } from "./components/SupportRequestForm.jsx";
export { default as EvidenceAttachmentPreview } from "./components/EvidenceAttachmentPreview.jsx";
/** Same as EvidenceAttachmentPreview; leave out onRemove for read-only use. */
export { default as EvidenceGallery } from "./components/EvidenceAttachmentPreview.jsx";
export { default as TicketDetails } from "./components/TicketDetails.jsx";
export { validateSupportForm } from "./utils/validateSupport.js";
export {
  formatSupportTopicLabel,
  formatTicketStatusLabel,
  formatTicketSubmittedAt,
  SUPPORT_TOPIC_LABELS,
} from "./utils/ticketLabels.js";
export { loadSupportSubmissions } from "./utils/supportStorage.js";

export const MEMBER5_HELP_ROUTES = [
  {
    path: "/help",
    elementExport: "HelpCenterPage",
    access: "Public",
  },
  {
    path: "/help/:articleSlug",
    elementExport: "HelpArticlePage",
    access: "Public",
  },
  {
    path: "/support/contact",
    elementExport: "SupportContactPage",
    access: "Public (authenticated preferred in production)",
    notes: "Simulated submission only. No Member 3 committee assignment.",
  },
];
