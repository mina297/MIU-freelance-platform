// Existing tab data is copied once; a failed copy leaves the source intact.
export function readProfileLocalData(key) {
  const local = window.localStorage;
  const raw = local.getItem(key);
  const current = raw ? JSON.parse(raw) : {};
  if (!current || typeof current !== "object" || Array.isArray(current))
    throw new Error("Invalid profile data");
  let previous;
  try {
    previous = window.sessionStorage?.getItem(key);
  } catch {
    return current;
  }
  if (previous) {
    let old;
    try {
      old = JSON.parse(previous);
    } catch {
      return current;
    }
    if (!old || typeof old !== "object" || Array.isArray(old)) return current;
    const merged = { ...old, ...current };
    local.setItem(key, JSON.stringify(merged));
    window.sessionStorage.removeItem?.(key);
    return merged;
  }
  return current;
}
