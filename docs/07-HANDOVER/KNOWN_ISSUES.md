---
title: Known Issues and Open Decisions
type: handover
status: active
tags: [MIU, issues, decisions]
---

# MIU Freelance Platform — Known Issues and Open Decisions

## Order delivery increment — 24 October 2026

Automated verification: all 230 tests, ESLint and production build passed. The
local order URL responds HTTP 200; actual dialog/keyboard/mobile acceptance is
still deferred. No browser interaction or screen-reader verification is claimed.

Submission, revision requests, resubmission and confirmed acceptance/completion
are implemented for eligible existing orders, with role/verification/current-status
and latest-delivery checks plus retry prevention. Awaiting-payment/funded orders
cannot start delivery here; activation/payment remains a separate integration.
Completion releases no money or escrow. Samples are metadata only. Automatic
completion, revision limits/deadlines, dispute settlement and review integration
remain undecided or separate work. Browser/dialog-focus/mobile/keyboard/visual
acceptance remains deferred; the documented bundle-size warning is outstanding.

## Order workspace increment — 24 October 2026

Automated verification: all 223 tests, ESLint and production build passed. The
local order URL responds HTTP 200; browser interaction acceptance is still
deferred and must not be inferred from that response or static render tests.

Both order views now include shared participant-only requirements, messages and
recorded activity. Live authorization/state checks, versioned client notes and
message retry guards are implemented. Sample attachments have no real files,
uploads/downloads or notifications. Requirements are coordination notes only;
status/price/scope/funding/deadlines are not changed. Terminal orders retain history
but disallow writes; delivered/disputed notes are also read-only in this demo.
Delivery/revisions/completion, milestone management and financial flows remain
separate increments. The timeline does not infer payment history or percentages.
Manual browser/keyboard/tab/focus, responsive, screen-reader and visual acceptance
remain deferred at Mina's request. The bundle-size warning remains outstanding.

## Order lists increment — 24 October 2026

Automated verification: all 216 tests, ESLint and production build passed. The
focused live-insertion test also passed for both project acceptance and service
confirmation. Both local list URLs respond HTTP 200; interactive acceptance is
still deferred and must not be inferred from document delivery.

Student/client order lists are connected to live orderStore snapshots with
ownership-first filtering and metrics, safe title/counterpart fallbacks and links
to protected summaries. Agreed-value metrics include all own orders/all statuses;
they are not spending, earnings, payment or escrow values. Existing orders remain
viewable for pending verification. No list action changes order status. Workspace,
delivery and payment/escrow interactions remain future work. Manual browser,
keyboard, mobile/visual and screen-reader checks remain explicitly deferred.
The previously documented JavaScript bundle-size warning remains outstanding.

## Service ordering increment — 24 October 2026

Automated verification: all 211 tests, ESLint and production build passed for the
ordering increment. Browser interaction checks remain pending, not passed.

Client service configuration and confirmed order creation are connected, including
EGP/delivery calculation, stale-term rejection and duplicate-request prevention.
Service-order summaries are participant-only and preserve copied terms; legacy
fixtures explicitly lack historical snapshots. New orders await payment and block
linked service editing/removal without cancelling, repricing or pausing orders.
Service checkout/payment simulation, funding, lists, full workspace/delivery and
production persistence/authentication remain unimplemented. All-client approved
verification is a conservative demo restriction pending the origin contract.
Manual browser/mobile/keyboard/dialog-focus acceptance remains deferred as requested.
The JavaScript bundle-size warning remains a performance follow-up, not suppressed.

## Student service management increment — 24 October 2026

Automated verification: all 203 tests, ESLint and the production build passed.
The local `/student/services` route responds HTTP 200; this is not interactive
browser evidence. Changes remain subject to the final deferred acceptance pass.

Owned service management, package/extra editing, private preview, complete draft
saving and confirmed publish/pause/remove actions are implemented in frontend
memory. Verification gates publication/public edits. Any linked service order
conservatively blocks editing/removal; pause preserves all order terms. This is a
demo safeguard, not an approved final cancellation/historical-pricing policy.
Partial draft persistence, portfolio editing, service ordering and checkout remain
unimplemented. Public catalogue/details consume live serviceStore snapshots and
hide unpublished listings. Manual browser, mobile, keyboard, dialog focus and
visual review are explicitly deferred at Mina's request until his feature work is
finished; automated checks must not be presented as completing those checks.
The previously documented >500 kB JavaScript bundle warning remains outstanding.

## Service detail increment — 24 October 2026

Public published-service details and package/extra comparison are now connected
from `/services`. Draft/paused/missing listings do not expose detail content.
No order or payment actions occur. Full profiles/portfolio/reviews, package/extra
selection and service checkout remain separate tasks. Actual keyboard/table-scroll,
screen-reader and mobile/desktop visual acceptance remain unverified.
All 196 automated tests, ESLint and production build passed for this increment.
The local detail URL responded HTTP 200; this is not browser acceptance evidence.
The production build succeeds but now warns that the main JavaScript chunk exceeds
500 kB minified. Route-level code splitting should be considered in a focused
performance task; this warning is not suppressed or treated as a failed build.

