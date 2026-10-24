import { useSyncExternalStore } from "react";
import { checkoutStore } from "./checkoutStore.js";

export function useCheckoutSnapshot() {
  return useSyncExternalStore(
    checkoutStore.subscribe,
    checkoutStore.getSnapshot,
    checkoutStore.getSnapshot,
  );
}
