
# MIU Freelance Platform
## Phase 1 — Frontend Work Distribution

**Project:** MIU Freelance Platform  
**University:** Misr International University (MIU)  
**Phase:** Phase 1 — Frontend Development  
**Team Size:** 5 Members  
**Document Status:** Team Work Distribution Plan

---

## 1. Project Overview

The MIU Freelance Platform is a university-focused freelancing marketplace connecting MIU student freelancers with clients.

The platform combines two marketplace models:

### Project-Based Freelancing
Inspired by Mostaql, clients publish projects and students submit proposals containing their proposed price, delivery time, and approach.

### Service-Based Freelancing
Inspired by Khamsat, students publish services with descriptions, prices, delivery times, packages, and optional extras. Clients can browse services and place orders directly.

The platform also includes:

- Student and client dashboards
- Identity verification
- AI-assisted skills matching
- AI chatbot
- Reviews and ratings
- Payment and escrow interfaces
- Super Admin dashboard
- Five administrative committees
- Role-based access
- Support and dispute management

### Phase 1 Scope

Phase 1 focuses on a complete, responsive, navigable frontend using:

- React with JavaScript
- Vite
- React Router
- Tailwind CSS v4
- Lucide React
- React Context where appropriate
- Reusable components
- Realistic mock data

All authentication, identity verification, AI, payment, escrow, and administrative workflows will be simulated.

No backend, database, real payment processing, or production AI integration is required in Phase 1.

All financial values use **Egyptian Pounds (EGP)**.

---

## 2. Team Work Distribution

| Member | Assigned Module | Main Responsibilities |
|---|---|---|
| Member 1 | Frontend Foundation & Authentication | Application setup, routing, authentication, verification, role-based navigation, chatbot, notifications |
| Member 2 | Freelancing Marketplace | Projects, proposals, services, orders, freelancer search, AI skills matching |
| Member 3 | Dashboards & Administration | Student/client dashboards, payment interfaces, escrow, Super Admin, five committee dashboards |
| Member 4 | Public Website & UI Components | Landing/public pages, navigation, reusable UI components, loading states, visual consistency |
| Member 5 | Profiles, Reviews & Support | Student/client profiles, portfolios, ratings, reviews, Help Center, support forms |

Each member has primary ownership of their assigned modules.

Shared components and data structures must follow agreed interfaces so that all modules integrate into one application.

---

## 3. Detailed Member Responsibilities

### Member 1 — Frontend Foundation & Authentication

#### Responsibilities

**Application Foundation**
- Set up the React and Vite project.
- Configure Tailwind CSS v4.
- Organize the frontend folder structure.
- Configure React Router.
- Establish shared application layouts.
- Set up React Context for mock authentication and roles.
- Implement route protection and role-aware navigation.

**Authentication**
- Login page
- Registration page
- Role selection
- Forgot password
- Reset password
- Mock login/logout
- Session management
- Account status handling

**Identity Verification**
- Verification introduction and instructions
- Camera verification interface
- Face and physical ID visible together
- Student MIU ID verification interface
- External client government ID verification interface
- Simulated verification outcomes
- Pending, approved, rejected, and retry states

**Additional Features**
- AI chatbot interface with predefined responses
- Notifications interface
- Access-denied page
- Session-expired page
- Not-found page

#### Main Routes

```text
/login
/register
/register/role
/forgot-password
/reset-password
/verify
/verify/pending
/access-denied
/session-expired
```

#### Main Components

- `AppRouter`
- `ProtectedRoute`
- `RoleRoute`
- `AuthLayout`
- `AppShell`
- `AdminShell`
- `AuthProvider`
- `RoleProvider`
- `VerificationStepper`
- `CameraPreview`
- `VerificationSummary`
- `ChatbotWidget`
- `NotificationPanel`

#### Expected Deliverables

- Working frontend foundation
- Authentication and registration screens
- Role-aware navigation
- Simulated verification workflow
- Chatbot and notifications interfaces
- Shared routing and session contracts

---

### Member 2 — Freelancing Marketplace

#### Responsibilities

**Projects**
- Browse projects
- Search and filter projects
- Project details
- Create and edit projects
- Manage client projects
- Project status handling

**Proposals**
- Submit proposals
- Edit and withdraw proposals
- View proposal history
- Compare proposals
- Accept or reject proposals
- Connect accepted proposals to project orders

**Services**
- Browse services
- Service details
- Create and edit services
- Manage published services
- Service packages and extras
- Service ordering

**Orders**
- Student and client order lists
- Order details
- Order workspace
- Delivery submission
- Revision requests
- Order progress tracking

**Discovery and AI**
- Search freelancers
- Filter by skills
- AI-assisted job recommendations
- Freelancer/service matching interface
- Simulated recommendation results