## Services catalogue increment — 24 October 2026

`/services` now provides published fictional service discovery with combined
search/category/skill/starting-price filters, sorting and starting-package scope
previews. Shared public navigation, account state and other marketplace routes
are retained. All 193 tests, ESLint and production build passed for this increment.
Earlier references to `/services` as a placeholder are historical and superseded.
Service detail/profile navigation, publication/editing, selecting packages/extras
and ordering remain future tasks. Catalogue loading/error props are presentation
contracts, not evidence of a backend request. Keyboard interactions, disclosure
focus, mobile layout and visual approval still require browser acceptance.

## Student proposals integration verification — 24 October 2026

Local main `7f536c8` was integrated into `feat/m2-student-proposals` without
replacing Member 1's new homepage or the existing public/authentication layouts.
Both student list/edit routes and the current client proposal/order flows remain
connected. The route documentation conflict was resolved by retaining both notes.
All 188 automated tests, ESLint and the production build passed on the combined
working tree. The earlier 193-test result applied before retired homepage tests
were removed; it is not the integrated test count. Browser, keyboard, responsive
visual and dialog-focus acceptance checks remain pending. This verification does
not by itself mean the branch has been committed, pushed or merged into main.

## Homepage replacement integration — 24 October 2026

Member 1's new homepage replaces the retired Member 4 landing implementation.
Existing main-branch public pages, marketplace routes, role guards and demo session
controls are preserved. The homepage intentionally retains fictional independent
discovery examples; shared project/profile integration remains future work.
Automated integration checks do not verify live scroll animation, narrow-screen
appearance, native dialog focus restoration or keyboard interaction in a browser.
These manual acceptance checks remain pending before final UI approval.

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

## 8. Landing page verification — 23 October 2026

P-01 now follows Figma “MIU Freelance desktop” (`8:2656`). `npm test` passed all 31 tests; `npm run build` and `npm run lint` passed. Browser checks covered desktop plus embedded 390px/768px responsive previews, hero/search wrapping, timeline and card layouts, local category filtering, no-match search and clear recovery, bookmark pressed state/status, job/profile modal previews, Escape close with focus restoration, and Post a Job navigation to client registration. Downloaded static assets loaded successfully; icon and avatar dimensions matched their design slots. The footer logo plate was corrected to 80×60 with contained original artwork.

The shared navigation is intentionally preserved rather than replaced by Figma's header. Landing jobs/profiles are fictional design examples with historical design dates, separate from the shared catalogue. Services still opens its existing placeholder. Full posting, profiles, support, approved policies, verification and reviews remain future module work. Native mobile-device, full assistive-technology and production accessibility audits remain unperformed.

### Subsequent landing motion update — 23 October 2026

The search typewriter/perimeter light, category card carousel and scroll-driven How it works timeline supersede the corresponding earlier visual checks. Automated scroll calculation and static rendering checks are included; live browser confirmation of scroll timing, depth animation, mobile swipe, focus behavior and reduced-motion switching remains pending because no browser surface was connected for this update. Earlier browser results above apply to the previous presentation only.

### Authentication presentation update — 23 October 2026

Rounded authentication forms and shorter prototype wording pass all 36 automated tests, lint and production build. Rendering checks retain required field labels and prototype/reset disclosures and reject visible "demo" wording. Live browser checks of the updated form spacing, mobile layout and focus appearance remain pending; no connected browser was available in this session.

## 9. Related Documents

### Freelancer discovery profile dependency — 24 October 2026

The skills-matching page at `/recommendations` is a deterministic Phase 1 demonstration. Feedback remains local, and no AI model, trained personalization or production escalation endpoint is connected. End-to-end browser interaction and accessibility checks remain deferred along with the marketplace integration review. Member 5 profile identity alignment and Member 3 financial integration remain separate dependencies.

The public directory is based on published service providers. Full profile links remain deferred: cached Member 5 profile fixtures use different names for canonical `student_001`/`student_002` IDs. Reconcile identities before connecting profiles, reviews or availability. See [Freelancer Discovery](../06-MODULES/FREELANCER_DISCOVERY.md). Manual browser/mobile/keyboard/screen-reader acceptance remains unrun because no browser is connected. The earlier production chunk-size warning is resolved by separating application/vendor chunks, without reducing total initial JavaScript. Freelancer disclosure contrast and hero link focus colors were corrected. See the [M2 integration report](M2_MARKETPLACE_INTEGRATION_2026-10-24.md) for verification scope and remaining dependencies.

- [Project Scope](../01-PROJECT/PROJECT_SCOPE.md)
- [Development Roadmap](../01-PROJECT/DEVELOPMENT_ROADMAP.md)
- [Maintenance Guide](MAINTENANCE_GUIDE.md)
- [SRS](../01-PROJECT/SRS.md)
