# ExecordusTrade SEO implementation

Production origin: **https://execordus.org**. Website operator: **Dimitrii Grinciuc**. Privacy contact: **earlyaccess@execordus.org**.

The implementation prepares the site for publication. It does not deploy to the domain, modify DNS, submit URLs to search engines, or promise rankings or rich results.

## Routes and search intent

| Route       | Search intent                                                                                          | Title                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| `/`         | Futures platform, order-flow tools, footprint, volume profile, liquidity heatmap, AI-assisted analysis | ExecordusTrade \| Order Flow & Futures Trading Platform |
| `/privacy/` | Brand privacy information and operator transparency                                                    | Privacy Policy \| ExecordusTrade                        |
| `/desktop/` | Brand desktop application and access information                                                       | Desktop Trading App \| ExecordusTrade                   |

Every route has its own title, description, canonical URL, English language declaration, Open Graph metadata, Twitter card metadata, and structured data. The desktop page accurately presents a placeholder and early-access contact; it does not claim that an installer, operating-system version, price, or release number exists.

## Crawlable content and rendering

`npm run build` first creates the static Vite bundles, then renders the actual React page components to HTML during the build. The generated homepage includes its headings, feature descriptions, plans, educational copy, FAQs, contact links, and risk disclosure. The policy and desktop pages also contain their full text before JavaScript runs.

