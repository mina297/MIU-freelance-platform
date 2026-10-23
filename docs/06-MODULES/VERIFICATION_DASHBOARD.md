# Verification Dashboard — frontend preview

Implements the committee review UI portions of FR-VC02–FR-VC05, BR-06, BR-12,
NFR-02/03/08/11. No requirement is marked complete by a mock screen.

## Routes and integration

`/Verification` is a direct, refreshable, case-insensitive public frontend preview
with fictional evidence only. `/committee/verification` renders the same component
under its existing Verification Committee mock-role guard. Neither route performs
production identity verification. `/verify` and `/verify/pending` remain the
separate applicant workflows. The existing session controls link to permitted
routes; no temporary dashboard switcher or implemented dashboards were present
in this checkout. No other role restrictions are changed.

## Interface

Reuses shared Button, Card, Badge, StatCard, DataTable, Input, Select, Textarea
and Modal components. Uses Inter, existing MIU color tokens, responsive navigation,
two-column desktop queue/details and stacked tablet/mobile content. Table scrolling
remains inside the shared table. New source files use LF.

The available Figma file `4OarPMFlQbiJI1Q1WxblcC` was inspected; it contains profile
verification labels but no dedicated Verification Committee dashboard frame.
This is a new layout using existing UI components rather than a claimed Figma match.

Queues: Pending, Approved, Rejected, Resubmission Requested, Escalated and All.
Search by name/reference and filter MIU versus external affiliation. Each record
has a stable reference, applicant role, MIU ID/government ID category, submission
date, context, textual evidence placeholder, explicitly simulated review signals,
and decision history. A pending resubmitted record includes its previous reason.

Pending cases support approve/reject/request resubmission with a required trimmed
reason and confirmation. The reducer updates status and audit history atomically;
the new status queue opens on success. Decisions record actor, timestamp, reason
and before/after status. Completed, awaiting-resubmission and escalated records are
read-only. No fake new submission or repeated decision is generated. Browser history
works through `status` and `case` query parameters.

Preview controls provide loading, empty, recoverable error and retry. All changes
are local to this mounted preview and reset on reload. No real evidence, ID numbers,
face images, camera requests, AI, uploads, notifications or credentials are used.
Mock signals do not establish identity or university affiliation. Shared session
verification statuses are not changed. Consent/capture and institutional validation
remain applicant/provider integration work, outside this committee dashboard.

## Checks

From `frontend`: `npm run lint`, `npm run build`, `npm test`.
`verificationModel.test.js` checks combined filtering, all decision outcomes,
atomic history, immutable fixtures and rejection of invalid/repeated decisions.

Verified on 23 October 2026: ESLint and Vite production build passed; all 38 Node
tests passed, including new direct/committee route rendering coverage. Headless
Chrome checks on `http://localhost:5173/Verification` passed for refresh, queue
search, document-category details, all three outcomes, required trimmed reasons,
history, read-only decisions, Escape/focus restoration and empty/error/retry.
No page overflow at 1440, 1024, 768, 390 or 320px. Desktop/mobile screenshots were
visually inspected. Browser checks can be rerun using
`node scripts/check-verification.mjs <puppeteer-module-path> <chrome-path> [base-url]`;
screenshots are saved in the OS temporary directory, with no new dependencies.

The test suite emitted an existing Vite HMR port-in-use warning but completed
successfully. Git may emit LF-to-CRLF warnings under the checkout's system Git
configuration; new verification files themselves contain LF line endings.
