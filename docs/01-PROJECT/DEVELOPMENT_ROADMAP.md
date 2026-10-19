
---
title: Development Roadmap
type: roadmap
status: planned
tags: [MIU, roadmap, development]
---

# MIU Freelance Platform — Development Roadmap

## Objective

Deliver an understandable, maintainable university freelance platform through staged implementation.

This roadmap describes the team's planned delivery approach. Only the instructor's communicated Phase 1 submission requirements should be treated as confirmed academic obligations.

## Phase 1 — Requirements, Design, and Frontend

**Primary goal:** Establish the requirements and demonstrate the proposed user experience.

### Academic Requirements

- [ ] Complete the Phase 1 SRS
- [ ] Include Preface and Introduction
- [ ] Compare similar systems
- [ ] Document functional user requirements
- [ ] Document non-functional user requirements
- [ ] Prepare prototypes of all forms/pages
- [ ] Review and rehearse the Phase 1 discussion

### Frontend Development Objective

- [ ] Initialize the React/Vite application
- [ ] Define the design system and shared components
- [ ] Build public pages and account screens
- [ ] Develop project/proposal interfaces
- [ ] Develop services/order interfaces
- [ ] Build student and client dashboards
- [ ] Build Super Admin and committee dashboards
- [ ] Add verification and AI demonstration interfaces
- [ ] Add checkout and escrow simulations
- [ ] Integrate mock data and role-based navigation
- [ ] Test required responsive breakpoints
- [ ] Capture prototype screenshots
- [ ] Complete final Phase 1 review

### Phase 1 Exit Criteria

- SRS sections satisfy the instructor's requirements.
- Prototype inventory is covered.
- Demonstrated workflows are accurately labeled as simulated.
- Documentation aligns with the visible UI.
- Known limitations are recorded.

## Phase 2 — Backend and Integrations

**Primary goal:** Replace approved mock workflows with secure application services.

Planned work:
- Backend framework and API architecture
- Persistent database
- Secure authentication
- Server-side role permissions
- Projects, proposals, services, and orders
- Messaging and file management
- Notification services
- Audit logs
- Approved verification integration
- AI assistance integration
- Approved payment sandbox integration

### Phase 2 Exit Criteria

- Critical operations use persistent data.
- Authorization is enforced server-side.
- Integration tests cover marketplace workflows.
- Sensitive data follows approved handling rules.
- Payments remain controlled by appropriate approval and sandbox policies.

## Phase 3 — Mobile, Testing, and Delivery

**Primary goal:** Complete validation and prepare the platform for future ownership.

Planned work:
- Responsive experience refinement
- Capacitor packaging
- Mobile-specific testing
- Security review
- Accessibility and performance review
- Integration and regression testing
- Deployment preparation
- Maintenance documentation
- Final academic demonstration and handover

## Cross-Phase Practices

Throughout development:
- Keep the SRS traceable.
- Review changes before merging.
- Update module documentation.
- Track known issues and decisions.
- Protect secrets and personal information.
- Use peer review.
- Maintain reproducible test scenarios.

## Milestones

| Milestone | Expected Evidence |
|---|---|
| Requirements baseline | Approved or reviewed SRS |
| Prototype readiness | Complete page inventory and screenshots |
| Frontend integration | Navigable mock application |
| Backend foundation | Verified API and database integration |
| External integration | Approved sandbox/provider tests |
| Mobile readiness | Tested Capacitor package |
| Handover | Complete developer and maintenance documentation |

No unconfirmed dates are assigned to these milestones.

## Dependencies and Risks

| Dependency | Possible Impact |
|---|---|
| Design approval | Frontend rework |
| Provider selection | Integration changes |
| University approval | Verification and deployment restrictions |
| Payment/legal approval | Live payments unavailable |
| Security review | Additional implementation work |
| Team availability | Schedule changes |

## Related Documents

- [Project Scope](PROJECT_SCOPE.md)
- [SRS](SRS.md)
- [Testing Strategy](../05-DEVELOPMENT/TESTING_STRATEGY.md)
- [Maintenance Guide](../07-HANDOVER/MAINTENANCE_GUIDE.md)
