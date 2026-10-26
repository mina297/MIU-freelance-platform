import { useLanguage } from "../../i18n/LanguageContext.js";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { orderParticipantError } from "./orderWorkspaceModel.js";
import { orderStore } from "./orderStore.js";
import {
  DELIVERY_SAMPLES,
  deliveryActionError,
  validateDelivery,
} from "./orderDeliveryModel.js";
import { formatDate } from "../../utils/formatDate.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import Checkbox from "../../components/ui/Checkbox.jsx";
import Modal from "../../components/ui/Modal.jsx";

function DeliveryPanel({ order, session }) {
  const { t, locale } = useLanguage();

  const [text, setText] = useState("");
  const [ids, setIds] = useState([]);
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const [notice, setNotice] = useState("");
  const heading = useRef(null);
  const form = useRef(null);
  const keepButton = useRef(null);
  const latest = order.deliveries?.at(-1);
  const latestId = latest?.id ?? null;
  const action = session.user.role === "student" ? "submit" : "revise";
  const actionError = deliveryActionError(order, session, action, latestId);
  const acceptError = deliveryActionError(order, session, "accept", latestId);
  useEffect(() => {
    if (notice && heading.current?.getClientRects().length)
      heading.current.focus();
  }, [notice]);
  useEffect(() => {
    if (Object.keys(errors).length && !confirmation)
      (
        form.current?.querySelector('[aria-invalid="true"]') ??
        form.current?.querySelector('[role="alert"]')
      )?.focus();
  }, [errors, confirmation]);
  function review(event) {
    event.preventDefault();
    const values = { text, attachmentIds: ids };
    const next = validateDelivery(values, action);
    setErrors(next);
    if (!Object.keys(next).length)
      setConfirmation({
        action,
        values,
        latestId,
        requestId: crypto.randomUUID(),
      });
  }
  function close() {
    setConfirmation(null);
    setErrors({});
  }
  function confirm() {
    if (!confirmation) return;
    const pending = confirmation;
    const result =
      pending.action === "accept"
        ? orderStore.acceptDelivery(
            order.id,
            session,
            pending.latestId,
            pending.requestId,
          )
        : pending.action === "revise"
          ? orderStore.requestRevision(
              order.id,
              pending.values,
              session,
              pending.latestId,
              pending.requestId,
            )
          : orderStore.submitDelivery(
              order.id,
              pending.values,
              session,
              pending.latestId,
              pending.requestId,
            );
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setConfirmation(null);
    setErrors({});
    setText("");
    setIds([]);
    setNotice(
      pending.action === "accept"
        ? "Delivery accepted — demo order completed. No funds released."
        : pending.action === "revise"
          ? "Revision request recorded — simulation."
          : "Delivery submitted for client review — simulation.",
    );
  }
  return (
    <Card className="order-workspace__panel order-delivery">
      <h3 ref={heading} tabIndex={-1}>
        {t("Delivery & revisions")}
      </h3>
      <p>
        {t(
          "Fictional submissions and sample metadata only. Delivery actions never process payments, release escrow, notify users or upload real files.",
        )}
      </p>
      <p role="status">{t(notice)}</p>
      {order.status === "completed" && (
        <div className="order-delivery__complete">
          <strong>{t("Order completed — simulation")}</strong>
          <p>
            {t("Accepted")}{" "}
            {order.completedAt
              ? formatDate(order.completedAt, locale)
              : t("date unavailable")}
            {t(". No financial settlement occurred.")}
          </p>
        </div>
      )}
      {order.deliveries?.length ? (
        <ol className="order-delivery__history">
          {order.deliveries.map((delivery, index) => (
            <li key={delivery.id}>
              <div className="order-delivery__meta">
                <h4>
                  {t("Delivery")} {index + 1}
                </h4>
                <span>{delivery.status.replaceAll("_", " ")}</span>
              </div>
              <p>
                {t("Submitted by")} {delivery.submittedName} ·{" "}
                {formatDate(delivery.submittedAt, locale)}
              </p>
              <p className="order-workspace__text">{delivery.text}</p>
              {delivery.attachmentIds.length > 0 && (
                <ul className="order-workspace__samples">
                  {delivery.attachmentIds.map((id) => (
                    <li key={id}>
                      {DELIVERY_SAMPLES.find((sample) => sample.id === id)
                        ?.name ?? "Sample unavailable"}{" "}
                      {t("(fictional metadata only)")}
                    </li>
                  ))}
                </ul>
              )}
              {delivery.revision && (
                <div className="order-delivery__revision">
                  <strong>{t("Client revision request")}</strong>
                  <p className="order-workspace__text">
                    {delivery.revision.text}
                  </p>
                  <p>{formatDate(delivery.revision.requestedAt, locale)}</p>
                </div>
              )}
              {delivery.acceptedAt && (
                <p>
                  {t("Accepted")} {formatDate(delivery.acceptedAt, locale)}
                </p>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <div className="order-workspace__empty">
          {t("No student delivery has been submitted.")}
        </div>
      )}
      {actionError ? (
        <p className="order-workspace__help">{actionError}</p>
      ) : (
        <form
          ref={form}
          noValidate
          onSubmit={review}
          className="order-workspace__form"
        >
          <Textarea
            label={t(
              action === "submit"
                ? t("Delivery handover note")
                : t("Requested revisions"),
            )}
            name="delivery-note"
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={3000}
            rows={5}
            required
            error={t(errors.text)}
            helperText={t(
              action === "submit"
                ? t(
                    "Describe the fictional work being handed over. Do not enter real sensitive data.",
                  )
                : t(
                    "Explain the requested changes. No revision count or deadline policy is invented.",
                  ),
            )}
          />
          {action === "submit" && (
            <fieldset className="order-workspace__attachments">
              <legend>{t("Fictional delivery samples (optional)")}</legend>
              <p>{t("No real files are uploaded or downloaded.")}</p>
              {DELIVERY_SAMPLES.map((sample, index) => (
                <Checkbox
                  key={sample.id}
                  label={t(sample.name)}
                  checked={ids.includes(sample.id)}
                  error={t(index === 0 ? errors.attachmentIds : undefined)}
                  onChange={(event) =>
                    setIds((current) =>
                      event.target.checked
                        ? [...current, sample.id]
                        : current.filter((id) => id !== sample.id),
                    )
                  }
                />
              ))}
            </fieldset>
          )}
          {errors.form && !confirmation && (
            <p role="alert" tabIndex={-1} className="project-create__alert">
              {errors.form}
            </p>
          )}
          <Button type="submit">
            {action === "submit"
              ? t("Review demo delivery")
              : t("Review revision request")}
          </Button>
        </form>
      )}
      {session.user.role === "client" && !acceptError && (
        <Button
          className="order-delivery__accept"
          onClick={() => {
            setErrors({});
            setConfirmation({
              action: "accept",
              latestId,
              requestId: crypto.randomUUID(),
            });
          }}
        >
          {t("Accept latest delivery")}
        </Button>
      )}
      <Modal
        open={!!confirmation}
        onClose={close}
        initialFocusRef={keepButton}
        title={t(
          confirmation?.action === "accept"
            ? t("Accept delivery and complete this demo order?")
            : confirmation?.action === "revise"
              ? "Request these revisions?"
              : "Submit this demo delivery?",
        )}
        description={t(
          confirmation?.action === "accept"
            ? t(
                "Completion records acceptance only. It does not release funds or perform financial settlement.",
              )
            : t(
                "Only the latest current delivery/status can be changed. No notification, financial action or real upload occurs.",
              ),
        )}
        actions={
          <>
            <Button ref={keepButton} variant="outline" onClick={close}>
              {t("Keep order unchanged")}
            </Button>
            <Button onClick={confirm}>
              {t("Confirm demo")}{" "}
              {confirmation?.action === "accept"
                ? t("acceptance")
                : confirmation?.action === "revise"
                  ? t("revision request")
                  : t("delivery")}
            </Button>
          </>
        }
      >
        {confirmation?.values && (
          <p className="order-workspace__text">{confirmation.values.text}</p>
        )}
        {confirmation?.action === "submit" && (
          <p>
            {confirmation.values.attachmentIds.length}{" "}
            {t("fictional samples selected.")}
          </p>
        )}
        {errors.form && (
          <p role="alert" className="project-create__alert">
            {errors.form}
          </p>
        )}
      </Modal>
    </Card>
  );
}

export default function OrderDelivery({ order }) {
  const { session } = useAuth();
  if (orderParticipantError(order, session)) return null;
  return (
    <DeliveryPanel
      key={`${order.id}:${session.user.id}`}
      order={order}
      session={session}
    />
  );
}
