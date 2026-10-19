
---
title: API Contracts
type: proposed-api
status: draft-not-implemented
tags: [MIU, API, backend]
---

# MIU Freelance Platform — API Contracts

## Status

> [!WARNING]
> The endpoints in this document are proposed future API conventions. They are not present in SRS v1.1 as finalized endpoint specifications and are not claimed to be implemented.

## 1. Purpose

Provide a starting point for aligning future backend APIs with frontend modules.

API decisions will be finalized during backend development.

## 2. Proposed API Conventions

Possible base path:

`/api/v1`

Suggested practices:
- JSON requests and responses
- HTTPS in deployed environments
- Server-side validation
- Authenticated protected endpoints
- Consistent error responses
- Pagination for large collections
- Idempotency for critical operations
- Role and ownership checks

## 3. Proposed Resource Groups

### Accounts and Authentication

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/users/me
PATCH  /api/v1/users/me
```

### Verification

```text
POST   /api/v1/verification/cases
GET    /api/v1/verification/me
GET    /api/v1/committee/verification/cases
GET    /api/v1/committee/verification/cases/:id
POST   /api/v1/committee/verification/cases/:id/decision
```

Biometric uploads require a later provider-specific privacy and security design.

### Projects and Proposals

```text
GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/:id
PATCH  /api/v1/projects/:id
GET    /api/v1/projects/:id/proposals
POST   /api/v1/projects/:id/proposals
PATCH  /api/v1/proposals/:id
POST   /api/v1/proposals/:id/withdraw
POST   /api/v1/proposals/:id/accept
```

### Services

```text
GET    /api/v1/services
POST   /api/v1/services
GET    /api/v1/services/:id
PATCH  /api/v1/services/:id
GET    /api/v1/services/:id/packages
```

### Orders

```text
GET    /api/v1/orders
POST   /api/v1/orders
GET    /api/v1/orders/:id
GET    /api/v1/orders/:id/messages
POST   /api/v1/orders/:id/messages
POST   /api/v1/orders/:id/deliveries
POST   /api/v1/orders/:id/revisions
POST   /api/v1/orders/:id/accept-delivery
```

### Payments — Sandbox/Future Integration

```text
POST   /api/v1/payments/checkout
GET    /api/v1/payments/:id
GET    /api/v1/orders/:id/escrow
GET    /api/v1/transactions
POST   /api/v1/refunds/request
```

These routes are proposals only. Actual payment endpoints, webhook handling, and escrow architecture depend on approved providers and legal arrangements.

### Administration

```text
GET    /api/v1/admin/dashboard
GET    /api/v1/admin/committee-accounts
POST   /api/v1/admin/committee-accounts
PATCH  /api/v1/admin/committee-accounts/:id
GET    /api/v1/admin/audit-events
```

### Support and Quality

```text
GET    /api/v1/support/tickets
POST   /api/v1/support/tickets
GET    /api/v1/support/tickets/:id
POST   /api/v1/disputes
GET    /api/v1/committee/ai-quality/reports
```

## 4. Suggested Success Response

```json
{
  "data": {
    "id": "project_001",
    "title": "Landing Page Design",
    "budgetEGP": "2500.00",
    "status": "open"
  }
}
```

This is an illustrative response, not an approved production schema.

## 5. Suggested Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please review the submitted information.",
    "details": []
  }
}
```

## 6. Authentication and Authorization

The future backend must:
- Verify authenticated requests.
- Enforce role permissions.
- Enforce ownership restrictions.
- Prevent committee self-registration.
- Limit access to sensitive records.
- Record appropriate audit events.

## 7. Financial Safety

The future finance API must address:
- Provider webhook verification
- Duplicate-request prevention
- Idempotency keys
- Transaction state validation
- Audit trails
- Refund authorization
- Financial reconciliation
- Safe retry behavior

Do not implement live money movement without approved requirements and infrastructure.

## 8. Open API Decisions

- Authentication/session strategy
- Final endpoint naming
- Pagination format
- Error catalogue
- API versioning policy
- File-upload strategy
- Provider webhook contracts
- Rate limiting
- Financial status transitions
- Notification transport

## 9. Phase 1 Rule

Frontend mock data does not imply these APIs are running.

Do not generate backend services from this document unless explicitly assigned and authorized.

## Related Documents

- [System Architecture](SYSTEM_ARCHITECTURE.md)
- [Data Models](DATA_MODELS.md)
- [Project Scope](../01-PROJECT/PROJECT_SCOPE.md)
