import { clientEligibility } from "../projects/projectCreation.js";

export function serviceBuyerError(session) {
  const error = clientEligibility(session);
  if (error) return error;
  // Conservative demo rule until MIU/external-client origin is available.
  if (session.user.verificationStatus !== "approved")
    return "Client verification must be approved before placing a demo service order.";
  return null;
}

function cents(amount, zero = false) {
  if (
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount < (zero ? 0 : 0.01)
  )
    return null;
  const value = Math.round(amount * 100);
  if (!Number.isSafeInteger(value) || Math.abs(amount * 100 - value) > 0.000001)
    return null;
  return value;
}

/** Pure, side-effect-free quote. Source data is supplied by the live store at confirmation. */
export function quoteServiceOrder(serviceId, selection, session, data) {
  const access = serviceBuyerError(session);
  if (access) return { ok: false, error: access };
  const service = data.services.find(({ id }) => id === serviceId);
  if (!service || service.status !== "published")
    return { ok: false, error: "This service is unavailable for ordering." };
  if (service.studentId === session.user.id)
    return { ok: false, error: "You cannot order your own service." };
  const pack = data.servicePackages.find(
    ({ id, serviceId: parent }) =>
      id === selection?.packageId && parent === serviceId,
  );
  const ids = selection?.extraIds;
  if (
    !pack ||
    !Array.isArray(ids) ||
    ids.some((id) => typeof id !== "string") ||
    new Set(ids).size !== ids.length
  )
    return {
      ok: false,
      error: "Choose one current package and valid extras without duplicates.",
    };
  const extras = ids.map((id) =>
    data.serviceExtras.find(
      (extra) => extra.id === id && extra.serviceId === serviceId,
    ),
  );
  const base = cents(pack.priceEGP);
  if (
    base === null ||
    !Number.isSafeInteger(pack.deliveryDays) ||
    pack.deliveryDays < 1 ||
    extras.some(
      (extra) =>
        !extra ||
        cents(extra.additionalPriceEGP, true) === null ||
        !Number.isSafeInteger(extra.additionalDays) ||
        extra.additionalDays < 0,
    )
  )
    return {
      ok: false,
      error:
        "The selected package or extras have invalid price or delivery terms. Choose another option.",
    };
  const totalCents = extras.reduce(
    (total, extra) => total + cents(extra.additionalPriceEGP, true),
    base,
  );
  const deliveryDays = extras.reduce(
    (total, extra) => total + extra.additionalDays,
    pack.deliveryDays,
  );
  if (!Number.isSafeInteger(totalCents) || !Number.isSafeInteger(deliveryDays))
    return {
      ok: false,
      error:
        "The combined amount or delivery estimate exceeds the supported range.",
    };
  const terms = {
    serviceTitle: service.title,
    serviceDescription: service.description,
    packageName: pack.name,
    packageDescription: pack.description,
    includedFeatures: [...pack.includedFeatures],
    packagePriceEGP: pack.priceEGP,
    packageDeliveryDays: pack.deliveryDays,
    extras: [...extras]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((extra) => ({
        id: extra.id,
        title: extra.title,
        description: extra.description,
        additionalPriceEGP: extra.additionalPriceEGP,
        additionalDays: extra.additionalDays,
      })),
  };
  return {
    ok: true,
    serviceId,
    studentId: service.studentId,
    packageId: pack.id,
    extraIds: [...ids].sort(),
    amountEGP: totalCents / 100,
    deliveryDays,
    terms,
    revision: JSON.stringify([service.id, service.studentId, pack.id, terms]),
  };
}
