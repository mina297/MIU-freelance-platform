---
title: Pages and Routes
type: navigation-specification
status: proposed-route-map
tags: [MIU, pages, routing]
---

# MIU Freelance Platform — Pages and Routes

## Purpose

Map the 29 SRS prototype entries to proposed frontend routes.

**Important:** Prototype IDs are established in SRS v1.1. Route paths are proposed engineering conventions and may be adjusted before implementation.

## 1. SRS Prototype Mapping

| ID   | Page                            | Proposed Route(s)                                            | Access                       |
| ---- | ------------------------------- | ------------------------------------------------------------ | ---------------------------- |
| P-01 | Landing                         | `/`                                                          | Public                       |
| P-02 | Registration and Role Selection | `/register`, `/register/role`                                | Public                       |
| P-03 | Login                           | `/login`                                                     | Public                       |
| P-04 | Forgot and Reset Password       | `/forgot-password`, `/reset-password`                        | Public                       |
| P-05 | Identity Verification           | `/verify`, `/verify/pending`                                 | Student/Client               |
| P-06 | Projects Catalogue              | `/projects`                                                  | Public                       |
| P-07 | Project Details                 | `/projects/:projectId`                                       | Public                       |
| P-08 | Submit/Edit Proposal            | `/projects/:projectId/propose`, `/student/proposals`         | Student                      |
| P-09 | Services Catalogue              | `/services`                                                  | Public                       |
| P-10 | Service Details and Packages    | `/services/:serviceId`                                       | Public                       |
| P-11 | Student Dashboard               | `/student/dashboard`                                         | Student                      |
| P-12 | Student Profile and Portfolio   | `/students/:studentId`, `/profile/edit`                      | Student/Public view          |
| P-13 | Service Editor                  | `/student/services/new`, `/student/services/:serviceId/edit` | Student                      |
| P-14 | Student Proposals and Orders    | `/student/proposals`, `/student/orders`                      | Student                      |
| P-15 | Client Dashboard                | `/client/dashboard`                                          | Client                       |
| P-16 | Post/Edit Project               | `/client/projects/new`, `/client/projects/:projectId/edit`   | Client                       |
| P-17 | Proposal Comparison             | `/client/projects/:projectId/proposals`                      | Client                       |
| P-18 | Checkout and Escrow             | `/checkout/:orderId`, `/escrow/:orderId`                     | Client/Authorized order user |
| P-19 | Order Workspace                 | `/orders/:orderId`                                           | Authorized participants      |
| P-20 | Messages, Chatbot, Translation  | `/messages`, global assistant                                | Registered user              |
| P-21 | Support and Dispute Form        | `/support/contact`, `/disputes/new`                          | Registered user              |
| P-22 | Super Admin Dashboard           | `/admin`                                                     | Super Admin                  |
| P-23 | Committee Accounts              | `/admin/committee-accounts`                                  | Super Admin                  |
| P-24 | Verification Committee          | `/committee/verification`                                    | Verification                 |
| P-25 | Marketplace Operations          | `/committee/marketplace`                                     | Marketplace Ops              |
| P-26 | Finance Committee               | `/committee/finance`                                         | Finance                      |
| P-27 | Support and Disputes            | `/committee/support`                                         | Support                      |
| P-28 | AI and Quality                  | `/committee/ai-quality`                                      | AI & Quality                 |
| P-29 | Notifications and Settings      | `/notifications`, `/settings`                                | Registered user              |

## 2. Supporting Routes

Additional proposed routes may include:

| Route                  | Purpose                              |
| ---------------------- | ------------------------------------ |
| `/about`               | Project introduction                 |
| `/how-it-works`        | Marketplace explanation              |
| `/help`                | Help Center                          |
| `/help/:articleSlug`   | Help article                         |
| `/terms`               | Terms                                |
| `/privacy`             | Privacy                              |
| `/freelancers`         | Freelancer discovery                 |
| `/recommendations`     | AI-assisted suggestions              |
| `/student/services`    | Manage service listings              |
| `/client/projects`     | Manage client projects               |
| `/client/orders`       | Client order history                 |
| `/wallet/transactions` | Transaction history                  |
| `/admin/roles`         | Administrative permission management |
| `/access-denied`       | Authorization error                  |
| `/session-expired`     | Session recovery                     |
| `*`                    | Not-found route                      |

