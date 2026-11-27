# Super Admin Platform Control Center

## Account and finance controls — 27 November 2026

The directory at `/admin?section=users` shows Account, Email, Role and Action.
Role and directory-status selectors are temporary display values and do not change
login authorization or verification state. Suspend, Restore and Ban use the saved
local account store and write audit entries; a banned account cannot be restored.
The Committees section lists preloaded accounts and workspaces, but the preview no
longer includes committee-account creation. FR-A04/BR-04 remain platform
requirements and are not implemented in this screen.

Financial overview values come only from successful simulated checkout records
in the shared checkout store. Paid, held and remaining totals use recorded EGP
minor units; no static payout, refund or fee examples are shown and no money is
moved. Its heading block is hidden on the finance section.

Local account state and audit records persist in this browser; other workspace
previews remain temporary. Committee routes are workflow placeholders. See
[Authentication](AUTHENTICATION.md) for storage, recovery and security limits.
No real credentials should be entered.

## Workspace additions — 27 November 2026

The shared workspace header replaces public navigation on `/SuperAdmin` and
`/admin`. It provides global search across directory records, marketplace
listings and administrative audit entries; an unread-alert menu; a Super Admin
profile menu; and the existing language and appearance controls. The overview
presents student, active-job, recorded escrow and pending-review KPIs, an illustrative monthly
activity chart, urgent cases and committee queue cards.

Committee cards open a local inspection dialog and calculate queue counts from
the unresolved records in the shared review queue. The unified review queue
covers identity, marketplace content, finance, disputes and AI-quality cases.
Approve/reject decisions, listing moderation and settings updates require a
reason and append an audit event. The Jobs & Services section searches and filters
existing non-draft project/service records; approve, pause and remove actions are
workspace-local overrides. Platform Settings validates optional commission and
budget limits plus a maintenance toggle. Values remain in memory for this
workspace only; financial policy defaults are left unset, and maintenance mode
does not take the platform offline.

These are frontend preview workflows, not production administration. No API,
financial transaction, listing-store mutation, real moderation, or production
configuration is performed. Audit KPIs combine existing account audit records
with current workspace events; the activity chart is illustrative rather than an
analytics feed.

## Shared dashboard refactor — 15 November 2026

The implementation now lives in `frontend/src/features/dashboards/governance/`
and uses the shared dashboard layout and primitives. `governanceModel.js` retains
the original admin model with its fixture import relocated. Imports target the
modular files directly; previous governance compatibility files have been removed.
`/admin` protection, `/SuperAdmin`
preview access, registration permissions, reducer decisions and audits are
unchanged. See [Member 3 dashboard foundation](../07-HANDOVER/M3_DASHBOARD_REFACTOR.md)
for the current layout contract, file organization and validation limitations.

Direct frontend preview: `/SuperAdmin` (also accepts capitalization variants).
This public demo route reuses the complete dashboard and its own layout, without
starting or persisting a session. Direct navigation and refresh therefore work.
The existing `/admin` route remains protected by the Super Admin mock-session
guard, and existing committee/session switching is unchanged. Both routes show
fictional in-memory records only; neither provides production admin access.

The current shared application root contains no development dashboard-switcher
bar. `/SuperAdmin` uses the standalone layout, so its administrative header starts
at the top without an extra public header or spacer. Committee/session switching
remains available through the existing controls; no additional switcher is needed.

Frontend demonstration of P-22 at `/admin`, protected by the existing Super Admin
mock-session guard. Reviewed FR-A02–FR-A09, BR-02, BR-04, BR-05, BR-10 and BR-12.
This screen demonstrates portions of requirements, not completed production workflows.

## Interface and state

React/JavaScript with existing MIU red tokens, Inter, Lucide icons, reusable panels,
tables, badges and native confirmation dialogs. Responsive navigation becomes a
horizontal section list on mobile; tables scroll within labeled regions. No new
dependency, backend or credential was added; saved account state continues to use
the existing local account store.

Sections use `/admin?section=users|committees|permissions|reviews|finance|jobs|settings|reports`.
The overview contains account, active-job, escrow and review metrics, monthly
activity, urgent alerts and five committee summaries. Users can search by name,
email or role. Review dialogs require reasons and offer approve, reject or
resubmission outcomes. Finance rows derive from successful checkout records only.
Reports expose actor, timestamp, target, reason, before/after and result for
available account and workspace audit records. Reducer mutations and their audit
events update atomically.

Preview controls exercise loading, empty, error and retry states. There is no Figma
design for this screen. The UI follows the existing theme and documented components.

## Integration boundaries

This checkout has routing placeholders for other dashboards and no temporary
dashboard switcher. Start the preview Super Admin session using existing session
controls at `/`, then follow its Super Admin navigation link. Committee navigation
opens sign-in for a preloaded committee account before opening
each existing protected committee route. These destinations remain placeholders;
their full dashboards are separate work. Existing role guards are unchanged.

Directory role/status selectors and scoped review permissions are local display
simulations and do not alter login roles or access. Saved suspension and ban
actions affect local sign-in state. The permission matrix explains this boundary.
Full permission enforcement, account reset/deactivation, assignment edits and
secure provisioning remain future integration tasks. Committee queue counts come
from the unresolved fictional cases displayed in the unified administrative
review queue and do not represent total production workloads.
Financial policy thresholds, production configuration and API-key management are
not invented. Identity evidence is text-only and AI results remain simulated.

## Verification

Run `npm run lint`, `npm run build`, and `npm test` in `frontend`.
`features/dashboards/governance/governanceModel.test.js` checks auditable decisions,
invalid transitions, duplicate
committee accounts, domain restrictions and independent permission/status changes.
The existing route/session tests continue to protect role boundaries.

The focused governance, route, localization and theme tests pass. ESLint and the
production build pass; the build retains its existing large-chunk advisory. The
full suite reports 383 passing and one unrelated pre-existing footer assertion:
it expects “Community Guidelines” while the footer renders “Safety & Trust”.
Interactive browser checks confirmed the four-column directory, global search,
notifications, profile menu, committee inspection, review decisions, local
moderation/settings updates, audit entries, and no horizontal overflow at
1440/1024/768/390/320px. The headless Chrome script
`frontend/scripts/check-super-admin.mjs` covers those interactions plus
suspension, scoped permissions, empty/error/retry states and committee routes.
It accepts a Puppeteer module path and Chrome executable path, expects Vite on
localhost:5173 by default (an optional fourth argument overrides the base URL),
and stores screenshots in the OS temporary directory. Its script syntax was
checked; it was not run as a separate Puppeteer suite. No browser dependency is
added. These checks do not certify production security or full accessibility.

## Registration settings

Under `/admin?section=registration`, an active Super Admin can add a country name to the public sign-up list (FR-A01, FR-A10). Egypt is the initial option. An addition requires a reason and creates an entry in Reports & audit with the actor, time, country, and outcome. Duplicate names are rejected regardless of case. The list and its audit entries live for the current app session and reset on refresh. Country selection is independent of EGP pricing.
