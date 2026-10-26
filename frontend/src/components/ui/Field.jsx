import { useLanguage } from "../../i18n/LanguageContext.js";
import { useId } from "react";
import { CircleAlert } from "lucide-react";
import "./foundation.css";
import "./forms.css";

/** Shared label and feedback wiring; children receives native control attributes. */
export default function Field({
  id,
  label,
  helperText,
  error,
  required = false,
  disabled = false,
  className = "",
  describedBy,
  invalid,
  choice = false,
  group = false,
  children,
}) {
  const { t } = useLanguage();

  const generatedId = useId();
  const controlId = id ?? generatedId;
  const description =
    [
      describedBy,
      helperText && `${controlId}-helper`,
      error && `${controlId}-error`,
    ]
      .filter(Boolean)
      .join(" ") || undefined;
  const controlProps = {
    id: controlId,
    required,
    disabled,
    "aria-describedby": description,
    "aria-invalid": error ? true : invalid,
  };
  const caption = (
    <>
      {t(label)}
      {required && <span aria-hidden="true"> *</span>}
    </>
  );
  const content = (
    <>
      {group ? (
        <legend className="miu-field__label">{t(caption)}</legend>
      ) : choice ? (
        <label className="miu-field__choice" htmlFor={controlId}>
          {children(controlProps)}
          <span>{t(caption)}</span>
        </label>
      ) : (
        <label className="miu-field__label" htmlFor={controlId}>
          {t(caption)}
        </label>
      )}
      {!choice && children(controlProps)}
      {helperText && (
        <p className="miu-field__helper" id={`${controlId}-helper`}>
          {t(helperText)}
        </p>
      )}
      {error && (
        <p className="miu-field__error" id={`${controlId}-error`}>
          <CircleAlert size={14} aria-hidden="true" />
          <span>{t(error)}</span>
        </p>
      )}
    </>
  );
  const classes = `miu-field ${className}`.trim();

  return group ? (
    <fieldset
      className={classes}
      disabled={disabled}
      aria-describedby={description}
      aria-invalid={controlProps["aria-invalid"]}
    >
      {content}
    </fieldset>
  ) : (
    <div className={classes}>{content}</div>
  );
}
