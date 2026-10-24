# Support & Disputes Dashboard — frontend demonstration

Reviewed FR-SD02–FR-SD05, BR-05/10/12/14, NFR-02/03, committee permissions and
the Payments and Escrow dispute escalation guidance. This screen demonstrates
parts of the requirements without claiming production support or dispute handling.

## Routes and design

`/SupportDisputes` provides direct, refreshable, case-insensitive public access to
safe fictional records. `/committee/support` uses the same component under the
existing Support & Disputes mock-role guard. The admin layout metadata is retained
for login redirects; only the dashboard's wrapper is adapted. Other routes and
role permissions are unchanged. This checkout has shared UI but no implemented
dashboards or temporary dashboard switcher, so no duplicate switcher is added.

The available Figma file `4OarPMFlQbiJI1Q1WxblcC` was inspected and contains no
dedicated Support & Disputes dashboard frame. The new design follows the existing
Inter/MIU crimson theme and reuses Button, Badge, StatCard, DataTable, Card, Input,
Select, Textarea and accessible Modal. Desktop uses queue/details columns; mobile
uses horizontal queue navigation and stacked content. New source files use LF.

## Demonstrated workflows

- Tickets, customer complaints and disputes; active/high-priority/unassigned metrics.
- Search references, titles, requester, assigned agent and related order/transaction;
  filter by case type, status and priority. Area/status/case use query parameters.
- Case workspace: requester, priority, assignment, submission context, related
  project/service order, agreed EGP amount and fictional transaction reference.
- Safe evidence previews use text-only placeholders. Conversation samples are
  fictional and read-only; internal notes never send a message to a user.
- Assign to the fictional provisioned support agent, record internal notes,
  change priority, resolve nonfinancial cases and escalate with required reasons.
- Financial disputes cannot be resolved by Support, including at reducer level.
  Escalations go to Finance or Super Admin; nonfinancial final escalations go to
  Super Admin. The UI offers no payment, payout, refund or escrow actions.
- Every mutation records actor, timestamp, target case, reason, before/after status,
  priority changes and escalation destination. Duplicate event IDs are ignored;
  resolved/escalated cases are read-only. Ledger/order/message fixtures stay intact.
- Loading, empty, error/retry and success feedback. Local mutations reset on reload;
  saved query parameters retain the requested view, not changed case data.

These are isolated display fixtures, not new marketplace or finance contracts.
There is no backend, real customer data, private evidence, upload, notification,
message delivery, credentials or financial transfer. No SLA, refund authority,
resolution deadline, revision limit or automatic financial decision is invented.
Production assignments, communication and authorized final decisions remain
integration work for their owning modules. No SRS requirement is marked complete.

## Checks

Run `npm run lint`, `npm run build`, `npm test` in `frontend`. Model tests cover
filters, active metrics, immutable auditable assignment/notes/priority/resolution,
financial escalation limits, duplicate event IDs and invalid/terminal actions.
Rendered-route tests cover both capitalization variants and the protected committee
route; existing session/access tests continue to cover role restrictions.

Verified on 24 October 2026: lint and the production build passed; all 167 Node
tests passed. Headless Chrome checks at `http://localhost:5173/SupportDisputes`
passed for direct access/lowercase URL/refresh, metrics, combined filters, case
assignment, internal notes, priority changes, nonfinancial resolution, evidence
previews, financial escalation restrictions and audit history. Whitespace-only
reasons, read-only outcomes, Escape/focus restoration, empty/error/retry and no
overflow at 1440, 1024, 768, 390 and 320px were checked. Desktop/mobile screenshots
were visually inspected. The feature source files contain LF line endings.

Repeat browser checks with
`node scripts/check-support-disputes.mjs <puppeteer-module-path> <chrome-path> [base-url]`.
Browser tooling is supplied externally with no new application dependency;
screenshots go to the OS temporary directory. Full accessibility conformance,
production security and real dispute outcomes remain outside this verification.
Git may emit LF-to-CRLF warnings under this checkout's system configuration.
