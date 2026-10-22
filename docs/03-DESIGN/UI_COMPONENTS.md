
---
title: UI Components
type: component-catalogue
status: planned
tags: [MIU, React, components]
---

# MIU Freelance Platform — UI Components

## 1. Purpose

Define reusable interface building blocks for a consistent React frontend.

Avoid recreating the same buttons, cards, forms, tables, and status components across different modules.

## 2. Foundation Components

| Component | Responsibility |
|---|---|
| Button | Primary, secondary, outline, destructive and loading actions |
| Input | Text, email, password, number and relevant validation states |
| Textarea | Multiline content |
| Select | Selection control |
| Checkbox | Boolean choices |
| Radio Group | Exclusive choices |
| Modal/Dialog | Focused decision or confirmation |
| Alert | Informational and error messages |
| Toast | Temporary feedback |
| Badge | Status and metadata labels |
| Card | Reusable content container |
| Tabs | Local section navigation |
| Pagination | Collection navigation |
| Skeleton | Loading placeholders |
| Empty State | No available content |
| Error State | Recoverable errors |
| Spinner | Operation in progress |

## 3. Layout Components

- PublicHeader
- PublicFooter
- PublicLayout
- AuthLayout
- StudentLayout
- ClientLayout
- AdminLayout
- DashboardSidebar
- DashboardHeader
- PageHeader
- Breadcrumbs

Role-aware navigation logic should be separated from purely visual rendering.

## 4. Marketplace Components

- ProjectCard
- ProjectFilters
- ProjectDetailsHeader
- ProposalForm
- ProposalCard
- ProposalComparison
- ServiceCard
- ServiceFilters
- ServiceDetails
- ServicePackageSelector
- ServiceEditor
- FreelancerCard
- SkillsList
- OrderStatusBadge
- OrderTimeline

## 5. Profile Components

- ProfileHeader
- ProfileSummary
- SkillsDisplay
- PortfolioGrid
- PortfolioItem
- ReviewCard
- RatingSummary
- ReviewForm

## 6. Financial Components

- PriceDisplay
- CheckoutSummary
- PaymentStatusBadge
- TransactionTable
- EscrowTimeline
- RefundStatus
- FeeBreakdown

All prices use the shared EGP formatter.

## 7. Administration Components

- AdminStatCard
- CommitteeWorkspace
- CaseQueue
- CaseDetails
- DecisionDialog
- AuditHistory
- PermissionMatrix
- CommitteeAccountForm
- ReportedContentCard
- EvidenceViewer

## 8. AI and Verification Components

- VerificationStepper
- CameraPreview
- IdentityDocumentGuide
- VerificationStatus
- RecommendationCard
- ChatbotPanel
- TranslationControl
- ModerationFlag
- QualityFeedbackCard

Phase 1 verification and AI outputs must be visibly simulated.

## 9. Component API Guidelines

Components should:
- Have descriptive property names.
- Accept controlled values when appropriate.
- Expose callbacks rather than own unrelated business state.
- Support disabled and loading states where relevant.
- Display accessible labels.
- Avoid role checks in generic presentational components.
- Avoid hardcoded business records.
- Use consistent tokens and icons.

## 10. Example Component Contract

```jsx
<Button
  variant="primary"
  disabled={isSubmitting}
  loading={isSubmitting}
  onClick={handleSubmit}
>
  Submit Proposal
</Button>
```

The example demonstrates an intended interface, not evidence that the component currently exists.

## 11. States to Support

Relevant components should cover:
- Default
- Hover
- Focus
- Disabled
- Loading
- Error
- Success
- Empty
- Selected

## 12. Acceptance Checklist

- [ ] Matches approved Figma
- [ ] Reusable without unnecessary duplication
- [ ] Supports expected variants
- [ ] Keyboard accessible
- [ ] Clearly labeled
- [ ] Responsive
- [ ] No hidden network side effects
- [ ] Documented props
- [ ] Appropriate tests

## Member 4 — Shared UI foundation

The new components live in `frontend/src/components/ui/` and import their own
scoped `foundation.css`. Existing marketplace components are not migrated by
this change. No routes, application providers, global tokens, or record
contracts are changed. Related quality requirements: NFR-02, NFR-03, NFR-16.

```jsx
import Button from "./components/ui/Button.jsx";
import Card from "./components/ui/Card.jsx";
import Badge from "./components/ui/Badge.jsx";

<Card as="article" aria-labelledby="example-title">
  <h2 id="example-title">Example</h2>
  <Badge variant="info">In progress</Badge>
  <Button loading={isSaving} onClick={handleSave}>Save draft</Button>
</Card>
```

