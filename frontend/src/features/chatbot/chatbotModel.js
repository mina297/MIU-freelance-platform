import { isActiveUser } from "../auth/session.js";

export const MAX_MESSAGE_LENGTH = 500;
export const WELCOME_MESSAGE =
  "Welcome! I can offer simulated guidance about projects, proposals, services, orders and verification. I cannot access your account records or perform actions. Please use fictional, non-sensitive details only.";
export const FALLBACK_REPLY =
  "I only have predefined guidance about projects, proposals, services, orders, verification and navigation. Try a suggested question or visit How it works for general guidance. I cannot contact support or resolve an individual account issue.";

export const SUGGESTED_QUESTIONS = Object.freeze([
  "How do I find projects?",
  "How do proposals work?",
  "Where can I browse services and orders?",
  "How does verification work?",
  "Where can I find help?",
]);

// First matching whole-word topic/phrase wins in this explicit order. Generic
// "work"/"browse" alone are not project signals; "find work" is explicit intent.
// Matching is case-insensitive; no inference, network request or account lookup occurs.
const TOPICS = [
  {
    id: "verification",
    pattern:
      /\b(verification|verify|identity|account|(?:sign|log)(?:\s+|-)?in|password|access)\b/i,
    reply:
      "Verification and account access are separate. Students use MIU ID; external clients use government ID in the planned verification flow. Phase 1 verification is simulated. I cannot inspect identity evidence, approve verification or change your account. Use the account forms for sign-in or recovery; never share passwords or ID details here.",
  },
  {
    id: "proposals",
    pattern: /\b(proposal|proposals|apply|application|bid)\b/i,
    reply:
      "Students browse open projects, read the brief and submit an eligible proposal with an EGP price, delivery time and cover message. Clients review and compare proposals before selecting one. Eligibility and current project status are checked by the proposal workflow. I cannot submit, accept or withdraw a proposal for you.",
  },
  {
    id: "services",
    pattern:
      /\b(service|services|order|orders|package|packages|extras|delivery)\b/i,
    reply:
      "Browse Services to compare student-published services, packages and permitted extras in EGP. Clients use the service ordering flow; students manage their own services. Your role's order pages show your project and service orders. Payments and escrow are Phase 1 simulations. I cannot create an order, inspect order/payment status or release funds.",
  },
  {
    id: "projects",
    pattern: /\b(projects?|jobs?|find(?:ing)?\s+work)\b/i,
    reply:
      "Open the Projects catalogue to browse and filter client-posted work. Read a project's scope, skills, EGP budget and current status before deciding to propose. Students submit proposals and clients publish projects through their own workflows. I cannot publish a project or apply for you.",
  },
  {
    id: "navigation",
    pattern:
      /\b(help|support|navigate|navigation|platform|hello|hi|workspace)\b/i,
    reply:
      "Use Hire Talent and Find Work in the landing header for marketplace entry points, or My workspace for your role's workspace. How it works explains both project/proposal and service/order journeys. Live support contact and escalation are not connected to this assistant; no support request is sent from this chat.",
  },
];

export function validateMessage(value) {
  if (typeof value !== "string" || !value.trim())
    return "Enter a message or choose a suggested question.";
  if (value.length > MAX_MESSAGE_LENGTH)
    return `Use ${MAX_MESSAGE_LENGTH} characters or fewer.`;
  return "";
}

export function getChatbotReply(value) {
  const error = validateMessage(value);
  if (error) return { error };
  const topic = TOPICS.find(({ pattern }) => pattern.test(value.trim()));
  return {
    topic: topic?.id ?? "fallback",
    text: topic?.reply ?? FALLBACK_REPLY,
  };
}

export function createConversation(accountId = null) {
  return {
    accountId,
    open: false,
    draft: "",
    error: "",
    messages: [{ id: "welcome", author: "assistant", text: WELCOME_MESSAGE }],
    nextId: 1,
  };
}

// Reconcile before rendering so an account transition cannot expose old text.
// Anonymous/expired/inactive sessions always discard the previous conversation.
export function syncConversation(state, session) {
  const accountId =
    session.status === "authenticated" && isActiveUser(session.user)
      ? session.user.id
      : null;
  return state.accountId === accountId ? state : createConversation(accountId);
}

export function sendMessage(state, value) {
  if (!state.accountId) return state;
  const reply = getChatbotReply(value);
  if (reply.error) return { ...state, error: reply.error };
  return {
    ...state,
    draft: "",
    error: "",
    nextId: state.nextId + 2,
    messages: [
      ...state.messages,
      { id: `message-${state.nextId}`, author: "user", text: value.trim() },
      {
        id: `message-${state.nextId + 1}`,
        author: "assistant",
        text: reply.text,
      },
    ],
  };
}
