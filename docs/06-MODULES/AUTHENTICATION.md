
---
title: Authentication Module
type: module
status: planned
tags: [MIU, authentication, accounts]
---

# Authentication Module

## 1. Purpose

Manage the intended account access experience for students, clients, Super Admin, and committee members.

**SRS references:** FR-S01, FR-C01, FR-A01, FR-VC01, FR-MO01, FR-FC01, FR-SD01, FR-AQ01.

## 2. Supported Roles

- Student Freelancer
- Client
- Super Admin
- Verification Committee
- Marketplace Operations Committee
- Finance Committee
- Support and Disputes Committee
- AI and Quality Committee

Visitors can browse public content without logging in.

## 3. Public Registration

Public registration must offer:
- Student account
- Client account

Registration should collect the approved required information and validate the submitted fields.

There must be no public committee registration option.

## 4. Login

The login interface should:
1. Accept authorized credentials.
2. Validate required fields.
3. Show understandable failure messages.
4. Identify the active user role.
5. Navigate to the appropriate dashboard.

Phase 1 simulates these operations with mock accounts.

## 5. Password Recovery

Planned flow:
1. User selects Forgot Password.
2. User submits an account email.
3. The system initiates a password reset process.
4. User follows a secure reset link in a later production system.
5. New password is validated.
6. User receives confirmation.

Phase 1 displays simulated results without sending real reset emails.

## 6. Committee Accounts

Committee accounts are created only by Super Admin.

Recommended provisioning process:
1. Super Admin creates the account.
2. Super Admin assigns a committee role.
3. A secure invitation is issued.
4. Member activates the account and sets a password.
5. Member logs in.
6. Member accesses only the assigned committee dashboard.

The invitation mechanism is a proposed security design, not an approved implementation detail.

## 7. Account States

Relevant concepts:
- Pending Verification
- Approved
- Rejected
- Active
- Suspended
- Deactivated

Verification and account-access states should be distinct where necessary.

## 8. Phase 1 Mock Behavior

The frontend may provide:
- Demo account selection
- Simulated login
- Role-aware navigation
- Mock session state
- Access-denied page
- Mock password reset success
- Account-status messages

Never use real passwords or real identity documents as demo data.

### Task 01 routing/session foundation

Implemented scope (22 October 2026):

- `frontend/src/features/auth/session.js` defines the JSDoc `MockUser`/`MockSession` contracts, role vocabulary, public registration roles, session reducer and route access helper. It is separate from Member 2's marketplace contracts.
- `AuthProvider` is the sole session source. `useAuth()` exposes `session`, `startDemoSession(userId)`, `logout()` and `expireSession()`. Role access is derived from `session.user.role`; there is no separate role provider.
- Sessions are memory-only and reset on refresh. Explicit expiry clears the user. No credentials, tokens, storage or automatic expiry timers are involved.
- Account access uses `active`, `suspended`, `deactivated`; verification status remains separate and does not gate routes in this task. These are demo contracts, not approved production transition policies.
- Fictional account fixtures preserve marketplace participant IDs and names. Committee fixtures represent provisioned demo accounts, not registration options. Public registration roles are only `student` and `client`.
- Protected routes check active account status and allowed roles, including distinct access for each committee. Unknown roles and inactive accounts are denied. Ownership checks are deferred until the corresponding feature routes are integrated.
- Minimal layout outlets, role-filtered demo links and routing feedback are present. Login, registration, reset and verification screens remain placeholders; no complete authentication requirement is claimed.

Role values are `student`, `client`, `super_admin`, `verification_committee`, `marketplace_operations_committee`, `finance_committee`, `support_disputes_committee`, and `ai_quality_committee`. Session states are `anonymous`, `authenticated`, and `expired`, with `user: null` outside an authenticated session. Verification values are `pending`, `approved`, `rejected`, `resubmission_requested`, and `escalated`.

Contract tests live in `frontend/src/tests/session.test.js` and `routeAccess.test.js`. Run them alongside the existing marketplace tests using the command in the frontend README.

### Task 02 mock authentication

The five authentication routes now render working frontend demonstrations. Registration collects full name, email, password, confirmation and Student/Client role. It requires a valid email, at least eight password characters including a letter and a number, matching confirmation, and case-insensitive email uniqueness. The mock operation rejects privileged or unknown roles independently of the form controls (FR-V03, FR-S01, FR-C01).

