# MIU Freelance Platform Frontend

This directory contains the Phase 1 React frontend for the MIU Freelance Platform.

The application is currently an initial scaffold. It renders a static MIU Freelance heading and a non-functional **Post a Job** button. The marketplace routes and workflows described in the project documentation are planned and are not yet implemented here.

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
# Student Dashboard preview

Run `npm run dev` and use **Development: Switch dashboard** at the far left of
navigation. Only Student Dashboard is implemented; planned dashboards are disabled.
Set `VITE_ENABLE_DEV_DASHBOARD_SWITCHER=false` to hide the isolated switcher.
The existing routes remain available without it; no authentication is implemented.
See [dashboard scope and verification](../docs/06-MODULES/STUDENT_DASHBOARD.md).
