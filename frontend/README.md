# MIU Freelance Platform Frontend

This directory contains the Phase 1 React frontend for the MIU Freelance Platform.

The application provides a Projects Catalogue at `/` and `/projects`, a Student
Dashboard at `/student/dashboard`, and a Client Dashboard at `/client/dashboard`.
Use the temporary **Development: Switch dashboard** control to open either
dashboard. Set `VITE_ENABLE_DEV_DASHBOARD_SWITCHER=false` to hide this control.

The client preview includes jobs, applicant summaries, delivery completion and
validated reviews with in-memory fictional data. Dependent marketplace, profile,
support and account workflows show integration notices. Authentication and role
guards await the shared session module. See the
[Client Dashboard module](../docs/06-MODULES/CLIENT_DASHBOARD.md) for scope,
Figma references, test commands and remaining dependencies.

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
npm run format
npm run preview
```

`npm run format` modifies files under `src`; review the resulting diff before committing it.

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
