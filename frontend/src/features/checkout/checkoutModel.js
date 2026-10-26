import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { ORDER_SOURCE } from "../marketplace/constants.js";

export const PAYMENT_METHODS = Object.freeze([
  { id: "visa", label: "Visa" },
  { id: "mastercard", label: "Mastercard" },
  { id: "apple_pay", label: "Apple Pay" },
]);
export const savedCards = Object.freeze([
  Object.freeze({
    id: "card_visa",
    brand: "visa",
    label: "Personal Visa",
    last4: "4242",
    expiry: "12/2030",
    holder: "Alex Morgan",
  }),
  Object.freeze({
    id: "card_mastercard",
    brand: "mastercard",
    label: "Business Mastercard",
    last4: "1881",
    expiry: "08/2031",
    holder: "Alex Morgan",
  }),
]);
export const sampleCardPresets = Object.freeze({
  valid: Object.freeze({
    holder: "Alex Morgan",
    number: "•••• •••• •••• 9001",
    last4: "9001",
    expiry: "12/2030",
    cvc: "000",
  }),
  expired: Object.freeze({
    holder: "Alex Morgan",
    number: "•••• •••• •••• 9002",
    last4: "9002",
    expiry: "01/2020",
    cvc: "000",
  }),
});
export function getServiceOrder(
  orderId,
  data = marketplaceData,
  orders = data.orders,
) {
  if (typeof orderId !== "string" || !orderId.trim()) return null;
  const order = orders.find(
    (item) => item.id === orderId && item.sourceType === ORDER_SOURCE.SERVICE,
  );
  if (!order) return null;
  const priceMinor = Math.round(order.agreedAmountEGP * 100);
  if (!Number.isSafeInteger(priceMinor) || priceMinor <= 0) return null;
  const freelancer = data.participants.students.find(
    (item) => item.id === order.studentId,
  );
  const terms = order.serviceTerms;
  if (terms) {
    // Confirmed terms outlive later edits, pauses or removal of the listing.
    return {
      id: order.id,
      clientId: order.clientId,
      serviceId: order.sourceId,
      studentId: order.studentId,
      title: terms.serviceTitle,
      freelancer: freelancer?.displayName ?? "Student information unavailable",
      packageName: terms.packageName,
      scope: terms.packageDescription,
      features: terms.includedFeatures,
      deliveryDays: order.deliveryDays,
      items: [
        {
          id: order.servicePackageId,
          name: terms.packageName,
          amountMinor: Math.round(terms.packagePriceEGP * 100),
        },
        ...terms.extras.map((extra) => ({
          id: extra.id,
          name: extra.title,
          amountMinor: Math.round(extra.additionalPriceEGP * 100),
        })),
      ],
      priceMinor,
      status: order.status,
      completedAt: order.completedAt,
    };
  }
  const service = data.services.find((item) => item.id === order.sourceId);
  const pack = data.servicePackages.find(
    (item) =>
      item.id === order.servicePackageId && item.serviceId === order.sourceId,
  );
  const extras = (order.serviceExtraIds ?? []).map((id) =>
    data.serviceExtras.find(
      (item) => item.id === id && item.serviceId === order.sourceId,
    ),
  );
  if (
    !service ||
    !pack ||
    !freelancer ||
    extras.some((item) => !item) ||
    service.studentId !== order.studentId
  )
    return null;
  return {
    id: order.id,
    clientId: order.clientId,
    serviceId: service.id,
    studentId: order.studentId,
    title: service.title,
    freelancer: freelancer.displayName,
    packageName: pack.name,
    scope: pack.description,
    features: pack.includedFeatures,
    deliveryDays:
      pack.deliveryDays +
      extras.reduce((sum, item) => sum + item.additionalDays, 0),
    items: [
      {
        id: pack.id,
        name: pack.name,
        amountMinor: Math.round(pack.priceEGP * 100),
      },
      ...extras.map((item) => ({
        id: item.id,
        name: item.title,
        amountMinor: Math.round(item.additionalPriceEGP * 100),
      })),
    ],
    priceMinor,
    status: order.status,
    completedAt: order.completedAt,
  };
}
export function escrowBreakdown(priceMinor) {
  if (!Number.isSafeInteger(priceMinor) || priceMinor <= 0)
    throw new RangeError(
      "Agreed price must be positive integer EGP minor units.",
    );
  // For an odd piastre, allocate the extra piastre to the initial installment.
  const initialMinor = Math.ceil(priceMinor / 2);
  const feeMinor = 0; // Demo placeholder: an approved platform fee rate is not configured.
  return {
    priceMinor,
    initialMinor,
    remainingMinor: priceMinor - initialMinor,
    feeMinor,
    dueNowMinor: initialMinor + feeMinor,
  };
}
export function isCardExpired(expiry, now = new Date()) {
  const match = /^(0[1-9]|1[0-2])\/(\d{4})$/.exec(expiry || "");
  return (
    !match ||
    Number(match[2]) < now.getUTCFullYear() ||
    (Number(match[2]) === now.getUTCFullYear() &&
      Number(match[1]) < now.getUTCMonth() + 1)
  );
}
export function validateCheckout(
  { method, cardId, preset, acknowledged },
  now = new Date(),
) {
  const errors = {};
  if (!PAYMENT_METHODS.some((item) => item.id === method))
    errors.method = "Choose Visa, Mastercard or Apple Pay.";
  if (method === "visa" || method === "mastercard") {
    const card =
      cardId === "new"
        ? sampleCardPresets[preset]
        : savedCards.find(
            (item) => item.id === cardId && item.brand === method,
          );
    if (!card) {
      if (cardId === "new") {
        errors.holder = "Load a sample cardholder name.";
        errors.number = "Load a masked sample card number.";
        errors.expiry = "Load a sample expiry date.";
        errors.cvc = "Load a sample CVC.";
      } else
        errors.card =
          "Choose a saved card for this payment method or add a sample card.";
    } else if (isCardExpired(card.expiry, now))
      errors.expiry =
        "This sample card has expired. Choose a valid sample card.";
  }
  if (!acknowledged)
    errors.acknowledged =
      "Confirm the 50% escrow payment and remaining balance.";
  return errors;
}
