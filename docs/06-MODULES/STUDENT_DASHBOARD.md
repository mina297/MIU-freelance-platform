# Student Dashboard — Phase 1 frontend

## Glass presentation from the video — 26 November 2026

Latest palette direction uses the user-supplied admissions screenshot's off-white
canvas (`#f8f7f4`), white cards, warm-gray borders (`#dedad4`), dark text and
primary red (`#c0001a`) with a pale red wash. `studentDashboardPalette.css` scopes
these light-mode tokens to student workspace screens. The welcome/third-stat
cards use light backgrounds with red accents; the glass material, hover rail,
responsive sizing, content and actions remain. No form fields or components from
the reference are introduced. Dark mode and other account roles are unaffected.

Hover follow-up: on desktop with a fine pointer, the student side rail rests at
76px with icons and expands to 216px on hover, returning when the pointer leaves.
Keyboard-visible focus also reveals labels immediately; an open flyout keeps
the rail expanded until it closes. At the user's follow-up request, content now
uses a 108px inset while collapsed and 240px while expanded. Existing cards resize
beside the rail, so it no longer overlays the profile/dashboard content.
The glass backing transforms over 180ms and labels fade/translate over 150ms;
width itself is not animated. Reduced motion removes those transitions. Touch
and mobile navigation retain their existing behavior, and coarse-pointer desktop
layouts keep the expanded labels. No navigation items or components were added.
Browser checks confirmed 76→216→76px, responsive content sizing, keyboard
expansion without animation, an unclipped More flyout and no overflow at 390px.

The user-supplied video guides glass materials, card proportions and the expanded
side navigation. The user's follow-up keeps the website's existing crimson,
burgundy and pale pink palette; the video's beige colors, sample data, calendar,
charts and other components are not copied. The component tree, mock records,
labels, links, dialogs, states and authentication destinations remain intact.

`student/studentGlassyDashboard.css` scopes the decorative background and
translucent panels to `/student/dashboard` through `data-student-dashboard`.
The existing student side-navigation preference uses a 216px frosted rail with
horizontal icon/label links and a light selected item across student workspace
routes, scoped by `data-student-workspace`. Top/side selection, mobile drawer,
profile/avatar, appearance controls and account utilities retain their behavior.
Client, staff and public layouts do not opt in. No new UI components are added.

Glass uses CSS gradients derived from the existing brand tokens, translucent
surfaces, light edges and backdrop blur. Dark mode uses the same brand family;
reduced-transparency/high-contrast preferences and unsupported backdrop blur use
solid materials. Main/rail spacing remains responsive, and flyouts open upward
from the lower sidebar controls to stay inside the viewport. Requirements:
FR-S04–FR-S06, FR-S08–FR-S09, NFR-02 and NFR-03. This is presentation only.

Checks: four existing navigation/student-route/shared-layout tests passed.
Browser review exercised side navigation, section links, account/More flyouts,
light/dark mode and Arabic RTL. Width checks at 1440px and 390px found no document
overflow; the rail/account controls fit a 1440×650 short desktop viewport.
No real-device or assistive-technology review was performed for this styling.

## Consolidated navigation — 26 November 2026

Follow-up: the application navbar groups the English/Arabic language selector and
appearance toggle inside the sliders preferences dropdown. Help Center now appears
in More navigation and in the mobile drawer, using the existing `/help` route.
Language and help no longer occupy separate navbar buttons. Both navigation
placements retain access to these controls.
The preferences dropdown stacks Appearance above Language. Language uses an
EN/AR toggle with the same track, size and focus styling as the Light/Dark toggle,
and updates the existing language provider, including RTL direction. The toggle's
pressed state indicates Arabic is selected.
Sizing follows the main navbar preferences panel: 240px width, 12px padding and
20px corners, with height determined by the two 44px rows and their 12px gap.
Each row fills the panel and aligns its toggle to the same edge, avoiding uneven
column widths. The panel remains constrained to the mobile viewport.

At the user's request, the student dashboard renders content without its internal
sidebar or breadcrumb/account bar. The application navbar retains Overview,
Orders, My proposals, My services and Projects. Its More navigation dropdown adds
My Applications, Active Jobs, Completed Jobs, Profile and Settings; mobile
navigation includes the same destinations. Help, notifications and the signed-in
account remain reachable through the existing application navigation. The
duplicate fictional account display has been removed.

Sections retain their `?section=` URLs and browser history. The shared configuration
is `studentDashboardNavigation.js`; the navbar highlights the selected section.
The layout's optional `contentOnly` mode is used only by the student dashboard.
Client and administrative layouts retain their controls. Existing section
demonstrations and loading/empty/error views remain. Permissions and data
contracts are unchanged. Requirements: FR-S04, FR-S06, FR-S08–FR-S09, FR-S16,
NFR-02 and NFR-03.

Automated navigation, student-route and shared-layout checks cover section links,
active states, duplicate chrome removal and role restrictions. Live browser,
keyboard and responsive visual acceptance remain pending for this update.
Earlier sidebar/topbar descriptions below record the original implementation.

Route: `/student/dashboard` (P-11), connected through the shared router with the
student role guard and memory-only mock sessions. The landing page is at `/`;
the marketplace catalogue is at `/projects`. Real authentication remains out of scope.

`frontend/src/components/navigation/DevDashboardSwitcher.jsx` provides isolated
development navigation with separate CSS and no session or dashboard state.
Student and Client Dashboards are linked; six planned dashboards say Coming soon.
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

`frontend/src/features/dashboards/student/StudentDashboard.jsx` contains the page
and its session-only interaction state. `student/StudentDashboardPanels.jsx`
contains ApplicationsTable, ActiveJobs, Empty and section views;
`shared/DashboardLayout.jsx` and `shared/DashboardUi.jsx` provide the common shell,
badges, statistics and native dialogs. Imports use these modular paths directly;
temporary compatibility files have been removed.
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

## Prior branch verification — 23 October 2026

The results below were recorded on the source Student Dashboard branch. Current
client integration verification is documented in [Client Dashboard](CLIENT_DASHBOARD.md).

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


24 October 2026 routing integration: `/student/dashboard` now maps to the existing
`StudentDashboard` in the shared router content outlet. The shared navbar, layout
and student role guard are preserved. Mock sessions remain memory-only: refresh
requires signing in again before returning to the dashboard.