| Component | Props and behavior |
|---|---|
| Button | `variant`: `primary` (default), `secondary` (black), `outline`, `ghost` (neutral Cancel specimen), `destructive`. `type` defaults to `button`; set `submit` explicitly for forms. `disabled` and `loading` block activation; loading preserves the label and exposes `aria-busy`. `children`, `className`, native button attributes, event callbacks, and React 19 `ref` are forwarded. |
| Card | `as`: `div` (default), `article`, or `section`. `children`, `className`, and native attributes are forwarded. Supply headings/accessible names for sections. It is a container, not an interactive replacement for a link or button. |
| Badge | `variant`: `neutral` (default), `success`, `info`, `completed`, `warning`, or `danger`. Supply visible text through `children`; variants do not infer statuses, permissions, or business rules. Native span attributes and `className` are forwarded. No automatic live-region role. |

Unknown variants fall back to the defaults. Consumers may supply decorative
icons as children, hidden from assistive technology, and must provide an
accessible name for icon-only buttons. No fixed feature-specific icons or
business records are bundled into these primitives. Layout classes can be
passed through `className`; base component styling remains scoped.

Visual references: Figma `4:2680` (actions/statuses) and `4:2847` (card surface)
in file `4OarPMFlQbiJI1Q1WxblcC`. Buttons use the rendered specimen's pill
corners, despite its conflicting 10px-radius annotation; this discrepancy is
recorded rather than changing global radius rules. Cards use the specimen's
32px padding, 10px radius, border, white surface, and subtle shadow. Badges use
28px minimum height and pill corners. Long labels may wrap rather than clip;
buttons have at least 44px height and a visible focus outline.

Colors reuse existing brand/status tokens. Additional neutral and badge
background values are copied from the inspected Figma specimens and scoped
to these components; no new global colors are introduced. Brand and status
token references include local fallbacks with the exact values already
declared in `index.css`, because Tailwind may omit unused theme variables.
The green and amber badge text in Figma fails the normal-text AA contrast target on its
background, so `success` and `warning` use the existing MIU black text token
while retaining the Figma backgrounds. The danger badge similarly uses the
existing darker MIU red token for text because the Figma error red falls below
4.5:1 on its pale background. Destructive, disabled, loading, hover,
and focus behavior use existing colors; those states extend the static
specimens to meet the documented component requirements. Reduced motion
disables the loading animation and button transitions.

Focused tests use the existing Node runner and installed Vite JSX pipeline:

```bash
cd frontend
node --test src/components/ui/foundation.test.js src/features/marketplace/marketplace.test.js
npm.cmd run lint
npm.cmd run build
```

The component tests cover native semantics, default/explicit submit behavior,
loading/disabled activation guards, labels/attributes, and explicit badge
variants. Server rendering does not verify browser keyboard behavior, focus
appearance, responsive rendering, screen readers, or exact Figma geometry.
The default application build does not mount these unused primitives yet;
the focused tests load all three through Vite. Integration with other
members' screens remains separate work.

Implementation verification (22 October 2026): 14 tests passed (six focused
foundation tests plus eight existing marketplace tests), lint passed, and
the default application build passed. All six badge text/background pairs
were calculated to exceed 4.5:1 after the scoped contrast adjustments.
Browser visual/keyboard, zoom, screen-reader, cross-browser, and precise
Figma geometry checks remain unverified. No SRS requirement is marked complete
on the strength of these foundation components alone.

## Member 4 — Form controls

Implemented in `frontend/src/components/ui/`: `Input`, `Select`, `Textarea`,
`Checkbox`, and `RadioGroup`, with shared label/feedback rendering in `Field.jsx`
and scoped styling in `forms.css`. These extend the shared foundation's visual
conventions and existing theme tokens without changing the foundation files,
global CSS, routes, or other members' feature components. Related requirements:
NFR-02 (accessibility), NFR-03 (responsiveness), and NFR-16 (maintainability).

