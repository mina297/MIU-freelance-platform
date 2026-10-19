
# AI Agent Instructions — MIU Freelance Platform

## Purpose

This file defines the rules for AI agents working on the MIU Freelance Platform repository.

The repository is an academic university freelancing marketplace with long-term maintainability requirements.

Before making changes, understand the project requirements and the relevant documentation.

## 1. Required Reading Order

Read these documents before implementing a feature:

1. `docs/README.md`
2. `docs/01-PROJECT/SRS.md`
3. `docs/01-PROJECT/PROJECT_SCOPE.md`
4. `docs/02-REQUIREMENTS/BUSINESS_RULES.md`
5. `docs/02-REQUIREMENTS/USER_ROLES_AND_PERMISSIONS.md`
6. `docs/03-DESIGN/DESIGN_SYSTEM.md`
7. `docs/03-DESIGN/PAGES_AND_ROUTES.md`
8. Relevant files in `docs/06-MODULES/`

For development tasks, also read:

- `docs/04-ARCHITECTURE/FRONTEND_ARCHITECTURE.md`
- `docs/05-DEVELOPMENT/CODING_STANDARDS.md`
- `docs/05-DEVELOPMENT/GIT_WORKFLOW.md`
- `docs/05-DEVELOPMENT/TESTING_STRATEGY.md`

Read only additional documents relevant to the task after the initial orientation.

## 2. Source-of-Truth Priority

When information conflicts, use this priority:

1. Explicit, current instructions from the project team
2. Latest approved SRS and documented requirement changes
3. Approved business rules and role permissions
4. Current architecture and design decisions
5. Existing implementation, where consistent with approved requirements
6. Earlier proposals and examples

Do not silently change the SRS or reinterpret a requirement.

If a conflict remains, document it and request clarification.

## 3. Project Requirements That Must Be Preserved

The platform supports both:

- Project-based freelancing with client-posted projects and student proposals
- Service-based freelancing with student-published services, packages, and extras

Additional important constraints:

- Currency is EGP only.
- Student freelancers and clients have separate role-specific workflows.
- Committee accounts are created only by the Super Admin.
- Public committee registration is forbidden.
- Five specialized administrative committees exist.
- Role-based access follows least privilege.
- Admin and committee decisions need appropriate audit records.
- Planned identity verification distinguishes MIU ID from external government ID.
- AI decisions affecting users require transparent, reviewable behavior.
- Capacitor packaging is for a later development phase.

## 4. Phase 1 Boundaries

Phase 1 focuses on requirements, prototypes, and frontend demonstrations.

Use:
- React
- JavaScript
- Vite
- React Router
- Tailwind CSS v4
- Reusable components
- Realistic mock data

Do not present simulated functionality as production functionality.

Without explicit authorization, do not introduce:
- A backend or production API
- Database infrastructure
- Real authentication or persistent sensitive sessions
- Actual biometric identity processing
- Production AI inference
- Real financial transactions
- Live escrow
- Production payment credentials
- Android packaging

Simulated actions must be identifiable as simulated where users might otherwise misunderstand them.

## 5. Working Procedure

For every development task:

1. Understand the requested change.
2. Locate the relevant SRS requirement IDs.
3. Identify affected routes, components, states, and user roles.
4. Check relevant business rules and module documentation.
5. Inspect existing implementation before modifying it.
6. Make the smallest coherent change.
7. Add or update tests appropriate to the change.
8. Check responsiveness, accessibility, and error states.
9. Update affected documentation.
10. Summarize the changes and any limitations.

Do not claim tests were run unless they were actually executed.

## 6. Implementation Guidelines

- Follow the existing repository structure.
- Prefer feature-based organization.
- Reuse common UI components.
- Keep business logic out of presentational components.
- Use clear names and consistent code conventions.
- Do not duplicate feature state unnecessarily.
- Use stable IDs for mock records.
- Keep currency formatting centralized.
- Validate user input.
- Support loading, empty, error, and success states.
- Preserve role-based route restrictions.
- Do not hardcode real secrets or credentials.

## 7. Security and Privacy

Identity documents and biometric-related data are sensitive.

For frontend demos:
- Use fictional identities and safe placeholder images.
- Never commit real ID images.
- Never store real biometric data in mock fixtures.
- Never include real payment credentials.
- Never log sensitive data unnecessarily.

For production design, follow the privacy and security requirements in the SRS.

## 8. Collaboration

Refer to:

`docs/05-DEVELOPMENT/PHASE1_WORK_DISTRIBUTION.md`

Respect established feature ownership.

Before editing shared components, routes, or data contracts, check whether the change affects other modules.

Do not create branches, commits, or pull requests unless requested or authorized by the active workflow.

Never overwrite unrelated team changes.

## 9. Documentation Maintenance

When implementing or changing functionality:

- Update relevant module documentation.
- Update routes when navigation changes.
- Update data models when record structures change.
- Update business rules when an approved decision changes.
- Update known issues when a problem remains unresolved.
- Keep planned features separate from implemented features.

Never automatically mark an SRS requirement complete merely because a mock screen exists.

## 10. Definition of Done

A task is complete when:

- Requested behavior is implemented within the approved scope.
- Relevant requirements have been checked.
- Navigation and role access work as intended.
- Relevant validation and UI states are present.
- The interface follows the design system.
- Appropriate tests have passed, or unrun tests are disclosed.
- Relevant documentation has been updated.
- No unrelated changes were introduced.

## Final Instruction

Build the MIU Freelance Platform as a coherent, maintainable university software engineering project.

Prioritize correctness, requirement consistency, privacy, usability, and future maintainability over unnecessary complexity.
