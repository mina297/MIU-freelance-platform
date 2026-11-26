# Member 5 — Profiles, Reviews and Support integration

## Owner profile and student reference design — 26 November 2026

Presentation follow-up groups the existing student profile shell into a padded
glass container with brand-tinted backing, 32px outer corners, shared 20px inner
panel corners and pill action buttons. The student sidebar's open state now
reserves 240px (108px collapsed), allowing this container to shrink and shift
without being covered. Its cards, content, editor and public preview are
unchanged. Browser checks at 1440px confirmed the rail/card bounds remain
separate, and at 390px confirmed the wrapper stays inside the viewport.

The private `/profile` route derives the active Student/Client owner. Both public
registration methods and every participant sign-in land here; staff keep their
workspace destinations. The navbar avatar is a direct profile link. An adjacent
account menu preserves layout preferences, secondary navigation and sign-out.
The old dashboard Profile link is omitted from More navigation.

The supplied reference is for the student profile only: compact identity header,
stacked View public profile/Profile settings actions, underline tabs, About Me,
Skills and Portfolio in the primary column, with Work Stats, Education,
Experience, Languages and Reviews alongside it. Responsive layouts stack the
columns and actions. Existing canonical profiles/edits/portfolio/review selectors
are reused; no new example identities, success rates, reviews or qualifications
are invented. Experience has an explicit empty state because the current profile
contract does not store employment records. Education uses existing field of
study/year data. Client profiles retain their layout with the two owner actions.

Public preview uses `?view=public` on the existing ID-based profile routes and
hides settings/portfolio editing controls; it does not bypass storage ownership
checks. Profile settings uses the existing editor, and save/cancel return to
`/profile`. Setup screens remain directly reachable as before. Requirements:
FR-S03, FR-C03, FR-C06, FR-X01, NFR-02 and NFR-03. This supersedes earlier
navigation/landing descriptions without marking complete SRS workflows.

Browser checks for this increment: fictional student sign-in opens `/profile`;
avatar returns to it; the public-preview action hides profile/portfolio editing
controls; settings opens `/profile/edit`; Skills + ArrowRight selects Experience.
The student page was inspected at 1440px and 390px, including Arabic RTL at 390px,
with no document-width overflow in those checks. Registration and role denial
are covered by automated route/model checks; a new-account browser registration,
client browser flow and assistive-technology review were not performed.

Validation: ESLint, production build and the profile render smoke script passed.
The full run executed 378 tests: 376 passed, with the existing footer-copy mismatch
and the former homepage workspace-destination assertion failing. The latter was
updated to expect `/profile` and passed on a focused rerun. The untouched footer
test remains recorded in `docs/07-HANDOVER/KNOWN_ISSUES.md`; the full suite was
not rerun after that focused correction.

## Local profile persistence — 26 November 2026

This supersedes the account/profile lifetime notes below. New profile shells are
reconstructed from saved local accounts after reload; private account data and
password verifiers are never copied. Profile edits and portfolio overrides use
their existing keys in localStorage, copying available legacy sessionStorage data
once before removing the old copy. Owner checks and account-controlled field
protection remain. Storage errors preserve form input and prevent success.
Sessions and unsaved onboarding drafts remain memory-only. Reviews/support
storage is unchanged. See `docs/06-MODULES/AUTHENTICATION.md` for demo boundaries.

Updated 24 October 2026. This branch includes an uncommitted merge from main plus review fixes; Mina owns the commit, push and PR merge.

## Registered routes

- Public: `/students/:studentId`, `/clients/:clientId`, `/help`, `/help/:articleSlug`, `/support/contact`.
- Active student/client owner: `/profile` and `/profile/edit`. These routes derive profile ID and role from the current session. Page and storage mutations also check ownership; visitor/owner props cannot grant access.
- Active client: `/reviews/new`. Optional `orderId` and `studentId` query parameters preselect/filter candidates; they do not authorize a review.

Pages use Member 1/4's existing public shell. Proposals, comparison headings, services and provider cards link to the student profile. Completed order summaries link to the review page. The review success action opens the student's Reviews tab.

## Identity contract

Canonical `student_001` is Salma Farid, `student_002` is Omar Nabil and `client_001` is Nile Studio. These public names match marketplace fixtures; Salma's pending demo verification does not display an approved badge. Canonical profiles start without invented historical reviews, portfolio items, qualifications or completed jobs.

