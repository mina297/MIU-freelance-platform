export const profileWorkCategories = [
  { id: "accounting_consulting", label: "Accounting & Consulting" },
  { id: "admin_support", label: "Admin Support" },
  { id: "customer_service", label: "Customer Service" },
  { id: "data_science_analytics", label: "Data Science & Analytics" },
  { id: "graphic_design", label: "Design & Creative" },
  { id: "engineering_architecture", label: "Engineering & Architecture" },
  { id: "it_networking", label: "IT & Networking" },
  { id: "legal", label: "Legal" },
  { id: "sales_marketing", label: "Sales & Marketing" },
  { id: "translation", label: "Translation" },
  { id: "web_development", label: "Web, Mobile & Software Dev" },
  { id: "writing", label: "Writing" },
];
export const getProfileWorkCategory = (id) =>
  profileWorkCategories.find((category) => category.id === id) ?? null;

export function filterProfileWorkCategories(
  query,
  translate = (label) => label,
) {
  const search = query.trim().toLocaleLowerCase();
  return profileWorkCategories.filter((category) =>
    `${category.label} ${translate(category.label)}`
      .toLocaleLowerCase()
      .includes(search),
  );
}