These supporting routes extend the SRS prototype inventory without changing its numbering.

## 3. Current Implementation Snapshot

**Order delivery (24 October 2026):** the existing `/orders/:orderId` workspace
now includes Delivery & revisions. Eligible assigned students submit/resubmit;
the owning client requests revisions or confirms acceptance/completion. Latest
submission checks and active-role/verification/status checks protect actions.
Lists and timeline update live. No new route, funding action, deadline or financial
settlement is introduced. Awaiting-payment orders cannot submit delivery here.

**Order workspace (24 October 2026):** `/orders/:orderId` preserves both source
summaries and now includes participant-only Requirements, Messages and Progress &
activity tabs. Client notes are versioned, conversation attachments are fictional
allowlisted metadata, and the log records real demo actions only. No new route,
payment, status mutation, delivery submission or milestone workflow is introduced.

**Order lists (24 October 2026):** `/client/orders` and `/student/orders` now
render owned-only live project/service order lists, with search/status/source
filters, deterministic sorting, non-financial EGP value summaries and recovery
states. Role guards and participant-only detail access remain. Summary pages link
back to the role-specific list. Full order collaboration is not implemented yet.

**Service ordering (24 October 2026):** `/services/:serviceId/order` is an active
client-only standalone configurator, hidden from generic navigation and linked
from public service details. It validates package/extras, quotes EGP/delivery,
confirms current terms and creates one awaiting-payment demo order per request.
`/orders/:orderId` now supports participant-only service summaries as well as the
existing project handoff. No payment/escrow or full workspace is implemented here.

**Student service management (24 October 2026):** student-only standalone routes
`/student/services`, `/student/services/new`, `/student/services/:serviceId/edit`
cover owned listings, validated private previews, complete drafts, package/extra
editing, verified publishing, pausing and uncommitted removal. Dynamic/new routes
are hidden from generic navigation. Public discovery/details observe serviceStore;
private/unpublished content remains hidden. Ordering/checkout are later work.

**Service details (24 October 2026):** public `/services/:serviceId` now provides
P-10 description/provider summary, read-only package comparison, extras information
and unavailable/loading/error states. Catalogue links open real service IDs; the
dynamic route is hidden from global navigation. Shared public layout and session
are preserved. Package selection, profile links and checkout are not implemented.

**Service discovery (24 October 2026):** `/services` renders the public catalogue
(P-09), with published-only search/category/skill/starting-price filters, sorting,
package scope disclosures and empty/loading/error presentations. It retains the
shared public shell. Service details are connected as described above; profiles
and ordering remain future work.

**Student proposal management:** `/student/proposals` now renders an owned-only
student list with search/status filters and accepted demo-order links (P-14).
`/student/proposals/:proposalId/edit` provides P-08 editing for eligible offers.
The list offers confirmed withdrawal. Submitted/shortlisted offers require an open,
uncommitted project; edits also require approved demo verification. Missing,
other-owner and non-editable records have recovery/read-only states. Saved updates
are shared with client review and reset on refresh. Browser acceptance remains pending.

**Homepage navigation update (24 October 2026):** LandingHeader groups discovery under Hire Talent (landing student previews, `/services`, client registration) and Find Work (`/projects`, student registration, How it works). It is used by the homepage and authentication screens; other public pages retain the shared PublicHeader. The landing Hire/Work toggle selects local prototype discovery mode; it does not assign an account role or change access permissions. No new route is introduced.

Task 01 (22 October 2026) adds React Router through `frontend/src/App.jsx`, with one route registry at `frontend/src/app/routeConfig.js` and one in-memory session provider.