```jsx
import Input from "./components/ui/Input.jsx";
import Select from "./components/ui/Select.jsx";
import Textarea from "./components/ui/Textarea.jsx";
import Checkbox from "./components/ui/Checkbox.jsx";
import RadioGroup from "./components/ui/RadioGroup.jsx";

<Input
  label="Title"
  name="title"
  required
  value={title}
  onChange={(event) => setTitle(event.target.value)}
  helperText="Describe the item briefly."
  error={errors.title}
/>
<Select label="Choice" name="choice" defaultValue="first">
  <option value="first">First</option>
  <option value="second">Second</option>
</Select>
<Textarea label="Details" name="details" rows={4} />
<Checkbox label="Include this option" name="include" />
<RadioGroup
  label="Choose one"
  name="example-choice"
  options={[
    { value: "first", label: "First" },
    { value: "second", label: "Second", disabled: true },
  ]}
  defaultValue="first"
/>
```

These are neutral usage examples, not implemented application forms or new
business rules. Supply approved labels and messages at the consuming feature.

| API | Contract |
|---|---|
| Shared field props | Supply a visible `label`. Optional `helperText`, `error` (message), `required`, `disabled`, and `id`. A required field shows an asterisk and uses native required semantics. IDs are generated with React `useId` when omitted. Caller-supplied IDs must be unique in the document. |
| Feedback | Helper text and error messages have associated IDs, merged with caller `aria-describedby`. A nonempty `error` sets `aria-invalid` even if the caller supplied false. Otherwise caller `aria-invalid` is preserved. The visible error icon and message avoid relying on color alone. There is no automatic alert/live region; announcement timing and submit/focus management belong to the consuming form. |
| Input | Native text-like input, `type="text"` by default. Supports email, password, number, search, and native constraints such as `min`, `max`, `step`, and `maxLength`. Use the dedicated Checkbox/RadioGroup for choices. |
| Select | Native select; provide `option`/`optgroup` children. Supports `value`/`onChange` or `defaultValue`, disabled options, and native `multiple`/`size`. Native option popup presentation and long selected-value display depend on the browser/OS. |
| Textarea | Native textarea; `rows={4}` by default, vertically resizable. Supports native length constraints. |
| Checkbox | Native checkbox with a wrapping associated label; supports `checked`/`onChange` or `defaultChecked`. |
| Native forwarding | Input, Select, Textarea, and Checkbox forward native control attributes, callbacks, React 19 `ref`, and `className` to the control. Do not mix controlled and uncontrolled props. These components do not own values or run application validation. |
| RadioGroup | Native fieldset/legend with same-name radio inputs. `options` contains unique string `value`, visible `label`, and optional `disabled`. Supports `name`, `value`/`onChange` or `defaultValue`, shared field props, ARIA feedback props, and fieldset `className`. `onChange` receives the native React change event. `id` is a prefix for option/feedback IDs. An omitted `name` defaults to that unique prefix. Whole-group disabling and individual disabled options are supported. The group does not forward arbitrary native input props or refs. |
| Field | Shared rendering utility used by the controls, not a second input implementation. Its render-function `children` receives the associated `id`, `required`, `disabled`, `aria-describedby`, and `aria-invalid`. Internal `choice` and `group` modes render the checkbox label or fieldset/legend. |

Visual reference: approved Figma form showcase `4:2722`, file
`4OarPMFlQbiJI1Q1WxblcC`. Confirmed input values: 48px minimum height, 12px
horizontal padding, 14px text, 8px label gap, white surface, existing neutral
border, and red focus/error treatment. The rendered specimens have pill corners
despite their 6px-radius annotation; Input and single-select follow the rendered
shape. Textarea and multi-select use the annotated 6px radius. Dedicated Select,
Textarea, Checkbox, and RadioGroup specimens were not confirmed in that frame;
their native presentation extends these conventions rather than claiming an
exact Figma match. The error icon reuses the installed Lucide CircleAlert,
matching the specimen's 14px feedback icon. Search icons and search-specific
adornments are not part of these generic controls. No new assets or dependencies
are introduced.

Error text uses the existing darker MIU red for readability; error borders use
the existing danger token. Default pale borders follow the Figma specimen;
complete WCAG conformance, including non-text boundary contrast in consuming
layouts, is not claimed. Keyboard focus uses an additional visible 2px outline.
Disabled controls use the foundation's neutral surface/text colors and native
disabled behavior. Labels and feedback wrap, controls shrink within layouts,
and choice labels provide a minimum 44px clickable height. Logical spacing
supports inherited direction; no translations are included.

Verification on 23 October 2026:

- All 25 tests passed: 11 form-control tests, six foundation tests, and eight
  marketplace tests. Coverage includes unique label IDs, feedback associations,
  native attributes/constraints, controlled callbacks/ref forwarding, native
  selection, grouped radio semantics, disabled states, and escaped content.
