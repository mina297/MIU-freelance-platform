import { useLanguage } from "../../i18n/LanguageContext.js";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BriefcaseBusiness, Layers3 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { useServiceData } from "../services/useServiceData.js";
import { projectStore, mergeProjects } from "../projects/projectStore.js";
import { orderStore } from "./orderStore.js";
import {
  emptyOrderFilters,
  filterOrders,
  orderListStats,
  orderStatusLabels,
  orderListAllowed,
} from "./orderListModel.js";
import { formatEGP } from "../../utils/formatEGP.js";
import { formatDate } from "../../utils/formatDate.js";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Button from "../../components/ui/Button.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Card from "../../components/ui/Card.jsx";
import LoadingState from "../../components/feedback/LoadingState.jsx";
import EmptyState from "../../components/feedback/EmptyState.jsx";
import ErrorState from "../../components/feedback/ErrorState.jsx";
import "../projects/project-create.css";
import "./order-list.css";

function ListContent({ role, session, state, onRetry }) {
  const { t, locale } = useLanguage();

  const records = useSyncExternalStore(
    orderStore.subscribe,
    orderStore.getSnapshot,
    orderStore.getSnapshot,
  );
  const serviceData = useServiceData();
  const projectChanges = useSyncExternalStore(
    projectStore.subscribe,
    projectStore.getSnapshot,
    projectStore.getSnapshot,
  );
  const data = {
    ...serviceData,
    projects: mergeProjects(serviceData.projects, projectChanges),
  };
  const [filters, setFilters] = useState({ ...emptyOrderFilters });
  const heading = useRef(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  const ready = state === "ready";
  const stats = ready ? orderListStats(records, session, role) : null;
  const results = ready
    ? filterOrders(records, session, role, filters, data)
    : [];
  const update = (key) => (event) =>
    setFilters((current) => ({ ...current, [key]: event.target.value }));
  const reset = () => setFilters({ ...emptyOrderFilters });
  const active =
    filters.query.trim() ||
    filters.status !== "all" ||
    filters.source !== "all";
  return (
    <main className="project-create order-list">
      <header className="project-create__header">
        <Link to={role === "client" ? "/client/projects" : "/student/services"}>
          {role === "client" ? t("My projects") : t("My services")}
        </Link>
        <Link to={`/${role}/dashboard`}>{t("My workspace")}</Link>
        <span>{t("Phase 1 preview")}</span>
      </header>
      <section className="project-create__hero">
        <div className="project-create__container">
          <p className="project-create__eyebrow">
            {role === "client"
              ? t("FROM IDEAS TO COLLABORATION")
              : t("YOUR WORK. YOUR NEXT CHAPTER.")}
          </p>
          <h1 ref={heading} tabIndex={-1}>
            {t("Every order.")}
            <br />
            <em>{t("One clear view.")}</em>
          </h1>
          <p>
            {role === "client"
              ? t("Follow the projects and services you have commissioned.")
              : t("Keep your assigned project and service orders in sight.")}
          </p>
        </div>
      </section>
      <div className="project-create__container order-list__body">
        <p className="order-list__disclosure">
          {t(
            "Fictional Phase 1 orders. Amounts describe agreed order value, not money paid, earned or held in escrow. Changes reset on refresh. Full collaboration and payment workflows remain separate work.",
          )}
        </p>
        {stats && (
          <div className="order-list__stats">
            <StatCard
              label={t("Your orders")}
              value={stats.count}
              description={t("All your project and service orders.")}
            />
            <StatCard
              label={t("Awaiting payment")}
              value={stats.awaitingPayment}
              description={t("Demo status only; no funding action here.")}
            />
            <StatCard
              label={t("Agreed order value")}
              value={
                stats.amountEGP === null
                  ? undefined
                  : formatEGP(stats.amountEGP, locale)
              }
              description={t(
                "All your orders, all statuses. Not spending or earnings.",
              )}
            />
          </div>
        )}
        <section
          className="project-create__panel order-list__filters"
          aria-label={t("Filter your orders")}
        >
          <Input
            label={t("Search your orders")}
            type="search"
            placeholder={t("Title, person, package or order reference")}
            value={filters.query}
            maxLength={160}
            onChange={update("query")}
            disabled={!ready}
          />
          <Select
            label={t("Order status")}
            value={filters.status}
            onChange={update("status")}
            disabled={!ready}
          >
            <option value="all">{t("All statuses")}</option>
            {Object.entries(orderStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {t(label)}
              </option>
            ))}
          </Select>
          <Select
            label={t("Order source")}
            value={filters.source}
            onChange={update("source")}
            disabled={!ready}
          >
            <option value="all">{t("Projects & services")}</option>
            <option value="project">{t("Projects")}</option>
            <option value="service">{t("Services")}</option>
          </Select>
          <Button variant="outline" onClick={reset} disabled={!ready}>
            {t("Reset filters")}
          </Button>
        </section>
        <section aria-labelledby="order-results-heading">
          <div className="order-list__results-heading">
            <div>
              <p className="project-create__eyebrow">
                {t("YOUR COLLABORATIONS")}
              </p>
              <h2 id="order-results-heading">
                {role === "client" ? t("Client orders") : t("Student orders")}
              </h2>
              {ready && (
                <p role="status">
                  {results.length} {t("of")} {stats.count} {t("orders shown")}
                </p>
              )}
            </div>
            <Select
              label={t("Sort orders")}
              value={filters.sort}
              onChange={update("sort")}
              disabled={!ready}
            >
              <option value="newest">{t("Newest first")}</option>
              <option value="oldest">{t("Oldest first")}</option>
              <option value="amount_low">
                {t("Agreed amount: low to high")}
              </option>
              <option value="amount_high">
                {t("Agreed amount: high to low")}
              </option>
            </Select>
          </div>
          {state === "loading" ? (
            <LoadingState message={t("Loading your orders…")} />
          ) : !ready ? (
            <ErrorState
              title={t("Your orders could not be displayed")}
              description={t(
                "No order or financial action was performed. Try reopening your order list.",
              )}
              onRetry={onRetry}
            />
          ) : results.length ? (
            <div className="order-list__cards">
              {results.map(
                ({
                  order,
                  title,
                  titleNote,
                  name,
                  packageName,
                  statusLabel,
                }) => {
                  const Icon =
                    order.sourceType === "project"
                      ? BriefcaseBusiness
                      : Layers3;
                  return (
                    <Card
                      as="article"
                      className="order-list__card"
                      key={order.id}
                    >
                      <div className="order-list__card-main">
                        <div className="order-list__meta">
                          <span>
                            <Icon size={16} aria-hidden="true" />
                            {order.sourceType === "project"
                              ? t("Project order")
                              : t("Service order")}
                          </span>
                          <span className="order-list__status">
                            {t(statusLabel)}
                          </span>
                        </div>
                        <h3>
                          <Link to={`/orders/${order.id}`}>{title}</Link>
                        </h3>
                        {titleNote && (
                          <p className="order-list__note">{titleNote}</p>
                        )}
                        {packageName && (
                          <p>
                            {t("Package:")} {packageName}
                          </p>
                        )}
                        <p className="order-list__person">
                          {role === "client" ? t("Student") : t("Client")}:{" "}
                          {name}
                        </p>
                        <p className="order-list__reference">
                          {t("Reference:")} {order.id}
                        </p>
                      </div>
                      <div className="order-list__card-terms">
                        <dl>
                          <div>
                            <dt>{t("Agreed amount")}</dt>
                            <dd>{formatEGP(order.agreedAmountEGP, locale)}</dd>
                          </div>
                          <div>
                            <dt>{t("Created")}</dt>
                            <dd>{formatDate(order.createdAt, locale)}</dd>
                          </div>
                          {order.deliveryDays && (
                            <div>
                              <dt>{t("Agreed delivery estimate")}</dt>
                              <dd>
                                {order.deliveryDays} {t("days")}
                              </dd>
                            </div>
                          )}
                        </dl>
                        <Link
                          to={`/orders/${order.id}`}
                          aria-label={t("Open order {value0}", {
                            value0: order.id,
                          })}
                        >
                          {t("Open order")}{" "}
                          <ArrowUpRight size={16} aria-hidden="true" />
                        </Link>
                      </div>
                    </Card>
                  );
                },
              )}
            </div>
          ) : (
            <EmptyState
              title={t(
                stats.count ? t("No matching orders") : t("No orders yet"),
              )}
              description={t(
                stats.count
                  ? t("Try a different title, person, status or source.")
                  : role === "client"
                    ? "Accepted project proposals and confirmed service orders will appear here."
                    : "Your assigned project and service orders will appear here.",
              )}
              onAction={active ? reset : undefined}
            />
          )}
        </section>
        <div className="order-list__browse">
          <Link to="/projects">{t("Explore projects")}</Link>
          <Link to="/services">{t("Explore services")}</Link>
        </div>
      </div>
    </main>
  );
}

export default function OrdersList({ role, state = "ready", onRetry }) {
  const { t } = useLanguage();

  const { session } = useAuth();
  if (!orderListAllowed(session, role))
    return (
      <main className="project-create">
        <div className="project-create__container order-list__recovery">
          <h1>{t("Order list unavailable")}</h1>
          <p>
            {t("An active")} {role === "client" ? t("client") : t("student")}{" "}
            {t("session is required.")}
          </p>
          <Link to="/">{t("Return home")}</Link>
        </div>
      </main>
    );
  return (
    <ListContent
      key={`${role}:${session.user.id}`}
      role={role}
      session={session}
      state={state}
      onRetry={onRetry}
    />
  );
}
