/**
 * Member 5 — Help Center & FAQ fixtures (Phase 1 mock data).
 */

export const helpCategories = [
  {
    id: "getting-started",
    label: "Getting started",
    description: "Accounts, roles, and first steps on the platform.",
  },
  {
    id: "projects-services",
    label: "Projects & services",
    description: "Posting work, proposals, and student services.",
  },
  {
    id: "payments",
    label: "Payments & escrow",
    description: "EGP payments, milestones, and simulated Phase 1 flows.",
  },
  {
    id: "reviews-profiles",
    label: "Profiles & reviews",
    description: "Public profiles, portfolios, and leaving feedback.",
  },
  {
    id: "safety",
    label: "Safety & support",
    description: "Reporting issues and contacting campus support.",
  },
];

export const helpArticles = [
  {
    slug: "create-your-profile",
    categoryId: "getting-started",
    title: "Create and complete your profile",
    summary:
      "Add a photo, bio, skills, and links so clients can understand your work.",
    body: [
      "Your public profile is how clients discover your skills. Keep your biography short, list concrete skills, and link only to portfolios you control.",
      "Phase 1 uses fictional demo data. Saving profile edits in this preview updates local browser state only — it is not a production account system.",
      "Students and clients have separate workflows. Use the role that matches how you participate on the platform.",
    ],
    tags: ["profile", "students", "clients"],
  },
  {
    slug: "how-reviews-work",
    categoryId: "reviews-profiles",
    title: "How reviews and ratings work",
    summary:
      "Clients can leave a review after a completed order. Ratings use a 1–5 star scale.",
    body: [
      "Reviews become available only for fictional completed orders in Phase 1 demos.",
      "A rating summary shows the average and a star breakdown on student profiles.",
      "Submitted reviews in this frontend are simulated and stored in local session state for the demo.",
    ],
    tags: ["reviews", "ratings"],
  },
  {
    slug: "egp-payments-overview",
    categoryId: "payments",
    title: "Payments are in EGP only",
    summary:
      "All prices and milestones on the platform use Egyptian pounds (EGP).",
    body: [
      "The platform currency is EGP. Do not expect multi-currency checkout in Phase 1.",
      "Escrow and live payment credentials are out of scope for this frontend demonstration.",
      "Amounts shown on completed jobs are mock figures for UI review.",
    ],
    tags: ["payments", "egp"],
  },
  {
    slug: "contacting-support",
    categoryId: "safety",
    title: "Contact campus support",
    summary:
      "Use the Contact Support form for account, payment, or safety questions.",
    body: [
      "Describe what happened, include relevant order or project IDs when you have them, and attach evidence screenshots if helpful.",
      "Phase 1 submissions are simulated. Committee ticket assignment is owned by other modules and is not implemented here.",
      "You will see a confirmation screen after a successful simulated submit.",
    ],
    tags: ["support", "help"],
  },
  {
    slug: "posting-a-project",
    categoryId: "projects-services",
    title: "Posting a project (overview)",
    summary:
      "Clients describe scope, budget in EGP, and timeline. Students send proposals.",
    body: [
      "Project posting UI is owned by other team members. This article explains the expected flow for Help Center completeness.",
      "Students respond with proposals; acceptance starts the project workflow.",
      "If project screens are not wired yet, use mock actions labeled as integration callbacks in Member 5 demos.",
    ],
    tags: ["projects", "clients"],
  },
];

export const faqItems = [
  {
    id: "faq_001",
    categoryId: "getting-started",
    question: "Who can use the MIU Freelance Platform?",
    answer:
      "MIU students can work as freelancers. Clients may be campus organizations or external hirers following platform rules. Committee accounts are created only by the Super Admin.",
  },
  {
    id: "faq_002",
    categoryId: "getting-started",
    question: "Can I register as a committee member publicly?",
    answer:
      "No. Public committee registration is forbidden. Committee accounts are provisioned by the Super Admin only.",
  },
  {
    id: "faq_003",
    categoryId: "payments",
    question: "Which currency does the platform use?",
    answer:
      "Egyptian pounds (EGP) only. All mock prices in Phase 1 are shown in EGP.",
  },
  {
    id: "faq_004",
    categoryId: "reviews-profiles",
    question: "When can I leave a review?",
    answer:
      "After a completed order between a client and student. In Phase 1, eligibility is based on fictional completed orders in the demo fixtures.",
  },
  {
    id: "faq_005",
    categoryId: "safety",
    question: "How do I report a problem?",
    answer:
      "Open Contact Support, choose a topic, describe the issue, and optionally attach evidence. Submission in this demo is simulated.",
  },
  {
    id: "faq_006",
    categoryId: "projects-services",
    question: "What is the difference between projects and services?",
    answer:
      "Clients post projects and receive proposals. Students can also publish services with packages and extras. Both modes are part of the platform scope.",
  },
];

export function getHelpArticleBySlug(slug) {
  return helpArticles.find((article) => article.slug === slug) ?? null;
}

export function searchHelpContent(query) {
  const q = String(query ?? "")
    .trim()
    .toLowerCase();
  if (!q) {
    return { articles: helpArticles, faqs: faqItems };
  }

  const articles = helpArticles.filter((article) => {
    const haystack = [
      article.title,
      article.summary,
      ...article.body,
      ...(article.tags ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });

  const faqs = faqItems.filter((faq) => {
    const haystack = `${faq.question} ${faq.answer}`.toLowerCase();
    return haystack.includes(q);
  });

  return { articles, faqs };
}
