import { discoverFreelancers } from "../freelancers/freelancerModel.js";
import { startingPackage } from "../services/serviceCatalogueModel.js";

export const emptyPreferences = Object.freeze({
  kind: "projects",
  categoryId: "",
  skillIds: [],
});

/** Transparent Phase 1 overlap calculation. Never an eligibility or quality score. */
export function recommendMarketplace(preferences, data) {
  const { kind, categoryId, skillIds = [] } = preferences;
  if (!["projects", "services", "freelancers"].includes(kind)) return [];
  if (categoryId && !data.categories.some(({ id }) => id === categoryId))
    return [];
  const selected = [...new Set(skillIds)];
  if (selected.some((id) => !data.skills.some((skill) => skill.id === id)))
    return [];
  if (!categoryId && !selected.length) return [];
  const match = (record, skills) => {
    if (categoryId && record.categoryId !== categoryId) return null;
    const matched = data.skills.filter(
      ({ id }) => selected.includes(id) && skills.includes(id),
    );
    if (selected.length && !matched.length) return null;
    return {
      matchedSkills: matched,
      selectedSkillCount: selected.length,
      categoryLabel: categoryId
        ? data.categories.find(({ id }) => id === categoryId).label
        : null,
      score: matched.length,
    };
  };
  const serviceResult = (service) => {
    const reason = match(service, service.skillIds);
    if (!reason) return null;
    return {
      id: service.id,
      title: service.title,
      description: service.description,
      href: `/services/${service.id}`,
      priceEGP: startingPackage(service.id, data)?.priceEGP ?? null,
      priceLabel: "Service starting price",
      ...reason,
    };
  };
  const sort = (a, b) =>
    b.score - a.score ||
    a.title.localeCompare(b.title) ||
    a.id.localeCompare(b.id);
  if (kind === "projects")
    return data.projects
      .filter((record) => record.status === "open")
      .flatMap((record) => {
        const reason = match(record, record.requiredSkillIds);
        return reason
          ? [
              {
                id: record.id,
                title: record.title,
                description: record.description,
                href: `/projects/${record.id}`,
                priceEGP: record.budgetEGP,
                priceLabel: "Project budget",
                ...reason,
              },
            ]
          : [];
      })
      .sort(sort);
  if (kind === "services")
    return data.services
      .filter((record) => record.status === "published")
      .map(serviceResult)
      .filter(Boolean)
      .sort(sort);
  return discoverFreelancers({ categoryId }, data)
    .flatMap((person) => {
      // Rank a provider through one matching published service, never a union of unrelated offers.
      const best = person.services
        .map(({ service }) => serviceResult(service))
        .filter(Boolean)
        .sort(sort)[0];
      return best
        ? [
            {
              ...best,
              id: person.id,
              title: person.displayName,
              serviceTitle: best.title,
              priceLabel: "Matched service starting price",
            },
          ]
        : [];
    })
    .sort(sort);
}
