import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { orderWorkspaceStore } from "./orderWorkspaceStore.js";
import OrderDelivery from "./OrderDelivery.jsx";
import {
  orderParticipantError,
  workspaceTimeline,
} from "./orderWorkspaceModel.js";
import { orderStatusLabels } from "./orderListModel.js";
import { formatDate } from "../../utils/formatDate.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import Tabs from "../../components/ui/Tabs.jsx";
import OrderSampleAttachments, {
  OrderAttachmentNames,
} from "./OrderSampleAttachments.jsx";
import "./order-workspace.css";

function RequirementsEditor({ order, session, requirements }) {
  const [text, setText] = useState(requirements?.text ?? "");
  const [ids, setIds] = useState(() => [
    ...(requirements?.attachmentIds ?? []),
  ]);
  const [errors, setErrors] = useState({});
  const form = useRef(null);
  useEffect(() => {
    if (Object.keys(errors).length)
      (
        form.current?.querySelector('[aria-invalid="true"]') ??
        form.current?.querySelector('[role="alert"]')
      )?.focus();
  }, [errors]);
  function save(event) {
    event.preventDefault();
    const result = orderWorkspaceStore.saveRequirements(
      order.id,
      { text, attachmentIds: ids },
      session,
      requirements?.version ?? 0,
    );
    setErrors(result.errors ?? {});
  }
  return (
    <form
      onSubmit={save}
      noValidate
      ref={form}
      className="order-workspace__form"
    >
      <Textarea
        label="Client requirements notes"
        name="requirements"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={6}
        maxLength={5000}
        required
        error={errors.text}
        helperText="Coordination notes only. These do not amend the agreed price, package scope or order status."
      />
      <OrderSampleAttachments
        ids={ids}
        onChange={setIds}
        error={errors.attachmentIds}
      />
      {errors.form && (
        <p role="alert" tabIndex={-1} className="project-create__alert">
          {errors.form}
        </p>
      )}
      <Button type="submit">Save demo requirements</Button>
    </form>
  );
}

function MessageComposer({ order, session }) {
  const [text, setText] = useState("");
  const [ids, setIds] = useState([]);
  const [token, setToken] = useState(() => crypto.randomUUID());
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const input = useRef(null);
  const form = useRef(null);
  useEffect(() => {
    if (Object.keys(errors).length)
      (
        form.current?.querySelector('[aria-invalid="true"]') ??
        form.current?.querySelector('[role="alert"]')
      )?.focus();
  }, [errors]);
  function send(event) {
    event.preventDefault();
    const result = orderWorkspaceStore.sendMessage(
      order.id,
      { text, attachmentIds: ids },
      session,
      token,
    );
    setErrors(result.errors ?? {});
    if (!result.ok) return;
    setText("");
    setIds([]);
    setToken(crypto.randomUUID());
    setNotice(
      `Demo message added at ${result.message.createdAt}. No notification sent.`,
    );
    input.current?.focus();
  }
  return (
    <form
      noValidate
      onSubmit={send}
      ref={form}
      className="order-workspace__form"
    >
      <Textarea
        ref={input}
        label="Message your order participant"
        name="order-message"
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={2000}
        rows={4}
        required
        error={errors.text}
        helperText="Fictional text only. Do not enter passwords, identity documents or payment details."
      />
      <OrderSampleAttachments
        ids={ids}
        onChange={setIds}
        error={errors.attachmentIds}
      />
      {errors.form && (
        <p role="alert" tabIndex={-1} className="project-create__alert">
          {errors.form}
        </p>
      )}
      <p role="status">{notice}</p>
      <Button type="submit">Send demo message</Button>
    </form>
  );
}

