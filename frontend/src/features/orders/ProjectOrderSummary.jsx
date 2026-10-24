import { useEffect, useRef, useSyncExternalStore } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { getOrderById, getProjectById } from "../marketplace/selectors.js";
import { orderStore } from "./orderStore.js";
import { formatEGP } from "../../utils/formatEGP.js";
import { studentName } from "../proposals/clientProposalModel.js";
import "../projects/project-create.css";

export default function ProjectOrderSummary() {
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
            Order unavailable
          </h1>
          <p className="mt-4">
            This project order is unavailable or you are not one of its
            participants.
          </p>
          <Link
            to="/projects"
            className="mt-6 inline-flex min-h-11 items-center text-miu-red underline"
          >
            Browse projects
          </Link>
        </div>
      </main>
    );
  const project = getProjectById(order.sourceId);
  return (
    <main className="project-create">
      <header className="project-create__header">
        <Link to={`/${session.user.role}/orders`}>My orders</Link>
        <Link to="/projects">MIU Freelance.</Link>
        <span>Phase 1 preview</span>
      </header>
      <section className="project-create__hero">
        <div className="project-create__container">
          <p className="project-create__eyebrow">FROM PROPOSAL TO PROJECT</p>
          <h1 ref={heading} tabIndex={-1}>
            Your project.
            <br />
            <em>The next chapter.</em>
          </h1>
          <p>{project?.title ?? "Project order"}</p>
        </div>
      </section>
      <div className="project-create__container project-create__project-list">
        <section className="project-create__panel project-create__brief">
          <p className="project-create__eyebrow">SIMULATED ORDER HANDOFF</p>
          <h2>
            {order.status === "awaiting_payment"
              ? "Awaiting payment — demo"
              : order.status.replaceAll("_", " ")}
          </h2>
          <p className="project-create__prose">
            This is a fictional order summary. It does not process payments,
            fund escrow, or start delivery work. Checkout and the full
            collaboration workspace remain separate workflows.
          </p>
          <dl className="project-create__facts">
            <div>
              <dt>Agreed amount</dt>
              <dd className="text-xl font-bold">
                {formatEGP(order.agreedAmountEGP)}
              </dd>
            </div>
            <div>
              <dt>Student</dt>
              <dd>{studentName(order.studentId)}</dd>
            </div>
            {order.deliveryDays && (
              <div>
                <dt>Agreed delivery estimate</dt>
                <dd>{order.deliveryDays} days; work has not started</dd>
              </div>
            )}
            <div>
              <dt>Order reference</dt>
              <dd className="break-all">{order.id}</dd>
            </div>
          </dl>
          <div className="project-create__success-links">
            <Link to={`/projects/${order.sourceId}`}>View project brief</Link>
            {session.user.role === "client" && (
              <Link to={`/client/projects/${order.sourceId}/proposals`}>
                Review proposals
              </Link>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
