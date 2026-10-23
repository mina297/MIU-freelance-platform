
# MIU Freelance Platform — Documentation Hub

Welcome to the central documentation directory for the MIU Freelance Platform.

This documentation is intended for:

- Current student developers
- AI development agents
- Software engineering instructors and reviewers
- Future university development teams

## Documentation Map

### 01 — Project

| Document | Purpose |
|---|---|
| [Project Overview](01-PROJECT/PROJECT_OVERVIEW.md) | Vision, objectives, and project description |
| [SRS](01-PROJECT/SRS.md) | Requirements baseline, Version 1.1 |
| [Project Scope](01-PROJECT/PROJECT_SCOPE.md) | In-scope, out-of-scope, and future work |
| [Development Roadmap](01-PROJECT/DEVELOPMENT_ROADMAP.md) | Project phases and milestones |

### 02 — Requirements

| Document | Purpose |
|---|---|
| [Features](02-REQUIREMENTS/FEATURES.md) | Functional capability catalogue |
| [Roles and Permissions](02-REQUIREMENTS/USER_ROLES_AND_PERMISSIONS.md) | Access and authorization rules |
| [User Flows](02-REQUIREMENTS/USER_FLOWS.md) | End-to-end journeys |
| [Business Rules](02-REQUIREMENTS/BUSINESS_RULES.md) | Marketplace and administrative rules |

### 03 — Design

| Document | Purpose |
|---|---|
| [Design System](03-DESIGN/DESIGN_SYSTEM.md) | Visual design conventions and tokens |
| [Pages and Routes](03-DESIGN/PAGES_AND_ROUTES.md) | Screen inventory and navigation |
| [UI Components](03-DESIGN/UI_COMPONENTS.md) | Reusable interface component catalogue |

### 04 — Architecture

| Document | Purpose |
|---|---|
| [System Architecture](04-ARCHITECTURE/SYSTEM_ARCHITECTURE.md) | Overall planned technical structure |
| [Frontend Architecture](04-ARCHITECTURE/FRONTEND_ARCHITECTURE.md) | React architecture and state |
| [Data Models](04-ARCHITECTURE/DATA_MODELS.md) | Conceptual entities and relationships |
| [API Contracts](04-ARCHITECTURE/API_CONTRACTS.md) | Proposed future API conventions |

### 05 — Development

| Document | Purpose |
|---|---|
| [Work Distribution](05-DEVELOPMENT/PHASE1_WORK_DISTRIBUTION.md) | Member 1–5 responsibilities |
| [Coding Standards](05-DEVELOPMENT/CODING_STANDARDS.md) | Code quality rules |
| [Git Workflow](05-DEVELOPMENT/GIT_WORKFLOW.md) | Collaboration and pull requests |
| [Testing Strategy](05-DEVELOPMENT/TESTING_STRATEGY.md) | QA and test expectations |

### 06 — Modules

| Document | Purpose |
|---|---|
| [Authentication](06-MODULES/AUTHENTICATION.md) | Accounts and sessions |
| [Verification](06-MODULES/VERIFICATION.md) | Identity workflow |
| [Projects and Proposals](06-MODULES/PROJECTS_AND_PROPOSALS.md) | Project marketplace |
| [Services and Orders](06-MODULES/SERVICES_AND_ORDERS.md) | Service marketplace |
| [Payments and Escrow](06-MODULES/PAYMENTS_AND_ESCROW.md) | Financial workflows |
| [AI Features](06-MODULES/AI_FEATURES.md) | AI-assisted capabilities |
| [Admin and Committees](06-MODULES/ADMIN_AND_COMMITTEES.md) | Governance workflows |
| [Client Dashboard](06-MODULES/CLIENT_DASHBOARD.md) | Implemented frontend preview and remaining integration work |

### 07 — Handover

| Document | Purpose |
|---|---|
| [Deployment Guide](07-HANDOVER/DEPLOYMENT_GUIDE.md) | Deployment preparation and procedures awaiting verification |
| [Maintenance Guide](07-HANDOVER/MAINTENANCE_GUIDE.md) | Long-term development guidance |
| [Known Issues](07-HANDOVER/KNOWN_ISSUES.md) | Open questions, issues, and limitations |

## Recommended Reading Order

### For New Developers

1. Project Overview
2. SRS
3. Project Scope
4. Features
5. Roles and Permissions
6. System Architecture
7. Frontend Architecture
8. Relevant Module Documentation

### For AI Coding Agents

Start with the repository root `AGENTS.md`.

Then follow its reading and implementation rules.

### For Project Reviewers

Start with the SRS, scope, prototype inventory, and development roadmap.

## Documentation Rules

1. The latest approved SRS is the requirements baseline.
2. Approved changes must be documented.
3. Requirements must not be silently changed.
4. Planned and implemented functionality must be distinguished.
5. Documents should link to related documents instead of unnecessarily duplicating information.
6. Update documentation whenever relevant behavior changes.
7. Do not record real passwords, ID documents, API keys, or other secrets.

## Document Status Terms

| Status | Meaning |
|---|---|
| Approved | Confirmed by the relevant project authority |
| Baseline | Current reference for ongoing work |
| Draft | Proposed and subject to review |
| Planned | Intended but not yet implemented |
| Simulated | Demonstrated through mock frontend behavior |
| Implemented | Exists in the application and has been verified |
| Blocked | Requires a decision, dependency, or approval |

## Current Baseline

- **Project:** MIU Freelance Platform
- **Requirements:** SRS v1.1, October 2026
- **Current focus:** Phase 1
- **Currency:** EGP only
- **Marketplace types:** Projects/proposals and services/orders
- **Administrative structure:** Super Admin and five committees

---

**Documentation should help the next developer understand not only what the system does, but also why it was designed that way.**
