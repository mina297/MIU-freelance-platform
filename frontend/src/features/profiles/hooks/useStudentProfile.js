import { useEffect, useState } from "react";
import { PROFILE_LOAD_DELAY_MS } from "../constants.js";
import { getStudentProfileById } from "../utils/getStudentProfile.js";

/** Loads a student profile, with optional loading delay and refreshKey. */
export function useStudentProfile(studentId, options = {}) {
  const { simulateDelay = true, refreshKey = 0 } = options;
  const [loadedId, setLoadedId] = useState(() =>
    simulateDelay ? null : studentId,
  );

  useEffect(() => {
    if (!simulateDelay) {
      return undefined;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (!cancelled) {
        setLoadedId(studentId);
      }
    }, PROFILE_LOAD_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [studentId, simulateDelay]);

  const isLoading = simulateDelay && loadedId !== studentId;

  if (isLoading) {
    return { status: "loading", data: null };
  }

  void refreshKey;
  const result = getStudentProfileById(studentId);
  if (!result) {
    return { status: "not_found", data: null };
  }

  return { status: "ready", data: result };
}
