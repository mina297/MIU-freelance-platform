
---
title: Testing Strategy
type: quality-assurance
status: proposed
tags: [MIU, testing, QA]
---

# MIU Freelance Platform — Testing Strategy

## 1. Purpose

Ensure that frontend workflows are usable, consistent, responsive, and aligned with SRS v1.1.

Production backend and integration testing will be expanded during later development.

## 2. Testing Levels

From `frontend/`, run `npm.cmd test` to discover all Node test files recursively,
including shared UI and public-page tests. Tests run sequentially to avoid
competing Vite test servers; middleware-only test servers disable HMR. New test
files do not require a package-script update. Use `npm.cmd run lint` and
`npm.cmd run build` for the remaining automated checks.

### Component Testing

Chatbot feature-local tests cover canned topic matching/priority and fallback,
blank and 500-character input boundaries, immutable message history, logout/expiry/
account-switch cleanup, active-role visibility, safe text rendering and one global
App widget across public/auth/application/admin/standalone routes. Tests use the
existing Node model tests and Vite SSR conventions. Browser open/minimize/reopen,
route persistence, focus/Escape, live announcements and mobile/zoom checks must be
recorded separately; static markup and state tests are not browser acceptance.
Test reusable controls, validation states, and common UI behavior.

### Feature Testing
Test marketplace, profiles, authentication, dashboard, and administration interactions.

Delivery model/store/render checks cover both source lifecycles, verified assigned
student submission, client revision/acceptance, stale review rejection, wrong-role/
foreign/inactive denial, awaiting-payment blocking, text/sample validation,
immutable handover history, idempotent confirmations, completed workspace locking,
list/status/timeline updates and unchanged agreed terms. Native dialog/keyboard/
mobile/screen-reader/visual checks remain deferred rather than passed.

Workspace model/store/render tests cover both order sources, active participant
reads/writes, foreign-role denial, requirements permissions and stale versions,
safe attachment allowlists, text limits/escaping, idempotent message sends,
terminal-state rejection, per-order isolation, immutable snapshots, equal-time
activity ordering and unchanged order terms/status. Native tab/focus/keyboard,
screen-reader/mobile and visual checks remain deferred, not passed.

Order-list model/render checks cover ownership before joins/aggregation, wrong-role
and inactive/expired denial, pending-owner access, combined search/status/source,
stable sorts, immutable source order, safe EGP summation, missing metadata, saved
service titles, live service-order insertion, role-specific detail return links
and suppression of stale cards/counts in loading/error views. Browser checks are
deferred separately; automated rendering is not keyboard/visual acceptance.

Service ordering tests cover approved client access, current published services,
package/extra membership, duplicate extras, integer-cent totals, safe delivery
arithmetic, stale price/scope/removal rejection, request idempotency, immutable
terms, participant-only summaries and immediate listing commitment guards. Project
order behavior remains in regression coverage. These do not verify actual native
dialog focus/keyboard behavior or replace deferred browser acceptance.

Student service-management model/store/route checks cover owned-only access,
field/package/extra validation, immutable snapshots, duplicate creation prevention,
private drafts, verification gates, lifecycle transitions, linked-order safeguards,
ID allowlisting and live catalogue/detail updates. Complete drafts are required;
incomplete form persistence is not implemented. Browser/keyboard/dialog-focus and
responsive visual checks remain deferred, not passed, per the team lead's request.

Service catalogue model/render tests cover published-only visibility, combined
filters, non-overlapping price boundaries, consistent starting-package price and
delivery, missing-price sorting, stable source order, public-shell landmarks,
escaped content and loading/error/empty presentations. Browser interactions,
mobile filter disclosure and visual acceptance remain separate manual checks.

Service-detail model/render tests cover public published-only lookup, matching
packages/extras, catalogue/detail starting-price consistency, unavailable records,
missing package/provider metadata, unique comparison header/cell associations,
loading/error suppression, escaping, hidden dynamic navigation and unchanged
order snapshots. Live table-scroll, keyboard and mobile review remain pending.

### Integration Testing
Verify that modules work together through shared mock data and routing.

### End-to-End Scenario Testing
Walk through complete user journeys.

### Visual Testing
Compare implemented screens against approved Figma frames.

### Accessibility Testing
Verify keyboard, focus, labels, and relevant assistive technology behavior.

## 3. Required Phase 1 Scenarios

