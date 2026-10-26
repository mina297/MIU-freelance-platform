
---
title: Services and Orders Module
type: module
status: planned
tags: [MIU, services, orders]
---

# Services and Orders

## 1. Purpose

Support direct service purchasing and shared order management.

The service marketplace is inspired by Khamsat.

**SRS references:** FR-S07–FR-S11, FR-C07–FR-C12.

## 2. Student Services

### Current student management demonstration — 24 October 2026 (FR-S07; P-13)

Student-only `/student/services`, `/student/services/new` and
`/student/services/:serviceId/edit` provide an owned listing workspace and a
validated form with editable package/extra rows. Students define package names,
scope, newline-delimited deliverables, positive EGP prices and positive whole-day
delivery estimates. Extras permit non-negative EGP amounts and whole added days.
Category/skill IDs must come from the shared lists. Amount precision and text
lengths are bounded for safe demo input; no fixed package-count/tier policy is added.

The form validates before a private preview and saving. At least one complete
package is required even for saved drafts; incomplete drafts are not persisted.
Saving a new service creates a private draft. Editing preserves its draft,
published or paused status. Unsaved form values clear on leaving/account switching.
Publishing, pausing and removal use confirmation dialogs; cancel changes nothing.
Active students may draft/preview/save and pause eligible listings, but approved
verification is required to publish or edit a published listing. Every store
mutation rechecks current ownership, activity, status and linked orders.

As a conservative demo safeguard while historical pricing/cancellation rules are
unresolved, any linked service order blocks editing/removal. Pause remains allowed
and does not cancel/reprice existing orders. Removal is session-only, with no undo;
it removes an uncommitted listing and its packages/extras. Refresh restores fixtures.
Re-publishing a paused service requires approved verification and valid saved terms.
Package/extra IDs belonging to the same listing are retained; foreign IDs cannot be
reassigned. No real upload, portfolio edit, review, verification or financial action
is performed. Existing portfolio references are preserved unchanged.

`serviceStore` exposes immutable data snapshots and subscriptions. Catalogue,
public details and default service selectors use those same live records. Drafts
and paused services are excluded from public views; new publications/edits and
pauses/removals update the public UI without a refresh. Explicit fixture injection
remains available for tests/previews. Runtime registrations contribute only a safe
public ID/display-name adapter, not credentials or invented profile facts.
All changes reset on refresh. Manual browser/keyboard/responsive/focus acceptance
is deferred at Mina's request until the remaining Member 2 implementation is done.

Students can:
- Create a service
- Edit service information
- Preview a listing
- Publish a service
- Pause a service
- Remove a service when permitted
- Configure packages and allowed extras

## 3. Service Information

A service can include:
- Title
- Description
- Category
- Skills
- Portfolio examples
- Delivery time
- Package options
- Optional extras
- Price in EGP

## 4. Service Packages

The SRS explicitly includes service packages and extras.

A package may specify:
- Name
- Scope
- Included deliverables
- Delivery time
- EGP price

Extras may provide optional additions.

Exact package names, limits, and pricing rules need confirmation.

## 5. Client Service Discovery

### Current catalogue demonstration — 24 October 2026 (FR-V01/V02, FR-C07; P-09)

`/services` now renders the public ServicesCatalogue inside the existing public
shell, preserving one main landmark and session-aware navigation. It reuses
shared controls, Card, loading/error/empty states and centralized EGP formatting.
Published fictional service fixtures support combined title/description search,
category, skill and starting-price filtering, reset and deterministic newest,
price and starting-package delivery sorting. Paused services stay hidden.

Starting price is the lowest-priced valid package; its delivery estimate comes
from that same package. Extras are excluded. Missing/invalid package prices remain
unavailable, never zero; numeric filters exclude these listings and numeric sorts
place them last. A native disclosure previews that starting package's scope.
The catalogue uses no invented ratings, verified badges or profile links.

Service details are now connected through `/services/:serviceId` as described
below. Student publishing/management is described in section 2 and simulated
package selection/ordering in section 6. Profiles and checkout remain separate
increments; no payment actions are fabricated. New fictional records preserve
existing service/order IDs and totals.
Loading/error props are presentation states for future adapters, not a real fetch.
Browser keyboard/mobile/visual acceptance and P-09 captures remain pending.

