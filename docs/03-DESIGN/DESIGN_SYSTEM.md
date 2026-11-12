
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

### Application dark palette — 25 October 2026

The shared `ThemeProvider` above routing owns one in-memory light/dark choice.
Every fresh page load starts light. Internal navigation preserves the selected
theme; refreshing resets it. No local/session storage or OS appearance lookup
is used. The root `data-theme` attribute also covers native top-layer dialogs and
portal content mounted beneath the document element.

| Token | Value | Purpose |
|---|---|---|
| `theme-canvas` | `#141518` | Deep charcoal canvas |
| `theme-subtle-surface` | `#1b1c21` | Inset and secondary surfaces |
| `theme-surface` | `#25262c` | Raised cards |
| `theme-field` | `#191a1f` | Input surfaces |
| `theme-overlay` | `#2b2c33` | Dropdowns and dialogs |
| `theme-hover` | `#303139` | Neutral interaction and decoration |
| `theme-divider` | `#48454f` | Card boundaries and separators |
| `theme-accent-surface` | `#38232d` | Burgundy selection and accent surfaces |
| `theme-border` | `#89838f` | Control boundaries with visible contrast |
| `theme-text` | `#f4f1f3` | Primary off-white text |
| `theme-muted-text` | `#bfbac3` | Supporting text |
| `theme-accent` | `#ffa9bd` | Readable rose accents on dark surfaces |

Primary actions retain crimson fills with white text. Keyboard focus uses
`#ffc3d2`; logos retain their original colors on fitted warm off-white backings
in dark mode and dark footers. A 6px radius, restrained inset edge and soft shadow
replace the former protruding white halo. Backings stay within existing image
bounds, preserving layout dimensions. Light headers retain transparent logos. The light palette
remains the existing design through explicit original-color fallbacks. Success,
warning, information and danger have separate readable text/surface pairs.
`frontend/src/theme/theme.css` owns shared values; homepage aliases refer to
these values. See [Global theme handover](../07-HANDOVER/GLOBAL_THEME_2026-10-25.md)
for controls, route coverage and verification limits.

The 26 October repair loads shared CSS directly from `ThemeProvider`. Do not
map decorative rings, card separators and input outlines to the same token.
Keep translucent artwork translucent. Homepage styles must not override global
placeholder behavior or shared headers. Standalone appearance controls reserve
space in normal flow; shared layouts retain their header control.

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

Use **Hire Talent** as the design reference for every new dropdown unless the project team explicitly requests a different design. Reuse the shared `Dropdown` component and its panel and item styles for the surface, border, shadow, spacing, rounded corners and hover feedback. Keep the trigger and panel connected so the menu closes immediately when the mouse leaves both. Support click, touch, keyboard activation and Escape.

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

The English/Arabic interface implementation and draft translation approval
boundaries are documented in [Localization](LOCALIZATION.md). English is the
first-visit default; language persists independently of the in-memory theme.

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

## Homepage motion refinement ? 3 November 2026

Homepage entrances reveal once per mount, using small travel and 240?280ms transitions. Returning to viewed content must not hide it. Keep informational cards visually static; reserve hover feedback for interactive elements and gate it to fine hover pointers. Search hints must remain mutually exclusive with placeholders in both themes. Preserve reduced-motion and pause behavior. See [homepage review](../07-HANDOVER/HOMEPAGE_POLISH_2026-11-03.md) for verification gaps.

## Shared interface motion

The language picker uses the shared dropdown and marks the active language.

Non-homepage shared controls use interface-motion.css, loaded by ThemeProvider. Pointer-opened Dropdown panels and native Modal dialogs progressively enter with 180ms opacity/transform transitions. Shared Button and dashboard sd-button controls use 120ms fine-pointer press feedback; disabled, aria-disabled and busy controls are excluded. Tabs and pagination use brief color feedback without moving content. Keyboard interactions and reduced-motion preferences disable these transitions. Exits remain immediate. No route, table, financial value or informational-card animation is added. Homepage styles remain independent.

Custom feature controls that do not use these classes are not covered. Browser visual validation remains pending; automated component checks do not establish animation smoothness.

Mina requested more visible motion: non-homepage menus/dialogs now enter over 240ms from 16px/0.96 scale. Eligible fine-pointer buttons lift 3px on hover and compress to 0.96 on press, with a subtle shadow. Service detail-link arrows move toward the reading direction. Reduced-motion, disabled/busy exclusions and immediate keyboard behavior remain. These values supersede the earlier subtle settings. Browser visual validation remains pending.

