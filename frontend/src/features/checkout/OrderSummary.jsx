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
  const money = (value) => formatEGP(value / 100);
  return (
    <Card
      as="section"
      className="ec-summary"
      aria-labelledby="checkout-summary-title"
    >
      <h2 id="checkout-summary-title">Payment summary</h2>
      <p className="ec-summary-caption">Initial escrow funding · EGP</p>
      <div className="ec-amount">
        <span>{phase === "success" ? "Held in Escrow" : "Due now"}</span>
        <strong>
          {money(
            phase === "success" ? amounts.initialMinor : amounts.dueNowMinor,
          )}
        </strong>
        <small>50% of the agreed service price</small>
      </div>
      <dl className="ec-costs">
        <div>
          <dt>Total service price</dt>
          <dd>{money(amounts.priceMinor)}</dd>
        </div>
        {order.items.map((item) => (
          <div className="ec-cost-item" key={item.id}>
            <dt>{item.name}</dt>
            <dd>{money(item.amountMinor)}</dd>
          </div>
        ))}
        <div className="ec-cost-divider">
          <dt>Initial payment · 50%</dt>
          <dd>{money(amounts.initialMinor)}</dd>
        </div>
        <div>
          <dt>
            Platform fees <small>Demo: fee rate not configured</small>
          </dt>
          <dd>{money(amounts.feeMinor)}</dd>
        </div>
        <div>
          <dt>Remaining balance · 50%</dt>
          <dd>{money(amounts.remainingMinor)}</dd>
        </div>
        <div className="ec-cost-divider ec-due">
          <dt>Amount due now</dt>
          <dd>{money(phase === "success" ? 0 : amounts.dueNowMinor)}</dd>
        </div>
      </dl>
      <div className="ec-escrow-note">
        <ShieldCheck size={23} aria-hidden="true" />
        <div>
          <b>Held in Escrow</b>
          <p>
            The initial payment stays held until agreed milestone or
            service-completion conditions are met. It is not paid directly to
            the freelancer.
          </p>
        </div>
      </div>
      <p className="ec-summary-footnote">
        No automatic release or remaining-balance charge. Demo only: no real
        funds are collected.
      </p>
      {phase === "details" && (
        <Button
          type="submit"
          form="checkout-payment-form"
          className="ec-confirm"
        >
          Review escrow payment
        </Button>
      )}
      {phase === "review" && (
        <Button className="ec-confirm" loading={processing} onClick={onConfirm}>
          Confirm demo payment · {money(amounts.dueNowMinor)}
        </Button>
      )}
    </Card>
  );
}
