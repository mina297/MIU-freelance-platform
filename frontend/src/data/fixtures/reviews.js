/**
 * Member 5 — Review fixtures (Phase 1 mock data).
 * Summaries power ProfileHeader and AtAGlance; full list is for later Reviews stage.
 */

export const reviews = [
  {
    id: "review_001",
    targetStudentId: "m5_sample_student_nour",
    reviewerClientId: "m5_sample_client_robotics",
    reviewerName: "Ahmed Farouk",
    reviewerOrganization: "MIU Robotics Club",
    reviewerInitials: "AF",
    rating: 5,
    createdAt: "2026-09-28",
    body: "Nour translated our rough ideas into a confident identity that feels like our team. The brand kit was beautifully organized, and every file was ready to use. A great collaborator from start to finish.",
    jobLabel: "Brand identity for the MIU Robotics Club",
    relatedOrderId: "m5_sample_order_001",
    relatedCompletedProjectId: "completed_001",
  },
  {
    id: "review_002",
    targetStudentId: "m5_sample_student_nour",
    reviewerClientId: "m5_sample_client_startup",
    reviewerName: "Salma Mostafa",
    reviewerOrganization: "MIU Entrepreneurship Club",
    reviewerInitials: "SM",
    rating: 5,
    createdAt: "2026-08-21",
    body: "The templates made our showcase campaign feel instantly more cohesive. Nour listened carefully, kept us updated, and delivered flexible layouts that our team could edit without help.",
    jobLabel: "Social templates for the Entrepreneurship Club",
    relatedOrderId: "m5_sample_order_002",
    relatedCompletedProjectId: "completed_002",
  },
  {
    id: "review_003",
    targetStudentId: "m5_sample_student_nour",
    reviewerClientId: "m5_sample_client_robotics",
    reviewerName: "Youssef Adel",
    reviewerOrganization: "MIU Arts Society",
    reviewerInitials: "YA",
    rating: 4,
    createdAt: "2026-07-16",
    body: "A distinctive poster series with lovely illustration work. We needed one extra round to refine the print typography, but Nour handled the feedback well and the final posters looked excellent.",
    jobLabel: "Poster series for the MIU Theatre Festival",
    relatedOrderId: "m5_sample_order_003",
    relatedCompletedProjectId: "completed_003",
  },
  {
    id: "review_004",
    targetStudentId: "m5_sample_student_nour",
    reviewerClientId: "m5_sample_client_startup",
    reviewerName: "Omar Hassan",
    reviewerOrganization: "MIU Alumnus",
    reviewerInitials: "OH",
    rating: 5,
    createdAt: "2026-06-12",
    body: "Thoughtful design, clear communication, and an excellent final handoff. Nour brought warmth to our packaging while keeping the product information easy to read. I would happily work with her again.",
    jobLabel: "Packaging design for an alumni coffee brand",
    relatedOrderId: "m5_sample_order_004",
    relatedCompletedProjectId: "completed_004",
  },
  {
    id: "review_005",
    targetStudentId: "m5_sample_student_karim",
    reviewerClientId: "m5_sample_client_robotics",
    reviewerName: "Ahmed Farouk",
    reviewerOrganization: "MIU Robotics Club",
    reviewerInitials: "AF",
    rating: 5,
    createdAt: "2026-05-10",
    body: "Karim delivered a clean, accessible landing section on schedule. The handoff notes made it easy for our volunteer developers to continue iterating.",
    jobLabel: "Club website landing section",
    relatedOrderId: "m5_sample_order_006",
    relatedCompletedProjectId: "completed_005",
  },
  {
    id: "review_006",
    targetStudentId: "m5_sample_student_karim",
    reviewerClientId: "m5_sample_client_startup",
    reviewerName: "Salma Mostafa",
    reviewerOrganization: "MIU Entrepreneurship Club",
    reviewerInitials: "SM",
    rating: 4,
    createdAt: "2026-04-20",
    body: "Solid dashboard prototype with thoughtful empty states. We asked for one layout tweak and Karim turned it around quickly.",
    jobLabel: "Campus events operations dashboard",
    relatedOrderId: "m5_sample_order_007",
    relatedCompletedProjectId: "completed_006",
  },
];