**Client proposal review:** `/client/projects/:projectId/proposals` now renders a
client-only, ownership-checked marketplace review screen, linked from My projects.
P-17 currently covers incoming offers, search/status filters, sorting, comparison
of two or three proposals, and simulated shortlist toggles. Closed/selected/cancelled
project reviews are read-only. Confirmed accept/reject is available for submitted
or shortlisted offers on open projects. Acceptance selects the project and links
one demo order awaiting payment. `/orders/:orderId` renders a project-only summary
for its client and selected student; service-order/full-workspace views and profile
navigation remain pending. Missing and other-client records show a generic recovery
state without proposal details. State changes reset to fixtures on refresh.

**24 October 2026 project creation:** P-16 creation is available at
`/client/projects/new`, using a standalone marketplace shell and the active-client
guard. Post a project in the catalogue opens the form; visitors use the existing
login return flow. Valid briefs can be previewed, edited before publication, and
published to the in-memory demo catalogue. Publish requires an approved client
demo session; the MIU/external-client distinction is pending. Editing previously
published projects at `/client/projects/:projectId/edit` is available for owned
open projects. Owned private drafts can be resumed there too. `/client/projects`
lists the current client's projects and drafts, with empty and unavailable states.
Incomplete drafts can be saved without appearing publicly; all saved changes reset
on refresh. Selected, closed and cancelled project edits remain unavailable.
My projects offers confirmed Close (open projects) and Cancel (open/closed
projects) actions. Any linked project order or accepted proposal blocks both.
Closed/cancelled details remain directly accessible but cannot receive proposals
or appear in open discovery. No additional routes are introduced.

**24 October 2026 public integration:** `/` renders Member 1's replacement
LandingPage with LandingHeader and its page-owned footer. The retired Member 4
homepage is removed. Other public pages retain the shared PublicLayout.
`/about`, `/how-it-works`, `/terms`, `/privacy`,
`/loading-demo`, and `/error-demo` are registered public pages. The existing
HowItWorksSection remains on the full guide page; the homepage uses Member 1's timeline.
Terms and Privacy still explicitly show unapproved-content placeholders.
Only implemented destinations are passed to the public navigation and landing
actions; service/profile detail actions remain unavailable. Public route changes
update the title, scroll position, and focusable main landmark. Signed-in active
accounts see a role-specific My workspace link. The shared in-memory AuthProvider
is preserved across navigation; demo session controls remain in a collapsed panel
below public content. Project catalogue/details and proposal routes keep their
standalone shells to avoid nested landmarks. Authentication/admin layouts and role
guards remain unchanged. Language integration awaits the approved text offered by
the team; English remains the current interface.

Proposal submission update: the student-only `/projects/:projectId/propose` form
now validates and stores a simulated proposal in memory for approved students.
It displays confirmation and prevents duplicate records within the current preview.
Refreshing clears submitted preview records. Optional attachments use allowlisted
fictional metadata only; no real file is read, uploaded, downloaded, or stored.

Proposal entry increment: `/projects/:projectId/propose` is a student-only route,
hidden from global navigation. Open project details link to it. The entry page
handles missing/closed projects and explains verification requirements. Submission
rechecks verification, project status, and required form values.

Task 01 (22 October 2026) adds React Router through `frontend/src/App.jsx`, with one route registry at `frontend/src/app/routeConfig.js` and one in-memory session provider.

- Public website: `/`, `/about`, `/how-it-works`, `/terms`, `/privacy`.
- Public feedback demos: `/loading-demo`, `/error-demo` (not global-navigation entries).
- Public service catalogue: `/services` (details and ordering remain later work).
- Public marketplace previews: `/projects` renders the Projects Catalogue (P-06), and `/projects/:projectId` renders Project Details (P-07).
- Mock authentication forms: `/login`, `/register`, `/register/role`, `/forgot-password`, `/reset-password` (Task 02).
- Student/client placeholders: `/verify`, `/verify/pending`.
- Role-specific dashboard placeholders: `/student/dashboard`, `/client/dashboard`, `/admin`, and the five committee root routes listed above.
- Registered-user placeholder: `/notifications`.
- Routing feedback: `/access-denied`, `/session-expired`, and a catch-all not-found page.

Routing, role checks, layouts, demo sessions, mock authentication, public website
pages/feedback demos, the projects catalogue/details, and simulated proposal
submission are implemented. Terms/Privacy content remains explicitly pending.
Other registered feature pages remain labelled placeholders, including dashboards,
identity verification and services. Remaining proposed routes show the catch-all page.

