import { useLanguage } from "../../i18n/LanguageContext.js";
import { ShieldCheck } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import { formatEGP } from "../../utils/formatEGP.js";

export default function OrderSummary({
  order,
  amounts,
  phase,
  processing,
  onConfirm,
}) {
  const { t, locale } = useLanguage();

  const money = (value) => formatEGP(value / 100, locale);
  return (
    <Card
      as="section"
      className="ec-summary"
      aria-labelledby="checkout-summary-title"
    >
      <h2 id="checkout-summary-title">{t("Payment summary")}</h2>
      <p className="ec-summary-caption">{t("Initial escrow funding · EGP")}</p>
      <div className="ec-amount">
        <span>{phase === "success" ? t("Held in Escrow") : t("Due now")}</span>
        <strong>
          {money(
            phase === "success" ? amounts.initialMinor : amounts.dueNowMinor,
          )}
        </strong>
        <small>{t("50% of the agreed service price")}</small>
      </div>
      <dl className="ec-costs">
        <div>
          <dt>{t("Total service price")}</dt>
          <dd>{money(amounts.priceMinor)}</dd>
        </div>
        {order.items.map((item) => (
          <div className="ec-cost-item" key={item.id}>
            <dt>{item.name}</dt>
            <dd>{money(item.amountMinor)}</dd>
          </div>
        ))}
        <div className="ec-cost-divider">
          <dt>{t("Initial payment · 50%")}</dt>
          <dd>{money(amounts.initialMinor)}</dd>
        </div>
        <div>
          <dt>
            {t("Platform fees")}{" "}
            <small>{t("Demo: fee rate not configured")}</small>
          </dt>
          <dd>{money(amounts.feeMinor)}</dd>
        </div>
        <div>
          <dt>{t("Remaining balance · 50%")}</dt>
          <dd>{money(amounts.remainingMinor)}</dd>
        </div>
        <div className="ec-cost-divider ec-due">
          <dt>{t("Amount due now")}</dt>
          <dd>{money(phase === "success" ? 0 : amounts.dueNowMinor)}</dd>
        </div>
      </dl>
      <div className="ec-escrow-note">
        <ShieldCheck size={23} aria-hidden="true" />
        <div>
          <b>{t("Held in Escrow")}</b>
          <p>
            {t(
              "The initial payment stays held until agreed milestone or service-completion conditions are met. It is not paid directly to the freelancer.",
            )}
          </p>
        </div>
      </div>
      <p className="ec-summary-footnote">
        {t(
          "No automatic release or remaining-balance charge. Demo only: no real funds are collected.",
        )}
      </p>
      {phase === "details" && (
        <Button
          type="submit"
          form="checkout-payment-form"
          className="ec-confirm"
        >
          {t("Review escrow payment")}
        </Button>
      )}
      {phase === "review" && (
        <Button className="ec-confirm" loading={processing} onClick={onConfirm}>
          {t("Confirm demo payment ·")} {money(amounts.dueNowMinor)}
        </Button>
      )}
    </Card>
  );
}
