import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Select from "../../components/ui/Select.jsx";
import ErrorState from "../../components/feedback/ErrorState.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import {
  canUseClientPayments,
  checkoutStore,
  clientTransactions,
} from "./checkoutStore.js";
import { useCheckoutSnapshot } from "./useCheckoutSnapshot.js";
import {
  escrowBreakdown,
  getServiceOrder,
  PAYMENT_METHODS,
  savedCards,
  sampleCardPresets,
  validateCheckout,
} from "./checkoutModel.js";
import PaymentForm from "./PaymentForm.jsx";
import OrderSummary from "./OrderSummary.jsx";
import EscrowProgress from "./EscrowProgress.jsx";
import { formatEGP } from "../../utils/formatEGP.js";
import { formatDate } from "../../utils/formatDate.js";
import logo from "../../assets/figma/miu-anniversary-logo.png";
import "./checkout.css";

function CheckoutHeader() {
  return (
    <header className="ec-header">
      <Link to="/" className="ec-brand">
        <img src={logo} alt="MIU anniversary logo" />
        <span>
          <b>MIU Freelance</b>
          <small>Checkout & escrow</small>
        </span>
      </Link>
      <Link to="/client/payments/overview">
        <ArrowLeft size={16} aria-hidden="true" />
        Client workspace
      </Link>
    </header>
  );
}
export default function CheckoutPage() {
  const { session, startDemoSession } = useAuth();
  const { orderId = "order_002" } = useParams();
  useEffect(() => {
    document.title = "Checkout & escrow | MIU Freelance";
    window.scrollTo(0, 0);
  }, [orderId]);
  const order = getServiceOrder(orderId);
  return (
    <div className="escrow-checkout">
      <a className="ec-skip" href="#checkout-main">
        Skip to checkout
      </a>
      <CheckoutHeader />
      {!canUseClientPayments(session) ? (
        <main id="checkout-main" tabIndex={-1} className="ec-gate">
          <Card>
            <h1>Checkout & escrow</h1>
            <p>
              {session.status === "authenticated"
                ? "Only an active client can fund a service order."
                : "Continue with a client account to review and fund your own service order."}
            </p>
            {session.status !== "authenticated" && (
              <Button onClick={() => startDemoSession("client_001")}>
                Start client demo
              </Button>
            )}
            <Link to="/login" state={{ from: "/Checkout" }}>
              Log in with another account
            </Link>
            <small>
              Frontend demonstration only. No real payments or card data.
            </small>
          </Card>
        </main>
      ) : !order || order.clientId !== session.user.id ? (
        <main id="checkout-main" tabIndex={-1} className="ec-gate">
          <ErrorState
            title="Service order unavailable"
            description="This order does not exist or is not available to your account."
          />
          <Link to="/client/payments/overview">Back to your orders</Link>
        </main>
      ) : (
        <CheckoutExperience
          key={session.user.id + orderId}
          order={order}
          session={session}
        />
      )}
    </div>
  );
}
function CheckoutExperience({ order, session }) {
  const snapshot = useCheckoutSnapshot();
  const transaction = clientTransactions(snapshot, session).find(
    (item) => item.orderId === order.id,
  );
  const [values, setValues] = useState({
    method: "visa",
    cardId: savedCards[0].id,
    preset: null,
    acknowledged: false,
  });
  const [errors, setErrors] = useState({});
  const [phase, setPhase] = useState("details");
  const [processing, setProcessing] = useState(false);
  const [outcome, setOutcome] = useState("success");
  const [failure, setFailure] = useState(null);
  const formRef = useRef(null),
    headingRef = useRef(null),
    timer = useRef(null),
    locked = useRef(false);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (phase !== "details" || transaction) headingRef.current?.focus();
  }, [phase, transaction]);
  const amounts = escrowBreakdown(order.priceMinor);
  const money = (value) => formatEGP(value / 100);
  const selectedCard =
    values.cardId === "new"
      ? sampleCardPresets[values.preset]
      : savedCards.find((item) => item.id === values.cardId);
  const paymentLabel =
    PAYMENT_METHODS.find((item) => item.id === values.method)?.label +
    (values.method === "apple_pay"
      ? " · simulated wallet"
      : " · •••• " + selectedCard?.last4);
  function review(event) {
    event.preventDefault();
    const nextErrors = validateCheckout(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() =>
        formRef.current?.querySelector('[aria-invalid="true"]')?.focus(),
      );
      return;
    }
    setPhase("review");
    setFailure(null);
  }
  function confirm() {
    if (locked.current || transaction) return;
    locked.current = true;
    setProcessing(true);
    setFailure(null);
    timer.current = setTimeout(() => {
      const result = checkoutStore.fundInitial({
        orderId: order.id,
        session,
        payment: values,
        outcome,
      });
      setProcessing(false);
      locked.current = false;
      if (!result.ok) {
        setFailure(result);
        setPhase("failure");
      } else setPhase("success");
    }, 650);
  }
  if (!transaction && order.status !== "awaiting_payment")
    return (
      <main id="checkout-main" tabIndex={-1} className="ec-gate">
        <ErrorState
          title="Initial payment unavailable"
          description="This order is not awaiting an initial payment."
        />
      </main>
    );
  return (
    <main id="checkout-main" tabIndex={-1} className="ec-main">
      <div className="ec-content">
        <div className="ec-title">
          <p>CLIENT CHECKOUT</p>
          <h1 ref={headingRef} tabIndex={-1}>
            {transaction
              ? "Demo payment confirmed"
              : phase === "review"
                ? "Review your escrow payment"
                : phase === "failure"
                  ? "Payment not completed"
                  : "A clear start to great work"}
          </h1>
          <span>
            Agree on the work. Fund the first half. Keep the next steps clear.
          </span>
        </div>
        <div className="ec-demo-banner">
          <ShieldCheck size={18} aria-hidden="true" />
          <span>
            Demo checkout · fictional payment methods, no real charges or escrow
            custody.
          </span>
        </div>
        <Card as="section" className="ec-service">
          <div className="ec-service-avatar" aria-hidden="true">
            {order.freelancer
              .split(" ")
              .map((word) => word[0])
              .join("")}
          </div>
          <div>
            <p>
              {order.packageName} · Order {order.id}
            </p>
            <h2>{order.title}</h2>
            <span>
              By {order.freelancer} · {order.deliveryDays}-day delivery
            </span>
          </div>
          <strong>{money(order.priceMinor)}</strong>
          <p className="ec-service-scope">{order.scope}</p>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </Card>
        {transaction ? (
          <Card as="section" className="ec-success">
            <div className="ec-success-mark">
              <Check size={28} aria-hidden="true" />
            </div>
            <Badge variant="success">Held in Escrow</Badge>
            <h2>Your initial 50% is held, not released</h2>
            <p>
              This is a demo confirmation. No real payment was made. The service
              is <b>In Progress</b>, with payment status{" "}
              <b>Partially Paid — Escrow Held</b>.
            </p>
            <dl className="ec-success-details">
              <div>
                <dt>Transaction</dt>
                <dd>{transaction.id}</dd>
              </div>
              <div>
                <dt>Amount paid into escrow</dt>
                <dd>{money(transaction.amountPaidMinor)}</dd>
              </div>
              <div>
                <dt>Remaining balance</dt>
                <dd>{money(transaction.remainingMinor)}</dd>
              </div>
              <div>
                <dt>Payment date</dt>
                <dd>{formatDate(transaction.paymentDate)}</dd>
              </div>
              <div>
                <dt>Released to freelancer</dt>
                <dd>{money(transaction.releasedMinor)}</dd>
              </div>
            </dl>
            <EscrowProgress transaction={transaction} />
            <div className="ec-actions">
              <Link className="ec-primary-link" to="/client/payments">
                View transaction history
              </Link>
              <Link to="/client/payments/overview">Go to client dashboard</Link>
            </div>
          </Card>
        ) : phase === "failure" ? (
          <ErrorState
            title={
              failure?.code === "cancelled"
                ? "Demo payment cancelled"
                : "Demo payment failed"
            }
            description={failure?.message ?? "No payment was recorded."}
            onRetry={() => {
              setPhase("review");
              setFailure(null);
            }}
            retryLabel="Return to payment review"
            announce
          />
        ) : phase === "review" ? (
          <Card as="section" className="ec-review">
            <h2>Review before you confirm</h2>
            <dl>
              <div>
                <dt>Payment method</dt>
                <dd>{paymentLabel}</dd>
              </div>
              <div>
                <dt>Initial payment held in escrow</dt>
                <dd>{money(amounts.initialMinor)}</dd>
              </div>
              <div>
                <dt>Remaining balance, not charged now</dt>
                <dd>{money(amounts.remainingMinor)}</dd>
              </div>
            </dl>
            <p>
              Funds remain held until the agreed milestone or service-completion
              conditions are met. Confirmation does not complete the service or
              pay the freelancer.
            </p>
            <Button
              variant="outline"
              onClick={() => setPhase("details")}
              disabled={processing}
            >
              Edit payment details
            </Button>
            {processing && (
              <p role="status">Processing demo payment… Please wait.</p>
            )}
          </Card>
        ) : (
          <Card as="section" className="ec-payment-card">
            <PaymentForm
              values={values}
              errors={errors}
              formRef={formRef}
              onSubmit={review}
              onChange={(patch) => {
                setValues((previous) => ({ ...previous, ...patch }));
                setErrors({});
              }}
            />
          </Card>
        )}
        {!transaction && <EscrowProgress />}
        <footer className="ec-footer">
          <span>
            EGP only · No real card information is collected or stored.
          </span>
          <details>
            <summary>Demo controls</summary>
            <Select
              label="Simulated payment outcome"
              value={outcome}
              disabled={processing}
              onChange={(event) => setOutcome(event.target.value)}
            >
              <option value="success">Success</option>
              <option value="failure">Failure</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            <p>
              Demo records and sessions are held in memory and clear on page
              refresh.
            </p>
          </details>
        </footer>
      </div>
      <aside className="ec-aside" aria-label="Escrow payment summary">
        <OrderSummary
          order={order}
          amounts={amounts}
          phase={transaction ? "success" : phase}
          processing={processing}
          onConfirm={confirm}
        />
      </aside>
    </main>
  );
}
