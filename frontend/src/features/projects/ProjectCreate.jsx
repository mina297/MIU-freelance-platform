import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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
  EMPTY_PROJECT,
  clientEligibility,
  localDate,
  normalizeProject,
  validateProject,
} from "./projectCreation.js";
import { projectStore } from "./projectStore.js";
import miuLogo from "../../assets/figma/miu-anniversary-logo.png";
import "./project-create.css";

function ProjectBrief({ values }) {
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
          <span>PROJECT BUDGET</span>
          <strong>{formatEGP(brief.budgetEGP)}</strong>
        </div>
        <div>
          <span>DEADLINE</span>
          <strong>{formatDate(brief.deadline)}</strong>
        </div>
      </div>
      <h3>Scope of work</h3>
      <p className="project-create__prose">{brief.scope}</p>
      <h3>Expected deliverables</h3>
      <ul>
        {brief.deliverables.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <h3>Required skills</h3>
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

function ProjectCreateForm() {
  const { session } = useAuth();
  const [values, setValues] = useState(() => ({
    ...EMPTY_PROJECT,
    requiredSkillIds: [],
  }));
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
  const setField = (name, value) =>
    setValues((current) => ({ ...current, [name]: value }));
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
    const result = projectStore.publish(values, session, submissionId);
    if (result.ok) {
      setPublished(result.project);
      setStep("success");
    } else {
      setStep("edit");
      report(result.errors);
    }
  }
  const verificationIssue = clientEligibility(session, true);
  return (
    <div className="project-create">
      <header className="project-create__header">
        <Link to="/projects" aria-label="MIU Freelance projects">
          <img src={miuLogo} alt="Misr International University" />
        </Link>
        <Link to="/projects">
          <ArrowLeft size={16} aria-hidden="true" /> Back to marketplace
        </Link>
        <span>Phase 1 preview</span>
      </header>
      <main>
        <section className="project-create__hero">
          <div className="project-create__container">
            <p className="project-create__eyebrow">THE CLIENT WORKSPACE</p>
            <h1 ref={heading} tabIndex={-1}>
              {step === "success" ? (
                <>
                  Your next idea.
                  <br />
                  <em>Ready to discover.</em>
                </>
              ) : (
                <>
                  A great project starts
                  <br />
                  <em>with a clear brief.</em>
                </>
              )}
            </h1>
            <p>
              Turn your idea into an opportunity for student talent. Define the
              work, set your budget, and make the next move.
            </p>
          </div>
        </section>
        <div className="project-create__container project-create__workspace">
          <ol
            className="project-create__steps"
            aria-label="Project creation progress"
          >
            {[
              ["edit", "Write your brief"],
              ["preview", "Review the details"],
              ["success", "Publish demo"],
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
              aria-label="Project creation"
            >
              <div className="project-create__panel-title">
                <ClipboardList aria-hidden="true" />
                <div>
                  <p className="project-create__eyebrow">
                    {step === "edit"
                      ? "MAKE IT SPECIFIC"
                      : "YOUR PROJECT BRIEF"}
                  </p>
                  <h2>
                    {step === "edit"
                      ? "Tell us what you’re building"
                      : step === "preview"
                        ? "One last look before publishing"
                        : "Published — simulation"}
                  </h2>
                </div>
              </div>
              {step === "edit" ? (
                <form ref={form} noValidate onSubmit={preview}>
                  <div className="project-create__fields">
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
                      <option value="">Choose a category</option>
                      {marketplaceCategories.map(({ id, label }) => (
                        <option key={id} value={id}>
                          {label}
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
                      <legend>Required skills *</legend>
                      <p id="project-skills-help">
                        Select the skills your project needs.
                      </p>
                      <div>
                        {marketplaceSkills.map(({ id, label }) => (
                          <Checkbox
                            key={id}
                            name="requiredSkillIds"
                            label={label}
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
                    <span>Review everything before you publish.</span>
                    <Button type="submit">
                      Preview project{" "}
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
                      Edit brief
                    </Button>
                    <Button
                      onClick={publish}
                      disabled={Boolean(verificationIssue)}
                    >
                      Publish demo project{" "}
                      <ArrowRight size={17} aria-hidden="true" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="project-create__brief">
                  <p role="status">
                    Your fictional project is now in this browser’s demo
                    catalogue. No students were contacted. Refreshing clears the
                    record.
                  </p>
                  <h3>{published.title}</h3>
                  <div className="project-create__success-links">
                    <Link to={`/projects/${published.id}`}>
                      View your project{" "}
                      <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                    <Link to="/projects">Browse projects</Link>
                  </div>
                </div>
              )}
            </section>
            <aside className="project-create__aside">
              <div className="project-create__tip">
                <Sparkles aria-hidden="true" />
                <p className="project-create__eyebrow">
                  A BETTER BRIEF. A BETTER FIT.
                </p>
                <h2>
                  Make room for
                  <br />
                  <em>great work.</em>
                </h2>
                <p>
                  Be clear about the outcome. Give students enough context to
                  propose a thoughtful approach.
                </p>
                <ul>
                  <li>Describe success, not just tasks.</li>
                  <li>Keep the scope achievable.</li>
                  <li>Allow time for feedback.</li>
                </ul>
              </div>
              <div className="project-create__disclosure">
                <strong>A safe space to try it</strong>
                <p>
                  This is a simulated frontend workflow. Use fictional
                  information. Form inputs clear when you leave; published demo
                  projects remain until refresh.
                </p>
                {verificationIssue && (
                  <p>
                    {verificationIssue} You can still write and preview your
                    brief.
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
  const { session } = useAuth();
  return <ProjectCreateForm key={session.user?.id ?? "anonymous"} />;
}
