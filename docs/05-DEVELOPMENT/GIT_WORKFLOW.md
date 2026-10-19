
---
title: Git and GitHub Workflow
type: collaboration
status: proposed
tags: [MIU, Git, GitHub]
---

# MIU Freelance Platform — Git Workflow

## 1. Objective

Allow five team members to develop features without overwriting or conflicting with one another unnecessarily.

## 2. Repository

**Recommended name:** `miu-freelance-platform`

## 3. Main Branch

Use `main` as the stable integration branch.

Recommended protections:
- No direct pushes
- Pull request required
- At least one peer review
- Passing agreed checks
- Resolved review comments

## 4. Branch Naming

Use descriptive names:

```text
feat/auth-pages
feat/project-proposals
feat/service-marketplace
feat/finance-dashboard
feat/landing-page
feat/student-profiles
fix/order-status
docs/srs-update
test/checkout-flow
```

Avoid unclear branch names.

## 5. Standard Workflow

1. Start from the latest `main`.
2. Create a focused feature branch.
3. Implement the assigned change.
4. Test the affected functionality.
5. Update related documentation.
6. Open a pull request.
7. Request review.
8. Address feedback.
9. Merge after approval.
10. Remove the completed branch when appropriate.

## 6. Commit Messages

Use consistent descriptive commits.

Examples:

```text
feat: add project proposal form
fix: correct EGP checkout total
docs: update verification workflow
refactor: extract shared status badge
test: cover proposal validation
```

## 7. Pull Request Template

```markdown
## Summary
Describe the change.

## Related Requirements
List applicable SRS IDs.

## Pages or Components
List affected files/routes.

## Testing
Explain what was tested.

## Screenshots
Attach screenshots when UI changes.

## Documentation
List updated documentation.

## Notes
Mention risks, assumptions, or follow-up work.
```

## 8. Shared File Rules

Before modifying:
- Router configuration
- Global styles
- Shared components
- Context providers
- Shared mock schemas

Notify affected members.

Avoid formatting or rewriting unrelated files.

## 9. Merge Conflicts

When conflicts occur:
1. Understand both versions.
2. Contact the relevant owner.
3. Preserve intended functionality.
4. Run appropriate tests.
5. Resolve the conflict without deleting unrelated work.

## 10. Integration Reviews

Check complete workflows after merging:
- Registration to verification
- Project creation to proposal acceptance
- Service selection to order creation
- Delivery to review
- Checkout to escrow status
- Admin account creation to committee login
- Support ticket to case decision

## 11. Documentation

Update documentation in the same pull request when possible.

Do not let feature behavior and documentation drift apart.

## 12. Repository Safety

Never push:
- `.env` files containing secrets
- Real user identity data
- Production payment credentials
- Private keys
- Generated dependency directories such as `node_modules`

## Related Documents

- [Work Distribution](PHASE1_WORK_DISTRIBUTION.md)
- [Coding Standards](CODING_STANDARDS.md)
- [Testing Strategy](TESTING_STRATEGY.md)