Clients can:
- Browse the catalogue
- Search services
- Filter listings
- Open student profiles
- Review package details
- Select a package
- Select permitted extras
- View the final EGP total
- Place a service order

### Service details and read-only package comparison — 24 October 2026 (FR-C07/C08; P-10)

`/services/:serviceId` is a public route hidden from global navigation. Catalogue
titles and View service links open the corresponding listing within the router.
Missing, draft and paused IDs show a generic unavailable state without listing
content. The existing public shell, session provider and one main landmark remain.
Dynamic public titles now match route patterns rather than exact path strings.

The page shows the supplied description, category, skill labels and student name,
with a starting-package overview and a horizontally scrollable native comparison
table. Columns share the catalogue's valid-package ordering, so displayed starting
price and delivery describe the same package. Scope, included deliverables, EGP
amounts and delivery estimates are shown without creating a selection or order.
Additional fixture packages illustrate comparison; existing order/package IDs and
the service order's EGP total remain unchanged. No package count limit is imposed.

Extras display their own additional EGP price and days; none are included in the
starting amount or automatically selected. Invalid package/extra amounts or delivery
values are omitted; empty packages/extras and missing student metadata have explicit
fallbacks. Portfolio media, full profiles, ratings, reviews and verification are not
connected, and no claims or broken links are invented. Ordering/checkout remain
future work. Loading/error props demonstrate presentation, not a backend request.
Keyboard/table-scroll, mobile visual acceptance and P-10 screenshot capture remain pending.

## 6. Two Order Sources

### Current simulated service ordering — 24 October 2026 (FR-C08/C09; P-10/P-18 handoff)

Client-only `/services/:serviceId/order` is linked from available public service
details. An active, approved demo client chooses one current package and unique
allowlisted extras. Requiring all demo clients to be approved is conservative while
the MIU/external-client-origin contract remains unresolved. Students/visitors cannot
place orders; paused/draft/missing services and invalid/missing terms are blocked.

A pure quote sums money in integer EGP cents and adds whole package/extra days,
rejecting invalid precision, negative values, duplicate/foreign extras and unsafe
totals. Delivery is an estimate, not a started deadline. The review dialog lists
current scope, amounts and extras; cancel creates nothing. Reset selection offers
recovery when a live package/extra disappears. Final confirmation reads serviceStore
again and rejects changed price/scope/extra terms until the client reviews them.

`orderStore.createFromService(serviceId, selection, session, submissionId,
readServices)` validates against the supplied live snapshot getter. A request token
is scoped to its client; identical confirmation retries return one existing order,
while different terms cannot reuse that token. Independent new order forms can
intentionally order the same service again. Request keys are in-memory demo
idempotency identifiers, not authentication credentials or production guarantees.

Creation records one immutable service Order with package/extra IDs, combined EGP
amount, combined delivery days and `serviceTerms` snapshots of scope/deliverables
and line-item amounts. Status starts at `awaiting_payment`; the service stays
published. No payment, escrow funding, notification or delivery-start event occurs.
Live orders immediately feed the existing listing-edit/removal commitment guard.

`/orders/:orderId` now supports both source types through OrderSummary, preserving
the existing project view. Only the owning client or assigned student can see a
service summary. New orders show copied terms; older fixtures without a historical
snapshot show agreed totals and explain that historical package terms are absent,
rather than substituting current listing terms. Full order lists/workspace and
Member 3 checkout/payment/escrow UI remain separate increments. Refresh resets all
runtime orders and selections. Browser acceptance remains deferred by the team lead.

Orders may originate from:

### Project Order
Created after a client accepts a student proposal.

The current frontend demo creates an immutable project Order at simulated proposal
acceptance. It preserves project/proposal and participant IDs, copies the agreed
EGP price and delivery-day estimate, and starts at `awaiting_payment`. The shared
`orderStore` exposes observable snapshots; the default order selectors include new
records alongside fixtures. Duplicate acceptance returns the same order.

