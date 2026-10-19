
---
title: User Flows
type: workflows
status: baseline
tags: [MIU, UX, workflows]
---

# MIU Freelance Platform — User Flows

## 1. Purpose

This document explains the main journeys through the platform.

Each journey describes planned behavior. Phase 1 implements representative interactions with mock data.

## 2. Visitor Registration

1. Visitor opens the landing page.
2. Visitor selects Register.
3. Visitor chooses Student or Client.
4. Visitor fills in the registration form.
5. Form validation checks required information.
6. Account enters the appropriate onboarding flow.
7. User proceeds to verification if required.

**Important:** No committee registration option appears.

**Requirements:** FR-V03, FR-S01, FR-C01.

## 3. Identity Verification

1. Registered user opens the verification screen.
2. System explains the verification requirements.
3. User selects or confirms their account category.
4. MIU-affiliated users present an MIU ID.
5. External clients present an accepted government ID.
6. The planned camera experience shows the user's face and physical ID together.
7. The system collects appropriate consent and performs planned checks.
8. Verification status is displayed.
9. The Verification Committee reviews cases requiring a decision.
10. The user is approved, rejected, or asked to resubmit.

**Phase 1:** Simulated camera/verification states only.

**Requirements:** FR-S02, FR-C02, FR-VC02–FR-VC05.

## 4. Project-Based Hiring

1. Client logs in.
2. Client selects Post Project.
3. Client enters title, requirements, skills, EGP budget, and deadline.
4. Project is published according to platform rules.
5. Students browse or search for the project.
6. Student opens project details.
7. Student submits a proposal with EGP price, delivery time, and message.
8. Client reviews and compares proposals.
9. Client shortlists or selects a proposal.
10. A project order is established.
11. Client proceeds through simulated payment/escrow.
12. Freelancer works on the project.
13. Freelancer submits delivery.
14. Client accepts delivery or requests revisions.
15. Eligible participants submit reviews.

**Requirements:** FR-S04–FR-S11, FR-C04–FR-C06, FR-C09–FR-C14.

## 5. Service-Based Ordering

1. Student opens the service editor.
2. Student adds service details and pricing.
3. Student configures service packages and permitted extras.
4. Student publishes the service.
5. Client browses the services catalogue.
6. Client selects a service.
7. Client reviews package, extras, and total EGP price.
8. Client places the order.
9. Sandbox checkout is demonstrated.
10. Order workspace becomes available.
11. Student completes the service.
12. Client reviews delivery and requests revisions or accepts.
13. Eligible users submit reviews.

**Requirements:** FR-S07–FR-S13, FR-C07–FR-C14.

## 6. Delivery and Revisions

1. Participants open an existing order.
2. They review requirements and deadlines.
3. They exchange messages or attachments.
4. Freelancer submits work.
5. Client inspects delivered work.
6. Client either accepts or requests revisions.
7. Freelancer responds to a permitted revision request.
8. Order proceeds to an appropriate completion state.

Exact limits on revision counts are not finalized.

## 7. Support and Disputes

1. User opens Support.
2. User creates a ticket or dispute.
3. User provides a description and relevant evidence.
4. Support and Disputes Committee receives the case.
5. Committee reviews order history, evidence, and communication.
6. Committee records notes and requests clarification if necessary.
7. Committee resolves permitted cases.
8. Financial or exceptional cases are escalated.
9. The relevant authority records the final decision.
10. Users receive case-status updates.

**Requirements:** FR-S14, FR-C15, FR-SD02–FR-SD05.

## 8. Super Admin Creates a Committee Account

1. Super Admin logs in.
2. Super Admin opens Committee Account Management.
3. Super Admin enters member details.
4. Super Admin selects one of the five committees.
5. System validates the information.
6. System creates the committee account.
7. A secure activation/invitation process is planned.
8. Committee member sets credentials using the approved process.
9. Committee member logs in.
10. Committee-specific dashboard becomes available.

**Phase 1:** Account creation and activation are simulated.

## 9. Verification Committee Review

1. Committee member logs in.
2. Member opens the case queue.
3. Member selects a pending case.
4. Member reviews authorized identity evidence and verification status.
5. Member approves, rejects, or requests resubmission.
6. Member records a reason.
7. Case history is updated.
8. User is notified through the planned notification workflow.

## 10. Marketplace Moderation

1. User or moderation assistance flags content.
2. Marketplace Operations reviews the reported item.
3. Reviewer inspects the content and report reason.
4. Reviewer approves, hides, rejects, restores, or requests changes within authority.
5. Reviewer records the action and reason.
6. The system updates the visible moderation status.
7. Cases beyond authority are escalated.

## 11. Sandbox Finance Review

1. Finance Committee opens its dashboard.
2. Member views relevant transaction and escrow records.
3. Member opens a financial case.
4. Member reviews payment status, order context, and approved evidence.
5. Member performs a permitted sandbox action or escalates the case.
6. System records the simulated financial state change.
7. Audit history records the action.

No actual money movement occurs in Phase 1.

## 12. AI Quality Review

1. User reports an incorrect recommendation, chatbot answer, or moderation result.
2. AI and Quality Committee receives the report.
3. Reviewer examines available evidence and feedback.
4. Reviewer records a quality finding.
5. Reviewer assigns or escalates the issue.
6. The finding is retained for later improvement and testing.

## 13. Error and Recovery Flows

Every important journey should consider:
- Invalid form input
- Missing record
- Restricted access
- Expired session
- Failed upload
- Interrupted verification
- Empty search results
- Failed sandbox payment
- Dispute escalation
- Recoverable error

## Related Documents

- [SRS](../01-PROJECT/SRS.md)
- [Business Rules](BUSINESS_RULES.md)
- [Pages and Routes](../03-DESIGN/PAGES_AND_ROUTES.md)
