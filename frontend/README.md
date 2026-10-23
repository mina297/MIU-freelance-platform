# MIU Freelance Platform Frontend

This directory contains the Phase 1 React frontend for the MIU Freelance Platform.

The application has Phase 1 routing, in-memory sessions and mock authentication forms. Student/client registration creates an account usable until refresh. Login supports role dashboards and authorized internal return URLs. Forgot/reset-password are explicitly simulated, without real email or secure tokens; password changes exist only in memory. Public/authentication pages use a clean header instead of temporary route lists and demo session controls. Do not use real credentials. See [Authentication — Task 02](../docs/06-MODULES/AUTHENTICATION.md#task-02-mock-authentication) for validation, fixture email conventions and limitations.

The public `/projects` route still displays the fictional Projects Catalogue preview. Other unimplemented features remain labeled placeholders. See the [current route snapshot](../docs/03-DESIGN/PAGES_AND_ROUTES.md#3-current-implementation-snapshot).

## Technology

- React with JavaScript
- Vite
- Tailwind CSS v4
- React Router
- Lucide React
- React Hot Toast

Installed dependencies do not imply that their planned integrations are complete.

## Local Development

From this directory:

```bash
npm install
npm run dev
```

Available project scripts:

```bash
npm run dev
npm run build
npm run lint
npm test
npm run format
npm run preview
```

`npm run format` modifies files under `src`; review the resulting diff before committing it.

Run the marketplace, routing/session contract, and rendered-route regression tests with one command:

```bash
npm test
```

## Phase 1 Boundaries

Phase 1 uses mock data and simulated frontend behavior. Do not represent authentication, identity verification, AI, payment, or escrow demonstrations as production functionality.

- Use EGP only for monetary values.
- Do not add public committee registration.
- Use fictional identities and safe placeholder assets.
- Do not add real payment credentials or identity documents.
- Keep backend, database, live integrations, and Capacitor packaging outside Phase 1 unless explicitly authorized.

## Documentation

Before implementing a feature, follow the repository [AI agent instructions](../AGENTS.md) and read the [documentation hub](../docs/README.md).

Key references:

- [SRS v1.1](../docs/01-PROJECT/SRS.md)
- [Pages and Routes](../docs/03-DESIGN/PAGES_AND_ROUTES.md)
- [Frontend Architecture](../docs/04-ARCHITECTURE/FRONTEND_ARCHITECTURE.md)
- [Coding Standards](../docs/05-DEVELOPMENT/CODING_STANDARDS.md)
- [Testing Strategy](../docs/05-DEVELOPMENT/TESTING_STRATEGY.md)

Do not mark a planned feature as implemented until its behavior has been inspected and verified.