function Collaboration({ order, session }) {
  const [tab, setTab] = useState("requirements");
  useSyncExternalStore(
    orderWorkspaceStore.subscribe,
    orderWorkspaceStore.getSnapshot,
    orderWorkspaceStore.getSnapshot,
  );
  const workspace = orderWorkspaceStore.read(order.id, session);
  const savedNote = useRef(null);
  const version = workspace?.requirements?.version ?? 0;
  const previousVersion = useRef(version);
  useEffect(() => {
    if (version !== previousVersion.current && tab === "requirements")
      savedNote.current?.focus();
    previousVersion.current = version;
  }, [version, tab]);
  if (!workspace) return null;
  const requirementsError = orderWorkspaceStore.actionError(
    order.id,
    session,
    "requirements",
  );
  const messageError = orderWorkspaceStore.actionError(
    order.id,
    session,
    "message",
  );
  const requirements = workspace.requirements;
  const timeline = workspaceTimeline(order, workspace);
  return (
    <section
      className="order-workspace"
      aria-labelledby="order-workspace-heading"
    >
      <div className="order-workspace__heading">
        <div>
          <p className="project-create__eyebrow">
            ONE SPACE. A CLEARER COLLABORATION.
          </p>
          <h2 id="order-workspace-heading">Order workspace</h2>
        </div>
        <span>Participant-only · simulated</span>
      </div>
      <p className="order-workspace__disclosure">
        Notes and messages stay in this browser session and reset on refresh. No
        real attachments or notifications. Awaiting-payment orders have not been
        funded or started. Delivery actions require an eligible order status and
        never release real funds.
      </p>
      <Tabs
        label="Order workspace sections"
        value={tab}
        onValueChange={setTab}
        items={[
          {
            id: "delivery",
            label: "Delivery & revisions",
            content: <OrderDelivery order={order} />,
          },
          {
            id: "requirements",
            label: "Requirements",
            content: (
              <Card className="order-workspace__panel">
                <h3>Client requirements</h3>
                {requirements ? (
                  <div
                    className="order-workspace__saved"
                    ref={savedNote}
                    tabIndex={-1}
                  >
                    <p role="status">
                      Requirements saved — demo · version {requirements.version}
                    </p>
                    <p className="order-workspace__text">{requirements.text}</p>
                    <OrderAttachmentNames ids={requirements.attachmentIds} />
                    <p>Saved {formatDate(requirements.savedAt)}</p>
                  </div>
                ) : (
                  <p>No client requirements notes have been saved yet.</p>
                )}
                {requirementsError ? (
                  <p className="order-workspace__help">{requirementsError}</p>
                ) : (
                  <RequirementsEditor
                    key={requirements?.version ?? 0}
                    order={order}
                    session={session}
                    requirements={requirements}
                  />
                )}
              </Card>
            ),
          },
          {
            id: "messages",
            label: `Messages (${workspace.messages.length})`,
            content: (
              <Card className="order-workspace__panel">
                <h3>Order conversation</h3>
                <p>
                  Only this order's client and assigned student can read or add
                  these demo messages.
                </p>
                {workspace.messages.length ? (
                  <ol className="order-workspace__messages">
                    {workspace.messages.map((message) => (
                      <li
                        key={message.id}
                        className={
                          message.senderId === session.user.id
                            ? "order-workspace__message order-workspace__message--own"
                            : "order-workspace__message"
                        }
                      >
                        <div>
                          <strong>{message.senderName}</strong>
                          <span>
                            {message.senderRole === "client"
                              ? "Client"
                              : "Student"}{" "}
                            · {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <p className="order-workspace__text">{message.text}</p>
                        <OrderAttachmentNames ids={message.attachmentIds} />
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="order-workspace__empty">
                    No messages yet. Start with a clear, fictional coordination
                    note.
                  </div>
                )}
                {messageError ? (
                  <p className="order-workspace__help">{messageError}</p>
                ) : (
                  <MessageComposer order={order} session={session} />
                )}
              </Card>
            ),
          },
          {
            id: "progress",
            label: "Progress & activity",
            content: (
              <Card className="order-workspace__panel">
                <h3>Progress overview</h3>
                <p className="order-workspace__current">
                  Current demo status:{" "}
                  <strong>
                    {orderStatusLabels[order.status] ?? "Status unavailable"}
                  </strong>
                </p>
                <p>
                  No payment history, completion percentage, start date or
                  delivery deadline is inferred from this status. Milestones and
                  financial actions remain separate work; delivery history is
                  available in its own tab.
                </p>
                <ol className="order-workspace__timeline">
                  {timeline.map((item) => (
                    <li key={item.id}>
                      <strong>{item.label}</strong>
                      <p>
                        {item.actorName ? `${item.actorName} · ` : ""}
                        {formatDate(item.createdAt)}
                      </p>
                    </li>
                  ))}
                </ol>
                <p>
                  Only order creation and recorded workspace events are listed.
                  No earlier status transitions are invented.
                </p>
              </Card>
            ),
          },
        ]}
      />
    </section>
  );
}

export default function OrderCollaboration({ order }) {
  const { session } = useAuth();
  if (orderParticipantError(order, session)) return null;
  return (
    <Collaboration
      key={`${order.id}:${session.user.id}`}
      order={order}
      session={session}
    />
  );
}
