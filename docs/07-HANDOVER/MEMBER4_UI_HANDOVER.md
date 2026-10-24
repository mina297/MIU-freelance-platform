# Member 4 — Public Website and UI Handover

**24 October integration note:** The original Member 4 homepage and its
`features/public/landing/` files/tests have been retired in favor of Member 1's
replacement. Historical landing commands below describe the original handover,
not the current suite. Public information pages, shared shell/UI and their tests
remain available. `/m4-pages-preview.html` now defaults to About. Run `npm test`
inside `frontend` for the current automated checks.

**Historical source snapshot:** 23 October 2026, baseline `b22f35f`.
**Owner:** Member 4 — public pages, shared UI presentation and visual consistency.
**Status:** independently implementable UI is available; application integration,
approved content and final acceptance remain pending. This document does not
declare the whole assignment, any routed workflow or an SRS requirement complete.

## 1. Start here

**24 October 2026 route integration:** the current application now mounts the
landing, About, How It Works, Terms/Privacy placeholders and feedback demos through
`app/PublicWebsite.jsx`, using the existing PublicLayout. Both landing and full
guide compose the existing HowItWorksSection. Available links and mock-session
workspace navigation are wired without wrapping the marketplace's standalone
shells. English remains active while the team supplies approved translations;
policy content also awaits that supplied text. Earlier route-pending snapshots
below are historical. Current route rendering/access tests cover the integration;
browser and screen-reader acceptance remain unverified.

**24 October 2026 correction:** the merged main's shared `PublicLink` and home
logos now use React Router for internal page paths when mounted inside a router.
Standalone previews and native-only destinations still use anchors. Landing's
live loading/result status now sits outside the busy results region. `npm.cmd test`
automatically discovers the full suite (161 passing tests at this correction),
with sequential execution and HMR disabled in middleware-only test servers. Lint
and build passed. The historical snapshots and browser evidence below have not
been relabeled as current acceptance; route composition, language integration,
policy approval, and manual browser/screen-reader checks remain pending.

- [Component contracts and per-feature verification](../03-DESIGN/UI_COMPONENTS.md)
- [Route inventory and ownership](../03-DESIGN/PAGES_AND_ROUTES.md)
- [Work distribution and QA checklist](../05-DEVELOPMENT/PHASE1_WORK_DISTRIBUTION.md)
- [Testing strategy](../05-DEVELOPMENT/TESTING_STRATEGY.md)
- [Known issues and open decisions](KNOWN_ISSUES.md)

At this baseline, [App.jsx](../../frontend/src/App.jsx) mounts Member 2's
ProjectsCatalogue preview. [main.jsx](../../frontend/src/main.jsx) does not mount
a router. Member 4's public pages are source components, not registered routes.
A Vite fallback showing the catalogue at an arbitrary URL does not prove that
URL is implemented. No routing, providers, application language state, marketplace
logic or other member's screen is changed by this handover branch.

### Current target comparison — 23 October 2026

