import { useLanguage } from "../../i18n/LanguageContext.js";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LockKeyhole, ReceiptText, Wallet } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import EmptyState from "../../components/feedback/EmptyState.jsx";
import EscrowProgress from "../checkout/EscrowProgress.jsx";
import {
  clientServiceOrders,
  clientTransactions,
} from "../checkout/checkoutStore.js";
import { useCheckoutSnapshot } from "../checkout/useCheckoutSnapshot.js";
import { useAuth } from "../../hooks/useAuth.js";
import { orderStatusLabels } from "../orders/orderListModel.js";
import { formatEGP } from "../../utils/formatEGP.js";
import { formatDate } from "../../utils/formatDate.js";
import "./client-payments.css";

export default function ClientPaymentsDashboard() {
  const { t, locale } = useLanguage();
  const money = (minor) => formatEGP(minor / 100, locale);

  const { session } = useAuth();
  const snapshot = useCheckoutSnapshot();
  const orders = clientServiceOrders(snapshot, session);
  const transactions = clientTransactions(snapshot, session);
  const paymentsView =
    useLocation().pathname.toLowerCase().replace(/\/$/, "") ===
    "/client/payments";
  const [search, setSearch] = useState("");
  const [historyState, setHistoryState] = useState("ready");
  const [selectedId, setSelectedId] = useState(null);
  const headingRef = useRef(null);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [paymentsView]);
  const selected = transactions.find((item) => item.id === selectedId);
  const filtered = transactions.filter((item) =>
    `${item.id} ${item.serviceTitle} ${item.paymentMethod}`
      .toLowerCase()
      .includes(search.toLowerCase().trim()),
  );
  const paid = transactions.reduce(
    (sum, item) => sum + item.amountPaidMinor,
    0,
  );
  const remaining = orders.reduce(
    (sum, item) => sum + (item.transaction?.remainingMinor ?? item.priceMinor),
    0,
  );
  const columns = [
    {
      id: "transaction",
      header: "Transaction / service",
      rowHeader: true,
      width: "22%",
      render: (item) => (
        <>
          <b>{item.id}</b>
          <small>{item.serviceTitle}</small>
          <Badge variant="info">{t("Demo")}</Badge>
        </>
      ),
    },
    {
      id: "paid",
      header: "Amount paid",
      width: "14%",
      render: (item) => (
        <>
          <b>{money(item.amountPaidMinor)}</b>
          <small>
            {t("of")} {money(item.servicePriceMinor)}
          </small>
        </>
      ),
    },
    {
      id: "remaining",
      header: "Remaining balance",
      width: "14%",
      render: (item) => money(item.remainingMinor),
    },
    {
      id: "date",
      header: "Payment date",
      width: "14%",
      render: (item) => formatDate(item.paymentDate, locale),
    },
    {
      id: "escrow",
      header: "Escrow / payment status",
      width: "22%",
      render: () => (
        <>
          <Badge variant="warning">{t("Held in Escrow")}</Badge>
          <small>{t("Partially Paid — Escrow Held")}</small>
        </>
      ),
    },
    {
      id: "action",
      header: "Details",
      width: "14%",
      render: (item) => (
        <Button
          variant="outline"
          onClick={() => setSelectedId(item.id)}
          aria-label={t("View {value0}", { value0: item.id })}
        >
          {t("View details")}
        </Button>
      ),
    },
  ];
  return (
    <section className="client-payments">
      <div className="cp-heading">
        <p>{t("CLIENT WORKSPACE")}</p>
        <h1 ref={headingRef} tabIndex={-1}>
          {paymentsView
            ? t("Payments & escrow")
            : t("Your work, moving forward")}
        </h1>
        <span>
          {session.user.displayName}{" "}
          {t("· Track service orders and the funds held for them.")}
        </span>
      </div>
      <nav className="cp-nav" aria-label={t("Client workspace")}>
        <NavLink to="/client/payments/overview">
          {t("Overview & orders")}
        </NavLink>
        <NavLink to="/client/dashboard">{t("Client dashboard")}</NavLink>
        <NavLink to="/client/payments">{t("Payment history")}</NavLink>
      </nav>
      <p className="cp-demo-note">
        {t(
          "Demo financial records only. No real money is collected, held or released. Refresh clears this session's records.",
        )}
      </p>
      <div className="cp-stats">
        <StatCard
          label={t("Service orders")}
          value={orders.length}
          description={t("Your service orders only")}
          icon={<ReceiptText size={20} />}
        />
        <StatCard
          label={t("Amount paid")}
          value={money(paid)}
          description={t("Initial payments into demo escrow")}
          icon={<Wallet size={20} />}
        />
        <StatCard
          label={t("Held in escrow")}
          value={money(paid)}
          description={t("Released to freelancers: EGP 0")}
          icon={<LockKeyhole size={20} />}
        />
        <StatCard
          label={t("Remaining balance")}
          value={money(remaining)}
          description={t("No automatic charges")}
        />
      </div>
      {!paymentsView && (
        <section className="cp-orders" aria-labelledby="client-services-title">
          <h2 id="client-services-title">{t("Service orders")}</h2>
          {orders.length ? (
            orders.map((order) => (
              <Card as="article" key={order.id} className="cp-order">
                <div className="cp-order-heading">
                  <div>
                    <p>
                      {order.id} · {order.freelancer}
                    </p>
                    <h3>{order.title}</h3>
                  </div>
                  <Badge variant={order.transaction ? "info" : "warning"}>
                    {t(orderStatusLabels[order.status] ?? order.status)}
                  </Badge>
                </div>
                <p>{order.scope}</p>
                <dl className="cp-balances">
                  <div>
                    <dt>{t("Total service price")}</dt>
                    <dd>{money(order.priceMinor)}</dd>
                  </div>
                  <div>
                    <dt>{t("Amount paid")}</dt>
                    <dd>{money(order.transaction?.amountPaidMinor ?? 0)}</dd>
                  </div>
                  <div>
                    <dt>{t("Remaining balance")}</dt>
                    <dd>
                      {money(
                        order.transaction?.remainingMinor ?? order.priceMinor,
                      )}
                    </dd>
                  </div>
                </dl>
                {order.transaction && (
                  <>
                    <Badge variant="warning">
                      {t("Partially Paid — Escrow Held")}
                    </Badge>
                    <p>
                      {t("Payment date:")}{" "}
                      {formatDate(order.transaction.paymentDate, locale)}{" "}
                      {t("· Held in Escrow")}
                    </p>
                  </>
                )}
                <EscrowProgress
                  transaction={order.transaction}
                  status={order.status}
                />
                {(order.transaction || order.status === "awaiting_payment") && (
                  <Link
                    className="cp-checkout-link"
                    to={`/checkout/${order.id}`}
                  >
                    {order.transaction
                      ? t("View payment confirmation")
                      : t("Review & fund initial 50%")}
                  </Link>
                )}
                <Link className="cp-checkout-link" to={`/orders/${order.id}`}>
                  {t("Open order workspace")}
                </Link>
              </Card>
            ))
          ) : (
            <EmptyState
              title={t("No service orders yet")}
              description={t(
                "Your service orders and payment progress will appear here once a service order is agreed.",
              )}
            />
          )}
        </section>
      )}
      <div id="payments" className="cp-history">
        <DataTable
          caption={paymentsView ? "Payment history" : "Recent payments"}
          description={t(
            "Successful initial payments are held in escrow; none are released to freelancers.",
          )}
          columns={columns}
          rows={filtered}
          state={historyState}
          loadingLabel={t("Loading demo payment history…")}
          errorMessage="The demo payment history could not be displayed. Your recorded payments are unchanged."
          onRetry={() => setHistoryState("ready")}
          emptyTitle={search ? "No matching payments" : "No payments yet"}
          emptyDescription={
            search
              ? "Try a transaction reference or service title."
              : "Fund the initial 50% of your service order to create a demo transaction here."
          }
          onEmptyAction={search ? () => setSearch("") : undefined}
          emptyActionLabel="Clear search"
          toolbar={
            <Input
              label={t("Search payments")}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("Reference, service or payment method")}
            />
          }
        />
      </div>
      {selected && (
        <Card
          as="section"
          className="cp-payment-detail"
          aria-label={t("Transaction details")}
        >
          <h2>
            {t("Transaction details ·")} {selected.id}
          </h2>
          <dl className="cp-balances">
            <div>
              <dt>{t("Total service price")}</dt>
              <dd>{money(selected.servicePriceMinor)}</dd>
            </div>
            <div>
              <dt>{t("Amount paid / escrow held")}</dt>
              <dd>{money(selected.escrowHeldMinor)}</dd>
            </div>
            <div>
              <dt>{t("Remaining balance")}</dt>
              <dd>{money(selected.remainingMinor)}</dd>
            </div>
            <div>
              <dt>{t("Fees")}</dt>
              <dd>
                {money(selected.feeMinor)} {t("· demo placeholder")}
              </dd>
            </div>
            <div>
              <dt>{t("Payment date")}</dt>
              <dd>{formatDate(selected.paymentDate, locale)}</dd>
            </div>
            <div>
              <dt>{t("Method")}</dt>
              <dd>
                {selected.paymentMethod.replace("_", " ")}
                {selected.last4 ? ` · •••• ${selected.last4}` : ""}
              </dd>
            </div>
          </dl>
          <p>
            {t(
              "In Progress · Partially Paid — Escrow Held. Service not complete. No release or remaining-balance charge has occurred.",
            )}
          </p>
          <EscrowProgress transaction={selected} />
          <Button variant="ghost" onClick={() => setSelectedId(null)}>
            {t("Close details")}
          </Button>
        </Card>
      )}
      {paymentsView &&
        orders.some(
          (order) => !order.transaction && order.status === "awaiting_payment",
        ) && (
          <Link
            className="cp-checkout-link"
            to={`/checkout/${orders.find((order) => !order.transaction && order.status === "awaiting_payment").id}`}
          >
            {t("Go to service checkout")}
          </Link>
        )}
      <details className="cp-preview-controls">
        <summary>{t("Demo history controls")}</summary>
        <Select
          label={t("Payment history preview state")}
          value={historyState}
          onChange={(event) => setHistoryState(event.target.value)}
        >
          <option value="ready">{t("Ready")}</option>
          <option value="loading">{t("Loading")}</option>
          <option value="error">{t("Error")}</option>
        </Select>
      </details>
    </section>
  );
}
