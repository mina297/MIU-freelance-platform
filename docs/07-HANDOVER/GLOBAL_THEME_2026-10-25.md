# Global light and dark theme — 25 October 2026

## Repair update — 26 October 2026

Logo refinement: following Mina's visibility feedback, official logos now use
a fitted warm off-white backing on dark surfaces, with a 6px corner radius,
subtle inset edge and restrained shadow. Removed the former 5px white halo.
Internal padding fits the original image box; official colors and proportions
are unchanged. Light headers stay transparent; dark footers use the backing in
both themes. Browser appearance of this refinement has not yet been verified.

This update supersedes the palette, floating-control placement and verification
notes below. The running Vite server returned compiled `index.css` without the
shared theme tokens or toggle styles. `ThemeProvider` now imports both shared
stylesheets directly, covering the application and standalone preview providers.
The client-transform regression check verifies that those imports and styles
are actually present, in addition to the existing SSR route checks.

Repairs made:
- Neutral charcoal canvas and raised cards; separate field, overlay, hover and
  divider tokens. Burgundy remains an accent rather than the default field fill.
- Header dark rules moved from homepage CSS into the header stylesheet; duplicate
  focus, selection, backdrop and logo rules removed. Logo plaques no longer add
  padding that changes image layout dimensions.
- Shared buttons, completed/status badges, inputs, validation and modal surfaces
  corrected at their owning stylesheets. Disabled buttons retain their own state.
- Auth inputs and chatbot conversation surfaces separated from cards. Order
  delivery history uses a neutral inset surface. Profile avatar outlines adapt.
- Service/landing decorative transparency restored; marketplace category artwork
  no longer uses the bright input-border color. Project card dividers are quieter.
- Homepage animated search placeholder no longer overlaps the animated hint.
- Standalone routes use a normal-flow appearance toolbar before page content;
  standalone component previews also use a normal-flow control. Nothing floats
  over workflow actions. Standard header toggles are retained.

Verification: 321 tests passed, ESLint passed, production build passed. The
additional Vite client-stylesheet regression and focused theme tests passed.
The existing application chunk-size warning remains. Browser screenshots were
inspected for light/dark homepage, dark sign-in, and light/dark project catalogue
(hero, categories and listing controls) at a narrow desktop window. Internal
navigation from dark sign-in to home retained dark; direct catalogue entry
started light. This is not a complete mobile or all-route visual acceptance.

Computer Use stopped during further preview navigation because it could not
determine the current browser URL with enough confidence. Remaining browser QA:
mobile sizes, dropdown/dialog interactions, keyboard traversal, explicit refresh
reset, authenticated dashboards/orders/admin, support/chatbot and all isolated
previews. Source/SSR coverage is not evidence that these visual checks passed.
Changes remain uncommitted; no branch, commit, push or merge was performed.

## Scope and requirements

Team leader Mina authorized extending the homepage premium dark design across
the existing application. Relevant requirements: NFR-01 (usability), NFR-02
(accessibility), NFR-03 (responsive design), NFR-16 (maintainability), and the
existing functional requirements of each rendered feature. This presentation
work does not mark production or placeholder features complete.

## Behavior and ownership

Localization integration, 26 October: the existing theme provider now composes
the shared language provider for the app and isolated previews. Language has its
own non-sensitive saved preference; theme remains in memory and starts light on
every document load. See [localization handover](LOCALIZATION_2026-10-26.md).

- `src/theme/ThemeProvider.jsx` owns one React state value above the router,
  authentication provider, route screens and chatbot. It starts light on each
  fresh load. SPA route navigation preserves the current selection. Refreshing
  or opening a new document resets to light.
- No localStorage, sessionStorage, OS preference or account data is used.
  Previously saved homepage preferences are ignored. `index.html` explicitly
  starts with `data-theme="light"` before React loads; the provider updates the
  root attribute before paint when toggled.
- `ThemeToggle` is one native button with a stable “Dark mode” name, pressed
  state, descriptive action tooltip, decorative sun/moon artwork, visible focus
  and a minimum 44px target. Its knob animation respects reduced motion.
