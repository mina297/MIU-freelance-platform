import Field from "./Field.jsx";

export default function Checkbox({
  label,
  helperText,
  error,
  id,
  required,
  disabled,
  className = "",
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}) {
  return (
    <Field
      choice
      {...{
        id,
        label,
        helperText,
        error,
        required,
        disabled,
        describedBy,
        invalid,
      }}
    >
      {(fieldProps) => (
        <input
          {...props}
          {...fieldProps}
          type="checkbox"
          className={`miu-choice-control ${className}`.trim()}
        />
      )}
    </Field>
  );
}
