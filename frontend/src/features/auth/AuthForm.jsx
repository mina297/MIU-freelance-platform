import { useLanguage } from "../../i18n/LanguageContext.js";
import { useId, useRef, useState } from "react";
import "./authForm.css";

/** Feature-local form presentation; validation and account logic live in mockAuth. */
export default function AuthForm({
  title,
  fields,
  initialValues = {},
  submitLabel,
  onSubmit,
  afterSubmit,
  children,
}) {
  const { t } = useLanguage();

  const id = useId();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const busy = useRef(false);
  async function submit(event) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setSubmitting(true);
    setMessage("");
    try {
      const result = await onSubmit(values);
      setErrors(result.errors || {});
      setMessage(result.message || "");
      setValues((current) => ({
        ...current,
        password: "",
        confirmPassword: "",
      }));
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
      setValues((current) => ({
        ...current,
        password: "",
        confirmPassword: "",
      }));
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  }
  return (
    <div className="auth-page">
      <section className="auth-card" aria-labelledby={`${id}-title`}>
        <p className="auth-eyebrow">{t("MIU Freelance")}</p>
        <h1 id={`${id}-title`}>{title}</h1>
        <form
          noValidate
          onSubmit={submit}
          className="auth-fields"
          aria-busy={submitting}
        >
          <p className="sr-only">{t("All fields are required.")}</p>
          {fields.map(
            ({ name, label, type = "text", autoComplete, hint, options }) => (
              <div key={name} className="auth-field">
                <label htmlFor={`${id}-${name}`}>{t(label)}</label>
                {options ? (
                  <select
                    id={`${id}-${name}`}
                    name={name}
                    value={values[name] || ""}
                    required
                    disabled={submitting}
                    aria-invalid={Boolean(errors[name])}
                    aria-describedby={
                      errors[name] ? `${id}-${name}-error` : undefined
                    }
                    className="auth-input"
                    onChange={(event) =>
                      setValues({ ...values, [name]: event.target.value })
                    }
                  >
                    <option value="">{t("Choose a role")}</option>
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(option.label)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`${id}-${name}`}
                    name={name}
                    type={type}
                    autoComplete={autoComplete}
                    value={values[name] || ""}
                    required
                    disabled={submitting}
                    aria-invalid={Boolean(errors[name])}
                    aria-describedby={
                      [
                        hint && `${id}-${name}-hint`,
                        errors[name] && `${id}-${name}-error`,
                      ]
                        .filter(Boolean)
                        .join(" ") || undefined
                    }
                    className="auth-input"
                    onChange={(event) =>
                      setValues({ ...values, [name]: event.target.value })
                    }
                  />
                )}
                {hint && (
                  <p id={`${id}-${name}-hint`} className="auth-hint">
                    {t(hint)}
                  </p>
                )}
                {errors[name] && (
                  <p
                    id={`${id}-${name}-error`}
                    className="auth-error"
                    role="alert"
                  >
                    {t(errors[name])}
                  </p>
                )}
              </div>
            ),
          )}
          {errors.form && (
            <p role="alert" className="auth-feedback auth-error">
              {t(errors.form)}
            </p>
          )}
          {message && (
            <p role="status" className="auth-feedback">
              {t(message)}
            </p>
          )}
          <button type="submit" disabled={submitting} className="auth-submit">
            {submitting ? t("Please wait…") : t(submitLabel)}
          </button>
          {afterSubmit}
        </form>
        <div className="auth-links">{children}</div>
        <p className="auth-prototype-note">
          {t("Prototype · Resets on refresh. Use test details only.")}
        </p>
      </section>
    </div>
  );
}
