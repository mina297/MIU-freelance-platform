import { useLanguage } from "../../i18n/LanguageContext.js";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import Input from "../../components/ui/Input.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import Select from "../../components/ui/Select.jsx";
import Checkbox from "../../components/ui/Checkbox.jsx";
import Button from "../../components/ui/Button.jsx";
import {
  marketplaceCategories,
  marketplaceSkills,
} from "../../data/fixtures/marketplace.js";
import { formatEGP } from "../../utils/formatEGP.js";
import { formatDate } from "../../utils/formatDate.js";
import {
  projectFormValues,
  clientEligibility,
  localDate,
  normalizeProject,
  validateProject,
} from "./projectCreation.js";
import { projectStore } from "./projectStore.js";
import miuLogo from "../../assets/figma/miu-anniversary-logo.png";
import "./project-create.css";

function ProjectBrief({ values }) {
  const { t, locale } = useLanguage();

  const brief = normalizeProject(values);
  return (
    <div className="project-create__brief">
      <span className="project-create__eyebrow">
        {marketplaceCategories.find(({ id }) => id === brief.categoryId)?.label}
      </span>
      <h2>{brief.title}</h2>
      <p className="project-create__prose">{brief.description}</p>
      <div className="project-create__facts">
        <div>
          <span>{t("PROJECT BUDGET")}</span>
          <strong>{formatEGP(brief.budgetEGP, locale)}</strong>
        </div>
        <div>
          <span>{t("DEADLINE")}</span>
          <strong>{formatDate(brief.deadline, locale)}</strong>
        </div>
      </div>
      <h3>{t("Scope of work")}</h3>
      <p className="project-create__prose">{brief.scope}</p>
      <h3>{t("Expected deliverables")}</h3>
      <ul>
        {brief.deliverables.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <h3>{t("Required skills")}</h3>
      <div className="project-create__skills">
        {brief.requiredSkillIds.map((id) => (
          <span key={id}>
            {marketplaceSkills.find((skill) => skill.id === id)?.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectCreateForm({ record }) {
  const { t } = useLanguage();

  const { session } = useAuth();
  const [values, setValues] = useState(() => projectFormValues(record));
  const [isPublished] = useState(record?.status === "open");
  const [savedId, setSavedId] = useState(
    record?.status === "draft" ? record.id : null,
  );
  const [notice, setNotice] = useState("");
  const [step, setStep] = useState("edit");
  const [errors, setErrors] = useState({});
  const [published, setPublished] = useState(null);
  const [submissionId] = useState(() => crypto.randomUUID());
  const [minimumDeadline] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return localDate(tomorrow);
  });
  const heading = useRef(null);
  const form = useRef(null);
  useEffect(() => {
    heading.current?.focus();
  }, [step]);
  useEffect(() => {
    if (step !== "edit") return;
    const first = Object.keys(errors).find((name) => name !== "session");
    if (first === "requiredSkillIds")
      form.current?.querySelector('input[name="requiredSkillIds"]')?.focus();
    else if (first) form.current?.elements.namedItem(first)?.focus();
  }, [step, errors]);
  const setField = (name, value) => {
    setNotice("");
    setValues((current) => ({ ...current, [name]: value }));
  };
  const fields = (name, label, extra = {}) => ({
    id: `project-${name}`,
    name,
    label,
    required: true,
    value: values[name],
    error: errors[name],
    onChange: (event) => setField(name, event.target.value),
    ...extra,
  });

  function report(nextErrors) {
    setErrors(nextErrors);
  }
  function preview(event) {
    event.preventDefault();
    const access = clientEligibility(session);
    const nextErrors = {
      ...validateProject(values),
      ...(access ? { session: access } : {}),
    };
    report(nextErrors);
    if (!Object.keys(nextErrors).length) setStep("preview");
  }
  function publish() {
    const result =
      record || savedId
        ? projectStore.update(values, session, record?.id ?? savedId)
        : projectStore.publish(values, session, submissionId);
    if (result.ok) {
      setPublished(result.project);
      setStep("success");
    } else {
      setStep("edit");
      report(result.errors);
    }
  }
  function saveDraft() {
    const result = projectStore.saveDraft(
      values,
      session,
      submissionId,
      savedId,
    );
    if (result.ok) {
      setSavedId(result.project.id);
      setErrors({});
      setNotice(
        "Draft saved for this demo session. You can reopen it from My projects. Refreshing clears it.",
      );
    } else report(result.errors);
  }
  const verificationIssue = clientEligibility(session, true);
  return (
    <div className="project-create">
      <header className="project-create__header">
        <Link to="/projects" aria-label={t("MIU Freelance projects")}>
          <img src={miuLogo} alt={t("Misr International University")} />
        </Link>
        <Link to="/projects">
          <ArrowLeft size={16} aria-hidden="true" /> {t("Back to marketplace")}
        </Link>
        <Link to="/client/projects">{t("My projects")}</Link>
        <span>{t("Phase 1 preview")}</span>
      </header>
      <main>
        <section className="project-create__hero">
          <div className="project-create__container">
            <p className="project-create__eyebrow">
              {t("THE CLIENT WORKSPACE")}
            </p>
            <h1 ref={heading} tabIndex={-1}>
              {step === "success" ? (
                <>
                  {t("Your next idea.")}
                  <br />
                  <em>{t("Ready to discover.")}</em>
                </>
              ) : isPublished ? (
                <>
                  {t("Refine your project.")}
                  <br />
                  <em>{t("Keep the vision clear.")}</em>
                </>
              ) : (
                <>
                  {t("A great project starts")}
                  <br />
                  <em>{t("with a clear brief.")}</em>
                </>
              )}
            </h1>
            <p>
              {t(
                "Turn your idea into an opportunity for student talent. Define the work, set your budget, and make the next move.",
              )}
            </p>
          </div>
        </section>
        <div className="project-create__container project-create__workspace">
          <ol
            className="project-create__steps"
            aria-label={t("Project creation progress")}
          >
            {[
              ["edit", "Write your brief"],
              ["preview", "Review the details"],
              ["success", isPublished ? "Save changes" : "Publish demo"],
            ].map(([id, title], index) => (
              <li key={id} aria-current={step === id ? "step" : undefined}>
                <span>
                  {step === "success" ? (
                    <Check size={16} aria-hidden="true" />
                  ) : (
                    `0${index + 1}`
                  )}
                </span>
                {title}
              </li>
            ))}
          </ol>
          <div className="project-create__columns">
            <section
              className="project-create__panel"
              aria-label={t("Project creation")}
            >
              <div className="project-create__panel-title">
                <ClipboardList aria-hidden="true" />
                <div>
                  <p className="project-create__eyebrow">
                    {step === "edit"
                      ? t("MAKE IT SPECIFIC")
                      : t("YOUR PROJECT BRIEF")}
                  </p>
                  <h2>
                    {step === "edit"
                      ? isPublished
                        ? t("Update your project brief")
                        : t("Tell us what you’re building")
                      : step === "preview"
                        ? t("One last look before publishing")
                        : isPublished
                          ? t("Changes saved — simulation")
                          : t("Published — simulation")}
                  </h2>
                </div>
              </div>
              {step === "edit" ? (
                <form ref={form} noValidate onSubmit={preview}>
                  <div className="project-create__fields">
                    <p role="status">{t(notice)}</p>
                    {Object.keys(errors).length > 0 && (
                      <p role="alert" className="project-create__alert">
                        {errors.session ??
                          "Check the highlighted fields before continuing."}
                      </p>
                    )}
                    <Input
                      {...fields("title", "Project title", {
                        maxLength: 120,
                        placeholder:
                          "e.g. Build a website for our next campus event",
                      })}
                    />
                    <Textarea
                      {...fields("description", "Project description", {
                        maxLength: 2000,
                        rows: 4,
                        helperText:
                          "Give students a clear overview of the problem and your goal.",
                      })}
                    />
                    <Select {...fields("categoryId", "Project category")}>
                      <option value="">{t("Choose a category")}</option>
                      {marketplaceCategories.map(({ id, label }) => (
                        <option key={id} value={id}>
                          {t(label)}
                        </option>
                      ))}
                    </Select>
                    <fieldset
                      className="project-create__skill-picker"
                      aria-describedby={
                        errors.requiredSkillIds
                          ? "project-skills-error"
                          : "project-skills-help"
                      }
                    >
                      <legend>{t("Required skills *")}</legend>
                      <p id="project-skills-help">
                        {t("Select the skills your project needs.")}
                      </p>
                      <div>
                        {marketplaceSkills.map(({ id, label }) => (
                          <Checkbox
                            key={id}
                            name="requiredSkillIds"
                            label={t(label)}
                            checked={values.requiredSkillIds.includes(id)}
                            onChange={(event) =>
                              setField(
                                "requiredSkillIds",
                                event.target.checked
                                  ? [...values.requiredSkillIds, id]
                                  : values.requiredSkillIds.filter(
                                      (skill) => skill !== id,
                                    ),
                              )
                            }
                          />
                        ))}
                      </div>
                      {errors.requiredSkillIds && (
                        <p
                          id="project-skills-error"
                          className="project-create__error"
                        >
                          {errors.requiredSkillIds}
                        </p>
                      )}
                    </fieldset>
                    <Textarea
                      {...fields("scope", "Scope of work", {
                        maxLength: 5000,
                        rows: 4,
                        helperText:
                          "Describe the tasks, boundaries, and anything already available.",
                      })}
                    />
                    <Textarea
                      {...fields("deliverables", "Expected deliverables", {
                        maxLength: 3000,
                        rows: 4,
                        helperText:
                          "One deliverable per line. What should you receive at the end?",
                      })}
                    />
                    <div className="project-create__field-row">
                      <Input
                        {...fields("budgetEGP", "Total budget (EGP)", {
                          inputMode: "decimal",
                          placeholder: "6000.00",
                        })}
                      />
                      <Input
                        {...fields("deadline", "Project deadline", {
                          type: "date",
                          min: minimumDeadline,
                        })}
                      />
                    </div>
                  </div>
                  <div className="project-create__actions">
                    {!isPublished && (
                      <Button variant="outline" onClick={saveDraft}>
                        {t("Save draft")}
                      </Button>
                    )}
                    <Button type="submit">
                      {t("Preview project")}{" "}
                      <ArrowRight size={17} aria-hidden="true" />
                    </Button>
                  </div>
                </form>
              ) : step === "preview" ? (
                <>
                  <ProjectBrief values={values} />
                  <div className="project-create__actions">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setErrors({});
                        setStep("edit");
                      }}
                    >
                      {t("Edit brief")}
                    </Button>
                    <Button
                      onClick={publish}
                      disabled={Boolean(verificationIssue)}
                    >
                      {isPublished
                        ? t("Save demo changes")
                        : t("Publish demo project")}{" "}
                      <ArrowRight size={17} aria-hidden="true" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="project-create__brief">
                  <p role="status">
                    {t(
                      "Your fictional project is now in this browser’s demo catalogue. No students were contacted. Refreshing clears the record.",
                    )}
                  </p>
                  <h3>{published.title}</h3>
                  <div className="project-create__success-links">
                    <Link to={`/projects/${published.id}`}>
                      {t("View your project")}{" "}
                      <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                    <Link to="/projects">{t("Browse projects")}</Link>
                    <Link to="/client/projects">{t("My projects")}</Link>
                  </div>
                </div>
              )}
            </section>
            <aside className="project-create__aside">
              <div className="project-create__tip">
                <Sparkles aria-hidden="true" />
                <p className="project-create__eyebrow">
                  {t("A BETTER BRIEF. A BETTER FIT.")}
                </p>
                <h2>
                  {t("Make room for")}
                  <br />
                  <em>{t("great work.")}</em>
                </h2>
                <p>
                  {t(
                    "Be clear about the outcome. Give students enough context to propose a thoughtful approach.",
                  )}
                </p>
                <ul>
                  <li>{t("Describe success, not just tasks.")}</li>
                  <li>{t("Keep the scope achievable.")}</li>
                  <li>{t("Allow time for feedback.")}</li>
                </ul>
              </div>
              <div className="project-create__disclosure">
                <strong>{t("A safe space to try it")}</strong>
                <p>
                  {t(
                    "This is a simulated frontend workflow. Use fictional information. Save a draft to reopen it later. Saved drafts and published changes remain in memory until refresh. Unsaved changes clear when you leave.",
                  )}
                </p>
                {verificationIssue && (
                  <p>
                    {verificationIssue}{" "}
                    {t("You can still write and preview your brief.")}
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProjectCreate() {
  const { t } = useLanguage();

  const { session } = useAuth();
  const { projectId } = useParams();
  useSyncExternalStore(
    projectStore.subscribe,
    projectStore.getWorkspaceSnapshot,
    projectStore.getWorkspaceSnapshot,
  );
  const record = projectId ? projectStore.findOwned(projectId, session) : null;
  if (projectId && (!record || !["draft", "open"].includes(record.status)))
    return (
      <main className="project-create">
        <div className="project-create__container project-create__brief">
          <h1 className="text-3xl font-bold">
            {t("Project unavailable for editing")}
          </h1>
          <p className="mt-4">
            {t(
              "You can edit only your own drafts and open projects. This project may be unavailable or no longer editable.",
            )}
          </p>
          <Link
            className="mt-6 inline-flex min-h-11 items-center text-[var(--theme-accent,var(--color-miu-red))] underline"
            to="/client/projects"
          >
            {t("Return to My projects")}
          </Link>
        </div>
      </main>
    );
  return (
    <ProjectCreateForm
      key={`${session.user?.id ?? "anonymous"}:${projectId ?? "new"}`}
      record={record}
    />
  );
}
