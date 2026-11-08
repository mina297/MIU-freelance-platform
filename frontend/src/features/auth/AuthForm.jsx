import { useLanguage } from "../../i18n/LanguageContext.js";
import { useId, useRef, useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import CountryDropdown from "./CountryDropdown.jsx";
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
  wide = false,
  pillSubmit = false,
}) {
  const { t } = useLanguage();

  const id = useId();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const busy = useRef(false);
  async function submit(event) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setSubmitting(true);
    setMessage("");
    setVisiblePasswords({});
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
      <section
        className={wide ? "auth-card auth-card--wide" : "auth-card"}
        aria-labelledby={`${id}-title`}
      >
        <p className="auth-eyebrow">{t("MIU Freelance")}</p>
        <h1 id={`${id}-title`}>{title}</h1>
        <form
          noValidate
          onSubmit={submit}
          className="auth-fields"
          aria-busy={submitting}
        >
          {fields.map(
            ({
              name,
              label,
              type = "text",
              autoComplete,
              hint,
              options,
              required = true,
              revealPassword,
            }) => {
              const fieldId = `${id}-${name}`;
              const checkbox = type === "checkbox";
              const visible = Boolean(visiblePasswords[name]);
              const fieldProps = {
                id: fieldId,
                name,
                required,
                autoComplete,
                disabled: submitting,
                "aria-invalid": Boolean(errors[name]),
                "aria-describedby":
                  [
                    hint && `${fieldId}-hint`,
                    errors[name] && `${fieldId}-error`,
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined,
                onChange: (event) => {
                  const value = checkbox
                    ? event.target.checked
                    : event.target.value;
                  setValues((current) => ({ ...current, [name]: value }));
                },
              };
              const labelContent = typeof label === "string" ? t(label) : label;
              const input = (
                <input
                  {...fieldProps}
                  className="auth-input"
                  type={visible ? "text" : type}
                  value={values[name] || ""}
                  autoCapitalize={type === "password" ? "none" : undefined}
                  spellCheck={type === "password" ? false : undefined}
                />
              );
              return (
                <div key={name} className="auth-field">
                  {!checkbox && (
                    <label id={`${fieldId}-label`} htmlFor={fieldId}>
                      {labelContent}
                    </label>
                  )}
                  {checkbox ? (
                    <div className="auth-consent">
                      <input
                        {...fieldProps}
                        type="checkbox"
                        checked={Boolean(values[name])}
                      />
                      <label htmlFor={fieldId}>{labelContent}</label>
                    </div>
                  ) : options ? (
                    <CountryDropdown
                      id={fieldId}
                      disabled={submitting}
                      aria-invalid={fieldProps["aria-invalid"]}
                      aria-describedby={fieldProps["aria-describedby"]}
                      options={options}
                      value={values[name] || ""}
                      onChange={(value) =>
                        setValues((current) => ({ ...current, [name]: value }))
                      }
                    />
                  ) : revealPassword ? (
                    <div className="auth-password">
                      {input}
                      <button
                        type="button"
                        disabled={submitting}
                        aria-controls={fieldId}
                        aria-label={t(
                          visible ? "Hide {value0}" : "Show {value0}",
                          { value0: labelContent },
                        )}
                        onClick={() =>
                          setVisiblePasswords((current) => ({
                            ...current,
                            [name]: !visible,
                          }))
                        }
                      >
                        {visible ? (
                          <Eye size={18} aria-hidden="true" />
                        ) : (
                          <EyeOff size={18} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  ) : (
                    input
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
              );
            },
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
          <button
            type="submit"
            disabled={submitting}
            className={pillSubmit ? "auth-submit auth-submit--pill" : "auth-submit"}
          >
            {submitting ? t("Please wait…") : t(submitLabel)}
            {pillSubmit && <ArrowRight size={22} aria-hidden="true" />}
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
