// Fictional, landing-only Figma examples; these are not marketplace records.
export const landingJobs = [
  {
    id: "landing-brand",
    title: "Brand identity for the MIU Robotics Club",
    client: "MIU Robotics Club",
    rating: "4.9",
    description:
      "Create a confident visual identity, social templates, and a concise brand kit for the club’s upcoming competition season.",
    skills: ["Brand Design", "Illustrator", "Social Media"],
    category: "Design",
    budget: 7500,
    deadline: "14 Oct 2026",
    applicants: 6,
    posted: "Posted 2 hours ago",
  },
  {
    id: "landing-web",
    title: "Front-end developer for alumni event site",
    client: "MIU Alumni Office",
    rating: "5.0",
    description:
      "Build a responsive event microsite from approved Figma screens, including registration and speaker schedule pages.",
    skills: ["React", "TypeScript", "Responsive UI"],
    category: "Development",
    budget: 12000,
    deadline: "21 Oct 2026",
    applicants: 11,
    posted: "Posted yesterday",
  },
  {
    id: "landing-copy",
    title: "Arabic–English copy for admissions campaign",
    client: "MIU Admissions",
    rating: "4.8",
    description:
      "Translate and refine campaign copy for landing pages and social posts while preserving a warm, professional tone.",
    skills: ["Translation", "Copywriting", "Arabic"],
    category: "Translation",
    budget: 4800,
    deadline: "10 Oct 2026",
    applicants: 4,
    posted: "Posted 3 hours ago",
  },
];

export const landingStudents = [
  {
    id: "landing-nour",
    categories: ["Design"],
    name: "Nour El-Sayed",
    study: "Graphic Design • Year 4",
    rating: "4.9",
    reviews: 32,
    skills: ["Branding", "Figma", "Illustration"],
    image: "38690.png",
  },
  {
    id: "landing-omar",
    categories: ["Development"],
    name: "Omar Hassan",
    study: "Computer Science • Year 3",
    rating: "5.0",
    reviews: 27,
    skills: ["React", "Node.js", "UI Engineering"],
    image: "498ec.png",
  },
  {
    id: "landing-mariam",
    categories: ["Writing", "Translation", "Marketing"],
    name: "Mariam Adel",
    study: "Mass Communication • Year 4",
    rating: "4.9",
    reviews: 41,
    skills: ["Copywriting", "SEO", "Arabic"],
    image: "a05ba.png",
  },
];

export const landingCategories = [
  "Design",
  "Development",
  "Writing",
  "Translation",
  "Marketing",
  "Video",
  "Tutoring",
];

export function filterLandingJobs(query, category) {
  const term = query.trim().toLocaleLowerCase();
  return landingJobs.filter(
    (job) =>
      (!category || job.category === category) &&
      [job.title, job.client, job.description, ...job.skills]
        .join(" ")
        .toLocaleLowerCase()
        .includes(term),
  );
}

export function filterLandingStudents(query, category) {
  const term = query.trim().toLocaleLowerCase();
  return landingStudents.filter(
    (student) =>
      (!category || student.categories.includes(category)) &&
      [student.name, student.study, ...student.skills]
        .join(" ")
        .toLocaleLowerCase()
        .includes(term),
  );
}
