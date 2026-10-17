# MIU Freelance Platform

**Your Talent. Real Opportunities.**

A university-focused freelance marketplace designed to connect **Misr International University (MIU)** students with clients seeking creative, technical, and professional services.

> **Project status:** Academic software engineering project — Phase 1 frontend prototype in development. Features described below include planned capabilities; real payments, identity verification, AI services, and backend integrations are **not live**.

## Overview

MIU Freelance Platform aims to help students gain practical experience, showcase their skills, build portfolios, and work on real projects. Clients can discover student talent through two complementary marketplace experiences:

| Marketplace model | How it works |
| --- | --- |
| **Projects & proposals** (inspired by Mostaql) | Clients post projects with budgets and deadlines; students submit proposals with their price, timeline, and approach. Clients review proposals and select a freelancer. |
| **Services** (inspired by Khamsat) | Students publish services with descriptions, prices, delivery times, and portfolio samples. Clients browse services and place orders directly. |

Both models are designed to support order tracking, delivery, reviews, and a planned payment/escrow workflow.

## Key Features

### For students / freelancers
- Create a profile showcasing skills, experience, and portfolio work.
- Browse projects and submit or manage proposals.
- Publish and manage freelance services.
- Track orders, deliveries, and project progress.
- Receive AI-assisted job recommendations (planned; mocked in Phase 1).
- Build a reputation through ratings and reviews.

### For clients
- Post projects and compare freelancer proposals.
- Search student profiles and browse listed services.
- Place service orders and track progress.
- Review deliverables and provide feedback.
- View EGP-denominated checkout, transactions, and escrow status in the prototype.

### Trust, verification, and AI
- **Identity verification concept:** A single live camera view shows the user’s face and physical ID at the same time. MIU students and university members use an appropriate MIU-issued ID; external users use a national or other accepted government ID. AI-assisted matching and affiliation checks are planned, with privacy safeguards and human review.
- **Skills matching:** Recommend relevant opportunities and freelancers.
- **AI chatbot:** Help users navigate the platform and common workflows.
- **Content review:** Assist moderators by flagging potentially inappropriate comments or reviews.

**Phase 1 note:** These interfaces use mock data and simulated results. No real biometric matching, document processing, or production AI service is implemented in Phase 1.

## Administration and Committees

The platform includes a **Super Admin** role responsible for governance, account management, permissions, and escalations, with five specialized departments:

| Department | Responsibilities |
| --- | --- |
| **Verification Committee** | Review identity and profile verification cases. |
| **Marketplace Operations** | Review projects, services, proposals, and reported content. |
| **Finance Committee** | Review payment, escrow, refund, and transaction records. |
| **Support & Disputes** | Handle support requests, delivery disputes, and escalations. |
| **AI & Quality Committee** | Review AI-related feedback, flagged content, and quality issues. |

**Committee members do not self-register.** Their accounts are created by the Super Admin, and they log in with their assigned credentials. Role-based access restricts each department to its authorized functions.

## Payments and Currency

All project budgets, proposal prices, service prices, transaction displays, and planned escrow flows use **Egyptian Pounds (EGP) only**. There is no currency conversion feature.

Payment, escrow funding, release, refund, and payout screens are **simulated in Phase 1**. Any future real-money integration will require an approved payment provider and appropriate institutional, legal, and financial authorization.

## Technology Stack

| Area | Technology | Status |
| --- | --- | --- |
| Frontend | React (JavaScript), Vite, React Router | Phase 1 |
| Styling | Tailwind CSS v4 | Phase 1 |
| Icons | Lucide React | Phase 1 |
| Frontend state | React Context and local mock data where appropriate | Phase 1 |
| Backend | Node.js, Express | Planned |
| Database | PostgreSQL, Prisma | Planned |
| Mobile packaging | Capacitor (Android) | Planned later phase |

## Development Roadmap

### Phase 1 — Frontend and Prototypes
- [ ] Build responsive public, student, client, and administrative interfaces.
- [ ] Demonstrate both projects/proposals and services/orders using mock data.
- [ ] Build simulated verification, AI, checkout, escrow, and committee workflows.
- [ ] Prepare the Software Requirements Specification (SRS) and prototypes of all forms/pages.

### Phase 2 — Backend and Integrations (Planned)
- [ ] Implement APIs, database models, and real authentication.
- [ ] Integrate approved verification and AI services where feasible.
- [ ] Evaluate payment-provider sandbox integration and approved financial workflows.

### Phase 3 — Mobile Packaging (Planned)
- [ ] Adapt and package the responsive application using Capacitor.
- [ ] Test Android navigation and device compatibility.

> The Phase 1 academic discussion requires an SRS covering the preface and introduction, similar systems, functional user requirements, non-functional user requirements, and prototypes of all forms/pages. The working React frontend is an additional team development objective unless explicitly required by the instructor.

## Project Structure

The following is an **illustrative target structure**; the actual repository may evolve:

```text
src/
├── app/              # Routing and application providers
├── components/       # Shared UI components
├── features/         # Auth, projects, services, orders, admin, etc.
├── layouts/          # Public, authenticated, and admin layouts
├── data/             # Mock fixtures and demo scenarios
├── hooks/            # Reusable hooks
├── utils/            # Validation, permissions, EGP formatting
├── assets/           # Images and other static assets
└── styles/           # Global styling
```

## Getting Started

Once the frontend source code is added to this repository and a `package.json` is available:

```bash
npm install
npm run dev
```

Open the local address printed by Vite. Commands and setup details may change as the project is initialized.

## Team Collaboration

This is a five-member software engineering project. Frontend work is divided into feature modules covering authentication and verification, marketplace workflows, dashboards and administration, public UI, and profiles and support.

Contributors should use feature branches, open pull requests for review, follow the shared design system, and test their changes before merging.

## Project Notes

- **Institution:** Misr International University (MIU), Egypt.
- **Purpose:** University software engineering project.
- **Design:** Intended to follow the approved Figma design and MIU-inspired visual identity; institutional branding and deployment require appropriate approval.
- **Availability:** This repository is not presented as an official MIU service or a production payment platform.
- **License:** To be determined by the project team.

---

**MIU Freelance Platform** — *Your Talent. Real Opportunities.*
