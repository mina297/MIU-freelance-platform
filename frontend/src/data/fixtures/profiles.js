/**
 * Member 5 — Profile fixtures (Phase 1 mock data).
 * Stable IDs for cross-module references. Fictional identities only.
 */

import nourAvatar from "../../assets/profiles/nour-elsayed.png";

export const STUDENT_PROFILE_IDS = {
  NOUR: "student_001",
  KARIM: "student_002",
};

export const CLIENT_PROFILE_IDS = {
  ROBOTICS_CLUB: "client_001",
  STARTUP_LAB: "client_002",
};

/** @typedef {'student' | 'client'} ProfileRole */

/**
 * @typedef {Object} ProfileLink
 * @property {string} id
 * @property {'github' | 'linkedin' | 'portfolio' | 'website'} type
 * @property {string} label
 * @property {string} urlDisplay
 */

/**
 * @typedef {Object} RatingSummary
 * @property {number} average
 * @property {number} count
 * @property {{ stars: number, count: number }[]} distribution
 */

/**
 * @typedef {Object} StudentProfile
 * @property {string} id
 * @property {'student'} role
 * @property {string} displayName
 * @property {string} firstName
 * @property {string} headline
 * @property {string} fieldOfStudy
 * @property {string} yearLabel
 * @property {string} shortBio
 * @property {string[]} aboutParagraphs
 * @property {string[]} skills
 * @property {string} availability
 * @property {number | null} rateEGP
 * @property {string} location
 * @property {string[]} languages
 * @property {boolean} verified
 * @property {string} communityNote
 * @property {string} profileImage
 * @property {string} profileImageAlt
 * @property {ProfileLink[]} links
 * @property {RatingSummary} ratingSummary
 * @property {number} completedJobsCount
 * @property {string[]} portfolioItemIds
 * @property {string[]} completedProjectIds
 */

/**
 * @typedef {Object} ClientProfile
 * @property {string} id
 * @property {'client'} role
 * @property {string} displayName
 * @property {string} organizationName
 * @property {string} headline
 * @property {string} shortBio
 * @property {string[]} aboutParagraphs
 * @property {string} location
 * @property {boolean} verified
 * @property {string | null} profileImage
 * @property {string} profileImageAlt
 * @property {ProfileLink[]} links
 * @property {string[]} projectHistoryIds
 */