- ESLint, the default Vite production build, and Prettier checks for all eight
  new source/test/style files passed. The production application does not mount
  these controls yet; tests and browser checks load them through Vite separately.
- Headless Chrome checks at 320, 390, 768, and 1440px found no horizontal overflow
  with long labels, feedback, and unbroken text. Measured input height was 48px
  and feedback icon geometry was 14×14px.
- Browser checks verified keyboard entry and visible focus on Input, native
  required-input validity, controlled checkbox Space activation, controlled
  radio arrow-key selection, and all rendered label/description references.
  No runtime exceptions or console errors occurred during these checks.
- Browser checks used an in-memory mount in a local browser session; no preview
  files, application routes, or production screens were added.
- Screen readers, zoom, real touch devices, other browsers, native Select popup
  interactions, full keyboard traversal, and precise Figma geometry comparisons
  remain unverified. Browser execution is not a visual approval by the team.
  Integration, domain validation, and submit/recovery behavior remain the feature
  owners' responsibility. No SRS requirement is marked complete by this change.

Run the installed checks without adding packages:

```bash
cd frontend
node --test --test-concurrency=1 src/components/ui/forms.test.js src/components/ui/foundation.test.js src/features/marketplace/marketplace.test.js
npm.cmd run lint
npm.cmd run build
node node_modules/prettier/bin/prettier.cjs --check src/components/ui/Field.jsx src/components/ui/Input.jsx src/components/ui/Select.jsx src/components/ui/Textarea.jsx src/components/ui/Checkbox.jsx src/components/ui/RadioGroup.jsx src/components/ui/forms.css src/components/ui/forms.test.js
```

## Member 4 — Public shell

Implemented visitor presentation components:

- `frontend/src/components/navigation/PublicHeader.jsx`
- `frontend/src/components/navigation/PublicFooter.jsx`
- `frontend/src/components/navigation/PublicLink.jsx`
- `frontend/src/components/navigation/publicShellContent.js` (approved/documented labels)
- `frontend/src/components/navigation/public-shell.css` (scoped styles)
- `frontend/src/layouts/PublicLayout.jsx`

`PublicLayout` accepts page `children`, a `destinations` object, and `currentPath`.
It renders a skip link, header, one focusable main landmark, and footer. Member 1
can supply an `Outlet` as children when connecting the router. Do not wrap an
existing page that already owns its header/main/footer, including Member 2's
current `ProjectsCatalogue`, without coordinating that page's integration.
Neither the application entry point nor existing feature components are changed.

Header and footer also accept `destinations` and `currentPath` independently.
Recognized destination keys are `home`, `projects`, `services`, `howItWorks`,
`about`, `login`, `signup`, `freelancers`, `help`, `contact`, `privacy`, `terms`,
`safety`, and `communityGuidelines`. Only `home` has a default (`/`). Supply other
URLs only when their destination is approved and available. Unconfigured entries
render as plain text, without placeholder `#` links or fake actions; unavailable
Sign up text does not receive the filled action treatment. Native anchors retain
normal browser link behavior. Exact `currentPath`/URL matches expose
`aria-current="page"`. These components do not inspect sessions, register routes,
or enforce authorization. Member 1 owns route guards, SPA navigation integration,
and navigation focus after changing pages.

The mobile menu is a nonmodal disclosure built with the existing shared Button.
It exposes `aria-expanded`/`aria-controls`; collapsed items are hidden. Enter and
Space operate the button. Escape inside the header closes the menu and restores
button focus. Selecting a configured link, outside pointer interaction, a
`currentPath` change, or resizing to desktop closes it. It does not trap focus
or use application-menu roles. Native navigation links remain keyboard links.
The shell contains no form fields, so form controls are not inserted artificially.

Design references: desktop header `8:2657`, mobile header `8:2952`, desktop footer
`8:2927`, and mobile footer `8:3214` in approved file
`4OarPMFlQbiJI1Q1WxblcC`. Header colors, 1200px desktop content width, 88px desktop
height, mobile 20px gutters, action styling, footer groups, and footer copy follow
these frames. The local MIU logo was compared with the Figma asset and is
byte-identical; it is reused without creating assets. Installed Lucide Menu/X
provide the menu icon and close-state extension. Existing foundation styles and
theme values are reused; no global tokens or dependencies change.

Documented adaptations and limits:

- Both marketplace models are required by FR-V01/BR-01. Desktop navigation adds
  the documented Services and About destinations to Figma's two-link header;
  mobile's expanded menu includes these and documented public/support pages.
  This expanded state is an implementation extension: no approved open-menu or
  intermediate-width frame was confirmed. The desktop breakpoint is 960px.
