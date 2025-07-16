import "./index.css";

// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// import { ThemeProvider } from "@/context/theme-provider";
import { ThemeProvider } from "@/components/ui/theme-provider";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <App />
  </ThemeProvider>
  // </StrictMode>
);
