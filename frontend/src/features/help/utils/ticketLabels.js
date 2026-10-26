export const SUPPORT_TOPIC_LABELS = {
  account: "Account & access",
  payments: "Payments & escrow (demo)",
  orders: "Orders & deliverables",
  safety: "Safety & misconduct",
  other: "Other",
};

export function formatSupportTopicLabel(topic) {
  if (!topic) return "General";
  return SUPPORT_TOPIC_LABELS[topic] || topic;
}

export function formatTicketStatusLabel(status) {
  const map = {
    submitted: "Submitted",
    open: "Open",
    in_review: "In review",
    resolved: "Resolved",
    closed: "Closed",
  };
  return map[status] || "Submitted";
}

export function formatTicketSubmittedAt(iso, locale = "en-GB") {
  if (!iso) return "Date unavailable";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
