import { useLanguage } from "../../i18n/LanguageContext.js";
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
  const { t } = useLanguage();

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
        <legend>{t("Choose a payment method")}</legend>
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
              <span>{t(item.label)}</span>
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
          <h3>{t("Apple Pay preview")}</h3>
          <p>
            {t(
              "Continue to review this simulated Apple Pay payment. No wallet, device authentication or real account is connected.",
            )}
          </p>
        </section>
      ) : (
        <section className="ec-card-entry">
          <div className="ec-section-heading">
            <h3>{t("Card details")}</h3>
            <span>
              <LockKeyhole size={14} aria-hidden="true" />
              {t("Sample details only")}
            </span>
          </div>
          <fieldset className="ec-saved">
            <legend>{t("Saved sample card")}</legend>
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
                      {card.holder} {t("· Expires")} {card.expiry}
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
              <span>{t("Use a new sample card")}</span>
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
                {t(
                  "Real card entry is disabled. Use a fictional preset to test the form.",
                )}
              </p>
              <div className="ec-presets">
                <Button
                  variant="outline"
                  onClick={() => onChange({ preset: "valid" })}
                >
                  {t("Load sample card")}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onChange({ preset: "expired" })}
                >
                  {t("Try expired card")}
                </Button>
              </div>
              <div className="ec-fields">
                <Input
                  id="checkout-holder"
                  label={t("Cardholder name")}
                  readOnly
                  autoComplete="off"
                  value={draft?.holder ?? ""}
                  placeholder={t("Sample cardholder")}
                  error={t(errors.holder)}
                />
                <Input
                  id="checkout-number"
                  label={t("Card number")}
                  readOnly
                  autoComplete="off"
                  value={draft?.number ?? ""}
                  placeholder={t("•••• •••• •••• 9001")}
                  error={t(errors.number)}
                />
                <Input
                  id="checkout-expiry"
                  label={t("Expiry date")}
                  readOnly
                  autoComplete="off"
                  value={draft?.expiry ?? ""}
                  placeholder={t("MM/YYYY")}
                  error={t(errors.expiry)}
                />
                <Input
                  id="checkout-cvc"
                  label={t("CVC")}
                  readOnly
                  autoComplete="off"
                  value={draft?.cvc ?? ""}
                  placeholder={t("000")}
                  error={t(errors.cvc)}
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
        label={t(
          "I understand that 50% is held in escrow, 50% remains unpaid, and no funds are released automatically.",
        )}
        checked={acknowledged}
        onChange={(event) => onChange({ acknowledged: event.target.checked })}
        error={t(errors.acknowledged)}
      />
    </form>
  );
}
