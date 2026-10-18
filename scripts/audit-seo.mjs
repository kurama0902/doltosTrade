import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
const directory = resolve(process.argv[2] || "dist");
const origin = (process.env.VITE_SITE_URL ?? "https://execordus.org").replace(
  /\/$/,
  "",
);
const titles = new Set();
const descriptions = new Set();
const report = [];
for (const [path, file] of [
  ["/", "index.html"],
  ["/privacy/", "privacy/index.html"],
  ["/desktop/", "desktop/index.html"],
]) {
  const html = await readFile(resolve(directory, file), "utf8");
  const head = html.split("</head>")[0];
  const title = head.match(/<title>(.*?)<\/title>/)?.[1];
  const description = head.match(
    /<meta name="description" content="([^"]*)"/,
  )?.[1];
  assert(
    title && title.length <= 70,
    `${path}: descriptive title of suitable length`,
  );
  assert(
    description && description.length >= 100 && description.length <= 175,
    `${path}: useful description length`,
  );
  assert.equal((head.match(/<title>/g) || []).length, 1, `${path}: one title`);
  assert.equal(
    (head.match(/name="description"/g) || []).length,
    1,
    `${path}: one description`,
  );
  assert.equal(
    (html.match(/<h1\b/g) || []).length,
    1,
    `${path}: one prerendered H1`,
  );
  assert(html.includes('lang="en"'), `${path}: English document language`);
  assert(!html.includes("DoltosTrade"), `${path}: branding updated`);
  assert(
    head.includes('name="twitter:card" content="summary_large_image"'),
    `${path}: social card metadata`,
  );
  if (origin) {
    assert(
      head.includes(`rel="canonical" href="${origin}${path}"`),
      `${path}: correct canonical`,
    );
    assert(
      head.includes(`${origin}/social-card.png`),
      `${path}: share image URL`,
    );
  }
  const schema = JSON.parse(
    head.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1] ||
      "{}",
  );
  assert.equal(schema["@context"], "https://schema.org");
  assert(
    schema["@graph"].some((item) => item["@type"] === "WebPage"),
    `${path}: page structured data`,
  );
  assert(
    !schema["@graph"].some((item) => item.aggregateRating || item.offers),
    `${path}: no invented ratings or offers`,
  );
  titles.add(title);
  descriptions.add(description);
  report.push({
    path,
    titleCharacters: title.length,
    descriptionCharacters: description.length,
    prerendered: true,
    canonical: origin ? `${origin}${path}` : "preview",
  });
}
assert.equal(titles.size, 3, "Unique page titles");
assert.equal(descriptions.size, 3, "Unique page descriptions");
const image = await readFile(resolve(directory, "social-card.png"));
assert.equal(image.readUInt32BE(16), 1200);
assert.equal(image.readUInt32BE(20), 630);
const notFound = await readFile(resolve(directory, "404.html"), "utf8");
assert(notFound.includes("noindex, follow"), "404 is noindex");
assert(
  !notFound.includes('rel="canonical"'),
  "404 must not canonicalize to homepage",
);
if (origin && process.env.VITE_SITE_INDEXABLE !== "false") {
  const robots = await readFile(resolve(directory, "robots.txt"), "utf8");
  const sitemap = await readFile(resolve(directory, "sitemap.xml"), "utf8");
  assert(
    robots.includes(`Sitemap: ${origin}/sitemap.xml`),
    "robots sitemap declaration",
  );
  for (const path of ["/", "/privacy/", "/desktop/"])
    assert(sitemap.includes(`<loc>${origin}${path}</loc>`), "Complete sitemap");
}
console.info(
  JSON.stringify(
    {
      status: "passed",
      domain: origin || "preview",
      pages: report,
      socialImage: "1200x630 PNG",
      structuredData: true,
      static404: true,
    },
    null,
    2,
  ),
);
