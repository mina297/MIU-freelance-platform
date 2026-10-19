
---
title: Business Rules
type: business-rules
status: baseline-with-open-decisions
tags: [MIU, business-rules]
---

# MIU Freelance Platform — Business Rules

## Purpose

This document records the operational rules that govern the marketplace.

Rules supported by SRS v1.1 are distinguished from recommendations that still require approval.

## 1. Confirmed Platform Rules

### BR-01 — Two Marketplace Models

The platform must support:
- Client-posted projects with student proposals
- Student-published services with packages and extras

### BR-02 — EGP Only

All budgets, proposals, service prices, transactions, fees, refunds, and escrow records use EGP.

There is no currency selector or converter.

### BR-03 — Public Registration

Public registration is available for Student and Client accounts.

Committee and Super Admin accounts are not created through public registration.

### BR-04 — Committee Provisioning

The Super Admin creates committee accounts and assigns their role.

### BR-05 — Role Restrictions

A committee accesses only its authorized data and actions.

### BR-06 — Verification Requirement

Students must complete the required verification process before restricted marketplace actions.

External clients must complete applicable government-ID verification.

### BR-07 — Proposal Information

A proposal includes:
- Proposed EGP price
- Delivery time
- Cover message
- Permitted attachments

### BR-08 — Service Information

Students can publish predefined services with packages and permitted extras.

### BR-09 — Client Proposal Review

Clients can compare, shortlist, accept, and reject proposals.

### BR-10 — Financial Safety

Phase 1 payments and escrow are simulated or sandbox demonstrations.

Real funds are not collected or held.

### BR-11 — Reviews

Reviews follow completed work when platform rules permit.

### BR-12 — Administrative Accountability

Administrative and committee actions must be traceable through appropriate audit records.

### BR-13 — Human Oversight

AI-assisted verification, moderation, and other consequential outputs must support human review or escalation.

### BR-14 — Final Escalations

The Super Admin makes final decisions on cases escalated beyond committee authority.

## 2. Proposed Implementation Rules

These are design recommendations, not separately approved SRS decisions.

### PR-01 — Stable Record Ownership

A user may edit only records they own, unless an administrative permission explicitly allows another action.

### PR-02 — Valid Financial Amounts

Prices and budgets should be positive EGP amounts.

### PR-03 — Proposal Selection

A standard project should have only one accepted primary proposal at a time unless a multi-hire feature is separately approved.

### PR-04 — Review Eligibility

Review submission should be associated with an eligible completed order.

### PR-05 — Status Validation

State changes should follow defined workflows rather than allowing arbitrary status editing.

### PR-06 — Audit Details

Sensitive actions should record:
- Actor
- Action
- Timestamp
- Target record
- Reason
- Previous and resulting status, where appropriate

### PR-07 — Sensitive Data Minimization

Only authorized reviewers should access required identity evidence.

## 3. Decisions Still Needed

| Topic | Open Question |
|---|---|
| Proposal budget | Warn or block proposals outside the published budget? |
| Service packages | Exact allowed packages and extra-pricing constraints? |
| Proposal edits | Until what precise event can an open proposal be edited? |
| Project cancellation | What happens when a funded project is cancelled? |
| Revisions | Is there a maximum number of revisions? |
| Platform fees | What commission percentage or fee structure applies? |
| Refund authority | Which financial decisions require Super Admin approval? |
| Dispute time limits | What response deadlines apply? |
| Verification | What evidence retention and resubmission limits apply? |
| Messaging | Are conversations allowed before an order begins? |
| Reviews | Can users edit a published review, and for how long? |
| Provider choices | Which AI, identity, translation, and payment services will be selected? |

Do not silently turn these questions into mandatory rules.

## 4. Rule Change Procedure

When a business rule changes:

1. Record the decision.
2. Identify affected functional requirements.
3. Update the corresponding user flows.
4. Update module specifications.
5. Update tests and mock fixtures.
6. Obtain approval from the relevant decision maker.

## Related Documents

- [SRS](../01-PROJECT/SRS.md)
- [User Roles](USER_ROLES_AND_PERMISSIONS.md)
- [User Flows](USER_FLOWS.md)
