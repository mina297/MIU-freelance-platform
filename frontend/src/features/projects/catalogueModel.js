import { Code2, LayoutGrid, Palette, PenLine } from "lucide-react";
import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { PROJECT_STATUS } from "../marketplace/constants.js";

export const openProjects = marketplaceData.projects.filter(
  (project) => project.status === PROJECT_STATUS.OPEN,
);
export const categoryNames = new Map(
  marketplaceData.categories.map(({ id, label }) => [id, label]),
);
export const skillNames = new Map(
  marketplaceData.skills.map(({ id, label }) => [id, label]),
);
export const clientNames = new Map(
  marketplaceData.participants.clients.map(({ id, displayName }) => [
    id,
    displayName,
  ]),
);
export const categories = [
  {
    id: "",
    label: "All opportunities",
    shortLabel: "All",
    icon: LayoutGrid,
    tone: "bg-[var(--theme-accent-surface,#f9e5e9)] text-[var(--theme-accent,#9b2035)]",
    detail: "Your next chapter starts here",
  },
  {
    id: "web_development",
    label: "Development",
    shortLabel: "Web & code",
    icon: Code2,
    tone: "bg-[var(--theme-info-surface,#edf0fa)] text-[var(--theme-info-text,#535d91)]",
    detail: "Build thoughtful digital experiences",
  },
  {
    id: "graphic_design",
    label: "Graphic Design",
    shortLabel: "Design",
    icon: Palette,
    tone: "bg-[var(--theme-warning-surface,#f5eddd)] text-[var(--theme-warning-text,#8c6728)]",
    detail: "Give bold ideas a visual identity",
  },
  {
    id: "writing",
    label: "Writing & Content",
    shortLabel: "Writing",
    icon: PenLine,
    tone: "bg-[var(--theme-success-surface,#e7f0eb)] text-[var(--theme-success-text,#3e7357)]",
    detail: "Turn good stories into great content",
  },
];
export const budgetOptions = [
  { value: "all", label: "Any budget" },
  { value: "under3000", label: "Under EGP 3,000" },
  { value: "3000to6000", label: "EGP 3,000–6,000" },
  { value: "over6000", label: "Over EGP 6,000" },
];

export function matchesBudget(amount, budget) {
  if (budget === "under3000") return amount < 3000;
  if (budget === "3000to6000") return amount >= 3000 && amount <= 6000;
  if (budget === "over6000") return amount > 6000;
  return true;
}
