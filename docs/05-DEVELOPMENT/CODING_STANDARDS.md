
---
title: Coding Standards
type: engineering-guidelines
status: proposed
tags: [MIU, coding, React]
---

# MIU Freelance Platform — Coding Standards

## 1. Purpose

Keep the codebase readable, consistent, maintainable, and easy for future developers to understand.

## 2. Technology Rules

Phase 1 uses:
- React
- JavaScript
- Vite
- React Router
- Tailwind CSS v4

Avoid introducing additional libraries without a clear reason and team agreement.

## 3. Naming Conventions

| Item | Convention | Example |
|---|---|---|
| React components | PascalCase | `ProjectCard.jsx` |
| Hooks | camelCase with `use` prefix | `useAuth.js` |
| Utilities | camelCase | `formatEGP.js` |
| Variables | camelCase | `selectedProject` |
| Constants | UPPER_SNAKE_CASE | `DEFAULT_PAGE_SIZE` |
| Feature folders | lowercase | `projects/` |
| CSS classes | Tailwind utilities or agreed custom classes | `rounded-lg` |

## 4. Component Guidelines

- Use functional React components.
- Keep components focused.
- Use descriptive prop names.
- Extract reusable UI.
- Avoid overly large page components.
- Keep side effects controlled.
- Avoid direct DOM manipulation unless necessary.
- Avoid duplicate state.

## 5. JavaScript Guidelines

- Prefer `const` when values are not reassigned.
- Use `let` only when reassignment is required.
- Avoid unexplained magic numbers.
- Handle missing and invalid values.
- Use readable conditional logic.
- Avoid deeply nested code where possible.
- Do not leave unused variables or imports.

## 6. File Organization

Feature-specific code belongs in feature folders.

Shared components belong in shared component directories.

Avoid circular dependencies and unrestricted cross-feature imports.

## 7. Forms and Validation

Forms should:
- Have appropriate labels.
- Identify required fields.
- Validate inputs.
- Show specific error messages.
- Prevent unnecessary duplicate submissions.
- Provide success/failure feedback.

## 8. Currency

All amounts use EGP.

Use a centralized currency formatter.

Do not introduce:
- USD displays
- Currency selectors
- Exchange-rate requests
- Currency conversion components

## 9. Styling

- Follow approved design tokens.
- Prefer consistent reusable styles.
- Avoid arbitrary visual differences between modules.
- Make layouts responsive.
- Maintain accessible focus indicators.
- Avoid excessive animation.

## 10. Error Handling

Handle:
- Loading states
- Missing records
- Empty results
- Validation errors
- Access denied
- Failed simulated actions
- Recoverable errors

Do not silently swallow unexpected errors.

## 11. Mock Data

- Use fictional names and information.
- Use stable record IDs.
- Keep mock relationships valid.
- Label sensitive-looking simulated workflows.
- Avoid committing real identity documents or payment data.

## 12. Security

Never commit:
- Passwords
- API keys
- Production tokens
- Private identity documents
- Sensitive personal data

Do not treat frontend guards as production authorization.

## 13. Comments

Comments should explain complex decisions, not repeat obvious code.

Prefer meaningful function names over excessive comments.

## 14. Code Review Checklist

- [ ] Correct feature behavior
- [ ] Clear code structure
- [ ] Reusable components
- [ ] Correct mock data
- [ ] Valid role behavior
- [ ] Responsive layout
- [ ] Accessible controls
- [ ] Appropriate error states
- [ ] No secrets or sensitive fixtures
- [ ] Relevant documentation updated

## Related Documents

- [Frontend Architecture](../04-ARCHITECTURE/FRONTEND_ARCHITECTURE.md)
- [Git Workflow](GIT_WORKFLOW.md)
- [Testing Strategy](TESTING_STRATEGY.md)
