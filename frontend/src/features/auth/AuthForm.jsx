import { useId, useRef, useState } from "react";

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
      setErrors({ form: "The simulated action failed. Please try again." });
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
    <section
      className="mx-auto max-w-lg space-y-4 rounded-xl border border-gray-300 bg-white p-5 sm:p-8"
      aria-labelledby={`${id}-title`}
    >
      <h1 id={`${id}-title`} className="text-2xl font-bold">
        {title}
      </h1>
      <p className="text-sm">
        Simulated authentication — accounts and password changes exist in memory
        only and reset on refresh. Use fictional details and a demo-only
        password.
      </p>
      <form
        noValidate
        onSubmit={submit}
        className="space-y-4"
        aria-busy={submitting}
      >
        {fields.map(
          ({ name, label, type = "text", autoComplete, hint, options }) => (
            <div key={name} className="space-y-1">
              <label htmlFor={`${id}-${name}`} className="block font-medium">
                {label} (required)
              </label>
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
                  className="w-full rounded border border-gray-400 p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
                  onChange={(event) =>
                    setValues({ ...values, [name]: event.target.value })
                  }
                >
                  <option value="">Choose a role</option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
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
                  className="w-full rounded border border-gray-400 p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red"
                  onChange={(event) =>
                    setValues({ ...values, [name]: event.target.value })
                  }
                />
              )}
              {hint && (
                <p id={`${id}-${name}-hint`} className="text-sm text-gray-700">
                  {hint}
                </p>
              )}
              {errors[name] && (
                <p
                  id={`${id}-${name}-error`}
                  className="text-sm text-red-800"
                  role="alert"
                >
                  {errors[name]}
                </p>
              )}
            </div>
          ),
        )}
        {errors.form && (
          <p role="alert" className="text-red-800">
            {errors.form}
          </p>
        )}
        {message && <p role="status">{message}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-miu-red p-3 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red disabled:opacity-60"
        >
          {submitting ? "Simulating…" : submitLabel}
        </button>
        {afterSubmit}
      </form>
      <div className="space-y-2 text-sm [&_a]:underline [&_a]:focus-visible:outline-2">
        {children}
      </div>
    </section>
  );
}
