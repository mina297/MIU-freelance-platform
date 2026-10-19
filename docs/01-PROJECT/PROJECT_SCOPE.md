
---
title: Project Scope
type: scope
status: baseline
tags: [MIU, scope]
---

# MIU Freelance Platform — Project Scope

## 1. Purpose

This document defines the planned system scope and distinguishes the Phase 1 work from later implementation.

The official requirements baseline is [SRS v1.1](SRS.md).

## 2. Product Scope

The platform combines:

1. **Project-based freelancing:** Clients post projects and students submit proposals.
2. **Service-based freelancing:** Students publish predefined services with packages and extras.

Both share user accounts, profiles, orders, communication, reviews, support, and planned financial workflows.

## 3. Functional Scope

### Accounts
- Student and client registration
- Login and password reset
- Profiles and account settings
- Role-based access
- Planned identity verification

### Marketplace
- Project creation and publication
- Project discovery and filtering
- Proposal submission and comparison
- Service creation and management
- Packages and optional extras
- Freelancer and service discovery
- Planned skills matching

### Orders and Collaboration
- Project and service orders
- Work requirements and deadlines
- Messaging and attachments
- Deliveries and revisions
- Order status tracking
- Reviews and ratings

### Financial Workflows
- EGP checkout
- Sandbox payment demonstrations
- Simulated escrow
- Refund, payout, fee, and transaction views
- Finance Committee oversight

### Administration
- Super Admin
- Five specialized committees
- Committee account creation by Super Admin
- Profile verification decisions
- Content moderation
- Dispute review
- Administrative audit trails

### Assistance
- Planned chatbot
- Translation controls
- AI-assisted moderation
- Notifications
- Support tickets

## 4. Phase 1 — Requirements and Frontend

### Confirmed Academic Deliverables

The instructor requests:
- Preface and Introduction
- Similar Systems
- Functional User Requirements
- Non-Functional User Requirements
- Prototypes of all forms/pages

### Team Frontend Development Objective

The team plans to create:
- A navigable React web application
- Responsive layouts
- Role-specific UI screens
- Mock authentication and verification
- Project and service demonstration flows
- Student, client, and administrative dashboards
- Simulated checkout, escrow, and review workflows
- Mock AI and translation interfaces
- Capturable prototype screens for the SRS

### Phase 1 Exclusions

Phase 1 does not claim:
- A completed production backend
- Persistent production database
- Live authentication infrastructure
- Real biometric processing
- Production AI inference
- Actual money movement
- Real escrow custody
- Production payment authorization
- Capacitor mobile application packaging

## 5. Later Development Scope

### Phase 2
- Backend services
- Database persistence
- Secure authentication
- Server-side permissions
- File storage and messaging services
- Approved AI and identity integration
- Approved payment-provider sandbox integration
- Audit and security infrastructure

### Phase 3
- Capacitor mobile packaging
- Platform integration testing
- Accessibility and performance improvements
- Final validation and deployment preparation
- University handover

Later phases are plans and must be reassessed against available time, approvals, and resources.

## 6. Scope Boundaries

### Currency
EGP only. No currency selection or conversion.

### Identity
MIU users provide an MIU ID. External clients provide an accepted government-issued ID.

The planned verification interaction includes live-face review and identity-document checking.

### Governance
Committee accounts are created by the Super Admin, not through public registration.

### Finance
Financial actions are simulated in Phase 1. Production processing requires approval and a suitable provider.

### Mobile
Responsive web comes first. Capacitor is planned later.

## 7. Scope Change Procedure

Before adding, removing, or modifying a substantial feature:

1. Describe the requested change.
2. Identify affected SRS requirement IDs.
3. Evaluate impact on screens, data, permissions, and development effort.
4. Obtain team approval and any required academic approval.
5. Update the relevant documents.
6. Update work assignments and tests if necessary.

## 8. Items Requiring Later Decisions

- Selected identity verification provider
- Final live payment provider
- Production escrow and payout arrangements
- Detailed refund and financial approval thresholds
- Exact AI and translation services
- University identity-record integration
- Official branding and deployment approvals
- Production infrastructure and release process

Do not interpret these unresolved choices as implemented or approved.

## Related Documents

- [SRS](SRS.md)
- [Features](../02-REQUIREMENTS/FEATURES.md)
- [Business Rules](../02-REQUIREMENTS/BUSINESS_RULES.md)
- [Roadmap](DEVELOPMENT_ROADMAP.md)