export const completedProjects = [
  {
    id: "completed_001",
    studentId: "m5_sample_student_nour",
    clientId: "m5_sample_client_robotics",
    title: "Brand identity for the MIU Robotics Club",
    category: "Branding",
    completedAt: "2026-09-20",
    amountEGP: 3200,
  },
  {
    id: "completed_002",
    studentId: "m5_sample_student_nour",
    clientId: "m5_sample_client_startup",
    title: "Social templates for the Entrepreneurship Club",
    category: "Digital Design",
    completedAt: "2026-08-15",
    amountEGP: 2800,
  },
  {
    id: "completed_003",
    studentId: "m5_sample_student_nour",
    clientId: "m5_sample_client_robotics",
    title: "Poster series for the MIU Theatre Festival",
    category: "Illustration",
    completedAt: "2026-07-10",
    amountEGP: 2400,
  },
  {
    id: "completed_004",
    studentId: "m5_sample_student_nour",
    clientId: "m5_sample_client_startup",
    title: "Packaging design for an alumni coffee brand",
    category: "Packaging",
    completedAt: "2026-06-08",
    amountEGP: 3500,
  },
  {
    id: "completed_005",
    studentId: "m5_sample_student_karim",
    clientId: "m5_sample_client_robotics",
    title: "Club website landing section",
    category: "Web Development",
    completedAt: "2026-05-02",
    amountEGP: 4000,
  },
  {
    id: "completed_006",
    studentId: "m5_sample_student_karim",
    clientId: "m5_sample_client_startup",
    title: "Campus events operations dashboard",
    category: "UI Design",
    completedAt: "2026-04-18",
    amountEGP: 3600,
  },
];

/** Fictional completed orders used for review eligibility (Phase 1). */
export const completedOrders = [
  {
    id: "m5_sample_order_001",
    studentId: "m5_sample_student_nour",
    clientId: "m5_sample_client_robotics",
    title: "Brand identity for the MIU Robotics Club",
    completedAt: "2026-09-20",
    hasReview: true,
  },
  {
    id: "m5_sample_order_002",
    studentId: "m5_sample_student_nour",
    clientId: "m5_sample_client_startup",
    title: "Social templates for the Entrepreneurship Club",
    completedAt: "2026-08-15",
    hasReview: true,
  },
  {
    id: "m5_sample_order_003",
    studentId: "m5_sample_student_nour",
    clientId: "m5_sample_client_robotics",
    title: "Poster series for the MIU Theatre Festival",
    completedAt: "2026-07-10",
    hasReview: true,
  },
  {
    id: "m5_sample_order_004",
    studentId: "m5_sample_student_nour",
    clientId: "m5_sample_client_startup",
    title: "Packaging design for an alumni coffee brand",
    completedAt: "2026-06-08",
    hasReview: true,
  },
  {
    id: "m5_sample_order_005",
    studentId: "m5_sample_student_nour",
    clientId: "m5_sample_client_robotics",
    title: "Workshop flyer refresh for Robotics Club",
    completedAt: "2026-10-05",
    hasReview: false,
  },
  {
    id: "m5_sample_order_006",
    studentId: "m5_sample_student_karim",
    clientId: "m5_sample_client_robotics",
    title: "Club website landing section",
    completedAt: "2026-05-02",
    hasReview: true,
  },
  {
    id: "m5_sample_order_007",
    studentId: "m5_sample_student_karim",
    clientId: "m5_sample_client_startup",
    title: "Campus events operations dashboard",
    completedAt: "2026-04-18",
    hasReview: true,
  },
  {
    id: "m5_sample_order_008",
    studentId: "m5_sample_student_karim",
    clientId: "m5_sample_client_robotics",
    title: "Club FAQ page polish",
    completedAt: "2026-10-01",
    hasReview: false,
  },
];

export function getReviewsForStudent(studentId) {
  return reviews.filter((review) => review.targetStudentId === studentId);
}

export function getCompletedProjectsForStudent(studentId) {
  return completedProjects.filter((project) => project.studentId === studentId);
}

export function getCompletedProjectsForClient(clientId) {
  return completedProjects.filter((project) => project.clientId === clientId);
}

export function getEligibleOrdersForReview({ clientId, studentId } = {}) {
  return completedOrders.filter((order) => {
    if (order.hasReview) return false;
    if (clientId && order.clientId !== clientId) return false;
    if (studentId && order.studentId !== studentId) return false;
    return true;
  });
}

export function getOrderById(orderId) {
  return completedOrders.find((order) => order.id === orderId) ?? null;
}
