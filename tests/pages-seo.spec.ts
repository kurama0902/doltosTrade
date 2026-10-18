import { test, expect } from "@playwright/test";

test("privacy is a separate accessible page with the real operator and contact", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Privacy policy", exact: true })
    .last()
    .click();
  await expect(page).toHaveURL(/\/privacy\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Privacy policy.",
  );
  await expect(page.locator(".policy-article section")).toHaveCount(17);
  await expect(page.locator(".policy-details")).toContainText(
    "Dimitrii Grinciuc",
  );
  await expect(
    page
      .locator(".policy-details")
      .getByRole("link", { name: "earlyaccess@execordus.org" }),
  ).toHaveAttribute("href", "mailto:earlyaccess@execordus.org");
  await page
    .getByRole("navigation", { name: "Privacy policy contents" })
    .getByRole("link", { name: "Cookies and browser storage" })
    .click();
  await expect(page).toHaveURL(/#cookies$/);
  await expect(page.locator("#cookies")).toBeInViewport();
  await expect(page.locator(".policy-article")).toContainText(
    "does not send a prompt to an external model",
  );
});

test("desktop app button opens a dedicated placeholder and access contact", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Open ExecordusTrade desktop app", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/desktop\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Your desktop. A deeper view.",
  );
  await expect(
    page.getByRole("link", { name: "Request desktop access" }),
  ).toHaveAttribute("href", /mailto:earlyaccess@execordus.org/);
  await expect(
    page.getByRole("link", { name: "ExecordusTrade home" }).first(),
  ).toHaveAttribute("href", "/#home");
});

test("document pages remain responsive and keyboard navigable", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1440, 768, 390, 360]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/privacy/", "/desktop/"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        )
        .toBe(true);
      if (width === 1440 || width === 390)
        await page.screenshot({
          path: `/tmp/execordustrade-${path.split("/")[1]}-${width}.png`,
          fullPage: true,
        });
    }
  }
  expect(errors).toEqual([]);
});

test("production pages contain crawlable HTML, unique SEO, and valid structured data", async ({
  request,
}) => {
  test.skip(
    !test.info().config.metadata.production,
    "Checks generated production HTML.",
  );
  const titles = new Set<string>();
  for (const path of ["/", "/privacy/", "/desktop/"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain("<h1");
    expect(html).toContain("ExecordusTrade");
    expect(html).not.toContain("DoltosTrade");
    expect(html).toContain(
      `rel="canonical" href="https://execordus.org${path}"`,
    );
    expect(html).toContain("index, follow, max-image-preview:large");
    expect(html).toContain("https://execordus.org/social-card.png");
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    expect(title).toBeTruthy();
    titles.add(title!);
    const schema = JSON.parse(
      html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)![1],
    );
    expect(schema["@context"]).toBe("https://schema.org");
    expect(
      schema["@graph"].some(
        (item: { "@type": string }) => item["@type"] === "WebPage",
      ),
    ).toBe(true);
    if (path === "/privacy/") expect(html).toContain("Dimitrii Grinciuc");
  }
  expect(titles.size).toBe(3);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain(
    "<loc>https://execordus.org/privacy/</loc>",
  );
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain(
    "Sitemap: https://execordus.org/sitemap.xml",
  );
  const social = await request.get("/social-card.png");
  expect(social.headers()["content-type"]).toContain("image/png");
});

test("production content is readable without JavaScript and hydrates without errors", async ({
  browser,
  page,
}) => {
  test.skip(
    !test.info().config.metadata.production,
    "Requires static production output.",
  );
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: "http://127.0.0.1:4173",
  });
  const staticPage = await context.newPage();
  for (const path of ["/", "/privacy/", "/desktop/"]) {
    await staticPage.goto(path);
    await expect(staticPage.getByRole("heading", { level: 1 })).toBeVisible();
  }
  await context.close();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const path of ["/", "/privacy/", "/desktop/"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  expect(errors).toEqual([]);
});
