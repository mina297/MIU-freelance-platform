
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
