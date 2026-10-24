
---
title: AI Features
type: module
status: planned
tags: [MIU, AI, matching, chatbot]
---

# AI Features

## 1. Purpose

Describe planned AI-assisted platform capabilities and related human oversight.

AI features are intended to assist users and administrative reviewers, not eliminate accountability.

**SRS references:** FR-S04, FR-S15, FR-C07, FR-C16, FR-AQ02–FR-AQ05, NFR-11, NFR-12.

## 2. Planned AI Capabilities

### 2.1 Identity Verification Assistance

Potential capabilities:
- Document recognition
- Live-face comparison
- Liveness analysis
- Verification status assistance

Human review remains available through the Verification Committee.

See [Verification](VERIFICATION.md).

### 2.2 Skills Matching

Recommend suitable:
- Projects to students
- Freelancers to clients
- Services to clients

Potential matching inputs:
- Skills
- Project requirements
- Service categories
- Profile information
- Availability

Recommendation methods, scoring, and fairness evaluation require later design.

### 2.3 AI Chatbot

#### Phase 1 authenticated widget — 24 October 2026

`frontend/src/features/chatbot/ChatbotWidget.jsx` is mounted once alongside
`AppRouter` inside the existing `AuthProvider` in `src/App.jsx`. It uses
`useAuth()` and the existing `isActiveUser` helper. Only active authenticated
accounts with recognized roles see it, including pending-verification accounts.
It spans public, authentication, application, administration and standalone
marketplace layouts without adding routes, providers or changing access guards.

The floating launcher opens a nonmodal panel and minimizes/reopens it. A welcome
message, five suggested questions and a visible notice explain that responses
are simulated predefined guidance, not a real AI service. The panel reuses shared
Button, Input and Card components. Keyboard focus moves to the input on open and
returns to the launcher on minimize/Escape. A polite conversation log announces
new messages; replies do not repeatedly move keyboard focus.

Visual redesign (24 October 2026, ELECTRA reference layout): the existing widget
uses light white/blush surfaces, deep maroon `#800020` accents and MIU Assistant
branding. Its launcher is a circular mascot-only button with an accessible name
and tooltip. The header includes the mascot, title, an X minimize control and a
status dot explicitly labeled "Ready to help · Simulated"; it does not claim a
live agent. No timestamps are invented. The simulation note remains above the
transcript. Assistant/user bubbles are differentiated, with structured icon
compact action buttons directly above a horizontal input/send bar. The quick-start
section uses smaller padding and 40px inline-icon buttons, giving the message stream
more room. Assistant messages stay white; user bubbles and the launcher retain maroon.
The supplied original JPG lives in `features/chatbot/assets/miu-assistant-character.jpg`
and is reused in the launcher, header and assistant-message portraits with
empty alternative text because their neighboring controls/text name the assistant.
The asset is bundled locally; no generated-image service or runtime image URL is used.
Shared Button/Input/Card APIs, session reconciliation, matching and conversation
behavior are unchanged. The panel is up to 490px wide and 780px tall within the
available viewport. A five-row grid uses `minmax(0, 1fr)` for the message stream;
only that stream scrolls vertically, fixing the nested panel/transcript scrollbars.
Quick actions use three columns, or two at very narrow widths. Short viewports
use a horizontal action strip to retain space for messages and input. Dynamic
viewport units, safe-area spacing and 16px mobile inputs support small screens.
Opening/closing and button transitions are
disabled under reduced-motion preferences. Browser visual, mobile keyboard,
focus and screen-reader checks still need separate acceptance.

Earlier redesign validation: all 13 chatbot tests and all 257 frontend tests passed;
lint, build and feature formatting checks passed. The build retains Vite's
JavaScript chunk-size warning (601.48 kB uncompressed). The in-app browser
timed out connecting to the local Vite preview, so no screenshot-based visual,
keyboard, mobile-keyboard or screen-reader acceptance is claimed for this update.

ELECTRA-layout validation: 13 chatbot tests and all 257 frontend tests passed;
lint, build, formatting and diff checks passed. Vite still reports the JavaScript
chunk-size warning (602.01 kB uncompressed) and a build-plugin timing advisory.
Live browser visual and keyboard acceptance of the new layout remains pending.

`chatbotModel.js` matches case-insensitive whole words/phrases against ordered topics:
verification/account access, proposals, services/orders, projects, then general
navigation/help. Sign-in and log-in phrases select account-access guidance.
Projects require explicit project/job wording or the phrase "find work"/"finding
work"; generic "work" and "browse" alone do not match. The first matching topic
wins; messages without a supported match receive a
fixed fallback listing supported topics. Blank input is rejected, and messages
are limited to 500 characters including surrounding whitespace before trimming.
User text is rendered through React text nodes. The assistant never reads account
records or identity evidence, performs actions, reports account-specific outcomes,
or claims to send support requests. It creates no links to unconnected support
destinations. Human support/escalation integration remains planned.

Conversation, draft and open state live only in widget memory. Minimize and route
changes preserve them. Session reconciliation runs before rendering: logout,
expiry, inactive/invalid accounts or a changed account ID discard all prior text
and return the panel to its initial minimized state. Refresh clears everything.
No storage, cookies, network calls, backend, real inference or new dependencies
are introduced. Users are asked to use fictional, non-sensitive details only.

