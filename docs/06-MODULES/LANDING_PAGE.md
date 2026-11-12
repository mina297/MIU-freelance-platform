# Landing Page — Phase 1 frontend

Implemented at `/`, based on [MIU Freelance desktop, node 8:2656](https://www.figma.com/design/4OarPMFlQbiJI1Q1WxblcC/MIU-Freelancing-Platform--Copy-?node-id=8-2656).

Related requirements: P-01, FR-V01–FR-V04, NFR-01–NFR-03 and SR-09. This screen supports public discovery and entry to existing authentication. It does not complete the full marketplace or account requirements.

`frontend/src/features/public/` owns the page, scoped styles and fictional landing-only examples. Assets in `frontend/src/assets/figma/landing/` are downloaded originals from the frame; no temporary Figma URLs are used at runtime. Inter, Playfair Display and brand colors reuse the existing theme. The shared public header now uses Upwork-inspired Hire Talent and Find Work dropdowns, How it works, Sign In and Sign Up, with MIU branding retained (23 October 2026).

## Behavior

### Shared dark mode — 25 October 2026

Mina expanded the homepage theme to all existing interfaces. `HomepageTheme.jsx`
now consumes the shared `ThemeProvider` above the router; it owns no independent
theme state. Every fresh document starts light, while internal route navigation
preserves the selected theme. No browser storage or OS appearance preference is
consulted. The original light layout and homepage interactions are preserved.

`homepageTheme.css` retains composition-specific refinements for the hero,
overlapping panels, timeline, search, cards, dialogs and footer. Its palette
aliases resolve to the shared semantic tokens. The common `ThemeToggle` lives
in the header, has pressed semantics and keyboard focus, and respects reduced
motion. Official logo artwork retains its colors on a light plaque.

See [Global theme handover](../07-HANDOVER/GLOBAL_THEME_2026-10-25.md) for
application-wide coverage, automated evidence and pending browser checks.

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

### Animated MIU hero — 9 November 2026

Latest full-width fit: the original artwork now fills the entire hero image area with SVG `xMaxYMid slice` and its original `0 0 1678 937` viewBox. This supersedes the expanded-viewBox/contain experiments below. There are no letterbox bands, separate pink padding or blurred image copies: the source image itself covers the available area, cropping at the edges when aspect ratios differ. Right alignment favors the building on narrow screens. All original animation layers share the same coordinate system and crop. The current hero height and search controls are preserved.

Latest height adjustment: the desktop hero minimum height is now `clamp(490px, 40vw, 780px)`, with slightly smaller vertical padding. These values supersede the earlier height refinement below; mobile sizing remains unchanged.

Internal scale follow-up: expanded the SVG viewBox by 8% around its center, making the building, conveyor and synchronized animation layers approximately 7.4% smaller within the existing image area. The outer SVG dimensions, hero height, text and search controls are unchanged by this follow-up.

Height refinement: the desktop hero uses `clamp(520px, 43vw, 830px)` minimum height and reduced vertical padding. The illustration now fits inside that same area with SVG `xMidYMid meet` instead of filling and cropping with `slice`, making the internal design smaller without shrinking the container again. Theme-specific backdrop colors fill any spare space. The shared SVG coordinate system preserves artwork proportions and animation alignment. The narrow-screen scene and control layout retain their existing sizing.

The MIU building illustration fills the desktop hero, with the heading, search
and entry links layered over the lower-left area beneath the conveyor. On narrow
screens the full scene remains visible at the top, and the controls overlap its
lower edge and continue onto the background below. The homepage navigation
overlays the top of the illustration with a transparent glass bar. A shared SVG coordinate
system keeps the artwork, conveyor, doorway and coin aligned as the scene
resizes. The theme toggle selects matching day and night artwork for both
states of the sign. Both themes use the same animation and gold coin.

The unlit sign holds for two seconds, then the lit artwork reveals the red
letters and their reflection. Three illustrative design, code and video
deliverables pass along the conveyor and disappear behind the building.
The first delivery's arrival time triggers the sliding doors. The supplied
gold coin emerges shortly after opening begins. It is a decorative symbol for
compensation. Marketplace prices continue to use EGP.

The sequence runs once when the landing page opens. Pause motion and reduced
motion show the lit still image. Resume motion restarts the sequence. The
artwork is hidden from assistive technology, and the heading, search and
catalogue links remain available throughout.

### Animated hero headline — 24 October 2026

The follow-up headline treatment cycles four concise messages: “Great ideas
deserve great talent.”, “Your skills. Your next opportunity.”, “Find talent.
Bring ideas to life.” and “Build work you’re proud of.” Each message types in,
holds for 2.8 seconds, fades for 550ms, then pauses for 1.1 seconds.
The initial sentence is immediately readable. A reserved headline area prevents
the search controls from shifting. Decorative side notes are removed and the
supporting paragraph is shortened. Screen readers receive a stable heading;
Pause motion and reduced motion show the complete first sentence. Timers are
cleaned up on unmount or motion changes.

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

## Homepage polish ? 3 November 2026

The category and overlap entrances now reveal once per mount, superseding the replay behavior above. Hero phrases use a shorter fade without a separate blank interval. Category picker labels translate correctly and the dark search placeholder no longer overlaps its animated hint. Homepage-only wrapping and mobile input refinements preserve existing routes and records. See [review and verification limits](../07-HANDOVER/HOMEPAGE_POLISH_2026-11-03.md).

Motion follow-up: decorative border loops are removed; pointer menus/dialogs use short progressive entrances, headline space is stable across translated phrases, and timer-driven hints pause offscreen or in hidden tabs. Pause covers the homepage header as well. See the handover for remaining visual checks.

User correction: How it works retains its original scroll-driven reveals, depth/badge animation and active border orbit. The later motion simplifications for this section were reverted at Mina's request; other homepage improvements remain.


### Homepage navigation - 5 November 2026

Navbar text-selection repair: links and buttons inside `public-header-inner` no longer allow accidental text selection or display the global rose selection fill. This removes the small pink rectangles behind EN, Sign In and Sign Up without changing button backgrounds, dropdowns or keyboard focus. Page content remains selectable.

Upper-edge refinement: softened the white top border to 27% opacity and its inset highlight to 19%, keeping the existing glass background and other edges.

Transparency follow-up (latest values supersede the initial treatment below): the glass now uses a 2% theme tint, a faint highlight gradient, 3px blur and 110% saturation for a clearer view of the hero. Corner radius is 24px instead of a full pill. The lower border and inset highlight use translucent white, with a neutral shadow; the blue lower rim has been removed.

12 November 2026 — reference-led glass treatment: the homepage navbar uses a pill silhouette, a low-opacity theme tint and highlight gradient, 10px backdrop blur, and bright inset edges with a cool lower rim. The illustration remains visible through the glass in light and dark mode. Grouped links remain transparent inside the lens; existing navigation, controls, drawer and scroll behavior are preserved. Opaque theme surfaces provide a fallback for unsupported backdrop filters and reduced-transparency preferences. Supports FR-V01, FR-V05, NFR-02 and NFR-03. Browser appearance verification remains pending.

The mobile navigation drawer opens with Hire Talent and Find Work collapsed. Tap a group to see its destinations. Opening one group closes the other, and reopening the drawer resets both groups.

LandingHeader now renders a floating rounded bar with grouped desktop destinations and a compact EN/AR selector. Appearance settings use an icon disclosure. Mobile/tablet navigation uses the shared accessible Modal drawer, retaining all existing links and account actions. The hero content and marketplace workflows are unchanged. Browser/real-device visual acceptance remains pending; see DESIGN_SYSTEM.md for design and verification notes.

### Dropdowns and category cards

The selected Hire or Work option above the hero search uses the same burgundy as the public Sign Up button.

The hero category dropdown layers above the overlapping category section while open. The header uses pill-shaped Sign In and Sign Up controls. Under “Explore your next direction”, category cards reveal in reading order, left to right in English and right to left in Arabic. Cards reset when they leave view and reveal again when reached by scrolling down or back up, with a 70ms stagger between cards that enter together. Focused cards and cards shown with motion paused or reduced are immediately visible. This supports FR-V01, FR-V02 and NFR-01–NFR-03.


### Reference-based interactive hero — 12 November 2026

This update supersedes the previous timed sign/conveyor/coin hero and rotating headline. P-01 now uses the latest user-supplied MIU building reference, adapted to an ivory background plate. The rooftop letters, globe window, arched entrance, bench and isometric composition remain the visual identity. Headline, search, calls to action and floating freelancer/project/portfolio/earnings cards are live HTML; only architectural signage remains in the artwork.

The headline reads “Your Talent Opens Doors.” The primary links open `/projects` and `/register?role=student`. Following the user's correction, the original homepage navbar is retained, including Hire Talent, Find Work, How it works, language/appearance controls and right-side Sign In/Sign Up buttons. The original Hire/Work search, category picker and submission behavior are also retained. Search filters the fictional landing examples; services remain reachable through the existing navigation. Shared routing, role and data contracts are unchanged.

`useHeroStory.js` uses GSAP/ScrollTrigger for five reversible equal scroll beats: welcome (0–20%), opening doors/project discovery (20–40%), talent and creative services (40–60%), an illustrative connection (60–80%) and a completed portfolio with EGP earnings (80–100%). Door panels share the background's coordinate space. A CSS-sticky stage uses a 230svh wrapper on large viewports. No wheel/touch events are intercepted, no scroll snapping or scroll lock is introduced, and an anchor lets visitors skip directly to discovery. Mobile and short viewports use ordinary document flow with a shorter timeline. Cards animate transforms/opacity; the connection line uses stroke dash offset. There is no React update per animation frame.

Pause motion and system reduced motion remove the scroll runway and show a complete static composition. The optional runtime cleans up with `gsap.context().revert()` on unmount or preference changes. Chunk failure also leaves a readable static layout. Only three small decorative particles repeat. The artwork is hidden from assistive technology; the stable heading and fully interactive controls stay semantic. New interface text is included in the existing draft Arabic dictionary. The illustration is not mirrored in RTL.

All cards are fictional illustrations. The earnings card explicitly says “Fictional example · no payment”; there is no matching engine, order completion or financial mutation. This work supports FR-V01–FR-V03, FR-V05, NFR-01–NFR-03 and BR-02/BR-10 without marking SRS requirements complete.

Verification: `npm.cmd run build`, `npm.cmd run lint` and `npm.cmd test` passed (347 tests, zero failures). Route/localization regressions cover the new hero, original navbar/search markup and discovery behavior. Native Chrome accessibility inspection confirmed the restored navbar/search/account links and new hero content. The in-app browser could not reach loopback, and native visual inspection was obstructed by the foreground app/user interaction. Full viewport, reduced-motion and reverse-scroll visual acceptance therefore remain pending; automated markup checks are not browser acceptance.


Hero palette correction — 12 November 2026: the latest supplied reference supersedes the earlier ivory/beige color direction. The hero now uses neutral rose-white (`#f1e7e8`), dark burgundy text and vivid MIU red (`#b0001e`), with rose-white glass cards and a crimson CTA glow. A static SVG color matrix (RGB gains 0.965 / 0.974 / 1.014 in sRGB) grades the existing artwork and both door panels together, reducing the warm yellow cast without regenerating or shifting the building. Navbar, search layout, account buttons, routes and animation timing are preserved. Dark appearance retains its existing overrides.

Visibility follow-up: after the user reported that the color change was not apparent, the hero backdrop and edge fades were strengthened to `#eadfe2`. Static artwork grading now uses RGB gains 0.96 / 0.96 / 1.03 plus a 0.015 blue offset, making the neutral pink cast more visible while preserving the existing image and door alignment. This supersedes the first subtle grade above.


Hero framing correction — 12 November 2026: the user requested the complete reference framing rather than a zoomed crop. The artwork SVG now uses `xMidYMid meet` instead of `slice`; the mobile 145% width and negative left margin are removed. The full 1672 × 941 composition scales proportionally within the hero, retaining the building, rooftop lettering and bench without cropping. Door panels remain aligned because all layers share the same viewBox. Extra space on mismatched viewport proportions uses the existing hero backdrop. Navbar, search, colors and timeline are unchanged.


Reference palette and navbar refinement — 12 November 2026: the user requested the supplied image's colors and navbar styling while preserving every existing navbar item. The active hero plate is now `miu-reference-rose.webp`, color-graded using the supplied reference; the earlier beige plate remains available. This supersedes all interim SVG color matrices, which are removed. Full-image `meet` framing is retained and the page backdrop is `#eee3e5` with a gentler edge fade.

Homepage-only CSS now separates the unchanged brand from a central pill-shaped glass navigation lens and rounded language/appearance/account controls. The full-width enclosing navbar border/background is removed. Hire Talent, Find Work, How it works, all dropdown destinations, EN/AR, appearance settings, Sign In/Sign Up, authenticated account actions and mobile Modal drawer are unchanged. Shared header JSX and shared navigation styles are untouched. Opaque glass fallbacks, reduced-transparency overrides and dark surfaces remain available. Full browser visual matching is still unverified; a color reference does not guarantee pixel-identical rendering across displays.


Top-gap correction — 12 November 2026: following the user's report of empty space above the artwork, the SVG uses `xMidYMin meet`. The complete scene is aligned to the top of its hero viewport instead of vertically centered. Image proportions and crop-free fitting are preserved.

Validation for the reference palette/header update: production build, lint and 14 targeted route/theme regression tests passed. The final top-alignment follow-up changes only the SVG fitting attribute. Full browser visual acceptance remains pending.


Beige restoration — 12 November 2026: the latest user request restores the supplied warm beige image. The active hero imports the retained `miu-reference-ivory.webp` directly, with no color-grading filter. The hero backdrop/edge fades use `#faf6f0`, and glass surfaces return to warm ivory tints. The current navbar structure, image fitting, door implementation and scroll timeline are preserved as found at the start of this color-only update. This supersedes the rose palette instructions above.

Latest artwork replacement — 12 November 2026: `miu-reference-ivory.webp` now contains the user-selected lighter off-white version with restored architectural contrast and a corrected red glass door arch. The optimized WebP retains the original 1672 × 941 dimensions and existing SVG image/door alignment. This is a decorative asset replacement for P-01/FR-V01; navigation, roles and interactions are unchanged.