Visitors attempting protected routes go to `/login`; authenticated users with the wrong role go to `/access-denied`; explicitly expired sessions go to `/session-expired`. Guards retain the requested URL in router location state (`from`). After login, Task 02 returns to that URL only when it is an internal registered route allowed for the user, excluding authentication and routing-feedback pages. Other destinations fall back to the role dashboard. Registration opens login after creating the in-memory account. All recovery messages explicitly describe simulated behavior without secure tokens or email delivery.

`PublicWebsite` adapts the shared PublicLayout to the router, available destinations,
and mock session. `AppLayout`, `AuthLayout` and `AdminLayout` retain their existing
roles. `/projects` and `/projects/:projectId` use their existing full-width marketplace
shells through a standalone outlet. Verification gating remains action-specific;
automatic expiry timing is deferred. No production authorization is claimed.

**23 October 2026 integration:** A React Projects Catalogue preview (P-06) now renders
at the public `/projects` route through `frontend/src/app/router.jsx`. It shows fictional open projects with working text,
category, budget, skill, and sort controls, plus active filters, temporary
saved-item state, a responsive marketplace layout, and an empty state. Catalogue
cards navigate to the public `/projects/:projectId` Project Details preview,
including a missing-record state and navigation back to `/projects`. Rendered-route
tests guard both marketplace routes. Proposal submission uses the student-only route
described above; its safe mock attachment selection is implemented, while
visual/browser verification remains tracked in the Projects and Proposals module.

## 4. Layout Groups

**Public/authentication shell update:** Authentication pages use the new LandingHeader without developer route lists or session controls. Public pages retain collapsed demo session controls for integration testing. `/register` starts at Student/Client cards, then opens the corresponding query-selected form. A valid simulated forgot-password request opens `/reset-password`.

**23 October 2026 landing page:** `/` renders the “MIU Freelance desktop” Figma frame (`8:2656`) through `features/public/LandingPage.jsx`. The existing public header, session/logout behavior and authentication flows are preserved; only the home main-content container becomes full width. Hero search/category controls filter the three fictional featured examples locally, with a clear-filters recovery state. Find Work and Browse all jobs open `/projects`; Post a Job opens client registration because project posting is not implemented. Job/profile buttons open labeled native demo dialogs, not new record routes. Footer section links work in-page; Help, Contact and policy buttons explain the current prototype limits. Services remains discoverable through the existing header and footer. No protected action, shared marketplace record or access policy changes.

The 23 October delivery notes below describe the original isolated component
handover. Their pending route-registration statements are superseded by section 3's
24 October integration; remaining translation, policy-content and manual acceptance
dependencies still apply.

