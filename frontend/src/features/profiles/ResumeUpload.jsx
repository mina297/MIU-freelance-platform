import { useRef } from "react";
import { Upload } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.js";
import { selectResume } from "./resumeSelection.js";

export default function ResumeUpload({
  value,
  onChange,
  error = "",
  onError,
  compact = false,
  source = "resume",
}) {
  const { t } = useLanguage();
  const input = useRef(null);
  const linkedIn = source === "linkedin";
  const title = linkedIn ? "Upload LinkedIn profile" : "Upload resume";

  function choose(files) {
    if (!files.length) return;
    const result = selectResume(Array.from(files), { pdfOnly: linkedIn });
    onError(result.error ?? "");
    onChange(result.file ?? null);
  }

  const limits = (
    <div id="resume-limits" className="profile-resume__limits">
      <p>{t("Max file size: 5MB")}</p>
      <p>
        {t(
          linkedIn
            ? "Supported file type: PDF"
            : "Supported file types: PDF, DOC, DOCX",
        )}
      </p>
    </div>
  );

  return (
    <section
      className={`profile-resume${compact ? " profile-resume--sheet" : ""}`}
      aria-labelledby={compact ? undefined : "resume-heading"}
    >
      {!compact && <h3 id="resume-heading">{t(title)}</h3>}
      {linkedIn && (
        <p
          className="profile-resume__instructions"
          id="linkedin-file-instructions"
        >
          {t("Save your LinkedIn profile as a PDF, then add the file here.")}
        </p>
      )}
      {compact && limits}
      <label
        className={
          compact ? "profile-resume__choose-file" : "profile-resume__dropzone"
        }
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          choose(event.dataTransfer.files);
        }}
      >
        <input
          ref={input}
          type="file"
          accept={
            linkedIn
              ? ".pdf,application/pdf"
              : ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          }
          aria-label={t(compact ? "Choose a file" : title)}
          aria-describedby={`resume-limits${linkedIn ? " linkedin-file-instructions" : ""}${compact ? "" : " resume-preview-note"}${error ? " resume-error" : ""}`}
          aria-invalid={Boolean(error)}
          onChange={(event) => {
            choose(event.target.files);
            event.target.value = "";
          }}
        />
        {compact ? (
          <span>{t("Choose a file")}</span>
        ) : (
          <>
            <Upload size={34} strokeWidth={1.5} aria-hidden="true" />
            <span>
              {t("Drag or")}{" "}
              <span className="profile-resume__upload-word">{t("upload")}</span>{" "}
              {t(linkedIn ? "your LinkedIn profile" : "your resume")}
            </span>
          </>
        )}
      </label>
      {!compact && limits}
      {error && (
        <p id="resume-error" className="profile-resume__error" role="alert">
          {t(error)}
        </p>
      )}
      <div role="status" className="profile-resume__selection">
        {value && (
          <>
            <span>
              {t("Selected file:")} <bdi>{value.name}</bdi>
            </span>
            <button
              type="button"
              onClick={() => {
                onChange(null);
                onError("");
                input.current?.focus();
              }}
            >
              {t("Remove file")}
            </button>
          </>
        )}
      </div>
      {!compact && (
        <p id="resume-preview-note" className="profile-resume__preview-note">
          {t(
            "Preview only. Use a fictional resume. Nothing is uploaded or read. Add your profile details manually on the next page.",
          )}
        </p>
      )}
    </section>
  );
}