The snapshot above describes this branch's source, not the newer fetched target
`origin/main` at `b542108`. That target already contains Member 1's BrowserRouter,
AuthProvider, AppRouter, mock authentication forms and role/session checks, plus
Member 2's project catalogue/details and simulated proposal submission. Its `/`
and `/services` screens remain placeholders; Member 4's public pages are not
connected there. The existing How It Works section (`753d9f1`, PR #4) is already
merged into that target, but remains absent from this branch's source tree.

All 13 open Member 4 PRs were inspected and target `main`. Documentation-only
conflict preparation relocates each branch's existing Member 4 catalogue entries
away from the target's How It Works insertion point, retaining all content.
Temporary three-way file comparisons do not merge or integrate branches. These
documentation checks alone do not establish remote PR mergeability; GitHub must
recompute it against each actual target after publication. Routing, providers
and page composition stay with Member 1; no application integration is performed
here.

## 2. Available work and branch provenance

The table records the original implementation commits, not subsequent local
documentation-fix tips. Those implementation tips were verified at handover;
their normal pushes were verified in the preceding work. The original handover
did not independently check PR review, merge approval or publication readiness.
The current target comparison above records the later PR inspection; it does not
claim team acceptance or publication readiness.

| Feature branch                 | Source commit | Delivered scope                                                                            |
| ------------------------------ | ------------- | ------------------------------------------------------------------------------------------ |
| `feat/m4-how-it-works-section` | `753d9f1`     | Approved landing section and six SVG exports; separate branch, not in this stack.          |
| `feat/m4-shared-ui-foundation` | `c928d4c`     | Button, Card, Badge, scoped foundation and isolated showcase.                              |
| `feat/m4-form-controls`        | `98a46d2`     | Field, Input, Select, Textarea, Checkbox and RadioGroup.                                   |
| `feat/m4-public-shell`         | `fe01529`     | PublicHeader, responsive navigation, PublicFooter, PublicLink and PublicLayout.            |
| `feat/m4-landing-discovery`    | `1395566`     | Hero/actions, category controls, projects/services, student examples and planned benefits. |
| `feat/m4-loading-error-states` | `7b0d3f1`     | Spinner, Skeleton, progress, loading/empty/error presentation and two demo pages.          |
| `feat/m4-modal-dialog`         | `cd0f7bc`     | Controlled accessible native Modal/Dialog.                                                 |
| `feat/m4-tabs-pagination`      | `0e347d0`     | Controlled Tabs and Pagination.                                                            |
| `feat/m4-data-display`         | `4ccc792`     | DataTable and StatCard; records and operations remain caller-owned.                        |
| `feat/m4-toast-feedback`       | `d205380`     | Controlled Toast visuals; no notification provider.                                        |
| `feat/m4-public-info-pages`    | `1e4931b`     | About and How It Works explanatory content; optional existing-section slot.                |
| `feat/m4-policy-pages`         | `f2aef5a`     | Explicitly unapproved Terms and Privacy placeholders.                                      |
| `feat/m4-language-switcher`    | `b22f35f`     | Controlled native language selector; no built-in languages/translations.                   |

The foundation-through-language implementation commits form the original
dependent stack. Use the listed implementation commits for feature-only
comparisons; the actual open PR targets are `main`, not the preceding feature
branch. Subsequent documentation fixes are independent commits on each existing
branch and do not integrate those branches with one another.
The How It Works section has separate ancestry: do not assume its JSX, CSS,
assets or isolated preview entry are present on this branch. Do not recreate,
copy or cherry-pick it as an incidental integration fix. The team must approve
its integration; no merge or branch restructuring is performed here.

## 3. Where to find things

| Location                                                                   | Use                                                                                             |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [Shared UI](../../frontend/src/components/ui)                              | Foundation, form controls, Modal, Tabs, Pagination, data display, Toast and loading primitives. |
| [Navigation](../../frontend/src/components/navigation)                     | Public shell presentation, destination labels and LanguageSwitcher.                             |
| [Feedback](../../frontend/src/components/feedback)                         | LoadingState, EmptyState and ErrorState.                                                        |
| [PublicLayout](../../frontend/src/layouts/PublicLayout.jsx)                | One main landmark and skip target; compose page content or an Outlet.                           |
| [Public features](../../frontend/src/features/public)                      | LandingPage, AboutPage, HowItWorksPage, TermsPage, PrivacyPage and state-demo pages.            |
| [Public information presentation](../../frontend/src/features/public/info) | Shared static-page frame/styles and page tests.                                                 |
| [Figma assets](../../frontend/src/assets/figma)                            | Existing local exports; retain their natural proportions.                                       |
| [Isolated foundation preview](../../frontend/shared-ui-preview.html)       | Button/Card/Badge showcase only; not a preview of the entire public website.                    |

The existing landing Hero supplies call-to-action destinations through props.
Category controls use the existing catalogue IDs; four unsupported categories
are explicitly unavailable. Do not duplicate Member 2's FilterPanel or invent
new category contracts. No approved video presentation asset/frame was identified
in the prior design review; the conditional video deliverable remains dependent
on an approved design/content input, not a reason to fabricate a video section.

## 4. Integration ownership and readiness

| Dependency                    | Owner and required action                                                                                                                                                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public routes                 | Member 1 composes LandingPage at the target's existing `/` placeholder and registers `/about`, `/how-it-works`, `/terms`, `/privacy`, `/loading-demo`, `/error-demo` with the right layout. No routes are registered by Member 4's components.  |
| Navigation                    | Member 1 supplies available destinations/current path. Missing destinations generally remain text; do not replace them with fake links. Confirm Safety & Trust and Community Guidelines mapping before adding destinations.                     |
| Catalogue layout              | Member 1 coordinates with Member 2 before wrapping the current catalogue, which already has its own header/main/footer. Avoid duplicate landmarks and shells.                                                                                   |
| Existing How It Works section | Already merged into fetched `origin/main` at `b542108`, but absent from this local source stack. Member 1 still supplies its node to LandingPage/HowItWorksPage once the components are available together. No replacement timeline is created. |
| Marketplace content           | Member 2 retains data, selectors, catalogue/filters, business actions and routing destinations. Category expansion needs an agreed contract.                                                                                                    |
| Student content               | Member 5 supplies approved profile content/links. Current landing identities are minimal fictional fixture participants, not invented ratings, verification or completed-work claims.                                                           |
| Dashboards/data display       | Members 2/3/5 supply records, columns, metrics, formatting, sort/filter/page logic and business actions.                                                                                                                                        |
| Notifications                 | Member 1 owns the notification provider/state and lifetime. Toast is only the renderer; avoid duplicate live regions and timing out focused feedback.                                                                                           |
| Language and RTL              | Member 1 owns language state/provider, approved dictionaries/options, document lang/dir and placement. LanguageSwitcher emits requests only. OD-12 remains open.                                                                                |
| Policy content                | Team supplies and approves final Terms/Privacy and publication details. OD-17 remains open; placeholders are not published legal documents.                                                                                                     |
| Visual approval               | Team reviews explicit Figma adaptations and missing full-page/toast/language/policy specimens. Do not relabel adaptations as exact approved geometry.                                                                                           |

Phase 1 remains a frontend demonstration. No live authentication, identity
processing, production AI, payments or escrow is claimed. EGP is the only
currency. No unofficial translations, legal commitments or university approvals
are supplied by this handover.

## 5. Verification evidence and limits

### Previously completed baseline

At source commit `b22f35f`, all **133 Node/Vite tests**, lint, source formatting,
default build and the language switcher's export-preserving build passed.
Earlier component entries record their own Chrome checks and targeted builds.
These are historical verified results, not reruns on this documentation branch.
No source or configuration changed here, so a redundant full suite/lint/build
rerun was not performed.

### New checks performed on this handover branch

The Edge results below were recorded during the earlier handover work, before
this final documentation review; they were not rerun during that review.
The browser fixture was temporary and is not a committed automated test suite.
Use the acceptance procedure below to repeat checks after integration.

Installed **Microsoft Edge 155.0.4283.62** was run headlessly with an isolated
temporary profile. Actual source components were imported into an in-memory
fixture through the existing Vite setup. No tracked browser fixture, preview
entry, router, package or configuration was added. Synthetic record/option
state was owned by the fixture, not production features.

- Landing, About, How It Works, Terms, Privacy, LoadingDemo, ErrorDemo and a
  shared-control composition each fit at **320, 390, 768 and 1440 CSS pixels**:
  32 viewport/view cases, with one h1, valid referenced IDs, loaded local images
  and no horizontal page overflow.
- PublicLayout skip-link focus and mobile menu keyboard open/Escape/focus
  restoration passed.
- Loading start/25% advance/complete/reset, error simulation/retry and empty
  recovery passed. Reduced motion suppressed reused spinner/skeleton animations.
- Landing text filtering produced an empty result and Clear filters recovered
  using the existing mock selectors/data. No route or real request was exercised.
- Tabs skipped the disabled tab, moved focus without selecting, and activated
  on Enter. Table sort and pagination emitted requests applied by the fixture;
  loading/error/empty states suppressed stale table content. Stat loading,
  native language selection/disabled skipping and Toast dismissal passed.
- Modal opening, scroll lock, eight forward Tab steps, reverse Tab containment,
  Escape, opener-focus restoration and scroll unlock passed. No fixture form
  submission occurred.
- Edge's mobile accessibility tree exposed tablist, table, columnheader and
  labeled combobox roles. This is DOM/AX evidence, not a screen-reader test.
- Additional DPR-scaled viewport checks passed for Landing, How It Works and
  long-text/inherited-RTL shared controls at 640 CSS pixels/DPR 2 and 320/DPR 4.
  **These six cases are not manual browser-zoom tests.** A headless zoom-key
  attempt did not change measured viewport/DPR, so real browser zoom is unverified.
- Mobile Terms and desktop shared-control screenshots were inspected. Successful
  final checks had no runtime exceptions, console errors or failed HTTP responses.

The separately branched How It Works section was not loaded or re-reviewed.
Full route/provider workflows, official translations and policy content were
not simulated into existence. Edge and the earlier Chrome checks both use
Chromium; this does not provide Firefox/WebKit coverage. No manual browser,
screen-reader, real-touch or full WCAG AA audit is claimed.

### Follow-up: existing section slot compatibility

On 23 October 2026, a temporary Vite SSR loader read the original
`HowItWorksSection.jsx`, its CSS and six SVG imports directly from Git commit
`753d9f1`, without copying files or combining branch histories. It composed
the actual section through the `howItWorks` slot in both `LandingPage` and
`HowItWorksPage`, inside `PublicLayout` from the handover stack.

Both compositions passed: one section instance, three original steps, six
decorative images, an associated section heading, one main landmark and one
h1. Landing placement preceded discovery, and omitting the slot rendered no
section. All **22 existing landing/public-info tests** also passed:

```powershell
cd frontend
node --test --test-concurrency=1 src/features/public/landing/landing.test.js src/features/public/info/publicInfo.test.js
```

This verifies server-rendered component contracts only. No source, route,
provider or application integration changed. Integrated browser layout,
deep-link behavior and accessibility acceptance remain pending; the temporary
loader is not a committed regression suite. A full test/lint/build rerun was
not needed for this documentation-only follow-up.

### Genuinely outstanding acceptance work

| Check                                                                         | Current status / prerequisite                                                                              |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Registered routes, deep-link refresh, current navigation and one public shell | Pending Member 1 integration; verify actual headings/content, not just Vite fallback responses.            |
| Existing section composed with landing/full guide                             | Section already merged into the target; actual page composition remains Member 1's integration work.       |
| Real language switch, document lang/dir and translated layouts                | Blocked on approved translations and Member 1's contract/provider (OD-12).                                 |
| Terms/Privacy publication                                                     | Blocked on team-approved text and applicable decisions (OD-17); retain explicit placeholder status.        |
| Screen-reader announcements, reading order, errors and dialog semantics       | Unverified with an actual screen reader; AX/keyboard checks are not a substitute.                          |
| Real browser 200%/400% zoom and text resizing                                 | Unverified; scaled viewport checks above must not be relabeled as manual zoom.                             |
| Firefox/WebKit and real touch/native mobile pickers                           | Unverified; no browser or package installation was performed.                                              |
| Precise Figma geometry and team approval of adaptations                       | Pending visual review, including missing full-page specimens.                                              |
| Final SRS/prototype captures and presentation paths                           | Pending integrated public routes and team acceptance; temporary fixture screenshots do not complete KL-06. |

No further standalone Member 4 component is justified by the inspected work
distribution. The next genuine UI milestone is post-integration public-website
acceptance, plus the manual checks above. Do not create duplicate components,
invent approved content or move Member 1 integration into a new Member 4 feature
just to manufacture another implementation branch. Choose an acceptance branch
base only after the relevant approved integration commit is available.

## 6. Commands and acceptance procedure

Observed environment: Node `v24.16.0`, npm `11.13.0`, installed Vite `8.3.2`.
Existing dependencies were used; nothing was installed for this handover.

From the repository root, these commands run the existing checks when code or
integration changes justify a rerun:

```powershell
cd frontend
$testFiles = @(rg --files src -g '*.test.js')
node --test --test-concurrency=1 @testFiles
npm.cmd run lint
npm.cmd run build
npm.cmd run dev -- --host 127.0.0.1
```

Use the URL Vite prints. `/shared-ui-preview.html` is the existing isolated
foundation showcase; `/` shows the catalogue on this local source stack, while
the newer target's `/` remains a routing placeholder. The separate section's
`/how-it-works-preview.html` exists on its own branch, not this stack. Public page
source files do not imply working `/about`, `/privacy` or other registered URLs.

After the team approves and integrates the necessary work:

1. Open each public route directly and refresh it. Verify its expected page title,
   content, one main landmark, shell and current navigation.
2. Traverse desktop/mobile navigation and actual available destinations by
   keyboard; verify the skip link, menu Escape and focus restoration.
3. Exercise loading completion/reset, error retry, empty recovery, form feedback,
   dialogs, tabs, page requests and native language selection in consuming screens.
4. Check available translated screens, preserved EGP values and original message
   content only after approved dictionaries/provider behavior exist.
5. Perform and record the still-unverified screen-reader, zoom, browser/device
   and precise visual checks above. Record the browser/version, viewport, action,
   expected result, observed result and evidence; leave unrun checks pending.
6. Capture approved page screenshots for the team's SRS and presentation. Keep
   fixtures and simulated workflows clearly identified. Update the acceptance
   status without marking unrelated SRS workflows complete.

This handover branch changes documentation only. Its new verification consists
of the focused Edge checks, follow-up SSR compositions and focused tests above,
local documentation-file reference checks and Git whitespace checks. There were
no reproduced source defects requiring changes.
