import { useEffect, useState } from "react";
import { PROFILE_LOAD_DELAY_MS } from "../constants.js";
import { getClientProfileById } from "../utils/getClientProfile.js";

/**
 * @param {string | undefined} clientId
 * @param {{ simulateDelay?: boolean }} [options]
 */
export function useClientProfile(clientId, options = {}) {
  const { simulateDelay = true } = options;
  const [loadedId, setLoadedId] = useState(() =>
    simulateDelay ? null : clientId,
  );
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!simulateDelay) {
      return undefined;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (!cancelled) {
        setLoadedId(clientId);
      }
    }, PROFILE_LOAD_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [clientId, simulateDelay]);

  const isLoading = simulateDelay && loadedId !== clientId;

  if (isLoading) {
    return { status: "loading", data: null, refresh: () => setTick((n) => n + 1) };
  }

  // tick forces re-read after simulated edits
  void tick;

  const result = getClientProfileById(clientId);
  if (!result) {
    return { status: "not_found", data: null, refresh: () => setTick((n) => n + 1) };
  }

  return {
    status: "ready",
    data: result,
    refresh: () => setTick((n) => n + 1),
  };
}
