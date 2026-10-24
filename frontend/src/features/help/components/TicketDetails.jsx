import UserSummaryCard from "../../profiles/components/UserSummaryCard.jsx";
import EvidenceAttachmentPreview from "./EvidenceAttachmentPreview.jsx";
import {
  formatSupportTopicLabel,
  formatTicketStatusLabel,
  formatTicketSubmittedAt,
} from "../utils/ticketLabels.js";

/** Read-only ticket view for support requests (no assignment or committee actions). */
export default function TicketDetails({ ticket, className = "" }) {
  if (!ticket) {
    return (
      <div className="rounded-[10px] border border-dashed border-[#e5e7eb] bg-white p-6 text-sm text-[#4b5563]">
        No ticket selected.
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
      className={`space-y-5 rounded-[10px] border border-[#e5e7eb] bg-white p-5 shadow-[0px_8px_24px_0px_rgba(17,17,17,0.05)] sm:p-6 ${className}`}
      aria-labelledby="ticket-details-heading"
    >
      <header className="flex flex-col gap-3 border-b border-[#e5e7eb] pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-miu-red">
            Support ticket
          </p>
          <h2
            id="ticket-details-heading"
            className="text-xl font-semibold text-miu-black"
          >
            {subject}
          </h2>
          <p className="break-all text-sm text-[#4b5563]">
            ID:{" "}
            <span className="font-medium text-miu-black">
              {ticket.id || "Unavailable"}
            </span>
          </p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full bg-miu-red-tint px-3 py-1 text-xs font-semibold text-miu-red">
          {statusLabel}
        </span>
      </header>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-[#4b5563]">Category</dt>
          <dd className="text-sm font-medium text-miu-black">{category}</dd>
        </div>
        <div>
          <dt className="text-xs text-[#4b5563]">Submitted</dt>
          <dd className="text-sm font-medium text-miu-black">
            {formatTicketSubmittedAt(ticket.createdAt)}
          </dd>
        </div>
        {ticket.referenceId ? (
          <div className="sm:col-span-2">
            <dt className="text-xs text-[#4b5563]">Related reference</dt>
            <dd className="break-all text-sm font-medium text-miu-black">
              {ticket.referenceId}
            </dd>
          </div>
        ) : null}
      </dl>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-miu-black">Description</h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#4b5563]">
          {description || "No description provided."}
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-miu-black">Requester</h3>
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
          Evidence attachments
        </h3>
        {evidence.length > 0 ? (
          <EvidenceAttachmentPreview files={evidence} />
        ) : (
          <p className="text-sm text-[#4b5563]">No evidence attached.</p>
        )}
      </section>

      {ticket.simulated ? (
        <p className="rounded-lg bg-[#f8f8f9] px-3 py-2 text-xs text-[#4b5563]">
          Phase 1 simulation — ticket assignment and dispute decisions are owned
          by Member 3 and are not available here.
        </p>
      ) : null}
    </article>
  );
}
