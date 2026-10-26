import { useLanguage } from "../../i18n/LanguageContext.js";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { proposalStore } from "./proposalStore.js";
import { projectStore } from "../projects/projectStore.js";
import { orderStore } from "../orders/orderStore.js";
import { getProjectById } from "../marketplace/selectors.js";
import Input from "../../components/ui/Input.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import Button from "../../components/ui/Button.jsx";
import ProposalAttachments from "./ProposalAttachments.jsx";
import { formatEGP } from "../../utils/formatEGP.js";
import "../projects/project-create.css";
import "./student-proposals.css";

function EditForm({ proposal }) {
  const { t, locale } = useLanguage();

  const { session } = useAuth();
  const project = getProjectById(proposal.projectId);
  const [values, setValues] = useState(() => ({
    priceEGP: String(proposal.priceEGP),
    deliveryDays: String(proposal.deliveryDays),
    coverMessage: proposal.coverMessage,
    attachmentIds: [...proposal.attachmentIds],
  }));
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const heading = useRef(null);
  const form = useRef(null);
  useEffect(() => {
    heading.current?.focus();
  }, [saved]);
  useEffect(() => {
    const name = [
      "priceEGP",
      "deliveryDays",
      "coverMessage",
      "attachmentIds",
    ].find((field) => errors[field]);
    if (name === "attachmentIds")
      form.current?.querySelector('input[name="attachmentIds"]')?.focus();
    else if (name) form.current?.elements.namedItem(name)?.focus();
  }, [errors]);
  function save(event) {
    event.preventDefault();
    const result = proposalStore.edit(proposal.id, values, session);
    setErrors(result.errors ?? {});
    if (result.ok) setSaved(true);
  }
  const field = (name, label, props = {}) => ({
    name,
    id: `edit-proposal-${name}`,
    label,
    required: true,
    value: values[name],
    error: errors[name],
    onChange: (event) =>
      setValues((current) => ({ ...current, [name]: event.target.value })),
    ...props,
  });
  return (
    <main className="project-create student-proposals">
      <header className="project-create__header">
        <Link to="/student/proposals">{t("My proposals")}</Link>
        <span>{t("Phase 1 preview")}</span>
      </header>
      <section className="project-create__hero">
        <div className="project-create__container">
          <p className="project-create__eyebrow">
            {t("MAKE YOUR APPROACH COUNT")}
          </p>
          <h1 ref={heading} tabIndex={-1}>
            {saved ? (
              <>
                {t("A stronger offer.")}
                <br />
                <em>{t("Ready for review.")}</em>
              </>
            ) : (
              <>
                {t("Refine your offer.")}
                <br />
                <em>{t("Keep the idea moving.")}</em>
              </>
            )}
          </h1>
          <p>{project.title}</p>
        </div>
      </section>
      <div className="project-create__container student-proposals__body">
        <section className="project-create__panel">
          {saved ? (
            <div className="project-create__brief">
              <h2 className="text-2xl font-bold">
                {t("Proposal updated — simulation")}
              </h2>
              <p className="mt-4" role="status">
                {t("Your offer is now")}{" "}
                {formatEGP(Number(values.priceEGP), locale)} {t("with a")}{" "}
                {values.deliveryDays}
                {t(
                  "-day delivery estimate. Its existing status is preserved. No notification sent.",
                )}
              </p>
              <div className="project-create__success-links">
                <Link to="/student/proposals">
                  {t("Return to My proposals")}
                </Link>
                <Button variant="outline" onClick={() => setSaved(false)}>
                  {t("Continue editing")}
                </Button>
              </div>
            </div>
          ) : (
            <form ref={form} noValidate onSubmit={save}>
              <div className="project-create__fields">
                <h2 className="text-2xl font-bold">
                  {t("Update your proposal")}
                </h2>
                <p className="student-proposals__disclosure">
                  {t(
                    "Update your price, delivery estimate and approach. Your offer keeps its current review status. Unsaved changes clear when you leave; saved demo changes reset on refresh.",
                  )}
                </p>
                {Object.keys(errors).length > 0 && (
                  <p role="alert" className="project-create__alert">
                    {errors.form ??
                      errors.eligibility ??
                      errors.project ??
                      "Check the highlighted fields."}
                  </p>
                )}
                <div className="project-create__field-row">
                  <Input
                    {...field("priceEGP", "Your price (EGP)", {
                      inputMode: "decimal",
                    })}
                  />
                  <Input
                    {...field("deliveryDays", "Delivery time (days)", {
                      inputMode: "numeric",
                    })}
                  />
                </div>
                <Textarea
                  {...field("coverMessage", "Cover message", { rows: 7 })}
                />
                <ProposalAttachments
                  selectedIds={values.attachmentIds}
                  onChange={(attachmentIds) =>
                    setValues((current) => ({ ...current, attachmentIds }))
                  }
                  error={t(errors.attachmentIds)}
                />
              </div>
              <div className="project-create__actions">
                <Link
                  to="/student/proposals"
                  className="text-[var(--theme-accent,var(--color-miu-red))] underline"
                >
                  {t("Discard unsaved changes")}
                </Link>
                <Button type="submit">{t("Save demo changes")}</Button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

export default function StudentProposalEdit() {
  const { t } = useLanguage();

  const { proposalId } = useParams();
  const { session } = useAuth();
  useSyncExternalStore(
    proposalStore.subscribe,
    proposalStore.getSnapshot,
    proposalStore.getSnapshot,
  );
  useSyncExternalStore(
    projectStore.subscribe,
    projectStore.getSnapshot,
    projectStore.getSnapshot,
  );
  useSyncExternalStore(
    orderStore.subscribe,
    orderStore.getSnapshot,
    orderStore.getSnapshot,
  );
  const proposal = proposalStore.findOwned(proposalId, session);
  const error = proposalStore.studentActionError(proposalId, session, "edit");
  if (error)
    return (
      <main className="project-create">
        <div className="project-create__container project-create__brief">
          <h1 className="text-3xl font-bold">
            {t("Proposal unavailable for editing")}
          </h1>
          <p className="mt-4">
            {proposal
              ? error
              : t(
                  "This proposal is unavailable or does not belong to your account.",
                )}
          </p>
          <Link
            className="mt-6 inline-flex min-h-11 items-center text-[var(--theme-accent,var(--color-miu-red))] underline"
            to="/student/proposals"
          >
            {t("Return to My proposals")}
          </Link>
        </div>
      </main>
    );
  return (
    <EditForm key={`${session.user.id}:${proposalId}`} proposal={proposal} />
  );
}
