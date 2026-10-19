
# MIU Freelance Platform

## Your Talent. Real Opportunities.

**A university-focused freelancing marketplace connecting student talent with real opportunities.**

**Institution:** Misr International University (MIU)  
**Project Type:** Software Engineering  
**Academic Year:** 2026–2027  
**Current Stage:** Phase 1 — Requirements, Prototyping & Frontend Development  
**Documentation Baseline:** SRS v1.1

---

## About the Project

MIU Freelance Platform is a proposed digital marketplace designed to help MIU students turn their skills into professional experience.

It connects student freelancers with clients through two marketplace experiences:

### Project-Based Freelancing
Inspired by Mostaql.

1. Clients publish projects with requirements, budgets, and deadlines.
2. Students discover projects and submit proposals.
3. Clients compare proposals and select freelancers.
4. Students complete the work and deliver it for review.

### Service-Based Freelancing
Inspired by Khamsat.

1. Students publish freelance services.
2. Clients explore services, packages, and extras.
3. Clients place orders.
4. Students complete and deliver the requested services.

Both models belong to one integrated platform.

## Main Capabilities

- Student and client accounts
- Profiles, skills, and portfolios
- Projects and proposals
- Services, packages, and orders
- Messaging and delivery management
- Reviews and ratings
- AI-assisted skills matching
- Planned live face and ID verification
- AI chatbot and moderation assistance
- Online payment and escrow workflows
- Support tickets and disputes
- Super Admin and five administrative committees
- Role-based dashboards and permissions
- Interface and message translation
- EGP-only pricing

> [!IMPORTANT]
> The platform is under development. Phase 1 uses mock data and simulated frontend workflows. Production authentication, identity verification, AI services, online payments, and escrow are not claimed to be operational.

## User Roles

| Role | Purpose |
|---|---|
| Visitor | Explore publicly available marketplace information |
| Student Freelancer | Submit proposals, publish services, deliver work |
| Client | Post projects, hire freelancers, purchase services |
| Super Admin | Manage governance, accounts, permissions, escalations |
| Verification Committee | Review identity and profile verification |
| Marketplace Operations | Review marketplace content and reports |
| Finance Committee | Monitor payments, escrow, refunds, and fees |
| Support & Disputes | Handle tickets, complaints, and disputes |
| AI & Quality | Review AI performance, feedback, and errors |

Committee members do not self-register. Their accounts are created by the Super Admin.

## Technology Direction

**Phase 1 frontend:**
- React and JavaScript
- Vite
- React Router
- Tailwind CSS v4
- Lucide React
- React Context where appropriate
- Figma for UI/UX design

**Proposed later technologies:**
- Node.js and Express
- PostgreSQL and Prisma
- Approved AI and payment integrations
- Capacitor for mobile packaging

These future selections remain subject to technical review.

## Development Phases

| Phase | Focus |
|---|---|
| 1 | Requirements, prototypes, responsive frontend, mock interactions |
| 2 | Backend, database, secure authentication, approved integrations |
| 3 | Mobile packaging, system testing, final delivery |

The course's confirmed Phase 1 discussion requirements are the SRS sections and prototypes of all forms/pages. A complete React frontend is an additional team development objective unless separately required by the instructor.

## Project Documentation

The complete knowledge base is located in [`docs/`](docs/README.md).

Start with:

1. [Project Overview](docs/01-PROJECT/PROJECT_OVERVIEW.md)
2. [Software Requirements Specification](docs/01-PROJECT/SRS.md)
3. [Project Scope](docs/01-PROJECT/PROJECT_SCOPE.md)
4. [Features](docs/02-REQUIREMENTS/FEATURES.md)
5. [User Roles and Permissions](docs/02-REQUIREMENTS/USER_ROLES_AND_PERMISSIONS.md)
6. [Development Roadmap](docs/01-PROJECT/DEVELOPMENT_ROADMAP.md)

AI development agents should also read [AGENTS.md](AGENTS.md).

## Collaboration

The project is developed by a five-member university team.

Development practices include:
- Feature ownership
- Reusable components
- Git feature branches
- Pull requests and peer review
- Shared requirements and design documentation
- Testing before integration
- Documentation updates alongside implementation

## Project Principles

**Trust. Student Opportunity. Usability. Accountability. Maintainability.**

All monetary values are expressed in **Egyptian Pounds (EGP)**. No multi-currency or currency conversion functionality is planned.

## Academic Notice

This is an academic software engineering project designed for an MIU context. It does not independently establish official university endorsement or production deployment approval.

Production financial services and identity processing require appropriate approvals and technical safeguards.

## License

No software license has been selected yet. Do not assume redistribution or reuse permissions until a license is explicitly added.

---

**MIU Freelance Platform**  
*Your Talent. Real Opportunities.*
