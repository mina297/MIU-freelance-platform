// Fictional Figma display records; these do not change marketplace contracts.
export const clientActivity = [
  {
    id: "client_activity_delivery",
    text: "Salma submitted the competition launch visuals for review.",
    date: "2026-10-11",
  },
  {
    id: "client_activity_proposals",
    text: "Three new applicants responded to your open projects.",
    date: "2026-10-10",
  },
  {
    id: "client_activity_completed",
    text: "Recruitment campaign visual kit completed. Review pending.",
    date: "2026-10-08",
  },
];

export const clientJobs = [
  {
    id: "client_brand",
    title: "Brand identity for the MIU Robotics Club",
    budget: 7500,
    status: "Open",
    applicants: 6,
    newApplicants: 2,
    deadline: "2026-10-14",
  },
  {
    id: "client_posters",
    title: "Robotics outreach workshop posters",
    budget: 2500,
    status: "Open",
    applicants: 4,
    newApplicants: 1,
    deadline: "2026-10-20",
  },
  {
    id: "client_launch",
    title: "Competition launch visuals",
    budget: 3500,
    status: "In progress",
    applicants: 5,
    student: "Salma Ahmed",
    deadline: "2026-10-12",
  },
  {
    id: "client_recruitment",
    title: "Recruitment campaign visual kit",
    budget: 4000,
    status: "Completed",
    applicants: 8,
    student: "Nour El-Sayed",
    deadline: "2026-10-08",
    completedOn: "2026-10-08",
  },
];

export function selectClientJobs(jobs, query = "", status = "All") {
  return jobs.filter(
    (job) =>
      (status === "All" || job.status === status) &&
      job.title.toLowerCase().includes(query.trim().toLowerCase()),
  );
}

export function clientMetrics(jobs, empty = false) {
  return {
    open: jobs.filter((job) => job.status === "Open").length,
    applicants: jobs
      .filter((job) => job.status === "Open")
      .reduce((sum, job) => sum + job.newApplicants, 0),
    active: jobs.filter((job) => job.status === "In progress").length,
    // The design supplies an all-time aggregate of 18, with one detailed record.
    completed: empty
      ? 0
      : 18 +
        (jobs.find((job) => job.id === "client_launch")?.status === "Completed"
          ? 1
          : 0),
  };
}
