/**
 * Normalize and validate a user-facing link for safe external navigation.
 * @param {string | undefined | null} raw
 * @returns {{ href: string | null, display: string, isSafe: boolean, isDemoOnly: boolean }}
 */
export function resolveExternalLink(raw) {
  const display = String(raw ?? "").trim();
  if (!display) {
    return { href: null, display: "", isSafe: false, isDemoOnly: false };
  }

  // Explicitly fictional demo TLDs / labels — show but do not navigate.
  const lower = display.toLowerCase();
  if (
    lower.includes(".example") ||
    lower.endsWith(".test") ||
    lower.includes("demo-only") ||
    lower.startsWith("javascript:") ||
    lower.startsWith("data:")
  ) {
    return { href: null, display, isSafe: false, isDemoOnly: true };
  }

  let candidate = display;
  if (!/^https?:\/\//i.test(candidate)) {
    // Host-style paths like github.com/user → https://github.com/user
    if (/^[a-z0-9.-]+\.[a-z]{2,}([/:].*)?$/i.test(candidate)) {
      candidate = `https://${candidate}`;
    } else {
      return { href: null, display, isSafe: false, isDemoOnly: false };
    }
  }

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return { href: null, display, isSafe: false, isDemoOnly: false };
    }
    return {
      href: url.toString(),
      display,
      isSafe: true,
      isDemoOnly: false,
    };
  } catch {
    return { href: null, display, isSafe: false, isDemoOnly: false };
  }
}