- Standard public/app/committee pages use `PublicHeader`; home and auth screens
  use `LandingHeader`. Each supplies one toggle. Standalone marketplace/checkout
  pages, `/SuperAdmin` and `/admin` use one lower-left floating control, opposite
  the lower-right chatbot. Layout geometry and workflow controls remain intact.
- `ThemeContext` exposes a light presentation fallback for isolated renderers;
  production and all three standalone preview entry points mount the provider.

## Styling

Shared semantic values live in `src/theme/theme.css`. Feature CSS and Tailwind
colors use semantic variables with their original light colors as fallbacks.
Existing branded dark hero fills and white text on primary actions are retained.
The palette distinguishes charcoal canvas, inset plum surfaces, raised cards,
burgundy selections, control borders, rose links and status-specific colors.

The root attribute and inherited variables cover native dialogs, dropdowns and
document-mounted portal content. No blanket inversion filter or new dependency
is used. The existing targeted monochrome icon treatment remains. MIU logo
images retain the original artwork and proportions on light backgrounds.

## Coverage

| Interface family | Theme treatment |
|---|---|
| Home | Cinematic video overlay, search, category menu/carousel, timeline, jobs, students, trust, previews and footer |
| Public information | About, How it works, Terms and Privacy content or policy placeholders |
| Authentication | Role selection, registration, login, recovery/reset and field validation |
| Projects/proposals | Catalogue/cards/filters, details, create/edit, client projects, submit/edit/list/review/compare flows |
| Services | Catalogue/detail/comparison, provider management, packages/extras and order configuration |
| Discovery | Freelancer directory, recommendations, filters, cards and empty/error presentations |
| Profiles/reviews | Student/client profiles, editing, uploads/portfolio, completed jobs and ratings/review forms |
| Dashboards | Student/client navigation, metrics, tables, cards, dialogs and payment overview |
| Orders | Lists, summaries, collaboration, notes, attachments, delivery/revision/history |
| Finance | Checkout controls, summary, escrow progress and payment history; simulated EGP behavior preserved |
| Governance | Super Admin sidebar/topbar/tables/dialogs and guarded committee placeholders |
| Support | Help index/article, contact form, ticket feedback and chatbot panel/transcript/input |
| Shared UI/states | Buttons, badges, fields, dropdowns, tables, tabs, pagination, dialogs, toast specimens, skeletons and recovery states |
| Routing states | Missing records, access denied, session expiry, unknown URL, notifications and verification placeholders |
| Isolated previews | Shared UI, public pages and How it works HTML entries use the same provider/control |

Settings and standalone messaging routes are not implemented; no new workflow
or permission was added to theme them. Committee and verification placeholders
remain placeholders. Financial and identity actions retain Phase 1 limitations.

## Verification and limitations

Executed on 25 October 2026: all **321 tests passed** (14 suites). Production
build and ESLint also passed. Final focused checks are recorded in the task
summary if additional style-only adjustments follow this run.

Automated route tests render every route in the registry in light and dark
contexts, with an appropriate role for protected pages, and require exactly one
named toggle with the correct pressed state. Tests also check a fresh provider's
light default and toggle delegation. Palette checks calculate body, muted, accent,
semantic-status, focus and control-border contrast against principal surfaces.
Existing marketplace and session regression tests remain in use.

Actual browser visual review, interactive keyboard/focus, mobile layout and
refresh/navigation acceptance remain pending. The in-app browser provider was
unavailable during this task; previous Windows automation could not confidently
identify the active Chrome URL. SSR and mathematical contrast checks do not
replace these browser checks, nor do they prove every image/gradient state.

Production build retains the existing warning for an application JavaScript
chunk over 500 kB. The standalone HTML previews retain their existing development
entry setup; this work does not change deployment packaging.

## Preview URLs

- `/` — homepage; toggle, then navigate to another page to inspect theme continuity.
- `/projects`, `/services`, `/freelancers`, `/recommendations` — discovery.
- `/login`, `/register`, `/about`, `/help`, `/support/contact` — public/auth.
- `/student/dashboard`, `/client/dashboard`, `/client/payments` — appropriate mock session required.
- `/SuperAdmin` and `/Checkout` — existing explicit frontend preview routes.
- `/shared-ui-preview.html`, `/m4-pages-preview.html`, `/how-it-works-preview.html` — standalone component previews.

All source changes are left uncommitted for team review.
