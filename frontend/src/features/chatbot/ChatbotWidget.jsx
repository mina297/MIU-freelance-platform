import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  X,
  BriefcaseBusiness,
  UsersRound,
  Route,
  Info,
  SendHorizontal,
  MessageSquare,
  Minimize2,
  Maximize2,
  CirclePlus,
} from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.js";
import { useAuth } from "../../hooks/useAuth.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Card from "../../components/ui/Card.jsx";
import Dropdown from "../../components/ui/Dropdown.jsx";
import portrait from "./assets/miu-assistant-character.jpg";
import AssistantCharacter from "./AssistantCharacter.jsx";
import {
  createConversation,
  syncConversation,
  sendMessage,
  MAX_MESSAGE_LENGTH,
  QUICK_ACTIONS,
  FAQ_ACTIONS,
  GUIDANCE_ROUTES,
} from "./chatbotModel.js";
import "./chatbot.css";

const ACTION_ICONS = {
  about: Info,
  how: Route,
  work: BriefcaseBusiness,
  hire: UsersRound,
};

export function ChatbotMessages({ messages }) {
  const { t } = useLanguage();
  return messages.map(({ id, author, text, links, suggested }) => (
    <div key={id} className={`chatbot-message chatbot-message--${author}`}>
      {author === "assistant" && (
        <img
          className="chatbot-message-avatar"
          src={portrait}
          alt=""
          width="28"
          height="28"
        />
      )}
      <div className="chatbot-message-content">
        <span className="chatbot-sr-only">
          {t(author === "user" ? "You" : "Simulated assistant")}
        </span>
        <div className="chatbot-bubble">
          <p dir="auto">
            {author === "assistant" || suggested ? t(text) : text}
          </p>
        </div>
        {links?.some(({ to }) => GUIDANCE_ROUTES.has(to)) && (
          <div className="chatbot-guidance-links">
            {links
              .filter(({ to }) => GUIDANCE_ROUTES.has(to))
              .map(({ label, to }) => (
                <Link key={to} to={to}>
                  {t(label)} <span aria-hidden="true">↗</span>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  ));
}

export default function ChatbotWidget() {
  const { t } = useLanguage();
  const { session } = useAuth();
  const [stored, setConversation] = useState(createConversation);
  const conversation = syncConversation(stored, session);
  if (conversation !== stored) setConversation(conversation);
  const panelId = useId();
  const widget = useRef(null);
  const launcher = useRef(null);
  const input = useRef(null);
  const transcript = useRef(null);
  const mascot = useRef(null);
  const previousPosition = useRef(null);
  const flight = useRef(null);
  const motionAllowed = useRef(false);

  // FLIP keeps a single live character while its layout moves into the header.
  useLayoutEffect(() => {
    flight.current?.cancel();
    const before = previousPosition.current;
    previousPosition.current = null;
    if (
      !before ||
      !motionAllowed.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const after = mascot.current.getBoundingClientRect();
    if (!after.width || !after.height) return;
    flight.current = mascot.current.animate(
      [
        {
          transform: `translate(${before.left - after.left}px, ${before.top - after.top}px) scale(${before.width / after.width}, ${before.height / after.height})`,
        },
        { transform: "translate(0, 0) scale(1)" },
      ],
      { duration: 650, easing: "cubic-bezier(0.32, 0.72, 0, 1)" },
    );
  }, [conversation.open, conversation.collapsed, conversation.accountId]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cancel = () => flight.current?.cancel();
    reduced.addEventListener("change", cancel);
    window.addEventListener("resize", cancel);
    return () => {
      cancel();
      reduced.removeEventListener("change", cancel);
      window.removeEventListener("resize", cancel);
    };
  }, []);

  useEffect(() => {
    if (conversation.open) input.current?.focus({ preventScroll: true });
  }, [conversation.open, conversation.accountId]);

  useEffect(() => {
    if (conversation.open && transcript.current)
      transcript.current.scrollTop = transcript.current.scrollHeight;
  }, [conversation.open, conversation.messages]);

  const capture = useCallback((event) => {
    previousPosition.current = mascot.current?.getBoundingClientRect();
    motionAllowed.current = event?.detail > 0;
  }, []);

  const minimize = useCallback(
    (event, { restoreFocus = true } = {}) => {
      capture(event);
      setConversation((state) => ({ ...state, open: false }));
      if (restoreFocus) launcher.current?.focus({ preventScroll: true });
    },
    [capture],
  );

  useEffect(() => {
    if (!conversation.open) return;

    function dismissOnOutsideClick(event) {
      if (event.composedPath().includes(widget.current)) return;
      minimize(event, { restoreFocus: false });
    }

    document.addEventListener("click", dismissOnOutsideClick, true);
    return () =>
      document.removeEventListener("click", dismissOnOutsideClick, true);
  }, [conversation.open, minimize]);
  function send(value, options) {
    setConversation((state) => sendMessage(state, value, options));
    input.current?.focus({ preventScroll: true });
  }
  function action(event, close, update) {
    event.stopPropagation();
    close();
    update();
  }

  return (
    <aside
      ref={widget}
      className="chatbot-widget"
      data-open={conversation.open}
      data-collapsed={conversation.collapsed}
      aria-label={t("Simulated platform assistant")}
    >
      <Card
        as="section"
        id={panelId}
        hidden={!conversation.open}
        className="chatbot-panel"
        aria-labelledby={`${panelId}-title`}
        aria-describedby={`${panelId}-notice`}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            minimize(event);
          }
        }}
      >
        <header className="chatbot-heading">
          <h2 id={`${panelId}-title`} className="chatbot-title-pill">
            <MessageSquare size={16} fill="currentColor" aria-hidden="true" />
            {t("MIU Assistant")}
          </h2>
          <Dropdown label="Quick Actions" className="chatbot-actions">
            {(close) => (
              <>
                <p className="chatbot-actions-title">{t("Quick Actions")}</p>
                <button
                  type="button"
                  onClick={(event) =>
                    action(event, close, () => minimize(event))
                  }
                >
                  <X size={17} aria-hidden="true" />
                  {t("Minimize chat")}
                </button>
                <button
                  type="button"
                  onClick={(event) =>
                    action(event, close, () => {
                      capture(event);
                      setConversation((state) => ({
                        ...state,
                        collapsed: !state.collapsed,
                      }));
                      input.current?.focus({ preventScroll: true });
                    })
                  }
                >
                  {conversation.collapsed ? (
                    <Maximize2 size={17} aria-hidden="true" />
                  ) : (
                    <Minimize2 size={17} aria-hidden="true" />
                  )}
                  {t(conversation.collapsed ? "Expand view" : "Collapse view")}
                </button>
                <button
                  type="button"
                  onClick={(event) =>
                    action(event, close, () => {
                      setConversation((state) => ({
                        ...createConversation(state.accountId),
                        open: true,
                        collapsed: state.collapsed,
                      }));
                      input.current?.focus({ preventScroll: true });
                    })
                  }
                >
                  <CirclePlus size={18} aria-hidden="true" />
                  {t("New conversation")}
                </button>
              </>
            )}
          </Dropdown>
          <div className="chatbot-heading-copy">
            <h3>{t("Questions? I’m here to help.")}</h3>
            <p>{t("Demo assistant · Predefined replies")}</p>
          </div>
        </header>
        <div
          ref={transcript}
          className="chatbot-transcript"
          role="log"
          aria-label={t("Assistant conversation")}
          aria-live="polite"
          aria-relevant="additions"
          tabIndex={0}
        >
          <ChatbotMessages messages={conversation.messages} />
          {conversation.messages.length === 1 && (
            <div
              className="chatbot-suggestions"
              role="group"
              aria-label={t("Suggested questions")}
            >
              {QUICK_ACTIONS.map(({ id, label, question }) => {
                const Icon = ACTION_ICONS[id];
                return (
                  <Button
                    key={id}
                    variant="outline"
                    onClick={() => send(question, { suggested: true })}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {t(label)}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
        <div className="chatbot-bottom">
          <form
            className="chatbot-composer"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              send(conversation.draft);
            }}
          >
            <Dropdown
              label="?"
              className="chatbot-actions chatbot-faq"
              triggerProps={{ "aria-label": t("Frequently asked questions") }}
            >
              {(close) => (
                <>
                  <p className="chatbot-actions-title">
                    {t("Frequently asked questions")}
                  </p>
                  {FAQ_ACTIONS.map(({ id, label, question }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={(event) =>
                        action(event, close, () =>
                          send(question, { suggested: true }),
                        )
                      }
                    >
                      {t(label)}
                    </button>
                  ))}
                </>
              )}
            </Dropdown>
            <Input
              ref={input}
              label={t("Your message")}
              placeholder={t("Compose your message…")}
              maxLength={MAX_MESSAGE_LENGTH}
              value={conversation.draft}
              helperText={t(
                "Use fictional details only. Do not share passwords, IDs or payment details.",
              )}
              error={t(conversation.error)}
              onChange={(event) =>
                setConversation((state) => ({
                  ...state,
                  draft: event.target.value,
                  error: "",
                }))
              }
            />
            <button
              type="submit"
              className="chatbot-send"
              aria-label={t("Send message")}
            >
              <SendHorizontal size={21} aria-hidden="true" />
            </button>
          </form>
          <span className="chatbot-sr-only" role="status">
            {t(conversation.error)}
          </span>
          <p id={`${panelId}-notice`} className="chatbot-notice">
            {t("Demo replies · Not a real AI service")}
          </p>
        </div>
      </Card>
      <button
        type="button"
        ref={launcher}
        className="chatbot-launcher"
        aria-label={t(
          conversation.open ? "Minimize assistant" : "Open assistant",
        )}
        aria-expanded={conversation.open}
        aria-controls={panelId}
        onClick={(event) => {
          if (conversation.open) minimize(event);
          else {
            capture(event);
            setConversation((state) => ({ ...state, open: true }));
          }
        }}
      >
        <X className="chatbot-launcher-close" size={23} aria-hidden="true" />
        <span className="chatbot-mascot" ref={mascot} aria-hidden="true">
          <AssistantCharacter
            key={conversation.accountId ?? "guest"}
            enabled={!conversation.open}
          />
        </span>
      </button>
    </aside>
  );
}
