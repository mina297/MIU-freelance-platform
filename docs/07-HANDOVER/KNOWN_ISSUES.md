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

**Student proposal management:** owned list, eligible editing and confirmed
withdrawal are demonstrated at `/student/proposals` and its `/:proposalId/edit`
route. The exact production edit cutoff remains undecided. The demo permits changes
only to submitted/shortlisted offers on open, uncommitted projects; editing requires
approved verification. Pending active students may withdraw an eligible own offer.
Undo/resubmission and persistent storage are not implemented. Browser focus,
confirmation, keyboard, responsive and account-switching acceptance remain pending.

The current Member 2 review status, manual acceptance steps and suggested PR text
are recorded in [Client proposals handover checklist](MEMBER2_CLIENT_PROPOSALS_REVIEW.md).

**Client proposal review:** incoming proposal review, filtering, sorting, up-to-three
comparison and reversible shortlisting are implemented in the demo. Student profile
navigation (FR-C06) and full order/checkout workflows remain pending. Confirmed
accept/reject and a participant-protected project-order summary are implemented.
Acceptance creates one demo order awaiting payment and selects its project;
live orders feed commitment safeguards. New submissions and decisions share proposalStore snapshots;
existing fixture-only query helpers are not reactive review adapters. Browser
interaction, comparison selection/keyboard checks, and mobile/desktop visual
acceptance remain unverified. Refresh restores the proposal fixtures.

**Project creation (24 October 2026):** `/client/projects/new` is a simulated
create/preview/publish flow with private saved drafts and owned-open-project editing.
`/client/projects` provides the client's list; `/client/projects/:projectId/edit`
resumes drafts or edits open briefs. Saved records reset on refresh; unsaved
form values reset on leaving or account switching. Confirmed close/cancel actions
are available for uncommitted owned projects; any linked project order or accepted
proposal blocks both actions. Funded/committed cancellation remains undecided.
Reopening and non-open editing are unavailable. The live orderStore now feeds
projectStore's commitment checks; future financial stores must preserve that integration.
The session contract lacks MIU/external
client origin, so publishing currently requires approved verification for all demo
clients. Nile Studio is the approved fictional test case. Browser interaction,
keyboard, and mobile/desktop visual acceptance for this new screen remain pending.

**24 October 2026 public integration:** the landing, About, full How It Works,
Terms/Privacy placeholders, and loading/error demos now have registered routes
using one shared public shell. Public navigation is session-aware and reuses the
existing AuthProvider; project/proposal layouts and guards are preserved. All 162
tests, lint and build passed. Approved translations and policy text are awaited
from the team. Browser checks could not start because the connected Windows
sandbox helper failed; keyboard, visual and actual screen-reader acceptance
remain unverified. Historical route-pending notes below are superseded by this
update and the current Pages and Routes snapshot.

<!-- prettier-ignore -->
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

| ID    | Topic                 | Decision Needed                                                                                                                                                                                                                                                                      |
| ----- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| OD-01 | Identity Provider     | Select approved identity-verification service.                                                                                                                                                                                                                                       |
| OD-02 | MIU Affiliation       | Define how university membership will be validated.                                                                                                                                                                                                                                  |
| OD-03 | Identity Retention    | Approve storage and deletion policy.                                                                                                                                                                                                                                                 |
| OD-04 | Payment Provider      | Select payment/sandbox integration.                                                                                                                                                                                                                                                  |
| OD-05 | Escrow                | Confirm legally appropriate custody and settlement model.                                                                                                                                                                                                                            |
| OD-06 | Platform Fees         | Define commission/fee structure.                                                                                                                                                                                                                                                     |
| OD-07 | Refund Authority      | Define approval thresholds and escalation rules.                                                                                                                                                                                                                                     |
| OD-08 | Proposal Budget       | Decide warning versus rejection for out-of-budget proposals.                                                                                                                                                                                                                         |
| OD-09 | Service Packages      | Finalize package limits and pricing constraints.                                                                                                                                                                                                                                     |
| OD-10 | Revisions             | Define revision limits and deadlines.                                                                                                                                                                                                                                                |
| OD-11 | AI Services           | Select matching, chatbot, and moderation services.                                                                                                                                                                                                                                   |
| OD-12 | Translation           | Select language/translation implementation.                                                                                                                                                                                                                                          |
| OD-13 | Branding              | Confirm permitted university branding and logo usage.                                                                                                                                                                                                                                |
| OD-14 | Hosting               | Approve deployment provider and environment.                                                                                                                                                                                                                                         |
| OD-15 | Permissions           | Finalize fine-grained committee authorization rules.                                                                                                                                                                                                                                 |
| OD-16 | Academic Deliverables | Confirm whether the complete working React frontend is mandatory for the Phase 1 discussion beyond SRS/prototypes.                                                                                                                                                                   |
| OD-17 | Public Policy Content | Supply and approve Terms and Privacy text, responsible owner and publication/version details against actual project practices. Member 4 pages are explicitly labeled placeholders; route integration remains with Member 1. Related unresolved decisions include OD-03 and OD-05–07. |

**23 October 2026 — OD-12 presentation update:** Member 4's controlled
`components/navigation/LanguageSwitcher.jsx` is implemented using the existing
Select/Field. It has no built-in languages or translations and changes no
application state or document direction. Approved options/dictionaries,
Member 1's provider/state/header integration, and real translated RTL validation
remain pending. OD-12 is not resolved by this component. See the
[language-switcher contract](../03-DESIGN/UI_COMPONENTS.md#member-4--language-switcher-interface).

**23 October 2026 - repository comparison:** KL-07 records the earlier Task 01
snapshot. At fetched target `origin/main` (`b542108`), App mounts Member 1's
BrowserRouter, AuthProvider and AppRouter. Public projects/details and simulated
proposal submission plus mock authentication forms are implemented there; `/`
and `/services` remain placeholders. The How It Works section (`753d9f1`) is
already included in that target. This Member 4 branch still has the historical
catalogue-only App; no target source or routing is integrated by these
documentation edits. Public-page composition, language/provider integration,
approved policy text and final manual acceptance remain pending. See the
[Member 4 UI Handover](MEMBER4_UI_HANDOVER.md) for the baseline distinction.

## 5. Verified Bugs

### 24 October 2026 — merged UI review corrections

| ID | Issue | Resolution |
|---|---|---|
| VB-01 | The explicit `npm test` file list omitted shared UI/public-page tests. | Fixed: automatic Node test discovery; 161 tests passed through `npm.cmd test`. |
| VB-02 | Landing's loading status was nested inside its `aria-busy` region, which could defer the announcement. | Fixed: the atomic live status is a preceding sibling. Structural regression coverage passed; actual screen-reader behavior remains unverified. |
| VB-03 | Shared public links and home logos used document navigation for internal paths, clearing in-memory state when adopted inside the router. | Fixed: router-aware links for internal paths, with native behavior retained outside a router and for anchors/external/download/explicit-reload links. Router/basename rendering tests passed; browser interaction acceptance remains pending. |

Middleware-only Vite test servers disable HMR and the normal suite runs sequentially
to avoid competing test-server WebSocket listeners. Lint and the production build
passed. These corrections do not register public routes, supply translations, or
approve policy content; those known dependencies remain open.

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

## 8. Related Documents

- [Project Scope](../01-PROJECT/PROJECT_SCOPE.md)
- [Development Roadmap](../01-PROJECT/DEVELOPMENT_ROADMAP.md)
- [Maintenance Guide](MAINTENANCE_GUIDE.md)
- [SRS](../01-PROJECT/SRS.md)