**23 October 2026 — Member 4 landing/discovery:** `LandingPage.jsx` now provides
public page content for `PublicLayout`, including hero/search, project and service
discovery, minimal fictional student examples, and explicitly planned benefits.
It is not mounted in `App.jsx`; `/` remains the catalogue preview and is not a
completed routed landing page. Member 1 must connect approved available
destinations. The How It Works section remains a supplied integration slot;
its completed branch is not recreated here. Profile enrichment depends on
Member 5. See [the landing contract](UI_COMPONENTS.md#member-4--landing-page-and-discovery)
for the data, callback, state, and Figma adaptation details.

**23 October 2026 — Member 4 public shell:** reusable `PublicHeader`,
`PublicFooter`, and `PublicLayout` components now exist. They are not mounted in
`App.jsx` and register no routes. Destinations are supplied by the integrating
code; missing destinations remain text. Member 1 must connect available routes
and session-aware integration. Member 2's catalogue retains its existing
header/main/footer and must not be wrapped unchanged in a second public shell.
Safety & Trust and Community Guidelines in the approved footer have no confirmed
route mapping. See [the public-shell contract](UI_COMPONENTS.md#member-4--public-shell)
for destination keys, design differences, and verified checks. This update does
not mark any proposed route as implemented.

**23 October 2026 — Member 4 feedback demos:** content-only
`features/public/LoadingDemoPage.jsx` and `features/public/ErrorDemoPage.jsx`
are ready for the assigned `/loading-demo` and `/error-demo` paths. **These
routes are not registered.** Member 1 owns registration inside PublicLayout,
available navigation destinations, and route integration checks. Both pages use
local, explicitly labeled Phase 1 demonstrations with working controls for
loading completion/reset, error retry/reset, and empty recovery. They introduce
no APIs, guards, mock sessions, or marketplace contract changes. See the
[state component contract](UI_COMPONENTS.md#member-4--loading-empty-and-error-states).

**23 October 2026 — Member 4 public information pages:** content-only
`features/public/AboutPage.jsx` and `features/public/HowItWorksPage.jsx` now
provide the assigned project introduction and planned project/service journey
explanations. **`/about` and `/how-it-works` are not registered.** Member 1 owns
their PublicLayout composition, route registration and available destinations.
No App, router, authentication, marketplace or profile implementation changes.
Both pages identify Phase 1 limitations; their copy derives from the documented
project baseline and their full-page layouts still require team approval because
dedicated public page specimens are absent from the current Figma file.
HowItWorksPage accepts the separately completed section through the optional
`howItWorks` React-node slot. That dependency is not copied or cherry-picked;
the detailed planned journeys remain usable without it. See the
[public information page contract](UI_COMPONENTS.md#member-4--public-about-and-how-it-works-pages)
for content sources, properties, verification and outstanding integration.

**23 October 2026 — Member 4 policy placeholders:** content-only
`features/public/TermsPage.jsx` and `features/public/PrivacyPage.jsx` reuse the
public information page layout. **`/terms` and `/privacy` are not registered.**
Member 1 owns route registration, PublicLayout composition and supplied
destinations. Both pages visibly state that they are placeholders awaiting
team-approved content; no approved legal/policy text was found in the repository.
They introduce no consent controls or claims about actual privacy practices.
Final policy text remains blocked on team approval (OD-17 in Known Issues).
See the [policy placeholder contract](UI_COMPONENTS.md#member-4--terms-and-privacy-placeholders)
for approval gaps, properties and verification. This update does not mark either
route or any legal/privacy obligation as complete.

### Public Layout

Landing, catalogues, service/project details, informational pages.

### Authentication Layout

Registration, login, password reset, onboarding.

### Student Layout

Student dashboard, proposals, services, orders, profile settings.

### Client Layout

Client dashboard, project management, proposals, checkout, orders.

### Administrative Layout

Super Admin and five committees, with role-aware navigation.

## 5. Navigation Rules

- Public content is discoverable without a mock account where appropriate.
- Protected pages check the intended role.
- Committee routes are unavailable through public registration.
- Users should receive clear access-denied messages.
- Order detail pages require authorization to the related order.
- Deep links should work during a frontend demo.
- Dynamic record routes such as `/projects/:projectId` are opened from their related records and are not shown as literal global-navigation links.
- Navigation labels should align with the approved design.

## 6. Prototype Tracking

Each SRS prototype should eventually have:

- Screenshot or Figma frame
- Primary role
- Main actions
- Validation states
- Empty/loading/error states where relevant
- Related functional requirement IDs
- Implementation/testing status

## 7. Route Change Process

Before changing a shared path:

1. Identify linked pages and navigation actions.
2. Notify affected module owners.
3. Update route configuration.
4. Update tests.
5. Update this document.
6. Update screenshot references if needed.

## Related Documents

### Freelancer directory implementation

`/freelancers` is connected to the public shell and navigation. It browses providers of published services with search, category, skill and EGP starting-price filters. Cards link to registered `/services/:serviceId` pages. Full student-profile links await Member 5 identity reconciliation; this route does not complete FR-C06. See [Freelancer Discovery](../06-MODULES/FREELANCER_DISCOVERY.md).

- [SRS](../01-PROJECT/SRS.md)
- [User Roles](../02-REQUIREMENTS/USER_ROLES_AND_PERMISSIONS.md)
- [Frontend Architecture](../04-ARCHITECTURE/FRONTEND_ARCHITECTURE.md)
