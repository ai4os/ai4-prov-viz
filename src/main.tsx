import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import 'tippy.js/dist/tippy.css';
import { GraphPage } from "./pages/graph/GraphPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GraphPage />
  </StrictMode>
);
