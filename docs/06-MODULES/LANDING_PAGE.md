# Landing Page — Phase 1 frontend

Implemented at `/`, based on [MIU Freelance desktop, node 8:2656](https://www.figma.com/design/4OarPMFlQbiJI1Q1WxblcC/MIU-Freelancing-Platform--Copy-?node-id=8-2656).

Related requirements: P-01, FR-V01–FR-V04, NFR-01–NFR-03 and SR-09. This screen supports public discovery and entry to existing authentication. It does not complete the full marketplace or account requirements.

`frontend/src/features/public/` owns the page, scoped styles and fictional landing-only examples. Assets in `frontend/src/assets/figma/landing/` are downloaded originals from the frame; no temporary Figma URLs are used at runtime. Inter, Playfair Display and brand colors reuse the existing theme. The shared public header now uses Upwork-inspired Hire Talent and Find Work dropdowns, How it works, Sign In and Sign Up, with MIU branding retained (23 October 2026).

## Behavior

- The Hire/Work segmented toggle switches discovery mode and resets filters. Work searches job title, client, description and skills; Hire searches the fictional students' names, study and skills. Both combine text with the selected category. Search scrolls to the relevant results section; empty results offer recovery. Student category tags are landing-only metadata, not a shared profile contract.
- All categories opens a styled picker with a selected checkmark. The reusable dropdown supports click, Enter/Space, Tab, outside-click dismissal and Escape with focus restoration. Category selection updates the search input state; Search applies it. Category chips apply filters immediately.
- Bookmarks are local page state with pressed semantics and a screen-reader status message. They reset on unmount/refresh and are separate from catalogue bookmarks.
- The navigation's Find Work dropdown links to `/projects`, student registration and How it works. Hire Talent links to landing student previews, `/services` and client registration. The contextual Join to hire/work action follows the toggle's selected role. Posting still starts at client registration; no publishing workflow is introduced.
- View job and View profile open native modal preview dialogs with close/Escape support and focus restoration. Design examples do not masquerade as shared marketplace records.
- Footer anchors open the corresponding landing sections. Help, Contact and policy buttons open labeled prototype information, not approved policy documents or a support submission.
- Services remains available in the shared header and footer; its catalogue remains a placeholder.

## Transparency and design adaptations

Design dates, names, ratings and club briefs are fictional examples, visibly disclosed before the featured cards. Verification/review claims have a Phase 1 qualification. No account, biometric, payment, support or review data is collected. Currency uses the centralized EGP formatter. No SRS requirement is automatically marked complete.

The desktop layout follows the source's centered hero, alternating timeline, three-column jobs/student/trust sections and dark footer. At narrow widths, the search wraps, timeline becomes single-sided and cards stack. Responsive widths and focus styling supplement the desktop-only reference. The original logo's proportions are preserved.

## Verification

Automated route tests cover landing sections, registration/catalogue entry links, accessible search/dialog markup, and combined search/category/empty results. Existing authentication, role and marketplace tests remain part of `npm test`.

Browser checks and any remaining limitations are recorded in [Known Issues](../07-HANDOVER/KNOWN_ISSUES.md). Future work includes service catalogue integration, real profile/project record integration, approved policies and complete support workflows.
