
---
title: Maintenance Guide
type: handover
status: draft
tags: [MIU, maintenance, handover]
---

# MIU Freelance Platform — Maintenance Guide

## 1. Purpose

Help future developers understand, maintain, and extend the platform after the original university team completes the project.

## 2. First Steps for New Maintainers

Read, in order:

1. Root `README.md`
2. Root `AGENTS.md`
3. `docs/README.md`
4. `docs/01-PROJECT/PROJECT_OVERVIEW.md`
5. `docs/01-PROJECT/SRS.md`
6. `docs/01-PROJECT/PROJECT_SCOPE.md`
7. Relevant architecture and module documents

Then inspect the actual codebase before making changes.

## 3. Understand the System

The platform includes:
- Two marketplace models
- Student and client accounts
- Order and delivery management
- Planned AI assistance
- Identity verification
- EGP financial workflows
- Super Admin
- Five committees

Every major module has its own documentation.

## 4. Requirements Maintenance

The SRS is the requirements baseline.

When changing a requirement:
1. Record the reason.
2. Identify the existing requirement ID.
3. Obtain the appropriate approval.
4. Update the SRS or approved change record.
5. Update relevant module documents.
6. Update related tests and user flows.

Do not silently rewrite established requirements.

## 5. Code Maintenance

Before modifying code:
- Understand the current behavior.
- Identify affected components.
- Check data dependencies.
- Check role restrictions.
- Locate relevant tests.
- Follow coding standards.
- Avoid unrelated changes.

## 6. Adding a New Feature

Recommended procedure:

1. Define the feature's purpose.
2. Confirm requirement approval.
3. Identify affected roles.
4. Specify expected user flows.
5. Define data needs.
6. Update routes and component specifications.
7. Implement the feature.
8. Add tests.
9. Review security and privacy impacts.
10. Update documentation.

## 7. Fixing a Bug

1. Reproduce the issue.
2. Identify the affected module.
3. Find the relevant requirement.
4. Determine the root cause.
5. Implement the smallest safe fix.
6. Add regression coverage where appropriate.
7. Retest related workflows.
8. Record unresolved limitations.

## 8. Dependency Maintenance

Periodically:
- Review outdated dependencies.
- Check security advisories.
- Test dependency upgrades.
- Document major changes.
- Avoid unnecessary packages.
- Verify build compatibility.

## 9. Security Maintenance

Pay particular attention to:
- Account access
- Role permissions
- Identity evidence
- Payment information
- API credentials
- File uploads
- Admin actions
- Audit logs
- Provider integrations

Never use real identity documents or payment credentials in demo fixtures.

## 10. Database Maintenance — Future

Once the database exists:
- Document schema changes.
- Use reviewed migrations.
- Maintain backups.
- Test restoration.
- Record data retention policies.
- Protect production data.

## 11. Monitoring — Future

Production monitoring should cover:
- Service availability
- API errors
- Authentication failures
- Payment exceptions
- Verification integration failures
- Application performance
- Unexpected administrative actions

The exact monitoring stack remains undecided.

## 12. Documentation Maintenance

Every meaningful feature change should update:
- Relevant module documentation
- Requirements where approved
- Routes if changed
- Data models if changed
- API contracts if changed
- Tests
- Known issues

## 13. Handover Checklist

Before handing the project to new maintainers:

- [ ] Repository access arranged
- [ ] Latest source committed
- [ ] SRS current
- [ ] Architecture documented
- [ ] Feature status recorded
- [ ] Known issues listed
- [ ] Environment setup documented
- [ ] Deployment steps verified when available
- [ ] Test instructions documented
- [ ] Secrets transferred through approved secure channels
- [ ] External service ownership documented
- [ ] Required university approvals recorded

## 14. Long-Term Objective

The next development team should be able to:
- Understand the requirements
- Run the system
- Locate functionality
- Reproduce errors
- Add features safely
- Maintain privacy and security
- Continue the project without depending on the original developers

## Related Documents

- [Documentation Hub](../README.md)
- [SRS](../01-PROJECT/SRS.md)
- [Known Issues](KNOWN_ISSUES.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
