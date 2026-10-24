
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

The checkout increment now reads the existing service order/package/extra fixture
and overlays successful initial demo funding through a shared payment store.
`/client/dashboard` and `/client/payments` show the same owned order and financial
records as checkout. Initial 50% funding changes the service to In Progress with
Partially Paid — Escrow Held status. Delivery acceptance, completion and remaining
payment/release workflows are not implemented by this increment. Marketplace
seed records and project orders are preserved. See [Checkout and Payment UI](CHECKOUT_PAYMENT_UI.md).

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
