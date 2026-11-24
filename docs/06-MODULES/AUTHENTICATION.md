
---
title: Authentication Module
type: module
status: planned
tags: [MIU, authentication, accounts]
---

# Authentication Module

### Post-registration profile setup — 24 November 2026

Next from `/profile/setup` now opens the student-only `/profile/setup/work` step
after a manual choice or valid resume/LinkedIn file selection. The new page follows
the supplied work-category reference with MIU branding, progress, an
introduction, a category card, shared Dropdown and Back/Next controls. Categories
use the twelve onboarding fields from the approved reference: Accounting & Consulting,
Admin Support, Customer Service, Data Science & Analytics, Design & Creative,
Engineering & Architecture, IT & Networking, Legal, Sales & Marketing, Translation,
Web, Mobile & Software Dev, and Writing. Existing design, development and writing
IDs remain stable; this onboarding list does not change marketplace filters.
The dropdown focuses a search input when opened and filters English or translated
labels without changing the selected category. Search resets when reopened;
unmatched searches show a recovery message. Its options scroll below the search.
The category field and its label are centered with a maximum width of 560px,
shrinking to the available content width on smaller screens.
Next requires a listed category;
it saves the selection to the existing session draft and opens `/profile/edit`.
The selected category initializes an empty student headline, which remains editable;
existing saved headlines are preserved. No account role or verification changes.
Back returns to the start with the method/file intact. Category and per-step scroll
positions persist in memory for the active session. A direct work-step visit
without a completed start returns to `/profile/setup`. Onboarding now describes
four stages: Get started, Type of work, Profile details and View your profile.
Both setup pages use the same header and numbered progress component. The red
active ring marks 1 on the method page and moves to 2 on Type of work; Back marks
1 again. Earlier steps remain filled crimson and their connecting segments turn
crimson up to the current step, forming a continuous sequence. Future steps and
connectors stay neutral. Logical positioning preserves this sequence in RTL.
The separate work-step progress bar is removed.
Type of work uses the same full-width framed panel as the first step, with a
crimson side border, tinted icon/title header and Step 2 of 4 badge. Introduction,
category form and Back/Next footer sit inside this single frame. Its overflow
remains visible so the shared category dropdown is not clipped by the card.
Related requirement: FR-S03. No automatic job matching or profile publication is
performed by choosing a category. Browser/real-device acceptance remains separate
from draft, role, category-validation and rendered-screen checks.

Interface copy follows the latest site-wide editorial wording in
`i18n/productCopy.js`: the footer describes progress/session lifetime
without development labels. Resume guidance explains that the file stays on the
device and profile details are entered on the next page. Capabilities and
student-only access are unchanged.
The section subtitle and the separate resume/manual-entry note are omitted at
the user's request.
Method cards omit the Ready to start tag. LinkedIn opens file selection rather
than an external account connection.

The latest sizing adjustment uses a compact 1000px container, 40px progress
circles and 16px method titles. The latest header follows the Admission reference:
“Let's build your profile” is a bold, centered title (20–24px), immediately followed
by “Please complete all required fields carefully.” in muted text (13–15px).
The logo link has no bottom margin or inline baseline gap; the title has no top margin.
The decorative tagline remains removed.
Header padding and the gap before progress are reduced. Header, card and footer
spacing is reduced while primary controls retain a 44px minimum height. Mobile
cards still stack and footer actions can wrap. The production build passed;
this presentation adjustment has not been visually verified in a live browser.

Successful student email and fictional Google-preview registration opens the
student-only `/profile/setup` page. Client registration opens `/`; clients and
all other roles are denied direct access to `/profile/setup`. This supersedes the
earlier shared registration redirect. Login continues to open `/`.
The MIU Admission-inspired introduction shows numbered
progress and three profile-building cards. Manual selection enables Next to the
existing owner-only `/profile/edit` form. Selecting Upload your resume reveals a
keyboard-accessible picker/drop zone beneath the method cards, matching the supplied
reference. It accepts one nonempty PDF, DOC or DOCX up to 5MB, shows its filename,
supports replacement/removal and reports recoverable validation errors. Only
filename/size metadata lives in component state; contents are never read, sent or
stored. Next requires a valid selection and opens the existing editor, with an
explicit notice to complete details manually. Selecting Import from LinkedIn
shows Upload LinkedIn profile, instructions to save the profile as PDF, and the
same drop zone restricted to a nonempty PDF up to 5MB. This is manual file
selection; LinkedIn account connection and automatic extraction remain planned.
Both file methods retain only filename/size metadata, and switching methods
clears the previous selection.