- The repository requires preserving the complete logo and original proportions.
  The components use `object-fit: contain` in the Figma-sized logo slots rather
  than reproducing Figma's visible cropping. This deliberate difference remains
  subject to team visual review.
- The menu button has a 44px target instead of Figma's 40px. Quick links have
  24px minimum height; the measured mobile header is consequently 101px rather
  than the frame's 91px. Long footer text wraps rather than clipping. Footer
  height may grow with accessible link targets or content wrapping.
- Footer descriptor, copyright notice, and legal labels are copied verbatim from
  the approved frame. No policy text, verification guarantees, social links,
  contact details, or legal documents are authored. Safety & Trust and Community
  Guidelines have no confirmed route mapping and remain text unless the team
  supplies approved destinations. Figma copy is not evidence of production
  verification or institutional permission to deploy; Phase 1 disclosures remain
  the responsibility of the integrating demonstration screens.

Verification on 23 October 2026: 33 tests passed (eight shell, 11 form-control,
six foundation, eight marketplace); lint, default application build, source
formatting, and `git diff --check` passed. Shell tests use the installed Node test
runner and Vite SSR pipeline in `publicShell.test.js`. The default build does not
mount these new components; the tests and browser checks load them separately.

Headless Chrome checks at 320, 390, 768, 960, 1024, and 1440px found no horizontal
overflow. Desktop/mobile screenshots were inspected. The local logos loaded,
and the containment styling preserved their proportions. Checks verified skip-link
focus/activation, visible link/button focus, Enter/Space opening, Tab traversal
into the expanded panel, Escape focus restoration, link-selection closure,
outside-pointer closure, resize closure, and external path-change/back closure.
A long-text stress check also found no page overflow. No runtime exceptions or
console errors occurred during the successful checks. Browser navigation used
in-memory fixture destinations and did not verify real destination screens.
No preview files or routes were created.

Remaining verification: team visual approval, systematic zoom, real touch
devices, screen readers, other browsers, exhaustive keyboard traversal, actual
routed-page integration, and precise Figma geometry. Related requirements are
FR-V01, FR-V03, FR-V04, NFR-02, NFR-03, and NFR-16; none is marked complete merely
because the shell exists.

```bash
cd frontend
node --test --test-concurrency=1 src/components/navigation/publicShell.test.js src/components/ui/forms.test.js src/components/ui/foundation.test.js src/features/marketplace/marketplace.test.js
npm.cmd run lint
npm.cmd run build
node node_modules/prettier/bin/prettier.cjs --check src/components/navigation/PublicHeader.jsx src/components/navigation/PublicFooter.jsx src/components/navigation/PublicLink.jsx src/components/navigation/publicShellContent.js src/components/navigation/publicShell.test.js src/components/navigation/public-shell.css src/layouts/PublicLayout.jsx
```

## Member 4 — Landing page and discovery

Implemented page content in `frontend/src/features/public/LandingPage.jsx` and
focused components under `frontend/src/features/public/landing/`:
`HeroSection`, `FeaturedOpportunities`, `DiscoveryCard`, `FeaturedStudents`,
`TrustSection`, and the local `SectionHeading` helper. `discoveryModel.js` adapts
the existing marketplace selectors read-only; `landing.css` scopes presentation.
No application entry point, router, shared component, marketplace record,
contract, catalogue, or profile module is changed.

The page is content for the approved `PublicLayout`, not a second main landmark.
Member 1 can compose it with the shell when the public route is available:

```jsx
<PublicLayout destinations={availableDestinations} currentPath="/">
  <LandingPage
    destinations={availableDestinations}
    getProjectHref={getAvailableProjectHref}
    getServiceHref={getAvailableServiceHref}
    getStudentHref={getAvailableStudentHref}
    howItWorks={existingHowItWorksSection}
  />
</PublicLayout>
```

This is a handover example, not registered application routing. Supply only
approved destinations that actually exist. `App.jsx` continues to show Member 2's
standalone catalogue. The existing How It Works component must be supplied through
the `howItWorks` React-node slot, located between hero and discovery. The slot is
empty by default; that completed branch was not copied, recreated, or cherry-picked.
Full landing assembly therefore remains dependent on connecting that work.