#### Main Routes

```text
/projects
/projects/:projectId
/projects/:projectId/propose
/student/proposals

/client/projects
/client/projects/new
/client/projects/:projectId/edit
/client/projects/:projectId/proposals

/services
/services/:serviceId
/student/services
/student/services/new
/student/services/:serviceId/edit

/student/orders
/client/orders
/orders/:orderId

/freelancers
/recommendations
```

#### Main Components

- `ProjectCard`
- `ProjectFilters`
- `ProjectForm`
- `ProposalForm`
- `ProposalComparison`
- `ServiceCard`
- `ServiceForm`
- `ServicePackageSelector`
- `OrderWorkspace`
- `OrderTimeline`
- `DeliveryForm`
- `FreelancerSearch`
- `SkillsMatchingPanel`

#### Expected Deliverables

- Complete projects and proposals frontend
- Complete services marketplace frontend
- Service ordering interface
- Order and delivery workflows
- Freelancer search
- Simulated AI skills matching

---

### Member 3 — Dashboards & Administration

#### Responsibilities

**Student Dashboard**
- Dashboard overview
- Active projects and orders
- Proposal statistics
- Earnings summary
- Activity overview

**Client Dashboard**
- Dashboard overview
- Published projects
- Received proposals
- Active orders
- Spending summary
- Recent activity

**Payments and Escrow**
- Checkout interface
- Payment confirmation
- Simulated payment success/failure
- Transaction history
- Escrow status and timeline
- Refund status
- EGP payment summaries

**Super Admin**
- Super Admin dashboard
- Committee account creation
- Committee account management
- Role and permission management
- Platform activity overview
- Administrative audit history

**Verification Committee**
- Pending verification cases
- Account review
- Approve/reject/request information
- Verification decision history

**Marketplace Operations Committee**
- Project and service moderation
- Proposal and content reports
- Marketplace review queues
- Moderation decisions

**Finance Committee**
- Transaction overview
- Escrow monitoring
- Refund requests
- Payout status
- Platform fees
- Financial case review

**Support & Disputes Committee**
- Support tickets
- Dispute cases
- Evidence review
- Case assignment
- Resolution and escalation

**AI & Quality Committee**
- Skills matching feedback
- Chatbot issues
- AI-assisted comment moderation review
- Quality reports
- AI error and feedback handling

#### Main Routes

```text
/student/dashboard
/client/dashboard

/checkout/:orderId
/payments/result
/wallet/transactions
/escrow/:orderId

/admin
/admin/committee-accounts
/admin/roles

/committee/verification
/committee/verification/cases/:caseId

/committee/marketplace
/committee/marketplace/reports/:reportId

/committee/finance
/committee/finance/transactions/:transactionId

/committee/support
/committee/support/cases/:caseId

/committee/ai-quality
/committee/ai-quality/reviews/:reviewId
```

#### Main Components

- `StudentDashboard`
- `ClientDashboard`
- `CheckoutForm`
- `EscrowTimeline`
- `TransactionTable`
- `SuperAdminDashboard`
- `CommitteeWorkspace`
- `CommitteeAccountForm`
- `PermissionMatrix`
- `AdminDecisionDialog`
- `AuditHistory`

The five committee dashboards should share consistent layouts and reusable components.

#### Expected Deliverables

- Student and client dashboards
- Simulated payment and escrow workflows
- Super Admin dashboard
- Committee account management
- Five committee dashboards
- Administrative review and decision interfaces

**Important:** Committee accounts are created by the Super Admin. Committee members do not register themselves.

---

### Member 4 — Public Website & UI Components

#### Responsibilities

**Public Website**
- Landing page
- About page
- How It Works page
- Terms page
- Privacy page
- Public navigation
- Footer
- Responsive navigation menu

**Landing Page Sections**
- Hero section
- Project and service discovery sections
- Job categories
- Featured opportunities
- Featured student profiles
- How It Works
- Trust and platform benefits
- Video presentation section where included in Figma
- Call to action
- Footer

**Shared UI Components**
- Buttons
- Inputs
- Select fields
- Textareas
- Cards
- Dialogs
- Tabs
- Badges
- Notifications/toast visuals
- Pagination
- Tables and filter controls
- Dashboard statistic cards

**UI States and Experience**
- Loading screens
- Skeleton loaders
- Progress indicators
- Empty states
- Error state visuals
- Responsive layout styling
- Hover and focus effects
- Language switcher interface
- RTL presentation where supported by approved translations

#### Main Routes

```text
/
/about
/how-it-works
/terms
/privacy
/loading-demo
/error-demo
```

#### Main Components