At widths up to 700px, selecting either file method opens a bottom sheet instead
of the inline drop zone. The sheet reuses shared Modal for focus containment,
Escape/backdrop/close-button dismissal, focus return and background scroll locking.
It shows the matching title, instructions and file limits above Choose a file.
A valid file closes the sheet and leaves its filename/Change file control on the
page; invalid files retain the sheet with a specific error. The selected card can
be tapped again to reopen it. Dismissing the sheet with its close button, backdrop
or Escape clears the active file method, filename and validation message.
Cancelling only the native file picker keeps the sheet and current selection.
The page does not show an extra Choose a file link below the method cards; that
control appears only inside the sheet. A selected filename retains Change file.
Desktop keeps the inline drag/drop presentation. The sheet fits its content with
a dynamic viewport height cap and safe-area padding; viewport-fit=cover enables device insets without
disabling zoom. Validation and student-only access remain unchanged. Shared modal
and compact-uploader markup are covered automatically; phone-based interaction,
native file picker and safe-area review still require real-device acceptance.

Returning to `/profile/setup` within the same active student session restores the
chosen method, resume filename/size, validation feedback and scroll position.
Switching browser tabs does not reset the page or refocus its heading. A
session-keyed in-memory draft preserves this state across route unmounts without
browser storage or file contents. New logins, other accounts and refresh do not
inherit it; authentication remains memory-only. Scroll restoration runs after
the restored content is laid out. Automated draft tests cover isolation,
restoration and metadata sanitization; live browser acceptance remains pending.

Do this
later returns to `/`. Language/theme controls are omitted from this focused setup
header at the user's request; the page inherits the current app preferences.
The shell includes keyboard focus
and responsive card stacking; it excludes workspace navigation.

Student/client registration initializes an empty memory-only public profile shell
using only ID, display name and role. The editor and role-specific public lookups
consume it alongside existing fixtures. No verified badge, skills, reviews, jobs
or portfolio are invented. Saving uses the existing allowlisted owner-checked
editor and opens the matching public profile. Unique registration IDs prevent a
fresh account from inheriting prior sessionStorage edits. Refresh clears accounts,
sessions and new profile shells; the existing profile-edit sessionStorage behavior
remains disclosed. No credentials or private registration fields are published.

Related requirements: FR-V03, FR-S01, FR-S03, FR-C01, FR-C03, NFR-02/NFR-03.
Automated coverage checks profile creation/resolution, editor rendering, default
selection, planned imports, ID isolation and permissions. Live setup, keyboard and
mobile acceptance remain pending: the current dev server timed out in preview and
desktop Chrome. This is frontend demonstration work, not production onboarding.

### Google sign-up completion preview — 19 November 2026

The registration Google button now opens `/register?role=student&method=google` or the corresponding client query on the existing route. The website-styled completion card shows a fictional role-specific identity, Country, optional email preference, required unchecked agreement with the existing policy links, Create my account, Use email instead and Sign in. Keyboard entry focuses its heading; role selection and the admin-managed country list are preserved. The regular email form and Google sign-in notice retain their existing behavior.

This is explicitly a Phase 1 preview, without Google OAuth, network calls, tokens, real identity selection or email delivery. `registerGoogle()` derives its identity from fixed fictional profiles, validates public role/country/consent and duplicate emails, and creates an active, pending-verification memory-only account through the existing store and provider. It starts a session and opens `/`, as email registration does. It sets no password, and supplied identity/status/credential overrides are ignored; ordinary email registration still requires its password. Repeat creation of the preview identity shows a recoverable form message. Refresh discards the account. The account emails do not establish Google ownership or MIU affiliation. Screenshot identities are not copied.

Related requirements: FR-V03, FR-S01, FR-C01, NFR-02/NFR-03. Policy approval and Arabic translation approval remain open. Browser focus, click-through and responsive visual acceptance remain pending. This supersedes the earlier sign-up-button-notice description below; Google sign-in remains unavailable.

