
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

## Member 4 — HowItWorksSection

`frontend/src/features/public/components/HowItWorksSection.jsx` is a static,
English landing-page section with no required props. Import it inside the
future landing page, below that page's primary heading. It uses `useId` to
associate its section heading, and an ordered list preserves the step order.
It does not submit jobs/proposals or create reviews.

Visual references: Figma desktop section `8:2703` and mobile section `8:3000`
in file `4OarPMFlQbiJI1Q1WxblcC`. The three descriptions are copied from those
approved frames. Existing brand/font tokens are reused; neutral colors are
scoped locally rather than changing shared global CSS.

The six original SVG exports were compared: desktop icons have 22px geometry,
mobile icons have 21px geometry, and both retain a 1.7px stroke. They therefore
remain separate unmodified assets, rendered at their original dimensions.

Desktop uses alternating cards and a decorative timeline. Below 1200px, cards
are stacked; this breakpoint is an implementation choice because no tablet
frame is supplied. At 1440px the section has 120px horizontal/72px vertical
padding; at 390px it has 20px horizontal/56px vertical padding. Static content
does not need simulated loading, error, or empty states.

### Isolated development preview

With the existing dependencies installed, run from `frontend/`:

```bash
npm run dev
```

Open `/how-it-works-preview.html` on the URL printed by Vite. That HTML entry
imports `src/features/public/preview/HowItWorksPreview.jsx` directly, so no
application routing, `App.jsx`, or shared Vite configuration is changed.
Vite's default production build targets `index.html`; this development preview
is not included in that default build. It is not the `/how-it-works` route.

Related requirements: P-01 (partial landing presentation), NFR-02 and NFR-03.
This section alone does not satisfy NFR-01's two-marketplace discovery goal.
Service-flow copy and the full information page remain separate work.

Verification status (22 October 2026): dependencies were successfully installed
with `npm.cmd ci` using the existing lockfile. The eight existing Node
marketplace tests, `npm.cmd run lint`, `npm.cmd run build`, and
`git diff --check` passed. The marketplace tests do not test this section.
Local SVG dimensions/strokes and preview import paths were checked. The Vite
development server served the preview HTML and entry module with HTTP 200,
and the project owner approved the initial visual preview. The successful
default production build covers the application, not this isolated preview.

The owner approved changing only the section-local summary text color from
Figma's `#8D929A` to `#707780` for accessibility. Against the section's white
background (`#FFFFFF`), its calculated WCAG contrast ratio is 4.53:1, meeting
the 4.5:1 AA threshold for normal text. Global tokens and other components are
unaffected. This calculated color check is not a full accessibility audit.

Systematic responsive and breakpoint checks, zoom/text-resizing checks,
screen-reader checks, cross-browser checks, and precise Figma geometry
comparisons remain unverified. Initial visual approval does not establish
that these checks passed. On PowerShell systems blocking `npm.ps1`, use
`npm.cmd run dev`.

## Related Documents

- [Design System](DESIGN_SYSTEM.md)
- [Frontend Architecture](../04-ARCHITECTURE/FRONTEND_ARCHITECTURE.md)
- [Coding Standards](../05-DEVELOPMENT/CODING_STANDARDS.md)
