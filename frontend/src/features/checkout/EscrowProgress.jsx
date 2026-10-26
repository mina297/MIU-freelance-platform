import { useLanguage } from "../../i18n/LanguageContext.js";
import { Check, Clock3, LockKeyhole } from "lucide-react";
import { formatEGP } from "../../utils/formatEGP.js";
import "./escrow-progress.css";

export default function EscrowProgress({ transaction }) {
  const { t, locale } = useLanguage();

  const funded = Boolean(transaction);
  return (
    <section
      className="ec-progress"
      aria-label={t("Service and escrow progress")}
    >
      <div className="ec-progress-title">
        <h3>{funded ? t("Work is in progress") : t("Your payment plan")}</h3>
        <span>{funded ? t("50% funded") : t("Awaiting initial payment")}</span>
      </div>
      <label className="ec-work-progress">
        {t("Service completion")} <progress value={0} max={100} />
        {t("0% · No delivery accepted")}
      </label>
      <ol>
        <li className={funded ? "is-done" : ""}>
          {funded ? (
            <Check size={17} aria-hidden="true" />
          ) : (
            <Clock3 size={17} aria-hidden="true" />
          )}
          <div>
            <b>
              {t("Initial 50%")} {funded ? t("held in escrow") : t("due now")}
            </b>
            <small>
              {funded
                ? formatEGP(transaction.escrowHeldMinor / 100, locale) +
                  " held; nothing released"
                : t("Funds are held, not sent to the freelancer")}
            </small>
          </div>
        </li>
        <li aria-current={funded ? "step" : undefined}>
          <Clock3 size={17} aria-hidden="true" />
          <div>
            <b>{t("Service delivery and client review")}</b>
            <small>
              {funded
                ? t("In Progress · service is not yet complete")
                : t("Work starts after initial funding")}
            </small>
          </div>
        </li>
        <li>
          <LockKeyhole size={17} aria-hidden="true" />
          <div>
            <b>{t("Remaining balance and escrow release")}</b>
            <small>
              {t(
                "Separate future decisions after agreed conditions. No automatic charge or release.",
              )}
            </small>
          </div>
        </li>
      </ol>
    </section>
  );
}
