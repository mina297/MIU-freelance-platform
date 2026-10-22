import {
  ORDER_SOURCE,
  ORDER_STATUS,
  PROJECT_STATUS,
  PROPOSAL_STATUS,
  SERVICE_STATUS,
} from "../../features/marketplace/constants.js";

// Fictional, deterministic Phase 1 examples. IDs are integration references;
// Member 1 owns accounts and Member 5 owns full profiles.
export const marketplaceParticipants = Object.freeze({
  clients: [{ id: "client_001", displayName: "Nile Studio" }],
  students: [
    { id: "student_001", displayName: "Salma Farid" },
    { id: "student_002", displayName: "Omar Nabil" },
  ],
});

export const marketplaceCategories = Object.freeze([
  { id: "web_development", label: "Web Development" },
  { id: "graphic_design", label: "Graphic Design" },
  { id: "writing", label: "Writing & Content" },
]);

export const marketplaceSkills = Object.freeze([
  { id: "react", label: "React" },
  { id: "responsive_design", label: "Responsive Design" },
  { id: "figma", label: "Figma" },
  { id: "content_writing", label: "Content Writing" },
]);

/** @type {import('../contracts.js').Project[]} */
export const projects = [
  {
    id: "project_001",
    clientId: "client_001",
    title: "Build a responsive event website",
    description: "Create an accessible event website with a schedule and registration information.",
    categoryId: "web_development",
    requiredSkillIds: ["react", "responsive_design"],
    budgetEGP: 6000,
    deadline: "2026-12-15",
    status: PROJECT_STATUS.OPEN,
    createdAt: "2026-10-20T09:00:00Z",
    updatedAt: "2026-10-20T09:00:00Z",
  },
  {
    id: "project_002",
    clientId: "client_001",
    title: "Design an event identity",
    description: "Provide a visual identity and editable social media assets for a student event.",
    categoryId: "graphic_design",
    requiredSkillIds: ["figma"],
    budgetEGP: 3500,
    deadline: "2026-11-30",
    status: PROJECT_STATUS.SELECTED,
    createdAt: "2026-10-10T10:00:00Z",
    updatedAt: "2026-10-16T13:00:00Z",
  },
  {
    id: "project_003", clientId: "client_001", title: "Create a student club brand kit",
    description: "Design a visual identity, event poster template, and social media graphics.",
    categoryId: "graphic_design", requiredSkillIds: ["figma"], budgetEGP: 2800,
    deadline: "2026-12-05", status: PROJECT_STATUS.OPEN,
    createdAt: "2026-10-19T12:00:00Z", updatedAt: "2026-10-19T12:00:00Z",
  },
  {
    id: "project_004", clientId: "client_001", title: "Write articles for a campus initiative",
    description: "Research and write four clear articles about student entrepreneurship.",
    categoryId: "writing", requiredSkillIds: ["content_writing"], budgetEGP: 2200,
    deadline: "2026-11-25", status: PROJECT_STATUS.OPEN,
    createdAt: "2026-10-18T10:00:00Z", updatedAt: "2026-10-18T10:00:00Z",
  },
  {
    id: "project_005", clientId: "client_001", title: "Refresh a small business website",
    description: "Improve the layout and mobile experience of an existing five-page website.",
    categoryId: "web_development", requiredSkillIds: ["react", "responsive_design"], budgetEGP: 7500,
    deadline: "2027-01-10", status: PROJECT_STATUS.OPEN,
    createdAt: "2026-10-17T14:00:00Z", updatedAt: "2026-10-17T14:00:00Z",
  },
];

/** @type {import('../contracts.js').Proposal[]} */
export const proposals = [
  {
    id: "proposal_001",
    projectId: "project_001",
    studentId: "student_001",
    priceEGP: 5700,
    deliveryDays: 20,
    coverMessage: "I will build the site with accessible navigation and responsive layouts.",
    attachmentIds: [],
    status: PROPOSAL_STATUS.SUBMITTED,
    submittedAt: "2026-10-21T08:30:00Z",
    updatedAt: "2026-10-21T08:30:00Z",
  },
  {
    id: "proposal_002",
    projectId: "project_002",
    studentId: "student_002",
    priceEGP: 3200,
    deliveryDays: 12,
    coverMessage: "I will provide a cohesive identity and editable templates.",
    attachmentIds: [],
    status: PROPOSAL_STATUS.ACCEPTED,
    submittedAt: "2026-10-12T11:00:00Z",
    updatedAt: "2026-10-16T13:00:00Z",
  },
];

/** @type {import('../contracts.js').Service[]} */
export const services = [
  {
    id: "service_001",
    studentId: "student_001",
    title: "Responsive landing page design",
    description: "A clear landing page design prepared for desktop and mobile screens.",
    categoryId: "graphic_design",
    skillIds: ["figma", "responsive_design"],
    portfolioItemIds: [],
    status: SERVICE_STATUS.PUBLISHED,
    createdAt: "2026-10-11T09:00:00Z",
    updatedAt: "2026-10-11T09:00:00Z",
  },
];

/** @type {import('../contracts.js').ServicePackage[]} */
export const servicePackages = [
  {
    id: "package_001",
    serviceId: "service_001",
    name: "Landing page",
    description: "One landing page design with desktop and mobile layouts.",
    includedFeatures: ["Desktop layout", "Mobile layout"],
    priceEGP: 1800,
    deliveryDays: 7,
  },
];

/** @type {import('../contracts.js').ServiceExtra[]} */
export const serviceExtras = [
  {
    id: "extra_001",
    serviceId: "service_001",
    title: "Additional section",
    description: "Design one additional page section.",
    additionalPriceEGP: 400,
    additionalDays: 2,
  },
];

/** @type {import('../contracts.js').Order[]} */
export const orders = [
  {
    id: "order_001",
    sourceType: ORDER_SOURCE.PROJECT,
    sourceId: "project_002",
    proposalId: "proposal_002",
    servicePackageId: null,
    serviceExtraIds: [],
    clientId: "client_001",
    studentId: "student_002",
    agreedAmountEGP: 3200,
    status: ORDER_STATUS.IN_PROGRESS,
    createdAt: "2026-10-16T13:00:00Z",
    completedAt: null,
  },
  {
    id: "order_002",
    sourceType: ORDER_SOURCE.SERVICE,
    sourceId: "service_001",
    proposalId: null,
    servicePackageId: "package_001",
    serviceExtraIds: ["extra_001"],
    clientId: "client_001",
    studentId: "student_001",
    agreedAmountEGP: 2200,
    status: ORDER_STATUS.AWAITING_PAYMENT,
    createdAt: "2026-10-21T14:00:00Z",
    completedAt: null,
  },
];

export const marketplaceData = Object.freeze({
  participants: marketplaceParticipants,
  categories: marketplaceCategories,
  skills: marketplaceSkills,
  projects,
  proposals,
  services,
  servicePackages,
  serviceExtras,
  orders,
});
