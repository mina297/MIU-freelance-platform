import {
  ORDER_SOURCE,
  ORDER_STATUS,
  PROJECT_STATUS,
  PROPOSAL_STATUS,
  SERVICE_STATUS,
} from "./constants.js";

const values = (constant) => new Set(Object.values(constant));
const validProjectStatuses = values(PROJECT_STATUS);
const validProposalStatuses = values(PROPOSAL_STATUS);
const validServiceStatuses = values(SERVICE_STATUS);
const validOrderStatuses = values(ORDER_STATUS);
const positiveAmount = (value) => typeof value === "number" && Number.isFinite(value) && value > 0;

/** Returns all integrity errors without changing the supplied mock records. */
export function validateMarketplaceData(data) {
  const errors = [];
  const unique = (records, name) => {
    const ids = new Set();
    for (const record of records) {
      if (ids.has(record.id)) errors.push(`${name}: duplicate ID ${record.id}`);
      ids.add(record.id);
    }
    return new Map(records.map((record) => [record.id, record]));
  };

  const clients = unique(data.participants.clients, "clients");
  const students = unique(data.participants.students, "students");
  const categories = unique(data.categories, "categories");
  const skills = unique(data.skills, "skills");
  const projects = unique(data.projects, "projects");
  const proposals = unique(data.proposals, "proposals");
  const services = unique(data.services, "services");
  const packages = unique(data.servicePackages, "servicePackages");
  const extras = unique(data.serviceExtras, "serviceExtras");
  unique(data.orders, "orders");

  for (const project of data.projects) {
    if (!clients.has(project.clientId)) errors.push(`${project.id}: unknown client`);
    if (!categories.has(project.categoryId)) errors.push(`${project.id}: unknown category`);
    if (project.requiredSkillIds.some((id) => !skills.has(id))) errors.push(`${project.id}: unknown skill`);
    if (!positiveAmount(project.budgetEGP)) errors.push(`${project.id}: invalid EGP budget`);
    if (!validProjectStatuses.has(project.status)) errors.push(`${project.id}: invalid status`);
    if (project.scope !== undefined && (typeof project.scope !== "string" || !project.scope.trim())) errors.push(`${project.id}: invalid scope`);
    if (project.deliverables !== undefined && (!Array.isArray(project.deliverables) || project.deliverables.some((item) => typeof item !== "string" || !item.trim()))) errors.push(`${project.id}: invalid deliverables`);
  }

  for (const proposal of data.proposals) {
    if (!projects.has(proposal.projectId)) errors.push(`${proposal.id}: unknown project`);
    if (!students.has(proposal.studentId)) errors.push(`${proposal.id}: unknown student`);
    if (!positiveAmount(proposal.priceEGP)) errors.push(`${proposal.id}: invalid EGP price`);
    if (!Number.isInteger(proposal.deliveryDays) || proposal.deliveryDays < 1) errors.push(`${proposal.id}: invalid delivery days`);
    if (!validProposalStatuses.has(proposal.status)) errors.push(`${proposal.id}: invalid status`);
  }

  for (const service of data.services) {
    if (!students.has(service.studentId)) errors.push(`${service.id}: unknown student`);
    if (!categories.has(service.categoryId)) errors.push(`${service.id}: unknown category`);
    if (service.skillIds.some((id) => !skills.has(id))) errors.push(`${service.id}: unknown skill`);
    if (!validServiceStatuses.has(service.status)) errors.push(`${service.id}: invalid status`);
  }

  for (const item of data.servicePackages) {
    if (!services.has(item.serviceId)) errors.push(`${item.id}: unknown service`);
    if (!positiveAmount(item.priceEGP)) errors.push(`${item.id}: invalid EGP price`);
    if (!Number.isInteger(item.deliveryDays) || item.deliveryDays < 1) errors.push(`${item.id}: invalid delivery days`);
  }

  for (const item of data.serviceExtras) {
    if (!services.has(item.serviceId)) errors.push(`${item.id}: unknown service`);
    if (typeof item.additionalPriceEGP !== "number" || !Number.isFinite(item.additionalPriceEGP) || item.additionalPriceEGP < 0) errors.push(`${item.id}: invalid EGP price`);
    if (!Number.isInteger(item.additionalDays) || item.additionalDays < 0) errors.push(`${item.id}: invalid additional days`);
  }

  for (const order of data.orders) {
    if (!clients.has(order.clientId)) errors.push(`${order.id}: unknown client`);
    if (!students.has(order.studentId)) errors.push(`${order.id}: unknown student`);
    if (!positiveAmount(order.agreedAmountEGP)) errors.push(`${order.id}: invalid EGP amount`);
    if (!validOrderStatuses.has(order.status)) errors.push(`${order.id}: invalid status`);
    if (order.sourceType === ORDER_SOURCE.PROJECT) {
      const project = projects.get(order.sourceId);
      const proposal = proposals.get(order.proposalId);
      if (!project || project.clientId !== order.clientId) errors.push(`${order.id}: invalid project source`);
      if (!proposal || proposal.projectId !== order.sourceId || proposal.studentId !== order.studentId || proposal.status !== PROPOSAL_STATUS.ACCEPTED || proposal.priceEGP !== order.agreedAmountEGP) errors.push(`${order.id}: invalid accepted proposal`);
      if (order.servicePackageId !== null || order.serviceExtraIds.length) errors.push(`${order.id}: project order has service selections`);
    } else if (order.sourceType === ORDER_SOURCE.SERVICE) {
      const service = services.get(order.sourceId);
      const servicePackage = packages.get(order.servicePackageId);
      if (!service || service.studentId !== order.studentId) errors.push(`${order.id}: invalid service source`);
      if (!servicePackage || servicePackage.serviceId !== order.sourceId) errors.push(`${order.id}: invalid service package`);
      if (order.proposalId !== null) errors.push(`${order.id}: service order has proposal`);
      const selectedExtras = order.serviceExtraIds.map((id) => extras.get(id));
      if (selectedExtras.some((extra) => !extra || extra.serviceId !== order.sourceId)) errors.push(`${order.id}: invalid service extra`);
      if (servicePackage && selectedExtras.every(Boolean) && servicePackage.priceEGP + selectedExtras.reduce((sum, extra) => sum + extra.additionalPriceEGP, 0) !== order.agreedAmountEGP) errors.push(`${order.id}: incorrect service total`);
    } else {
      errors.push(`${order.id}: invalid source type`);
    }
  }

  for (const proposal of data.proposals.filter((item) => item.status === PROPOSAL_STATUS.ACCEPTED)) {
    const matchingOrders = data.orders.filter((order) => order.sourceType === ORDER_SOURCE.PROJECT && order.proposalId === proposal.id);
    if (matchingOrders.length !== 1) errors.push(`${proposal.id}: expected one project order`);
  }

  return errors;
}
