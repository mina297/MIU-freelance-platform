import Field from "./Field.jsx";

/** Native same-name radios retain browser arrow-key and form behavior. */
export default function RadioGroup({
  label,
  helperText,
  error,
  id,
  name,
  required,
  disabled,
  options = [],
  value,
  defaultValue,
  onChange,
  className = "",
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
}) {
  return (
    <Field
      group
      {...{
        id,
        label,
        helperText,
        error,
        required,
        disabled,
        describedBy,
        invalid,
        className,
      }}
    >
      {(fieldProps) => (
        <div className="miu-field__options">
          {options.map((option, index) => (
            <label
              className="miu-field__choice"
              key={option.value}
              htmlFor={`${fieldProps.id}-${index}`}
            >
              <input
                {...fieldProps}
                id={`${fieldProps.id}-${index}`}
                type="radio"
                className="miu-choice-control"
                name={name ?? fieldProps.id}
                value={option.value}
                checked={
                  value !== undefined ? value === option.value : undefined
                }
                defaultChecked={
                  value === undefined
                    ? defaultValue === option.value
                    : undefined
                }
                disabled={disabled || option.disabled}
                onChange={onChange}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </Field>
  );
}
