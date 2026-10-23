# Landing Page — Phase 1 frontend

Implemented at `/`, based on [MIU Freelance desktop, node 8:2656](https://www.figma.com/design/4OarPMFlQbiJI1Q1WxblcC/MIU-Freelancing-Platform--Copy-?node-id=8-2656).

Related requirements: P-01, FR-V01–FR-V04, NFR-01–NFR-03 and SR-09. This screen supports public discovery and entry to existing authentication. It does not complete the full marketplace or account requirements.

`frontend/src/features/public/` owns the page, scoped styles and fictional landing-only examples. Assets in `frontend/src/assets/figma/landing/` are downloaded originals from the frame; no temporary Figma URLs are used at runtime. Inter, Playfair Display and brand colors reuse the existing theme. The shared public header now uses Upwork-inspired Hire Talent and Find Work dropdowns, How it works, Sign In and Sign Up, with MIU branding retained (23 October 2026).

## Behavior

- The Hire/Work segmented toggle switches discovery mode and resets filters. Work searches job title, client, description and skills; Hire searches the fictional students' names, study and skills. Both combine text with the selected category. Search scrolls to the relevant results section; empty results offer recovery. Student category tags are landing-only metadata, not a shared profile contract.
- All categories opens a styled picker with a selected checkmark. The reusable dropdown supports click, Enter/Space, Tab, outside-click dismissal and Escape with focus restoration. Category selection updates the search input state; Search applies it. Category cards apply filters immediately.
- Bookmarks are local page state with pressed semantics and a screen-reader status message. They reset on unmount/refresh and are separate from catalogue bookmarks.
- The navigation's Find Work dropdown links to `/projects`, student registration and How it works. Hire Talent links to landing student previews, `/services` and client registration. The contextual Join to hire/work action follows the toggle's selected role. Posting still starts at client registration; no publishing workflow is introduced.
- View job and View profile open native modal preview dialogs with close/Escape support and focus restoration. Design examples do not masquerade as shared marketplace records.
- Footer anchors open the corresponding landing sections. Help, Contact and policy buttons open labeled prototype information, not approved policy documents or a support submission.
- Services remains available in the shared header and footer; its catalogue remains a placeholder.

## Transparency and design adaptations

Design dates, names, ratings and club briefs are fictional examples, visibly disclosed before the featured cards. Verification/review claims have a Phase 1 qualification. No account, biometric, payment, support or review data is collected. Currency uses the centralized EGP formatter. No SRS requirement is automatically marked complete.

The desktop layout retains the centered hero, alternating timeline, three-column jobs/student/trust sections and dark footer. At narrow widths, the search wraps, timeline becomes single-sided and content cards stack. Responsive widths and focus styling supplement the desktop-only reference. The original logo's proportions are preserved.

### Search and scroll presentation update — 23 October 2026

- The search field cycles a decorative typewriter hint through Software development, Design, Video editing, Content writing, Translation and Digital marketing. Hints never become input values or submitted filters; the accessible input label stays stable. The hint hides during focus or while text is entered. Search includes category names and their display labels, so typing Software development finds the existing Development examples. These are illustrative skill areas; categories without fictional records still produce an empty result.
- The search surface has a rotating red perimeter light and softer shadows. Its category menu remains unobstructed.
- The query input uses the short placeholder "Search" and a neutral keyboard-focus underline instead of a red input outline. Rotating examples use the same muted gray as the placeholder, without the "Try" prefix. The surrounding search surface keeps its perimeter animation.
- Categories occupy their own section immediately after the hero. Seven horizontally scrollable cards place the name at the top and a related Lucide icon at the center. Arrow buttons, native touch/trackpad scrolling and keyboard focus support navigation. IntersectionObserver replays the left-to-right stagger whenever cards leave and re-enter view, including when returning to the section without refreshing. Reduced-motion and paused-motion modes keep content visible. Category identifiers and search behavior are unchanged.
- How it works uses three alternating cards, red gradient number badges with red shadows, and perspective/depth entrance motion. A requestAnimationFrame-throttled scroll measurement fills the middle line and moves its light toward each node. Each card reveals when reached, then its red border orbits while it is the active step. Card reveals follow their scroll thresholds in both directions; the active light follows current scroll position. ResizeObserver recalculates positions as layout changes.
- The Pause motion control stops automatic effects and presents readable static content. System reduced-motion preferences do the same automatically, with a static search example and all cards/steps visible. Without observers, category content stays visible. Timers, observers and listeners clean up on unmount.

## Verification

The category section heading uses its own `landing-category-section-heading` class to avoid inheriting the category dropdown's uppercase and muted text styles. "Explore your next direction." displays in the existing MIU black with normal sentence casing; its scroll reveal is retained.

The category section's "Explore your next direction" heading and arrow controls use the same 800ms fade/upward entrance as the How it works heading. The existing observer replays the entrance on each visit. Keyboard focus keeps controls visible, while paused/reduced motion displays the heading immediately.

How it works reveals its heading, cards, number badges and connectors progressively as the section is reached. The center line extends 56px beyond each end node and draws only to the current scroll position, rather than showing its full rail ahead of time. Reveals reset when scrolling back above their thresholds and replay on return. Pause motion and reduced-motion modes show all content immediately. Measurements continue to follow actual responsive card positions.

How it works uses more compact cards: 24px desktop padding (20px on mobile), 12px internal gaps, and 220px minimum timeline rows that grow with content. The vertical gap between steps is 48px on desktop and 32px on mobile. The scroll-driven line continues to measure actual step centers after layout changes.

Category cards measure 260px wide with a 270px minimum height on desktop, and 230px wide with a 250px minimum height below 700px. This modest size increase retains the existing carousel navigation, spacing and visual styling.

Category navigation hides the track scrollbar while retaining native scrolling. Mouse hover within the left/right edge zones scrolls toward that edge, with speed increasing near the boundary. Hover scrolling stops in the center, at either end, on pointer leave, on direct interaction, when the tab loses focus, or when motion is disabled. Scroll snapping is suspended only during hover movement. Touch swipe, trackpad, keyboard focus and arrow buttons remain available; reduced-motion and Pause motion disable automatic edge scrolling. Animation frames and listeners are cleaned up on unmount.

User-facing "demo" wording is replaced with concise prototype or neutral wording (23 October 2026), including result counts and accessible search names. The fictional-content disclosure remains visible; discovery behavior is unchanged.

Automated route tests cover landing sections, registration/catalogue entry links, accessible search/dialog markup, and combined search/category/empty results. Existing authentication, role and marketplace tests remain part of `npm test`.

Scroll progress tests cover sequential step activation, bounds, reverse scrolling and viewport changes. Static markup checks cover the separate category section, scrolling controls, semantic step list and readable motion-free rendering. The new effects still require live browser visual and interaction verification; no browser surface was connected during this update.

Browser checks and any remaining limitations are recorded in [Known Issues](../07-HANDOVER/KNOWN_ISSUES.md). Future work includes service catalogue integration, real profile/project record integration, approved policies and complete support workflows.
