
---
title: MIU Freelance Platform — Software Requirements Specification
aliases:
  - MIU SRS
  - Phase 1 SRS
project: MIU Freelance Platform
document_type: Software Requirements Specification
phase: 1
version: "1.2 Draft"
date: October 2026
status: Revised draft for review
tags:
  - MIU
  - Software-Engineering
  - SRS
  - Phase-1
  - Requirements
---

# MIU Freelance Platform — Software Requirements Specification

**Phase 1 — Version 1.2 Draft**

**Prepared by:**

- Mina Samaan — ID: 2024/04830
- Carol Adel — ID: 2024/07765
- Marina Ashraf — ID: 2024/06654
- Marina Hanna — ID: 2024/05238
- Sama Mohamed — ID: 2024/00293

**Submitted to:** Dr. Mohamed Mahmoud Youssef Shalaby

**Date:** October 2026

**Document status:** Revised draft for instructor and team review. It preserves the v1.1 requirement identifiers; proposed additions and unresolved decisions are labeled.

### Version history

| Version | Date | Change |
|---|---|---|
| 1.1 | October 2026 | Previous requirements baseline. |
| 1.2 Draft | October 2026 | Reorganized and clarified requirements by actor; added screen inventory, acceptance criteria, implementation status, and open decisions. Screenshots are intentionally deferred. |

---

## Table of Contents

