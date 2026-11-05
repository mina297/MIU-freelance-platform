import { useState } from "react";
import { NavigationContext } from "./NavigationContext.js";
import {
  readNavigationLayout,
  saveNavigationLayout,
} from "./navigationModel.js";
function storage() {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}
export default function NavigationProvider({ children }) {
  const [layout, updateLayout] = useState(() =>
    readNavigationLayout(storage()),
  );
  function setLayout(value) {
    if (!["top", "side"].includes(value)) return;
    updateLayout(value);
    saveNavigationLayout(storage(), value);
  }
  return (
    <NavigationContext.Provider value={{ layout, setLayout }}>
      {children}
    </NavigationContext.Provider>
  );
}
