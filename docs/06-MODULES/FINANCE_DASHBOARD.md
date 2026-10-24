# Finance Dashboard — frontend demonstration

Reviewed FR-FC02–FR-FC05, NFR-10/13/14, BR-01/02/10/12 and committee role limits.
This preview demonstrates portions of requirements; it does not complete financial
workflows or establish an approved production ledger, fee policy or custody model.

## Routes and design

`/Finance` is a directly accessible, refreshable, case-insensitive public demo
with fictional records. `/committee/finance` renders the same component under its
existing Finance Committee guard. Admin route metadata remains intact for login
returns. Other routes/roles are unchanged. The checkout has shared UI controls but
no implemented dashboard or temporary switcher. Existing permitted-route navigation
exposes these paths; no duplicate dashboard or switcher was created.

The available Figma file `4OarPMFlQbiJI1Q1WxblcC` was inspected and contains no
Finance Committee dashboard frame. The new layout uses existing MIU crimson and
Inter conventions, shared StatCard/DataTable/Card/Button/Badge/Input/Select/Textarea
and accessible Modal. Desktop uses a sidebar and four metrics; mobile uses horizontal
section navigation, two metric columns and shared responsive transaction records.
New feature source uses LF. No packages or backend code were introduced.

## Data and behavior

The isolated fictional ledger uses stable IDs and integer EGP minor units. Five
orders cover projects and services; ten events cover funding, payouts, refund and
fees. All display values use `formatEGP`. Current demo totals: completed funding
17,000 EGP = escrow held 13,000 + completed payouts 3,800 + completed fees 200 +
completed refunds 0. Failed funding adds no balance. Pending payout 2,850, refund
2,500 and fee 150 remain separate and are not deducted or recognized as revenue.
Revenue means recorded completed fees, not net profit or all-time platform revenue.
These sample fee amounts do not define a platform commission rate.

Sections: financial overview, transaction history, escrow by order, payouts/refunds,
revenue/fees and pending financial reviews. Search references, order IDs/titles,
participants or fictional provider references; combine payment-status and type
filters. Empty results offer filter recovery. Query parameters preserve the selected
section/transaction; text/status/type filters are local UI state.

Transaction details show amount, payment status, related order/source/participants,
fictional provider reference, Cairo timestamp, held balance, related chronological
events and review history. Pending/failed events support review notes and escalation
to Super Admin with required trimmed reasons and confirmation. Review state is
separate from payment state: reviewing never marks money paid/refunded or changes
balances. Audits capture actor, timestamp, target, reason, before/after and destination.
Repeated event IDs are ignored; escalated exceptions become read-only locally.

Preview controls cover loading, empty, error/retry. Notes and review state reset on
reload. No API, payment provider, credentials, bank details, transfers, ID evidence,
notifications or actual escrow exist. Release/refund approval thresholds, payout
schedules, fee rates and tax policy remain undecided, so no such powers are invented.

## Validation

Run `npm run lint`, `npm run build`, `npm test` in `frontend`.
Model tests cover reconciliation, nonnegative linked order balances, integer money,
combined search/filter behavior, atomic reviews, unchanged ledger, duplicate IDs and
invalid action rejection. Rendered-route tests cover the direct/case-variant preview
and protected Finance Committee route. Existing access tests protect role boundaries.

Verified on 24 October 2026: lint and the Vite production build passed; all 40 Node
tests passed. Headless Chrome checks on `http://localhost:5173/Finance` verified
direct access/refresh, lowercase path, exact reconciled amounts, search/status
filters, transaction/order details, required trimmed reasons, review audit,
Super Admin escalation, unchanged payment statuses/balances, escrow-to-ledger
navigation, zero/error/retry, Escape/focus and no overflow at 1440, 1024, 768,
390 and 320px. Desktop/mobile screenshots were inspected.

Repeat browser checks with
`node scripts/check-finance.mjs <puppeteer-module-path> <chrome-path> [base-url]`.
Browser tooling is reused externally, with no new package dependency. Screenshots
are written to the OS temporary directory. The test suite emitted an existing
Vite HMR port-in-use warning but completed successfully. Git may report LF-to-CRLF
warnings under system configuration; feature files themselves use LF. Production
finance behavior and full accessibility conformance remain outside this validation.