- `PublicHeader`
- `PublicFooter`
- `HeroSection`
- `CategorySection`
- `FeaturedOpportunities`
- `HowItWorksSection`
- `CTASection`
- `Button`
- `Input`
- `Modal`
- `Badge`
- `Toast`
- `Skeleton`
- `LoadingSpinner`
- `EmptyState`
- `ErrorState`
- `StatCard`
- `DataTable`

#### Expected Deliverables

- Complete public website
- Responsive landing page
- Shared UI component library
- Consistent visual states
- Reusable dashboard presentation components
- Shared design implementation aligned with Figma

---

### Member 5 — Profiles, Reviews & Support

#### Responsibilities

**Student Profiles**
- Public student profile
- Student information
- Skills and availability
- Profile editing
- Profile image preview
- Portfolio management interface
- Portfolio gallery

**Client Profiles**
- Client public profile
- Client information
- Project history summary
- Profile editing

**Reviews and Ratings**
- Review list
- Rating summary
- Rating breakdown
- Submit review
- Review form validation
- Review success/error states

**Help and Support**
- Help Center
- FAQ pages
- Help article details
- Help search
- Contact form
- Support request form
- Simulated support submission

**Shared Profile and Information Components**
- User summary cards
- Portfolio previews
- Review summaries
- Evidence gallery presentation
- Ticket details presentation
- Help article display

#### Main Routes

```text
/students/:studentId
/clients/:clientId
/profile/edit
/reviews/new

/help
/help/:articleSlug
/support/contact
```

#### Main Components

- `StudentProfile`
- `ClientProfile`
- `ProfileEditor`
- `ProfileHeader`
- `PortfolioGallery`
- `PortfolioItemModal`
- `ReviewCard`
- `RatingSummary`
- `ReviewForm`
- `HelpCenter`
- `HelpArticle`
- `SupportRequestForm`
- `UserSummaryCard`
- `EvidenceGallery`

#### Expected Deliverables

- Student and client profile pages
- Profile editing interfaces
- Portfolio presentation
- Ratings and reviews system frontend
- Help Center and FAQs
- Contact and support forms
- Shared profile and informational components

Support ticket assignment, dispute decisions, and committee actions remain under Member 3.

---

## 4. Shared Responsibilities and Integration

All five members contribute to the quality and consistency of the final application.

### Shared Rules

1. Follow the approved Figma design.
2. Use the agreed folder structure.
3. Reuse shared UI components.
4. Use consistent mock data.
5. Keep financial values in EGP.
6. Follow the established route contracts.
7. Apply role restrictions in simulated workflows.
8. Support desktop, tablet, and mobile web.
9. Validate forms and interactions.
10. Review and test assigned work before merging.
11. Update documentation when functionality changes.
12. Coordinate changes affecting other modules.

### Component Ownership

| Shared Area | Primary Owner |
|---|---|
| Application routing and session contracts | Member 1 |
| Marketplace data and order contracts | Member 2 |
| Dashboard, finance, and governance state | Member 3 |
| Shared UI components and visual presentation | Member 4 |
| Profile, portfolio, review, and help components | Member 5 |

A member may use another member's components without duplicating them.

Changes to shared contracts should be discussed with affected members.

---

## 5. Development Workflow

### Step 1 — Project Foundation

- Agree on design tokens and routes.
- Establish component interfaces.
- Define role names and mock data conventions.
- Configure the frontend project.
- Prepare shared components.

### Step 2 — Parallel Development

Each member develops their assigned modules using the agreed interfaces and mock data.

Feature development can proceed in parallel without waiting for backend services.

### Step 3 — Module Integration

Connect the completed modules through:

- Shared routing
- Common layouts
- Mock authentication
- Shared data contracts
- Reusable components
- Consistent navigation

### Step 4 — Functional Testing

Test complete user journeys, including:

1. Registration and verification
2. Project posting and proposal submission
3. Proposal acceptance and order creation
4. Service selection and purchasing
5. Delivery and review
6. Simulated payment and escrow
7. Super Admin committee account creation
8. Committee case review and decisions

### Step 5 — Final Review

- Review responsive layouts.
- Verify navigation.
- Test form validation.
- Check role-based interfaces.
- Review loading and error states.
- Verify consistency with Figma.
- Fix integration issues.
- Prepare the Phase 1 demonstration.

---

## 6. Frontend Architecture

Recommended project structure:

