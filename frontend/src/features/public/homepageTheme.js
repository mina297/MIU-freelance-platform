export const HOMEPAGE_THEME_KEY = "miu-homepage-theme";

export function readThemePreference(browser) {
  try {
    const value = browser?.localStorage.getItem(HOMEPAGE_THEME_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}

export function resolveHomepageTheme(
  browser,
  preference = readThemePreference(browser),
) {
  return (
    preference ??
    (browser?.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light")
  );
}

export function saveThemePreference(browser, theme) {
  try {
    browser.localStorage.setItem(HOMEPAGE_THEME_KEY, theme);
  } catch {
    // A blocked storage area must not prevent the current page from switching.
  }
}
