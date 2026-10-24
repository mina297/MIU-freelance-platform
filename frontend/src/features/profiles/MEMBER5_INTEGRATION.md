# Member 5 — Profiles, Reviews and Support integration

Updated 24 October 2026. This branch includes an uncommitted merge from main plus review fixes; Mina owns the commit, push and PR merge.

## Registered routes

- Public: `/students/:studentId`, `/clients/:clientId`, `/help`, `/help/:articleSlug`, `/support/contact`.
- Active student/client owner: `/profile/edit`. The route derives profile ID and role from the current session. Page and storage mutations also check ownership; visitor/owner props cannot grant access.
- Active client: `/reviews/new`. Optional `orderId` and `studentId` query parameters preselect/filter candidates; they do not authorize a review.

Pages use Member 1/4's existing public shell. Proposals, comparison headings, services and provider cards link to the student profile. Completed order summaries link to the review page. The review success action opens the student's Reviews tab.

## Identity contract

Canonical `student_001` is Salma Farid, `student_002` is Omar Nabil and `client_001` is Nile Studio. These public names match marketplace fixtures; Salma's pending demo verification does not display an approved badge. Canonical profiles start without invented historical reviews, portfolio items, qualifications or completed jobs.

Earlier Figma samples remain separately addressable as `m5_sample_student_nour`, `m5_sample_student_karim`, `m5_sample_client_robotics` and `m5_sample_client_startup`. Their historical orders use `m5_sample_order_*`. They do not collide with marketplace IDs or authorize new reviews. Their content remains fictional design data.

Newly registered accounts without a profile record receive the profile-not-found state. A shared account/profile creation contract remains future integration; no arbitrary account data or private order history is published to fill gaps.

## Reviews

`features/reviews/reviewStore.js` observes the existing live order store, requires an active owning client and `completed` project/service order, and rechecks eligibility on submission. It rejects foreign IDs, mismatched students, active/unpaid/disputed orders, non-integer ratings and duplicate reviews. The store derives author/target IDs itself and freezes saved records. Multiple open forms cannot inflate ratings.

Reviews are memory-only and reset on refresh, just like marketplace orders. Old sessionStorage review submissions are ignored. Profiles subscribe to review updates and calculate their rating summaries from applicable fixture samples plus live submitted reviews. Historical sample orders are not review candidates.

`ReviewForm`, `NewReviewPage` and `LeaveReviewModal` use the current AuthContext. Legacy `defaultClientId` props do not impersonate a client. A consumer must provide AuthProvider. The client-to-student review direction (FR-C14) is implemented; student-to-client reviews (FR-S13) remain outside this fix.

## Profile and portfolio editing

Profile edits and portfolio overrides remain explicitly simulated sessionStorage data. They survive reload until the tab session is cleared, unlike the memory-only order/review stores. Only the active owning session can write. Profile edits allowlist editable fields; they cannot change role, verification status or rating history.

Storage writes are handled by the forms, with recoverable errors instead of a stuck saving/submitting state. Inputs remain available on failure. Use fictional photos only; image previews may be too large for browser storage, so choose a smaller image if saving fails.

Shared Modal handles review, portfolio preview, add/edit and delete dialogs, including focus management, Escape and scroll locking. Profile tabs support Left/Right and Home/End keys. Live browser and assistive-technology acceptance is still pending.

## Help and support

Help categories/search/articles/FAQs are local fictional content. Support submission stores a simulated ticket in sessionStorage; no email, committee assignment or dispute decision is triggered. Saved evidence contains metadata only, not image data URLs or file contents. Inputs are retained if storage is blocked/full. Do not use real identity evidence, credentials or personal information.

Member 3 remains responsible for committee assignment and disputes. Financial funding/activation stays separate; this feature does not move unpaid orders into delivery.

## Verification

Run `npm.cmd test`, `npm.cmd run lint` and `npm.cmd run build` from frontend. New regressions cover identity alignment, route guards, owner-only writes, storage failure propagation, live completion eligibility, duplicate submissions and escaped public review content. The historical profile render smoke script remains available explicitly at `src/features/profiles/__tests__/renderStudentProfile.smoke.mjs`.

Automated/static rendering checks do not establish mobile layout, browser interaction, modal focus behavior or screen-reader acceptance. Those remain unrun unless separately recorded.
