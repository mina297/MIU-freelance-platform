import {
  findProjects,
  findServices,
  getPackagesByService,
} from "../../marketplace/selectors.js";
import { PROJECT_STATUS, SERVICE_STATUS } from "../../marketplace/constants.js";

export const CATEGORY_CHIPS = [
  { id: "graphic_design", label: "Design" },
  { id: "web_development", label: "Development" },
  { id: "writing", label: "Writing" },
  { label: "Translation" },
  { label: "Marketing" },
  { label: "Video" },
  { label: "Tutoring" },
];

/** Read-only landing adapter. Shared selectors remain the marketplace authority. */
export function getLandingDiscovery(
  { query = "", categoryId = "" } = {},
  data,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matchingSkills = normalizedQuery
    ? data.skills.filter(({ label }) =>
        label.toLocaleLowerCase().includes(normalizedQuery),
      )
    : [];

  function search(selector, status, source) {
    const matches = selector(
      { query: normalizedQuery, categoryId, status },
      data,
    );
    for (const skill of matchingSkills) {
      matches.push(
        ...selector({ skillId: skill.id, categoryId, status }, data),
      );
    }
    const ids = new Set(matches.map(({ id }) => id));
    return source.filter(({ id }) => ids.has(id));
  }

  return {
    projects: search(findProjects, PROJECT_STATUS.OPEN, data.projects),
    services: search(findServices, SERVICE_STATUS.PUBLISHED, data.services),
  };
}

export function getServiceStartingPrice(serviceId, data) {
  const prices = getPackagesByService(serviceId, data)
    .map(({ priceEGP }) => priceEGP)
    .filter((price) => typeof price === "number" && Number.isFinite(price));
  return prices.length ? Math.min(...prices) : null;
}
