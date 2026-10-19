
---
title: User Roles and Permissions
type: access-control
status: baseline
tags: [MIU, roles, permissions, RBAC]
---

# User Roles and Permissions

## 1. Overview

MIU Freelance Platform uses role-based access control (RBAC).

Users should only access the functions and information needed for their assigned roles.

**SRS reference:** NFR-07, SR-17.

## 2. User Role Definitions

| Role | Description |
|---|---|
| Visitor | Unauthenticated user |
| Student | Verified or pending student freelancer |
| Client | Registered client |
| Super Admin | Platform-wide governance authority |
| Verification Committee | Identity and profile reviewers |
| Marketplace Operations | Marketplace moderation reviewers |
| Finance Committee | Financial workflow reviewers |
| Support and Disputes | Support and dispute reviewers |
| AI and Quality | AI feedback and quality reviewers |

## 3. Core Permission Matrix

Legend:
- `Yes` — permitted within the role's scope
- `Own` — own records only
- `Assigned` — assigned cases or delegated authority
- `No` — not permitted

| Capability | Visitor | Student | Client | Super Admin |
|---|---|---|---|---|
| Browse public listings | Yes | Yes | Yes | Yes |
| Register student/client account | Yes | No | No | No |
| Submit project proposal | No | Yes | No | No |
| Publish service | No | Own | No | No |
| Post project | No | No | Own | No |
| Purchase service | No | No | Yes | No |
| Manage own orders | No | Own | Own | Oversight |
| Manage own profile | No | Own | Own | Account oversight |
| Review eligible completed work | No | Own | Own | No |
| Create committee accounts | No | No | No | Yes |
| Manage committee permissions | No | No | No | Yes |
| Resolve final escalations | No | No | No | Yes |
| Access platform audit records | No | No | No | Yes |

Permissions remain subject to verification status, case ownership, and approved policies.

## 4. Committee Permission Matrix

| Capability | Verification | Marketplace Ops | Finance | Support | AI & Quality |
|---|---|---|---|---|---|
| Review ID verification cases | Assigned | No | No | No | No |
| Approve/reject verification | Assigned | No | No | No | No |
| Review reported listings | No | Assigned | No | No | No |
| Moderate marketplace content | No | Assigned | No | No | Review flags only |
| Review finance records | No | No | Assigned | Limited case context | No |
| Perform permitted sandbox finance actions | No | No | Assigned | No | No |
| Review support tickets | No | No | No | Assigned | No |
| Resolve permitted disputes | No | No | No | Assigned | No |
| Review matching/chatbot feedback | No | No | No | No | Assigned |
| Review AI moderation quality | No | Human moderation decision | No | No | Quality review |
| Create committee accounts | No | No | No | No | No |
| Change platform-wide permissions | No | No | No | No | No |

The matrix is a role-level guide. Detailed production permissions must be reviewed before server-side implementation.

## 5. Account Creation Rules

### Students and Clients

Students and clients can use the public registration flow.

### Committee Members

Committee members:
- Cannot register publicly.
- Receive accounts created by the Super Admin.
- Log in with assigned authorized credentials.
- Access only their designated committee functions.

### Super Admin

Super Admin access is provisioned through an authorized administrative process, not public registration.

## 6. Account and Verification Status

Suggested status concepts for design and data modeling:

- Pending
- Approved
- Rejected
- Resubmission Requested
- Suspended
- Active
- Deactivated

Verification status and account activity status should be modeled separately.

Exact production state transitions require implementation approval.

## 7. Authorization Rules

- Hiding a button is not sufficient authorization.
- Production authorization must be enforced server-side.
- Each role has restricted routes and operations.
- A user must not access another user's private orders without authorization.
- Finance records must not expose unnecessary ID or biometric data.
- Verification members must not gain unrestricted finance access.
- Sensitive decisions require auditable records.
- Super Admin retains final escalation authority.

## 8. Security Considerations

- Verify the active user's role and permissions on protected operations.
- Avoid storing real secrets in frontend storage.
- Prevent unauthorized direct-route access.
- Recheck permissions after account suspension.
- Minimize sensitive data in committee views.
- Record administrative actor, action, time, and reason.

## 9. Phase 1 Behavior

Role selection and access protection are demonstrated using mock users and mock session state.

This demonstrates intended UI behavior, not production-grade authorization.

## Related Documents

- [SRS](../01-PROJECT/SRS.md)
- [Business Rules](BUSINESS_RULES.md)
- [Authentication](../06-MODULES/AUTHENTICATION.md)
- [Admin and Committees](../06-MODULES/ADMIN_AND_COMMITTEES.md)
