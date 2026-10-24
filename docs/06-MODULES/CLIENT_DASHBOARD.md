# Client Dashboard — Phase 1 frontend

Implemented as a fictional, in-memory React preview at `/client/dashboard`
(P-15). Accessible from the temporary development switcher beside the Student
Dashboard. No authentication or real role enforcement is claimed; the existing
Student Dashboard branch explicitly defers session guards to Member 1.

The shared temporary switcher is a compact bottom-right MIU-red badge/dropdown,
using the existing preview badge's typography, padding and pill shape. Its menu
opens upward and retains navigation, Escape and outside-click behavior. It
occupies no header space on any page. The environment flag below still hides it.

## Requirements and design references

Reviewed FR-C03–FR-C07, FR-C11–FR-C14, FR-C17, BR-01, BR-02, BR-09–BR-11,
NFR-02, NFR-03 and NFR-10. This overview demonstrates portions of those
requirements and does not mark the complete SRS workflows implemented.

Figma file `4OarPMFlQbiJI1Q1WxblcC`:

- [Desktop overview](https://www.figma.com/design/4OarPMFlQbiJI1Q1WxblcC/?node-id=71-11450)
- [Mobile overview](https://www.figma.com/design/4OarPMFlQbiJI1Q1WxblcC/?node-id=71-11654)
- [Desktop review dialog](https://www.figma.com/design/4OarPMFlQbiJI1Q1WxblcC/?node-id=71-11831)
- [Mobile review dialog](https://www.figma.com/design/4OarPMFlQbiJI1Q1WxblcC/?node-id=71-12076)

The desktop uses a 248px sidebar, 88px account header, 40px content padding,
four metric cards, four recent jobs, a full-width active project, and a review
reminder. Mobile uses expandable navigation, two metric columns, stacked job
records, and stacked approval/review actions. Figma images and SVGs are local;
the client logo uses the design's cropped image slot. Inter and existing color
tokens follow the Student Dashboard conventions.

## Demonstrated behavior

- Client metrics: open jobs, new applicants, active work and completed work.
- Spending summary and recent activity, as required by the work distribution:
  supplemental panels below the Figma overview follow the Student Dashboard pattern.
  Spending shows agreed values of available completed and active records only,
  with no claim of processed payments or calculated all-time financial totals.
- My Jobs: text search and status filter; clear filters and no-results state.
- Sidebar sections use `?section=` and support browser back/forward.
- Applicants: project-level counts and a proposal-comparison integration notice.
- Completion: confirmation/cancel; accepted mock work moves to completed, updates
  metrics, and becomes eligible for a review. Completion dates use Africa/Cairo.
- Review dialog: keyboard-operable rating, required trimmed comment, validation,
  cancel/Escape, focus restoration, session-only success and duplicate prevention.
- Notifications, help, Find Talent, Post a Job and row details open explanatory
  dialogs where owning modules are not yet integrated.
- Settings: temporary notification preference.
- Preview controls below the footer: loading, empty, recoverable error and retry.

Mock records are deliberately isolated from Member 2's marketplace contracts.
All budgets use `formatEGP`. Date formatting reuses `formatDate` with an optional
locale argument; existing callers retain the original default.

## Files and integration

- `ClientDashboard.jsx`: page, navigation and session-only interaction state.
- `ClientDashboardPanels.jsx`: jobs list and validated review form.
- `ClientDashboardUi.jsx`, `DashboardDialog.jsx`: small UI and native modal.
- `clientDashboardModel.js`: fictional records, filtering and derived metrics.
- `clientDashboardAssets.js`, `clientDashboard.css`: local assets and scoped styles.
- `dashboard.css`: shared Student/Client Dashboard layout styles.
- `App.jsx`: preview router with public catalogue, student and client dashboards.
- `DevDashboardSwitcher.jsx`: both implemented dashboards linked; six others disabled.

Student Dashboard, its existing assets, shared CSS and development switcher were
reused from the local `feat/m3-student-dashboard` branch without switching,
merging, committing or changing branch history. The catalogue remains at `/`
and `/projects`. Set `VITE_ENABLE_DEV_DASHBOARD_SWITCHER=false` to hide the
temporary switcher. Session and route integration remain with Member 1.

## Deliberate limitations and visual differences

- The design supplies four jobs but aggregate totals of 24 posted and 18
  completed. Totals remain labeled fictional; the list truthfully shows all four
  available demo records and one page instead of presenting six empty pages.
- The spending/activity supplements, switcher, demo disclosure, validation, success messages and completion
  confirmation extend the static design. Review comments start blank and are not
  represented as published on a public profile.
- Project editor (P-16), proposal comparison/decisions (P-17), freelancer/service
  discovery, service orders, workspace files/messages/revisions, transaction
  history/escrow, profile editing, support tickets and account settings remain
  dependencies. Dashboard entry points disclose this instead of linking to
  nonexistent screens or claiming completed actions.
- The design's active card is a project order. No service-order records are
  invented; integration must later cover both order sources.
- Dates reproduce the October 2026 design snapshot, including past deadlines;
  the preview does not label these as currently on track.
- Real login, role guards, identity verification, AI, payments and persistence
  remain excluded. Every record and mutation in this preview is fictional.

## Validation

Run from `frontend`:

```text
npm run lint
npm run build
node --test --test-isolation=none src/features/marketplace/marketplace.test.js src/features/dashboards/clientDashboard.test.js
node scripts/check-client-dashboard.mjs <puppeteer-module-path> <chrome-path>
```

Browser tooling is supplied by the local environment, with no new dependencies.
The browser script checks routes/switcher, metrics, filters/history, review
validation/submission, completion/cancel, loading/empty/error/retry, settings,
student regression, local asset proportions and SVG root sizing, Escape/focus,
and overflow at 1440, 1024, 768, 390 and 320px. Screenshots are written to ignored
`frontend/artifacts/client-dashboard/` for comparison with Figma.

Verified on 23 October 2026:

- ESLint and Vite production build passed.
- All 12 Node tests passed (eight existing marketplace checks and four dashboard checks).
- The headless Chrome browser script passed, including the responsive widths,
  review/completion flows, assets, modal focus, state recovery and Student Dashboard smoke test.
- Desktop/mobile overview and review screenshots were inspected against the Figma renders.
- `git diff --check` passed. No backend or new package dependencies were added.

The sandbox initially prevented Vite from spawning build processes. The final
build and browser checks succeeded with the approved execution permission.
