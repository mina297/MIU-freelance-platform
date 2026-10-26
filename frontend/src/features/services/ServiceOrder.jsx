import { useLanguage } from "../../i18n/LanguageContext.js";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { serviceStore } from "./serviceStore.js";
import { useServiceData } from "./useServiceData.js";
import { publicServiceDetails } from "./serviceDetailsModel.js";
import { quoteServiceOrder, serviceBuyerError } from "./serviceOrderModel.js";
import { orderStore } from "../orders/orderStore.js";
import { formatEGP } from "../../utils/formatEGP.js";
import RadioGroup from "../../components/ui/RadioGroup.jsx";
import Checkbox from "../../components/ui/Checkbox.jsx";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";
import "../projects/project-create.css";
import "./service-order.css";

function OrderingForm({ details, data, session }) {
  const { t, locale } = useLanguage();

  const navigate = useNavigate();
  const [selection, setSelection] = useState(() => ({
    packageId: details.packages[0]?.id ?? "",
    extraIds: [],
  }));
  const [submissionId] = useState(() => crypto.randomUUID());
  const [confirming, setConfirming] = useState(null);
  const [error, setError] = useState("");
  const heading = useRef(null);
  const keepButton = useRef(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  const quote = quoteServiceOrder(details.service.id, selection, session, data);
  function close() {
    setConfirming(null);
    setError("");
  }
  function review(event) {
    event.preventDefault();
    setError("");
    if (quote.ok) setConfirming(quote);
    else setError(quote.error);
  }
  function confirm() {
    if (!confirming) return;
    const result = orderStore.createFromService(
      details.service.id,
      {
        packageId: confirming.packageId,
        extraIds: confirming.extraIds,
        expectedRevision: confirming.revision,
      },
      session,
      submissionId,
      serviceStore.getSnapshot,
    );
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate(`/orders/${result.order.id}`, { replace: true });
  }
  return (
    <main className="project-create service-order">
      <header className="project-create__header">
        <Link to={`/services/${details.service.id}`}>
          {t("Back to service")}
        </Link>
        <Link to="/services">{t("Catalogue")}</Link>
        <span>{t("Phase 1 preview")}</span>
      </header>
      <section className="project-create__hero">
        <div className="project-create__container">
          <p className="project-create__eyebrow">
            {t("DEFINE YOUR NEXT COLLABORATION")}
          </p>
          <h1 ref={heading} tabIndex={-1}>
            {t("Choose your scope.")}
            <br />
            <em>{t("See the full picture.")}</em>
          </h1>
          <p>{details.service.title}</p>
        </div>
      </section>
      <div className="project-create__container service-order__body">
        <p className="service-order__disclosure">
          {t(
            "Simulated order only. No payment, escrow funding, notification or delivery start occurs. Your order and selections reset on refresh.",
          )}
        </p>
        <form onSubmit={review} className="service-order__layout">
          <div className="service-order__options">
            <section className="project-create__panel service-order__panel">
              <h2>{t("Choose a package")}</h2>
              <RadioGroup
                label={t("Service package")}
                name="service-package"
                value={selection.packageId}
                onChange={(event) => {
                  setSelection((current) => ({
                    ...current,
                    packageId: event.target.value,
                  }));
                  setError("");
                }}
                options={details.packages.map((pack) => ({
                  value: pack.id,
                  label: `${pack.name} — ${formatEGP(pack.priceEGP, locale)} · ${pack.deliveryDays} days`,
                }))}
              />
              {details.packages.map((pack) => (
                <div className="service-order__scope" key={pack.id}>
                  <h3>{pack.name}</h3>
                  <p>{pack.description}</p>
                  <ul>
                    {pack.includedFeatures.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
            <section className="project-create__panel service-order__panel">
              <h2>{t("Optional extras")}</h2>
              <p>
                {t(
                  "Choose only the additions you need. Each extra adds its listed amount and days once.",
                )}
              </p>
              {details.extras.length ? (
                details.extras.map((extra) => (
                  <div className="service-order__scope" key={extra.id}>
                    <Checkbox
                      label={t("{value0} — +{value1} · +{value2} days", {
                        value0: extra.title,
                        value1: formatEGP(extra.additionalPriceEGP, locale),
                        value2: extra.additionalDays,
                      })}
                      checked={selection.extraIds.includes(extra.id)}
                      onChange={(event) => {
                        setSelection((current) => ({
                          ...current,
                          extraIds: event.target.checked
                            ? [...current.extraIds, extra.id]
                            : current.extraIds.filter((id) => id !== extra.id),
                        }));
                        setError("");
                      }}
                    />
                    <p>{extra.description}</p>
                  </div>
                ))
              ) : (
                <p>{t("No optional extras for this service.")}</p>
              )}
            </section>
          </div>
          <aside
            className="project-create__panel service-order__panel service-order__summary"
            aria-label={t("Your service order estimate")}
          >
            <p className="project-create__eyebrow">
              {t("YOUR ORDER, AT A GLANCE")}
            </p>
            <h2>{t("Scope & estimate")}</h2>
            {quote.ok ? (
              <>
                <dl>
                  <div>
                    <dt>{t("Package")}</dt>
                    <dd>{quote.terms.packageName}</dd>
                  </div>
                  <div>
                    <dt>{t("Package price")}</dt>
                    <dd>{formatEGP(quote.terms.packagePriceEGP, locale)}</dd>
                  </div>
                  {quote.terms.extras.map((extra) => (
                    <div key={extra.id}>
                      <dt>{extra.title}</dt>
                      <dd>+{formatEGP(extra.additionalPriceEGP, locale)}</dd>
                    </div>
                  ))}
                  <div className="service-order__total">
                    <dt>{t("Agreed total")}</dt>
                    <dd>{formatEGP(quote.amountEGP, locale)}</dd>
                  </div>
                  <div>
                    <dt>{t("Combined delivery estimate")}</dt>
                    <dd>
                      {quote.deliveryDays} {t("days")}
                    </dd>
                  </div>
                </dl>
                <p role="status" aria-atomic="true" className="sr-only">
                  {t("Estimated total")} {formatEGP(quote.amountEGP, locale)},{" "}
                  {quote.deliveryDays} {t("days.")}
                </p>
              </>
            ) : (
              <p role="alert">{quote.error}</p>
            )}
            <p>
              {t(
                "Creating the order does not start delivery or fund escrow. The confirmed order includes a notes/messages workspace; delivery actions and checkout remain separate.",
              )}
            </p>
            {error && !confirming && (
              <p role="alert" className="project-create__alert">
                {t(error)}
              </p>
            )}
            <Button type="submit" disabled={!quote.ok}>
              {t("Review demo order")}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelection({
                  packageId: details.packages[0]?.id ?? "",
                  extraIds: [],
                });
                setError("");
              }}
            >
              {t("Reset selection")}
            </Button>
          </aside>
        </form>
      </div>
      <Modal
        open={!!confirming}
        onClose={close}
        initialFocusRef={keepButton}
        title={t("Create this demo service order?")}
        description={t(
          "Confirmation creates one order awaiting payment. No money is collected and no provider is contacted.",
        )}
        actions={
          <>
            <Button variant="outline" ref={keepButton} onClick={close}>
              {t("Keep editing selection")}
            </Button>
            <Button onClick={confirm}>{t("Confirm demo order")}</Button>
          </>
        }
      >
        {confirming && (
          <div className="service-order__confirmation">
            <h3>{confirming.terms.serviceTitle}</h3>
            <p>{confirming.terms.packageName}</p>
            <p>{confirming.terms.packageDescription}</p>
            <p>
              {formatEGP(confirming.amountEGP, locale)} ·{" "}
              {confirming.deliveryDays} {t("days estimated")}
            </p>
            <p>
              {confirming.terms.extras.length} {t("extras selected")}
            </p>
            <ul>
              {confirming.terms.extras.map((extra) => (
                <li key={extra.id}>
                  {extra.title} — +{formatEGP(extra.additionalPriceEGP, locale)}
                  , +{extra.additionalDays} {t("days")}
                </li>
              ))}
            </ul>
          </div>
        )}
        {error && (
          <p className="project-create__alert" role="alert">
            {t(error)}
          </p>
        )}
      </Modal>
    </main>
  );
}

export default function ServiceOrder() {
  const { t } = useLanguage();

  const { serviceId } = useParams();
  const { session } = useAuth();
  const data = useServiceData();
  const access = serviceBuyerError(session);
  const details = !access && publicServiceDetails(serviceId, data);
  if (access || !details || !details.packages.length)
    return (
      <main className="project-create">
        <div className="project-create__container service-order__recovery">
          <h1>{t("Service ordering unavailable")}</h1>
          <p>
            {access ||
              "This service or its packages are unavailable for ordering."}
          </p>
          <Link to="/services">{t("Browse services")}</Link>
        </div>
      </main>
    );
  return (
    <OrderingForm
      key={`${session.user.id}:${serviceId}`}
      details={details}
      data={data}
      session={session}
    />
  );
}
