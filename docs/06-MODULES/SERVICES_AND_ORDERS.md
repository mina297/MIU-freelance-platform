
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

Service details, profiles, publishing, package selection and ordering remain
separate increments. No `/services/:serviceId` links or checkout actions are
fabricated. New fictional records preserve existing service/order IDs and totals.
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

## 6. Two Order Sources

Orders may originate from:

### Project Order
Created after a client accepts a student proposal.

The current frontend demo creates an immutable project Order at simulated proposal
acceptance. It preserves project/proposal and participant IDs, copies the agreed
EGP price and delivery-day estimate, and starts at `awaiting_payment`. The shared
`orderStore` exposes observable snapshots; the default order selectors include new
records alongside fixtures. Duplicate acceptance returns the same order.

`/orders/:orderId` is currently a read-only project-order handoff for its client
and selected student. Missing, unrelated, and service-order IDs show an unavailable
state. Full collaboration and service-order views remain later work. No payment,
escrow funding, notifications or delivery-start event is implemented by acceptance.
Member 3's future financial screens can consume `orderStore.getSnapshot()` and
`orderStore.subscribe`; all demo changes clear on refresh.

### Service Order
Created after a client selects a service package and places an order.

Both should use a shared order management model.

## 7. Shared Order Workspace

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