Verification: production build and ESLint passed, along with all 30 tests across `googleRegistration.test.js`, `session.test.js` and `routeRendering.test.js`. Coverage includes country/consent validation, duplicate rejection, role restrictions, fixed fictional identities, no generated password or session secrets, memory reset, both completion screens and the existing email-registration/login/recovery regressions. Browser interaction and visual checks were not run.

## 1. Purpose

Manage the intended account access experience for students, clients, Super Admin, and committee members.

**SRS references:** FR-S01, FR-C01, FR-A01, FR-VC01, FR-MO01, FR-FC01, FR-SD01, FR-AQ01.

## 2. Supported Roles

- Student Freelancer
- Client
- Super Admin
- Verification Committee
- Marketplace Operations Committee
- Finance Committee
- Support and Disputes Committee
- AI and Quality Committee

Visitors can browse public content without logging in.

## 3. Public Registration

Public registration must offer:
- Student account
- Client account

Registration should collect the approved required information and validate the submitted fields.

There must be no public committee registration option.

## 4. Login

The login interface should:
1. Accept authorized credentials.
2. Validate required fields.
3. Show understandable failure messages.
4. Identify the active user role.
5. Navigate to the appropriate dashboard.

Phase 1 simulates these operations with mock accounts.

## 5. Password Recovery

Planned flow:
1. User selects Forgot Password.
2. User submits an account email.
3. The system initiates a password reset process.
4. User follows a secure reset link in a later production system.
5. New password is validated.
6. User receives confirmation.

Phase 1 displays simulated results without sending real reset emails.

## 6. Committee Accounts

Committee accounts are created only by Super Admin.

Recommended provisioning process:
1. Super Admin creates the account.
2. Super Admin assigns a committee role.
3. A secure invitation is issued.
4. Member activates the account and sets a password.
5. Member logs in.
6. Member accesses only the assigned committee dashboard.

The invitation mechanism is a proposed security design, not an approved implementation detail.

## 7. Account States

Relevant concepts:
- Pending Verification
- Approved
- Rejected
- Active
- Suspended
- Deactivated

Verification and account-access states should be distinct where necessary.

## 8. Phase 1 Mock Behavior

The frontend may provide:
- Demo account selection
- Simulated login
- Role-aware navigation
- Mock session state
- Access-denied page
- Mock password reset success
- Account-status messages

Never use real passwords or real identity documents as demo data.

### Task 01 routing/session foundation

Implemented scope (22 October 2026):

- `frontend/src/features/auth/session.js` defines the JSDoc `MockUser`/`MockSession` contracts, role vocabulary, public registration roles, session reducer and route access helper. It is separate from Member 2's marketplace contracts.
- `AuthProvider` is the sole session source. `useAuth()` exposes `session`, `startDemoSession(userId)`, `logout()` and `expireSession()`. Role access is derived from `session.user.role`; there is no separate role provider.
- Sessions are memory-only and reset on refresh. Explicit expiry clears the user. No credentials, tokens, storage or automatic expiry timers are involved.
- Account access uses `active`, `suspended`, `deactivated`; verification status remains separate and does not gate routes in this task. These are demo contracts, not approved production transition policies.
- Fictional account fixtures preserve marketplace participant IDs and names. Committee fixtures represent provisioned demo accounts, not registration options. Public registration roles are only `student` and `client`.
- Protected routes check active account status and allowed roles, including distinct access for each committee. Unknown roles and inactive accounts are denied. Ownership checks are deferred until the corresponding feature routes are integrated.
- Minimal layout outlets, role-filtered demo links and routing feedback are present. Login, registration, reset and verification screens remain placeholders; no complete authentication requirement is claimed.

Role values are `student`, `client`, `super_admin`, `verification_committee`, `marketplace_operations_committee`, `finance_committee`, `support_disputes_committee`, and `ai_quality_committee`. Session states are `anonymous`, `authenticated`, and `expired`, with `user: null` outside an authenticated session. Verification values are `pending`, `approved`, `rejected`, `resubmission_requested`, and `escalated`.

Contract tests live in `frontend/src/tests/session.test.js` and `routeAccess.test.js`. Run them alongside the existing marketplace tests using the command in the frontend README.

### Task 02 mock authentication

