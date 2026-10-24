import {
  getServiceById,
  getExtrasByService,
} from "../marketplace/selectors.js";
import { SERVICE_STATUS } from "../marketplace/constants.js";
import { displayPackages } from "./serviceCatalogueModel.js";

/** Public detail views never expose draft/paused listing content. */
export function publicServiceDetails(id, data) {
  const service = getServiceById(id, data);
  if (!service || service.status !== SERVICE_STATUS.PUBLISHED) return null;
  return {
    service,
    student:
      data.participants.students.find(
        (person) => person.id === service.studentId,
      ) ?? null,
    category:
      data.categories.find((item) => item.id === service.categoryId)?.label ??
      "Other services",
    packages: displayPackages(id, data),
    extras: getExtrasByService(id, data).filter(
      (item) =>
        Number.isFinite(item.additionalPriceEGP) &&
        item.additionalPriceEGP >= 0 &&
        Number.isSafeInteger(item.additionalDays) &&
        item.additionalDays >= 0,
    ),
  };
}
