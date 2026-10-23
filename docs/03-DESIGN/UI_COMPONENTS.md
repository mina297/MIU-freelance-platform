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
