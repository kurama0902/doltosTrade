const httpsUrl = (value: string | undefined) => {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
};
export const site = {
  name: "ExecordusTrade",
  origin:
    httpsUrl(import.meta.env.VITE_SITE_URL ?? "https://execordus.org")?.replace(
      /\/$/,
      "",
    ) || "",
  desktopUrl: httpsUrl(import.meta.env.VITE_DESKTOP_APP_URL),
  operator: import.meta.env.VITE_LEGAL_OPERATOR?.trim() || "Dimitrii Grinciuc",
  privacyEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    import.meta.env.VITE_PRIVACY_EMAIL || "earlyaccess@execordus.org",
  )
    ? (import.meta.env.VITE_PRIVACY_EMAIL || "earlyaccess@execordus.org").trim()
    : "",
  legalAddress: import.meta.env.VITE_LEGAL_ADDRESS?.trim() || "",
  indexable: import.meta.env.VITE_SITE_INDEXABLE !== "false",
  policyUpdated: "2026-10-18",
};
export const desktopHref = site.desktopUrl || "/desktop/";
export const pageDefinitions = {
  "/": {
    title: "ExecordusTrade | Order Flow & Futures Trading Platform",
    description:
      "Read order flow with footprint charts, volume and delta profiles, DeepDOM liquidity heatmaps, market replay, and an AI Assistant for futures traders.",
    label: "Home",
  },
  "/privacy/": {
    title: "Privacy Policy | ExecordusTrade",
    description:
      "Learn how the ExecordusTrade website handles form inputs, technical requests, cookies, simulated AI interactions, privacy rights, and desktop-app links.",
    label: "Privacy policy",
  },
  "/desktop/": {
    title: "Desktop Trading App | ExecordusTrade",
    description:
      "Explore the ExecordusTrade desktop trading platform: footprint charts, DeepDOM, volume profiles, replay, and AI-assisted futures analysis in one workspace.",
    label: "Desktop app",
  },
};
export type PagePath = keyof typeof pageDefinitions;
export function pagePath(pathname: string): PagePath {
  if (/^\/privacy(?:\/|\/index\.html)?$/.test(pathname)) return "/privacy/";
  if (/^\/desktop(?:\/|\/index\.html)?$/.test(pathname)) return "/desktop/";
  return "/";
}
