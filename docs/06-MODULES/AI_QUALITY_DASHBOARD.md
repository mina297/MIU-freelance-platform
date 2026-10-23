# AI & Quality Dashboard — frontend preview

Requirements reviewed: FR-AQ02–FR-AQ05, NFR-02/03/11/12 and the least-privilege
committee matrix. This is a mock review UI, not an implementation of production AI.

## Routes and design

`/AIQuality` provides direct, refreshable, case-insensitive public access to the
fictional preview. `/committee/ai-quality` uses the same component under its
existing committee-role guard and retains admin route metadata for login returns.
Other routes and role checks are unchanged. This checkout has shared UI controls
but no implemented dashboards or temporary switcher. Existing demo navigation
exposes available routes; no duplicate switcher is introduced.

The available Figma file `4OarPMFlQbiJI1Q1WxblcC` was inspected and has no AI & Quality
committee dashboard frame. The new layout uses the existing Inter/MIU crimson theme,
shared Cards, Buttons, StatCards, DataTables, Badges, Input, Select, Textarea and
accessible Modal. Desktop shows queue and detail columns; mobile stacks content
and provides horizontally scrollable area navigation. New feature files use LF.

## Demonstrated behavior

- Areas: all quality reports, skills matching, chatbot and moderation flags.
- Fixed evaluation set: 20 fictional checks per area, totaling 60 checks and seven
  failures. Each row defines its human-reference criterion and sample denominator.
  Error rate is failed checks / samples, not a live provider metric. Quality
  definitions and production thresholds remain unapproved.
- Review queue: searchable references/titles/categories; filter by area and status.
- Reports: sample input, flagged/reported output, expected context, priority,
  assignee and human review history. Includes matching relevance feedback, a chatbot
  inventing a refund approval, and moderation false-positive/false-negative examples.
- Assignment to a fictional provisioned reviewer; required-reason findings with
  in-review/resolved outcomes; escalation to Super Admin, or Marketplace Operations
  for moderation cases. Every change records actor, timestamp, reason, before/after
  status and escalation destination atomically. Resolved/escalated reports are read-only.
- Query parameters preserve area/status/selected report across navigation. Refresh
  retains the requested view but resets mock mutations. Preview controls cover
  loading, empty, error and retry. Figures avoid division by zero for empty data.

## Boundaries

No inference, models, providers, private messages, identity evidence, financial
actions, real notifications or persistence. Samples are fictional and safe.
Quality reviewers record findings, not content enforcement decisions. Escalations
are local records and do not contact another person or service. Model quality does
not improve when a report is resolved; evaluation fixtures remain unchanged.
Fairness is explicitly unevaluated, and these sample metrics establish no readiness,
acceptance threshold or approved scoring methodology. No production permission,
account or marketplace state is changed.

## Checks

Run `npm run lint`, `npm run build`, and `npm test` in `frontend`.
`qualityModel.test.js` covers metric denominators, zero samples, combined filters,
assignment, immutable audited outcomes, scope-limited escalation and invalid actions.
Rendered-route tests cover both public capitalization variants and the protected
committee route. Browser checks accept externally available Puppeteer/Chrome paths;
no application dependencies are added.

Verified: lint, production build and all 39 Node tests passed. Headless Chrome
checks on `http://localhost:5173/AIQuality` passed for direct access, lowercase URL,
refresh, metric denominators, filters, assignment, resolved findings, scoped
escalation, history, whitespace validation, modal Escape/focus restoration,
read-only outcomes and empty/error/retry states. No page overflow at 1440, 1024,
768, 390 or 320px; desktop/mobile screenshots were visually inspected.
Run `node scripts/check-ai-quality.mjs <puppeteer-module-path> <chrome-path> [base-url]`
to repeat; screenshots go to the OS temporary directory.

The existing test setup emitted a Vite HMR port-in-use warning without test failure.
This checkout's Git configuration may emit LF-to-CRLF warnings; the new feature
source files themselves use LF. Production AI quality and full accessibility
conformance remain unverified.
