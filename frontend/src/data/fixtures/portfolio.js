/** Portfolio fixture items; each row includes its own local imageSrc. */

import roboticsBrand from "../../assets/profiles/portfolio/robotics-brand.svg";
import startupSocial from "../../assets/profiles/portfolio/startup-social.svg";
import theatrePosters from "../../assets/profiles/portfolio/theatre-posters.svg";
import coffeePackaging from "../../assets/profiles/portfolio/coffee-packaging.svg";
import clubLanding from "../../assets/profiles/portfolio/club-landing.svg";
import eventDashboard from "../../assets/profiles/portfolio/event-dashboard.svg";

export const portfolioItems = [
  {
    id: "portfolio_001",
    studentId: "m5_sample_student_nour",
    title: "Robotics Club · Visual identity",
    category: "Branding",
    completedAt: "2026-09-01",
    monthLabel: "SEP 2026",
    summary:
      "A modular identity and brand kit built around movement, precision, and a shared ambition.",
    description:
      "Deliverables included a primary mark, secondary lockups, colour system, and a starter brand kit for club events and recruitment materials.",
    tools: ["Figma", "Illustrator"],
    imageSrc: roboticsBrand,
    imageAlt: "Robotics Club brand kit mockup",
  },
  {
    id: "portfolio_002",
    studentId: "m5_sample_student_nour",
    title: "Startup Showcase · Social campaign",
    category: "Digital Design",
    completedAt: "2026-08-01",
    monthLabel: "AUG 2026",
    summary:
      "A flexible set of social templates that puts student founders and their ideas in the spotlight.",
    description:
      "Instagram and story templates with editable type styles so the Entrepreneurship Club can reuse layouts across founder spotlights.",
    tools: ["Figma", "Photoshop"],
    imageSrc: startupSocial,
    imageAlt: "Startup showcase social campaign mockups",
  },
  {
    id: "portfolio_003",
    studentId: "m5_sample_student_nour",
    title: "Theatre Festival · Poster series",
    category: "Illustration",
    completedAt: "2026-07-01",
    monthLabel: "JUL 2026",
    summary:
      "Three illustrated posters translating student performances into one expressive visual language.",
    description:
      "A cohesive poster trio with shared illustration motifs, print-ready colour separations, and bilingual title treatments.",
    tools: ["Procreate", "Illustrator"],
    imageSrc: theatrePosters,
    imageAlt: "Theatre festival poster series",
  },
  {
    id: "portfolio_004",
    studentId: "m5_sample_student_nour",
    title: "Independent coffee · Packaging",
    category: "Packaging",
    completedAt: "2026-06-01",
    monthLabel: "JUN 2026",
    summary:
      "Two coffee labels and a packaging system balancing a warm, local story with clear product information.",
    description:
      "Front and back labels plus a small sleeve system with allergen and origin information kept readable at retail size.",
    tools: ["Illustrator", "InDesign"],
    imageSrc: coffeePackaging,
    imageAlt: "Independent coffee packaging design",
  },
  {
    id: "portfolio_005",
    studentId: "m5_sample_student_karim",
    title: "Robotics Club · Landing section",
    category: "Web Development",
    completedAt: "2026-05-01",
    monthLabel: "MAY 2026",
    summary:
      "A responsive landing section for club recruitment with clear CTAs and accessible markup.",
    description:
      "Built a reusable hero and feature grid for the Robotics Club site, including keyboard-friendly navigation and documented component props for the next maintainer.",
    tools: ["React", "Tailwind CSS"],
    imageSrc: clubLanding,
    imageAlt: "Club website landing section mockup",
  },
  {
    id: "portfolio_006",
    studentId: "m5_sample_student_karim",
    title: "Campus events · Ops dashboard",
    category: "UI Design",
    completedAt: "2026-04-12",
    monthLabel: "APR 2026",
    summary:
      "A compact dashboard UI for student organizers to track upcoming campus events.",
    description:
      "Wireframes and a React prototype covering sidebar navigation, summary cards, and an events table with fictional campus data only.",
    tools: ["Figma", "React"],
    imageSrc: eventDashboard,
    imageAlt: "Campus event dashboard UI mockup",
  },
];

export function getPortfolioItemsForStudent(studentId) {
  return portfolioItems.filter((item) => item.studentId === studentId);
}

export function getPortfolioItemById(itemId) {
  return portfolioItems.find((item) => item.id === itemId) ?? null;
}
