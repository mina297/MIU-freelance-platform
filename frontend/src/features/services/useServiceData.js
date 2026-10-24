import { useSyncExternalStore } from "react";
import { serviceStore } from "./serviceStore.js";

/** Explicit data remains injectable for previews/tests; normal pages observe live demo state. */
export function useServiceData(data) {
  const live = useSyncExternalStore(
    serviceStore.subscribe,
    serviceStore.getSnapshot,
    serviceStore.getSnapshot,
  );
  return data ?? live;
}