Visual correction - 4 November 2026: removed button lift, added shadows, press compression and diagonal arrow movement at Mina's request. Controls keep their original geometry with brief color transitions. Menus and dialogs use a restrained 6px/180ms entrance without scaling. These values supersede the stronger settings above. Keyboard and reduced-motion transitions remain disabled.


## Navigation placement - 5 November 2026

Authenticated application routes share a top/side navigation shell. The account menu owns the placement, theme and language controls; narrow screens use a Modal drawer. Route metadata determines permitted links; only navigation placement persists in localStorage. Dashboard sections remain contextual navigation. See [implementation and verification limitations](../07-HANDOVER/NAVIGATION_LAYOUT_2026-11-05.md).


### Header language control alignment - 5 November 2026

Header language selectors display the selected language on one line aligned with adjacent actions. Their associated label remains available to screen readers. Account-menu and form labels retain their visible presentation. Header controls use a 44px minimum height and 16px text; the Arabic draft notice remains visible below without changing alignment. Browser visual verification remains pending.

Header language controls now use compact EN / AR labels in a 76px-wide selector with a subtle border and 44px touch target. Language state, persistence and accessible label association are unchanged.

### Homepage header refinement - 5 November 2026

The homepage header uses reduced logo/type size, tighter spacing, quieter dropdown surfaces and a compact account disclosure for workspace/sign-out actions. EN/AR and theme controls remain visible. Existing visitor links and responsive navigation remain available. Uses the existing keyboard/outside-click disclosure behavior; no new dependency. Browser visual verification remains pending.

### Homepage navigation redesign - 5 November 2026

Supersedes the earlier sizing refinement: a raised rounded navigation bar now separates the MIU brand, a softly tinted destination group, and compact utilities. EN/AR stays visible; appearance opens from a settings icon. Below 1180px, a native Modal drawer replaces the navigation row and contains all existing destinations and account actions. The drawer supports Escape, focus containment/restoration and backdrop dismissal through the shared Modal. Both color themes and RTL use semantic tokens and logical spacing. Old homepage header breakpoint overrides were removed. Build and lint passed; route/theme/language rendering checks cover the new controls. Visual browser verification remains pending because Chrome was minimized and the available computer-use interface could not bind to it.


### Shared navigation surfaces (5 November 2026)

In dark mode, a rose drop shadow follows the MIU anniversary artwork wherever the logo appears, including the dashboard export. The sign-up and sign-in primary buttons are full-width crimson with a white arrow and the same 15px corner radius as the Google buttons. Registration checkboxes use pale rose fills and red checkmarks.

The shared public header returns to the top of the viewport as soon as the visitor scrolls upward. It hides while scrolling down beyond the header and stays visible while a menu is open or a header control has visible keyboard focus. Reduced motion and the homepage motion toggle skip the sliding transition.
Routed public pages reuse the homepage floating header, grouped destinations and compact utilities. Signed-in navigation uses matching surfaces and retains role-specific destinations and top/side preference. The application drawer breakpoint is 1280px; public navigation uses 1180px. Each route renders one language control and one theme control.


### Homepage hero reference update — 12 November 2026

The current user direction uses warm ivory, white and crimson for the homepage hero, with a stable sans-serif “Your Talent Opens Doors.” headline and a reference-derived MIU miniature building. Live glass cards illustrate a five-step freelance journey. This is scoped to P-01; shared marketplace colors and the original homepage navbar/search controls remain in place. Motion has a complete static fallback and does not capture scrolling. See [Landing Page](../06-MODULES/LANDING_PAGE.md) for behavior, Phase 1 disclosures and verification limits.


The subsequent 12 November user reference corrects the hero palette to neutral rose-white `#f1e7e8`, burgundy `#300510` and MIU red `#b0001e`. This replaces the earlier beige/ivory tint for P-01 only; the original navbar and functional search are preserved.


Latest 12 November refinement: the reference-derived rose image now supplies the hero colors directly; the temporary SVG grading filter is removed. The homepage header adopts separate brand, central glass navigation pill and rounded utility/account controls, using 10px backdrop blur, translucent white rims and an opaque reduced-transparency fallback. All existing navbar labels, destinations and behavior are preserved. The earlier full-width glass navbar shape is superseded on P-01.


Latest user color choice — 12 November 2026: restore the original beige/ivory hero plate and `#faf6f0` backdrop, with warm ivory glass tints. Retain the existing separated glass navbar shape and its complete navigation content. This supersedes the temporary rose-white hero palette.