`/orders/:orderId` preserves the read-only project-order handoff for its client
and selected student and now supports the service summary described above.
Missing/unrelated orders show an unavailable state. Full collaboration remains
later work. No payment,
escrow funding, notifications or delivery-start event is implemented by acceptance.
Member 3's future financial screens can consume `orderStore.getSnapshot()` and
`orderStore.subscribe`; all demo changes clear on refresh.

### Service Order
Created after a client selects a service package and places an order.

Both should use a shared order management model.

## 7. Shared Order Workspace

### Current collaboration increment — 24 October 2026 (FR-S09/S10, FR-C10/C11; P-19)

The existing `/orders/:orderId` project/service summaries now compose a shared
OrderCollaboration panel with Requirements, Messages and Progress & activity tabs.
There is still one main landmark. Guards and workspace-store read/mutation checks
admit only the active owning client and assigned student; wrong roles, suspended,
expired, missing and unrelated accounts cannot read private notes or conversations.
Account/order switching remounts local drafts and tab state. Pending verification
does not hide an already assigned participant's collaboration history.

Client requirements are coordination notes, not changes to agreed package scope,
price, delivery or status. For this demo clients can save in awaiting_payment,
funded, in_progress and revision_requested states. They are read-only in delivered,
disputed, completed and cancelled states; students always read them without editing.
Requirements have monotonic versions and stale-version rejection. Saved notes and
allowlisted sample IDs are visible to both participants. Updating notes records a
workspace event, not a financial or governance audit decision.

Participant messages are allowed after order creation, including awaiting_payment,
but never start work/funding. Completed/cancelled orders retain readable history
and block new messages. Required nonblank text is bounded (2,000 characters for
messages; 5,000 for notes). Optional attachments use only fixed fictional metadata;
there is no file input, upload, download, actual storage or notification delivery.
Messages copy safe sender ID/name/role and timestamps; HTML is rendered as text.
Client/order-scoped send request keys prevent duplicate retry records and reject
reusing a request for different content. Editing/deleting messages is not included.

`orderWorkspaceStore` owns immutable workspace snapshots separately from orderStore.
Its `read`, `actionError`, `saveRequirements` and `sendMessage` methods recheck live
orders, participants and states at call time. No collaboration action changes order
amounts, copied terms, funding, deadlines or status. The activity log shows creation
and recorded workspace events chronologically, preserving insertion order for equal
timestamps. It does not invent milestone completion, payment history or percentages.
No service/project start date or deadline is inferred from a status or estimate.
Delivery/revision/completion controls and financial flows remain later increments.
Browser tab/keyboard/focus/mobile acceptance remains explicitly deferred by Mina.

### Role-specific order lists — 24 October 2026 (FR-S08/S09; FR-C11; P-14/P-19 entry)

`/student/orders` and `/client/orders` are active-role standalone routes. The shared
OrdersList uses orderStore snapshots, so project-acceptance and service-confirmation
orders appear immediately without duplicating data. Ownership is checked before
joins, queries, filters, sorting, counts or amounts. Account/role switching remounts
local filters; pending verification does not hide existing owned orders.

Search combines order reference, title, counterpart name and saved package name.
Status/source filters combine with search; newest/oldest/agreed-amount sorts are
deterministic, with reset and useful empty/loading/error presentations. Cards link
to the participant-protected `/orders/:orderId` summary, and both order-source
summary pages now link back to the correct role's order list. Missing counterpart
or listing metadata uses explicit fallbacks without fabricated profile claims.
Service snapshot titles are preferred; legacy fixture titles are labelled as
current listing text, not historical scope. No public profile links are invented.

Metrics show all owned-order count, awaiting-payment count and agreed order value
across all statuses, independent of filters. Integer-cent summation rejects unsafe
or invalid aggregates as unavailable; these amounts are not spending, earnings,
paid balances or escrow holdings. No list/filter action mutates an order. Full
workspace, delivery and financial status flows remain later work. Manual keyboard,
mobile/visual and screen-reader acceptance remains deferred at Mina's request.

An order workspace includes:
- Order participants
- Requirements
- Agreed EGP amount
- Delivery deadline
- Milestones where applicable
- Messages
- Attachments
- Delivery submissions
- Revision requests
- Order status
- Escrow status

