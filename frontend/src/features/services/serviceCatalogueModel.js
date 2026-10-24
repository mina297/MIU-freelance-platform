import {
  findServices,
  getPackagesByService,
} from "../marketplace/selectors.js";
import { SERVICE_STATUS } from "../marketplace/constants.js";

export const EMPTY_SERVICE_FILTERS = Object.freeze({
  query: "",
  categoryId: "",
  skillId: "",
  price: "all",
  sort: "newest",
});

export const servicePriceOptions = [
  { value: "all", label: "Any starting price" },
  { value: "under_1500", label: "Under EGP 1,500" },
  { value: "1500_3000", label: "EGP 1,500–3,000" },
  { value: "over_3000", label: "Over EGP 3,000" },
];

/** Shared package validity and ordering for catalogue and detail comparison. */
export function displayPackages(serviceId, data) {
  return getPackagesByService(serviceId, data)
    .filter(
      (item) =>
        Number.isFinite(item.priceEGP) &&
        item.priceEGP > 0 &&
        Number.isSafeInteger(item.deliveryDays) &&
        item.deliveryDays > 0,
    )
    .sort(
      (a, b) =>
        a.priceEGP - b.priceEGP ||
        a.deliveryDays - b.deliveryDays ||
        a.id.localeCompare(b.id),
    );
}

/** Price and delivery describe the same lowest-priced valid package, not extras. */
export function startingPackage(serviceId, data) {
  return displayPackages(serviceId, data)[0] ?? null;
}

export function discoverServices(filters, data) {
  const options = { ...EMPTY_SERVICE_FILTERS, ...filters };
  return findServices({ ...options, status: SERVICE_STATUS.PUBLISHED }, data)
    .map((service) => ({ service, package: startingPackage(service.id, data) }))
    .filter(({ package: pack }) => {
      if (options.price === "all") return true;
      if (!pack) return false;
      if (options.price === "under_1500") return pack.priceEGP < 1500;
      if (options.price === "1500_3000")
        return pack.priceEGP >= 1500 && pack.priceEGP <= 3000;
      if (options.price === "over_3000") return pack.priceEGP > 3000;
      return false;
    })
    .sort((a, b) => {
      if (["price_low", "price_high", "delivery"].includes(options.sort)) {
        if (!a.package || !b.package)
          return (
            Number(!a.package) - Number(!b.package) ||
            a.service.id.localeCompare(b.service.id)
          );
        const value =
          options.sort === "delivery"
            ? a.package.deliveryDays - b.package.deliveryDays
            : (a.package.priceEGP - b.package.priceEGP) *
              (options.sort === "price_high" ? -1 : 1);
        if (value) return value;
      }
      return (
        b.service.createdAt.localeCompare(a.service.createdAt) ||
        a.service.id.localeCompare(b.service.id)
      );
    });
}
