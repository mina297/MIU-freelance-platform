import { useLanguage } from "../../i18n/LanguageContext.js";
import { useEffect, useId, useRef, useState } from "react";
import {
  X,
  BriefcaseBusiness,
  FileText,
  Layers,
  ShieldCheck,
  CircleHelp,
  SendHorizontal,
  Info,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Card from "../../components/ui/Card.jsx";
import assistantCharacter from "./assets/miu-assistant-character.jpg";
import {
  createConversation,
  syncConversation,
  sendMessage,
  MAX_MESSAGE_LENGTH,
  SUGGESTED_QUESTIONS,
} from "./chatbotModel.js";
import "./chatbot.css";

export function ChatbotMessages({ messages }) {
  const { t } = useLanguage();

  return messages.map(({ id, author, text }) => (
    <div
      key={id}
      className={`chatbot-message chatbot-message--${author}${id === "welcome" ? " chatbot-message--welcome" : ""}`}
    >
      {author === "assistant" && (
        <span className="chatbot-message-avatar" aria-hidden="true">
          <img src={assistantCharacter} alt="" width="36" height="36" />
        </span>
      )}
      <div className="chatbot-message-content">
        <strong>
          {author === "user" ? t("You") : t("Simulated assistant")}
        </strong>
        <div className="chatbot-bubble">
          {id === "welcome" && (
            <h3>
              {t("A little guidance.")}
              <br />
              {t("A clearer next step.")}
            </h3>
          )}
          <p dir="auto">{author === "assistant" ? t(text) : text}</p>
        </div>
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
  const launcher = useRef(null);
  const input = useRef(null);
  const transcript = useRef(null);

  useEffect(() => {
    if (conversation.open) input.current?.focus();
  }, [conversation.open, conversation.accountId]);

  useEffect(() => {
    if (conversation.open && transcript.current)
      transcript.current.scrollTop = transcript.current.scrollHeight;
  }, [conversation.open, conversation.messages]);

  if (!conversation.accountId) return null;

  function minimize() {
    setConversation((state) => ({ ...state, open: false }));
    launcher.current?.focus();
  }
  function send(value) {
    setConversation((state) => sendMessage(state, value));
  }

  return (
    <aside
      className="chatbot-widget"
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
            minimize();
          }
        }}
      >
        <div className="chatbot-heading">
          <span className="chatbot-avatar" aria-hidden="true">
            <img src={assistantCharacter} alt="" width="64" height="64" />
          </span>
          <div className="chatbot-heading-copy">
            <p className="chatbot-eyebrow">{t("PROTOTYPE ASSISTANT")}</p>
            <h2 id={`${panelId}-title`}>{t("MIU Assistant")}</h2>
            <p className="chatbot-subtitle">
              <span className="chatbot-status-dot" aria-hidden="true" />
              {t("Ready to help · Simulated")}
            </p>
          </div>
          <Button
            variant="ghost"
            className="chatbot-minimize"
            aria-label={t("Minimize assistant")}
            onClick={minimize}
          >
            <X size={20} aria-hidden="true" />
          </Button>
        </div>
        <p id={`${panelId}-notice`} className="chatbot-notice">
          <Info size={16} aria-hidden="true" />
          <span>
            <strong>{t("Simulated responses")}</strong>{" "}
            {t("· Predefined guidance,")}
            <br className="chatbot-notice-break" />{" "}
            {t("not a real AI service.")}
          </span>
        </p>
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
        </div>
        <div className="chatbot-quick-start">
          <p className="chatbot-section-label">
            {t("Not sure where to start?")}
          </p>
          <div
            className="chatbot-suggestions"
            role="group"
            aria-label={t("Suggested questions")}
          >
            {SUGGESTED_QUESTIONS.map((question, index) => {
              const TopicIcon = [
                BriefcaseBusiness,
                FileText,
                Layers,
                ShieldCheck,
                CircleHelp,
              ][index];
              return (
                <Button
                  key={question}
                  variant="outline"
                  aria-label={t(question)}
                  onClick={() => send(question)}
                >
                  <TopicIcon size={18} aria-hidden="true" />
                  {t(
                    [
                      "Find projects",
                      "Proposals",
                      "Services & orders",
                      "Verification",
                      "Get help",
                    ][index],
                  )}
                </Button>
              );
            })}
          </div>
        </div>
        <form
          className="chatbot-composer"
          onSubmit={(event) => {
            event.preventDefault();
            send(conversation.draft);
          }}
          noValidate
        >
          <Input
            ref={input}
            label={t("Your message")}
            placeholder={t("Ask a question…")}
            value={conversation.draft}
            maxLength={MAX_MESSAGE_LENGTH}
            helperText={t(
              "Up to {value0} characters. Do not share passwords, IDs or payment details.",
              { value0: MAX_MESSAGE_LENGTH },
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
          <span className="chatbot-error-announcement" role="status">
            {t(conversation.error)}
          </span>
          <Button
            type="submit"
            className="chatbot-send"
            aria-label={t("Send message")}
          >
            <SendHorizontal size={19} aria-hidden="true" />
          </Button>
          <p className="chatbot-composer-meta">
            <span>{t("Enter to send · Temporary chat")}</span>
            <span aria-hidden="true">
              {conversation.draft.length}/{MAX_MESSAGE_LENGTH}
            </span>
          </p>
        </form>
      </Card>
      <Button
        ref={launcher}
        className="chatbot-launcher"
        aria-label={t(
          conversation.open ? t("Minimize assistant") : t("Open assistant"),
        )}
        title={t(
          conversation.open
            ? t("Minimize MIU Assistant")
            : t("Open MIU Assistant"),
        )}
        aria-expanded={conversation.open}
        aria-controls={panelId}
        onClick={() => {
          if (conversation.open) minimize();
          else setConversation((state) => ({ ...state, open: true }));
        }}
      >
        <span className="chatbot-launcher-icon" aria-hidden="true">
          <img src={assistantCharacter} alt="" width="76" height="76" />
        </span>
      </Button>
    </aside>
  );
}