## 8. Delivery Flow

### Current simulated delivery lifecycle — 24 October 2026 (FR-S11; FR-C12; P-19)

Both order sources expose a Delivery & revisions tab within `/orders/:orderId`.
An active approved assigned student can submit a handover note and optional fixed
fictional sample IDs only while `in_progress` or `revision_requested`. Awaiting
payment/funded orders cannot start work through this UI; funding/activation belongs
to a separate approved integration. Use the fictional in-progress `order_001` with
Omar Nabil to demonstrate the flow. No fake activation or financial bypass is added.

Submission appends an immutable delivery and changes the order to `delivered`.
The owning active client may request revisions with a required reason, changing
the latest submission to revision_requested and the order to that status. The
student resubmits as a new delivery, preserving prior handovers and revision notes.
The active approved demo client can accept the latest submitted delivery, setting
it accepted and the order completed with completedAt. Requiring approved demo
verification for acceptance is conservative while the client-origin policy is
incomplete. No revision-count limit, deadline, auto-completion or financial rule is
invented. Accepted deliveries cannot be reopened by these actions.

Every action requires confirmation, current participation/role/status and the
latest reviewed delivery ID. Store methods recheck all conditions; changed/stale
review targets are rejected. Sender/order/action-scoped request IDs make identical
retries harmless and reject changed payloads using the same request. Text is
bounded to 3,000 characters; attachments are allowlisted metadata, never real files.
Order prices, participant/source/package IDs and saved serviceTerms remain unchanged.
Completion records acceptance only: no payment, escrow release, fee, payout,
notification, real upload or automatic review is performed.

orderStore publishes delivery/status changes to lists, summaries and workspace
permissions. Completed/cancelled messages and notes remain read-only; requirements
reopen during revision_requested as coordination notes, not contractual changes.
Recorded delivery events join the workspace timeline without inventing historical
funding or milestones. Manual browser/dialog-focus/keyboard/mobile acceptance
remains deferred at Mina's request. Production server-side authorization remains
later work; these are frontend demonstrations only.

1. Order becomes active according to the applicable funding rules.
2. Freelancer reviews requirements.
3. Participants communicate.
4. Freelancer completes the work.
5. Freelancer submits delivery.
6. Client reviews delivery.
7. Client accepts or requests revisions.
8. Order reaches an appropriate completion state.
9. Reviews may become available.

## 9. Proposed Order Statuses

- Awaiting Payment
- Funded
- In Progress
- Delivered
- Revision Requested
- Completed
- Disputed
- Cancelled

These labels are proposed, not final approved enums.

## 10. Phase 1 Expectations

Demonstrate:
- Service catalogue
- Service detail and package selection
- Service editor
- Service order creation
- Student/client order lists
- Order workspace
- Delivery submission
- Revision interaction
- Order completion

Use shared fictional mock records.

Checkout now reads live service orders from the canonical `orderStore`. Initial
50% funding saves an immutable receipt on the order and changes its status to
In Progress in one update. Checkout, `/orders/:orderId`, role-specific order lists,
`/client/payments/overview` and `/client/payments` observe that same state; the
design-fixture `/client/dashboard` remains separate. Newly created orders use
saved package/extra terms, while older fixtures retain their compatible lookup.
The existing workspace supports delivery, revision and acceptance/completion with
its verification and ownership checks. Completion does not release escrow or
charge the remaining balance. Seed records and project-order behavior are
preserved. See [Checkout and Payment UI](CHECKOUT_PAYMENT_UI.md).

## 11. Open Decisions

- Maximum revision count
- Package naming and constraints
- Service cancellation rules
- Delivery extensions
- Automatic completion rules
- Messaging limitations
- Final dispute resolution and financial consequences

## 12. Dependencies

- Profiles
- Authentication
- Projects and proposals
- Checkout/escrow
- Reviews
- Notifications
- Support and disputes

## Related Documents

- [Projects and Proposals](PROJECTS_AND_PROPOSALS.md)
- [Payments and Escrow](PAYMENTS_AND_ESCROW.md)
- [User Flows](../02-REQUIREMENTS/USER_FLOWS.md)