| LandingPage prop | Behavior |
|---|---|
| `data` | Defaults to Member 2's existing `marketplaceData`; accepts the same valid record shape for tests/integration. The page does not mutate it or introduce a new marketplace schema. |
| `destinations` | Optional `projects`, `services`, `freelancers`, and `postProject` URLs. Missing actions render as plain text via the shell's PublicLink. Member 1 owns protected-action routing, session behavior, and availability of Post a Job. No route/query-string contract is assumed. |
| `getProjectHref`, `getServiceHref`, `getStudentHref` | Optional `(stableId) => availableURL` callbacks. Absent callbacks produce no fabricated detail/profile links. Actual destination screens and guards remain their owners' work. |
| `howItWorks` | Optional existing section node; no duplicate implementation or placeholder recreation. |
| `discoveryState` | `ready` (default), `loading`, or `error`. The latter states disable discovery inputs/actions and hide opportunity cards. These are supplied presentation states; the component performs no fetch and creates no artificial delay. |
| `onRetry` | Optional retry callback; error recovery shows a real button only when this handler exists. |

Search filters the in-memory project and service examples while typing. Submit
and Find Work move keyboard focus to the results region without reloading.
The adapter calls `findProjects`/`findServices` with the shared open/published
statuses. It also calls their existing skill filters when a query matches a
shared skill label, deduplicates results by ID, and preserves source order.
Category chips and the native category select share one category value. Clear
filters resets both inputs and returns focus to search. Results show totals for
both models and up to three cards per model, in fixture order; this is not an
approved ranking/recommendation algorithm. No catalogue workflow is replaced.

Project cards use existing titles, client names, skills, budgets, deadlines, and
creation dates. They do not invent client ratings, verification badges, applicant
counts, or relative timestamps. Category replaces Figma's unsupported applicant
count. Service starting prices are the lowest finite price among the service's
linked packages, obtained with `getPackagesByService`; missing prices remain
unavailable, never EGP 0. Amounts and dates use the existing formatters.
Bookmarks are explicitly temporary landing-local UI state with `aria-pressed`
and status feedback; they neither persist nor synchronize Member 2's catalogue
preview. Empty results have working Clear filters recovery.

Student examples use only the existing shared participant IDs/display names.
Member 5 has no full student-profile data/component in this branch. The section
therefore says Meet student talent, uses derived initials, and does not render
ratings, reviews, majors, year groups, verification, invented skill profiles, or
Figma's unrelated portrait identities. Student profile enhancement and real
profile navigation require Member 5's data and Member 1's available routes.

Figma references in approved file `4OarPMFlQbiJI1Q1WxblcC`:

- Hero: desktop `8:2667`, mobile `8:2964`.
- Featured jobs: desktop `8:2732`, mobile `8:3027`.
- Student-card presentation: desktop `8:2846`, mobile `8:3134`.
- Benefits: desktop `8:2909`, mobile `8:3196`.

The approved hero headline is Find real work. Build your reputation.; this takes
precedence over the different example headline in the draft Design System.
Confirmed typography includes Playfair Display 52px desktop/40px mobile for the
hero and Inter body text, 32px/28px section headings, 1200px desktop content,
20px mobile gutters, pale red hero/benefit surfaces, white cards, and neutral
opportunity backgrounds. Existing Button, Badge, Card, Input, Select, and
PublicLink components are reused without editing their implementations.
One Figma-exported 8×8 SVG is added at
`frontend/src/assets/figma/landing-community-accent.svg`, reused on both sizes.
Installed Lucide icons provide matching search, chevron, bookmark, and benefit
artwork. No temporary Figma URLs are used at runtime, and no portrait assets or
dependencies are added.

Documented adaptations and remaining design decisions:

- Explicit Phase 1 notices qualify the marketing copy. Benefit cards retain the
  approved design wording but each is labeled Planned; no identity verification,
  ratings, completed-work history, or payment functionality is represented as live.
- FR-V01, NFR-01, and BR-01 require both marketplace paths. A service section uses
  the inspected opportunity-card patterns and real shared service records; no
  dedicated service landing frame was confirmed. This extension needs team visual
  review rather than being described as an exact Figma screen.
- Only Design, Development, and Writing map to available category IDs. The other
  four approved chips are disabled with an explanatory preview note. No categories
  or records are invented. The initial category is All, not Figma's selected Design.
- Labels remain visible and controls/chips/bookmarks have at least 44px targets.
  Search layout, section height, and card spacing consequently differ from the
  static frames. The 8px community accent and 24px benefit icons are reused on
  mobile instead of separate 7px/23px exports. Muted card metadata uses the existing
  darker secondary-text value for readability. Columns adapt at 700px/1100px;
  desktop typography/search adapt at the shell's 960px breakpoint.
