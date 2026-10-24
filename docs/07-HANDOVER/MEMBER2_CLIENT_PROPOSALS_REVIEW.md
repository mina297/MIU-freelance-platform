# Member 2 client proposals — handover checklist

Branch: `feat/m2-client-proposals`.
Reviewed implementation commit: `d132b95`.
Requirements: FR-C05 (proposal review/decisions); FR-C06 remains dependent on profiles.

## Implemented scope

- Owned-project incoming proposals, search, status filtering and sorting.
- Comparison of two or three offers; reversible simulated shortlisting.
- Confirmed acceptance/rejection with current role, ownership and status checks.
- Acceptance selects the project and creates one immutable order awaiting payment.
- Repeated acceptance returns the same order; other offers keep their statuses.
- Read-only project-order handoff for the client and selected student.
- Live order commitment checks prevent cancelling/closing committed projects.
- No actual hiring, notification, payment, escrow funding or delivery-start event.

## Automated verification

Verified against `d132b95`: lint passed, all 186 tests passed, and the production
build passed. No application-code changes were made during this handover review.

Run from the repository root:

```powershell
npm.cmd --prefix frontend run lint
npm.cmd --prefix frontend test
npm.cmd --prefix frontend run build
```

Store and rendered-route tests cover filtering/sorting, shortlist transitions,
acceptance/rejection, failed handoffs, duplicate prevention, ownership and participant
privacy, student status feedback, discovery changes and cancellation safeguards.
These do not establish that browser interactions, focus or responsive appearance pass.

## Browser acceptance — pending

The browser inventory returned no browsers. Opening `chrome` and `iab` both returned
`Browser is not available`. No browser screenshots, clicks, keyboard interactions
or visual acceptance checks were completed. The cases below remain unchecked.

Start the application with `npm.cmd --prefix frontend run dev`. Use fictional demo
sessions; keep navigation in the same tab without refreshing during each scenario.
Refresh between independent scenarios to restore fixtures.

- [ ] Start Nile Studio's client demo session. Open
  `/client/projects/project_001/proposals` and confirm Salma's fixture proposal appears.
- [ ] Try name/message search, status filters, price/delivery sorting, and Reset filters.
- [ ] Switch to Omar Nabil via the demo session controls, without refreshing. Submit
  a fictional offer at `/projects/project_001/propose`, then switch back to Nile Studio.
  Confirm both proposals appear in review.
- [ ] Select the two offers for comparison. Verify prices, delivery, statuses and
  approach text. Change filters and confirm the comparison remains selected; clear it.
- [ ] Shortlist/remove shortlist. Under the Submitted filter, shortlist an offer and
  verify the result is announced and focus moves to Incoming proposals after its card disappears.
- [ ] Open Accept offer, then dismiss with Keep proposal unchanged and Escape.
  Verify no project/proposal/order state changes, focus returns, and background scrolling resumes.
- [ ] Confirm acceptance. Verify Accepted, project selection, one awaiting-payment
  order, and the copied proposal price/delivery estimate. Try rapid repeat activation.
- [ ] Open View demo order as Nile Studio and then as the selected student. Confirm
  both can see it; an unrelated student cannot see order details at that URL.
- [ ] Return to My projects and confirm the selected project cannot be edited,
  closed or cancelled. It must be absent from open-project discovery.
- [ ] Refresh for a separate rejection case. Dismiss Reject offer first, then confirm.
  Verify only that proposal becomes Rejected and no order is created.
- [ ] Test Tab/Shift+Tab inside each dialog, visible focus, and focus after confirmation.
- [ ] Review at desktop, tablet and 375–400px mobile widths. Verify no page overflow,
  usable controls and deliberate horizontal scrolling inside the comparison region.
- [ ] Switch student/client sessions while visiting protected pages; ensure prior
  account/project comparison state and private details do not remain visible.

## Dependency and follow-up boundaries

The current branch has no student-profile implementation or registered student
profile route. FR-C06 cannot be marked complete or linked until Member 5 provides
that route. The review page states that profiles are unavailable in this preview.

`/orders/:orderId` currently handles project orders only. Full service/project
collaboration, checkout, escrow and delivery workflows remain separate features.
The temporary Member 1 home page still needs its own live marketplace-state adapter;
this checklist does not treat that page as the project-review state provider.

## Suggested PR text

Title: `feat: add client proposal review and simulated project order handoff`

Clients can review proposals on their own projects, filter/sort offers, compare up
to three proposals and manage a shortlist. Confirmed acceptance selects the project
and creates one participant-protected demo order awaiting payment; rejection changes
only the selected offer. All changes are in-memory and reset on refresh.

Validation: attach the current lint, test and build results. Browser acceptance is
pending because no browser connection is available. FR-C06 profile navigation and
full order/financial workflows remain separate dependencies; no production hiring
or money movement is implemented.

Do not describe the branch as fully browser-verified until the checklist is completed.