Earlier Figma samples remain separately addressable as `m5_sample_student_nour`, `m5_sample_student_karim`, `m5_sample_client_robotics` and `m5_sample_client_startup`. Their historical orders use `m5_sample_order_*`. They do not collide with marketplace IDs or authorize new reviews. Their content remains fictional design data.

24 November 2026: email and Google-preview registration initialize a minimal
memory-only public profile through `registrationProfiles.js`. The editor and
student/client profile lookups fall back to this shell for the corresponding
role. Only ID, role and display name come from the account; editable fields start
empty, verification is false, and history/rating counts start at zero.
`/profile/setup` introduces manual entry to `/profile/edit`. Resume selection is
a local metadata-only preview with 5MB PDF/DOC/DOCX validation; it opens the same
manual editor without reading, uploading or extracting content. LinkedIn offers
manual selection of an exported profile PDF up to 5MB, reusing the same desktop
picker/mobile sheet and session draft. No LinkedIn connection or extraction is
performed. Existing fixtures and owner-only edit rules are preserved. Unknown
IDs still show profile-not-found. New registration IDs are unique across app
instances, preventing inheritance of old tab-session edits. Refresh clears the
new shells alongside mock accounts.

## Reviews

`features/reviews/reviewStore.js` observes the existing live order store, requires an active owning client and `completed` project/service order, and rechecks eligibility on submission. It rejects foreign IDs, mismatched students, active/unpaid/disputed orders, non-integer ratings and duplicate reviews. The store derives author/target IDs itself and freezes saved records. Multiple open forms cannot inflate ratings.

Reviews are memory-only and reset on refresh, just like marketplace orders. Old sessionStorage review submissions are ignored. Profiles subscribe to review updates and calculate their rating summaries from applicable fixture samples plus live submitted reviews. Historical sample orders are not review candidates.

`ReviewForm`, `NewReviewPage` and `LeaveReviewModal` use the current AuthContext. Legacy `defaultClientId` props do not impersonate a client. A consumer must provide AuthProvider. The client-to-student review direction (FR-C14) is implemented; student-to-client reviews (FR-S13) remain outside this fix.

## Profile and portfolio editing

The student setup flow now inserts `/profile/setup/work` before `/profile/edit`.
It records a marketplace category ID in the session draft. The editor uses its
label only as the default for an empty headline; existing saved headlines win.
The normal owner-checked save persists that editable headline through the existing
profile field allowlist. No public profile schema or verification field changes.

Profile edits and portfolio overrides remain explicitly simulated sessionStorage data. They survive reload until the tab session is cleared, unlike the memory-only order/review stores. Only the active owning session can write. Profile edits allowlist editable fields; they cannot change role, verification status or rating history.

Storage writes are handled by the forms, with recoverable errors instead of a stuck saving/submitting state. Inputs remain available on failure. Use fictional photos only; image previews may be too large for browser storage, so choose a smaller image if saving fails.

Shared Modal handles review, portfolio preview, add/edit and delete dialogs, including focus management, Escape and scroll locking. Profile tabs support Left/Right and Home/End keys. Live browser and assistive-technology acceptance is still pending.

## Help and support

Help categories/search/articles/FAQs are local fictional content. Support submission stores a simulated ticket in sessionStorage; no email, committee assignment or dispute decision is triggered. Saved evidence contains metadata only, not image data URLs or file contents. Inputs are retained if storage is blocked/full. Do not use real identity evidence, credentials or personal information.

Member 3 remains responsible for committee assignment and disputes. Financial funding/activation stays separate; this feature does not move unpaid orders into delivery.

## Verification

Run `npm.cmd test`, `npm.cmd run lint` and `npm.cmd run build` from frontend. New regressions cover identity alignment, route guards, owner-only writes, storage failure propagation, live completion eligibility, duplicate submissions and escaped public review content. The historical profile render smoke script remains available explicitly at `src/features/profiles/__tests__/renderStudentProfile.smoke.mjs`.

Automated/static rendering checks do not establish mobile layout, browser interaction, modal focus behavior or screen-reader acceptance. Those remain unrun unless separately recorded.
# Profile navigation appearance — 24 November 2026

Authenticated top navigation on `/students/:studentId`, `/clients/:clientId` and
`/profile/edit` reuses LandingHeader's glass styling, as do Overview and all other
authenticated pages with top navigation. Student/client links, account
utilities, role access, mobile drawer and optional side navigation remain intact.
Post-registration onboarding continues to use its dedicated header.
