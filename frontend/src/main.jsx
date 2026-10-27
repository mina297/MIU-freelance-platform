import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root"), {
  onUncaughtError(error) {
    window.dispatchEvent(new Event("miu:app-error"));
    console.error(error);
  },
}).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
