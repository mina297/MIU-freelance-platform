import { useLanguage } from "../../i18n/LanguageContext.js";
import { formatEGP } from "../../utils/formatEGP.js";
import { formatDate } from "../../utils/formatDate.js";
import { useState, useSyncExternalStore } from "react";
import { proposalLabel } from "./clientProposalModel.js";
import { Link } from "react-router-dom";
import { orderStore } from "../orders/orderStore.js";
import { useAuth } from "../../hooks/useAuth.js";
import { proposalStore } from "./proposalStore.js";
import ProposalAttachments from "./ProposalAttachments.jsx";
import { MOCK_PROPOSAL_ATTACHMENTS } from "./mockAttachments.js";

const inputClass =
  "mt-2 w-full rounded-xl border border-[color:var(--theme-border,#ab95a1)] bg-[color:var(--theme-accent-surface,#faf7f9)] px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red";

export default function ProposalForm({ project }) {
  const { t, locale } = useLanguage();

  const { session } = useAuth();
  const [errors, setErrors] = useState({});
  const [attachmentIds, setAttachmentIds] = useState([]);
  useSyncExternalStore(
    proposalStore.subscribe,
    proposalStore.getSnapshot,
    proposalStore.getSnapshot,
  );
  const proposal = proposalStore.find(project.id, session.user?.id);
  const orders = useSyncExternalStore(
    orderStore.subscribe,
    orderStore.getSnapshot,
    orderStore.getSnapshot,
  );
  const order =
    proposal &&
    orders.find(
      (record) =>
        record.proposalId === proposal.id &&
        record.studentId === session.user?.id,
    );
  function submitProposal(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    values.attachmentIds = attachmentIds;
    const result = proposalStore.submit(values, project.id, session);
    const nextErrors = result.errors ?? {};
    setErrors(nextErrors);
    const field = ["priceEGP", "deliveryDays", "coverMessage"].find(
      (name) => nextErrors[name],
    );
    if (field) event.currentTarget.elements.namedItem(field)?.focus();
    else if (nextErrors.attachmentIds)
      event.currentTarget.querySelector('input[name="attachmentIds"]')?.focus();
  }
  if (proposal)
    return (
      <section
        role="status"
        className="mt-8 rounded-2xl border-2 border-[color:var(--theme-border,#b5869a)] bg-[color:var(--theme-accent-surface,#f8e7ed)] p-7"
      >
        <h2 className="text-2xl font-bold">
          {t("Proposal submitted — simulation")}
        </h2>
        <p className="mt-3 font-semibold">
          {t("Current demo status:")} {proposalLabel(proposal.status)}
        </p>
        <p className="mt-3">
          {t(
            "Your demo proposal is recorded. No client was contacted. This record resets on refresh.",
          )}
        </p>
        <dl className="mt-5 space-y-3">
          {order && (
            <div>
              <dt className="font-bold">{t("Project order")}</dt>
              <dd>
                <Link
                  className="inline-flex min-h-11 items-center text-[var(--theme-accent,var(--color-miu-red))] underline"
                  to={`/orders/${order.id}`}
                >
                  {t("View demo order")}
                </Link>
              </dd>
            </div>
          )}
          <div>
            <dt className="font-bold">{t("Your price")}</dt>
            <dd>{formatEGP(proposal.priceEGP, locale)}</dd>
          </div>
          <div>
            <dt className="font-bold">{t("Delivery time")}</dt>
            <dd>
              {proposal.deliveryDays} {t("days")}
            </dd>
          </div>
          <div>
            <dt className="font-bold">{t("Cover message")}</dt>
            <dd className="whitespace-pre-wrap break-words">
              {proposal.coverMessage}
            </dd>
          </div>
          <div>
            <dt className="font-bold">{t("Sample attachments")}</dt>
            <dd>
              {proposal.attachmentIds.length ? (
                <ul className="mt-2 list-inside list-disc break-words">
                  {proposal.attachmentIds.map((id) => (
                    <li key={id}>
                      {
                        MOCK_PROPOSAL_ATTACHMENTS.find(
                          (sample) => sample.id === id,
                        )?.name
                      }
                    </li>
                  ))}
                </ul>
              ) : (
                t("No sample attachments selected")
              )}
              <p className="mt-2 text-sm">
                {t("Fictional metadata only; no files were uploaded.")}
              </p>
            </dd>
          </div>
        </dl>
      </section>
    );
  return (
    <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <form
        onSubmit={submitProposal}
        noValidate
        onChange={() => {
          setErrors({});
        }}
        aria-label={t("Proposal draft")}
        className="overflow-hidden rounded-2xl border-2 border-[color:var(--theme-border,#c9bac1)] bg-[var(--theme-surface,#fff)]"
      >
        <div className="border-b border-[color:var(--theme-border,#d8b3bf)] bg-[color:var(--theme-accent-surface,#f8e7ed)] px-5 py-5 sm:px-7">
          <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--theme-accent,#9b2035)]">
            {t("Your approach. Your offer.")}
          </p>
          <h2 className="mt-2 text-xl font-bold">
            {t("Make a thoughtful first impression")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--theme-muted-text,#694c5b)]">
            {t(
              "Explain how you will help, what you will deliver, and how long it will take.",
            )}
          </p>
        </div>
        <div className="space-y-7 p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="proposal-price" className="text-sm font-bold">
                {t("Your price (EGP)")}
              </label>
              <input
                id="proposal-price"
                name="priceEGP"
                type="number"
                inputMode="decimal"
                placeholder={t("e.g. 5500")}
                className={inputClass}
                aria-invalid={Boolean(errors.priceEGP)}
                aria-describedby="proposal-price-help proposal-feedback"
              />
              <p
                id="proposal-price-help"
                className="mt-2 text-xs leading-5 text-[color:var(--theme-muted-text,#71606a)]"
              >
                {t("Your total price for the proposed work.")}
              </p>
            </div>
            <div>
              <label htmlFor="proposal-days" className="text-sm font-bold">
                {t("Delivery time (days)")}
              </label>
              <input
                id="proposal-days"
                name="deliveryDays"
                type="number"
                inputMode="numeric"
                placeholder={t("e.g. 14")}
                className={inputClass}
                aria-invalid={Boolean(errors.deliveryDays)}
                aria-describedby="proposal-days-help proposal-feedback"
              />
              <p
                id="proposal-days-help"
                className="mt-2 text-xs leading-5 text-[color:var(--theme-muted-text,#71606a)]"
              >
                {t("Estimate the time you need to complete the work.")}
              </p>
            </div>
          </div>
          <div>
            <label htmlFor="proposal-cover" className="text-sm font-bold">
              {t("Cover message")}
            </label>
            <textarea
              id="proposal-cover"
              name="coverMessage"
              rows={8}
              placeholder={t(
                "Introduce yourself, describe your approach, and explain what you will deliver…",
              )}
              className={`${inputClass} min-h-48 resize-y`}
              aria-invalid={Boolean(errors.coverMessage)}
              aria-describedby="proposal-cover-help proposal-feedback"
            />
            <p
              id="proposal-cover-help"
              className="mt-2 text-xs leading-5 text-[color:var(--theme-muted-text,#71606a)]"
            >
              {t(
                "Connect your experience to this brief. Keep your offer clear and specific.",
              )}
            </p>
          </div>
        </div>
        <div className="px-5 pb-7 sm:px-7">
          <ProposalAttachments
            selectedIds={attachmentIds}
            onChange={setAttachmentIds}
            error={t(errors.attachmentIds)}
          />
        </div>
        <div className="border-t border-[color:var(--theme-border,#c9bac1)] bg-[color:var(--theme-accent-surface,#faf7f9)] p-5 sm:p-7">
          <p
            id="proposal-preview-note"
            className="text-sm leading-6 text-[color:var(--theme-muted-text,#694c5b)]"
          >
            {t(
              "Simulated submission only. Submitted proposals stay in memory until refresh. Leaving before submitting clears your draft, including sample attachment selections.",
            )}
          </p>
          <div
            id="proposal-feedback"
            role="status"
            className="mt-4 text-sm leading-6 text-[color:var(--theme-accent,#9b2035)]"
          >
            {Object.entries(errors).map(([key, message]) => (
              <p key={key}>{message}</p>
            ))}
          </div>
          <button
            type="submit"
            aria-describedby="proposal-preview-note"
            className="mt-4 min-h-12 w-full rounded-xl bg-miu-red px-5 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red sm:w-auto"
          >
            {t("Submit demo proposal")}
          </button>
        </div>
      </form>
      <aside
        aria-label={t("Project brief summary")}
        className="overflow-hidden rounded-2xl border-2 border-[color:var(--theme-border,#b5869a)] bg-[color:var(--theme-accent-surface,#f5edf1)]"
      >
        <div className="bg-[#351923] p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-[#ffd7de]">
            {t("The opportunity")}
          </p>
          <h2 className="mt-3 text-lg font-bold leading-7">{project.title}</h2>
        </div>
        <dl className="space-y-5 p-6">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-[color:var(--theme-muted-text,#71606a)]">
              {t("Project budget")}
            </dt>
            <dd className="mt-1 text-2xl font-bold">
              {formatEGP(project.budgetEGP, locale)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-[color:var(--theme-muted-text,#71606a)]">
              {t("Project deadline")}
            </dt>
            <dd className="mt-1 font-semibold">
              {formatDate(project.deadline, locale)}
            </dd>
          </div>
        </dl>
        <p className="mx-6 mb-6 border-t border-[color:var(--theme-border,#c9bac1)] pt-5 text-sm leading-6 text-[color:var(--theme-muted-text,#694c5b)]">
          {t(
            "Make sure your price and timeline reflect everything in the project brief.",
          )}
        </p>
      </aside>
    </div>
  );
}
