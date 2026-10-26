
---
title: Payments and Escrow Module
type: module
status: sandbox-concept
tags: [MIU, payments, escrow]
---

# Payments and Escrow

## 1. Purpose

Define planned EGP financial workflows for projects and services.

**SRS references:** FR-C09, FR-C13, FR-S12, FR-FC02–FR-FC05, NFR-10, NFR-13, NFR-14.

## 2. Critical Restriction

> [!WARNING]
> Phase 1 does not collect, hold, transfer, or release real money. Payment and escrow functionality is simulated or presented as a sandbox concept.

Production processing requires approved payment services and appropriate institutional, financial, and legal arrangements.

## 3. Currency

**EGP only.**

The platform does not offer currency switching or conversion.

Financial screens may display:
- Project budget
- Proposal price
- Service package price
- Extras
- Order amount
- Platform fees
- Refund amounts
- Payout status
- Escrow status

## 4. Planned Checkout Flow

**Current service-order handoff:** `/services/:serviceId/order` confirms package
and extra terms and creates one in-memory `awaiting_payment` Order. Its
participant-only `/orders/:orderId` summary explicitly states no money was
collected, escrow funded or delivery started. This is an order-creation handoff,
not Member 3's checkout/payment simulation or provider integration. No fees or
financial status changes are invented by this increment.

1. Client selects a proposal or service package.
2. System presents order summary.
3. System calculates and displays the EGP amount.
4. Client confirms the order.
5. The planned payment provider processes an approved payment attempt.
6. The system records the result.
7. An appropriate order/escrow status is displayed.

Phase 1 replaces external payment processing with mock outcomes.

## 5. Escrow Concept

The intended purpose of escrow is to support controlled payment handling during work delivery.

Conceptual stages:
- Awaiting Funding
- Funded/Held
- Work in Progress
- Delivery Submitted
- Release Pending
- Released
- Refunded
- Disputed

These are illustrative statuses, not a finalized production state machine.

The platform must not claim to act as a regulated custodian of funds without a valid legal and provider arrangement.

## 6. Transaction History

Relevant financial records may include:
- Transaction ID
- Order ID
- User
- EGP amount
- Transaction type
- Status
- Timestamp
- Payment-provider reference
- Related refund/payout information

## 7. Finance Committee

Authorized members may:
- View transactions
- Review escrow states
- Review refund records
- Examine payout and fee information
- Review exceptions
- Record permitted sandbox decisions
- Escalate cases outside their authority

The exact production authority for approving releases/refunds remains to be defined.

## 8. Support and Disputes

When a dispute involves payment:
1. Support reviews the complaint.
2. Evidence and communication history are examined.
3. Financial issues are escalated appropriately.
4. Authorized decision makers handle the case.
5. Required audit entries are recorded.

## 9. Production Safety Requirements

Future integration must consider:
- Verified payment provider
- Sandbox/production separation
- Webhook authenticity
- Idempotency
- Reconciliation
- Sensitive-data minimization
- Refund approval policy
- Auditability
- Error handling
- Safe retries
- Regulatory compliance

## 10. Phase 1 Demonstration

Provide:
- Checkout screen
- EGP order summary
- Simulated success/failure payment states
- Escrow timeline
- Transaction list
- Refund status
- Finance Committee dashboard

Use fictional transaction references.

The `/Checkout` entry and client-only `/checkout/:orderId` implement the service
checkout demonstration described in [Checkout and Payment UI](CHECKOUT_PAYMENT_UI.md).
The current frontend task funds an initial 50%, records it as held in mock escrow,
and leaves 50% unpaid. Successful demo payments atomically save an `initialPayment`
receipt and advance the canonical order to In Progress. Checkout, the workspace,
order lists, `/client/payments/overview` and `/client/payments` share that state.
Existing delivery acceptance can complete the order without changing the held
funds or unpaid remainder. No real card
credentials, money movement, automatic release or remaining-balance charge exists.
Approved production fees and financial authorities remain open decisions.

## 11. Open Decisions

- Payment provider
- Commission structure
- Escrow custody arrangement
- Refund authorization thresholds
- Payout schedule
- Dispute-related hold rules
- Cancellation settlement rules
- Tax/accounting requirements

## Related Documents

- [SRS](../01-PROJECT/SRS.md)
- [Business Rules](../02-REQUIREMENTS/BUSINESS_RULES.md)
- [Admin and Committees](ADMIN_AND_COMMITTEES.md)