`createMockAuthStore()` in `frontend/src/features/auth/mockAuth.js` creates one private account/password store per `AuthProvider` mount. `useAuth()` additionally exposes `register(values)`, `login(values)`, `forgotPassword(email)` and `resetPassword(values)`, returning `{ ok, errors?, message?, user? }`. There is no second provider or session source. Registration creates an active, pending-verification account and opens login; it does not approve identity or automatically log in. Login opens an authorized internal return URL when supplied, otherwise the account's role dashboard. Failed login clears a previous session. Logout and explicit expiry still clear only the session, so registered accounts remain usable until refresh.

Fixture records and IDs remain unchanged. At runtime each fixture reserves the fictional address `<id>@example.test` (for example `student_001@example.test`) and initially has no password. The explicitly insecure demo reset form can set an in-memory password for an active fixture at that address. Neither registration nor reset provisions committee accounts. Inactive accounts cannot reset passwords or authenticate. The temporary session selector is no longer rendered in the public/authentication layout; its source and provider methods remain available for later demo tooling.

Forgot-password validates syntax and returns a simulated response for both known and unknown emails; no email is sent. Reset-password checks email, the agreed password rules and confirmation, then changes only an existing active in-memory account. **It checks no secure token or email ownership.** This is an intentionally labeled recovery demonstration, not production recovery. Passwords live only in the private mock store; they are not production-hashed, committed as fixtures, logged, placed in sessions, URLs or browser storage. Form password values are cleared after submission. Refresh/provider remount discards new accounts and password changes. Do not use real credentials.

Session records use an explicit field allowlist (`id`, `displayName`, `role`, `accountStatus`, `verificationStatus`). Account activity and verification remain separate; verification gating and automatic expiry timing remain deferred. No backend, notification service or persistent storage is introduced. Tests in `session.test.js` cover validation/account flows and safe navigation; `routeRendering.test.js` covers the five pages and retains the public catalogue regression. Browser interaction, responsive and accessibility verification must be recorded separately from these model/markup tests.

### Public navigation and onboarding update

The public/authentication shell uses a shared header with Hire Talent and Find Work dropdowns, How it works, Sign In (`/login`) and Sign Up (`/register`). The dropdowns retain project/service discovery and student/client registration links. Temporary route lists and session controls are not rendered. Signed-in users retain a logout action below the header. The standalone marketplace routes retain their existing presentation.

`/register` opens Student/Client role cards. Their links open `/register?role=student` and `/register?role=client`; unknown/privileged role parameters return to selection. The form is bound to the selected public role, while the store retains independent role validation. `/register/role` remains a compatible selection URL. The Forgot Password? link sits directly below the login submit button. A syntactically valid forgot-password submission navigates to `/reset-password`, which explains that no email or secure token was issued. Email and password values are not placed in navigation state. The reset page still validates the existing in-memory account.

The Figma-based landing page is now rendered at `/` (23 October 2026). It reuses this public header and the existing session/logout behavior without changing authentication. Its Post a Job entry opens `/register?role=client`; it does not bypass role checks or implement project publication. See [Landing Page](LANDING_PAGE.md).

### Registration role card presentation

The `/register` and `/register/role` selection screens use concise copy and centered Student/Client cards with soft shadows (23 October 2026). Cards sit beside each other above 480px and stack on smaller screens. Each card has a rotating red perimeter light on hover or keyboard focus, a visible focus outline, and a static effect when reduced motion is requested. A short demo label preserves Phase 1 transparency. Role links and registration validation retain the existing FR-V03, FR-S01 and FR-C01 behavior; no session or route contracts change.

## 9. Production Security Requirements

Future implementation must provide:
- Secure password hashing
- Server-side sessions or approved token strategy
- Server-side role authorization
- Password reset token expiration
- Secure account recovery
- Login abuse protection
- Administrative account provisioning
- Appropriate session invalidation

## 10. Screens

- Login
- Registration
- Role selection
- Forgot password
- Reset password
- Account verification status
- Access denied
- Session expired
- Account settings

## Related Documents

- [SRS](../01-PROJECT/SRS.md)
- [Roles and Permissions](../02-REQUIREMENTS/USER_ROLES_AND_PERMISSIONS.md)
- [Verification](VERIFICATION.md)
