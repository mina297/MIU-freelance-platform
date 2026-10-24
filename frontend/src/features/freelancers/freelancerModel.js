import {
  startingPackage,
  servicePriceOptions,
} from "../services/serviceCatalogueModel.js";

export const emptyFreelancerFilters = Object.freeze({
  query: "",
  categoryId: "",
  skillId: "",
  price: "all",
  sort: "name",
});
export { servicePriceOptions as freelancerPriceOptions };

function matchesPrice(pack, price) {
  if (price === "all") return true;
  if (!pack) return false;
  if (price === "under_1500") return pack.priceEGP < 1500;
  if (price === "1500_3000")
    return pack.priceEGP >= 1500 && pack.priceEGP <= 3000;
  if (price === "over_3000") return pack.priceEGP > 3000;
  return false;
}

/** Public service-provider adapter, not a replacement for Member 5's profile model. */
export function discoverFreelancers(filters, data) {
  const options = { ...emptyFreelancerFilters, ...filters };
  const query = options.query.trim().toLocaleLowerCase();
  return data.participants.students
    .flatMap((person) => {
      // Do not use session/verification fixtures, private drafts, orders or reviews.
      const services = data.services
        .filter(
          (service) =>
            service.studentId === person.id && service.status === "published",
        )
        .filter(
          (service) =>
            (!options.categoryId ||
              service.categoryId === options.categoryId) &&
            (!options.skillId || service.skillIds.includes(options.skillId)),
        )
        .map((service) => ({
          service,
          package: startingPackage(service.id, data),
        }))
        .filter(({ service, package: pack }) => {
          const skills = data.skills
            .filter(({ id }) => service.skillIds.includes(id))
            .map(({ label }) => label)
            .join(" ");
          const category =
            data.categories.find(({ id }) => id === service.categoryId)
              ?.label ?? "";
          return (
            `${person.displayName} ${service.title} ${service.description} ${skills} ${category}`
              .toLocaleLowerCase()
              .includes(query) && matchesPrice(pack, options.price)
          );
        })
        .sort(
          (a, b) =>
            a.service.title.localeCompare(b.service.title) ||
            a.service.id.localeCompare(b.service.id),
        );
      if (!services.length) return [];
      const prices = services
        .map(({ package: pack }) => pack?.priceEGP)
        .filter((price) => typeof price === "number");
      return [
        {
          id: person.id,
          displayName: person.displayName,
          services,
          skills: data.skills.filter(({ id }) =>
            services.some(({ service }) => service.skillIds.includes(id)),
          ),
          startingPriceEGP: prices.length ? Math.min(...prices) : null,
        },
      ];
    })
    .sort((a, b) => {
      if (options.sort === "price_low") {
        if (a.startingPriceEGP === null || b.startingPriceEGP === null)
          return (
            Number(a.startingPriceEGP === null) -
              Number(b.startingPriceEGP === null) || a.id.localeCompare(b.id)
          );
        const price = a.startingPriceEGP - b.startingPriceEGP;
        if (price) return price;
      }
      if (options.sort === "services") {
        const count = b.services.length - a.services.length;
        if (count) return count;
      }
      return (
        a.displayName.localeCompare(b.displayName) *
          (options.sort === "name_desc" ? -1 : 1) || a.id.localeCompare(b.id)
      );
    });
}