Feature-local model and Vite SSR tests cover deterministic matching, fallback,
input boundaries, immutable message pairs, session cleanup, role visibility,
escaped text, accessible markup and one App-level widget across layouts. These
do not establish live browser focus, screen-reader or mobile visual acceptance.
Run `npm.cmd test`, `npm.cmd run lint` and `npm.cmd run build` from `frontend/`.
This simulation supports FR-S15/FR-C16 and P-20; it does not complete production
AI, translation, messaging, quality-review or escalation requirements.

Verification on 24 October 2026: `npm.cmd test` passed all 253 tests (including
9 chatbot tests), `npm.cmd run lint` passed, and `npm.cmd run build` passed with
Vite's bundle-size warning (JavaScript chunk above 500 kB). Feature/App formatting
and `git diff --check` also passed. Live browser interactions, keyboard focus,
screen-reader announcements and mobile visual acceptance were not performed.

The chatbot should help users:
- Navigate the platform
- Understand proposals
- Understand services and orders
- Find relevant help information
- Understand verification steps
- Find support channels

The chatbot should not invent verified financial or account decisions.

### 2.4 Comment Moderation Assistance

AI may flag potentially problematic:
- Comments
- Reviews
- Marketplace text
- Reported content

Human reviewers should be able to inspect and override AI-assisted flags.

### 2.5 Translation Assistance

Planned translation may cover:
- Interface text
- Messages where supported
- User guidance

When message translation is provided, the original text should remain accessible.

### 2.6 AI Quality Monitoring

The AI and Quality Committee reviews:
- Recommendation issues
- Chatbot failures
- User feedback
- Moderation false positives
- Moderation false negatives
- Error reports
- Service incidents

## 3. Phase 1 Mock Implementation

Demonstrate AI-related experiences using:
- Predefined suggestions
- Mock matching scores
- Canned chatbot responses
- Sample moderation flags
- Fake verification outcomes
- Mock AI quality reports

Do not send real identity documents to unapproved AI services.

## 4. Transparency Rules

### Phase 1 skills-matching demonstration — 24 October 2026

`/recommendations` is a public, opt-in demonstration for FR-S04 and FR-C07. Visitors choose projects, services or student service providers, plus skills and/or a category. No choices are inferred from the current account. Until a choice is made, the screen gives guidance rather than presenting invented personalized results.

The local deterministic model counts unique selected skill tags shared by each listing. Category is a strict filter; if skills are selected, at least one must overlap. Only open projects and published services are considered. Results sort by shared selected-skill count, then title/name and stable ID. Category-only matches are alphabetical. No confidence percentage, qualification score or success probability is displayed; price does not affect ranking. Each card explains its matched tags/category and identifies partial overlap.

Providers are matched through their best single published service, with that service's description, price and registered detail link. Tags across unrelated services are not combined. Full profiles, availability and reputation remain dependent on Member 5 identity alignment, as documented in [Freelancer Discovery](FREELANCER_DISCOVERY.md). These results do not certify skills or complete FR-C06.

The page observes the existing in-memory project and service stores. Closing/accepting a project or pausing a service removes it from eligible results. Refresh clears demo state. The model reads public listing fields and public provider identity only; it does not use identity evidence, credentials, private profiles, messages, order history or review data.

Helpful/Not relevant buttons record reversible card-local feedback only. The interface explicitly states that feedback is not sent or used for training; it resets on changed matching inputs/results or navigation. No production feedback service, committee escalation endpoint or learning model is claimed. Visitors can browse all catalogues independently, inspect original listings and make their own decisions. Suggestions never apply, order, pay, enforce access or modify marketplace records.

Shared form, card and feedback-state components support labeled choices and loading/error/empty presentations. Automated model tests cover visibility, overlap reasons, sorting, same-service provider matching, invalid preferences, missing prices and live project lifecycle data. Static rendering checks cover routing, one public shell, disclosure, escaping, result-card reasons and recovery states. Interactive browser, mobile, keyboard and screen-reader acceptance remains deferred at Mina's request. Production matching methodology, fairness assessment and human escalation remain planned; this demonstration does not establish production compliance with NFR-11/NFR-12.

- Label AI-assisted information.
- Explain when results are simulated.
- Provide feedback options.
- Do not silently enforce consequential decisions.
- Provide human review or escalation.
- Record relevant review outcomes.

## 5. Privacy Requirements

- Limit collected information.
- Avoid unnecessary sensitive inputs.
- Do not expose identity evidence publicly.
- Do not retain data without an approved basis.
- Avoid exposing private user messages to unrelated roles.

## 6. Future Quality Evaluation

Before production use, evaluate:
- Accuracy
- False positives
- False negatives
- Fairness
- User experience
- Reliability
- Security
- Privacy compliance
- Failure handling

## 7. Open Decisions

- AI providers and models
- Matching methodology
- Supported languages
- Moderation policy
- Verification thresholds
- Human review thresholds
- Feedback retention
- Quality metrics
- Provider costs

## Related Documents

- [Verification](VERIFICATION.md)
- [Admin and Committees](ADMIN_AND_COMMITTEES.md)
- [SRS](../01-PROJECT/SRS.md)
