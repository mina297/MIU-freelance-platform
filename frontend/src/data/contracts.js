/**
 * Member 2 marketplace record contracts for Phase 1 mock data.
 *
 * These JSDoc types describe data shared between marketplace screens. They do
 * not validate records at runtime or define a production database schema.
 * IDs refer to records owned by the relevant module; records are not copied
 * into each other. All monetary amounts are in Egyptian pounds (EGP).
 *
 * Status strings and workflow transitions are still proposed in the module
 * documentation. Do not treat a value used by a fixture as an approved rule.
 */

/**
 * A project published by a client (FR-C04, FR-S04).
 *
 * @typedef {object} Project
 * @property {string} id Stable project ID.
 * @property {string} clientId ID of the client who owns the project.
 * @property {string} title
 * @property {string} description Short public summary of the project.
 * @property {string} [scope] Detailed work requested by the client.
 * @property {string[]} [deliverables] Expected outputs. Optional for older mock records.
 * @property {string} categoryId ID of a marketplace category.
 * @property {string[]} requiredSkillIds IDs of relevant skills.
 * @property {number} budgetEGP Client's proposed budget in EGP.
 * @property {string} deadline ISO 8601 date (YYYY-MM-DD).
 * @property {string} status Proposed project workflow status.
 * @property {string} createdAt ISO 8601 date-time.
 * @property {string} updatedAt ISO 8601 date-time.
 */

/**
 * A student's offer for one project (FR-S05, FR-S06, FR-C05).
 *
 * @typedef {object} Proposal
 * @property {string} id Stable proposal ID.
 * @property {string} projectId ID of the related project.
 * @property {string} studentId ID of the student who submitted it.
 * @property {number} priceEGP Proposed price in EGP; distinct from project budget.
 * @property {number} deliveryDays Proposed delivery duration in whole days.
 * @property {string} coverMessage Student's approach to the work.
 * @property {string[]} attachmentIds IDs of permitted mock attachment records.
 * @property {string} status Proposed proposal workflow status.
 * @property {string} submittedAt ISO 8601 date-time.
 * @property {string} updatedAt ISO 8601 date-time.
 */

/**
 * A fixed-scope listing published by a student (FR-S07, FR-C07).
 * Packages and extras are separate records linked through serviceId.
 *
 * @typedef {object} Service
 * @property {string} id Stable service ID.
 * @property {string} studentId ID of the student who owns the listing.
 * @property {string} title
 * @property {string} description
 * @property {string} categoryId ID of a marketplace category.
 * @property {string[]} skillIds IDs of relevant skills.
 * @property {string[]} portfolioItemIds IDs of public portfolio examples.
 * @property {string} status Proposed listing status.
 * @property {string} createdAt ISO 8601 date-time.
 * @property {string} updatedAt ISO 8601 date-time.
 */

/**
 * One priced option for a service (FR-C08).
 * Package names and limits are not yet approved.
 *
 * @typedef {object} ServicePackage
 * @property {string} id Stable package ID.
 * @property {string} serviceId ID of the parent service.
 * @property {string} name
 * @property {string} description Scope and included deliverables.
 * @property {string[]} includedFeatures
 * @property {number} priceEGP Package price in EGP.
 * @property {number} deliveryDays Delivery duration in whole days.
 */

/**
 * An optional addition to a service order (FR-C08).
 *
 * @typedef {object} ServiceExtra
 * @property {string} id Stable extra ID.
 * @property {string} serviceId ID of the parent service.
 * @property {string} title
 * @property {string} description
 * @property {number} additionalPriceEGP Additional EGP amount.
 * @property {number} additionalDays Additional delivery days.
 */

/**
 * An engagement created from either an accepted proposal or a service
 * purchase (FR-S08, FR-C09, FR-C11). The sourceId points to the project when
 * sourceType is "project", or to the service when it is "service".
 *
 * Finance owns detailed payment and escrow records. This contract stores the
 * agreed order amount and does not claim that funds were collected or held.
 *
 * @typedef {object} Order
 * @property {string} id Stable order ID.
 * @property {"project"|"service"} sourceType Marketplace flow that created it.
 * @property {string} sourceId ID of the project or service.
 * @property {string|null} proposalId Accepted proposal ID for a project order; null for a service order.
 * @property {string|null} servicePackageId Selected package ID for a service order; null for a project order.
 * @property {string[]} serviceExtraIds Selected extra IDs; empty for a project order.
 * @property {string} clientId ID of the client participant.
 * @property {string} studentId ID of the student participant.
 * @property {number} agreedAmountEGP Agreed order amount in EGP, distinct from project budget.
 * @property {number} [deliveryDays] Agreed delivery estimate copied at project acceptance or service confirmation; does not start a work timer.
 * @property {object} [serviceTerms] Immutable service/package/extra scope and line-item amounts copied at confirmation. Older fixture orders may omit this snapshot.
 * @property {object[]} [deliveries] Immutable delivery submissions with optional revision or acceptance metadata; sample IDs only, never real files.
 * @property {object[]} [deliveryEvents] Recorded demo delivery/revision/acceptance events for the workspace timeline.
 * @property {string} status Proposed order workflow status.
 * @property {string} createdAt ISO 8601 date-time.
 * @property {string|null} completedAt ISO 8601 date-time, or null until completion.
 */
