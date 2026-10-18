import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const svg = await readFile("public/social-card.svg", "utf8");
  await page.setContent(
    `<style>html,body{margin:0;width:1200px;height:630px;overflow:hidden}</style>${svg}`,
  );
  await page.screenshot({ path: "public/social-card.png" });
  const favicon = await readFile("public/favicon.svg", "utf8");
  for (const [size, name] of [
    [180, "apple-touch-icon.png"],
    [192, "icon-192.png"],
    [512, "icon-512.png"],
  ]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      `<style>html,body{margin:0;width:100%;height:100%;overflow:hidden}svg{width:100%;height:100%}</style>${favicon}`,
    );
    await page.screenshot({ path: `public/${name}` });
  }
  console.info("Generated 1200×630 social preview and local PNG app icons.");
} finally {
  await browser.close();
}