The browser hydrates this HTML to enable dialogs and chart interaction. The production tests explicitly read the generated pages with JavaScript disabled and check for hydration errors with JavaScript enabled. This approach addresses the distinction between crawling an HTML response and rendering JavaScript described in [Google’s JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

The result remains a static Vite deployment; no Node server is required in production. The temporary server-rendering bundle is kept under the ignored `node_modules/.cache/execordus-prerender/` directory.

## Metadata and canonicalization

`src/seo.tsx` is the production metadata source. `src/site.ts` defines public site settings and page-specific copy.

- Canonicals use the exact HTTPS origin `https://execordus.org`.
- Document routes use `/privacy/` and `/desktop/`, consistently with navigation and sitemap entries.
- Open Graph includes the page title, description, site name, locale, canonical page URL, image URL, image dimensions, media type, and image description.
- Twitter cards use `summary_large_image` with matching page-specific copy and image alt text. No social-account handle is invented.
- The document declares `lang="en"`, viewport, theme color, referrer behavior, and application name.
- Production robots metadata allows indexing and supplies generous image/snippet preview directives.
- Set `VITE_SITE_INDEXABLE=false` for a staging build. Setting `VITE_SITE_URL` to an empty string produces noindex preview metadata without production canonicals or a production sitemap.
- No obsolete keyword stuffing, hidden SEO text, invented geographic targeting, or alternate-language hreflang entries are added.

The raw development HTML intentionally uses noindex metadata. Use the production build to inspect the complete canonical and social metadata.

## Structured data

The JSON-LD graph describes:

1. **Organization**: ExecordusTrade brand, supplied operator name, production URL, logo, and privacy contact.
2. **WebSite**: the named English-language website and publisher relationship.
3. **WebPage**: route-specific title, description, URL, language, and relationship to the website. The policy includes its documented revision date.
4. **SoftwareApplication** on the homepage and desktop page: a finance application and the features actually described on the page.
5. **BreadcrumbList** on the privacy and desktop pages, matching visible breadcrumbs.

No ratings, reviews, pricing offers, free-trial promises, operating-system requirements, release versions, or download URLs are fabricated. An actual `downloadUrl` is emitted only when `VITE_DESKTOP_APP_URL` is configured. Organization metadata follows the concepts described in [Google’s organization structured-data documentation](https://developers.google.com/search/docs/appearance/structured-data/organization); software metadata is semantic markup, not a claim of guaranteed [software-app rich-result eligibility](https://developers.google.com/search/docs/appearance/structured-data/software-app).

The visible FAQ uses accessible native disclosure elements. It does not add FAQ rich-result markup or make an eligibility promise.

## Sitemap, robots, and missing pages

The build generates:

- `dist/sitemap.xml` with the three absolute canonical page URLs.
- `dist/robots.txt` with a crawl allowance and an absolute sitemap declaration.
- `dist/404.html` with a useful recovery page and noindex metadata.

The sitemap does not invent modification dates or attach unnecessary priority/change-frequency hints. Its role is discovery; [Google explains that sitemap submission is a hint rather than a guarantee of crawling](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

On the chosen host, serve `404.html` with an actual **404 HTTP status** for missing URLs. Avoid an indiscriminate SPA fallback that serves the homepage with status 200 for every unknown path. The privacy and desktop folders contain real `index.html` files and should be served directly.

## Social images and brand assets

- `public/social-card.png`: a locally rendered **1200 × 630** PNG share card.
- `public/social-card.svg`: editable source artwork.
- `public/brand-logo.svg`: the ExecordusTrade logo referenced by structured data.
- `public/favicon.svg`: scalable browser icon.
- `public/apple-touch-icon.png`: 180 × 180 icon.
- `public/icon-192.png` and `public/icon-512.png`: manifest icons.
- `public/site.webmanifest`: English brand, theme, and local icon references.

Regenerate the PNG assets with `node scripts/generate-social-assets.mjs` using an installed Playwright Chromium browser. This renders local artwork only and makes no external image-generation or download request.

## Performance and user experience

- Each document loads its route component dynamically; the privacy page does not import the chart and animation libraries needed by the homepage.
- Vite produces content-hashed JavaScript and CSS assets.
- The prerendering step includes route-specific critical CSS and a preload for the route’s JavaScript entry.
- Local variable fonts are preloaded; no external font service is required.
- Interactive chart containers have explicit heights to stabilize their layout.
- The share image and icons are local assets with known dimensions.
- Reduced-motion behavior, keyboard-operated dialogs, native FAQs, policy contents links, visible focus indicators, and the keyboard skip link are preserved.
- Production browser tests cover 360–1440 px viewports without horizontal overflow.

At deployment, enable HTTPS and compression through the host. Cache content-hashed assets for long periods; keep HTML, `robots.txt`, and the sitemap revalidatable. The repository does not assume an unselected hosting provider or fabricate its cache configuration.

## Content and trust signals

The owner-supplied collaborator section presents Hugging Face, Microsoft, Modal, and Shadeform with local official logos and short company descriptions. The continuous carousel supports mouse/touch dragging with hidden scrollbars and has one accessible list; visual duplicate links are excluded from keyboard and screen-reader navigation. It does not add certification or endorsement claims to the structured data.

The homepage contains descriptive, visible sections about footprint charts, Volume & Delta Profile, DeepDOM, Order Flow Analyzer, Deep Replay, DeepGamma, the AI Assistant, connectivity, plans, and training. The market lab and examples are labeled simulated. The risk disclosure remains visible in the footer.

The privacy page identifies the supplied operator and privacy email, explains actual preview behavior, and links to official privacy-rights references. It distinguishes browser-side state from hosting logs and the website from any future desktop application or live service. No unknown hosting provider, log retention period, business address, or jurisdiction is invented.

`[NAME]` remains the trainer-name placeholder supplied in the earlier content brief. Replace it with the confirmed name when available; no trainer identity has been invented for SEO.

## Configuration

Copy `.env.example` to a local environment file if overrides are needed. `VITE_` values are public build-time settings, not secrets.

| Setting                | Default or purpose                                                            |
| ---------------------- | ----------------------------------------------------------------------------- |
| `VITE_SITE_URL`        | `https://execordus.org`; canonical production origin                          |
| `VITE_SITE_INDEXABLE`  | `true`; set `false` on staging                                                |
| `VITE_DESKTOP_APP_URL` | Empty; the button uses `/desktop/` until a real HTTPS destination is provided |
| `VITE_LEGAL_OPERATOR`  | Dimitrii Grinciuc                                                             |
| `VITE_PRIVACY_EMAIL`   | earlyaccess@execordus.org                                                     |
| `VITE_LEGAL_ADDRESS`   | Optional; omitted when not supplied                                           |

Changes to the domain, policy, desktop destination, or metadata require a rebuild.

## Verification commands

```bash
npm run build
npm run seo:audit
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test -- --config=playwright.production.config.ts
```

The SEO audit validates unique title/description metadata, lengths, canonical URLs, HTML headings, JSON-LD, sitemap/robots consistency, the social image dimensions, and noindex handling for the static 404 page. Browser checks additionally verify native privacy-page navigation, operator/contact details, responsive documents, the desktop placeholder, content without JavaScript, and hydration.

## Publication follow-through

After deployment, verify that the domain serves this build over HTTPS, that the three canonical pages return 200, and that missing pages return 404. Redirect alternative hostnames and HTTP to the chosen canonical HTTPS origin through the host. Then verify ownership in the relevant webmaster tools, submit `https://execordus.org/sitemap.xml`, and inspect the pages and social previews against the deployed URLs.

These external publication and search-console actions are not performed by this local implementation. Monitor real crawl, indexing, and performance data after publication rather than relying on an invented SEO score.
