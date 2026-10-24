
---
title: Frontend Architecture
type: frontend-architecture
status: proposed
tags: [MIU, React, frontend]
---

# MIU Freelance Platform — Frontend Architecture

## 1. Goal

Build a maintainable, responsive React application that supports the Phase 1 mock workflows and can later connect to real backend APIs.

## 2. Selected Frontend Direction

The production build separates `node_modules` into a vendor chunk using the installed Vite/Rolldown `build.rolldownOptions.output.codeSplitting.groups` API. The application chunk stays separate for caching; this does not provide route-level lazy loading or reduce total initial JavaScript. See the [M2 integration report](../07-HANDOVER/M2_MARKETPLACE_INTEGRATION_2026-10-24.md).

- React with JavaScript
- Vite
- React Router
- Tailwind CSS v4
- Lucide React
- React Context where appropriate
- Feature-based organization
- Mock data for Phase 1

## 3. Recommended Directory Structure

```text
src/
├── app/
│   ├── App.jsx
│   ├── router.jsx
│   └── providers.jsx
├── assets/
├── components/
│   ├── ui/
│   ├── navigation/
│   └── feedback/
├── layouts/
│   ├── PublicLayout.jsx
│   ├── AuthLayout.jsx
│   ├── AppLayout.jsx
│   └── AdminLayout.jsx
├── features/
│   ├── public/
│   ├── auth/
│   ├── verification/
│   ├── projects/
│   ├── proposals/
│   ├── services/
│   ├── orders/
│   ├── dashboards/
│   ├── payments/
│   ├── governance/
│   ├── profiles/
│   ├── reviews/
│   ├── recommendations/
│   └── help/
├── contexts/
├── data/
│   ├── fixtures/
│   ├── scenarios/
│   └── contracts.js
├── hooks/
├── utils/
├── styles/
└── tests/
```

The exact structure may be adjusted to the existing repository after inspection.

## 4. Feature Ownership

| Module | Owner |
|---|---|
| Foundation, routing, authentication, verification | Member 1 |
| Projects, proposals, services, orders, skills matching | Member 2 |
| Dashboards, payments, escrow, governance | Member 3 |
| Public pages and shared visual components | Member 4 |
| Profiles, portfolio, reviews, help presentation | Member 5 |

Full responsibilities are recorded in the work distribution document.

## 5. Routing

Use React Router.

Routes should specify:
- Path
- Layout
- Allowed roles
- Page component
- Navigation visibility
- Optional title/metadata

Route access checks in Phase 1 simulate intended authorization.

Production permissions must be enforced by the backend.

## 6. State Management

### Local Component State
Use for:
- Form input
- Tabs
- Dialog state
- Local filters
- Temporary UI states

### Shared Context
Use for:
- Mock session
- Active role
- Shared notifications
- Marketplace mock records when multiple pages need them
- Administrative mock records where appropriate

Avoid unnecessary global state.

## 7. Mock Data

Organize fixtures by domain:
- Users
- Profiles
- Projects
- Proposals
- Services
- Orders
- Payments
- Reviews
- Committee cases
- Notifications

Use stable IDs.

Fixtures should reference each other consistently.

Examples:
- A proposal references an existing project and student.
- An order references participants and either a project or a service.
- A payment record references an existing order.

## 8. Shared Utilities

Useful utilities include:
- EGP formatter
- Date formatting
- Input validation
- Role permission helpers
- Status labels
- Mock-data reset helper

Use one EGP formatter throughout the application.

## 9. Component Organization

Generic UI components should remain independent of specific features.

Business behavior should live in feature modules.

Avoid copying common components into multiple feature folders.

## 10. Loading and Error Handling

Every important screen should consider:
- Loading
- Empty results
- Validation failure
- Missing record
- Unauthorized access
- Recoverable error
- Success confirmation

## 11. Responsiveness

Build for:
- Desktop
- Tablet
- Mobile web

Test essential forms, marketplace cards, tables, and dashboard navigation at agreed breakpoints.

## 12. Accessibility

Core interactions should support:
- Semantic elements
- Keyboard navigation
- Visible focus
- Labels and descriptions
- Accessible dialogs
- Text alternatives
- Understandable errors

## 13. API Readiness

Frontend modules should not depend directly on storage implementation details.

Later backend integration should replace mock data access without requiring complete UI rewrites.

Avoid creating a complicated fake backend merely to simulate Phase 1 workflows.

## 14. Integration Rules

- Coordinate changes to shared data contracts.
- Avoid editing another member's feature without discussion.
- Keep pull requests focused.
- Do not merge broken routes.
- Test complete journeys after module integration.

## Related Documents

- [System Architecture](SYSTEM_ARCHITECTURE.md)
- [Pages and Routes](../03-DESIGN/PAGES_AND_ROUTES.md)
- [Coding Standards](../05-DEVELOPMENT/CODING_STANDARDS.md)
- [Work Distribution](../05-DEVELOPMENT/PHASE1_WORK_DISTRIBUTION.md)
