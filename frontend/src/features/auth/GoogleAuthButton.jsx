import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.js";

export default function GoogleAuthButton({ label }) {
  const { t } = useLanguage();
  const [showNotice, setShowNotice] = useState(false);

  return (
    <div className="auth-google">
      <button type="button" onClick={() => setShowNotice(true)}>
        {t(label)}
      </button>
      <p role="status" className="auth-hint">
        {showNotice
          ? t(
              "Google authentication is unavailable in this prototype. Use the email form with test details.",
            )
          : t("Prototype preview")}
      </p>
    </div>
  );
}
