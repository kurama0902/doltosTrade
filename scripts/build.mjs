import { build } from "vite";
import react from "@vitejs/plugin-react";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const outputIndex = process.argv.indexOf("--outDir");
const outputDirectory = resolve(
  outputIndex >= 0 ? process.argv[outputIndex + 1] : "dist",
);
await build({ build: { outDir: outputDirectory } });
// Build only into an ignored cache: the public output stays a static Vite site.
const serverDirectory = resolve("node_modules/.cache/execordus-prerender");
await build({
  configFile: false,
  plugins: [react()],
  ssr: { noExternal: ["gsap", "recharts"] },
  build: {
    ssr: "src/entry-server.tsx",
    outDir: serverDirectory,
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: "render.mjs" } },
  },
});
const { renderPage } = await import(
  pathToFileURL(resolve(serverDirectory, "render.mjs")).href
);
const manifest = JSON.parse(
  await readFile(resolve(outputDirectory, ".vite/manifest.json"), "utf8"),
);
const entries = [
  ["/", "index.html"],
  ["/privacy/", "privacy/index.html"],
  ["/desktop/", "desktop/index.html"],
];
for (const [path, file] of entries) {
  const rendered = renderPage(path);
  const template = await readFile(resolve(outputDirectory, file), "utf8");
  const pageEntry =
    path === "/"
      ? "src/App.tsx"
      : path === "/privacy/"
        ? "src/pages/PrivacyPolicy.tsx"
        : "src/pages/DesktopPage.tsx";
  const pageAssets = manifest[pageEntry];
  const criticalAssets = [
    ...(pageAssets?.css || []).map(
      (file) => `<link rel="stylesheet" href="/${file}">`,
    ),
    ...(pageAssets?.file
      ? [`<link rel="modulepreload" href="/${pageAssets.file}">`]
      : []),
  ].join("");
  const html = template
    .replace(
      /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/,
      `<!-- seo:start -->${rendered.head}<!-- seo:end -->`,
    )
    .replace("</head>", () => `${criticalAssets}</head>`)
    .replace(
      '<div id="root"></div>',
      () => `<div id="root">${rendered.html}</div>`,
    );
  if (!html.includes(rendered.html))
    throw new Error(`Prerender failed for ${path}`);
  await writeFile(resolve(outputDirectory, file), html);
}
const settings = renderPage("/");
const xmlEscape = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
if (settings.origin && settings.indexable) {
  const urls = settings.pages
    .map(
      (path) =>
        `  <url><loc>${xmlEscape(`${settings.origin}${path}`)}</loc></url>`,
    )
    .join("\n");
  await writeFile(
    resolve(outputDirectory, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  await writeFile(
    resolve(outputDirectory, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${settings.origin}/sitemap.xml\n`,
  );
} else {
  await writeFile(
    resolve(outputDirectory, "robots.txt"),
    "User-agent: *\nAllow: /\n# Preview pages use noindex until VITE_SITE_URL is configured.\n",
  );
  console.info(
    "SEO preview mode: set VITE_SITE_URL to emit canonical URLs, social-image URLs, and sitemap.xml.",
  );
}
const notFound = renderPage("/", true);
const homeTemplate = await readFile(
  resolve(outputDirectory, "index.html"),
  "utf8",
);
await writeFile(
  resolve(outputDirectory, "404.html"),
  homeTemplate
    .replace(
      /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/,
      `<!-- seo:start -->${notFound.head}<!-- seo:end -->`,
    )
    .replace(
      /<div id="root">[\s\S]*<\/div>\s*<\/body>/,
      `<div id="root">${notFound.html}</div>\n</body>`,
    ),
);
console.info(
  "Prerendered homepage, privacy policy, desktop page, and 404 page.",
);
