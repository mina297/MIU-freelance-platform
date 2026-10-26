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

const money = (minor) => formatEGP(minor / 100);
export default function ClientPaymentsDashboard() {
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
    document.title = `${paymentsView ? "Payments & escrow" : "Client dashboard"} | MIU Freelance`;
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
          <Badge variant="info">Demo</Badge>
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
          <small>of {money(item.servicePriceMinor)}</small>
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
      render: (item) => formatDate(item.paymentDate),
    },
    {
      id: "escrow",
      header: "Escrow / payment status",
      width: "22%",
      render: () => (
        <>
          <Badge variant="warning">Held in Escrow</Badge>
          <small>Partially Paid — Escrow Held</small>
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
          aria-label={`View ${item.id}`}
        >
          View details
        </Button>
      ),
    },
  ];
  return (
    <section className="client-payments">
      <div className="cp-heading">
        <p>CLIENT WORKSPACE</p>
        <h1 ref={headingRef} tabIndex={-1}>
          {paymentsView ? "Payments & escrow" : "Your work, moving forward"}
        </h1>
        <span>
          {session.user.displayName} · Track service orders and the funds held
          for them.
        </span>
      </div>
      <nav className="cp-nav" aria-label="Client workspace">
        <NavLink to="/client/payments/overview">Overview & orders</NavLink>
        <NavLink to="/client/dashboard">Client dashboard</NavLink>
        <NavLink to="/client/payments">Payment history</NavLink>
      </nav>
      <p className="cp-demo-note">
        Demo financial records only. No real money is collected, held or
        released. Refresh clears this session's records.
      </p>
      <div className="cp-stats">
        <StatCard
          label="Service orders"
          value={orders.length}
          description="Your service orders only"
          icon={<ReceiptText size={20} />}
        />
        <StatCard
          label="Amount paid"
          value={money(paid)}
          description="Initial payments into demo escrow"
          icon={<Wallet size={20} />}
        />
        <StatCard
          label="Held in escrow"
          value={money(paid)}
          description="Released to freelancers: EGP 0"
          icon={<LockKeyhole size={20} />}
        />
        <StatCard
          label="Remaining balance"
          value={money(remaining)}
          description="No automatic charges"
        />
      </div>
      {!paymentsView && (
        <section className="cp-orders" aria-labelledby="client-services-title">
          <h2 id="client-services-title">Service orders</h2>
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
                    {orderStatusLabels[order.status] ?? order.status}
                  </Badge>
                </div>
                <p>{order.scope}</p>
                <dl className="cp-balances">
                  <div>
                    <dt>Total service price</dt>
                    <dd>{money(order.priceMinor)}</dd>
                  </div>
                  <div>
                    <dt>Amount paid</dt>
                    <dd>{money(order.transaction?.amountPaidMinor ?? 0)}</dd>
                  </div>
                  <div>
                    <dt>Remaining balance</dt>
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
                      Partially Paid — Escrow Held
                    </Badge>
                    <p>
                      Payment date: {formatDate(order.transaction.paymentDate)}{" "}
                      · Held in Escrow
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
                      ? "View payment confirmation"
                      : "Review & fund initial 50%"}
                  </Link>
                )}
                <Link className="cp-checkout-link" to={`/orders/${order.id}`}>
                  Open order workspace
                </Link>
              </Card>
            ))
          ) : (
            <EmptyState
              title="No service orders yet"
              description="Your service orders and payment progress will appear here once a service order is agreed."
            />
          )}
        </section>
      )}
      <div id="payments" className="cp-history">
        <DataTable
          caption={paymentsView ? "Payment history" : "Recent payments"}
          description="Successful initial payments are held in escrow; none are released to freelancers."
          columns={columns}
          rows={filtered}
          state={historyState}
          loadingLabel="Loading demo payment history…"
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
              label="Search payments"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Reference, service or payment method"
            />
          }
        />
      </div>
      {selected && (
        <Card
          as="section"
          className="cp-payment-detail"
          aria-label="Transaction details"
        >
          <h2>Transaction details · {selected.id}</h2>
          <dl className="cp-balances">
            <div>
              <dt>Total service price</dt>
              <dd>{money(selected.servicePriceMinor)}</dd>
            </div>
            <div>
              <dt>Amount paid / escrow held</dt>
              <dd>{money(selected.escrowHeldMinor)}</dd>
            </div>
            <div>
              <dt>Remaining balance</dt>
              <dd>{money(selected.remainingMinor)}</dd>
            </div>
            <div>
              <dt>Fees</dt>
              <dd>{money(selected.feeMinor)} · demo placeholder</dd>
            </div>
            <div>
              <dt>Payment date</dt>
              <dd>{formatDate(selected.paymentDate)}</dd>
            </div>
            <div>
              <dt>Method</dt>
              <dd>
                {selected.paymentMethod.replace("_", " ")}
                {selected.last4 ? ` · •••• ${selected.last4}` : ""}
              </dd>
            </div>
          </dl>
          <p>
            In Progress · Partially Paid — Escrow Held. Service not complete. No
            release or remaining-balance charge has occurred.
          </p>
          <EscrowProgress transaction={selected} />
          <Button variant="ghost" onClick={() => setSelectedId(null)}>
            Close details
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
            Go to service checkout
          </Link>
        )}
      <details className="cp-preview-controls">
        <summary>Demo history controls</summary>
        <Select
          label="Payment history preview state"
          value={historyState}
          onChange={(event) => setHistoryState(event.target.value)}
        >
          <option value="ready">Ready</option>
          <option value="loading">Loading</option>
          <option value="error">Error</option>
        </Select>
      </details>
    </section>
  );
}
