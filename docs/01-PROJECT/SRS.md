
---
title: MIU Freelance Platform — Software Requirements Specification
aliases:
  - MIU SRS
  - Phase 1 SRS
project: MIU Freelance Platform
document_type: Software Requirements Specification
phase: 1
version: "1.1"
date: October 2026
status: Baseline
tags:
  - MIU
  - Software-Engineering
  - SRS
  - Phase-1
  - Requirements
---

# MIU Freelance Platform — Software Requirements Specification

**Phase 1 — Version 1.1**

**Prepared by:**

- Mina Samaan — ID: 2024/04830
- Carol Adel — ID: 2024/07765
- Marina Ashraf — ID: 2024/06654
- Marina Hanna — ID: 2024/05238
- Sama Mohamed — ID: 2024/00293

**Submitted to:** Dr. Mohamed Mahmoud Youssef Shalaby

**Date:** October 2026

---

## Table of Contents

1. [[#1. Preface]]
2. [[#2. Introduction]]
3. [[#3. Similar Systems]]
4. [[#4. Functional User Requirements]]
5. [[#5. Non-Functional User Requirements]]
6. [[#6. System Requirements]]
7. [[#7. Prototypes of All Forms and Pages]]

---

## 1. Preface

This Software Requirements Specification defines the Phase 1 user requirements and interface prototypes for the MIU Freelance Platform.

The platform is planned as an academic software engineering project that combines project-based proposals similar to **Mostaql** with fixed-scope services similar to **Khamsat**.

Phase 1 documents the intended behavior and user experience.

Because the frontend application is still under development, the prototype section contains labeled locations where the team will insert screenshots from the running interface.

The document does not claim a completed backend, deployed artificial intelligence, operational identity verification, or live payment processing.

Payment behavior remains a sandbox concept, and AI-assisted functions remain planned capabilities for later implementation and validation.

The intended readers are:

- Project team members
- Course instructor
- Project reviewers
- Future developers

This document establishes a shared basis for design review and later implementation while limiting its contents to the sections requested for Phase 1.

---

## 2. Introduction

### 2.1 Purpose

The MIU Freelance Platform will connect student freelancers with clients through two marketplace models.

Clients can publish projects and receive proposals, while students can publish predefined services that clients can order.

The system is intended to support:

- Verified participation
- EGP pricing
- Controlled payments
- Role-specific oversight

### 2.2 Scope

The platform includes:

1. A project marketplace where clients publish work and students submit proposals with EGP prices and delivery times.
2. A service marketplace where students publish fixed-scope services and clients select packages and extras.
3. Student and client dashboards for profiles, discovery, proposals, services, orders, messages, disputes, and transaction status.
4. A Super Admin dashboard and five committee dashboards:
   - Verification
   - Marketplace Operations
   - Finance
   - Support and Disputes
   - AI and Quality
5. Admin-created committee accounts. Committee members log in with issued credentials and cannot self-register.
6. Planned AI-assisted live face and ID verification, skills matching, help chatbot, and comment moderation.
7. Sandbox online payments and escrow in EGP for development and demonstration.
8. Password reset and interface or message translation.
9. Responsive web delivery first. Capacitor packaging for mobile is a later target.

No live payment capability is claimed in Phase 1.

### 2.3 User Classes

| User Class | Primary Goals |
|---|---|
| Visitor | Explore projects and services; register as a student or client. |
| Student Freelancer | Build a profile, submit proposals, publish services, deliver work, and track EGP earnings. |
| Client | Post projects, compare proposals, order services, fund sandbox escrow, and accept work. |
| Super Admin | Govern accounts, permissions, settings, audit records, and final escalations. |
| Verification Committee | Review identity and profile verification cases. |
| Marketplace Operations Committee | Review listings, proposals, reported comments, and marketplace content. |
| Finance Committee | Monitor sandbox payments, escrow, refunds, payouts, fees, and reconciliation. |
| Support and Disputes Committee | Manage tickets, evidence, disputes, and recorded decisions. |
| AI and Quality Committee | Review matching, chatbot, moderation, feedback, and AI-related error reports. |

### 2.4 Operating Assumptions and Constraints

- EGP is the only supported currency. The interface does not provide currency conversion or a currency selector.
- Identity checks distinguish MIU users, who submit MIU ID, from external clients, who submit government ID.
- Committee access follows least privilege. Each committee sees only the data and actions needed for its assigned work.
- External identity, AI, translation, notification, and payment providers will require later technical selection and integration.
- Phase 1 validates requirements and UI flow only. Production security, provider approval, model accuracy, and regulatory compliance require later verification.

---

## 3. Similar Systems

### 3.1 Mostaql

Mostaql represents the project-proposal model used as a conceptual reference.

A client publishes a project with requirements and budget, freelancers submit competing proposals, and the client selects a proposal before work begins.

The MIU platform adopts this interaction pattern without claiming an affiliation or an exact copy of Mostaql.

### 3.2 Khamsat

Khamsat represents the service-catalogue model used as a conceptual reference.

Freelancers publish predefined services, buyers browse listings, and an order begins after the buyer chooses a package or option.

The MIU platform adopts this interaction pattern without claiming an affiliation or an exact copy of Khamsat.

### 3.3 Comparison and Planned Adaptation

| Capability | Mostaql-like Reference | Khamsat-like Reference | MIU Planned Approach |
|---|---|---|---|
| How work starts | Client posts a project | Freelancer lists a service | Support both paths in one account system. |
| Student response | Proposal with price and schedule | Published package and extras | Allow proposals and student-owned services. |
| Client decision | Compare proposals | Choose service package | Provide comparison and catalogue flows. |
| Currency | Reference system rules | Reference system rules | EGP only. |
| Oversight | Platform moderation | Platform moderation | Super Admin plus five specialized committees. |
| Verification and AI | Not assumed for this SRS | Not assumed for this SRS | Plan live face and ID checks, skills matching, chatbot, and moderation with human review. |
| Payments | Platform-dependent | Platform-dependent | Sandbox online payment and simulated escrow for the project phase. |

---

## 4. Functional User Requirements

The following requirements are organized by user role.

Each role section states the complete set of actions that the role should be able to perform across the platform.

These requirements describe planned behavior and do not claim that the functions are already implemented.

### 4.1 Visitor Functional Requirements

| ID | Requirement |
|---|---|
| FR-V01 | Browse public projects and services. |
| FR-V02 | Search and filter public marketplace content. |
| FR-V03 | Create either a student or client account; committee registration is not available. |
| FR-V04 | Open the login and password-recovery forms. |
| FR-V05 | Change the displayed interface language. |

### 4.2 Student Functional Requirements

| ID | Requirement |
|---|---|
| FR-S01 | Register, log in, log out, and reset the account password. |
| FR-S02 | Complete live face and MIU ID verification before performing restricted marketplace actions. |
| FR-S03 | Create and update a freelancer profile containing skills, biography, portfolio, availability, and EGP pricing. |
| FR-S04 | Browse and filter projects and view planned skills-based project recommendations. |
| FR-S05 | Submit a proposal containing an EGP price, delivery time, cover message, and permitted attachments. |
| FR-S06 | Edit or withdraw a proposal while the project remains open and platform rules permit the action. |
| FR-S07 | Create, edit, preview, publish, pause, and remove fixed-scope services and packages priced in EGP. |
| FR-S08 | Receive and manage project and service orders. |
| FR-S09 | View order requirements, milestones, deadlines, and escrow status. |
| FR-S10 | Exchange order messages and files with the client. |
| FR-S11 | Submit completed work and respond to revision requests. |
| FR-S12 | View sandbox earnings, refunds, payout status, transaction history, and receipts in EGP. |
| FR-S13 | Rate or review a client after a completed order where platform rules allow it. |
| FR-S14 | Open a support ticket or dispute and upload supporting evidence. |
| FR-S15 | Use translation controls and the planned help chatbot. |
| FR-S16 | Manage password, language, notification, and active-session settings. |

### 4.3 Client Functional Requirements

| ID | Requirement |
|---|---|
| FR-C01 | Register, log in, log out, and reset the account password. |
| FR-C02 | Complete live face and government ID verification when the client is external to MIU. |
| FR-C03 | Create and update a personal or organization profile. |
| FR-C04 | Create, edit, preview, publish, close, and cancel a project with scope, skills, EGP budget, and deadline. |
| FR-C05 | View, filter, compare, shortlist, accept, and reject proposals. |
| FR-C06 | Open the student profile connected to a proposal. |
| FR-C07 | Browse and filter services and view planned service or freelancer recommendations. |
| FR-C08 | Select a service package and permitted extras before placing an order. |
| FR-C09 | Confirm an order and simulate online payment and escrow funding in the sandbox environment. |
| FR-C10 | Provide order requirements and exchange messages and files with the student. |
| FR-C11 | Track project and service orders, milestones, delivery dates, and escrow status. |
| FR-C12 | Request revisions, accept delivered work, and complete an order. |
| FR-C13 | View sandbox transactions, refunds, fees, escrow events, and receipts in EGP. |
| FR-C14 | Rate and review a student after a completed order. |
| FR-C15 | Open a support ticket or dispute and upload supporting evidence. |
| FR-C16 | Use translation controls and the planned help chatbot. |
| FR-C17 | Manage password, language, notification, and active-session settings. |

### 4.4 Super Admin Functional Requirements

| ID | Requirement |
|---|---|
| FR-A01 | Log in using an authorized administrator account and log out securely. |
| FR-A02 | View platform activity, user, case, and sandbox finance summaries. |
| FR-A03 | Search, view, activate, suspend, and restore student and client accounts. |
| FR-A04 | Create committee accounts and assign each account to one of the five committees. |
| FR-A05 | Reset, suspend, reactivate, or deactivate committee accounts. |
| FR-A06 | Assign and review role permissions for committee accounts. |
| FR-A07 | Review committee workloads, escalations, and recorded decisions. |
| FR-A08 | Make final decisions on cases escalated beyond committee authority. |
| FR-A09 | View audit records for administrative and committee actions. |
| FR-A10 | Manage permitted platform settings without changing the EGP-only rule. |

### 4.5 Verification Committee Functional Requirements

| ID | Requirement |
|---|---|
| FR-VC01 | Log in using an account created by the Super Admin; self-registration is not available. |
| FR-VC02 | View pending, resubmitted, and escalated identity and profile verification cases. |
| FR-VC03 | Review live-face and liveness results with the submitted MIU ID or government ID. |
| FR-VC04 | Approve, reject, or request resubmission and record the decision reason. |
| FR-VC05 | View only the identity information necessary for verification work. |

### 4.6 Marketplace Operations Committee Functional Requirements

| ID | Requirement |
|---|---|
| FR-MO01 | Log in using an account created by the Super Admin. |
| FR-MO02 | Review projects, services, proposals, comments, reviews, and reported marketplace content. |
| FR-MO03 | Approve, reject, hide, restore, or request changes to content within its authority. |
| FR-MO04 | Review planned automated moderation flags and record the final human decision. |
| FR-MO05 | Escalate cases outside its authority to the Super Admin or appropriate committee. |

### 4.7 Finance Committee Functional Requirements

| ID | Requirement |
|---|---|
| FR-FC01 | Log in using an account created by the Super Admin. |
| FR-FC02 | View sandbox transactions, escrow status, refunds, payouts, fees, and exception alerts in EGP. |
| FR-FC03 | Open a transaction record and review its related order and payment-provider reference. |
| FR-FC04 | Perform permitted sandbox finance actions and record reasons. |
| FR-FC05 | Escalate unresolved or unauthorized finance actions. |

### 4.8 Support and Disputes Committee Functional Requirements

| ID | Requirement |
|---|---|
| FR-SD01 | Log in using an account created by the Super Admin. |
| FR-SD02 | View and prioritize support tickets and disputes. |
| FR-SD03 | Review the related order, submitted evidence, and communication history. |
| FR-SD04 | Communicate with the involved users and record case notes. |
| FR-SD05 | Resolve permitted cases or escalate financial and final decisions. |

### 4.9 AI and Quality Committee Functional Requirements

| ID | Requirement |
|---|---|
| FR-AQ01 | Log in using an account created by the Super Admin. |
| FR-AQ02 | Review skills-matching results, user feedback, and reported recommendation problems. |
| FR-AQ03 | Review chatbot issues, failed answers, and escalation records. |
| FR-AQ04 | Review automated moderation outcomes and false-positive or false-negative reports. |
| FR-AQ05 | Record quality findings, assign issues, and escalate unresolved model or service incidents. |

---

## 5. Non-Functional User Requirements

These requirements define expected quality and operating constraints.

Target values are acceptance goals for later implementation and testing.

| ID | Quality Area | Requirement |
|---|---|---|
| NFR-01 | Usability | A first-time user should be able to identify the project and service paths from the landing page without training. |
| NFR-02 | Accessibility | Core web flows should support keyboard navigation, visible focus, descriptive labels, text alternatives, and sufficient contrast, targeting WCAG 2.1 AA where practical. |
| NFR-03 | Responsiveness | Pages should adapt to common desktop, tablet, and mobile web widths without hiding required actions. |
| NFR-04 | Performance | Under normal test conditions, primary pages should target an initial response within 3 seconds, excluding large uploads and third-party delays. |
| NFR-05 | Availability | Production availability targets will be defined before deployment; Phase 1 does not claim an operational service-level agreement. |
| NFR-06 | Security | Passwords must be hashed, sessions protected, inputs validated, and sensitive traffic encrypted in any implemented environment. |
| NFR-07 | Authorization | Role-based access must prevent users and committees from viewing or changing data outside their permissions. |
| NFR-08 | Privacy | Identity images and biometric-related verification data must be minimized, access-controlled, retained only under an approved policy, and excluded from public profiles. |
| NFR-09 | Auditability | Administrative, committee, verification, moderation, dispute, and financial status changes must record actor, time, action, and reason. |
| NFR-10 | Payment Safety | All Phase 1 and development payments must remain in sandbox mode and be visibly labeled as tests. |
| NFR-11 | AI Transparency | AI-assisted matching, chatbot, verification, and moderation outputs must be identified as automated or assisted and must support human review or escalation. |
| NFR-12 | AI Quality | Later testing must measure errors and unfair outcomes before automated results can affect access, visibility, or enforcement. |
| NFR-13 | Reliability | Order, payment, and dispute status changes should be idempotent so retries do not duplicate critical actions. |
| NFR-14 | Data Integrity | Money values must store EGP amounts consistently and preserve transaction and escrow history. |
| NFR-15 | Localization | The interface should support translation without truncating labels, changing EGP values, or losing the original message text where translation is offered. |
| NFR-16 | Maintainability | The system should separate marketplace, identity, payment, messaging, and administration concerns to support testing and later provider changes. |
| NFR-17 | Compatibility | The responsive web application should support current major browsers. Capacitor mobile packaging is planned for a later phase. |
| NFR-18 | Recovery | Password reset, failed uploads, interrupted verification, and unsuccessful sandbox payment attempts should provide safe retry paths without losing confirmed data. |

---

## 6. System Requirements

This section identifies the technical environment and supporting capabilities required to implement and operate the planned platform.

The selected products and providers may change during later design and implementation work.

### 6.1 Client Device Requirements

| ID | Requirement |
|---|---|
| SR-01 | Users require a desktop, laptop, tablet, or smartphone with a current web browser and an internet connection. |
| SR-02 | A working camera is required for the planned live-face and identity-verification process. |
| SR-03 | The device must permit file selection or camera capture when the user uploads identity documents, portfolio files, project attachments, deliveries, or dispute evidence. |
| SR-04 | JavaScript and secure HTTPS connections must be enabled for the implemented web application. |

### 6.2 Application Software Requirements

| ID | Requirement |
|---|---|
| SR-05 | The Phase 1 front end should use standard HTML, CSS, and JavaScript or an equivalent maintainable web framework. |
| SR-06 | A later backend must provide authentication, authorization, marketplace, order, messaging, verification, payment, moderation, and administration services. |
| SR-07 | A persistent database must store user profiles, projects, proposals, services, orders, messages, cases, role assignments, and audit records. |
| SR-08 | Sensitive files must be stored outside public web paths with access controlled by the authenticated user and assigned role. |
| SR-09 | The web interface must use EGP as the only transaction and display currency. |
| SR-10 | Capacitor packaging may be added after the responsive web application is stable; it is not required for the Phase 1 prototype. |

### 6.3 External Service Requirements

| ID | Requirement |
|---|---|
| SR-11 | Identity verification requires a later service capable of document checks, live-face capture, liveness analysis, and review-status reporting. |
| SR-12 | MIU users must be able to submit an MIU ID, while external clients must be able to submit a government-issued ID. |
| SR-13 | Payments and escrow demonstrations must use a sandbox payment provider. Production or live payment processing is outside Phase 1. |
| SR-14 | The planned skills matcher, chatbot, translation, and comment-moderation functions require later AI or language services with human-review paths. |
| SR-15 | Email or notification delivery requires a later notification provider for verification, password reset, order, case, and account messages. |

### 6.4 Hosting and Security Requirements

| ID | Requirement |
|---|---|
| SR-16 | The deployed system must use HTTPS and protect credentials, identity documents, messages, and financial records in transit and at rest. |
| SR-17 | The server environment must support role-based access control for students, clients, Super Admin, and the five committees. |
| SR-18 | The system must record administrative, committee, payment-status, verification, moderation, and dispute actions in an audit log. |
| SR-19 | The deployment must provide backups and recovery procedures for the database and protected file storage. |
| SR-20 | Development, test, and production configurations must be separated so sandbox credentials and test data cannot be confused with live services. |

---

## 7. Prototypes of All Forms and Pages

This section is reserved for screenshots captured from the running frontend application.

Replace each labeled placeholder with the corresponding screenshot after the HTML, CSS, and JavaScript interface is completed and tested in a browser.

Source code should remain in the project files and should not be pasted into this SRS.

### 7.1 Prototype Inventory

| ID | Page or Form | Primary Access |
|---|---|---|
| P-01 | Landing Page | Public |
| P-02 | Registration and Role Selection | Public |
| P-03 | Login | Public |
| P-04 | Forgot and Reset Password | Public |
| P-05 | Identity Verification | Student or Client |
| P-06 | Projects Catalogue | Public and Student |
| P-07 | Project Details | Public and Student |
| P-08 | Submit or Edit Proposal | Student |
| P-09 | Services Catalogue | Public and Client |
| P-10 | Service Details and Package Selection | Public and Client |
| P-11 | Student Dashboard | Student |
| P-12 | Student Profile and Portfolio | Student |
| P-13 | Service Editor | Student |
| P-14 | Student Proposals and Orders | Student |
| P-15 | Client Dashboard | Client |
| P-16 | Post or Edit Project | Client |
| P-17 | Proposal Comparison | Client |
| P-18 | Checkout and Sandbox Escrow | Client |
| P-19 | Order Workspace | Student and Client |
| P-20 | Messages Chatbot and Translation | Registered User |
| P-21 | Support Ticket and Dispute Form | Registered User |
| P-22 | Super Admin Dashboard | Super Admin |
| P-23 | Committee Account Management | Super Admin |
| P-24 | Verification Committee Dashboard | Verification Committee |
| P-25 | Marketplace Operations Dashboard | Marketplace Operations Committee |
| P-26 | Finance Committee Dashboard | Finance Committee |
| P-27 | Support and Disputes Dashboard | Support and Disputes Committee |
| P-28 | AI and Quality Dashboard | AI and Quality Committee |
| P-29 | Notifications and Settings | Registered User |

---

### 7.2 Prototype Screenshots

#### P-01 — Landing Page

**Access:** Public

> [!todo] Prototype Screenshot
> Insert screenshot of the running Landing Page interface here.

**Figure P-01:** Landing Page

---

#### P-02 — Registration and Role Selection

**Access:** Public

> [!todo] Prototype Screenshot
> Insert screenshot of the running Registration and Role Selection interface here.

**Figure P-02:** Registration and Role Selection

---

#### P-03 — Login

**Access:** Public

> [!todo] Prototype Screenshot
> Insert screenshot of the running Login interface here.

**Figure P-03:** Login

---

#### P-04 — Forgot and Reset Password

**Access:** Public

> [!todo] Prototype Screenshot
> Insert screenshot of the running Forgot and Reset Password interface here.

**Figure P-04:** Forgot and Reset Password

---

#### P-05 — Identity Verification

**Access:** Student or Client

> [!todo] Prototype Screenshot
> Insert screenshot of the running Identity Verification interface here.

**Figure P-05:** Identity Verification

---

#### P-06 — Projects Catalogue

**Access:** Public and Student

> [!todo] Prototype Screenshot
> Insert screenshot of the running Projects Catalogue interface here.

**Figure P-06:** Projects Catalogue

---

#### P-07 — Project Details

**Access:** Public and Student

> [!todo] Prototype Screenshot
> Insert screenshot of the running Project Details interface here.

**Figure P-07:** Project Details

---

#### P-08 — Submit or Edit Proposal

**Access:** Student

> [!todo] Prototype Screenshot
> Insert screenshot of the running Submit or Edit Proposal interface here.

**Figure P-08:** Submit or Edit Proposal

---

#### P-09 — Services Catalogue

**Access:** Public and Client

> [!todo] Prototype Screenshot
> Insert screenshot of the running Services Catalogue interface here.

**Figure P-09:** Services Catalogue

---

#### P-10 — Service Details and Package Selection

**Access:** Public and Client

> [!todo] Prototype Screenshot
> Insert screenshot of the running Service Details and Package Selection interface here.

**Figure P-10:** Service Details and Package Selection

---

#### P-11 — Student Dashboard

**Access:** Student

> [!todo] Prototype Screenshot
> Insert screenshot of the running Student Dashboard interface here.

**Figure P-11:** Student Dashboard

---

#### P-12 — Student Profile and Portfolio

**Access:** Student

> [!todo] Prototype Screenshot
> Insert screenshot of the running Student Profile and Portfolio interface here.

**Figure P-12:** Student Profile and Portfolio

---

#### P-13 — Service Editor

**Access:** Student

> [!todo] Prototype Screenshot
> Insert screenshot of the running Service Editor interface here.

**Figure P-13:** Service Editor

---

#### P-14 — Student Proposals and Orders

**Access:** Student

> [!todo] Prototype Screenshot
> Insert screenshot of the running Student Proposals and Orders interface here.

**Figure P-14:** Student Proposals and Orders

---

#### P-15 — Client Dashboard

**Access:** Client

> [!todo] Prototype Screenshot
> Insert screenshot of the running Client Dashboard interface here.

**Figure P-15:** Client Dashboard

---

#### P-16 — Post or Edit Project

**Access:** Client

> [!todo] Prototype Screenshot
> Insert screenshot of the running Post or Edit Project interface here.

**Figure P-16:** Post or Edit Project

---

#### P-17 — Proposal Comparison

**Access:** Client

> [!todo] Prototype Screenshot
> Insert screenshot of the running Proposal Comparison interface here.

**Figure P-17:** Proposal Comparison

---

#### P-18 — Checkout and Sandbox Escrow

**Access:** Client

> [!todo] Prototype Screenshot
> Insert screenshot of the running Checkout and Sandbox Escrow interface here.

**Figure P-18:** Checkout and Sandbox Escrow

---

#### P-19 — Order Workspace

**Access:** Student and Client

> [!todo] Prototype Screenshot
> Insert screenshot of the running Order Workspace interface here.

**Figure P-19:** Order Workspace

---

#### P-20 — Messages Chatbot and Translation

**Access:** Registered User

> [!todo] Prototype Screenshot
> Insert screenshot of the running Messages Chatbot and Translation interface here.

**Figure P-20:** Messages Chatbot and Translation

---

#### P-21 — Support Ticket and Dispute Form

**Access:** Registered User

> [!todo] Prototype Screenshot
> Insert screenshot of the running Support Ticket and Dispute Form interface here.

**Figure P-21:** Support Ticket and Dispute Form

---

#### P-22 — Super Admin Dashboard

**Access:** Super Admin

> [!todo] Prototype Screenshot
> Insert screenshot of the running Super Admin Dashboard interface here.

**Figure P-22:** Super Admin Dashboard

---

#### P-23 — Committee Account Management

**Access:** Super Admin

> [!todo] Prototype Screenshot
> Insert screenshot of the running Committee Account Management interface here.

**Figure P-23:** Committee Account Management

---

#### P-24 — Verification Committee Dashboard

**Access:** Verification Committee

> [!todo] Prototype Screenshot
> Insert screenshot of the running Verification Committee Dashboard interface here.

**Figure P-24:** Verification Committee Dashboard

---

#### P-25 — Marketplace Operations Dashboard

**Access:** Marketplace Operations Committee

> [!todo] Prototype Screenshot
> Insert screenshot of the running Marketplace Operations Dashboard interface here.

**Figure P-25:** Marketplace Operations Dashboard

---

#### P-26 — Finance Committee Dashboard

**Access:** Finance Committee

> [!todo] Prototype Screenshot
> Insert screenshot of the running Finance Committee Dashboard interface here.

**Figure P-26:** Finance Committee Dashboard

---

#### P-27 — Support and Disputes Dashboard

**Access:** Support and Disputes Committee

> [!todo] Prototype Screenshot
> Insert screenshot of the running Support and Disputes Dashboard interface here.

**Figure P-27:** Support and Disputes Dashboard

---

#### P-28 — AI and Quality Dashboard

**Access:** AI and Quality Committee

> [!todo] Prototype Screenshot
> Insert screenshot of the running AI and Quality Dashboard interface here.

**Figure P-28:** AI and Quality Dashboard

---

#### P-29 — Notifications and Settings

**Access:** Registered User

> [!todo] Prototype Screenshot
> Insert screenshot of the running Notifications and Settings interface here.

**Figure P-29:** Notifications and Settings

---

## End of Document

**Document:** MIU Freelance Platform — Phase 1 SRS

**Version:** 1.1

**Date:** October 2026

**Prototype screenshots:** Pending frontend implementation and capture.

**Document purpose:** Requirements specification and interface prototype reference for Phase 1.