| Scenario | Expected Demonstration |
|---|---|
| Visitor registration | Student/client registration form |
| Committee registration restriction | Committee cannot sign up |
| Student verification | Simulated face and MIU ID process |
| External client verification | Simulated government ID process |
| Project posting | Client creates a project |
| Proposal submission | Student submits a proposal |
| Proposal comparison | Client reviews/selects a proposal |
| Student proposal management | Student lists only owned offers, edits eligible terms, withdraws with confirmation and sees client/order updates |
| Service publishing | Student creates a service package |
| Service ordering | Client selects and orders a service |
| Delivery | Student submits work |
| Revision | Client requests a revision |
| Review | Eligible user submits feedback |
| Payment | Sandbox checkout outcome |
| Escrow | Simulated escrow status |
| Admin | Super Admin creates a committee account |
| Verification Committee | Reviews an identity case |
| Marketplace Operations | Reviews reported content |
| Finance Committee | Reviews a sandbox transaction |
| Support Committee | Handles a support/dispute case |
| AI Quality Committee | Reviews mock AI feedback |

## 4. Form Validation Testing

For each form:
- Missing required fields
- Invalid formats
- Invalid numbers
- Invalid dates
- Long input
- Disabled submission
- Error messages
- Successful submission
- Cancel/retry behavior

## 5. Role and Permission Testing

Test that:
- Visitors cannot access protected actions.
- Students cannot access client-only actions.
- Clients cannot access student-only actions.
- Committee members cannot register publicly.
- Each committee sees only authorized workspaces.
- Only Super Admin can manage committee accounts.
- Unauthorized order access is blocked in the mock UI.

Production security requires server-side testing later.

## 6. Responsive Testing

Test:
- Mobile
- Tablet
- Desktop

Focus on:
- Navigation
- Forms
- Search filters
- Cards
- Tables
- Dashboards
- Dialogs
- Checkout summaries
- Admin case queues

## 7. Accessibility Testing

Verify:
- Keyboard operation
- Focus visibility
- Semantic controls
- Form labels
- Screen-reader-friendly feedback where relevant
- Contrast
- Non-color status indicators
- Accessible dialogs

Target SRS NFR-02.

## 8. Error and Recovery Testing

Test:
- Invalid login simulation
- Expired mock session
- Missing project/service
- Empty results
- Failed upload
- Verification retry
- Failed sandbox payment
- Invalid proposal
- Permission denied
- Missing committee case

## 9. AI and Payment Transparency

Confirm that:
- Mock AI output is not described as production AI.
- Verification does not claim real biometric validation.
- Payment forms do not process actual money.
- Escrow records remain simulated.
- No sensitive real documents are required for a demo.

## 10. Requirement Traceability

Record testing against SRS identifiers.

Suggested tracking table:

| Requirement ID | Screen/Module | Test Case | Result |
|---|---|---|---|
| FR-S05 | Proposal Form | Valid simulated submission, eligibility, fields, fictional attachments, duplicate prevention, and confirmation rendering | Automated checks passed 23 October 2026; browser/visual review pending |
| FR-C09 | Checkout | Simulated funding | Not tested |
| FR-A04 | Committee Accounts | Create committee account | Not tested |
| NFR-03 | All pages | Responsive check | Not tested |
| NFR-10 | Payments | Sandbox-only behavior | Not tested |

Update results only after running tests.

## 11. Definition of Done

A feature is ready when:
- Required interactions work.
- UI matches approved design.
- Validation is present.
- Relevant empty/loading/error states work.
- Role restrictions behave correctly.
- Applicable tests have passed.
- Documentation is updated.

## 12. Final Review

Before the Phase 1 discussion:
- Verify required SRS sections.
- Verify all prototype entries.
- Review key user flows.
- Capture screenshots.
- Check known limitations.
- Rehearse the demonstration.
- Prepare fallback screenshots if necessary.

## Related Documents

### Member 2 integration review — 24 October 2026

`frontend/src/tests/marketplaceIntegration.test.js` covers the default-store project-to-proposal-to-order and service-to-order handoffs through rendered routes, including discovery updates, copied terms, duplicate protection, privacy and unpaid delivery guards. `marketplaceContrast.test.js` checks disclosure text and hero-focus colors mathematically. See the [M2 integration report](../07-HANDOVER/M2_MARKETPLACE_INTEGRATION_2026-10-24.md) for scope, fixes, routes and unrun browser/mobile/keyboard/screen-reader acceptance. Static SSR results do not substitute for those checks.

- [SRS](../01-PROJECT/SRS.md)
- [User Flows](../02-REQUIREMENTS/USER_FLOWS.md)
- [Pages and Routes](../03-DESIGN/PAGES_AND_ROUTES.md)
