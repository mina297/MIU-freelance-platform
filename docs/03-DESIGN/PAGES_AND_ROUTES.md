---
title: Pages and Routes
type: navigation-specification
status: proposed-route-map
tags: [MIU, pages, routing]
---

# MIU Freelance Platform — Pages and Routes

## Purpose

Map the 29 SRS prototype entries to proposed frontend routes.

**Important:** Prototype IDs are established in SRS v1.1. Route paths are proposed engineering conventions and may be adjusted before implementation.

## 1. SRS Prototype Mapping

| ID   | Page                            | Proposed Route(s)                                            | Access                       |
| ---- | ------------------------------- | ------------------------------------------------------------ | ---------------------------- |
| P-01 | Landing                         | `/`                                                          | Public                       |
| P-02 | Registration and Role Selection | `/register`, `/register/role`                                | Public                       |
| P-03 | Login                           | `/login`                                                     | Public                       |
| P-04 | Forgot and Reset Password       | `/forgot-password`, `/reset-password`                        | Public                       |
| P-05 | Identity Verification           | `/verify`, `/verify/pending`                                 | Student/Client               |
| P-06 | Projects Catalogue              | `/projects`                                                  | Public                       |
| P-07 | Project Details                 | `/projects/:projectId`                                       | Public                       |
| P-08 | Submit/Edit Proposal            | `/projects/:projectId/propose`, `/student/proposals`         | Student                      |
| P-09 | Services Catalogue              | `/services`                                                  | Public                       |
| P-10 | Service Details and Packages    | `/services/:serviceId`                                       | Public                       |
| P-11 | Student Dashboard               | `/student/dashboard`                                         | Student                      |
| P-12 | Student Profile and Portfolio   | `/students/:studentId`, `/profile/edit`                      | Student/Public view          |
| P-13 | Service Editor                  | `/student/services/new`, `/student/services/:serviceId/edit` | Student                      |
| P-14 | Student Proposals and Orders    | `/student/proposals`, `/student/orders`                      | Student                      |
| P-15 | Client Dashboard                | `/client/dashboard`                                          | Client                       |
| P-16 | Post/Edit Project               | `/client/projects/new`, `/client/projects/:projectId/edit`   | Client                       |
| P-17 | Proposal Comparison             | `/client/projects/:projectId/proposals`                      | Client                       |
| P-18 | Checkout and Escrow             | `/checkout/:orderId`, `/escrow/:orderId`                     | Client/Authorized order user |
| P-19 | Order Workspace                 | `/orders/:orderId`                                           | Authorized participants      |
| P-20 | Messages, Chatbot, Translation  | `/messages`, global assistant                                | Registered user              |
| P-21 | Support and Dispute Form        | `/support/contact`, `/disputes/new`                          | Registered user              |
| P-22 | Super Admin Dashboard           | `/admin`                                                     | Super Admin                  |
| P-23 | Committee Accounts              | `/admin/committee-accounts`                                  | Super Admin                  |
| P-24 | Verification Committee          | `/committee/verification`                                    | Verification                 |
| P-25 | Marketplace Operations          | `/committee/marketplace`                                     | Marketplace Ops              |
| P-26 | Finance Committee               | `/committee/finance`                                         | Finance                      |
| P-27 | Support and Disputes            | `/committee/support`                                         | Support                      |
| P-28 | AI and Quality                  | `/committee/ai-quality`                                      | AI & Quality                 |
| P-29 | Notifications and Settings      | `/notifications`, `/settings`                                | Registered user              |

## 2. Supporting Routes

Additional proposed routes may include:

| Route                  | Purpose                              |
| ---------------------- | ------------------------------------ |
| `/about`               | Project introduction                 |
| `/how-it-works`        | Marketplace explanation              |
| `/help`                | Help Center                          |
| `/help/:articleSlug`   | Help article                         |
| `/terms`               | Terms                                |
| `/privacy`             | Privacy                              |
| `/freelancers`         | Freelancer discovery                 |
| `/recommendations`     | AI-assisted suggestions              |
| `/student/services`    | Manage service listings              |
| `/client/projects`     | Manage client projects               |
| `/client/orders`       | Client order history                 |
| `/wallet/transactions` | Transaction history                  |
| `/admin/roles`         | Administrative permission management |
| `/access-denied`       | Authorization error                  |
| `/session-expired`     | Session recovery                     |
| `*`                    | Not-found route                      |

