# Student Dashboard — Phase 1 frontend

Route: `/student/dashboard` (P-11), directly available as a frontend preview.
The old demo account toolbar and simulated role gate were removed per the team's
navigation request. No authentication is implemented. Real role guards await login
integration. The catalogue remains at `/` and `/projects`.

`frontend/src/components/navigation/DevDashboardSwitcher.jsx` provides isolated
development navigation with separate CSS and no session or dashboard state.
Only Student Dashboard is linked; seven planned dashboards say Coming soon.
The switcher uses the compact MIU-red preview badge style, fixed 16px from the
bottom-right corner, with an upward-opening dropdown. It occupies no header
space and preserves keyboard, outside-click and route-change dismissal.
Set `VITE_ENABLE_DEV_DASHBOARD_SWITCHER=false` to hide it, or remove its import
and render in App.jsx. No dashboard routes need changing.

Requirements checked: FR-S04, FR-S05–FR-S06 (proposal visibility), FR-S08–FR-S09
(order overview), FR-S12 (simulated earnings overview), FR-S16 (temporary demo
preference), NFR-02 (accessibility), NFR-03 (responsive layout), and NFR-10
(sandbox finance transparency). These screens do not complete the full requirements.

Visual reference: [Student Overview desktop](https://www.figma.com/design/4OarPMFlQbiJI1Q1WxblcC/?node-id=71-11014)
and [mobile](https://www.figma.com/design/4OarPMFlQbiJI1Q1WxblcC/?node-id=71-11231).
Uses the Figma logo, avatar, icons, red/pink palette, 248px sidebar, 88px topbar,
40px desktop content padding, applications table, and paired progress cards.
Mobile uses a two-column summary, stacked application records and job cards,
and expandable navigation. Earnings/activity supplement the Figma overview to
cover the documented dashboard responsibilities. The development switcher and disclosures
are deliberate additions. Google Fonts are inherited from the app's HTML.

## Components and mock records

`frontend/src/features/dashboards/StudentDashboard.jsx` contains the dashboard,
ApplicationsTable, ActiveJobs, Badge, Empty, and native DetailDialog components.
`dashboard.css` scopes dashboard styling; `dashboardFixtures.js` contains stable,
fictional design display records. Assets are local in `src/assets/figma/dashboard/`.
Existing Member 2 marketplace contracts and fixtures are unchanged. These design
fixtures are not transaction records and must be replaced by shared selectors
when the marketplace and profile modules are integrated.

Sidebar sections use `?section=` so browser history works. Application actions,
job actions, notifications and help open keyboard-accessible native dialogs.
Settings expose an in-memory notification preference. Browse Jobs links to the
real catalogue. Preview controls below the footer exercise loading, empty,
recoverable error, and populated views. No requests are made to an API.

## Remaining integration work

- Completed-job summary and earnings are fictional aggregate fixtures; individual
  completed orders, reviews and financial transactions are not supplied.
- Profile, settings, support and order-workspace destinations show explicit
  integration notices rather than claiming complete workflows.
- Proposal editing/withdrawal, service management, messages, delivery, milestones,
  receipts, refunds, payouts and escrow require their owning modules.
- Current progress cards represent project orders. Service-order overview must
  consume the shared order contracts when integrated.
- Real authentication, verification, payments, AI and persistence remain excluded.

Manual review: open the student dashboard through the switcher, navigate sidebar sections and browser
history, open/close dialogs with keyboard, test all preview states, verify disabled planned dashboards, and inspect desktop/tablet/mobile widths.

## Verification — 23 October 2026

- `npm run lint` and `npm run build` passed.
- Existing marketplace Node tests: 8 passed.
- `scripts/check-student-dashboard.mjs` passed in headless Chrome: dashboard switcher, disabled dashboards, removed demo bar, direct route, six applications, two jobs, loaded images, dialog Escape/focus return,
  browser history, loading/empty/error/retry, settings, and catalogue navigation.
- No document overflow at 1440, 1024, 768, 390, and 320px.
- Desktop/mobile screenshots captured to ignored `frontend/artifacts/student-dashboard/`
  and inspected against the Figma renders. Development switcher and earnings/activity
  panels intentionally extend the supplied design.

Browser script accepts a path to a Puppeteer-compatible module and optional
Chrome executable as arguments. Browser tooling was reused from the local
environment; no runtime or development dependencies were added.