1. [Preface](#1-preface)
2. [Introduction](#2-introduction)
3. [Similar Systems](#3-similar-systems)
4. [Functional User Requirements](#4-functional-user-requirements)
5. [Non-Functional User Requirements](#5-non-functional-user-requirements)
6. [System Requirements](#6-system-requirements)
7. [Prototypes of All Forms and Pages](#7-prototypes-of-all-forms-and-pages)
8. [Data and Record Requirements](#8-data-and-record-requirements)
9. [Acceptance Criteria and Verification](#9-acceptance-criteria-and-verification)
10. [Implementation Alignment and Limitations](#10-implementation-alignment-and-limitations)
11. [Open Decisions](#11-open-decisions)
12. [Requirements Traceability](#12-requirements-traceability)
13. [Glossary](#13-glossary)
14. [References](#14-references)

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

This document establishes a testable basis for design, implementation, and review. Functional requirements are grouped by actor and describe that actor's actions across the platform; they are not divided into separate lists for every page. Supporting sections record the prototype inventory, data needs, acceptance criteria, implementation status, and unresolved decisions. The prototype inventory documents interfaces and screenshot slots; it does not reproduce application source code.

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

This section describes what each actor must be able to do across the system. Requirements are grouped by actor, not by page. A route or screen in Section 7 is a way to access a workflow; it is not a separate user role. “Shall” states required behavior. Every requirement retains its v1.1 identifier. Requirements marked planned, simulated, or open in Section 10 are not claims of production implementation.

### 4.1 Visitor

| ID | Functional requirement |
|---|---|
| FR-V01 | The system shall let a visitor view public platform information, published project listings, published service listings, and public student profiles without creating an account. Private account, proposal, order, case, identity, and payment information shall not be exposed to a visitor. |
| FR-V02 | The system shall let a visitor search and apply available category, skill, price, or other displayed filters to public projects, services, and freelancer listings. It shall show a useful empty result when nothing matches and shall not imply that a result is personalized unless the matching method and inputs are disclosed. |
| FR-V03 | The system shall let a visitor start public registration as a Student Freelancer or Client, validate required fields, and identify validation errors. Public registration shall not offer Super Admin or committee roles. |
| FR-V04 | The system shall let a visitor open sign-in, password recovery, and password reset interfaces. A Phase 1 response shall be clearly identified as simulated and shall not claim that an email was sent or a credential changed unless that action actually occurred. |
| FR-V05 | The system shall expose a language choice when the approved translation is available. A language control without an approved translation shall not claim to translate the application. Language direction shall follow the selected, supported language. |

### 4.2 Student Freelancer

| ID | Functional requirement |
|---|---|
| FR-S01 | The system shall let a student register through the student registration path, submit valid sign-in credentials, end the active session, and request password recovery. It shall validate required input and show a recoverable result without exposing whether a private account exists unnecessarily. Phase 1 authentication is a mock demonstration. |
| FR-S02 | The planned verification workflow shall guide a student through consent, camera access, and presentation of the student's live face and MIU student ID together in one camera view. It shall display pending, approved, rejected, resubmission, or escalated outcomes as applicable. A Phase 1 screen shall disclose that capture and verification are simulated and do not establish identity or MIU affiliation. |
| FR-S03 | The system shall let a student create and update the student's own profile, including approved biography, skills, portfolio examples, and other approved public profile fields. It shall validate profile inputs and prevent profile editing from changing the account role, verification result, or review history. Public views shall exclude private identity evidence and private account data. |
| FR-S04 | The system shall let a student discover published projects, inspect project scope and requirements, search and filter listings, and open project details. Where skills recommendations are enabled, it shall label the recommendations as assisted or simulated, disclose the basis in understandable terms, and leave the student free to make an independent choice. |
| FR-S05 | The system shall let an eligible student submit a proposal to a project that is open to proposals. The proposal shall include a positive proposed amount in EGP, a delivery estimate, and a project-specific message; permitted supporting material may be included. The system shall validate required fields, project eligibility, and amount format before saving and confirming the result. |
| FR-S06 | The system shall let a student view only the student's own proposals and, while the project and proposal states permit, edit or withdraw an eligible proposal. It shall reject attempts to change another student's proposal or modify a proposal after the relevant project commitment or closure. Any exact production edit cutoff not stated in approved policy remains an open decision. |
| FR-S07 | The system shall let a student create and maintain the student's service listings, including description, category, skills, scope, deliverables, EGP package prices, delivery estimates, and optional extras. The student shall be able to save a permitted draft, preview it, publish when eligible, pause, and remove an uncommitted listing. Validation shall identify incomplete or invalid terms. Existing orders shall retain their agreed terms when a listing changes. |
| FR-S08 | The system shall let a student view project and service orders assigned to that student, filter or sort the list using displayed information, and open an authorized order summary. An order shall identify its source, counterpart, agreed EGP amount, and current state when that information exists. The student shall not see another freelancer's private orders. |
| FR-S09 | The system shall let a student inspect order requirements, agreed terms, available deadlines or estimates, recorded activity, and payment or escrow status when available. It shall distinguish an estimate from a confirmed deadline and a simulated financial status from a real payment. |
| FR-S10 | The system shall let the student exchange order-related messages and permitted attachments or samples with the client who participates in the same order. It shall preserve the message as text, identify its sender, and reject writes by unrelated or inactive accounts. A simulated attachment shall not be represented as an uploaded file. |
| FR-S11 | For an order whose approved state permits work, the system shall let the assigned student submit a delivery and respond to an authorized revision request. It shall preserve prior delivery and revision history, identify the latest submission, and reject submissions for another participant's order or an order that has not been activated under the applicable workflow. |
| FR-S12 | The system shall let the student review available EGP transaction and earnings information, including held, released, refunded, or pending amounts where those records exist. It shall label simulated or unavailable values and shall not describe an order's agreed amount as paid earnings. A Phase 1 display shall not claim that funds can be withdrawn. |
| FR-S13 | Where the approved review policy permits student-to-client reviews, the system shall let an eligible student submit one review for a qualifying completed interaction, validate its rating and text, and show a confirmation. The actor direction and eligibility policy require approval; the existing implementation may support only the client-to-student direction. |
| FR-S14 | The system shall let the student submit a support request or an eligible order dispute with a description and permitted supporting evidence. It shall validate required information, associate an order when relevant, confirm the simulated submission, and restrict case details to the student and authorized reviewers. |
| FR-S15 | The system shall provide the planned help assistant and translation controls where approved content is available. Automated or canned answers shall be identified as such, shall not claim to perform account actions, and shall provide the user a route to human support when that route is approved and available. A translated message shall preserve access to its original text. |
| FR-S16 | The system shall let the student manage supported account preferences, including password recovery, language, notifications, and active sessions. A control shall affect only the preference it names and shall clearly report when a change is simulated or unavailable. |

### 4.3 Client

| ID | Functional requirement |
|---|---|
| FR-C01 | The system shall let a client use the client registration path, submit valid credentials to sign in, end the active session, and request password recovery. It shall validate fields and report recoverable errors. Phase 1 authentication remains a mock demonstration. |
| FR-C02 | The planned verification workflow shall distinguish an MIU-connected client from an external client using an approved account-origin method. An external client shall be guided to present an accepted government-issued ID and the live face together in one camera view. The system shall show verification states and never imply that camera presentation alone proves MIU affiliation. Phase 1 results are simulated. |
| FR-C03 | The system shall let a client create and update the client's own personal or organization profile using approved fields. It shall prevent edits to role, verification state, or unrelated account records and shall expose only fields approved for public display. |
| FR-C04 | The system shall let a client create a project brief with a title, description, scope, expected deliverables, category, required skills, EGP budget, and deadline. The client shall be able to save an allowed draft, preview and edit it, publish it after validation, and close or cancel it only when the project's state and commitments permit. The system shall not silently cancel an accepted or financially committed order. |
| FR-C05 | The system shall let a client review proposals belonging to the client's own open project, search or filter them, compare relevant proposal details, and shortlist, accept, or reject proposals using confirmed actions. It shall prevent review or decisions on another client's project. Selection shall identify the chosen freelancer and create or update the corresponding project-order handoff only once. |
| FR-C06 | The system shall let the client open the public student profile associated with a proposal when a valid profile record and route exist. Missing or inconsistent profile data shall produce a safe unavailable state; the system shall not invent ratings, portfolio items, qualifications, or verification badges. |
| FR-C07 | The system shall let a client browse, search, and filter published services and student providers; inspect service descriptions, package scope, deliverables, EGP prices, delivery estimates, and disclosed extras; and view explainable service or freelancer suggestions where enabled. Draft and paused listings shall not be presented as purchasable. |
| FR-C08 | The system shall let the client select one available service package and permitted optional extras, inspect the combined scope, delivery estimate, and total in EGP, and confirm the order terms before creating an order. It shall recheck that the selected service and terms remain available at confirmation and prevent duplicate orders caused by retrying the same confirmation. |
| FR-C09 | The system shall present a clear order summary and, in the approved Phase 1 demonstration, let the client exercise simulated or provider-sandbox payment outcomes and corresponding simulated escrow states. It shall distinguish awaiting payment, payment recorded, and escrow held states; it shall not collect real money or claim custody or release of funds. The current service checkout example funds an initial 50% in mock escrow and leaves the balance unpaid; this is a frontend demonstration rule, not an approved production payment policy. |
| FR-C10 | The system shall let the client provide or update coordination requirements for an order and exchange messages with the student assigned to that order. Coordination notes shall not silently alter the agreed scope, price, or delivery terms. Only order participants and authorized reviewers may access private conversation details. |
| FR-C11 | The system shall let the client view and track the client's own project and service orders, relevant milestones or activity, delivery estimates or deadlines, and available payment/escrow states. It shall identify whether a value is an agreed amount, amount paid, amount held, amount remaining, or another defined measure. |
| FR-C12 | For an order with a submitted delivery, the system shall let the owning client inspect the latest delivery, request a revision with a reason where permitted, or confirm acceptance and completion where permitted. The system shall preserve prior delivery history, reject stale or unauthorized decisions, and not infer payment release from acceptance. |
| FR-C13 | The system shall let the client view the client's available EGP transaction history, payment attempts, escrow events, fees, refunds, and receipts with their actual recorded statuses. Unapproved fee values or unavailable records shall be labeled as placeholders or omitted; the system shall not fabricate a successful payment or refund. |
| FR-C14 | After an eligible completed order, the system shall let the client submit a rating and review for the participating student, validate the rating and content, and prevent duplicate or mismatched submissions under the approved policy. A review shall not be available for an unpaid, incomplete, unrelated, or unauthorized order. |
| FR-C15 | The system shall let the client submit a support request or a dispute linked to a relevant order, describe the issue, and provide permitted evidence. It shall confirm the simulated or actual case submission, show only the client's own case details, and route financial questions through the approved escalation authority. |
| FR-C16 | The system shall provide the planned help assistant and supported language controls. It shall identify simulated answers, preserve original text when translation is offered, and avoid claiming that an automated answer resolved an account-specific issue. |
| FR-C17 | The system shall let the client manage supported password, language, notification, and active-session preferences and report whether each preference change was applied or simulated. |

### 4.4 Super Admin

| ID | Functional requirement |
|---|---|
| FR-A01 | The system shall allow only an authorized, provisioned Super Admin account to enter administrative functions and end its session. Public registration shall not create a Super Admin account. |
| FR-A02 | The system shall present the Super Admin with summaries of platform activity, account states, committee workload, escalations, and EGP sandbox finance records when those records are available. Each summary shall disclose whether its source is live, mock, incomplete, or unavailable. |
| FR-A03 | The system shall let the Super Admin search and inspect student and client account records and perform approved activation, suspension, or restoration actions. Each successful administrative change shall be traceable. The interface shall not imply persistence if it updates only local demo state. |
| FR-A04 | The system shall let the Super Admin create an account for one of the five authorized committees, validate required account information, assign exactly the intended committee role, and confirm the provisioning result. Such accounts shall not be available through public signup. |
| FR-A05 | The system shall let the Super Admin perform approved account recovery or active-status actions for committee accounts. Exact invitation, credential-reset, deactivation, and credential-delivery procedures remain subject to security approval. |
| FR-A06 | The system shall let the Super Admin review and administer only approved committee role assignments and permissions. It shall prevent assignment of unrestricted privileges through ordinary committee controls and record each permitted change. |
| FR-A07 | The system shall let the Super Admin inspect committee work queues, escalations, and recorded decisions at the scope permitted by governance rules. Sensitive identity or financial information shall be exposed only when needed for the assigned oversight task. |
| FR-A08 | The system shall let the Super Admin decide cases escalated beyond committee authority, require a decision reason where the approved workflow requires it, and record the case, actor, time, action, and outcome. |
| FR-A09 | The system shall let authorized Super Admin users search and inspect audit records for significant account, committee, verification, moderation, dispute, and finance actions. Audit views shall identify simulated records and shall not permit unauthorized users to alter history. |
| FR-A10 | The system shall let the Super Admin manage platform settings explicitly delegated to that role. It shall not allow the EGP-only rule or other approved business constraints to be changed as an ordinary setting. Unapproved settings shall remain unavailable. |

### 4.5 Verification Committee

| ID | Functional requirement |
|---|---|
| FR-VC01 | The system shall authenticate a provisioned Verification Committee account and restrict committee access to its authorized role. The member shall not self-register or create another committee account. |
| FR-VC02 | The system shall let an authorized reviewer view assigned pending, resubmitted, or escalated verification cases and their workflow status without exposing unrelated cases. |
| FR-VC03 | For an assigned case, the system shall present the submitted identity-document type and the required simultaneous face-and-ID capture or its result, plus liveness or document-check results when those services exist. Simulated signals shall be labeled and shall not be described as verified facts. |
| FR-VC04 | The system shall let an authorized reviewer approve, reject, or request resubmission only where the case state permits, record the decision and reason, and update the case history. The final-approval policy and available decision set require institutional approval. |
| FR-VC05 | The system shall limit the Verification Committee view to identity and affiliation data needed for the assigned review, prevent access to unrelated finance or private marketplace records, and record sensitive evidence access according to the approved audit policy. |

### 4.6 Marketplace Operations Committee

| ID | Functional requirement |
|---|---|
| FR-MO01 | The system shall authenticate a Super Admin-provisioned Marketplace Operations account and restrict access to that committee's assigned functions. |
| FR-MO02 | The system shall let authorized reviewers inspect assigned projects, services, proposals, reviews, comments, and reported content with the report context needed to assess the item. |
| FR-MO03 | The system shall let a reviewer apply only approved actions to an assigned item, such as approving, rejecting, hiding, restoring, or requesting changes. The system shall validate the current item state and retain the action history. |
| FR-MO04 | Where automated moderation is enabled, the system shall distinguish an automated flag from a human decision and let the authorized reviewer record the resulting decision. Automated flags alone shall not be presented as proof of a violation. |
| FR-MO05 | The system shall let the committee escalate a case beyond its authority to the authorized committee or Super Admin and preserve the case context and escalation history. |

### 4.7 Finance Committee

| ID | Functional requirement |
|---|---|
| FR-FC01 | The system shall authenticate a provisioned Finance Committee account and restrict financial tools to authorized finance roles. |
| FR-FC02 | The system shall let authorized reviewers inspect available transaction, payment, escrow, refund, payout, fee, and exception records in EGP, with each status and its sandbox or production nature clearly identified. |
| FR-FC03 | The system shall let a reviewer open an authorized transaction and inspect its related order, recorded amounts, status history, and provider reference when present. It shall not expose card credentials or unrelated identity evidence. |
| FR-FC04 | The system shall let finance staff perform only expressly authorized sandbox actions, require any approved reason or confirmation, and record the actor, action, time, target, and result. A mock change shall never initiate a live transfer. |
| FR-FC05 | The system shall let finance staff escalate unresolved, exceptional, or unauthorized finance cases through the approved workflow and preserve the escalation record. |

### 4.8 Support and Disputes Committee

| ID | Functional requirement |
|---|---|
| FR-SD01 | The system shall authenticate a provisioned Support and Disputes Committee account and restrict it to authorized support cases. |
| FR-SD02 | The system shall let reviewers view assigned tickets and disputes, search or filter them using permitted fields, and identify their priority and status when available. |
| FR-SD03 | The system shall let a reviewer inspect the case's relevant order, submitted evidence, and communication history while limiting access to unrelated private or sensitive information. |
| FR-SD04 | The system shall let a reviewer communicate with case participants through an approved channel and record internal case notes separately from user-visible messages. A Phase 1 local ticket shall not imply that an email or external message was sent. |
| FR-SD05 | The system shall let the committee resolve only cases within its delegated authority or escalate financial and other reserved decisions to the proper authority. It shall preserve the decision and resolution history. |

### 4.9 AI and Quality Committee

| ID | Functional requirement |
|---|---|
| FR-AQ01 | The system shall authenticate a provisioned AI and Quality Committee account and restrict it to assigned quality-review functions. |
| FR-AQ02 | The system shall let authorized reviewers inspect available skills-matching examples, user feedback, and reported recommendation problems, including the stated input or explanation when recorded. |
| FR-AQ03 | The system shall let reviewers inspect reported chatbot issues, failed or unhelpful responses, and escalation records that are available and appropriately de-identified. |
| FR-AQ04 | The system shall let reviewers inspect automated moderation outcomes and reports of potential false positives or false negatives, while preserving human authority over consequential moderation decisions. |
| FR-AQ05 | The system shall let the committee record a quality finding, assign or escalate an issue within approved permissions, and inspect its resolution status. Mock findings shall be labeled as examples. |

### 4.10 Cross-role system behavior

These requirements apply across role-specific workflows and do not create an additional user role.

| ID | Functional requirement |
|---|---|
| FR-X01 | The system shall enforce route and record access appropriate to the active role and record ownership. In production, protected operations shall also be enforced by the backend; a hidden button or frontend guard alone is insufficient. |
| FR-X02 | The system shall display clear validation, loading, empty, success, missing-record, access-denied, and recoverable-error states where relevant. Recovery shall not silently duplicate an order, proposal, payment record, or case. |
| FR-X03 | The system shall display monetary amounts in EGP only and distinguish budgets, proposed and agreed amounts, amount due, amount paid, amount held, amount released, refunds, fees, and payouts. It shall not provide currency conversion. |
| FR-X04 | The system shall preserve appropriate history for order, verification, moderation, support, dispute, and financial state changes, and shall identify the responsible actor when known. Production retention and audit controls remain subject to approval. |
| FR-X05 | The system shall identify mock data and simulated actions where a user could mistake them for a live operation. A frontend demonstration shall not claim persistent storage, external delivery, actual identity verification, AI inference, or money movement unless evidenced. |

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

## 8. Data and Record Requirements

The following are conceptual information requirements, not a finalized database schema. Phase 1 records may exist only in fixtures, component state, session memory, or browser session storage, as stated in the relevant implementation notes.

| Record group | Information needed | Ownership or privacy rule |
|---|---|---|
| Account and role | Stable account ID, display name, account category, account status, verification status, and approved contact fields. | Role and verification state are distinct. Credentials are not public profile data. |
| Student profile | Biography, skills, portfolio references, availability when approved, and review summary. | Student edits own profile. Public profile excludes identity evidence and private orders. |
| Client profile | Approved personal or organization display information. | Client edits own profile; expose only approved public fields. |
| Verification case | Account reference, document category, state, reviewer, decision, reason, timestamps, and protected evidence reference. | Evidence is sensitive and separately access-controlled; retention and deletion policy is open. |
| Project and proposal | Client/project IDs, brief fields, EGP budget, deadline, student ID, EGP offer, delivery estimate, message, state, and permitted attachment references. | Project is owned by its client; proposal is owned by its student. |
| Service and package | Student ID, service scope, categories/skills, package and extra IDs, EGP amounts, delivery estimates, and publication state. | Student edits own listing. Existing order terms retain the terms agreed at confirmation. |
| Order and collaboration | Source type/reference, client/student IDs, agreed EGP amount, saved service terms when relevant, state history, requirements, messages, deliveries, and revisions. | Private content is available only to participants and authorized reviewers. |
| Financial record | EGP payment attempt, transaction, held/released amount, fee, refund or payout state, timestamps, and provider reference if one exists. | No card credentials. Phase 1 records are mock data; production access and retention require approval. |
| Review and support case | Eligible order reference, author/target IDs, rating/review, ticket/dispute state, permitted evidence reference, notes, and resolution. | Enforce ownership, eligibility, duplicate prevention, and reviewer scope. |
| Committee and audit | Assigned committee role, case assignment, actor, action, target, timestamp, reason, and result. | Super Admin provisions committees; each committee sees only its authorized information. |
| Notification and AI feedback | Recipient, event/reference, delivery state when available, feedback type, and related non-sensitive context. | Do not claim email or model delivery where none occurred; do not expose private identity evidence to an unapproved provider. |

Amounts should be represented without floating-point ambiguity in a future backend. The exact storage format, database, API, file service, and retention periods are not finalized by this conceptual model.

---

## 9. Acceptance Criteria and Verification

These criteria define observable outcomes for review. They do not claim that the checks have been run. “Simulated” criteria apply only to the Phase 1 frontend and must be labeled in the interface.

| Scenario | Acceptance criteria | Related requirements | Verification method |
|---|---|---|---|
| Public registration | Student and Client registration paths are available; invalid required fields are explained; no public committee or Super Admin role can be selected. | FR-V03, FR-S01, FR-C01, FR-VC01, FR-A01 | Form tests and direct route/access checks. |
| Role access | Student-only and client-only actions reject the other role; committee routes require the matching provisioned role; public users cannot read private records. | FR-X01, FR-S06, FR-C05, FR-A01, FR-VC01, FR-MO01, FR-FC01, FR-SD01, FR-AQ01 | Route tests and ownership tests; production server checks in a later phase. |
| Verification | Student path identifies MIU ID; external-client path identifies government ID; planned camera view specifies face and physical ID together; all outputs are explicitly simulated in Phase 1. | FR-S02, FR-C02, FR-VC02–FR-VC05 | Requirement review and interface inspection; real identity checks are out of scope. |
| Project creation | Client can preview and validate a brief with positive EGP budget and deadline; only the owning client can edit it; publication is visibly simulated. | FR-C04 | Form, store, ownership, and route tests. |
| Proposal lifecycle | Eligible student can submit an offer with EGP price, delivery estimate, and message; client can review own project offers; acceptance creates one linked order; repeated action does not duplicate it. | FR-S05, FR-S06, FR-C05 | Model/store and integration tests. |
| Service lifecycle | Student manages own listing and packages; published service discovery excludes draft/paused listings; client sees package and extras totals before order confirmation. | FR-S07, FR-C07, FR-C08 | Model/store and route integration tests. |
| Order privacy and work | Only the client and assigned student can view order details; an unpaid new order cannot submit delivery; eligible active order can record delivery/revision/completion history. | FR-S08–FR-S11, FR-C10–FR-C12 | Ownership, status, lifecycle, and integration tests. |
| Payment and escrow | Phase 1 clearly labels the mock payment; a failed or cancelled attempt creates no success record; the service demo's 50% initial amount and remaining balance are displayed distinctly; no real transaction or release occurs. | FR-S12, FR-C09, FR-C13, FR-FC02–FR-FC05, FR-X03, FR-X05 | Checkout/store tests and UI review. |
| Reviews | Client review is available only for an eligible completed order, matches its student and client, and cannot be submitted twice. Student-to-client review remains subject to the approved policy. | FR-S13, FR-C14 | Review eligibility and duplicate-submission tests. |
| Support and disputes | User can submit a valid request; the case remains private to its owner and authorized reviewers; financial decisions escalate to an authorized role. | FR-S14, FR-C15, FR-SD02–FR-SD05 | Form validation and access tests. |
| Administration | Super Admin can create a simulated committee record; committee accounts cannot self-register; sensitive governance actions record the actor, action, time, target, reason, and outcome where required. | FR-A01–FR-A09, FR-VC01, FR-MO01, FR-FC01, FR-SD01, FR-AQ01, FR-X04 | Admin model and route permission tests. |
| AI assistance | Recommendations state their input basis and simulated nature; chatbot responses do not claim to perform actions; consequential decisions retain human review. | FR-S04, FR-S15, FR-C07, FR-C16, FR-AQ02–FR-AQ05 | Model and rendering checks plus policy review. |
| Resilience and accessibility | Important forms and lists expose validation, empty, loading, error, and recovery states as applicable; keyboard focus, labels, semantic controls, responsive layout, and screen-reader behavior are reviewed. | FR-X02, NFR-01–NFR-03, NFR-18 | Automated tests plus separate browser and assistive-technology checks. |

### 9.1 Current verification evidence

On 24 October 2026, npm.cmd test was run from frontend/: 317 tests passed, zero failed, across 14 suites. This is automated frontend evidence only. It does not prove every acceptance criterion, manual browser interaction, accessibility conformance, backend authorization, production operation, or screenshot validity. Lint and production build are not reported as executed for this SRS revision.

---

## 10. Implementation Alignment and Limitations

The approved requirements remain the target even where the current frontend is incomplete. The statuses below describe evidence found in the checked-out implementation and documentation; they do not mark the SRS requirements as satisfied.

| Requirement area | Current evidence | Status and limitation |
|---|---|---|
| Public discovery and landing | Routes include landing, projects, services, freelancer discovery, and recommendations. | Implemented frontend demonstrations. Marketplace records and matching are local/mock; not production discovery or AI inference. |
| Registration and sessions | Registration, login, recovery forms, role-aware routes, in-memory mock sessions. | Simulated. No production authentication, persistent sensitive session, email delivery, or backend permission enforcement. |
| Identity verification | Verify and pending routes are registered, but no workflow component is connected in the current route implementation. | Planned/placeholder. No biometric processing, real ID review, or verified MIU affiliation. |
| Projects and proposals | Project drafts/publication, proposal submission/edit/withdrawal, client review and selection, linked awaiting-payment order. | Implemented in-memory demonstrations. Refresh resets state; new order does not imply payment or activated delivery. |
| Services and service orders | Service editing/publication, catalogue/details, package/extra quote, confirmed awaiting-payment order. | Implemented in-memory demonstrations. No persistent order system or real payment. |
| Order collaboration and delivery | Participant order lists/workspaces, requirements, messages, delivery, revisions and eligible completion. | Implemented for defined demo states. Attachments are metadata samples; unpaid new orders cannot start delivery; completion does not release funds. |
| Profiles, reviews, and support | Public/editable profile routes, profile and review stores, support contact form. | Partial demonstrations. Existing reviews support client-to-student completed-order eligibility; student-to-client review remains open. Support is local; committee case workflow is not connected. |
| Client checkout and finance | Client checkout route, payment views, local payment store, and mock escrow display. | Simulated. The 50% service funding is a frontend-specific demonstration; no real payment provider, transaction, fund custody, refund, payout, or full project checkout flow. |
| Super Admin | Admin dashboard and direct demo preview, with local account/case/permission/finance examples. | Simulated frontend dashboard. Committee records do not provision authentication. Production governance, persistence, and backend authorization are absent. |
| Five committee dashboards | Five role-protected routes exist in the route registry. | Placeholder only in this checkout. Route protection does not mean committee workflows are implemented. |
| Help, public information, and chatbot | Public pages, help and chatbot components are available in registered routes/global layout. | Local content and canned guidance. Terms/Privacy content and translations require approval; chatbot is not a production AI or support dispatcher. |
| Notifications and preferences | Notifications route is registered; a settings route is not registered. | Notifications route is a placeholder; no actual notification delivery. Preferences are partial or local to the relevant screen. |
| Responsive and accessible interface | Responsive styles, shared controls, focused automated checks. | Automated coverage exists; manual browser, keyboard, screen-reader, and full mobile acceptance remain separate review work. |
| Backend, database, and deployment | No production backend/database is evidenced by this Phase 1 repository. | Future phase. No deployment, availability, security certification, or production performance claim is made. |

### 10.1 Known integration boundaries

- Checkout consumes service-order records. Project proposals can create orders awaiting payment, but a complete project-order payment and activation path remains a separate integration.
- Student and client dashboard summaries include some independent fictional display data; they are not all derived from marketplace transactions.
- Profile data is not available for every registered demo account. Public profile links and review claims must only appear when the referenced profile and eligible order exist.
- Identity verification, external-client origin, and committee routes are not complete workflows in this checkout.
- Arabic translations and policy wording must come from approved project or university content. Placeholder content must not be presented as legally approved.

---

## 11. Open Decisions

The items below are not confirmed functional requirements. They require the named project authority before production behavior is specified. Approval authority is the project owner/team and, where institutional, legal, financial, or policy matters are involved, MIU or its designated approver.

| ID | Decision | Current status | Requirements affected |
|---|---|---|---|
| OD-01 | How MIU affiliation is checked and which account origins are eligible | Open | FR-S02, FR-C02, NFR-08 |
| OD-02 | Accepted government ID types, consent wording, evidence retention, and deletion process | Open | FR-C02, FR-VC03–FR-VC05, NFR-08 |
| OD-03 | Whether verification decisions require human approval, appeal, or resubmission limits | Open | FR-VC02–FR-VC04 |
| OD-04 | Which payment provider and sandbox scope may be used in later implementation | Open | FR-C09, FR-C13, FR-FC02–FR-FC05 |
| OD-05 | Whether and how escrow can legally operate, when funds are released, and who authorizes that release | Open | FR-C09, FR-S12, FR-FC04 |
| OD-06 | Platform fee/commission, payout timing, refund rules, taxes, and accounting treatment | Open | FR-S12, FR-C13, FR-FC02–FR-FC05 |
| OD-07 | Whether proposals outside a project budget warn or are blocked; exact proposal edit cutoff | Open | FR-S05, FR-S06, FR-C05 |
| OD-08 | Service package limits, cancellation rules, active-order price changes, and revision limits | Open | FR-S07, FR-S11, FR-C08, FR-C12 |
| OD-09 | Student-to-client review policy, rating scale, review edits, and moderation/appeal process | Open | FR-S13, FR-C14, FR-MO02–FR-MO04 |
| OD-10 | Exact per-committee case assignment, decision, and escalation authority | Open | FR-A06–FR-A08, FR-VC04, FR-MO03–FR-MO05, FR-FC04–FR-FC05, FR-SD05 |
| OD-11 | AI model/provider, matching method, moderation threshold, data use, and quality measures | Open | FR-S04, FR-C07, FR-S15, FR-C16, FR-AQ02–FR-AQ05 |
| OD-12 | Supported languages, approved translations, and right-to-left interaction details | Open | FR-V05, FR-S15–FR-S16, FR-C16–FR-C17, NFR-15 |
| OD-13 | Approved Terms and Privacy wording, publication/version owner, and whether pages are informational or binding | Open | Public policy interfaces, NFR-08 |
| OD-14 | Notification channels, email provider, and delivery/retention expectations | Open | FR-S16, FR-C17, FR-A02, NFR-18 |
| OD-15 | Hosting, supported browser versions, production availability, and performance targets beyond the current proposed targets | Open | NFR-04–NFR-07, NFR-17 |
| OD-16 | Whether the full React frontend is an academic deliverable beyond the instructor's five required SRS sections and prototype screenshots | Requires instructor confirmation | Phase 1 scope |
| OD-17 | Official MIU branding, university endorsement, and deployment approval | Open | Public interface and deployment |

---

## 12. Requirements Traceability

This summary maps requirement families to the actor, system module, principal screens, and verification approach. The individual identifiers in Section 4 remain authoritative.

| Requirement IDs | Actor | Module | Principal prototype/route | Verification |
|---|---|---|---|---|
| FR-V01–FR-V05 | Visitor | Public discovery and authentication entry | P-01–P-10, P-30–P-35 | Public route/render checks and interface review |
| FR-S01, FR-C01 | Student, Client | Authentication | P-02–P-04 | Validation, session, and role tests |
| FR-S02, FR-C02, FR-VC01–FR-VC05 | Student, Client, Verification Committee | Verification | P-05, P-24 | Workflow tests after implementation; identity-provider review later |
| FR-S03, FR-C03, FR-C06 | Student, Client | Profiles | P-12, P-17, P-30 | Ownership, privacy, route, and profile-link checks |
| FR-S04–FR-S07, FR-C04–FR-C08 | Student, Client | Projects, proposals, services, discovery | P-06–P-10, P-13, P-16–P-17, P-30–P-31 | Validation/store/route integration tests |
| FR-S08–FR-S11, FR-C10–FR-C12 | Student, Client | Orders and collaboration | P-14, P-19 | Participant, state-transition, delivery, and history tests |
| FR-S12, FR-C09, FR-C13, FR-FC02–FR-FC05 | Student, Client, Finance Committee | Checkout and financial views | P-18, P-26 | EGP calculation, mock-state, ownership, and duplicate-action tests |
| FR-S13, FR-C14, FR-MO02–FR-MO04 | Student, Client, Marketplace Operations | Reviews and moderation | P-12, P-17, P-30 | Eligibility, duplicate, privacy, and moderation-authority tests |
| FR-S14, FR-C15, FR-SD02–FR-SD05 | Student, Client, Support and Disputes Committee | Help and case management | P-21, P-27 | Validation, case ownership, evidence privacy, and escalation tests |
| FR-S15, FR-C16, FR-AQ03 | Student, Client, AI and Quality Committee | Help and chatbot | P-20, P-28 | Disclosure, safe output, feedback, and route tests |
| FR-S16, FR-C17 | Student, Client | Account preferences | P-29 | Preference and route tests after implementation |
| FR-A01–FR-A10 | Super Admin | Governance | P-22–P-23 | Role, transition, audit, and route tests |
| FR-MO01, FR-MO05, FR-AQ01–FR-AQ05 | Marketplace Operations, AI and Quality | Committee review | P-25, P-28 | Scoped access, human review, and escalation tests after implementation |
| FR-X01–FR-X05 | All actors | Cross-cutting behavior | P-01–P-35 | Access, state, currency, privacy, disclosure, and recovery tests |

---

## 13. Glossary

| Term | Meaning in this SRS |
|---|---|
| Client | A registered user who posts projects or orders a student's service. |
| Student Freelancer | An MIU student account that applies to projects and may publish services. |
| Project | A client-published request for work to which students may submit proposals. |
| Proposal | A student's offer to perform a particular project for a stated EGP amount and delivery estimate. |
| Service | A student-published, predefined work offering that a client can order directly. |
| Package | A priced scope and deliverable level within a service. |
| Extra | An optional, separately priced addition to a service package. |
| Order | A participant-specific engagement created from an accepted proposal or a confirmed service selection. |
| Escrow | A proposed controlled-funds arrangement; the Phase 1 interface only simulates statuses and holds no funds. |
| Simulated | A local demonstration that does not perform the represented real-world or persistent operation. |
| Prototype screenshot | An image captured from the running application to document its interface; it is not source code or proof of backend functionality. |
| Committee | One of the five specialized roles provisioned by the Super Admin and restricted to its assigned responsibilities. |

---

## 14. References

- Project scope, business rules, and permissions: [Project Scope](PROJECT_SCOPE.md), [Business Rules](../02-REQUIREMENTS/BUSINESS_RULES.md), and [User Roles and Permissions](../02-REQUIREMENTS/USER_ROLES_AND_PERMISSIONS.md).
- Application routes: [Pages and Routes](../03-DESIGN/PAGES_AND_ROUTES.md).
- Feature-specific behavior: [Projects and Proposals](../06-MODULES/PROJECTS_AND_PROPOSALS.md), [Services and Orders](../06-MODULES/SERVICES_AND_ORDERS.md), [Verification](../06-MODULES/VERIFICATION.md), [Payments and Escrow](../06-MODULES/PAYMENTS_AND_ESCROW.md), and [Admin and Committees](../06-MODULES/ADMIN_AND_COMMITTEES.md).
- Mostaql Help Center, “Add a Project” and “Professional Proposal Tips,” accessed 24 October 2026: [Add a Project](https://support.mostaql.com/post-a-project) and [Professional Proposal Tips](https://support.mostaql.com/proposal-tips). These pages support the general project-and-proposal workflow comparison only.
- Khamsat Help Center, “Buying Services,” accessed 24 October 2026: [Buying Services](https://support.khamsat.com/buying-services). This page supports the general service, optional extras, and direct-order workflow comparison only.

---

## End of Document

**Document:** MIU Freelance Platform — Phase 1 SRS

**Version:** 1.2 Draft

**Date:** October 2026

**Prototype screenshots:** Intentionally deferred for later insertion.

**Document purpose:** Requirements specification and interface prototype inventory for Phase 1.
