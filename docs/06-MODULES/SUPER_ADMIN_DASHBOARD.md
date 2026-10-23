# Super Admin Platform Control Center

Direct frontend preview: `/SuperAdmin` (also accepts capitalization variants).
This public demo route reuses the complete dashboard and its own layout, without
starting or persisting a session. Direct navigation and refresh therefore work.
The existing `/admin` route remains protected by the Super Admin mock-session
guard, and existing committee/session switching is unchanged. Both routes show
fictional in-memory records only; neither provides production admin access.

Frontend demonstration of P-22 at `/admin`, protected by the existing Super Admin
mock-session guard. Reviewed FR-A02–FR-A09, BR-02, BR-04, BR-05, BR-10 and BR-12.
This screen demonstrates portions of requirements, not completed production workflows.

## Interface and state

React/JavaScript with existing MIU red tokens, Inter, Lucide icons, reusable panels,
tables, badges and native confirmation dialogs. Responsive navigation becomes a
horizontal section list on mobile; tables scroll within labeled regions. All new
source files use LF. No dependency, backend, credential or persistence was added.

Sections use `/admin?section=users|committees|permissions|reviews|finance|reports`.
The overview contains account metrics, pending decisions, sandbox escrow and five
committee summaries. Users can search/filter accounts and simulate suspension or
restoration. Super Admin can create fictional committee records with validated
name/email/committee fields. Review dialogs require reasons and offer approve,
reject or resubmission outcomes. Financial records cover held escrow, payout,
refund and recorded fee examples; none trigger money movement. Reports count
session decisions and expose actor, timestamp, target, reason, before/after and
result. Reducer mutations and audit events update atomically.

Preview controls exercise loading, empty, error and retry states. There is no Figma
design for this screen. The UI follows the existing theme and documented components.

## Integration boundaries

This checkout has routing placeholders for other dashboards and no temporary
dashboard switcher. Start the Demo Super Admin session using existing session
controls at `/`, then follow its Super Admin navigation link. Committee navigation
explicitly switches to the corresponding provisioned demo account before opening
each existing protected committee route. These destinations remain placeholders;
their full dashboards are separate work. Existing role guards are unchanged.

Account status, newly provisioned accounts and scoped review permissions are local
display simulations: they do not modify the shared authentication fixtures or
grant login access. The permission matrix explains this boundary. Full permission
enforcement, account reset/deactivation, assignment edits and secure provisioning
remain future integration tasks. Fixed committee queue totals represent fictional
overall workloads; the three case records are a subset for administrative review.
Financial policy thresholds, production configuration and API-key management are
not invented. Identity evidence is text-only and AI results remain simulated.

## Verification

Run `npm run lint`, `npm run build`, and `npm test` in `frontend`.
`adminModel.test.js` checks auditable decisions, invalid transitions, duplicate
committee accounts, domain restrictions and independent permission/status changes.
The existing route/session tests continue to protect role boundaries.

Verified: ESLint and production build pass; all 21 Node tests pass. The headless
Chrome script `frontend/scripts/check-super-admin.mjs` checks account creation,
suspension, review decisions, scoped permissions, audit history, empty/error/retry
states, all five committee demo destinations, and no page overflow at 1440, 1024,
768, 390 and 320px. Desktop/mobile screenshots were visually inspected. The script
accepts a Puppeteer module path and Chrome executable path; it expects Vite on
127.0.0.1:5180 and stores screenshots in the OS temporary directory. No browser
dependency is added to the application. These checks do not certify production
security or full accessibility conformance.
