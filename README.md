# MIU Freelance Platform

<p align="center">
  <strong>Your Talent. Real Opportunities.</strong>
</p>

<p align="center">
  A university-focused freelance marketplace connecting student talent with real-world opportunities.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Project-MIU%20Freelance%20Platform-AC1F2D" alt="Project" />
  <img src="https://img.shields.io/badge/Status-In%20Development-blue" alt="Development Status" />
  <img src="https://img.shields.io/badge/Phase-1%20Frontend-orange" alt="Current Phase" />
  <img src="https://img.shields.io/badge/Currency-EGP-green" alt="Currency" />
</p>

---

## Overview

**MIU Freelance Platform** is a university-focused freelancing marketplace designed for **Misr International University (MIU)**.

The platform aims to bridge the gap between academic learning and professional experience by helping students showcase their skills, discover freelance opportunities, collaborate with clients, and build professional portfolios.

It combines two complementary marketplace models:

- **Project-based freelancing:** Clients publish projects, and student freelancers compete by submitting proposals.
- **Service-based freelancing:** Students publish predefined services that clients can browse and order directly.

The platform is designed to support secure account verification, AI-assisted discovery, role-based administration, simulated escrow workflows, and transparent collaboration.

> **Development note:** The project is currently in Phase 1. Frontend demonstrations use mock data and simulated interactions. Production authentication, biometric verification, AI services, payment processing, and escrow are planned capabilities—not live features.

---

## Our Vision

**Empower student talent. Connect education with opportunity.**

Our vision is to create a trusted digital environment where MIU students can transform their knowledge into practical experience, strengthen their professional portfolios, and connect with clients seeking creative and technical services.

### Our Objectives

- Connect students with meaningful freelance opportunities.
- Support practical experience beyond classroom assignments.
- Help students build professional profiles and portfolios.
- Provide clients with access to university talent.
- Offer both competitive project proposals and direct service purchasing.
- Encourage trust through verification, reviews, and administrative oversight.
- Explore AI-assisted tools that improve discovery, assistance, and platform quality.

---

## Two Marketplace Experiences

### 1. Project-Based Marketplace — Inspired by Mostaql

Clients can publish projects with requirements, budgets, and deadlines.

Student freelancers can browse available projects and submit proposals describing their approach, proposed price, and estimated delivery time.

**Typical workflow:**

1. A client publishes a project.
2. Students discover matching opportunities.
3. Students submit proposals.
4. The client compares proposals and selects a freelancer.
5. A project workspace is created.
6. The freelancer delivers the agreed work.
7. The client reviews the delivery and provides feedback.

### 2. Service-Based Marketplace — Inspired by Khamsat

Students can publish freelance services with descriptions, prices, delivery times, and portfolio examples.

Clients can search for services and freelancers, review available offerings, and place orders directly.

**Typical workflow:**

1. A student creates a service listing.
2. A client discovers the service.
3. The client reviews its details and price.
4. The client places an order.
5. The freelancer completes and submits the work.
6. The client reviews the delivery and leaves feedback.

Both marketplace experiences are intended to share consistent order tracking, reviews, dispute handling, and payment workflows.

---

## Core Platform Features

### Student Freelancers

- Student registration and profile management
- University identity verification workflow
- Professional profiles and portfolios
- Skills, categories, and service specializations
- Project discovery and proposal submission
- Service creation and management
- Order and delivery tracking
- Personalized job recommendations
- Reviews, ratings, and performance summaries
- Student dashboard

### Clients

- Client registration and profile management
- Identity verification workflow
- Project creation and management
- Proposal comparison and freelancer selection
- Freelancer and service discovery
- Direct service ordering
- Order tracking and delivery review
- Payment and escrow interfaces
- Reviews, ratings, and dispute requests
- Client dashboard

### AI-Assisted Capabilities

The platform is designed to explore several AI-powered features:

| Feature | Purpose |
|---|---|
| Identity Verification | Assist in comparing a live user's face with the photograph on an identity document |
| Skills Matching | Recommend relevant projects and freelancers based on skills and requirements |
| AI Chatbot | Help users navigate the platform and understand common workflows |
| Comment Moderation | Flag potentially inappropriate comments or reviews for further review |
| AI Quality Monitoring | Support administrative review of AI feedback, errors, and flagged results |

**Identity verification concept:** The user presents their face and physical ID together in a live camera view. MIU-affiliated users present an appropriate university ID, while external clients present an accepted government-issued identity document. University affiliation requires a separate validation process.

**Privacy and safety:** Production identity verification would require consent, secure handling of identity information, appropriate data retention rules, and a manual review option.

All AI-related Phase 1 interfaces use simulated responses.

---

## Administrative Structure

The platform uses role-based access control and a centralized administrative structure.

### Super Admin

The Super Admin is responsible for administrative governance, role management, committee account creation, and platform oversight.

### Five Administrative Departments

| Department | Main Responsibilities |
|---|---|
| Verification Committee | Review identity verification requests, profiles, and account approval cases |
| Marketplace Operations | Monitor projects, services, proposals, and reported marketplace content |
| Finance Committee | Review transaction records, escrow activity, refunds, and payment-related cases |
| Support & Disputes | Manage support tickets, complaints, delivery disagreements, and disputes |
| AI & Quality Committee | Review AI recommendations, moderation flags, chatbot feedback, and quality reports |

