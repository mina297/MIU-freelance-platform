# Freelance Checkout and Escrow UI

Frontend demonstration of FR-C08, FR-C09, FR-C11, FR-C13 and NFR-07, NFR-10,
NFR-13, NFR-14 and NFR-18. This is not production payment processing.

## Implemented journey

1. Open `/Checkout` (case-insensitive `/checkout` also works). Visitors can
   explicitly start the existing fictional `client_001` session with **Start
   client demo**, or use the existing login flow. Signed-in non-client accounts
   cannot pay. No payment records can be created anonymously.
2. `/checkout/:orderId` is client-only. Checkout rechecks ownership and accepts
   service orders awaiting initial payment. Missing, project-source or another
   client's orders are unavailable. `/Checkout` uses `order_002` as its example.
3. Checkout reads the live canonical `orderStore`, including newly confirmed service
   orders. New orders use their immutable `serviceTerms`, even if the listing later
   changes or disappears. Older fixture orders retain the existing package/extra
   lookup. The seeded example is Responsive landing page design, Salma Farid,
   EGP 1,800 package + EGP 400 extra, EGP 2,200 total and nine-day delivery.
4. Select Visa, Mastercard or simulated Apple Pay. Saved cards are masked fictional
   records. New-card fields are read-only and populated from valid/expired sample
   presets; no real card details, credentials or wallet accounts are collected.
5. Review the agreed price, initial 50%, remaining 50% and fees. A zero fee is a
   clearly marked demo placeholder because approved rates are undecided. No
   shipping, tax or discount policy is invented for the agreed digital service.
6. Confirm a clearly labeled **demo payment**. A short local processing state
   disables confirmation. Failure and cancellation preserve form selections for
   retry, create no transaction and leave the order awaiting payment.
7. Success records EGP 1,100 as **Held in Escrow**, with EGP 1,100 remaining. The
   service becomes **In Progress**, with **Partially Paid — Escrow Held** status.
   Its work-completion progress starts at 0%; no delivery has been accepted.
   Open the order workspace to use the existing participant-only messages and
   delivery/revision/acceptance flow. Delivery submission/acceptance still requires
   the existing approved verification and assigned student/owning client checks.
8. Follow the confirmation links to `/client/payments/overview` or `/client/payments`.
   The dashboard displays service orders, paid/held/remaining balances, payment
   dates, progress and recent payments. History supports search, transaction
   details, empty results, and demo loading/error previews with recovery.
9. Revisiting a funded checkout displays its existing confirmation. Repeated
   confirmations return the same transaction; they never charge a second
   installment or release funds.

## Funding policy for this frontend task

The requested initial funding is 50% of the agreed service order, with the other
50% remaining unpaid. This is a documented frontend demonstration decision, not
an assertion that the SRS has finalized a production installment policy.
Amounts use integer EGP minor units. If an odd piastre cannot split evenly, the
initial installment receives the extra piastre and the remainder is complementary.

Funds remain held until agreed milestone or completion conditions are met.
The existing order workspace supports delivery and completion. Acceptance does not
release escrow, charge the remaining balance or create a payout. There are no
timers that advance work or release money.

## Shared state and privacy

- `orderStore.js` is the canonical in-memory source for order lifecycle and its
  immutable `initialPayment` receipt. Successful funding commits the receipt and
  `in_progress` transition together, before notifying subscribers. Repeated funding
  returns the same receipt without rewinding later delivery/completion states.
- `checkoutStore.js` projects cached `{ orders, transactions }` snapshots from that
  store; it owns no second status or transaction collection. `useCheckoutSnapshot`
  subscribes through React's external-store hook. Marketplace seeds are not mutated.
- Records contain stable transaction/order/service/participant IDs, EGP minor-unit
  amounts, payment date, method, last four digits if applicable, demo flag, and
  explicit payment/service/escrow statuses. CVC, full card numbers, holder names,
  expiry and credentials are excluded from transaction records.
- Receipt `serviceStatus`, `completedAt` and `workProgress` describe funding time,
  not current work state. All current UI status/completion displays use the live
  order; order completion leaves the financial receipt and held balance unchanged.
- The store revalidates active client role, ownership, payable order status and
  payment selection. History selectors return only the active client's records.
- State survives frontend route navigation. Reloading clears both the existing
  mock authentication session and payment records. Nothing is written to browser
  storage and no payment API is called.
- Existing project orders, project/proposal functionality, administrative routes
  and shared session switching are preserved. The client dashboard increment is
  limited to service orders and their financial history.

## Visual design and validation

Uses the website's Inter font, white/light gray surfaces, MIU black summary and
crimson accents, shared Cards, Buttons, Fields, Badges, StatCards, DataTable and
feedback components. Desktop has two columns; mobile stacks with no page overflow.

[Upwork's milestone guide](https://support.upwork.com/hc/en-us/articles/211068218-How-to-use-milestones-in-fixed-price-jobs)
informed the funding/review cues. Upwork branding, production fees, time limits
and automatic release rules are not adopted.

Checks: `npm run lint`, `npm run build`, `npm test` in `frontend/`. Model/store
tests cover pricing, rounding, ownership, credential exclusion, failure/retry and
idempotency. Route rendering tests cover access and shared payment history.

Browser smoke check (uses an externally available Puppeteer harness and Chrome;
does not add project dependencies):

```sh
node scripts/check-checkout.mjs <puppeteer-module-path> <chrome-executable> http://localhost:5173
```

It verifies payment methods, validation, outcomes, navigation, duplicate prevention,
history/details/search/loading/error states, role changes, refresh reset and five
viewport sizes. Source files use LF.

## Files changed in this increment

- `frontend/src/features/checkout/`: `CheckoutPage.jsx`, `PaymentForm.jsx`,
  `OrderSummary.jsx`, `EscrowProgress.jsx`, `checkoutModel.js`, `checkoutStore.js`,
  `useCheckoutSnapshot.js`, `checkout.css`, `escrow-progress.css`,
  `checkoutModel.test.js`, `checkoutStore.test.js`.
- `frontend/src/features/dashboards/ClientPaymentsDashboard.jsx` and
  `frontend/src/features/dashboards/client-payments.css`.
- `frontend/src/app/router.jsx`, `frontend/src/app/routeConfig.js`,
  `frontend/src/tests/checkoutRoute.test.js`, `frontend/scripts/check-checkout.mjs`.
- `docs/02-REQUIREMENTS/BUSINESS_RULES.md`, `docs/03-DESIGN/PAGES_AND_ROUTES.md`,
  `docs/04-ARCHITECTURE/DATA_MODELS.md`, `docs/06-MODULES/PAYMENTS_AND_ESCROW.md`,
  `docs/06-MODULES/SERVICES_AND_ORDERS.md`, and this document.

Verified on this increment: lint, Prettier check, production build and all 175
Node tests passed. Chrome smoke tests passed at 1440, 1024, 768, 390 and 320px,
with no API requests or browser runtime errors. Byte checks confirm LF in all
23 task files. Git's existing system `core.autocrlf=true` still warns about future
CRLF conversion; Git configuration and unrelated files were not changed.
