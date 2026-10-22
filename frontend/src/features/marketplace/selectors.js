import { marketplaceData } from "../../data/fixtures/marketplace.js";

// Optional data arguments let tests and later state providers reuse the same queries.
export const getProjectById = (id, data = marketplaceData) =>
  data.projects.find((project) => project.id === id) ?? null;

export const getServiceById = (id, data = marketplaceData) =>
  data.services.find((service) => service.id === id) ?? null;

export const getOrderById = (id, data = marketplaceData) =>
  data.orders.find((order) => order.id === id) ?? null;

export const getProjectsByClient = (clientId, data = marketplaceData) =>
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
