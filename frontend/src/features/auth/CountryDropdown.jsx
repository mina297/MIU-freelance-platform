import { useState } from "react";
import { Check } from "lucide-react";
import Dropdown from "../../components/ui/Dropdown.jsx";
import { useLanguage } from "../../i18n/LanguageContext.js";

function CountryOptions({ options, value, onSelect }) {
  const { t, locale } = useLanguage();
  const [query, setQuery] = useState("");
  const search = query.trim().toLocaleLowerCase(locale);
  const matches = options.filter(({ label }) =>
    [label, t(label)].some((name) =>
      name.toLocaleLowerCase(locale).includes(search),
    ),
  );

  return (
    <>
      <input
        type="search"
        className="auth-input"
        aria-label={t("Search countries")}
        placeholder={t("Search countries")}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.preventDefault();
        }}
      />
      <div className="auth-country-options">
        {matches.map((option) => (
          <button
            key={option.value}
            type="button"
            className="disclosure-item"
            aria-pressed={option.value === value}
            onClick={() => onSelect(option.value)}
          >
            {t(option.label)}
            {option.value === value && <Check size={16} aria-hidden="true" />}
          </button>
        ))}
        {!matches.length && <p role="status">{t("No countries found.")}</p>}
      </div>
    </>
  );
}

export default function CountryDropdown({
  options,
  value,
  onChange,
  ...triggerProps
}) {
  const { t } = useLanguage();
  const selected = options.find((option) => option.value === value);
  const valueId = `${triggerProps.id}-value`;
  return (
    <Dropdown
      className="auth-country"
      label={
        <span id={valueId}>{t(selected?.label ?? "Choose a country")}</span>
      }
      openOnHover={false}
      triggerProps={{
        ...triggerProps,
        className: "disclosure-trigger auth-input",
        "aria-labelledby": `${triggerProps.id}-label ${valueId}`,
      }}
    >
      {(close, open) =>
        open && (
          <CountryOptions
            options={options}
            value={value}
            onSelect={(country) => {
              onChange(country);
              close();
            }}
          />
        )
      }
    </Dropdown>
  );
}
