# English and Arabic implementation handover — 26 October 2026

## Delivered implementation

Shared language provider, English/Arabic controls, pre-paint initialization,
language-only local persistence, draft Arabic dictionaries, root direction and
font handling. Existing theme behavior and business data ownership are retained.
No branches, commits, pushes or merges are part of this task.

Coverage includes static interface labels and states across public/auth pages,
projects/proposals, services/orders, profiles/reviews, discovery/recommendations,
dashboards, finance/checkout, administration, support, assistant controls and
standalone previews. Dynamic metadata, validation notices, accessibility labels,
authored help articles and FAQs also use the dictionaries. User-authored records
remain in their original language. Language switching does not key/remount the
router, sessions or marketplace stores.

All new Arabic wording is a **draft pending team approval**, including authored
help and canned assistant guidance. Terms/Privacy remain placeholders awaiting
approved policy text; no binding Arabic policy was created.

## Verification record

The first full regression run after the initial interface migration passed all
321 existing tests. Six new localization checks passed for:

- Pre-paint preference/default/blocked-storage behavior, with theme left light.
- Dictionary parity, named placeholders and literal interface lookup coverage.
- Arabic plural categories, interpolation, EGP/date formatting and invalid data.
- Searching translated help without modifying its original records.
- All 58 registered routes rendered in English and Arabic with one language
  control and unchanged access metadata.
- Escaped, unchanged user chat text and project titles/descriptions in Arabic UI.

The complete final regression suite passed **327 tests, 0 failures**. Closing
ESLint and production build also passed; eight focused language/theme checks
passed after the final preview-title integration. Five initial controlled-component unit-test
failures were repaired by keeping LanguageSwitcher presentation-only and using
small translation adapters for radio labels and toast content/dismissal; the
existing callback/disabled/escaping assertions remain intact.

Browser review could not be completed: native access to the shared VS Code
preview timed out waiting for app approval. No Arabic screenshots, mobile
geometry, keyboard traversal, dropdown/dialog interaction, screen-reader result
or real browser refresh/navigation persistence is claimed verified. The automated
checks above remain distinct from these pending acceptance steps.

Production build retains the existing application chunk-size warning; the eager
bilingual message catalogue increases its size. No route splitting or new
dependency was introduced as part of localization.

## Preview and review

Start the frontend development server and open:

- `/` — header switcher, animated headline, search and navigation.
- `/projects`, `/services`, `/freelancers`, `/recommendations` — marketplaces.
- `/login`, `/register`, `/forgot-password` — translated forms/validation.
- `/help`, `/help/create-your-profile`, `/support/contact` — help and support.
- `/student/dashboard`, `/client/dashboard`, `/client/payments` — mock role required.
- `/Checkout`, `/SuperAdmin` — existing explicit frontend previews.
- `/shared-ui-preview.html`, `/m4-pages-preview.html`, `/how-it-works-preview.html`.

Select العربية, navigate without reloading and confirm language/theme continuity.
Refresh: Arabic should remain selected and theme should return to light. Select
English to restore LTR. Review long content, forms, native selects, dialogs,
tables, focus order and horizontal scrolling at mobile and desktop widths.

## Maintenance

See [localization design](../03-DESIGN/LOCALIZATION.md). New messages require Arabic
drafts and subsequent team approval. Existing fixture-only operational prose may
describe older integration boundaries; localization preserves those statements
rather than silently changing requirements or declaring integrations complete.
