# MIU Freelance Platform Frontend

This directory contains the Phase 1 React frontend for the MIU Freelance Platform.

The Member 4 isolated previews now explore the team lead's marketplace visual direction:
burgundy heroes, rose-grey backgrounds, clearly outlined cards and rectangular controls.
`src/features/public/preview/marketplace-preview.css` is imported only by preview entries;
it does not restyle Member 1's home page or shared application screens. Review this direction
at `/m4-pages-preview.html` and `/shared-ui-preview.html` before adopting it in the app.

The application has Phase 1 routing, in-memory sessions and mock authentication forms. Student/client registration creates an account usable until refresh. Login supports role dashboards and authorized internal return URLs. Forgot/reset-password are explicitly simulated, without real email or secure tokens; password changes exist only in memory. The existing demo selector preserves access to fixture accounts. Do not use real credentials. See [Authentication — Task 02](../docs/06-MODULES/AUTHENTICATION.md#task-02-mock-authentication) for validation, fixture email conventions and limitations.

The public `/projects` route still displays the fictional Projects Catalogue preview. Other unimplemented features remain labeled placeholders. See the [current route snapshot](../docs/03-DESIGN/PAGES_AND_ROUTES.md#3-current-implementation-snapshot).

The home route `/` now renders Member 1's replacement landing page with its own
header and footer. The previous Member 4 landing page is retired. `/about`, `/how-it-works`,
`/terms`, `/privacy`, `/loading-demo`, and `/error-demo` use the shared public shell.
Terms and Privacy remain clearly labelled placeholders pending approved content.
Expand **Phase 1 demo session controls** below public content to select a fictional
account. Signed-in users get a **My workspace** header link. Internal links preserve
the in-memory session; refreshing still clears it. Project/proposal pages keep their
existing standalone layout. Approved translations are pending; the interface is English.

## Technology

### Delivery and revisions

Open `/orders/order_001` as Omar Nabil and choose Delivery & revisions to submit
fictional work. Switch to Nile Studio to request changes or accept the latest
delivery. Revised work is a new submission; completion updates the lists and
locks workspace writes. Awaiting-payment orders cannot start delivery here. No
real file, funding, escrow release, notification or deadline is created.

### Order workspace

Open an owned `/orders/:orderId`, e.g. `/orders/order_001` as Nile Studio or Omar
Nabil. Both project/service views include Requirements, Messages and Progress &
activity tabs. Clients can save versioned coordination notes; participants exchange
fictional messages and fixed sample attachment IDs. No real files/notifications,
payments, delivery actions, percentages or deadlines are created. Completed and
cancelled orders are read-only; all workspace data resets on refresh. Manual
browser/tab/focus/mobile acceptance remains deferred.

### Student and client order lists

Open `/student/orders` or `/client/orders` in the matching fictional account.
Search owned orders, combine status/source filters and sort by date or agreed
amount. Both project and service orders update live. Value summaries are agreed
order totals, not actual earnings/spending or escrow. Order cards open protected
summaries; full collaboration and manual browser acceptance are still pending.

### Simulated service ordering

From a public service page choose Configure demo order, or open
`/services/service_001/order` in Nile Studio's approved client demo session.
Choose a package/extras, review totals and confirm to create one service order
awaiting payment. `/orders/:orderId` shows saved terms only to its participants.
No payment, funding, notification or delivery start occurs. Refresh clears demo
orders; full checkout and collaboration remain future work.

### Student service management

Open `/student/services` or `/student/services/new` in a student demo session.
Define complete packages/extras, preview privately, save a draft and publish from
My services with approved student verification. Owned uncommitted listings can be
edited/removed; published listings can be paused. Linked service orders block
editing/removal to protect terms. Changes update public service views live but
remain memory-only and reset on refresh. Manual browser review is still pending.

### Services catalogue

Open `/services` for published fictional services, search, category/skill/price
filters, sorting and starting-package previews. The catalogue shares the public
layout and uses EGP only. Student publication and simulated client ordering are
now connected as described above. Profiles and payment processing remain future
work. Filters are local page state and reset on leaving/reload.
Catalogue cards now open `/services/:serviceId` for service description, provider
summary, read-only package comparison and optional-extra information. Unpublished
and missing services show recovery. No checkout action is available yet.

- React with JavaScript
- Vite
- Tailwind CSS v4
- React Router
- Lucide React
- React Hot Toast

Installed dependencies do not imply that their planned integrations are complete.

## Local Development

### Member 4 isolated previews

While the development server is running, open `/m4-pages-preview.html` to browse
Member 4's public shell, About, How It Works, policy placeholders,
and feedback-demo pages. The page picker defaults to About; the replacement
homepage is available at `/`. `/shared-ui-preview.html` contains the shared buttons/cards/badges,
forms, language-selector appearance, modal, tabs, pagination, table/statistics,
toasts, and loading/progress/empty/error examples. `/how-it-works-preview.html`
preserves the original section preview. All three entries are development previews
and are excluded from the normal application build. Preview actions use only
fictional local UI state; translations and approved policy content remain pending.

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

Run all shared UI, public-page, marketplace, session, and route regression tests:

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

## Freelancer discovery

The related `/recommendations` page lets visitors explicitly choose skills/category for explained, simulated project/service/provider matches. It uses live in-memory public listing data and offers local Helpful/Not relevant feedback. No real AI or profile inference is performed. See [AI Features](../docs/06-MODULES/AI_FEATURES.md).

Open `/freelancers` to browse fictional published-service providers. Search and filters apply to the same service; package starting prices are EGP, not hourly rates. Directory data follows service publish/pause changes in memory. Full profile links await Member 5 integration. Run `npm.cmd test`, `npm.cmd run lint` and `npm.cmd run build` from this directory; manual acceptance remains deferred. See `../docs/06-MODULES/FREELANCER_DISCOVERY.md`.
