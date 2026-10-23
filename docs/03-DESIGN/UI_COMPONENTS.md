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

| Component    | Responsibility                                               |
| ------------ | ------------------------------------------------------------ |
| Button       | Primary, secondary, outline, destructive and loading actions |
| Input        | Text, email, password, number and relevant validation states |
| Textarea     | Multiline content                                            |
| Select       | Selection control                                            |
| Checkbox     | Boolean choices                                              |
| Radio Group  | Exclusive choices                                            |
| Modal/Dialog | Focused decision or confirmation                             |
| Alert        | Informational and error messages                             |
| Toast        | Temporary feedback                                           |
| Badge        | Status and metadata labels                                   |
| Card         | Reusable content container                                   |
| Tabs         | Local section navigation                                     |
| Pagination   | Collection navigation                                        |
| Skeleton     | Loading placeholders                                         |
| Empty State  | No available content                                         |
| Error State  | Recoverable errors                                           |
| Spinner      | Operation in progress                                        |

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
  <Button loading={isSaving} onClick={handleSave}>
    Save draft
  </Button>
</Card>;
```

| Component | Props and behavior                                                                                                                                                                                                                                                                                                                                                                      |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button    | `variant`: `primary` (default), `secondary` (black), `outline`, `ghost` (neutral Cancel specimen), `destructive`. `type` defaults to `button`; set `submit` explicitly for forms. `disabled` and `loading` block activation; loading preserves the label and exposes `aria-busy`. `children`, `className`, native button attributes, event callbacks, and React 19 `ref` are forwarded. |
| Card      | `as`: `div` (default), `article`, or `section`. `children`, `className`, and native attributes are forwarded. Supply headings/accessible names for sections. It is a container, not an interactive replacement for a link or button.                                                                                                                                                    |
| Badge     | `variant`: `neutral` (default), `success`, `info`, `completed`, `warning`, or `danger`. Supply visible text through `children`; variants do not infer statuses, permissions, or business rules. Native span attributes and `className` are forwarded. No automatic live-region role.                                                                                                    |

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

| API                | Contract                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Shared field props | Supply a visible `label`. Optional `helperText`, `error` (message), `required`, `disabled`, and `id`. A required field shows an asterisk and uses native required semantics. IDs are generated with React `useId` when omitted. Caller-supplied IDs must be unique in the document.                                                                                                                                                                                                                                                                    |
| Feedback           | Helper text and error messages have associated IDs, merged with caller `aria-describedby`. A nonempty `error` sets `aria-invalid` even if the caller supplied false. Otherwise caller `aria-invalid` is preserved. The visible error icon and message avoid relying on color alone. There is no automatic alert/live region; announcement timing and submit/focus management belong to the consuming form.                                                                                                                                             |
| Input              | Native text-like input, `type="text"` by default. Supports email, password, number, search, and native constraints such as `min`, `max`, `step`, and `maxLength`. Use the dedicated Checkbox/RadioGroup for choices.                                                                                                                                                                                                                                                                                                                                   |
| Select             | Native select; provide `option`/`optgroup` children. Supports `value`/`onChange` or `defaultValue`, disabled options, and native `multiple`/`size`. Native option popup presentation and long selected-value display depend on the browser/OS.                                                                                                                                                                                                                                                                                                         |
| Textarea           | Native textarea; `rows={4}` by default, vertically resizable. Supports native length constraints.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Checkbox           | Native checkbox with a wrapping associated label; supports `checked`/`onChange` or `defaultChecked`.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Native forwarding  | Input, Select, Textarea, and Checkbox forward native control attributes, callbacks, React 19 `ref`, and `className` to the control. Do not mix controlled and uncontrolled props. These components do not own values or run application validation.                                                                                                                                                                                                                                                                                                    |
| RadioGroup         | Native fieldset/legend with same-name radio inputs. `options` contains unique string `value`, visible `label`, and optional `disabled`. Supports `name`, `value`/`onChange` or `defaultValue`, shared field props, ARIA feedback props, and fieldset `className`. `onChange` receives the native React change event. `id` is a prefix for option/feedback IDs. An omitted `name` defaults to that unique prefix. Whole-group disabling and individual disabled options are supported. The group does not forward arbitrary native input props or refs. |
| Field              | Shared rendering utility used by the controls, not a second input implementation. Its render-function `children` receives the associated `id`, `required`, `disabled`, `aria-describedby`, and `aria-invalid`. Internal `choice` and `group` modes render the checkbox label or fieldset/legend.                                                                                                                                                                                                                                                       |

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

## Related Documents

- [Design System](DESIGN_SYSTEM.md)
- [Frontend Architecture](../04-ARCHITECTURE/FRONTEND_ARCHITECTURE.md)
- [Coding Standards](../05-DEVELOPMENT/CODING_STANDARDS.md)