```text
src/
├── app/
│   ├── App.jsx
│   ├── router.jsx
│   ├── routeConfig.js
│   └── providers.jsx
├── assets/
├── components/
│   ├── ui/
│   ├── feedback/
│   └── navigation/
├── layouts/
│   ├── PublicLayout.jsx
│   ├── AuthLayout.jsx
│   ├── AppLayout.jsx
│   └── AdminLayout.jsx
├── features/
│   ├── public/
│   ├── auth/
│   ├── verification/
│   ├── notifications/
│   ├── projects/
│   ├── proposals/
│   ├── services/
│   ├── orders/
│   ├── recommendations/
│   ├── dashboards/
│   ├── payments/
│   ├── governance/
│   ├── profiles/
│   ├── reviews/
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

The exact structure may be adjusted to match the existing repository.

### Architecture Guidelines

- Keep feature-specific code inside feature folders.
- Keep generic components in shared component directories.
- Use React Context only when shared state is needed.
- Use local component state for forms, tabs, and dialogs.
- Use stable mock data identifiers.
- Keep financial formatting centralized.
- Avoid unnecessary dependencies.
- Prepare modules for future backend integration.

---

## 7. GitHub Collaboration

### Branches

Use descriptive feature branches.

Examples:

```text
feat/m1-authentication
feat/m2-marketplace
feat/m3-administration
feat/m4-public-ui
feat/m5-profiles
```

Additional branches may be created for individual features or fixes.

### Collaboration Rules

1. Keep `main` stable.
2. Work on dedicated feature branches.
3. Open pull requests for changes.
4. Request peer reviews.
5. Include screenshots for UI changes.
6. Test changes before merging.
7. Resolve merge conflicts with affected members.
8. Update documentation where needed.
9. Avoid unrelated file changes.
10. Participate in integration testing.

### Integration

Integration responsibilities are shared across the team.

Each member is responsible for ensuring their assigned modules work correctly with the rest of the application.

---

## 8. Quality Assurance Checklist

Each member should verify the following before marking a feature complete:

- [ ] Matches the approved Figma design
- [ ] Responsive on desktop, tablet, and mobile
- [ ] Navigation works correctly
- [ ] Forms validate user input
- [ ] Mock interactions behave consistently
- [ ] Loading and empty states are present
- [ ] Error and success states are handled
- [ ] Components are reusable where appropriate
- [ ] Role restrictions work in the mock UI
- [ ] Financial values display in EGP
- [ ] No broken links or routes
- [ ] No unexpected console errors
- [ ] Keyboard interactions work
- [ ] Accessibility basics are followed
- [ ] Code is organized and readable
- [ ] Relevant documentation is updated
- [ ] Feature has been reviewed and tested

---

## 9. Phase 1 Delivery Checklist

### Academic Requirements

According to the instructor's Phase 1 announcement, the SRS must include:

- [ ] Preface and Introduction
- [ ] Similar Systems
- [ ] Functional User Requirements
- [ ] Non-Functional User Requirements
- [ ] Prototypes of all forms/pages

These are the confirmed academic deliverables.

### Frontend Development Objectives

- [ ] React application runs successfully
- [ ] Landing page and public pages completed
- [ ] Authentication and verification interfaces completed
- [ ] Student and client dashboards completed
- [ ] Projects and proposals workflows completed
- [ ] Services and orders workflows completed
- [ ] Profiles, portfolios, and reviews completed
- [ ] Payment and escrow simulations completed
- [ ] Super Admin dashboard completed
- [ ] All five committee dashboards completed
- [ ] Chatbot and AI matching demonstrations completed
- [ ] Help and support interfaces completed
- [ ] Responsive layouts verified
- [ ] Shared UI components integrated
- [ ] Final navigation and workflow testing completed
- [ ] Presentation scenarios prepared

The complete React frontend is the team's development objective unless the instructor confirms that its implementation is mandatory for the Phase 1 discussion.

---

## 10. Final Team Guidelines

The project will be developed through clearly defined module ownership and coordinated teamwork.

Each member is responsible for:

- Completing assigned deliverables
- Following the approved design
- Maintaining consistent code quality
- Communicating integration requirements
- Reviewing relevant changes
- Testing assigned functionality
- Supporting final integration and demonstration

The distribution defines primary ownership, not exclusive participation. Team members may collaborate on shared interfaces and integration tasks while maintaining clear responsibility for each module.

Changes to assigned responsibilities should be discussed and agreed upon by the team before implementation.

---

## Related Documentation

- [Project Overview](../01-PROJECT/PROJECT_OVERVIEW.md)
- [SRS](../01-PROJECT/SRS.md)
- [Project Scope](../01-PROJECT/PROJECT_SCOPE.md)
- [Features](../02-REQUIREMENTS/FEATURES.md)
- [User Roles and Permissions](../02-REQUIREMENTS/USER_ROLES_AND_PERMISSIONS.md)
- [Pages and Routes](../03-DESIGN/PAGES_AND_ROUTES.md)
- [Frontend Architecture](../04-ARCHITECTURE/FRONTEND_ARCHITECTURE.md)
- [Coding Standards](CODING_STANDARDS.md)
- [Git Workflow](GIT_WORKFLOW.md)
- [Testing Strategy](TESTING_STRATEGY.md)
