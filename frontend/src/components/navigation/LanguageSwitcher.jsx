import Select from "../ui/Select.jsx";

/** Presentation only: approved options, language state and translations belong to the caller. */
export default function LanguageSwitcher({
  options = [],
  value = "",
  onValueChange,
  label = "Language",
  placeholder = "Select language",
  emptyLabel = "No languages available",
  helperText,
  error,
  disabled = false,
  id,
  name,
  form,
  ref,
  dir,
  lang,
  className = "",
  "aria-describedby": describedBy,
}) {
  if (!Array.isArray(options) || typeof value !== "string") {
    throw new Error(
      "LanguageSwitcher requires an options array and a string value.",
    );
  }
  for (const text of [label, placeholder, emptyLabel]) {
    if (typeof text !== "string" || !text.trim()) {
      throw new Error("LanguageSwitcher labels must be nonempty strings.");
    }
  }
  const values = new Set();
  for (const option of options) {
    if (
      !option ||
      typeof option.value !== "string" ||
      !option.value.trim() ||
      values.has(option.value) ||
      typeof option.label !== "string" ||
      !option.label.trim() ||
      (option.lang != null &&
        (typeof option.lang !== "string" || !option.lang.trim())) ||
      (option.dir != null && !["ltr", "rtl", "auto"].includes(option.dir)) ||
      (option.disabled != null && typeof option.disabled !== "boolean")
    ) {
      throw new Error(
        "LanguageSwitcher options require unique nonempty values, labels and valid optional metadata.",
      );
    }
    values.add(option.value);
  }
  const unavailable =
    disabled ||
    typeof onValueChange !== "function" ||
    !options.some((option) => !option.disabled);

  function requestChange(event) {
    const nextValue = event.target.value;
    const nextOption = options.find((option) => option.value === nextValue);
    if (
      unavailable ||
      !nextOption ||
      nextOption.disabled ||
      nextValue === value
    )
      return;
    onValueChange(nextValue);
  }

  return (
    <Select
      id={id}
      name={name}
      form={form}
      ref={ref}
      dir={dir}
      lang={lang}
      label={label}
      helperText={helperText}
      error={error}
      aria-describedby={describedBy}
      className={`miu-language-switcher ${className}`.trim()}
      value={values.has(value) ? value : ""}
      disabled={unavailable}
      onChange={requestChange}
    >
      <option value="" disabled>
        {options.length ? placeholder : emptyLabel}
      </option>
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          lang={option.lang}
          dir={option.dir}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </Select>
  );
}
