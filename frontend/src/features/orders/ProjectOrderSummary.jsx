import { useLanguage } from "../../i18n/LanguageContext.js";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { getOrderById, getProjectById } from "../marketplace/selectors.js";
import { orderStore } from "./orderStore.js";
import OrderCollaboration from "./OrderCollaboration.jsx";
import { formatEGP } from "../../utils/formatEGP.js";
import { studentName } from "../proposals/clientProposalModel.js";
import "../projects/project-create.css";

export default function ProjectOrderSummary() {
  const { t, locale } = useLanguage();

  const { orderId } = useParams();
  const { session } = useAuth();
  useSyncExternalStore(
    orderStore.subscribe,
    orderStore.getSnapshot,
    orderStore.getSnapshot,
  );
  const heading = useRef(null);
  useEffect(() => {
    heading.current?.focus();
  }, [orderId]);
  const order = getOrderById(orderId);
  const authorized =
    order?.sourceType === "project" &&
    ((session.user.role === "client" && order.clientId === session.user.id) ||
      (session.user.role === "student" && order.studentId === session.user.id));
  if (!authorized)
    return (
      <main className="project-create">
        <div className="project-create__container project-create__brief">
          <h1 ref={heading} tabIndex={-1} className="text-3xl font-bold">
            {t("Order unavailable")}
          </h1>
          <p className="mt-4">
            {t(
              "This project order is unavailable or you are not one of its participants.",
            )}
          </p>
          <Link
            to="/projects"
            className="mt-6 inline-flex min-h-11 items-center text-[var(--theme-accent,var(--color-miu-red))] underline"
          >
            {t("Browse projects")}
          </Link>
        </div>
      </main>
    );
  const project = getProjectById(order.sourceId);
  return (
    <main className="project-create">
      <header className="project-create__header">
        <Link to={`/${session.user.role}/orders`}>{t("My orders")}</Link>
        <Link to="/projects">{t("MIU Freelance.")}</Link>
        <span>{t("Phase 1 preview")}</span>
      </header>
      <section className="project-create__hero">
        <div className="project-create__container">
          <p className="project-create__eyebrow">
            {t("FROM PROPOSAL TO PROJECT")}
          </p>
          <h1 ref={heading} tabIndex={-1}>
            {t("Your project.")}
            <br />
            <em>{t("The next chapter.")}</em>
          </h1>
          <p>{project?.title ?? "Project order"}</p>
        </div>
      </section>
      <div className="project-create__container project-create__project-list">
        <section className="project-create__panel project-create__brief">
          <p className="project-create__eyebrow">
            {t("SIMULATED ORDER HANDOFF")}
          </p>
          <h2>
            {order.status === "awaiting_payment"
              ? t("Awaiting payment — demo")
              : order.status.replaceAll("_", " ")}
          </h2>
          <p className="project-create__prose">
            {t(
              "This is a fictional order summary. It does not process payments, fund escrow, or start delivery work. Use the workspace below for notes, messages and delivery review. Checkout remains separate.",
            )}
          </p>
          <dl className="project-create__facts">
            {order.status === "completed" && session.user.role === "client" && (
              <div>
                <dt>{t("Client feedback")}</dt>
                <dd>
                  <Link
                    to={`/reviews/new?orderId=${encodeURIComponent(order.id)}`}
                  >
                    {t("Review completed order")}
                  </Link>
                </dd>
              </div>
            )}
            <div>
              <dt>{t("Agreed amount")}</dt>
              <dd className="text-xl font-bold">
                {formatEGP(order.agreedAmountEGP, locale)}
              </dd>
            </div>
            <div>
              <dt>{t("Student")}</dt>
              <dd>{studentName(order.studentId)}</dd>
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
            <div>
              <dt>{t("Order reference")}</dt>
              <dd className="break-all">{order.id}</dd>
            </div>
          </dl>
          <div className="project-create__success-links">
            <Link to={`/projects/${order.sourceId}`}>
              {t("View project brief")}
            </Link>
            {session.user.role === "client" && (
              <Link to={`/client/projects/${order.sourceId}/proposals`}>
                {t("Review proposals")}
              </Link>
            )}
          </div>
        </section>
        <OrderCollaboration order={order} />
      </div>
    </main>
  );
}
