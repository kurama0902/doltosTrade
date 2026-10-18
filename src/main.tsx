import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./styles.css";
import "./futures.css";
import "./market-lab.css";
import "./pages.css";
async function start() {
  const path = window.location.pathname;
  const Page = /^\/privacy(?:\/|\/index\.html)?$/.test(path)
    ? (await import("./pages/PrivacyPolicy")).default
    : /^\/desktop(?:\/|\/index\.html)?$/.test(path)
      ? (await import("./pages/DesktopPage")).default
      : path === "/" || path === "/index.html"
        ? (await import("./App")).default
        : (await import("./pages/NotFoundPage")).default;
  const root = document.getElementById("root")!;
  const page = (
    <React.StrictMode>
      <Page />
    </React.StrictMode>
  );
  if (root.hasChildNodes()) hydrateRoot(root, page);
  else createRoot(root).render(page);
}
void start();