These supporting routes extend the SRS prototype inventory without changing its numbering.

## 3. Current Implementation Snapshot

Task 01 (22 October 2026) adds React Router through `frontend/src/App.jsx`, with one route registry at `frontend/src/app/routeConfig.js` and one in-memory session provider.

- Public placeholders: `/`, `/services`.
- Public marketplace previews: `/projects` renders the Projects Catalogue (P-06), and `/projects/:projectId` renders Project Details (P-07).
- Mock authentication forms: `/login`, `/register`, `/register/role`, `/forgot-password`, `/reset-password` (Task 02).
- Student/client placeholders: `/verify`, `/verify/pending`.
- Role-specific dashboard placeholders: `/student/dashboard`, `/client/dashboard`, `/admin`, and the five committee root routes listed above.
- Registered-user placeholder: `/notifications`.
- Routing feedback: `/access-denied`, `/session-expired`, and a catch-all not-found page.

Routing, role checks, minimal layout outlets, demo navigation, session controls, mock authentication forms, the public projects catalogue, and project details are implemented. All other registered feature pages are clearly labeled placeholders; dashboards, verification, and other feature workflows remain unimplemented. Remaining proposed routes are not registered yet and show the catch-all page.

Visitors attempting protected routes go to `/login`; authenticated users with the wrong role go to `/access-denied`; explicitly expired sessions go to `/session-expired`. Guards retain the requested URL in router location state (`from`). After login, Task 02 returns to that URL only when it is an internal registered route allowed for the user, excluding authentication and routing-feedback pages. Other destinations fall back to the role dashboard. Registration opens login after creating the in-memory account. All recovery messages explicitly describe simulated behavior without secure tokens or email delivery.

`AppLayout`, `AuthLayout` and `AdminLayout` follow the recommended directory naming. Most public routes reuse the minimal `AppLayout`; `/projects` and `/projects/:projectId` use their existing full-width marketplace shells through a standalone outlet until shared public website visuals are integrated. Verification gating and automatic expiry timing are deferred. No production authorization is claimed.

**23 October 2026 integration:** A React Projects Catalogue preview (P-06) now renders
at the public `/projects` route through `frontend/src/app/router.jsx`. It shows fictional open projects with working text,
category, budget, skill, and sort controls, plus active filters, temporary
saved-item state, a responsive marketplace layout, and an empty state. Catalogue
cards navigate to the public `/projects/:projectId` Project Details preview,
including a missing-record state and navigation back to `/projects`. Rendered-route
tests guard both marketplace routes. Proposal submission remains a planned screen.

## 4. Layout Groups

### Public Layout

Landing, catalogues, service/project details, informational pages.

### Authentication Layout

Registration, login, password reset, onboarding.

### Student Layout

Student dashboard, proposals, services, orders, profile settings.

### Client Layout

Client dashboard, project management, proposals, checkout, orders.

### Administrative Layout

Super Admin and five committees, with role-aware navigation.

## 5. Navigation Rules

- Public content is discoverable without a mock account where appropriate.
- Protected pages check the intended role.
- Committee routes are unavailable through public registration.
- Users should receive clear access-denied messages.
- Order detail pages require authorization to the related order.
- Deep links should work during a frontend demo.
- Dynamic record routes such as `/projects/:projectId` are opened from their related records and are not shown as literal global-navigation links.
- Navigation labels should align with the approved design.

## 6. Prototype Tracking

Each SRS prototype should eventually have:

- Screenshot or Figma frame
- Primary role
- Main actions
- Validation states
- Empty/loading/error states where relevant
- Related functional requirement IDs
- Implementation/testing status

## 7. Route Change Process

Before changing a shared path:

1. Identify linked pages and navigation actions.
2. Notify affected module owners.
3. Update route configuration.
4. Update tests.
5. Update this document.
6. Update screenshot references if needed.

## Related Documents

- [SRS](../01-PROJECT/SRS.md)
- [User Roles](../02-REQUIREMENTS/USER_ROLES_AND_PERMISSIONS.md)
- [Frontend Architecture](../04-ARCHITECTURE/FRONTEND_ARCHITECTURE.md)
