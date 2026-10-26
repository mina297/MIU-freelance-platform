import { useLanguage } from "../../../i18n/LanguageContext.js";
import UserSummaryCard from "../../profiles/components/UserSummaryCard.jsx";
import EvidenceAttachmentPreview from "./EvidenceAttachmentPreview.jsx";
import {
  formatSupportTopicLabel,
  formatTicketStatusLabel,
  formatTicketSubmittedAt,
} from "../utils/ticketLabels.js";

/** Read-only ticket view for support requests (no assignment or committee actions). */
export default function TicketDetails({ ticket, className = "" }) {
  const { t, locale } = useLanguage();

  if (!ticket) {
    return (
      <div className="rounded-panel border border-dashed border-border-soft bg-[var(--theme-surface,#fff)] p-6 text-sm text-ink-secondary">
        {t("No ticket selected.")}
      </div>
    );
  }

  const subject = ticket.subject || "Untitled support request";
  const description = ticket.description || ticket.message || "";
  const category =
    ticket.categoryLabel || formatSupportTopicLabel(ticket.topic);
  const statusLabel = formatTicketStatusLabel(ticket.status || "submitted");
  const evidence = ticket.evidence || ticket.attachments || [];
  const requester = ticket.requester || {
    displayName: ticket.name || "Requester",
    headline: ticket.email || "",
    roleLabel: "Support requester",
  };

  return (
    <article
      className={`space-y-5 rounded-panel border border-border-soft bg-[var(--theme-surface,#fff)] p-5 shadow-[var(--shadow-panel)] sm:p-6 ${className}`}
      aria-labelledby="ticket-details-heading"
    >
      <header className="flex flex-col gap-3 border-b border-border-soft pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-accent,var(--color-miu-red))]">
            {t("Support ticket")}
          </p>
          <h2
            id="ticket-details-heading"
            className="text-xl font-semibold text-miu-black"
          >
            {subject}
          </h2>
          <p className="break-all text-sm text-ink-secondary">
            {t("ID:")}{" "}
            <span className="font-medium text-miu-black">
              {ticket.id || "Unavailable"}
            </span>
          </p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full bg-miu-red-tint px-3 py-1 text-xs font-semibold text-[var(--theme-accent,var(--color-miu-red))]">
          {t(statusLabel)}
        </span>
      </header>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-ink-secondary">{t("Category")}</dt>
          <dd className="text-sm font-medium text-miu-black">
            {ticket.categoryLabel || t(category)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-ink-secondary">{t("Submitted")}</dt>
          <dd className="text-sm font-medium text-miu-black">
            {formatTicketSubmittedAt(ticket.createdAt, locale)}
          </dd>
        </div>
        {ticket.referenceId ? (
          <div className="sm:col-span-2">
            <dt className="text-xs text-ink-secondary">
              {t("Related reference")}
            </dt>
            <dd className="break-all text-sm font-medium text-miu-black">
              {ticket.referenceId}
            </dd>
          </div>
        ) : null}
      </dl>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-miu-black">
          {t("Description")}
        </h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-secondary">
          {description || "No description provided."}
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-miu-black">
          {t("Requester")}
        </h3>
        <UserSummaryCard
          displayName={requester.displayName}
          headline={requester.headline || requester.roleLabel}
          roleLabel={requester.roleLabel}
          profileImage={requester.profileImage}
          verified={Boolean(requester.verified)}
        />
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-miu-black">
          {t("Evidence attachments")}
        </h3>
        {evidence.length > 0 ? (
          <EvidenceAttachmentPreview files={evidence} />
        ) : (
          <p className="text-sm text-ink-secondary">
            {t("No evidence attached.")}
          </p>
        )}
      </section>

      {ticket.simulated ? (
        <p className="rounded-lg bg-surface-page px-3 py-2 text-xs text-ink-secondary">
          {t(
            "Phase 1 simulation — ticket assignment and dispute decisions are owned by Member 3 and are not available here.",
          )}
        </p>
      ) : null}
    </article>
  );
}
