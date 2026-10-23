// Fictional review records only. Never add real identity evidence here.
export const verificationStatuses = [
  "Pending",
  "Approved",
  "Rejected",
  "Resubmission Requested",
  "Escalated",
];
export function createVerificationState() {
  return {
    cases: [
      {
        id: "verification_001",
        name: "Mariam Adel",
        role: "Student",
        affiliation: "MIU",
        document: "MIU ID",
        submitted: "2026-10-22",
        status: "Pending",
        context:
          "First submission. Review the fictional capture and document guidance.",
        capture: "Face and MIU ID shown together — illustrative placeholder.",
        signal: "Mock framing check: readable. Human review required.",
        history: [],
      },
      {
        id: "verification_002",
        name: "Nile Creative Studio",
        role: "Client",
        affiliation: "External",
        document: "Government ID",
        submitted: "2026-10-23",
        status: "Pending",
        context: "Resubmitted after a request for a clearer capture.",
        capture:
          "Face and government ID shown together — illustrative placeholder.",
        signal: "Mock lighting check: manual review recommended.",
        history: [
          {
            id: "seed_01",
            actor: "Demo Verification Reviewer",
            timestamp: "2026-10-21T09:00:00Z",
            before: "Pending",
            after: "Resubmission Requested",
            reason: "Fictional capture was too dark.",
          },
        ],
      },
      {
        id: "verification_003",
        name: "Youssef Nader",
        role: "Student",
        affiliation: "MIU",
        document: "MIU ID",
        submitted: "2026-10-20",
        status: "Approved",
        context: "Previously reviewed fictional submission.",
        capture: "Illustrative capture placeholder only.",
        signal:
          "Mock review complete. University affiliation is not independently validated.",
        history: [
          {
            id: "seed_02",
            actor: "Demo Verification Reviewer",
            timestamp: "2026-10-21T10:00:00Z",
            before: "Pending",
            after: "Approved",
            reason: "Demo evidence reviewed.",
          },
        ],
      },
      {
        id: "verification_004",
        name: "Omar Sami",
        role: "Client",
        affiliation: "External",
        document: "Government ID",
        submitted: "2026-10-19",
        status: "Rejected",
        context: "Previously reviewed fictional submission.",
        capture: "No real identity image is included.",
        signal: "Mock document readability check failed.",
        history: [
          {
            id: "seed_03",
            actor: "Demo Verification Reviewer",
            timestamp: "2026-10-20T08:00:00Z",
            before: "Pending",
            after: "Rejected",
            reason: "Fictional document was unreadable.",
          },
        ],
      },
      {
        id: "verification_005",
        name: "Sara Mostafa",
        role: "Student",
        affiliation: "MIU",
        document: "MIU ID",
        submitted: "2026-10-23",
        status: "Escalated",
        context: "An affiliation question was escalated for further review.",
        capture: "Illustrative capture placeholder only.",
        signal:
          "No automated affiliation decision. Await authorized escalation review.",
        history: [],
      },
      {
        id: "verification_006",
        name: "Hana Karim",
        role: "Client",
        affiliation: "External",
        document: "Government ID",
        submitted: "2026-10-22",
        status: "Resubmission Requested",
        context: "Awaiting a new capture from the fictional applicant.",
        capture: "No replacement capture received.",
        signal: "Mock framing issue: ID was outside the capture area.",
        history: [
          {
            id: "seed_04",
            actor: "Demo Verification Reviewer",
            timestamp: "2026-10-22T11:00:00Z",
            before: "Pending",
            after: "Resubmission Requested",
            reason:
              "Please show face and ID together in the fictional capture.",
          },
        ],
      },
    ],
  };
}
export function filterVerificationCases(
  cases,
  { status = "All", query = "", affiliation = "All" } = {},
) {
  const needle = query.trim().toLowerCase();
  return cases.filter(
    (c) =>
      (status === "All" || c.status === status) &&
      (affiliation === "All" || c.affiliation === affiliation) &&
      `${c.id} ${c.name}`.toLowerCase().includes(needle),
  );
}
export function verificationReducer(state, action) {
  if (action.type !== "decide") return state;
  const record = state.cases.find((c) => c.id === action.caseId);
  if (
    !record ||
    record.status !== "Pending" ||
    !["Approved", "Rejected", "Resubmission Requested"].includes(
      action.outcome,
    ) ||
    !action.reason?.trim() ||
    !action.actor ||
    !action.eventId ||
    !Number.isFinite(Date.parse(action.timestamp))
  )
    return state;
  const event = {
    id: action.eventId,
    actor: action.actor,
    timestamp: action.timestamp,
    before: record.status,
    after: action.outcome,
    reason: action.reason.trim(),
  };
  return {
    ...state,
    cases: state.cases.map((c) =>
      c.id === record.id
        ? { ...c, status: action.outcome, history: [...c.history, event] }
        : c,
    ),
  };
}
