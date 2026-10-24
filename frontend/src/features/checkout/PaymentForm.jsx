import { CreditCard, LockKeyhole, Smartphone } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Checkbox from "../../components/ui/Checkbox.jsx";
import {
  PAYMENT_METHODS,
  savedCards,
  sampleCardPresets,
} from "./checkoutModel.js";

export default function PaymentForm({
  values,
  errors,
  onChange,
  onSubmit,
  formRef,
}) {
  const { method, cardId, preset, acknowledged } = values;
  const draft = sampleCardPresets[preset];
  return (
    <form
      ref={formRef}
      id="checkout-payment-form"
      onSubmit={onSubmit}
      noValidate
      className="ec-payment-form"
    >
      <fieldset className="ec-methods">
        <legend>Choose a payment method</legend>
        <div>
          {PAYMENT_METHODS.map((item) => (
            <label
              className={method === item.id ? "is-selected" : ""}
              key={item.id}
            >
              <input
                type="radio"
                name="payment-method"
                value={item.id}
                checked={method === item.id}
                onChange={() =>
                  onChange({
                    method: item.id,
                    cardId:
                      savedCards.find((card) => card.brand === item.id)?.id ??
                      null,
                    preset: null,
                  })
                }
              />
              {item.id === "apple_pay" ? (
                <Smartphone size={20} aria-hidden="true" />
              ) : (
                <CreditCard size={20} aria-hidden="true" />
              )}
              <span>{item.label}</span>
            </label>
          ))}
        </div>
        {errors.method && (
          <p className="ec-error" role="alert">
            {errors.method}
          </p>
        )}
      </fieldset>
      {method === "apple_pay" ? (
        <section className="ec-wallet">
          <Smartphone size={30} aria-hidden="true" />
          <h3>Apple Pay preview</h3>
          <p>
            Continue to review this simulated Apple Pay payment. No wallet,
            device authentication or real account is connected.
          </p>
        </section>
      ) : (
        <section className="ec-card-entry">
          <div className="ec-section-heading">
            <h3>Card details</h3>
            <span>
              <LockKeyhole size={14} aria-hidden="true" />
              Sample details only
            </span>
          </div>
          <fieldset className="ec-saved">
            <legend>Saved sample card</legend>
            {savedCards
              .filter((card) => card.brand === method)
              .map((card) => (
                <label
                  key={card.id}
                  className={cardId === card.id ? "is-selected" : ""}
                >
                  <input
                    type="radio"
                    name="saved-card"
                    checked={cardId === card.id}
                    onChange={() => onChange({ cardId: card.id })}
                  />
                  <CreditCard size={22} aria-hidden="true" />
                  <span>
                    <b>
                      {card.label} · •••• {card.last4}
                    </b>
                    <small>
                      {card.holder} · Expires {card.expiry}
                    </small>
                  </span>
                </label>
              ))}
            <label className={cardId === "new" ? "is-selected" : ""}>
              <input
                type="radio"
                name="saved-card"
                checked={cardId === "new"}
                onChange={() => onChange({ cardId: "new" })}
              />
              <span>Use a new sample card</span>
            </label>
          </fieldset>
          {errors.card && (
            <p className="ec-error" role="alert">
              {errors.card}
            </p>
          )}
          {cardId === "new" && (
            <div className="ec-new-card">
              <p>
                Real card entry is disabled. Use a fictional preset to test the
                form.
              </p>
              <div className="ec-presets">
                <Button
                  variant="outline"
                  onClick={() => onChange({ preset: "valid" })}
                >
                  Load sample card
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onChange({ preset: "expired" })}
                >
                  Try expired card
                </Button>
              </div>
              <div className="ec-fields">
                <Input
                  id="checkout-holder"
                  label="Cardholder name"
                  readOnly
                  autoComplete="off"
                  value={draft?.holder ?? ""}
                  placeholder="Sample cardholder"
                  error={errors.holder}
                />
                <Input
                  id="checkout-number"
                  label="Card number"
                  readOnly
                  autoComplete="off"
                  value={draft?.number ?? ""}
                  placeholder="•••• •••• •••• 9001"
                  error={errors.number}
                />
                <Input
                  id="checkout-expiry"
                  label="Expiry date"
                  readOnly
                  autoComplete="off"
                  value={draft?.expiry ?? ""}
                  placeholder="MM/YYYY"
                  error={errors.expiry}
                />
                <Input
                  id="checkout-cvc"
                  label="CVC"
                  readOnly
                  autoComplete="off"
                  value={draft?.cvc ?? ""}
                  placeholder="000"
                  error={errors.cvc}
                />
              </div>
            </div>
          )}
          {errors.expiry && cardId !== "new" && (
            <p className="ec-error" role="alert">
              {errors.expiry}
            </p>
          )}
        </section>
      )}
      <Checkbox
        id="checkout-acknowledge"
        label="I understand that 50% is held in escrow, 50% remains unpaid, and no funds are released automatically."
        checked={acknowledged}
        onChange={(event) => onChange({ acknowledged: event.target.checked })}
        error={errors.acknowledged}
      />
    </form>
  );
}
