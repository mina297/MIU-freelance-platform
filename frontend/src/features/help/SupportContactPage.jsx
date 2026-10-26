import { useLanguage } from "../../i18n/LanguageContext.js";
import SupportRequestForm from "./components/SupportRequestForm.jsx";

/**
 * Contact Support page.
 * Expected route: `/support/contact`
 *
 * @param {{
 *   onBack?: () => void,
 *   onSuccess?: (ticket: object) => void,
 * }} props
 */
export default function SupportContactPage({ onBack, onSuccess }) {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-surface-page">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-5 py-8 sm:px-8 md:px-[120px] md:py-12">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="self-start text-sm font-semibold text-[var(--theme-accent,var(--color-miu-red))]"
          >
            {t("← Back to Help Center")}
          </button>
        ) : null}
        <h1 className="text-2xl font-bold">{t("Contact support")}</h1>
        <SupportRequestForm onCancel={onBack} onSuccess={onSuccess} />
      </div>
    </div>
  );
}