/** @type {StudentProfile[]} */
export const studentProfiles = [
  {
    id: STUDENT_PROFILE_IDS.NOUR,
    role: "student",
    displayName: "Nour El-Sayed",
    firstName: "Nour",
    headline: "Graphic Design • Year 4",
    fieldOfStudy: "Graphic Design",
    yearLabel: "Year 4",
    shortBio:
      "I create thoughtful brand identities, illustrations, and digital experiences for the MIU community. Clear ideas, considered details, and work that tells your story.",
    aboutParagraphs: [
      "I'm a fourth-year Graphic Design student at MIU, with a focus on branding and visual storytelling. I enjoy helping campus clubs, departments, and alumni turn a good idea into a clear, memorable identity.",
      "From the first moodboard to the final handoff, I keep the process collaborative and the details intentional. You can expect clear communication, useful progress updates, and organized, editable files.",
    ],
    skills: ["Branding", "Figma", "Illustration"],
    availability: "Open to new projects",
    rateEGP: 450,
    location: "Cairo, Egypt",
    languages: ["Arabic", "English"],
    verified: true,
    communityNote:
      "Verified MIU student. Reviews are shared by clients after completed projects.",
    profileImage: nourAvatar,
    profileImageAlt: "Portrait of Nour El-Sayed",
    links: [
      {
        id: "link_nour_github",
        type: "github",
        label: "GitHub",
        urlDisplay: "github.com/nour-design-demo",
        href: "https://github.com/nour-design-demo",
      },
      {
        id: "link_nour_linkedin",
        type: "linkedin",
        label: "LinkedIn",
        urlDisplay: "linkedin.com/in/nour-elsayed-demo",
        href: "https://www.linkedin.com/in/nour-elsayed-demo",
      },
      {
        id: "link_nour_portfolio",
        type: "portfolio",
        label: "Portfolio",
        urlDisplay: "nour-design.example",
        href: "https://nour-design.example",
      },
    ],
    ratingSummary: {
      average: 4.9,
      count: 32,
      distribution: [
        { stars: 5, count: 29 },
        { stars: 4, count: 3 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
      ],
    },
    completedJobsCount: 32,
    portfolioItemIds: [
      "portfolio_001",
      "portfolio_002",
      "portfolio_003",
      "portfolio_004",
    ],
    completedProjectIds: [
      "completed_001",
      "completed_002",
      "completed_003",
      "completed_004",
    ],
  },
  {
    id: STUDENT_PROFILE_IDS.KARIM,
    role: "student",
    displayName: "Karim Hassan",
    firstName: "Karim",
    headline: "Computer Science • Year 3",
    fieldOfStudy: "Computer Science",
    yearLabel: "Year 3",
    shortBio:
      "I build clean web interfaces and small full-stack tools for student clubs and local clients.",
    aboutParagraphs: [
      "I'm a third-year Computer Science student focused on front-end engineering and accessible UI.",
      "I prefer clear requirements, iterative demos, and well-documented handoffs.",
    ],
    skills: ["React", "JavaScript", "Tailwind CSS", "Node.js"],
    availability: "Limited availability this month",
    rateEGP: 350,
    location: "Cairo, Egypt",
    languages: ["Arabic", "English"],
    verified: true,
    communityNote:
      "Verified MIU student. Reviews are shared by clients after completed projects.",
    profileImage: "",
    profileImageAlt: "Placeholder avatar for Karim Hassan",
    links: [
      {
        id: "link_karim_github",
        type: "github",
        label: "GitHub",
        urlDisplay: "github.com/karim-hassan-demo",
        href: "https://github.com/karim-hassan-demo",
      },
      {
        id: "link_karim_portfolio",
        type: "portfolio",
        label: "Portfolio",
        urlDisplay: "karim-ui.example",
        href: "https://karim-ui.example",
      },
    ],
    ratingSummary: {
      average: 4.7,
      count: 11,
      distribution: [
        { stars: 5, count: 8 },
        { stars: 4, count: 2 },
        { stars: 3, count: 1 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
      ],
    },
    completedJobsCount: 11,
    portfolioItemIds: ["portfolio_005", "portfolio_006"],
    completedProjectIds: ["completed_005", "completed_006"],
  },
];

/** @type {ClientProfile[]} */
export const clientProfiles = [
  {
    id: CLIENT_PROFILE_IDS.ROBOTICS_CLUB,
    role: "client",
    displayName: "Ahmed Farouk",
    organizationName: "MIU Robotics Club",
    headline: "Student organization • Campus client",
    shortBio:
      "We hire student freelancers for branding, event visuals, and club communication materials.",
    aboutParagraphs: [
      "The MIU Robotics Club posts design and content projects for competitions, workshops, and recruitment campaigns.",
    ],
    location: "Cairo, Egypt",
    verified: true,
    profileImage: null,
    profileImageAlt: "MIU Robotics Club placeholder",
    links: [],
    projectHistoryIds: ["completed_001"],
  },
  {
    id: CLIENT_PROFILE_IDS.STARTUP_LAB,
    role: "client",
    displayName: "Salma Mostafa",
    organizationName: "MIU Entrepreneurship Club",
    headline: "Campus entrepreneurship community",
    shortBio:
      "We collaborate with student designers and developers on showcase events and founder storytelling.",
    aboutParagraphs: [
      "Our club supports student founders with visual identity, pitch decks, and digital campaign assets.",
    ],
    location: "Cairo, Egypt",
    verified: true,
    profileImage: null,
    profileImageAlt: "MIU Entrepreneurship Club placeholder",
    links: [],
    projectHistoryIds: ["completed_002"],
  },
];