Email validation update (24 October 2026): the shared authentication validator requires at least two letters after the final domain dot. Registration, login, forgot-password and reset-password reject addresses such as `svvvvvvvv@miu.c` while accepting suffixes such as `.co`, `.com` and `.edu.eg`. This validates syntax only, without checking mailbox ownership or domain availability.

The five authentication routes render frontend demonstrations. The Student and Client registration forms collect first name, last name, email, password, country, optional email preference, and required prototype agreement. Password fields support show and hide controls. The store requires a valid email, at least eight password characters including a letter and a number, case-insensitive email uniqueness, a country from the current list, and explicit agreement. It also rejects privileged or unknown roles independently of the form controls (FR-V03, FR-S01, FR-C01).

Egypt is selected by default. The Super Admin can add options for the current app session through Registration settings. The email preference defaults to checked. The agreement starts unchecked and links to the existing public Terms and Privacy placeholders, including the User Agreement section under Terms. The checkbox demonstrates validation while policy approval remains open under OD-13. Sign-up and sign-in show Google buttons that explain the Phase 1 limitation. The preview sends no email and performs no Google authentication.

Sign-up and sign-in use a compact header with the home logo. The Student/Client account-type dropdown appears only on the registration forms. Sign-in uses the same wide card presentation as sign-up and accepts credentials for all active account roles. Its role URL only preselects the destination of the Create an account link. The country dropdown searches the available labels, including translated labels, while registration validates against the current list.

The sign-up card pairs first and last name on wider screens and stacks all fields on narrow screens. Password follows email in a separate full-width row. Dividers separate the consent controls and Google preview from the account fields and primary action.

Student sign-up labels the field University Email and requires the exact `@miuegypt.edu.eg` domain, regardless of case. Client sign-up and the existing sign-in and recovery paths use general email validation. The prototype checks syntax and domain only.

`createMockAuthStore()` in `frontend/src/features/auth/mockAuth.js` creates one private account/password store per `AuthProvider` mount. `useAuth()` additionally exposes `register(values)`, `login(values)`, `forgotPassword(email)` and `resetPassword(values)`, returning `{ ok, errors?, message?, user? }`. There is no second provider or session source. Registration creates an active, pending-verification account and immediately starts its session without approving identity. Successful registration and login both open `/`, including when login has a prior return destination. Failed login clears a previous session. Logout and explicit expiry still clear only the session, so registered accounts remain usable until refresh.

Fixture IDs and marketplace participant names remain unchanged; provisioned staff display names now omit the "Demo" prefix. At runtime each fixture reserves the fictional address `<id>@example.test` (for example `student_001@example.test`) and initially has no password. The explicitly insecure prototype reset form can set an in-memory password for an active fixture at that address. Neither registration nor reset provisions committee accounts. Inactive accounts cannot reset passwords or authenticate. The temporary session selector is no longer rendered in the public/authentication layout; its source and provider methods remain available for later prototype tooling.

Forgot-password validates syntax and returns a simulated response for both known and unknown emails; no email is sent. Reset-password checks email, the agreed password rules and confirmation, then changes only an existing active in-memory account. **It checks no secure token or email ownership.** This is an intentionally labeled recovery demonstration, not production recovery. Passwords live only in the private mock store; they are not production-hashed, committed as fixtures, logged, placed in sessions, URLs or browser storage. Form password values are cleared after submission. Refresh/provider remount discards new accounts and password changes. Do not use real credentials.

Session records use an explicit field allowlist (`id`, `displayName`, `role`, `accountStatus`, `verificationStatus`). Account activity and verification remain separate; verification gating and automatic expiry timing remain deferred. No backend, notification service or persistent storage is introduced. Tests in `session.test.js` cover validation/account flows and safe navigation; `routeRendering.test.js` covers the five pages and retains the public catalogue regression. Browser interaction, responsive and accessibility verification must be recorded separately from these model/markup tests.

### Public navigation and onboarding update

Sign out in the public header or workspace account menu clears the active session and replaces the current history entry with the public homepage (`/`). Protected routes continue to require an active session.

24 October 2026: successful sign-up signs in automatically; both sign-up and sign-in navigate to the landing page. The shared landing/public header offers My workspace and Sign out for active sessions. Public and application layouts no longer mount session selectors, expiry simulators or demo route lists. Application pages reuse the public shell; route access checks remain in place. Existing prototype disclosures and memory-only account/session limitations remain applicable (FR-V03, FR-S01, FR-C01).

