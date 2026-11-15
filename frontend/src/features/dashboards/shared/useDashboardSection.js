import { useSearchParams } from "react-router-dom";

/** URL is the only section state; browser back/forward needs no synchronization. */
export function useDashboardSection(navItems, defaultSection = "overview") {
  const [params, setParams] = useSearchParams();
  const requested = params.get("section");
  const activeSection = navItems.some(({ id }) => id === requested)
    ? requested
    : defaultSection;
  function navigate(id) {
    if (!navItems.some((item) => item.id === id)) return;
    const next = new URLSearchParams(params);
    if (id === defaultSection) next.delete("section");
    else next.set("section", id);
    setParams(next);
  }
  return { activeSection, navigate };
}