- No standalone video or bottom CTA block was confirmed in these landing frames;
  the hero's Find Work/Post a Job actions provide the inspected CTA presentation.
  No video, statistics, social proof, legal copy, or extra product claims are invented.

Verification on 23 October 2026: all 47 tests passed, including 14 landing tests
and 33 existing tests. Lint, default Vite build, formatting of the ten new
JavaScript/JSX/CSS files, and whitespace checks passed. The default application
build still mounts the catalogue; SSR tests and the browser load the new landing
modules separately. Headless Chrome checks at 320, 390, 640, 768, 960, 1024, and
1440px found no page overflow. Mobile/desktop screenshots were inspected; Playfair
Display loaded, hero text measured 40px/52px, and the local accent rendered 8×8.
Browser checks exercised skill search, combined filters, chip/select synchronization,
native select keyboard operation, Search focus, empty recovery, save/unsave,
loading/error/retry, associated labels/headings, and long-text wrapping. No runtime
exceptions or console errors occurred during the successful checks. Browser-only
fixture destinations were intercepted; actual routed destination screens were not
verified. No new preview infrastructure or application routes were added.

Remaining verification/dependencies: How It Works assembly, routed integration,
Member 5's profile contract, approval of the service/data-driven visual adaptations,
systematic zoom, screen readers, real touch devices, other browsers, exhaustive
keyboard traversal, and precise Figma geometry. Related requirements: FR-V01,
FR-V02, NFR-01, NFR-02, NFR-03, NFR-16. None is marked complete by this preview.

```bash
cd frontend
node --test --test-concurrency=1 src/features/public/landing/landing.test.js src/components/navigation/publicShell.test.js src/components/ui/forms.test.js src/components/ui/foundation.test.js src/features/marketplace/marketplace.test.js
npm.cmd run lint
npm.cmd run build
node node_modules/prettier/bin/prettier.cjs --check src/features/public/LandingPage.jsx src/features/public/landing/discoveryModel.js src/features/public/landing/SectionHeading.jsx src/features/public/landing/HeroSection.jsx src/features/public/landing/DiscoveryCard.jsx src/features/public/landing/FeaturedOpportunities.jsx src/features/public/landing/FeaturedStudents.jsx src/features/public/landing/TrustSection.jsx src/features/public/landing/landing.css src/features/public/landing/landing.test.js
```

## Member 4 — Loading, empty, and error states

Reusable presentation is provided by:

- `frontend/src/components/ui/LoadingSpinner.jsx`
- `frontend/src/components/ui/Skeleton.jsx`
- `frontend/src/components/ui/ProgressIndicator.jsx`
- `frontend/src/components/feedback/LoadingState.jsx`
- `frontend/src/components/feedback/EmptyState.jsx`
- `frontend/src/components/feedback/ErrorState.jsx`

Their styles are scoped in `components/ui/states.css`. Existing Button, Card,
global tokens, marketplace screens, routing, and the separate How It Works
implementation are unchanged. This branch addresses Member 4's loading screens,
skeleton loaders, progress indicators, empty states, and recoverable error
presentation responsibilities. Related quality requirements: NFR-02, NFR-03,
NFR-16; the demonstration does not mark these SRS requirements complete.

| Component | Contract |
|---|---|
| LoadingSpinner | `label` defaults to Loading; standalone `role="status"` exposes this text. Use `decorative` when another message already announces the operation. Artwork is always hidden from assistive technology. |
| Skeleton | Decorative, noninteractive placeholders hidden from assistive technology. `variant`: `text` (default), `circle`, or `rectangle`. Text `lines` defaults to 3 and is bounded to 1–10. No fake content or focus targets. |
| ProgressIndicator | Visible `label` associated with native `<progress>` using generated ID or unique supplied `id`. Finite `value` is clamped between 0 and positive finite `max` (default 100). Omitted/nonfinite value means indeterminate, with no fabricated percentage. Invalid max falls back to 100. Updates are not independently live-announced. |
| LoadingState | `message` defaults to Loading content…; one atomic status message, decorative spinner, and optional skeleton (`showSkeleton`, default true). Keep this announcement outside the consumer's busy content container; set `aria-busy` on that separate container. |
| EmptyState | Named section with `title`, optional `description`, and decorative icon. Recovery button appears only for a function-valued `onAction`; `actionLabel` defaults to Clear filters. Supply a label and handler appropriate to the actual empty condition. No invented navigation. |
| ErrorState | Named section with `title`, optional `description`, decorative error icon, optional function-valued `onRetry`, and `retryLabel` (default Try again). `retrying` disables the action and exposes button busy state. `announce` defaults false; opt in to an alert only when appropriate, without a second competing announcement. It is not an error boundary and never renders raw exceptions or technical details. |
| Shared presentation | All accept `className`. EmptyState/ErrorState accept `headingLevel` 2, 3, or 4 (default/fallback 2) to fit the consuming page's hierarchy. Callers own data, recovery, focus after replacement, state transitions, and route access. |

