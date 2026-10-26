import { useLanguage } from "../../../i18n/LanguageContext.js";
import { useState } from "react";
import FileUploadField from "../../profiles/components/FileUploadField.jsx";
import { validateSupportForm } from "../utils/validateSupport.js";
import { saveSupportSubmission } from "../utils/supportStorage.js";
import { formatSupportTopicLabel } from "../utils/ticketLabels.js";
import TicketDetails from "./TicketDetails.jsx";

const TOPICS = [
  { value: "account", label: "Account & access" },
  { value: "payments", label: "Payments & escrow (demo)" },
  { value: "orders", label: "Orders & deliverables" },
  { value: "safety", label: "Safety & misconduct" },
  { value: "other", label: "Other" },
];

/** Contact support form with simulated submission. */
export default function SupportRequestForm({ onSuccess, onCancel }) {
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [submittedTicket, setSubmittedTicket] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateSupportForm({
      name,
      email,
      topic,
      subject,
      message,
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const attachments = files.map((file) => ({
        id: file.id,
        name: file.name,
        sizeLabel: file.sizeLabel || "",
      }));

      const ticket = saveSupportSubmission({
        id: `support_sim_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        topic,
        categoryLabel: formatSupportTopicLabel(topic),
        subject: subject.trim(),
        message: message.trim(),
        description: message.trim(),
        referenceId: referenceId.trim() || null,
        status: "submitted",
        attachmentNames: attachments.map((f) => f.name),
        attachments,
        evidence: attachments,
        requester: {
          displayName: name.trim(),
          headline: email.trim(),
          roleLabel: "Support requester",
        },
        createdAt: new Date().toISOString(),
        simulated: true,
        note: "Committee assignment is owned by Member 3 and is not implemented here.",
      });
      setSubmittedTicket(ticket);
      setStatus("success");
      onSuccess?.(ticket);
    } catch {
      setErrors({
        form: "Could not save this simulated request. Browser storage may be full or unavailable. Your inputs are still here; retry when storage is available.",
      });
      setStatus("error");
    }
  }

  if (status === "success" && submittedTicket) {
    return (
      <div className="space-y-4" role="status">
        <div className="rounded-panel border border-success/30 bg-[var(--theme-surface,#fff)] p-4 text-center sm:p-5">
          <h2 className="text-lg font-semibold text-miu-black sm:text-xl">
            {t("Support request received")}
          </h2>
          <p className="mt-2 text-sm text-ink-secondary">
            {t(
              "Your request was saved in this browser session only. No email or committee workflow was triggered.",
            )}
          </p>
        </div>
        <TicketDetails ticket={submittedTicket} />
        {onCancel ? (
          <button
            type="button"
            className="h-11 rounded-full border border-border-soft px-5 text-sm font-semibold text-miu-black"
            onClick={onCancel}
          >
            {t("Close")}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <form
      className="space-y-5 rounded-panel border border-border-soft bg-[var(--theme-surface,#fff)] p-5 shadow-[var(--shadow-panel)] sm:p-6"
      onSubmit={handleSubmit}
      noValidate
    >
      <p className="text-sm">
        {t(
          "Use fictional information and sample files only. Image previews stay in memory; saved tickets contain attachment names, not file contents.",
        )}
      </p>
      {errors.form && (
        <p
          role="alert"
          className="text-sm text-[var(--theme-danger-text,var(--color-danger))]"
        >
          {errors.form}
        </p>
      )}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-accent,var(--color-miu-red))]">
          {t("Simulated Phase 1 workflow")}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-miu-black">
          {t("Contact support")}
        </h2>
        <p className="mt-1 text-sm text-ink-secondary">
          {t(
            "Member 5 owns the request form and ticket presentation only. Ticket assignment and dispute decisions belong to other modules.",
          )}
        </p>
      </div>

      <Field
        label={t("Full name")}
        id="support-name"
        value={name}
        error={t(errors.name)}
        onChange={setName}
      />
      <Field
        label={t("Email")}
        id="support-email"
        type="email"
        value={email}
        error={t(errors.email)}
        onChange={setEmail}
      />

      <div className="space-y-2">
        <label
          htmlFor="support-topic"
          className="text-sm font-semibold text-miu-black"
        >
          {t("Topic")}
        </label>
        <select
          id="support-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="h-11 w-full rounded-lg border border-border-soft px-3 text-sm"
        >
          <option value="">{t("Select a topic")}</option>
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {errors.topic ? (
          <p
            className="text-sm text-[var(--theme-danger-text,var(--color-danger))]"
            role="alert"
          >
            {errors.topic}
          </p>
        ) : null}
      </div>

      <Field
        label={t("Subject")}
        id="support-subject"
        value={subject}
        error={t(errors.subject)}
        onChange={setSubject}
      />
      <Field
        label={t("Related order / project ID (optional)")}
        id="support-ref"
        value={referenceId}
        onChange={setReferenceId}
      />

      <div className="space-y-2">
        <label
          htmlFor="support-message"
          className="text-sm font-semibold text-miu-black"
        >
          {t("Message")}
        </label>
        <textarea
          id="support-message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm"
        />
        {errors.message ? (
          <p
            className="text-sm text-[var(--theme-danger-text,var(--color-danger))]"
            role="alert"
          >
            {errors.message}
          </p>
        ) : null}
      </div>

      <FileUploadField
        label={t("Evidence attachments (optional)")}
        hint="Images or PDF · max 3 files · 3 MB each · simulated only"
        accept="image/*,application/pdf"
        multiple
        maxFiles={3}
        maxBytes={3_000_000}
        imagesOnly={false}
        value={files}
        error={t(errors.files)}
        onChange={(next) => {
          setFiles(next);
          setErrors((prev) => {
            const copy = { ...prev };
            delete copy.files;
            return copy;
          });
        }}
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-full border border-border-soft px-5 text-sm font-semibold"
            disabled={status === "submitting"}
          >
            {t("Cancel")}
          </button>
        ) : null}
        <button
          type="submit"
          className="h-11 rounded-full bg-miu-red px-5 text-sm font-semibold text-white hover:bg-miu-red-dark disabled:opacity-60"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? t("Sending…") : t("Submit request")}
        </button>
      </div>
    </form>
  );
}

function Field({ id, label, value, onChange, error, type = "text" }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-miu-black">
        {t(label)}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-border-soft px-3 text-sm"
      />
      {error ? (
        <p
          className="text-sm text-[var(--theme-danger-text,var(--color-danger))]"
          role="alert"
        >
          {t(error)}
        </p>
      ) : null}
    </div>
  );
}