The public/authentication shell uses a shared header with Hire Talent and Find Work dropdowns, How it works, Sign In (`/login`) and Sign Up (`/register`). The dropdowns retain project/service discovery and student/client registration links. Temporary route lists and session controls are not rendered. Signed-in users retain a logout action below the header. The standalone marketplace routes retain their existing presentation.

`/register` opens Student/Client role cards. Their links open `/register?role=student` and `/register?role=client`; unknown/privileged role parameters return to selection. The form is bound to the selected public role, while the store retains independent role validation. `/register/role` remains a compatible selection URL. The Forgot Password? link sits directly below the login submit button. A syntactically valid forgot-password submission navigates to `/reset-password`, which explains that no email or secure token was issued. Email and password values are not placed in navigation state. The reset page still validates the existing in-memory account.

The Figma-based landing page is now rendered at `/` (23 October 2026). It reuses this public header and the existing session/logout behavior without changing authentication. Its Post a Job entry opens `/register?role=client`; it does not bypass role checks or implement project publication. See [Landing Page](LANDING_PAGE.md).

### Registration role card presentation

The `/register` and `/register/role` selection screens use concise copy and centered Student/Client cards with soft shadows (23 October 2026). Cards sit beside each other above 480px and stack on smaller screens. Each card has a rotating red perimeter light on hover or keyboard focus, a visible focus outline, and a static effect when reduced motion is requested. A short prototype label preserves Phase 1 transparency. Role links and registration validation retain the existing FR-V03, FR-S01 and FR-C01 behavior; no session or route contracts change.

### Authentication form presentation update — 23 October 2026

Sign-in, student/client sign-up and recovery forms share a centered card with soft shadows, rounded 15px input/button corners, concise labels and visible keyboard/error states. Required fields, autocomplete, password validation, disabled submission and error associations are retained. A single short footer identifies the frontend as a prototype and explains refresh resets and test-only details. Recovery retains explicit no-email/no-token and unchecked-ownership disclosures. Repeated explanatory copy is removed. User-facing "demo" wording is replaced across the application, including feedback, account labels and accessible search names; internal session APIs and account IDs are unchanged. Related requirements: FR-V03, FR-S01, FR-C01, NFR-02 and NFR-03. Live browser visual checks remain pending.

### Existing Super Admin demo login

`admin_001` already exists with role `super_admin`; Admin is deliberately not a
public registration option. Do not register a duplicate or change a student/client
role to gain access. Its fictional email is `admin_001@example.test`.

There is **no configured initial password**. In one running prototype session:

1. Open `/reset-password` and enter `admin_001@example.test`.
2. Choose a disposable test password with at least eight characters, a letter and
   a number, repeat it, and submit. No email or secure token is involved.
3. Follow **Back to sign in**, log in at `/login` using that email and the password
   just chosen, then use **My workspace** to navigate internally to `/admin`.
   Login itself opens the landing page; typing a URL with a full reload clears
   this memory-only setup.
4. Refresh discards the password and session; repeat setup afterward.

`/admin` is the protected dashboard and rejects ordinary student/client, inactive,
anonymous and expired sessions. `/SuperAdmin` is a separate public fictional
preview and does not demonstrate authenticated Admin access. No fixed password,
new privileged account or new authentication bypass is introduced. This entire
mock reset/authentication mechanism is not suitable for production deployment.
The model and SSR regression is `frontend/src/tests/demoAdminAccess.test.js`;
interactive browser acceptance remains separate.

## 9. Production Security Requirements

Future implementation must provide:
- Secure password hashing
- Server-side sessions or approved token strategy
- Server-side role authorization
- Password reset token expiration
- Secure account recovery
- Login abuse protection
- Administrative account provisioning
- Appropriate session invalidation

## 10. Screens

- Login
- Registration
- Role selection
- Forgot password
- Reset password
- Account verification status
- Access denied
- Session expired
- Account settings

## Related Documents

- [SRS](../01-PROJECT/SRS.md)
- [Roles and Permissions](../02-REQUIREMENTS/USER_ROLES_AND_PERMISSIONS.md)
- [Verification](VERIFICATION.md)
