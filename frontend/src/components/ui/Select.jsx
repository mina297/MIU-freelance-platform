import Field from "./Field.jsx";

/** Options remain native children, including optgroup and disabled options. */
export default function Select({
  label,
  helperText,
  error,
  id,
  required,
  disabled,
  className = "",
  children,
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
        <select
          {...props}
          {...fieldProps}
          className={`miu-control ${className}`.trim()}
        >
          {children}
        </select>
      )}
    </Field>
  );
}