```jsx
<LoadingState message="Loading results…" />
<div aria-busy={isLoading}>{/* Consumer-owned content */}</div>
<ProgressIndicator label="Example progress" value={25} />
<EmptyState
  title="No matching results"
  description="Try clearing your filters."
  onAction={clearFilters}
/>
<ErrorState onRetry={retry} retrying={isRetrying} />
```

These are design-system extensions using existing MIU red, white/neutral
surfaces, Inter typography, Card styling, Button focus/disabled behavior, and
installed Lucide icons. No dedicated loading/empty/error Figma frame was
confirmed in the prior approved style-guide review (`4:2454`); these components
are not claimed as exact Figma screen reproductions. Team visual review remains
necessary. Reduced-motion preferences disable spinner, skeleton, and
indeterminate-progress CSS animations; labels remain visible and meaningful.

### Demo page handover

`features/public/LoadingDemoPage.jsx` and `features/public/ErrorDemoPage.jsx`
are content-only page components intended for `/loading-demo` and `/error-demo`
inside the existing PublicLayout. **Member 1 must register both routes**; neither
URL is currently implemented by this branch. No application entry point or
extra HTML preview is added. Scoped page styles live in
`features/public/states/state-demos.css`.

Both pages explicitly disclose Phase 1 simulation and make no network requests.
Loading has Start loading, Advance 25%, Complete, and Reset controls, along with
separately labeled static appearance specimens. Advancing to 100% completes the
example. Error has Simulate error, working immediate Try again/Reset recovery,
and an empty example whose Clear filters action reveals one generic example
item. Reset restores the empty state. Removing a recovery button restores focus
to a persistent example control. Persistent status messages announce changes;
the demo does not also enable ErrorState's alert. Static specimens without
handlers deliberately have no action buttons. There are no artificial delays,
real backend failures, authentication flows, financial operations, or business
record fixtures.

### Verification and limitations

On 23 October 2026, 60 tests passed (13 new state tests and 47 existing tests).
Existing lint and Vite build passed. The default build still mounts the existing
catalogue; the new modules were exercised through SSR tests and browser imports,
not by silently registering application routes. New-source Prettier and
tracked/untracked whitespace checks passed. A separate production build of both
demo modules also passed using a temporary output directory, without modifying
the shared Vite configuration.

Headless Chrome checks covered 320, 390, 640, 768, 960, 1024, and 1440px in idle
and active loading/error states with no horizontal overflow. Mobile/desktop
screenshots were inspected. Checks exercised Start, advance to 100%, Complete,
Reset, error recovery, empty recovery, Enter/Space activation, Tab navigation,
visible keyboard focus, focus restoration, long unbroken text/action labels,
44px action heights, native progress labels/values in Chrome's accessibility
tree, and reduced-motion animation suppression. No runtime exceptions, console
errors, or failed HTTP responses occurred during successful browser checks.
Measured body text contrast on white was 7.56:1 and primary button text contrast
was 6.43:1; this is not an exhaustive accessibility audit.

Remaining: Member 1's actual route/layout integration, user visual approval,
screen-reader announcements, systematic zoom, other browsers, real touch devices,
and precise Figma geometry. Existing feature screens have not been migrated to
these primitives; their owners can adopt them without changing data contracts.

```bash
cd frontend
node --test --test-concurrency=1 src/components/feedback/states.test.js src/features/public/landing/landing.test.js src/components/navigation/publicShell.test.js src/components/ui/forms.test.js src/components/ui/foundation.test.js src/features/marketplace/marketplace.test.js
npm.cmd run lint
npm.cmd run build
```

## Related Documents

- [Design System](DESIGN_SYSTEM.md)
- [Frontend Architecture](../04-ARCHITECTURE/FRONTEND_ARCHITECTURE.md)
- [Coding Standards](../05-DEVELOPMENT/CODING_STANDARDS.md)
