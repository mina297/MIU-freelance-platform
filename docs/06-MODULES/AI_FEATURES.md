
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
