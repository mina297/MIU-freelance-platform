import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { orderStore } from "../orders/orderStore.js";
import {
  studentServiceAccess,
  validateService,
  serviceFormValues,
  featureLines,
} from "./serviceFormModel.js";

export function createServiceStore(
  seed = marketplaceData,
  getOrders = () => orderStore.getSnapshot(),
) {
  const freezeService = (record) =>
    Object.freeze({
      ...record,
      skillIds: Object.freeze([...record.skillIds]),
      portfolioItemIds: Object.freeze([...record.portfolioItemIds]),
    });
  const freezePackage = (record) =>
    Object.freeze({
      ...record,
      includedFeatures: Object.freeze([...record.includedFeatures]),
    });
  let snapshot = Object.freeze({
    ...seed,
    services: Object.freeze(seed.services.map(freezeService)),
    servicePackages: Object.freeze(seed.servicePackages.map(freezePackage)),
    serviceExtras: Object.freeze(
      seed.serviceExtras.map((extra) => Object.freeze({ ...extra })),
    ),
  });
  const listeners = new Set();
  const creationIds = new Map();
  const find = (id) => snapshot.services.find((record) => record.id === id);
  const owned = (id, session) =>
    !studentServiceAccess(session) && find(id)?.studentId === session.user.id
      ? find(id)
      : null;
  const linked = (id) =>
    getOrders().some(
      (order) => order.sourceType === "service" && order.sourceId === id,
    );
  const failure = (message) => ({ ok: false, errors: { form: message } });
  function publishSnapshot(
    services,
    packages = snapshot.servicePackages,
    extras = snapshot.serviceExtras,
    participants = snapshot.participants,
  ) {
    snapshot = Object.freeze({
      ...snapshot,
      services: Object.freeze(services),
      servicePackages: Object.freeze(packages),
      serviceExtras: Object.freeze(extras),
      participants,
    });
    listeners.forEach((listener) => listener());
  }
  function editError(id, session) {
    const access = studentServiceAccess(session);
    if (access) return access;
    const service = owned(id, session);
    if (!service)
      return "This service is unavailable or does not belong to your account.";
    if (linked(id))
      return "This service is linked to an order. Editing and removal are unavailable to protect existing terms; you may pause it.";
    return studentServiceAccess(session, service.status === "published");
  }
  const store = {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    findOwned: owned,
    editError,
    save(values, session, existingId = null, submissionId = null) {
      const access = existingId
        ? editError(existingId, session)
        : studentServiceAccess(session);
      if (access) return failure(access);
      const errors = validateService(values);
      if (Object.keys(errors).length) return { ok: false, errors };
      if (
        !existingId &&
        (typeof submissionId !== "string" || !submissionId.trim())
      )
        return failure("Reopen the form before saving a new service.");
      const key = JSON.stringify([session.user.id, submissionId]);
      if (!existingId && creationIds.has(key)) {
        const previous = owned(creationIds.get(key), session);
        return previous
          ? { ok: true, service: previous, duplicate: true }
          : failure(
              "This creation form has already been used. Start a new service.",
            );
      }
      const previous = existingId ? owned(existingId, session) : null;
      const id = previous?.id ?? `demo_service_${crypto.randomUUID()}`;
      const now = new Date().toISOString();
      const service = freezeService({
        id,
        studentId: session.user.id,
        title: values.title.trim(),
        description: values.description.trim(),
        categoryId: values.categoryId,
        skillIds: values.skillIds,
        portfolioItemIds: previous?.portfolioItemIds ?? [],
        status: previous?.status ?? "draft",
        createdAt: previous?.createdAt ?? now,
        updatedAt: now,
      });
      const packageIds = new Set(
        snapshot.servicePackages
          .filter((pack) => pack.serviceId === id)
          .map((pack) => pack.id),
      );
      const extraIds = new Set(
        snapshot.serviceExtras
          .filter((extra) => extra.serviceId === id)
          .map((extra) => extra.id),
      );
      const packages = values.packages.map((pack) =>
        freezePackage({
          id: packageIds.has(pack.id)
            ? pack.id
            : `demo_package_${crypto.randomUUID()}`,
          serviceId: id,
          name: pack.name.trim(),
          description: pack.description.trim(),
          includedFeatures: featureLines(pack.includedFeatures),
          priceEGP: Number(pack.priceEGP),
          deliveryDays: Number(pack.deliveryDays),
        }),
      );
      const extras = values.extras.map((extra) =>
        Object.freeze({
          id: extraIds.has(extra.id)
            ? extra.id
            : `demo_extra_${crypto.randomUUID()}`,
          serviceId: id,
          title: extra.title.trim(),
          description: extra.description.trim(),
          additionalPriceEGP: Number(extra.additionalPriceEGP),
          additionalDays: Number(extra.additionalDays),
        }),
      );
      // Runtime registrations need a safe public display-name adapter, not a fabricated profile.
      const participants = snapshot.participants.students.some(
        (person) => person.id === session.user.id,
      )
        ? snapshot.participants
        : Object.freeze({
            ...snapshot.participants,
            students: Object.freeze([
              ...snapshot.participants.students,
              Object.freeze({
                id: session.user.id,
                displayName: session.user.displayName,
              }),
            ]),
          });
      if (!existingId) creationIds.set(key, id);
      publishSnapshot(
        [...snapshot.services.filter((record) => record.id !== id), service],
        [
          ...snapshot.servicePackages.filter((pack) => pack.serviceId !== id),
          ...packages,
        ],
        [
          ...snapshot.serviceExtras.filter((extra) => extra.serviceId !== id),
          ...extras,
        ],
        participants,
      );
      return { ok: true, service };
    },
    transitionError(id, session, action) {
      const access = studentServiceAccess(session, action === "publish");
      if (access) return access;
      const service = owned(id, session);
      if (!service)
        return "This service is unavailable or does not belong to your account.";
      if (!["publish", "pause", "remove"].includes(action))
        return "Choose a supported service action.";
      if (action === "remove" && linked(id))
        return "A linked order prevents removal. Pause the service instead.";
      if (action === "pause" && service.status !== "published")
        return "Only published services can be paused.";
      if (action === "publish" && !["draft", "paused"].includes(service.status))
        return "Only drafts or paused services can be published.";
      if (
        action === "publish" &&
        Object.keys(validateService(serviceFormValues(service, snapshot)))
          .length
      )
        return "Complete the service and all package fields before publishing.";
      return null;
    },
    transition(id, session, action) {
      const error = store.transitionError(id, session, action);
      if (error) return failure(error);
      const previous = owned(id, session);
      if (action === "remove") {
        publishSnapshot(
          snapshot.services.filter((record) => record.id !== id),
          snapshot.servicePackages.filter((pack) => pack.serviceId !== id),
          snapshot.serviceExtras.filter((extra) => extra.serviceId !== id),
        );
        return { ok: true, removed: true };
      }
      const service = freezeService({
        ...previous,
        status: action === "publish" ? "published" : "paused",
        updatedAt: new Date().toISOString(),
      });
      publishSnapshot(
        snapshot.services.map((record) =>
          record.id === id ? service : record,
        ),
      );
      return { ok: true, service };
    },
  };
  return store;
}

export const serviceStore = createServiceStore();
