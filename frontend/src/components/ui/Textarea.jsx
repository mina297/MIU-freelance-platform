import Field from "./Field.jsx";

export default function Textarea({
  label,
  helperText,
  error,
  id,
  required,
  disabled,
  rows = 4,
  className = "",
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}) {
  return (
    <Field
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
        <textarea
          {...props}
          {...fieldProps}
          rows={rows}
          className={`miu-control miu-control--multiline ${className}`.trim()}
        />
      )}
    </Field>
  );
}
