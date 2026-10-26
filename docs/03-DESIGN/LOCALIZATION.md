# English and Arabic interface localization

## Status and requirements

Implemented as a Phase 1 interface demonstration, authorized by Mina on
26 October 2026. Arabic wording is an assistant-authored Modern Standard Arabic
**draft awaiting team review and approval**. It must not be described as an
approved university translation. Relevant requirements are FR-V05, FR-S15–FR-S16,
FR-C16–FR-C17, NFR-02, NFR-03, NFR-15 and NFR-16. OD-12 translation approval and
OD-13 legal-content approval remain open; this work does not change the SRS.

## Language and theme behavior

- `src/i18n/LanguageProvider.jsx` owns the shared React language state. Existing
  application and preview theme providers compose it once per application root.
- English is the first-visit default. Only `miu.language` (`en` or `ar`) persists
  locally. Unsupported values or blocked storage fall back to English.
- `public/language-init.js` runs in each HTML head before styles/application
  rendering and sets document `lang` and `dir`. The provider maintains these
  attributes when switching languages without remounting feature forms or stores.
- The existing controlled `LanguageSwitcher` receives English/العربية options
  from `LanguageControl`. Shared public/auth headers, standalone appearance bars
  and component previews provide a single control. Arabic includes a draft label.
- Language and theme are independent. Theme still starts light on every fresh
  load and persists only during SPA navigation; language persists on refresh.

## Message ownership

`src/i18n/messages.js` exposes matching `en` and `ar` dictionaries, assembled
from the main static catalogue and authored interface, validation and help
catalogues. Keys use the original English message. `useLanguage().t(key, values)`
resolves messages and interpolates values as plain React text. Keep complete
sentences in keys; do not concatenate translated fragments for new interfaces.

Translate interface labels, status labels and system-authored help/canned
guidance. Preserve project/service titles and descriptions, participant names,
portfolio descriptions, reviews, messages, attachments and official artwork.
Never translate enum values, routing paths, record IDs, numeric amounts, search
state or stored business data. Resolve model validation messages at presentation
time. Dynamic accessible labels use placeholders so names remain intact.

No page content is sent to any translation service. No translation library or
runtime dependency was added. Arabic uses Noto Sans Arabic with Tahoma/Arial
fallbacks; the existing Google Fonts stylesheet includes the font.

## Formatting and direction

- `localeFor` supplies `en-EG`/`ar-EG`. Shared EGP/date formatters accept a locale
  without changing amounts or financial arithmetic. `formatCount` uses
  `Intl.PluralRules` for Arabic zero/one/two/few/many/other forms; catalogue result
  counts use it. New count messages should use this mechanism.
- Logical CSS spacing, borders, positions and text alignment adapt flow to RTL.
  Directional Lucide arrows mirror; logos, portraits and media do not.
- Email, URL, password, code and card demonstration inputs retain isolated LTR
  presentation. Chat text uses `dir="auto"`; custom user text remains original.
- Shared tabs already use direction-aware keyboard navigation. Category scrolling
  and hover-edge bounds accommodate RTL scroll offsets.
- Hero headline/search hints use localized strings; switching language restarts
  their presentation without resetting other homepage state. Reduced-motion
  behavior remains in effect.

## Legal and review boundaries

Terms and Privacy currently contain approval placeholders. Only those notices
are translated. No legal clauses, binding policies or business decisions were
invented. Team-approved English and Arabic policies are still required.

Unknown keys fall back to the supplied English text. Literal UI keys are checked
by tests. Existing user records may naturally remain English when Arabic UI is
selected. Source/render checks do not replace full interactive Arabic copy review,
mobile visual review, keyboard checks or assistive-technology acceptance.

See [localization handover](../07-HANDOVER/LOCALIZATION_2026-10-26.md) for verification.
