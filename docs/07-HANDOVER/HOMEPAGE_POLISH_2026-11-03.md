# Homepage refinement ? 3 November 2026

Scope: homepage only, preserving layout, fictional records, navigation, language persistence and the shared in-memory theme. Requirements: FR-V01?FR-V05, NFR-01?NFR-03. No requirement is marked complete by this presentation work.

## Review and changes

| Before | After | Why |
| --- | --- | --- |
| Headline fades for 550ms then stays blank for 1100ms | 180ms fade directly into typing; 3600ms reading interval | Keeps the hero message available more consistently |
| Category picker passed a React fragment to translation and rendered raw labels | Translate display strings, retain category identifiers | Arabic labels without changing filtering contracts |
| Global dark placeholder overlapped the animated search hint | Homepage input-specific placeholder rules | Only one visible hint at a time |
| Repeated scroll entrances hid previously seen content | Reveal once per mount; observer stops watching revealed targets | Predictable return scrolling and less observer work |
| Section entrances lasted 1000ms and moved 96px | 280ms, 24px entrance; category reveals 240ms | Quicker orientation with less motion |
| Every hovered link/button was dimmed | Targeted button feedback gated to fine hover pointers | Maintains text contrast and avoids touch hover dimming |
| Informational trust cards lifted on hover | Static informational cards | Avoids suggesting a click action |
| Long content and translated controls could exceed intrinsic widths | Card/dialog wrapping, constrained homepage flex children, mobile navigation wrapping | Better narrow-screen resilience |

Reduced-motion rules and the pause control remain. Official artwork and hero video are unchanged. Search inputs now use 16px text and the mobile search keyboard action. No dependencies added.

## Verification

- Actual Chrome screenshots inspected English light/dark and Arabic light/dark hero, plus the Arabic category dropdown. The duplicate dark-mode placeholder was observed and corrected.
- Actual refresh confirmed light mode with Arabic retained.
- Mobile emulation exposed clipping; intrinsic sizing safeguards were added. Final mobile visual verification is still pending: the native capture repeatedly showed cropped/scaled browser views and cannot establish a clean viewport-wide result.
- Full automated suite: 340 tests, 339 passed, 1 failed. Existing ChatbotWidget.test.js calls App() directly; App uses useLayoutEffect, so this test throws an invalid hook dispatcher error. App and chatbot files were not modified.
- Lint and production build passed before final documentation. Existing approximately 773 kB application chunk warning remains.
- No physical-device performance, screen-reader, complete keyboard flow, isolated missing-image/long-record/empty-result browser matrix, or full route-navigation theme check claimed. Those remain follow-up verification work.

## Remaining review items

- Complete the 390px and 1440px English/Arabic light/dark matrix and inspect lower sections, modal previews and empty search results.
- Test missing portrait fallback and realistic long records in isolated fixtures; current work only hardens wrapping.
- Review continuous search-border and timeline decorations separately; the existing timeline still follows scroll in both directions.
- Correct the chatbot test harness in its own scope; do not remove application hooks to make a direct function call test pass.

Preview: http://localhost:5173/
All changes left uncommitted.