**Committee access policy:** Committee members do not register through the public registration system. Their accounts are created and managed by the Super Admin, and members access their assigned dashboards through login.

---

## Payments and Escrow

The platform is designed to support online payment workflows and escrow-based transactions.

Planned capabilities include:

- Project and service checkout
- Transaction history
- Funded-order tracking
- Escrow status visibility
- Delivery approval workflows
- Refund and dispute management
- Administrative financial oversight

**Currency:** All platform prices, proposals, services, transaction records, and payment displays use **Egyptian Pounds (EGP)** exclusively.

> Phase 1 includes simulated payment and escrow interfaces only. Real transactions and fund custody require approved payment integrations and appropriate institutional, legal, and financial arrangements.

---

## Technology Stack

### Phase 1 — Frontend

| Technology | Purpose |
|---|---|
| React | Component-based user interfaces |
| JavaScript | Application logic |
| Vite | Frontend development and build tooling |
| React Router | Client-side routing |
| Tailwind CSS v4 | Styling and responsive design |
| Lucide React | Icons |
| React Context | Shared frontend state where appropriate |
| Figma | UI/UX design and prototyping |

### Planned Future Technologies

| Technology | Intended Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | Backend API development |
| PostgreSQL | Relational database |
| Prisma | Database access and modeling |
| Capacitor | Mobile application packaging |
| Payment Gateway | Approved online payment integration |
| AI Services | Identity assistance, recommendations, chatbot, and moderation |

Technology selections may be refined as development progresses.

---

## Development Roadmap

### Phase 1 — Frontend and Prototyping

- [ ] Finalize UI/UX designs and prototypes
- [ ] Build responsive public pages
- [ ] Implement frontend authentication screens
- [ ] Build student and client dashboards
- [ ] Implement project and proposal interfaces
- [ ] Implement service marketplace interfaces
- [ ] Create profiles, portfolios, and reviews
- [ ] Build Super Admin and committee dashboards
- [ ] Demonstrate AI-assisted workflows with mock data
- [ ] Demonstrate checkout and escrow states
- [ ] Test navigation, responsiveness, and usability

### Phase 2 — Backend and Integration

- [ ] Implement backend APIs
- [ ] Integrate database models
- [ ] Implement secure authentication and authorization
- [ ] Connect marketplace workflows to persistent data
- [ ] Integrate approved verification and AI services
- [ ] Implement approved sandbox payment workflows
- [ ] Add security, validation, and audit controls

### Phase 3 — Mobile and Final Delivery

- [ ] Prepare Capacitor mobile packaging
- [ ] Optimize mobile user experience
- [ ] Complete end-to-end testing
- [ ] Improve performance and accessibility
- [ ] Prepare final project documentation and demonstration

---

## Phase 1 Scope

The initial frontend is intended to be a responsive, navigable demonstration using realistic mock data.

It does **not** provide:

- A production backend or database
- Real user authentication
- Live identity or biometric verification
- Production AI processing
- Real payments or escrow
- Production-ready financial transactions

These boundaries allow the team to demonstrate the user experience before integrating backend services.

---

## User Roles

The platform is designed around the following roles:

- **Student Freelancer:** Offers services, submits proposals, manages projects, and builds a portfolio.
- **Client:** Publishes projects, hires freelancers, orders services, and reviews work.
- **Super Admin:** Oversees platform governance and administrative accounts.
- **Committee Member:** Performs department-specific review and management tasks.

Each role is intended to have a dedicated dashboard and appropriate access permissions.

---

## UI/UX Principles

The interface aims to deliver a professional, accessible, and consistent experience.

Key design priorities include:

- MIU-inspired visual identity
- Modern, clean layouts
- Responsive desktop and mobile experiences
- Clear navigation and user flows
- Reusable UI components
- Accessible forms and interactions
- Informative loading, empty, and error states
- Consistent dashboards and status indicators
- Arabic and English localization where supported

**Design headline:** Your Talent. Real Opportunities.

---

## Team Collaboration

The project is developed collaboratively by a five-member software engineering team.

Our development approach emphasizes:

- Clear module ownership
- Feature-based development
- Consistent coding standards
- Git branches and pull requests
- Peer code reviews
- Shared UI components
- Integration testing
- Technical documentation

---

## Project Status

**Current stage:** Phase 1 — Frontend Development and Prototyping

This repository represents an academic software engineering project in development. Features, architecture, and integrations may evolve as requirements are reviewed and implementation progresses.

---

## Academic Context

**Institution:** Misr International University (MIU)  
**Project:** MIU Freelance Platform  
**Discipline:** Software Engineering  
**Academic Year:** 2026–2027

This project is developed for academic and educational purposes. References to MIU describe the intended university context and do not independently establish official university endorsement or production deployment approval.

---

## License

Licensing terms have not yet been finalized. Until a license is added, no open-source license is granted by this repository.

---

<p align="center">
  <strong>MIU Freelance Platform</strong>
</p>

<p align="center">
  Your Talent. Real Opportunities.
</p>

<p align="center">
  Built to connect student skills with meaningful opportunities.
</p>
