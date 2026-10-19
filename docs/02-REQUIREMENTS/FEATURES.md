
---
title: Platform Features
type: requirements
status: baseline
tags: [MIU, features, requirements]
---

# MIU Freelance Platform — Features

## Purpose

This document organizes platform capabilities into feature modules.

The definitive requirements are recorded in [SRS v1.1](../01-PROJECT/SRS.md). A feature being documented does not mean that it is already implemented.

## 1. Public Experience

**Requirements:** FR-V01–FR-V05

Features:
- Landing page
- Projects catalogue
- Services catalogue
- Search and filtering
- Public freelancer discovery
- Login and registration links
- Interface language switching
- Informational pages

## 2. Authentication and Accounts

**Requirements:** FR-S01, FR-C01, FR-A01, FR-VC01, FR-MO01, FR-FC01, FR-SD01, FR-AQ01

Features:
- Student account registration
- Client account registration
- Login and logout
- Forgot/reset password
- Account status display
- Role-based navigation
- Profile and session settings
- Admin-managed committee accounts

Committee members cannot self-register.

## 3. Identity Verification

**Requirements:** FR-S02, FR-C02, FR-VC02–FR-VC05

Features:
- Verification instructions and consent
- MIU ID path for university users
- Government-issued ID path for external clients
- Planned live camera verification
- Face and identity document presentation
- Liveness/document verification assistance
- Pending, approved, rejected, and resubmission states
- Committee review and decision recording

Phase 1 verification is simulated.

## 4. Projects and Proposals

**Requirements:** FR-S04–FR-S06, FR-C04–FR-C06

Features:
- Browse and search projects
- View project details
- Create and edit client projects
- Configure budget and deadline
- Submit proposals
- Proposal price and delivery estimate
- Proposal editing and withdrawal
- Proposal comparison and shortlisting
- Accept or reject proposals
- Create a project order after selection

All prices use EGP.

## 5. Services Marketplace

**Requirements:** FR-S07, FR-C07–FR-C08

Features:
- Browse services
- Filter by category or relevant skills
- View service details
- Create and edit services
- Preview, publish, pause, or remove a listing
- Configure predefined service packages
- Configure permitted extras
- Choose package and extras
- Place a service order

## 6. Profiles and Reputation

**Requirements:** FR-S03, FR-S13, FR-C03, FR-C14

Features:
- Student profile
- Client profile
- Skills and biography
- Portfolio items
- Availability
- Review and rating display
- Review submission following eligible completed work
- Profile management

## 7. Orders and Communication

**Requirements:** FR-S08–FR-S11, FR-C10–FR-C12

Features:
- Order workspaces
- Order requirements
- Messages and attachments
- Deadlines and milestones
- Delivery submission
- Revision requests
- Delivery acceptance
- Order completion
- Order history and status

## 8. Payments and Escrow

**Requirements:** FR-S09, FR-S12, FR-C09, FR-C13, FR-FC02–FR-FC05

Features:
- EGP checkout
- Sandbox funding simulation
- Escrow status
- Transaction records
- Receipts
- Refund and payout status
- Platform fees
- Finance Committee review
- Exception and escalation handling

No real money movement is part of Phase 1.

## 9. AI and Translation

**Requirements:** FR-S04, FR-S15, FR-C07, FR-C16, FR-AQ02–FR-AQ05

Planned features:
- Skills-based job recommendations
- Freelancer/service recommendations
- User assistance chatbot
- Comment/review moderation assistance
- AI feedback and quality review
- Interface and message translation
- Human review and escalation paths

Phase 1 may display example results generated from fixtures.

## 10. Support and Disputes

**Requirements:** FR-S14, FR-C15, FR-SD02–FR-SD05

Features:
- Create support tickets
- Submit disputes
- Attach supporting evidence
- View ticket status
- Review communication history
- Committee notes and decisions
- Escalation handling

## 11. Super Admin

**Requirements:** FR-A01–FR-A10

Features:
- Platform activity dashboard
- User account management
- Committee account creation
- Committee assignment
- Role and permission management
- Account suspension/reactivation
- Escalation management
- Audit record review
- Platform settings

## 12. Committee Dashboards

### Verification
Identity and profile case review.

### Marketplace Operations
Projects, proposals, services, reviews, and content reports.

### Finance
Transactions, escrow, refunds, payouts, and fees.

### Support and Disputes
Tickets, evidence, communication, and case resolution.

### AI and Quality
Matching outcomes, chatbot errors, moderation quality, and feedback.

## 13. Cross-Cutting Features

- Notifications
- Account settings
- Responsive layouts
- Loading states
- Empty states
- Validation errors
- Access-denied states
- Auditability
- Accessible interface controls
- EGP-only formatting

## Feature Status Convention

Use:
- `Planned`
- `Prototype`
- `Simulated`
- `Implemented`
- `Verified`

Do not mark a feature as `Implemented` without inspecting the current code and confirming its behavior.

## Related Documents

- [SRS](../01-PROJECT/SRS.md)
- [User Flows](USER_FLOWS.md)
- [Business Rules](BUSINESS_RULES.md)
- [Modules](../README.md)
