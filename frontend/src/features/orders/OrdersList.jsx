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
          {role === "client" ? "My projects" : "My services"}
        </Link>
        <Link to={`/${role}/dashboard`}>My workspace</Link>
        <span>Phase 1 preview</span>
      </header>
      <section className="project-create__hero">
        <div className="project-create__container">
          <p className="project-create__eyebrow">
            {role === "client"
              ? "FROM IDEAS TO COLLABORATION"
              : "YOUR WORK. YOUR NEXT CHAPTER."}
          </p>
          <h1 ref={heading} tabIndex={-1}>
            Every order.
            <br />
            <em>One clear view.</em>
          </h1>
          <p>
            {role === "client"
              ? "Follow the projects and services you have commissioned."
              : "Keep your assigned project and service orders in sight."}
          </p>
        </div>
      </section>
      <div className="project-create__container order-list__body">
        <p className="order-list__disclosure">
          Fictional Phase 1 orders. Amounts describe agreed order value, not
          money paid, earned or held in escrow. Changes reset on refresh. Full
          collaboration and payment workflows remain separate work.
        </p>
        {stats && (
          <div className="order-list__stats">
            <StatCard
              label="Your orders"
              value={stats.count}
              description="All your project and service orders."
            />
            <StatCard
              label="Awaiting payment"
              value={stats.awaitingPayment}
              description="Demo status only; no funding action here."
            />
            <StatCard
              label="Agreed order value"
              value={
                stats.amountEGP === null
                  ? undefined
                  : formatEGP(stats.amountEGP)
              }
              description="All your orders, all statuses. Not spending or earnings."
            />
          </div>
        )}
        <section
          className="project-create__panel order-list__filters"
          aria-label="Filter your orders"
        >
          <Input
            label="Search your orders"
            type="search"
            placeholder="Title, person, package or order reference"
            value={filters.query}
            maxLength={160}
            onChange={update("query")}
            disabled={!ready}
          />
          <Select
            label="Order status"
            value={filters.status}
            onChange={update("status")}
            disabled={!ready}
          >
            <option value="all">All statuses</option>
            {Object.entries(orderStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Select
            label="Order source"
            value={filters.source}
            onChange={update("source")}
            disabled={!ready}
          >
            <option value="all">Projects & services</option>
            <option value="project">Projects</option>
            <option value="service">Services</option>
          </Select>
          <Button variant="outline" onClick={reset} disabled={!ready}>
            Reset filters
          </Button>
        </section>
        <section aria-labelledby="order-results-heading">
          <div className="order-list__results-heading">
            <div>
              <p className="project-create__eyebrow">YOUR COLLABORATIONS</p>
              <h2 id="order-results-heading">
                {role === "client" ? "Client orders" : "Student orders"}
              </h2>
              {ready && (
                <p role="status">
                  {results.length} of {stats.count} orders shown
                </p>
              )}
            </div>
            <Select
              label="Sort orders"
              value={filters.sort}
              onChange={update("sort")}
              disabled={!ready}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="amount_low">Agreed amount: low to high</option>
              <option value="amount_high">Agreed amount: high to low</option>
            </Select>
          </div>
          {state === "loading" ? (
            <LoadingState message="Loading your orders…" />
          ) : !ready ? (
            <ErrorState
              title="Your orders could not be displayed"
              description="No order or financial action was performed. Try reopening your order list."
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
                              ? "Project order"
                              : "Service order"}
                          </span>
                          <span className="order-list__status">
                            {statusLabel}
                          </span>
                        </div>
                        <h3>
                          <Link to={`/orders/${order.id}`}>{title}</Link>
                        </h3>
                        {titleNote && (
                          <p className="order-list__note">{titleNote}</p>
                        )}
                        {packageName && <p>Package: {packageName}</p>}
                        <p className="order-list__person">
                          {role === "client" ? "Student" : "Client"}: {name}
                        </p>
                        <p className="order-list__reference">
                          Reference: {order.id}
                        </p>
                      </div>
                      <div className="order-list__card-terms">
                        <dl>
                          <div>
                            <dt>Agreed amount</dt>
                            <dd>{formatEGP(order.agreedAmountEGP)}</dd>
                          </div>
                          <div>
                            <dt>Created</dt>
                            <dd>{formatDate(order.createdAt)}</dd>
                          </div>
                          {order.deliveryDays && (
                            <div>
                              <dt>Agreed delivery estimate</dt>
                              <dd>{order.deliveryDays} days</dd>
                            </div>
                          )}
                        </dl>
                        <Link
                          to={`/orders/${order.id}`}
                          aria-label={`Open order ${order.id}`}
                        >
                          Open order{" "}
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
              title={stats.count ? "No matching orders" : "No orders yet"}
              description={
                stats.count
                  ? "Try a different title, person, status or source."
                  : role === "client"
                    ? "Accepted project proposals and confirmed service orders will appear here."
                    : "Your assigned project and service orders will appear here."
              }
              onAction={active ? reset : undefined}
            />
          )}
        </section>
        <div className="order-list__browse">
          <Link to="/projects">Explore projects</Link>
          <Link to="/services">Explore services</Link>
        </div>
      </div>
    </main>
  );
}

export default function OrdersList({ role, state = "ready", onRetry }) {
  const { session } = useAuth();
  if (!orderListAllowed(session, role))
    return (
      <main className="project-create">
        <div className="project-create__container order-list__recovery">
          <h1>Order list unavailable</h1>
          <p>
            An active {role === "client" ? "client" : "student"} session is
            required.
          </p>
          <Link to="/">Return home</Link>
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
