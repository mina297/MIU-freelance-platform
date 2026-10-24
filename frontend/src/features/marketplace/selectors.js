import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { mergeProjects, projectStore } from "../projects/projectStore.js";

const currentData = () => ({ ...marketplaceData, projects: mergeProjects(marketplaceData.projects, projectStore.getSnapshot()) });

// Optional data arguments let tests and later state providers reuse the same queries.
export const getProjectById = (id, data = currentData()) =>
  data.projects.find((project) => project.id === id) ?? null;

export const getServiceById = (id, data = marketplaceData) =>
  data.services.find((service) => service.id === id) ?? null;

export const getOrderById = (id, data = marketplaceData) =>
  data.orders.find((order) => order.id === id) ?? null;

export const getProjectsByClient = (clientId, data = currentData()) =>
  data.projects.filter((project) => project.clientId === clientId);

export const getProposalsByProject = (projectId, data = marketplaceData) =>
  data.proposals.filter((proposal) => proposal.projectId === projectId);

export const getProposalsByStudent = (studentId, data = marketplaceData) =>
  data.proposals.filter((proposal) => proposal.studentId === studentId);

export const getServicesByStudent = (studentId, data = marketplaceData) =>
  data.services.filter((service) => service.studentId === studentId);

export const getPackagesByService = (serviceId, data = marketplaceData) =>
  data.servicePackages.filter((servicePackage) => servicePackage.serviceId === serviceId);

export const getExtrasByService = (serviceId, data = marketplaceData) =>
  data.serviceExtras.filter((extra) => extra.serviceId === serviceId);

export const getOrdersByClient = (clientId, data = marketplaceData) =>
  data.orders.filter((order) => order.clientId === clientId);

export const getOrdersByStudent = (studentId, data = marketplaceData) =>
  data.orders.filter((order) => order.studentId === studentId);

const includesQuery = (record, query) =>
  `${record.title} ${record.description}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());

/**
 * Filter projects without changing their source order. Empty options mean no
 * restriction; a skill filter matches a project requiring that skill.
 */
export function findProjects({ query = "", categoryId, skillId, status } = {}, data = currentData()) {
  return data.projects.filter(
    (project) =>
      includesQuery(project, query) &&
      (!categoryId || project.categoryId === categoryId) &&
      (!skillId || project.requiredSkillIds.includes(skillId)) &&
      (!status || project.status === status),
  );
}

/** Filter service listings using the same search terms and filter semantics. */
export function findServices({ query = "", categoryId, skillId, status } = {}, data = marketplaceData) {
  return data.services.filter(
    (service) =>
      includesQuery(service, query) &&
      (!categoryId || service.categoryId === categoryId) &&
      (!skillId || service.skillIds.includes(skillId)) &&
      (!status || service.status === status),
  );
}
