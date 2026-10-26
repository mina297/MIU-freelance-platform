import { useLanguage } from "../../../i18n/LanguageContext.js";
/**
 * Interactive 1–5 star rating input.
 *
 * @param {{
 *   value: number,
 *   onChange: (value: number) => void,
 *   name?: string,
 *   error?: string,
 *   disabled?: boolean,
 * }} props
 */
export default function StarRatingInput({
  value,
  onChange,
  name = "rating",
  error,
  disabled = false,
}) {
  const { t } = useLanguage();

  return (
    <fieldset className="space-y-2" disabled={disabled}>
      <legend className="text-sm font-semibold text-miu-black">
        {t("Your rating")}
      </legend>
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label={t("Star rating")}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const selected = value >= star;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={t("{value0} star{value1}", {
                value0: star,
                value1: star === 1 ? "" : "s",
              })}
              name={name}
              className={`size-10 text-2xl leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-miu-red ${
                selected ? "text-star" : "text-[#d1d5db]"
              } disabled:opacity-50`}
              onClick={() => onChange(star)}
            >
              ★
            </button>
          );
        })}
        <span className="ms-2 text-sm text-ink-secondary">
          {value > 0 ? `${value} / 5` : t("Select a rating")}
        </span>
      </div>
      {error ? (
        <p
          className="text-sm text-[var(--theme-danger-text,var(--color-danger))]"
          role="alert"
        >
          {t(error)}
        </p>
      ) : null}
    </fieldset>
  );
}
