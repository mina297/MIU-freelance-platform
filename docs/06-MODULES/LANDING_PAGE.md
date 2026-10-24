# Landing Page — Phase 1 frontend

Implemented at `/`, based on [MIU Freelance desktop, node 8:2656](https://www.figma.com/design/4OarPMFlQbiJI1Q1WxblcC/MIU-Freelancing-Platform--Copy-?node-id=8-2656).

Related requirements: P-01, FR-V01–FR-V04, NFR-01–NFR-03 and SR-09. This screen supports public discovery and entry to existing authentication. It does not complete the full marketplace or account requirements.

`frontend/src/features/public/` owns the page, scoped styles and fictional landing-only examples. Assets in `frontend/src/assets/figma/landing/` are downloaded originals from the frame; no temporary Figma URLs are used at runtime. Inter, Playfair Display and brand colors reuse the existing theme. The shared public header now uses Upwork-inspired Hire Talent and Find Work dropdowns, How it works, Sign In and Sign Up, with MIU branding retained (23 October 2026).

## Behavior

- Authentication return update (24 October 2026): successful registration opens a session immediately and successful registration/login returns to `/`. Active sessions show My workspace and Sign out in the header. The session demo disclosure and test-account selector are removed from the public page; fictional marketplace content remains disclosed.

### Integration with main — 24 October 2026

- Member 1's landing page replaces the unwanted Member 4 homepage at `/`.
- `LandingHeader` preserves the new navigation design without replacing the
  shared `PublicHeader` used by the remaining public pages and isolated previews.
- `PublicWebsite` renders one homepage header, main landmark and page-owned footer;
  other public routes retain `PublicLayout`. Signed-in users keep My workspace.
- Existing project creation, proposal submission/review, order summaries and role
  guards from main are preserved. Demo session controls remain collapsed below
  public content. Homepage examples remain fictional and separate from live mock
  marketplace stores; they are not links to real project/profile records.
- The retired `features/public/landing/` implementation and its obsolete tests
  are removed. Member 4's page preview now starts at About, not the old homepage.
- No commit or production authentication/payment behavior is introduced.

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

### Cinematic hero video — 24 October 2026

The homepage hero now layers locally bundled, muted looping collaboration stock
footage behind a burgundy readability overlay, a fine inset frame and the existing
headline/search/entry cards. A local JPEG poster renders immediately and remains
the fallback for reduced motion, data-saving connections, denied autoplay or
media failure. The clip is approximately 8 seconds, 720p, 2.65 MB. Source and
license credits are in `frontend/src/assets/hero/CREDITS.md`; this is stock
footage, not a depiction of MIU facilities or accounts.

`HeroVideo` connects to the existing Pause motion control. Video source loading
is deferred until motion is enabled and the video enters the viewport; playback
pauses when off-screen or when the document is hidden. Observers/listeners clean
up on unmount and preference changes. No network video request occurs during SSR,
under reduced motion, or on connections advertising Save-Data. The footage is
decorative and hidden from assistive technology; all meaningful content remains
HTML. Video playback lifecycle and fallback markup have automated coverage;
actual browser autoplay, cropping and mobile visual acceptance remain pending.

### Marketplace visual polish — 24 October 2026

The follow-up creative pass adds static, decorative skill notes on wide screens,
direct project/service catalogue entry cards below the hero search, section
heading accents, and a closing invitation linking to student/client registration.
The original section sequence and discovery interactions remain in place. These
additions use scoped CSS and existing Lucide icons, without new dependencies or
invented platform statistics. Entry cards stack on narrow screens; hover movement
respects both Pause motion and the system reduced-motion preference. Route tests
check both catalogue destinations and both registration entry links.

At Mina's request, the homepage retains its centered hero, section order,
overlapping panels, category carousel, timeline, search, previews and motion
controls while adopting the marketplace's burgundy/plum accents. The headline
combines bold sans-serif with an italic display line; warm blush surfaces,
clear mauve borders, outlined skill chips, tinted budget panels, portrait rings
and a burgundy footer give cards and sections stronger separation. Changes are
scoped to the landing page; shared navigation and marketplace behavior remain
unchanged. Existing responsive and reduced-motion rules are retained. Live
browser/mobile visual verification remains pending because no browser surface
is connected to this session.

Trust benefit cards lift 6px on hover with an MIU red border and a light shadow. The student showcase derives its featured student from numeric rating, then review count and stable ID; with three results the highest-rated student occupies the middle and is raised 24px on desktop. Fewer results retain a sensible ranked order; single-column mobile removes the elevation. The featured student's View profile button has a rotating red perimeter light, static when motion is paused/reduced. Preview behavior and fictional ratings are unchanged. The shared Sign Up button now uses the existing landing buttons' pill radius, including its focus state.

The same seamless lower-edge treatment applies to all four `OverlapSection` panels: no bottom border and no shadow below the lower edge. Existing surface/backdrop colors are retained; upper/side borders, rounded tops, side/top shadows and entrance motion remain intact. Nested project, profile and timeline cards are unaffected.

The category panel omits its bottom border and clips only the shadow below its lower edge, allowing that edge to merge with the white backdrop below. Its upper/side borders, rounded top, shadow above/along the sides and scroll entrance remain unchanged.

How it works, Featured jobs, Student talent and Trust now reuse `OverlapSection` for the category panel's overlapping presentation: full width, at least one viewport tall, 40px upper radii (28px mobile), square lower corners, a 24px overlap (16px mobile), and a 96px upward entrance. Each panel retains its existing surface color/gradient and content behavior; backdrops use existing blush, muted or white surfaces to distinguish the curved edges. IDs, search destinations, bookmarks and modal previews remain unchanged. Reveals replay on re-entry and respect Pause motion, reduced motion and keyboard focus. How it works recalculates line positions after its panel entrance settles. Live browser verification of the combined panel transitions remains pending.

Section anchor IDs live on the stable backdrop wrappers, so search and hash navigation do not measure the panel's temporary entrance transform.

The How it works backdrop is white, matching the category panel's white surface. Its own panel gradient and entrance animation are retained.

The white category panel sits inside a dedicated backdrop using `--color-miu-red-tint`, matching the hero. This highlights its rounded upper corners and the space behind its upward entrance without changing the panel's white surface or other sections.

The category section is presented as a full-page-width white panel with a light border and the existing card shadow. Its minimum height is 100svh on desktop and mobile, with content centered vertically and room to grow on short screens. Upper corners use a 40px radius (28px on mobile); lower corners are square. The panel overlaps the hero slightly and rises 96px over one second on each scroll entry, alongside the existing heading/card reveals. No scaling is applied, so the panel stays full width throughout its entrance. Keyboard focus, paused motion and reduced motion retain a stable visible panel. Colors and the remaining page sections are unchanged.

The category section heading uses its own `landing-category-section-heading` class to avoid inheriting the category dropdown's uppercase and muted text styles. "Explore your next direction." displays in the existing MIU black with normal sentence casing; its scroll reveal is retained.

The category section's "Explore your next direction" heading and arrow controls use the same 800ms fade/upward entrance as the How it works heading. The existing observer replays the entrance on each visit. Keyboard focus keeps controls visible, while paused/reduced motion displays the heading immediately.

How it works reveals its heading, cards, number badges and connectors progressively as the section is reached. The center line starts at the measured center of the first number badge and ends at the measured center of the last, without extra extensions. It draws only to the current scroll position, rather than showing its full rail ahead of time. Reveals reset when scrolling back above their thresholds and replay on return. Pause motion and reduced-motion modes show all content immediately. Badge positions are measured on layout changes even when motion is disabled, keeping the line aligned on desktop and mobile.

How it works uses more compact cards: 24px desktop padding (20px on mobile), 12px internal gaps, and 220px minimum timeline rows that grow with content. The vertical gap between steps is 48px on desktop and 32px on mobile. The scroll-driven line continues to measure actual step centers after layout changes.

Category cards measure 260px wide with a 270px minimum height on desktop, and 230px wide with a 250px minimum height below 700px. This modest size increase retains the existing carousel navigation, spacing and visual styling.

Category navigation hides the track scrollbar while retaining native scrolling. Mouse hover within the left/right edge zones scrolls toward that edge, with speed increasing near the boundary. Hover scrolling stops in the center, at either end, on pointer leave, on direct interaction, when the tab loses focus, or when motion is disabled. Scroll snapping is suspended only during hover movement. Touch swipe, trackpad, keyboard focus and arrow buttons remain available; reduced-motion and Pause motion disable automatic edge scrolling. Animation frames and listeners are cleaned up on unmount.

User-facing "demo" wording is replaced with concise prototype or neutral wording (23 October 2026), including result counts and accessible search names. The fictional-content disclosure remains visible; discovery behavior is unchanged.

Automated route tests cover landing sections, registration/catalogue entry links, accessible search/dialog markup, and combined search/category/empty results. Existing authentication, role and marketplace tests remain part of `npm test`.

Scroll progress tests cover sequential step activation, bounds, reverse scrolling and viewport changes. Static markup checks cover the separate category section, scrolling controls, semantic step list and readable motion-free rendering. The new effects still require live browser visual and interaction verification; no browser surface was connected during this update.

Browser checks and any remaining limitations are recorded in [Known Issues](../07-HANDOVER/KNOWN_ISSUES.md). Future work includes service catalogue integration, real profile/project record integration, approved policies and complete support workflows.
