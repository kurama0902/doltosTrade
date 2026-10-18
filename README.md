# ExecordusTrade

An English-language futures and order-flow platform homepage built with **Vite, React, and TypeScript**. The visual style draws on the supplied Crypto Planet Figma design and Deepcharts, with the content and structure adapted to ExecordusTrade.

Production domain: **https://execordus.org**. The privacy policy is a separate page at `/privacy/`; the desktop-app placeholder is at `/desktop/`. Both identify the ExecordusTrade brand, with Dimitrii Grinciuc and earlyaccess@execordus.org as the supplied operator and privacy contact.

Read [SEO.md](SEO.md) for the complete SEO implementation, static rendering, metadata, sitemap, social assets, deployment details, and validation steps.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite, normally http://localhost:5173.

```bash
npm run build    # TypeScript, Vite build, and static prerendering
npm run seo:audit # Validate generated SEO metadata and assets
npm run preview  # Serve the production build
```

## Experience

- An animated collaborator carousel for Hugging Face, Microsoft, Modal, and Shadeform, using locally hosted official logos, company descriptions, mouse and touch dragging, hidden scrollbars, keyboard access, and reduced-motion support. Logo sources are recorded in `public/partners/SOURCES.md`.
- Futures-focused hero: “Read order flow. Not just candles.”
- Platform metrics: 8 indicators, 0.015-second refresh, and an AI trading assistant.
- Seven capabilities: AI Assistant, Footprint Charts, Volume & Delta Profile, DeepDOM, Order Flow Analyzer, Deep Replay, and DeepGamma.
- An interactive simulated futures workspace for ES, NQ, CL, and GC, with bid/ask footprint clusters, Recharts candles and area charts, timeframe controls, and a mock depth ladder.
- An interactive market lab with linked volume/delta profiles, cumulative delta, and a liquidity heatmap. Switch futures contracts and sessions; play, pause, scrub, step, and speed up the simulated replay. Inspect price levels, toggle delta series, change the chart window, filter resting size, or navigate the heatmap with arrow keys.
- A dedicated AI section with selectable, clearly labeled example responses. `[NAME]` remains a content placeholder for the person who trained the assistant.
- Rithmic, CQG, and dxFeed connectivity presentation, including prop-firm compatibility copy.
- Four toolkit cards: Orderflow, Full (most popular), Pro, and standalone DeepDOM. No subscription prices are invented; the cards use the supplied plan descriptions.
- Order-flow course, weekly live breakdowns, Discord community, final CTA, and the supplied futures/AI risk disclosure in English.
- Accessible native dialogs for plan previews and educational content. Forms do not transmit data, create accounts, or collect payments.

The page is a frontend product preview. Chart data is deterministic and simulated. AI responses are curated examples, with no live AI, broker, market-data, payment, or account integration.

## Motion

GSAP powers masked word reveals, staggered card entrances, and layered scroll parallax. Pointer-responsive card tilt, React Bits Star Border and Spotlight Card effects, and viewport-aware ambient motion enrich the page. Reduced-motion preferences are respected and can change while the page is open.

## Separate pages and desktop access

`/privacy/` contains a detailed, 17-section notice describing the actual browser preview, hosting boundaries, data handling, rights, and contact information. `/desktop/` is the requested placeholder, with a platform preview and early-access email link. Configure `VITE_DESKTOP_APP_URL` when the official HTTPS app or installer destination is ready; navigation buttons will then point there.

Defaults for the domain, operator, and contact are in `src/site.ts`; `.env.example` documents public overrides. No business address, hosting provider, retention schedule, download version, or desktop URL is invented.

## Browser checks

```bash
npx playwright install chromium
npm run dev
# In another terminal:
npm test
# Check the production build, separate routes, prerendering, and metadata:
npm run test:production
```

For an existing Chromium installation, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` when running tests. The suite covers responsive layouts, requested English copy, contracts and chart modes, AI examples, plan selection and form feedback, educational dialogs, mobile navigation, parallax, hover effects, and live reduced-motion changes.

Screenshots: `/tmp/execordustrade-futures-1440.png` and `/tmp/execordustrade-futures-390.png`.

## Source map

- `src/App.tsx`: homepage sections and interactive flows
- `src/pages/`: separate privacy, desktop, and 404 pages
- `src/site.ts` and `src/seo.tsx`: public settings and page metadata
- `scripts/build.mjs`: static rendering, sitemap, robots, and 404 generation
- `scripts/audit-seo.mjs`: repeatable checks of generated metadata and assets
- `src/content.ts`: capabilities, plans, lessons, AI examples, and disclosure
- `src/components/Charts.tsx`: footprint and Recharts futures previews
- `src/data.ts`: instrument fixtures and deterministic chart data
- `src/orderFlowData.ts`: a shared simulated tape for the three linked analysis charts
- `src/components/OrderFlowLab.tsx`: chart inspectors, liquidity grid, and replay controls
- `src/hooks/usePageMotion.ts`: GSAP motion and preference cleanup
- `src/styles.css`, `src/futures.css`, and `src/market-lab.css`: shared design styling and futures layouts
- `src/components/react-bits/`: upstream animated components and license

## Design references and attribution

- [Original Figma design](https://www.figma.com/design/ylFajAWQeA1vTUwrpyOM9J/Crypto-Planet---Crypto-Trading-Exchange-UI-Template-In-Figma--Community-?node-id=5-6)
- [Deepcharts](https://www.deepcharts.com/)
- [React Bits](https://reactbits.dev/): Star Border and Spotlight Card by David Haz; license retained beside the components.
- DM Sans and Manrope: SIL Open Font License files included in `public/fonts/`.
