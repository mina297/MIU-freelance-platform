import { isActiveUser } from "../auth/session.js";

export const MAX_MESSAGE_LENGTH = 500;
export const WELCOME_MESSAGE = "Hi 👋 How can I help you with MIU Freelance?";
export const FALLBACK_REPLY =
  "I only have predefined guidance about projects, proposals, services, orders, verification and navigation. Try a suggested question or visit How it works for general guidance. I cannot contact support or resolve an individual account issue.";

export const SUGGESTED_QUESTIONS = Object.freeze([
  "How do I find projects?",
  "How do proposals work?",
  "Where can I browse services and orders?",
  "How does verification work?",
  "Where can I find help?",
]);

export const QUICK_ACTIONS = Object.freeze([
  {
    id: "about",
    label: "About the platform",
    question: "What is MIU Freelance?",
    text: "MIU Freelance connects student freelancers with clients. Clients can post projects and receive proposals, or order services published by students. Prices are in EGP. This is a frontend demonstration; payments, verification and assistant replies are simulated. You can explore public listings without an account.",
    links: [{ label: "About the platform", to: "/about" }],
  },
  {
    id: "how",
    label: "How it works",
    question: "How does MIU Freelance work?",
    text: "There are two ways to work together: a client posts a project and students send proposals, or a student publishes a service and a client chooses a package. You can browse first, then register as a Student Freelancer or Client for account actions. Committee accounts are created only by the Super Admin.",
    links: [{ label: "How it works", to: "/how-it-works" }],
  },
  {
    id: "work",
    label: "Find work",
    question: "I want to find work",
    text: "As a student, you can browse projects and submit proposals, or publish your own services and packages. Explore projects first, then sign up as a Student Freelancer. Restricted actions require the relevant account and verification steps; this assistant cannot apply or verify you.",
    links: [
      { label: "Browse projects", to: "/projects" },
      { label: "Create an account", to: "/register/role" },
    ],
  },
  {
    id: "hire",
    label: "Hire talent",
    question: "I want to hire talent",
    text: "As a client, you can post a project and compare student proposals, or browse services and choose a package. Explore services or student profiles without signing in. Register as a Client to start eligible account workflows. Payments and escrow are simulated in this demonstration.",
    links: [
      { label: "Browse services", to: "/services" },
      { label: "Find talent", to: "/freelancers" },
    ],
  },
]);

export const GUIDANCE_ROUTES = new Set(
  QUICK_ACTIONS.flatMap(({ links }) => links.map(({ to }) => to)),
);

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
  const action = QUICK_ACTIONS.find(
    ({ question }) => question.toLowerCase() === value.trim().toLowerCase(),
  );
  if (action)
    return { topic: action.id, text: action.text, links: action.links };
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
    collapsed: false,
    draft: "",
    error: "",
    messages: [{ id: "welcome", author: "assistant", text: WELCOME_MESSAGE }],
    nextId: 1,
  };
}

// Reconcile before rendering so an account transition cannot expose old text.
// Guests receive public guidance; crossing an account boundary clears all text.
export function syncConversation(state, session) {
  const accountId =
    session?.status === "authenticated" && isActiveUser(session.user)
      ? session.user.id
      : null;
  return state.accountId === accountId ? state : createConversation(accountId);
}

export function sendMessage(state, value) {
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
        ...(reply.links ? { links: reply.links } : {}),
      },
    ],
  };
}
