import { useLanguage } from "../../i18n/LanguageContext.js";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useServiceData } from "../services/useServiceData.js";
import { orderStore } from "./orderStore.js";
import ProjectOrderSummary from "./ProjectOrderSummary.jsx";
import OrderCollaboration from "./OrderCollaboration.jsx";
import { formatEGP } from "../../utils/formatEGP.js";
import "../projects/project-create.css";
import "../services/service-order.css";

/** Preserve the project view; service summaries are also participant-only. */
export default function OrderSummary() {
  const { t, locale } = useLanguage();

  const { orderId } = useParams();
  const { session } = useAuth();
  const orders = useSyncExternalStore(
    orderStore.subscribe,
    orderStore.getSnapshot,
    orderStore.getSnapshot,
  );
  const data = useServiceData();
  const heading = useRef(null);
  useEffect(() => {
    heading.current?.focus();
  }, [orderId]);
  const order = orders.find(({ id }) => id === orderId);
  if (order?.sourceType !== "service") return <ProjectOrderSummary />;
  const authorized =
    (session.user.role === "client" && order.clientId === session.user.id) ||
    (session.user.role === "student" && order.studentId === session.user.id);
  if (!authorized)
    return (
      <main className="project-create">
        <div className="project-create__container service-order__recovery">
          <h1 ref={heading} tabIndex={-1}>
            {t("Order unavailable")}
          </h1>
          <p>
            {t(
              "This order is unavailable or you are not one of its participants.",
            )}
          </p>
          <Link to="/services">{t("Browse services")}</Link>
        </div>
      </main>
    );
  const terms = order.serviceTerms;
  const student = data.participants.students.find(
    ({ id }) => id === order.studentId,
  );
  return (
    <main className="project-create service-order">
      <header className="project-create__header">
        <Link to={`/${session.user.role}/orders`}>{t("My orders")}</Link>
        <Link to="/services">{t("MIU Freelance.")}</Link>
        <span>{t("Phase 1 preview")}</span>
      </header>
      <section className="project-create__hero">
        <div className="project-create__container">
          <p className="project-create__eyebrow">
            {t("A CLEAR SCOPE. A NEW COLLABORATION.")}
          </p>
          <h1 ref={heading} tabIndex={-1}>
            {t("Your service order.")}
            <br />
            <em>{t("The next chapter.")}</em>
          </h1>
          <p>{terms?.serviceTitle ?? "Service order"}</p>
        </div>
      </section>
      <div className="project-create__container service-order__body">
        <section className="project-create__panel service-order__panel">
          <p className="project-create__eyebrow">
            {t("SIMULATED SERVICE ORDER HANDOFF")}
          </p>
          <h2>
            {order.status === "awaiting_payment"
              ? t("Awaiting payment — demo")
              : order.status.replaceAll("_", " ")}
          </h2>
          <p>
            {t(
              "No payment has been processed, no escrow funded and no delivery timer started by creating this order. Use the workspace below for notes, messages and delivery review. Checkout remains separate.",
            )}
          </p>
          <dl className="project-create__facts">
            <div>
              <dt>{t("Agreed amount")}</dt>
              <dd>{formatEGP(order.agreedAmountEGP, locale)}</dd>
            </div>
            <div>
              <dt>{t("Student")}</dt>
              <dd>
                {student?.displayName ?? "Student information unavailable"}
              </dd>
            </div>
            <div>
              <dt>{t("Order reference")}</dt>
              <dd className="break-all">{order.id}</dd>
            </div>
            {order.deliveryDays && (
              <div>
                <dt>{t("Agreed delivery estimate")}</dt>
                <dd>
                  {order.deliveryDays} {t("days")}
                  {order.status === "awaiting_payment"
                    ? t("; work has not started")
                    : t(" (agreed estimate; no deadline inferred)")}
                </dd>
              </div>
            )}
          </dl>
          {terms ? (
            <div className="service-order__scope">
              <h3>
                {t("Saved package terms:")} {terms.packageName}
              </h3>
              <p>{terms.packageDescription}</p>
              <p>
                {t("Package price:")} {formatEGP(terms.packagePriceEGP, locale)}
              </p>
              <ul>
                {terms.includedFeatures.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <h3>{t("Saved extras")}</h3>
              {terms.extras.length ? (
                <ul>
                  {terms.extras.map((extra) => (
                    <li key={extra.id}>
                      {extra.title} — +
                      {formatEGP(extra.additionalPriceEGP, locale)}, +
                      {extra.additionalDays} {t("days")}
                      <p>{extra.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{t("No extras selected.")}</p>
              )}
              <p>
                {t(
                  "These terms were copied at confirmation; later listing changes do not rewrite them.",
                )}
              </p>
            </div>
          ) : (
            <p>
              {t(
                "This older fixture contains an agreed amount and selection IDs, but no historical package snapshot. Current listing terms are not presented as historical promises.",
              )}
            </p>
          )}
          <div className="project-create__success-links">
            {order.status === "completed" && session.user.role === "client" && (
              <Link to={`/reviews/new?orderId=${encodeURIComponent(order.id)}`}>
                {t("Review completed order")}
              </Link>
            )}
            <Link to={`/services/${order.sourceId}`}>
              {t("View current service listing")}
            </Link>
            <Link to="/services">{t("Browse services")}</Link>
          </div>
        </section>
        <OrderCollaboration order={order} />
      </div>
    </main>
  );
}
