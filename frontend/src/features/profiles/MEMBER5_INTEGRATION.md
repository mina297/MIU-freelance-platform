# Member 5 — Profiles, Reviews & Support Integration Notes

## Shared presentation components

| Export | Use |
|---|---|
| `UserSummaryCard` | Compact photo/name/headline/rating for dashboards & tickets (not the full profile header) |
| `TicketDetails` | Read-only support ticket view (id, subject, category, description, status, evidence, requester) |
| `EvidenceGallery` / `EvidenceAttachmentPreview` | Evidence chips; omit `onRemove` for read-only |
| `LeaveReviewModal` | Member 3 client dashboard review CTA |

## Ownership

Member 5 owns Profiles, Reviews & Support. This deliverable includes:

- Mock fixtures under `src/data/fixtures/` (profiles, portfolio, reviews, help)
- `src/features/profiles/`
- `src/features/reviews/`
- `src/features/help/`

This feature does **not** register routes or modify `App.jsx` / `main.jsx` / AuthProvider.

## Layout and branding (do not duplicate)

Member 5 pages are **page content only**. They intentionally omit:

- MIU Freelance logo
- Global site header / public navigation
- App sidebar
- Site footer

| Chrome element | Owner | Expected layout (when available) |
|---|---|---|
| Shared application layouts (`PublicLayout`, `AppLayout`, …) | **Member 1** | `src/layouts/` |
| Public header, logo, footer, shared nav visuals | **Member 4** | `PublicHeader`, `PublicFooter`, `components/navigation/` |
| Role-aware authenticated chrome / sidebar | **Member 1** (+ Member 3 dashboard shells) | `AppLayout` / dashboard layouts |
| Profile identity card (`ProfileHeader`) | **Member 5** | Feature content — not site chrome |

Member 1 should wrap Member 5 page exports in the shared layout. Do not recreate branding inside Member 5 production components.

## Routes for Member 1

| Path | Export | Access |
|---|---|---|
| `/students/:studentId` | `StudentProfilePage` | Public / owner via `viewerMode` |
| `/clients/:clientId` | `ClientProfilePage` | Public / owner via `viewerMode` |
| `/profile/edit` | `ProfileEditPage` | Owner (pass `profileId` + `role`) |
| `/reviews/new` | `NewReviewPage` | Client demo |
| `/help` | `HelpCenterPage` | Public |
| `/help/:articleSlug` | `HelpArticlePage` | Public |
| `/support/contact` | `SupportContactPage` | Public |

Example:

```jsx
import { StudentProfilePage, ClientProfilePage, ProfileEditPage } from "../features/profiles";
import { NewReviewPage } from "../features/reviews";
import { HelpCenterPage, HelpArticlePage, SupportContactPage } from "../features/help";
```

## Leave a Review — Member 3 (client dashboard)

Reusable modal (same component, two export names). The shared `ReviewForm` shows the selected student’s photo/initials, name, academic headline, project title, and Completed status (no hardcoded Nour/Karim).

```jsx
import { LeaveReviewModal, ReviewForm, validateReviewForm } from "../features/reviews";

function ClientDashboardOrders() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Leave a review
      </button>
      <LeaveReviewModal
        open={open}
        onClose={() => setOpen(false)}
        defaultClientId="client_001"
        defaultStudentId="student_001" // optional filter
        defaultOrderId="order_005" // optional pre-select
        onSuccess={(review) => {
          // refresh dashboard lists if needed (do not navigate away yet)
        }}
        onViewReview={(review) => {
          // navigate to `/students/${review.targetStudentId}` Reviews tab
        }}
      />
    </>
  );
}
```

- `/reviews/new` (`NewReviewPage`) stays available for Member 1 routing and reuses the same `ReviewForm` + `validateReviewForm`.
- After submit, the form shows a success confirmation with **View review** and **Close** — it does not jump straight to the empty state.
- Eligibility: fictional `completedOrders` with `hasReview: false`, minus session-submitted order IDs (one review per completed order).
- Demo eligible orders: `order_005` (Nour / client_001), `order_008` (Karim / client_001).
- Development-only “Reset demo reviews” lives only in the gitignored preview shell.

## Simulated Phase 1 persistence

| Feature | Storage key |
|---|---|
| Profile edits | `miu-m5-profile-edits-v1` (sessionStorage) |
| Portfolio overrides (per studentId) | `miu-m5-portfolio-overrides-v1` |
| Review submissions | `miu-m5-review-submissions-v1` |
| Support tickets | `miu-m5-support-submissions-v1` |

Portfolio add/edit/delete controls appear only when `viewerMode="owner"`. Visitors see the public gallery only.

Submitted reviews appear on the student profile list and update the displayed rating summary (fixture totals + new ratings).

## Independent DEVELOPMENT-ONLY preview

Temporary files (gitignored — do not commit):

- `frontend/student-profile-preview.html`
- `frontend/src/student-profile-preview-main.jsx`

```bash
cd frontend
npx vite --open /student-profile-preview.html
```

Local URL: `http://127.0.0.1:5173/student-profile-preview.html` (or the port Vite prints)

Preview chrome is temporary navigation only — not the shared MIU header/logo.

## Demo IDs

- Students: `student_001` (Nour), `student_002` (Karim)
- Clients: `client_001`, `client_002`
- Eligible review order without existing review: `order_005`

## Still requires other members

- Real messaging / Contact → Member messaging module
- Auth-gated edit routes → Member 1 AuthProvider
- Permanent router, header, logo, footer → Member 1 layouts + Member 4 public chrome
- Client dashboard “Leave a review” CTA wiring → Member 3 imports `LeaveReviewModal`
- Committee ticket assignment / disputes → Member 3
