
---
title: Deployment Guide
type: handover
status: draft
tags: [MIU, deployment, handover]
---

# MIU Freelance Platform — Deployment Guide

## 1. Purpose

Provide future maintainers with a documented deployment process.

> [!IMPORTANT]
> Deployment infrastructure has not yet been finalized. This document contains preparation guidelines rather than verified production deployment commands.

## 2. Current Project Stage

The project is currently focused on Phase 1 frontend development and prototyping.

Production hosting, backend deployment, database infrastructure, and external provider integrations belong to later development work.

## 3. Expected Development Environment

Phase 1 frontend technology:
- Node.js-compatible development environment
- npm or the package manager recorded in the repository
- React
- Vite
- Tailwind CSS v4
- Modern browser

Use Node.js versions compatible with the project's actual dependencies.

## 4. Local Frontend Setup

Once the React project and its package scripts exist, a typical development workflow is:

```bash
npm install
npm run dev
```

A typical Vite production build command is:

```bash
npm run build
```

These are standard examples. Verify actual scripts in `package.json` before relying on them.

Do not assume these commands have already been tested in this repository.

## 5. Before Deploying

Confirm:
- Required features are implemented.
- Production configuration is documented.
- Secrets are not committed.
- Tests pass.
- Build succeeds.
- Routes work after refresh.
- Assets load correctly.
- Environment-specific settings are separated.
- Sensitive user data is protected.

## 6. Hosting

A hosting provider has not been approved or selected in the SRS.

Before choosing one, assess:
- HTTPS support
- Cost
- Availability
- Scalability
- Monitoring
- Data protection
- Database support
- Secret management
- Backup and recovery
- Institutional requirements

## 7. Environment Configuration

Maintain separate:
- Development
- Testing
- Production

Never place production secrets in client-side environment variables or public assets.

Frontend environment variables are generally visible in shipped browser code.

## 8. Backend Deployment — Future

After backend implementation, document:
- Runtime version
- Build commands
- Startup commands
- Database connection
- Migration procedure
- Secret configuration
- Health checks
- Monitoring
- Backup policy
- Rollback procedure

## 9. Database Deployment — Future

Before database deployment:
- Approve the schema.
- Validate migrations.
- Configure access restrictions.
- Create backup procedures.
- Test restoration.
- Establish retention policies.

Never run destructive migrations against production without a reviewed plan.

## 10. External Services — Future

Required approval or integration may include:
- Identity verification
- AI services
- Translation
- Email/notifications
- Payment provider
- Protected file storage

Never substitute a live integration for a sandbox demonstration without explicit authorization.

## 11. Payment Safety

All development financial workflows remain simulated or sandbox-only.

Production money movement requires:
- Approved provider
- Appropriate agreements
- Verified security
- Compliance review
- Refund/dispute rules
- Reconciliation procedures

## 12. Deployment Checklist

- [ ] Environment documented
- [ ] Dependencies verified
- [ ] Build verified
- [ ] Tests passing
- [ ] Secrets protected
- [ ] HTTPS configured
- [ ] Authentication verified
- [ ] Role permissions verified
- [ ] Backup and recovery reviewed
- [ ] Monitoring configured
- [ ] Rollback procedure prepared
- [ ] Payment/identity approval confirmed where applicable

## 13. Deployment Record Template

| Field | Value |
|---|---|
| Release version | TBD |
| Deployment date | TBD |
| Environment | TBD |
| Hosting provider | TBD |
| Responsible maintainer | TBD |
| Build verification | Not recorded |
| Test verification | Not recorded |
| Rollback reference | TBD |

Update these values only after actual deployment activity.

## Related Documents

- [System Architecture](../04-ARCHITECTURE/SYSTEM_ARCHITECTURE.md)
- [Testing Strategy](../05-DEVELOPMENT/TESTING_STRATEGY.md)
- [Maintenance Guide](MAINTENANCE_GUIDE.md)
