
---
title: Identity Verification Module
type: module
status: planned
tags: [MIU, verification, identity]
---

# Identity Verification Module

## 1. Purpose

Define the planned identity verification experience and committee review process.

**SRS references:** FR-S02, FR-C02, FR-VC02–FR-VC05, NFR-08, NFR-11, SR-11, SR-12.

## 2. Verification Categories

### MIU-Affiliated Users

Use an appropriate MIU-issued identity document.

Student freelancers use their student ID.

### External Clients

Use an accepted government-issued identity document.

Specific supported document types and country rules require later approval.

## 3. Planned Camera Experience

The intended verification design allows users to present:

- Their live face
- Their physical identity card

**Both are visible together in the camera view.**

The planned system may use:
- Document recognition
- Face-to-ID-photo comparison
- Liveness checks
- Verification confidence signals
- Human review

A visual match does not independently prove university affiliation. MIU membership verification may require separate institutional validation.

## 4. User Journey

1. User begins verification.
2. System explains requirements.
3. User is shown privacy/consent information.
4. User grants appropriate camera access.
5. User positions face and ID together.
6. System guides framing and visibility.
7. Planned verification service evaluates submitted evidence.
8. A verification status is created.
9. Verification Committee reviews relevant cases.
10. User receives an outcome.

## 5. Verification Outcomes

- Pending
- Approved
- Rejected
- Resubmission Requested
- Escalated

Exact status definitions and retry limits require later implementation decisions.

## 6. Verification Committee

Authorized members can:
- View assigned cases
- Inspect permitted evidence
- Review verification and liveness signals
- Approve or reject
- Request resubmission
- Record a decision reason

No committee should receive unrestricted access to unrelated sensitive data.

## 7. Phase 1 Demonstration

Phase 1 should provide:
- Instructions
- Consent presentation
- Simulated camera framing
- Appropriate MIU/government ID guidance
- Simulated capture or preview
- Mock verification outcomes
- Committee case review UI

Do not claim actual biometric recognition or validated university affiliation.

Use fictional documents and placeholder images.

## 8. Privacy and Security

Production requirements include:
- Explicit lawful basis and appropriate consent processes
- Minimal data collection
- Secure transmission
- Access-controlled storage
- Approved retention/deletion policy
- Human review
- Safe error handling
- No public exposure of ID images
- Audit records for review actions

Provider and legal approval are required before real identity processing.

## 9. Edge Cases

- Camera access denied
- Camera not available
- Poor lighting
- ID unreadable
- Face not clearly visible
- Document type unsupported
- Capture interrupted
- Verification failed
- Resubmission requested
- Manual review required

## 10. Dependencies

The committee review frontend is documented in
[Verification Dashboard](VERIFICATION_DASHBOARD.md). It uses fictional evidence
placeholders and does not implement camera capture or biometric processing.

- Authentication
- Roles and permissions
- Protected evidence handling
- Verification Committee
- Notifications
- External identity provider, later

## Related Documents

- [Authentication](AUTHENTICATION.md)
- [Admin and Committees](ADMIN_AND_COMMITTEES.md)
- [SRS](../01-PROJECT/SRS.md)
