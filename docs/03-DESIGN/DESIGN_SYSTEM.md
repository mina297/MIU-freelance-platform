
---
title: Design System
type: design-system
status: draft
tags: [MIU, design-system, UI]
---

# MIU Freelance Platform — Design System

## 1. Purpose

Define a consistent visual language for the platform.

The approved Figma design remains the primary visual reference. This document records implementation guidance and must be updated with final design tokens.

## 2. Design Direction

The interface should feel:
- Professional
- Modern
- Trustworthy
- Accessible
- Clear
- University-appropriate
- Consistent across roles

**Hero headline:** Your Talent. Real Opportunities.

For the implemented P-01 landing page, the supplied “MIU Freelance desktop” frame (`8:2656`, inspected 23 October 2026) uses **Find real work. Build your reputation.** Its Inter body type, Playfair Display hero, `#b91c2b` primary, `#fdf2f3` blush and `#f8f8f9` muted surfaces reuse the existing frontend theme. The current shared public navigation remains in place. See [Landing Page](../06-MODULES/LANDING_PAGE.md) for prototype behavior and intentional adaptations.

## 3. Branding

### Implemented premium theme — team direction, 24 October 2026

Mina requested that all existing interfaces adopt the Member 2 marketplace's
premium visual language. This is an implementation adaptation authorized by the
team leader, not a claim that the source Figma frames have been revised.

The shared theme lives in `frontend/src/styles/premium-theme.css`, imported by
`index.css`. Tailwind semantic colors expose the same palette to utility-based
profile, review and support components.

| Token | Value | Purpose |
|---|---|---|
| `surface-page` | `#efe9ed` | Warm page backdrop |
| `surface-muted` | `#f5eff3` | Secondary surfaces and table headers |
| `ink-primary` | `#35212c` | Headings and primary text |
| `ink-secondary` | `#6a5864` | Body and supporting text |
| `border-soft` | `#c7b3bf` | Clearly separated cards and panels |
| `border-control` | `#9f8191` | Input boundaries |

Cards use a 20px radius and restrained plum shadows; form fields and shared
buttons use 14px radii. Dashboard and information-page headers use dark burgundy
gradients, while authentication, profiles and support retain lighter blush
surfaces. Financial summaries use the dark treatment. Semantic success, warning,
error and information colors retain their meaning. MIU logos retain their aspect
ratio and original colors. The marketplace and home retain their distinctive
compositions within this shared palette.

Existing navigation, guards, data, validation, loading/empty/error states, focus
behavior and responsive structures are preserved. This covers implemented
interfaces and styles routing placeholders without implementing their planned
features. See the [premium UI handover](../07-HANDOVER/PREMIUM_UI_ALIGNMENT_2026-10-24.md)
for coverage, verification and the remaining browser acceptance work.

The planned visual identity uses MIU-inspired colors.

### Branding Rules

- Preserve the official MIU anniversary logo's original proportions and colors.
- Do not stretch, recolor, or reconstruct the logo inaccurately.
- Do not claim university approval that has not been granted.
- Use the approved Figma assets when available.

### Color Tokens

Final hex values must be taken from the approved Figma styles.

Suggested token names:

| Token | Intended Use |
|---|---|
| `primary` | Primary brand actions |
| `primary-hover` | Interactive hover state |
| `background` | Page background |
| `surface` | Cards and panels |
| `surface-muted` | Subtle sections |
| `text-primary` | Main text |
| `text-secondary` | Supporting text |
| `border` | Dividers and controls |
| `success` | Successful status |
| `warning` | Attention required |
| `danger` | Errors and destructive actions |
| `focus` | Keyboard focus indicator |

These are semantic names, not approved color values.

## 4. Typography

Use the typography family approved in Figma.

Establish consistent levels:
- Display heading
- Page title
- Section heading
- Card heading
- Body
- Supporting text
- Caption

Text must remain readable at mobile sizes.

Use correct fonts and spacing for any supported Arabic interface.

## 5. Spacing

Prefer a consistent spacing scale such as:
- 4px
- 8px
- 12px
- 16px
- 24px
- 32px
- 48px
- 64px

Actual spacing should follow approved Figma specifications.

## 6. Layout

### Desktop
Responsive multi-column layouts with appropriate maximum content widths.

### Tablet
Reduced columns and adapted navigation.

### Mobile
Single-column layouts for most content, readable forms, and touch-friendly controls.

Avoid horizontal overflow.

## 7. Components

Common interface components include:
- Buttons
- Inputs
- Textareas
- Selects
- Search
- Cards
- Badges
- Alerts
- Dialogs
- Tables
- Tabs
- Pagination
- Navigation
- Profile elements
- Order status indicators
- Loading skeletons
- Empty states
- Error states

See [UI Components](UI_COMPONENTS.md).

## 8. Visual Interaction Rules

- Hover states should be noticeable but subtle.
- Focus indicators must remain visible.
- Animations should not distract from essential tasks.
- Loading indicators should communicate progress.
- Buttons must have disabled and loading variants.
- Destructive actions require confirmation when appropriate.

### Optional Effects

Subtle button glow and custom desktop cursor effects are optional enhancements.

Do not compromise usability or accessibility to include them.

## 9. Accessibility

Target WCAG 2.1 AA where practical.

Important requirements:
- Keyboard accessibility
- Logical tab order
- Visible focus
- Meaningful labels
- Contrast
- Alternative text
- Accessible dialog behavior
- Understandable errors
- Reduced-motion considerations

## 10. Localization

The interface should accommodate translation.

Design for:
- Different text lengths
- Right-to-left layout when applicable
- Consistent EGP values
- Preserving original message content
- Correct alignment and directionality

## 11. Status Presentation

Use consistent labels and visual treatments for:
- Pending
- Approved
- Rejected
- Active
- Suspended
- In Progress
- Delivered
- Completed
- Disputed
- Refunded
- Failed

Color must not be the only indication of status.

## 12. Design Review Checklist

- [ ] Matches approved Figma
- [ ] Consistent branding
- [ ] Consistent typography
- [ ] Responsive layout
- [ ] Accessible controls
- [ ] Correct interactive states
- [ ] Readable content
- [ ] No unnecessary visual effects
- [ ] No broken or distorted assets

## Related Documents

- [Pages and Routes](PAGES_AND_ROUTES.md)
- [UI Components](UI_COMPONENTS.md)
- [Frontend Architecture](../04-ARCHITECTURE/FRONTEND_ARCHITECTURE.md)
