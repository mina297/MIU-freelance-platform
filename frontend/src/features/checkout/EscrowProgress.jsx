import { useLanguage } from "../../i18n/LanguageContext.js";
import { Check, Clock3, LockKeyhole } from "lucide-react";
import { formatEGP } from "../../utils/formatEGP.js";
import { orderStatusLabels } from "../orders/orderListModel.js";
import "./escrow-progress.css";

export default function EscrowProgress({
  transaction,
  status = transaction ? "in_progress" : "awaiting_payment",
}) {
  const { t, locale } = useLanguage();
  const funded = Boolean(transaction);
  const completed = status === "completed";
  return (
    <section
      className="ec-progress"
      aria-label={t("Service and escrow progress")}
    >
      <div className="ec-progress-title">
        <h3>
          {funded
            ? t("Service: {status}", {
                status: t(orderStatusLabels[status] ?? status),
              })
            : t("Your payment plan")}
        </h3>
        <span>{funded ? t("50% funded") : t("Awaiting initial payment")}</span>
      </div>
      <label className="ec-work-progress">
        {t("Service completion")}{" "}
        <progress value={completed ? 100 : 0} max={100} />
        {completed
          ? t("100% · Delivery accepted; funds remain held")
          : t("0% · No delivery accepted")}
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
                  t(" held; nothing released")
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
                ? t("{status} · no automatic escrow release", {
                    status: t(orderStatusLabels[status] ?? status),
                  })
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
