# Branded startup loading — 27 October 2026

## Scope and ownership

Requested by Mina on `Loading-page`. Implements shared loading presentation
(Member 4) and application startup integration (Member 1) under the team leader's
instruction. Requirements: FR-X02, NFR-02, NFR-03 and NFR-16. It does not mark a
complete SRS workflow delivered or change permissions or Phase 1 business rules.

## Behavior

- Refreshing or directly opening any main application route receives a branded
  HTML startup screen while the application bundle loads.
- The first successful React commit removes it immediately. There is no minimum
  display duration, fake percentage, or delay added to fast page navigation.
- A module-load or initial-render failure exposes a localized reload button.
  After 15 seconds, an otherwise pending startup offers reload while continuing
  to wait. All startup listeners and its timer are removed on successful mount.
- If recovery had keyboard focus when startup finishes, focus moves into the
  newly mounted page. A no-JavaScript explanation replaces the loader when
  scripting is disabled.
- Fresh document loads retain light mode. The saved language selects English or
  Arabic before paint; the startup script itself writes no browser storage.
- `PageLoadingScreen` provides a theme-aware, localized Suspense fallback inside
  the existing providers. Routes currently load eagerly; ordinary synchronous
  navigation therefore does not show a fabricated loading screen.
- `/loading-demo` includes a permanently visible, explicitly labeled appearance
  preview. Existing spinner, skeleton and manual progress examples remain.

## Design

Original university artwork sits on a fitted warm plaque within an offset frame.
Warm neutral or charcoal surfaces, fine borders, restrained crimson and an
indeterminate track follow the premium marketplace identity. Supporting copy is
localized, decorative artwork is silent, and reduced motion disables the sweep.
Static startup HTML and the React specimen share `page-loading.css`; their brief
startup wording must be kept aligned when translations change.

## Validation

40 focused tests passed: startup readiness/cleanup, slow-start recovery, module
and render failures, reload, keyboard-focus recovery, branded Arabic presentation,
existing feedback components, dictionary coverage, all registered route/theme
presentations and public/auth/proposal rendering. These are automated checks,
not a visual browser review.

Final lint, production build and whitespace checks passed. The existing build
warning about a JavaScript chunk over 500 kB remains; this task does not refactor
route code splitting.

Browser inspection was blocked by Computer Use because it could not establish
the current browser URL sufficiently to enforce its policy. Desktop/mobile
screenshots, actual throttled-network loading and assistive-technology acceptance
remain pending. Inspect `/loading-demo` in both languages/themes; reload any main
route with browser network throttling to inspect genuine startup.

No dependencies, branches, commits, pushes or merges are introduced by this task.
