
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
