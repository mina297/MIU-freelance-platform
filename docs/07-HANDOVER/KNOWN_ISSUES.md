
---
title: Known Issues and Open Decisions
type: handover
status: active
tags: [MIU, issues, decisions]
---

# MIU Freelance Platform — Known Issues and Open Decisions

## 1. Purpose

Track confirmed limitations, unresolved decisions, and verified bugs.

Do not confuse a planned feature with a software defect.

## 2. Issue Categories

- **Open Decision:** Requirement or implementation choice not finalized
- **Known Limitation:** Intentional current restriction
- **Verified Bug:** Reproduced incorrect behavior
- **Dependency:** Requires an external service or approval
- **Documentation Gap:** Information requiring completion

## 3. Current Known Limitations

| ID | Category | Description | Status |
|---|---|---|---|
| KL-01 | Known Limitation | Phase 1 authentication is planned as simulated frontend behavior. | Expected |
| KL-02 | Known Limitation | Real face/ID verification is outside Phase 1. | Expected |
| KL-03 | Known Limitation | AI interactions use planned/mock behavior during Phase 1. | Expected |
| KL-04 | Known Limitation | Real online payments and escrow are outside Phase 1. | Expected |
| KL-05 | Known Limitation | Capacitor mobile packaging is a later-phase goal. | Expected |
| KL-06 | Documentation Gap | SRS prototype screenshot placeholders need completed interface captures. | Pending |
| KL-07 | Known Limitation | Task 01 adds routing, role checks and in-memory demo sessions. `/projects` renders the public catalogue; other registered feature screens remain labeled placeholders, and other proposed routes and feature workflows are not implemented. See the current snapshot in Pages and Routes. | Expected |

These are scope limitations and documentation tasks, not verified software bugs.

## 4. Open Decisions

| ID | Topic | Decision Needed |
|---|---|---|
| OD-01 | Identity Provider | Select approved identity-verification service. |
| OD-02 | MIU Affiliation | Define how university membership will be validated. |
| OD-03 | Identity Retention | Approve storage and deletion policy. |
| OD-04 | Payment Provider | Select payment/sandbox integration. |
| OD-05 | Escrow | Confirm legally appropriate custody and settlement model. |
| OD-06 | Platform Fees | Define commission/fee structure. |
| OD-07 | Refund Authority | Define approval thresholds and escalation rules. |
| OD-08 | Proposal Budget | Decide warning versus rejection for out-of-budget proposals. |
| OD-09 | Service Packages | Finalize package limits and pricing constraints. |
| OD-10 | Revisions | Define revision limits and deadlines. |
| OD-11 | AI Services | Select matching, chatbot, and moderation services. |
| OD-12 | Translation | Select language/translation implementation. |
| OD-13 | Branding | Confirm permitted university branding and logo usage. |
| OD-14 | Hosting | Approve deployment provider and environment. |
| OD-15 | Permissions | Finalize fine-grained committee authorization rules. |
| OD-16 | Academic Deliverables | Confirm whether the complete working React frontend is mandatory for the Phase 1 discussion beyond SRS/prototypes. |

## 5. Verified Bugs

No verified bug list has been supplied for this documentation baseline.

Add issues only after reproducing them.

### Bug Record Template

```markdown
### BUG-001 — Short Description

**Status:** Open
**Severity:** To be assessed
**Module:** Relevant module
**Environment:** Relevant environment

#### Steps to Reproduce
1. Step one
2. Step two

#### Expected Result
Describe expected behavior.

#### Actual Result
Describe observed behavior.

#### Related Requirements
SRS requirement IDs.

#### Proposed Resolution
Suggested action.

#### Verification
Not yet verified.
```

## 6. Decision Record Template

```markdown
### DEC-001 — Decision Title

**Date:** YYYY-MM-DD
**Status:** Proposed / Approved / Rejected
**Decision Owner:** To be assigned

#### Context
Why is the decision needed?

#### Options
List alternatives.

#### Decision
Record the approved choice.

#### Consequences
Explain affected features and documents.

#### Related Requirements
SRS requirement IDs.
```

## 7. Maintenance Rules

- Do not mark an issue fixed without verification.
- Do not treat proposed decisions as approved.
- Reference related pull requests where available.
- Update affected module documentation.
- Keep resolved issues traceable.
- Avoid recording secrets or private user information.

## 8. Landing page verification — 23 October 2026

P-01 now follows Figma “MIU Freelance desktop” (`8:2656`). `npm test` passed all 31 tests; `npm run build` and `npm run lint` passed. Browser checks covered desktop plus embedded 390px/768px responsive previews, hero/search wrapping, timeline and card layouts, local category filtering, no-match search and clear recovery, bookmark pressed state/status, job/profile modal previews, Escape close with focus restoration, and Post a Job navigation to client registration. Downloaded static assets loaded successfully; icon and avatar dimensions matched their design slots. The footer logo plate was corrected to 80×60 with contained original artwork.

The shared navigation is intentionally preserved rather than replaced by Figma's header. Landing jobs/profiles are fictional design examples with historical design dates, separate from the shared catalogue. Services still opens its existing placeholder. Full posting, profiles, support, approved policies, verification and reviews remain future module work. Native mobile-device, full assistive-technology and production accessibility audits remain unperformed.

### Subsequent landing motion update — 23 October 2026

The search typewriter/perimeter light, category card carousel and scroll-driven How it works timeline supersede the corresponding earlier visual checks. Automated scroll calculation and static rendering checks are included; live browser confirmation of scroll timing, depth animation, mobile swipe, focus behavior and reduced-motion switching remains pending because no browser surface was connected for this update. Earlier browser results above apply to the previous presentation only.

## 9. Related Documents

- [Project Scope](../01-PROJECT/PROJECT_SCOPE.md)
- [Development Roadmap](../01-PROJECT/DEVELOPMENT_ROADMAP.md)
- [Maintenance Guide](MAINTENANCE_GUIDE.md)
- [SRS](../01-PROJECT/SRS.md)
