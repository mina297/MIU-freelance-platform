import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { orderStore } from "../orders/orderStore.js";
import { serviceStore } from "./serviceStore.js";
import { useServiceData } from "./useServiceData.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { startingPackage } from "./serviceCatalogueModel.js";
import { formatEGP } from "../../utils/formatEGP.js";
import "../projects/project-create.css";
import "./service-manage.css";

function ServiceActions({ service, session, onResult }) {
  const [action, setAction] = useState(null);
  const [error, setError] = useState("");
  const keepButton = useRef(null);
  const editError = serviceStore.editError(service.id, session);
  function close() {
    setAction(null);
    setError("");
  }
  function confirm() {
    const result = serviceStore.transition(service.id, session, action);
    if (!result.ok) {
      setError(result.errors.form);
      return;
    }
    const completed = action;
    close();
    onResult(
      `${service.title}: ${completed === "remove" ? "removed" : completed === "pause" ? "paused" : "published"} — simulation.`,
      service.id,
    );
  }
  return (
    <div className="service-manage__actions">
      <div className="project-create__success-links">
        {!editError && (
          <Link to={`/student/services/${service.id}/edit`}>Edit service</Link>
        )}
        {[service.status === "published" ? "pause" : "publish", "remove"].map(
          (item) => {
            const reason = serviceStore.transitionError(
              service.id,
              session,
              item,
            );
            return (
              <div key={item}>
                <Button
                  variant={item === "remove" ? "ghost" : "outline"}
                  disabled={!!reason}
                  onClick={() => {
                    setAction(item);
                    setError("");
                  }}
                >
                  {item === "publish"
                    ? "Publish service"
                    : item === "pause"
                      ? "Pause service"
                      : "Remove service"}
                </Button>
                {reason && <p className="service-manage__help">{reason}</p>}
              </div>
            );
          },
        )}
      </div>
      {editError && <p className="service-manage__help">{editError}</p>}
      <Modal
        open={!!action}
        onClose={close}
        initialFocusRef={keepButton}
        title={`${action === "publish" ? "Publish" : action === "pause" ? "Pause" : "Remove"} this service?`}
        description={
          action === "remove"
            ? "This removes the listing and its packages/extras for this session. No undo is available; refresh restores fixtures."
            : action === "pause"
              ? "The listing will disappear from public discovery. Existing orders are not cancelled or changed."
              : "The service and its current package terms will appear in public discovery. No order or payment is created."
        }
        actions={
          <>
            <Button variant="outline" ref={keepButton} onClick={close}>
              Keep service unchanged
            </Button>
            <Button
              variant={action === "remove" ? "destructive" : "primary"}
              onClick={confirm}
            >
              Confirm {action}
            </Button>
          </>
        }
      >
        <p className="font-semibold">{service.title}</p>
        {error && (
          <p role="alert" className="project-create__alert">
            {error}
          </p>
        )}
      </Modal>
    </div>
  );
}

function Workspace() {
  const { session } = useAuth();
  const location = useLocation();
  const data = useServiceData();
  useSyncExternalStore(
    orderStore.subscribe,
    orderStore.getSnapshot,
    orderStore.getSnapshot,
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [notice, setNotice] = useState("");
  const heading = useRef(null);
  const resultsHeading = useRef(null);
  const [actionCount, setActionCount] = useState(0);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  useEffect(() => {
    if (actionCount) resultsHeading.current?.focus();
  }, [actionCount]);
  const own = data.services.filter(
    (service) => service.studentId === session.user.id,
  );
  const visible = own
    .filter(
      (service) =>
        (status === "all" || service.status === status) &&
        `${service.title} ${service.description}`
          .toLocaleLowerCase()
          .includes(query.trim().toLocaleLowerCase()),
    )
    .sort(
      (a, b) =>
        b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id),
    );
  return (
    <main className="project-create service-manage">
      <header className="project-create__header">
        <Link to="/services">Public catalogue</Link>
        <Link to="/student/dashboard">My workspace</Link>
        <span>Phase 1 preview</span>
      </header>
      <section className="project-create__hero">
        <div className="project-create__container">
          <p className="project-create__eyebrow">
            YOUR SKILLS. YOUR OWN STOREFRONT.
          </p>
          <h1 ref={heading} tabIndex={-1}>
            Shape your craft.
            <br />
            <em>Share your services.</em>
          </h1>
          <p>
            Prepare a clear offer, manage its packages, and choose when it is
            visible.
          </p>
          <Link className="service-manage__create" to="/student/services/new">
            Create a service
          </Link>
        </div>
      </section>
      <div className="project-create__container service-manage__body">
        <p className="service-manage__disclosure">
          Simulated service management. Drafts and paused listings are not
          public. Changes reset on refresh. Existing orders are never cancelled
          or repriced by these actions.
        </p>
        {location.state?.serviceNotice && (
          <p className="service-manage__disclosure">
            A service was saved in this demo session. New drafts must be
            published to appear publicly.
          </p>
        )}
        <p role="status">{notice}</p>
        <section
          className="project-create__panel service-manage__filters"
          aria-label="Filter your services"
        >
          <Input
            label="Search your services"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Select
            label="Service status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {["all", "draft", "published", "paused"].map((item) => (
              <option key={item} value={item}>
                {item === "all"
                  ? "All statuses"
                  : item[0].toUpperCase() + item.slice(1)}
              </option>
            ))}
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setQuery("");
              setStatus("all");
            }}
          >
            Reset filters
          </Button>
        </section>
        <section aria-labelledby="my-services-heading">
          <div className="service-manage__section-heading">
            <h2 id="my-services-heading" ref={resultsHeading} tabIndex={-1}>
              My services
            </h2>
            <p>
              {visible.length} of {own.length} services shown
            </p>
          </div>
          <div className="service-manage__list">
            {visible.map((service) => {
              const pack = startingPackage(service.id, data);
              return (
                <article
                  className="project-create__panel service-manage__card"
                  key={service.id}
                >
                  <div className="service-manage__section-heading">
                    <p className="project-create__eyebrow">{service.status}</p>
                    <span>
                      {pack
                        ? `From ${formatEGP(pack.priceEGP)}`
                        : "Price unavailable"}
                    </span>
                  </div>
                  <h3>{service.title}</h3>
                  <p className="service-manage__description">
                    {service.description}
                  </p>
                  {service.status === "published" && (
                    <Link to={`/services/${service.id}`}>
                      View public service
                    </Link>
                  )}
                  <ServiceActions
                    service={service}
                    session={session}
                    onResult={(message) => {
                      setNotice(message);
                      setActionCount((count) => count + 1);
                    }}
                  />
                </article>
              );
            })}
          </div>
          {!visible.length && (
            <div className="project-create__panel service-manage__card">
              <h3>
                {own.length
                  ? "No matching services"
                  : "Your storefront starts here"}
              </h3>
              <p>
                {own.length
                  ? "Try another title or reset your filters."
                  : "Create a private draft and preview your first service."}
              </p>
              <Link to="/student/services/new">Create a service</Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function StudentServices() {
  const { session } = useAuth();
  return <Workspace key={session.user.id} />;
}
