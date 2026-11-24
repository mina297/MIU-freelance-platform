import { en, ar } from "./messages.js";
import { localeFor } from "./locale.js";
import { productCopy } from "./productCopy.js";
export function translate(language, key, values = {}) {
  const editorial = Object.hasOwn(productCopy, key) ? productCopy[key] : null;
  const message =
    editorial?.[language === "ar" ? 1 : 0] ??
    (language === "ar" ? ar[key] : en[key]) ??
    key;
  if (typeof message !== "string") return key;
  return message.replace(/\{(\w+)\}/g, (match, name) => {
    if (!(name in values)) return match;
    return typeof values[name] === "number"
      ? new Intl.NumberFormat(localeFor(language)).format(values[name])
      : String(values[name]);
  });
}
