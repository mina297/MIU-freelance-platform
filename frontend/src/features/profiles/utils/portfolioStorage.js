import {
  getPortfolioItemById,
  getPortfolioItemsForStudent,
} from "../../../data/fixtures/portfolio.js";
import { PORTFOLIO_OVERRIDES_STORAGE_KEY } from "../constants.js";
import { ownsProfile } from "./profileOwnership.js";

function readAll() {
  try {
    const raw = window.sessionStorage.getItem(PORTFOLIO_OVERRIDES_STORAGE_KEY);
    const value = raw ? JSON.parse(raw) : {};
    return value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};
  } catch {
    return {};
  }
}

function writeAll(all) {
  window.sessionStorage.setItem(
    PORTFOLIO_OVERRIDES_STORAGE_KEY,
    JSON.stringify(all),
  );
}

/** Put fixture images back when a saved item is missing imageSrc. */
function rehydrateItemImages(item) {
  if (!item || item.imageSrc || item.imageCleared) return item;
  const fixture = getPortfolioItemById(item.id);
  if (fixture?.imageSrc) {
    return {
      ...item,
      imageSrc: fixture.imageSrc,
      imageAlt: item.imageAlt || fixture.imageAlt,
    };
  }
  return item;
}

/** Portfolio items for one student (session overrides win over fixtures). */
export function getResolvedPortfolioItems(studentId) {
  if (!studentId) return [];
  if (typeof window === "undefined") {
    return getPortfolioItemsForStudent(studentId);
  }
  const all = readAll();
  if (Array.isArray(all[studentId])) {
    return all[studentId].map(rehydrateItemImages);
  }
  return getPortfolioItemsForStudent(studentId);
}

/**
 * @param {string} studentId
 * @param {object[]} items
 */
export function savePortfolioItemsForStudent(studentId, items, session) {
  if (!ownsProfile(session, studentId, "student"))
    throw new Error("Only the active student owner can change this portfolio.");
  const all = readAll();
  all[studentId] = items;
  writeAll(all);
  return items;
}

/**
 * @param {string} studentId
 * @param {object} item
 */
export function upsertPortfolioItem(studentId, item, session) {
  if (!item || item.studentId !== studentId || typeof item.id !== "string")
    throw new Error("Portfolio item must belong to this student.");
  const current = getResolvedPortfolioItems(studentId);
  const index = current.findIndex((entry) => entry.id === item.id);
  const next =
    index >= 0
      ? current.map((entry, i) => (i === index ? item : entry))
      : [item, ...current];
  return savePortfolioItemsForStudent(studentId, next, session);
}

/**
 * @param {string} studentId
 * @param {string} itemId
 */
export function deletePortfolioItem(studentId, itemId, session) {
  const next = getResolvedPortfolioItems(studentId).filter(
    (entry) => entry.id !== itemId,
  );
  return savePortfolioItemsForStudent(studentId, next, session);
}
