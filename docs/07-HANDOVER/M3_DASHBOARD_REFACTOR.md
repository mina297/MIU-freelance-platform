# Member 3 — shared dashboard foundation

Implemented 15 November 2026 for the existing Student, Client and Super Admin
frontend demonstrations. Committee dashboards and payment screens are outside
this refactor. No requirement is marked complete by this structural change.

## Ownership and integration

Implementations live in `frontend/src/features/dashboards/student/`, `client/`
and `governance/`. Temporary compatibility entry points and CSS forwarding files
were removed after migrating their remaining consumers. All dashboard imports
now target the modular implementations directly. Client and governance model
tests live alongside their corresponding models; their assertions are unchanged.

The only change to Member 1's source is three dashboard import paths in
`app/router.jsx`. Route configuration, guards, session contracts, global
navigation, providers, theme, translations and other members' features are
unchanged. Existing payments and checkout are unchanged.

## Shared shell contract

`shared/DashboardLayout.jsx` accepts `title`, optional `subtitle`, `navItems`
(`{ id, label, icon, badge }`), `defaultSection` and ordinary children or a render
function receiving `{ activeSection, navigate }`. Icons are React elements.
Optional presentation props are `variant` (`student`, `client`, `admin`),
`mainId`, `navLabel`, `caption`, `brand`, `mobileAccount`, `sidebarFooter`,
`headerAccount`, `breadcrumbIcon`, `navigationLinks`, `onSectionChange` and
`overlays`. All supplied labels use the existing language context.

`useDashboardSection.js` derives the active section directly from `section` in
the URL; it introduces no duplicated section state. Unknown/unavailable sections
fall back to the default and unavailable navigation requests are ignored.
Navigation preserves unrelated query parameters; the default removes only
`section`. Browser history remains native. Pages reuse this hook for content
actions; the layout uses it for sidebar navigation. Admin sidebar changes retain
the existing search/filter resets.

The layout stays inside the existing application outlet. It retains `sd-`,
`cd-`, and `ac-` class contracts, including Member 1's application-shell overrides
that present dashboard sections as contextual navigation. Standalone student/client
shells retain their mobile menu; the admin retains horizontal mobile navigation.
It does not add a second global navigation, auth provider or router.

## Presentation and data

`shared/DashboardUi.jsx` consolidates badges, statistic cards, native dialogs and
student detail dialogs. The dashboard-specific adapters retain their original
DOM/classes and status presentation. Member 4's generic Modal/StatCard/Badge
contracts were inspected; directly replacing these dashboard primitives would
also change their CSS/markup or close behavior, so this extraction preserves the
existing dashboard presentation rather than modifying the shared library.
Dialog headings now use unique IDs. Native Escape and focus restoration remain.

The student model reuses the original `dashboardFixtures.js` records and selects
sample/empty records without mutation. Tables, active jobs and section views are
in `StudentDashboardPanels.jsx`; assets and icons have local modules.
The client model is moved without content changes. The governance model is the
original admin model with only its relative fixture import adjusted. Reducer,
audit, permission and registration behavior are retained. All EGP formatting
still uses the existing formatter. `dashboard.css` is unchanged; moved client
and admin styles retain their original declarations and theme variables.

## Validation

- Compatibility cleanup: all 349 Node tests, ESLint and the production build
  passed. An audit of 404 source/config/script files found no remaining imports
  resolving to the 12 removed compatibility files. The existing large-chunk
  warning remains; build asset hashes match the pre-cleanup build. Browser tests
  were not rerun for this import-only cleanup.
- Before compatibility cleanup, the existing complete Node suite passed 347 tests
  and the new shared-layout/student-panel regression tests passed 2 separately;
  they cover
  section validation, role shell variants, zero badges, original displayed
  values, empty records and fixture immutability.
- Production build and ESLint passed during implementation; final checks are
  recorded in the task completion message.
- `frontend/scripts/check-dashboard-foundation.mjs` uses externally available
  Puppeteer/Chrome, ordinary mock reset/login and the actual app routes. It checks
  section navigation, Back/Forward, unrelated query preservation, notification
  settings across sections, student/client dialog Escape and focus restoration,
  admin filter resets, sample/empty/error states, overflow at 1440/1024/768/390/320,
  and dark/RTL presentation at the narrow width. It adds no app dependencies.

Run from `frontend`:

```text
npm.cmd test
npm.cmd run lint
npm.cmd run build
node scripts/check-dashboard-foundation.mjs <puppeteer-module-path> <chrome-path> [base-url]
```

The browser script defaults to `http://127.0.0.1:5173` with Vite already running.
It writes desktop/mobile screenshots to the OS temporary directory. These checks
do not establish physical-device, full screen-reader or production-security
acceptance. Native standalone student/client menu behavior is not exercised by
the integrated-route browser test. No backend, persistence or live finance was
introduced. The existing large application-chunk build warning remains.
