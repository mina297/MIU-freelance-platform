# User-selectable navigation - 5 November 2026

## Behavior and coverage

Authenticated users can choose Top navigation or Side navigation in the account menu. Top is the default. Only the validated `top`/`side` preference is stored under `miu.navigation-layout`; unavailable storage falls back safely. No session or theme persistence was introduced.

The shared shell covers permitted application/admin routes, protected standalone workflows, and signed-in marketplace/help/profile browsing. Public marketing, authentication, anonymous browsing and standalone public previews retain their existing shells. Route permissions and Phase 1 simulation boundaries are unchanged (NFR-02, NFR-03, NFR-07, SR-17; BR-05).

`navigationModel.js` derives permitted destinations from routeConfig. The first five prioritized links appear in desktop navigation; additional destinations remain in the account menu. Both placements use the same links. Below 1100px a compact header and the existing Modal-based navigation drawer replace desktop navigation without changing the stored preference. Modal supplies Escape, focus containment/restoration, backdrop dismissal and shared scroll locking.

`NavigationProvider` holds one preference state. The routed child tree retains the same position and type during layout switches. Dashboard sections become contextual wrapping controls instead of a competing primary sidebar. Projects removes its duplicate header while the application shell is active. Theme and language controls are in the account menu. The official logo retains its original colors on a white plaque; the rail follows inline-start (right in RTL).

## Verification

Production build and lint passed during implementation. Existing theme/language checks passed across registered routes with exactly one control each. Focused tests cover storage failure/invalid values, role filtering and shell eligibility; rendering tests compare top/side links and utility counts for student, client, Super Admin and Finance Committee.

The full suite initially reported 342/346 passing: three failures expected the replaced public dashboard shell and one expected the original project-create action label. The assertions were updated for the intentional shell change and the action label preserved. All 19 affected integration/navigation tests then passed; the final 13 navigation/theme/language checks also passed. The full suite was not repeated after these focused corrections.

Actual browser verification was blocked: computer-use initialization failed with Windows sandbox Access is denied. Consequently desktop/mobile appearance, actual form/filter state retention, native drawer focus/scroll behavior, popup edge positioning, browser refresh persistence and real-device touch behavior remain unverified. Static render tests are not interaction or visual acceptance. Check both languages/themes at 1440, 1100, 768 and 390px, including long account names and short viewport heights. The existing production chunk-size warning remains.

## Preview

Start `npm.cmd run dev` from frontend. Sign in using an existing demo account, then visit `/student/dashboard`, `/client/dashboard`, `/projects` or the account's authorized administrative route. Open the avatar menu and choose Navigation layout. Sessions remain memory-only: refreshing resets the session and theme, while the navigation preference is restored after signing in again.

All changes are uncommitted. No branches, dependencies, backend services or business features were added.

## Shared floating navigation design

Extended the homepage header to routed public information, marketplace, authentication and standalone preview pages. PublicLayout accepts a header slot, preserving the router-independent M4 component preview. StandaloneLayout supplies a single public header and suppresses the catalogue duplicate; authorized application routes retain their role-filtered navigation. Admin access/error routes now use the normal shared fallback layout.

Application top navigation adopts the rounded elevated surface and grouped destinations. The side rail retains placement preference and receives matching rounded treatment. Compact EN/AR and appearance controls live beside the account menu, with one instance each. Below 1280px the application shell uses its mobile drawer to accommodate the utility group and longer translated links. Homepage motion is unchanged. Relevant requirements: FR-V01, FR-V05, NFR-02, NFR-03, NFR-07.

Standalone HTML component showcases retain their isolated component compositions. Browser appearance and interactive focus checks remain pending; static rendering does not establish visual correctness.

Verification of shared-header integration: 25 focused navigation, role/access, route rendering, theme and language tests passed. Lint and production build passed; the existing large bundle warning remains. Actual browser/mobile visual verification was not performed. Changes remain uncommitted.

Account menu polish: added native-radio layout preview cards with checked and keyboard-focus treatment, profile identity header, compact secondary links and separate sign-out action. Removed the side rail's stretched inner background. Both-placement rendering regression passed. Browser visual verification remains pending.

Layout-picker click repair: the transparent native radio now covers its complete preview card, avoiding label-to-input focus handoff through the blur-dismissed dropdown. Selection restores focus to the account trigger and closes the popup before placement changes. The narrow-screen drawer remains intentional regardless of saved desktop placement. Browser interaction verification remains pending.

Payments spacing repair: ClientPaymentsDashboard owns a centered 1488px maximum container with responsive 16?40px inline padding, bordered wrapping tabs and a bordered demo notice. Applies to payment history and overview under either navigation placement; financial logic is unchanged. Visual browser verification remains pending.

6 November: desktop side navigation selected destination now joins the page canvas with concave corners, mirrored in RTL. Removed the rail-to-content gap and content-side rail border. Uses theme canvas tokens in both themes; horizontal/mobile navigation is unchanged. Browser visual verification pending.
