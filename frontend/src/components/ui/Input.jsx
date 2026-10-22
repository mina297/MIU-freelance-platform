import Field from "./Field.jsx";

/** Text-like native inputs; checkbox and radio have dedicated components. */
export default function Input({
  label,
  helperText,
  error,
  id,
  required,
  disabled,
  type = "text",
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
        <input
          {...props}
          {...fieldProps}
          type={type}
          className={`miu-control ${className}`.trim()}
        />
      )}
    </Field>
  );
}
