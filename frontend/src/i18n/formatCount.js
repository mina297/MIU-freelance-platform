import { localeFor } from "./locale.js";
const forms = {
  project: ["مشاريع", "مشروع", "مشروعان", "مشاريع", "مشروعًا", "مشروع"],
  service: ["خدمات", "خدمة", "خدمتان", "خدمات", "خدمةً", "خدمة"],
  order: ["طلبات", "طلب", "طلبان", "طلبات", "طلبًا", "طلب"],
  proposal: ["عروض", "عرض", "عرضان", "عروض", "عرضًا", "عرض"],
  provider: [
    "مقدمي خدمات",
    "مقدم خدمة",
    "مقدما خدمة",
    "مقدمي خدمات",
    "مقدم خدمة",
    "مقدم خدمة",
  ],
  student: ["طلاب", "طالب", "طالبان", "طلاب", "طالبًا", "طالب"],
  review: ["تقييمات", "تقييم", "تقييمان", "تقييمات", "تقييمًا", "تقييم"],
  suggestion: [
    "اقتراحات",
    "اقتراح",
    "اقتراحان",
    "اقتراحات",
    "اقتراحًا",
    "اقتراح",
  ],
  day: ["أيام", "يوم", "يومان", "أيام", "يومًا", "يوم"],
};
export function formatCount(language, unit, count) {
  const number = new Intl.NumberFormat(localeFor(language)).format(count);
  if (language !== "ar" || !forms[unit])
    return `${number} ${unit}${count === 1 ? "" : "s"}`;
  const category = new Intl.PluralRules("ar-EG").select(count);
  const form =
    forms[unit][
      ["zero", "one", "two", "few", "many", "other"].indexOf(category)
    ];
  if (category === "zero")
    return `${unit === "provider" ? "لا يوجد" : "لا توجد"} ${form}`;
  if (category === "one")
    return `${form} ${unit === "service" ? "واحدة" : "واحد"}`;
  if (category === "two") return form;
  return `${number} ${form}`;
}
