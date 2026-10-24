// Labels come from the approved landing frames or documented public pages.
// Destinations are supplied by the route owner; these are not registered routes.
export const PRIMARY_LINKS = [
  { key: "projects", label: "Browse Jobs" },
  { key: "howItWorks", label: "How it Works" },
];

// Services and About are documented public destinations absent from the landing
// header specimen. Keep both marketplace models discoverable on desktop too.
export const DESKTOP_LINKS = [
  ...PRIMARY_LINKS,
  { key: "services", label: "Services" },
  { key: "about", label: "About" },
];

export const MENU_LINKS = [
  ...PRIMARY_LINKS,
  { key: "services", label: "Services" },
  { key: "freelancers", label: "Find Talent" },
  { key: "recommendations", label: "Skills Matching" },
  { key: "about", label: "About" },
  { key: "help", label: "Help Center" },
  { key: "contact", label: "Contact Us" },
  { key: "privacy", label: "Privacy" },
  { key: "terms", label: "Terms" },
];

export const FOOTER_GROUPS = [
  {
    title: "Marketplace",
    links: [
      PRIMARY_LINKS[0],
      { key: "freelancers", label: "Find Talent" },
      { key: "recommendations", label: "Skills Matching" },
      PRIMARY_LINKS[1],
    ],
  },
  {
    title: "Support",
    links: [
      { key: "safety", label: "Safety & Trust" },
      { key: "help", label: "Help Center" },
      { key: "contact", label: "Contact Us" },
    ],
  },
];

export const LEGAL_LINKS = [
  { key: "privacy", label: "Privacy" },
  { key: "terms", label: "Terms" },
  { key: "communityGuidelines", label: "Community Guidelines" },
];
