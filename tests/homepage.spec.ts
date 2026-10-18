import { test, expect } from "@playwright/test";

test("English futures page renders responsively without browser errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1440, 1024, 768, 390, 360]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      "Read order flow. Not just candles.",
    );
    await expect(page.locator(".footprint-view").first()).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      )
      .toBe(true);
    if (width === 1440 || width === 390) {
      await page.screenshot({
        path: `/tmp/execordustrade-futures-${width}.png`,
        fullPage: true,
      });
      await page
        .locator("#analytics")
        .screenshot({ path: `/tmp/execordustrade-market-lab-${width}.png` });
    }
  }
  expect(errors).toEqual([]);
});

test("requested futures content, tools, connections, plans, and disclosure are present", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".feature-card")).toHaveCount(7);
  await expect(page.locator(".metrics-section")).toContainText("0.015");
  await expect(page.locator(".metrics-section")).toContainText("Indicators");
  await expect(page.locator("#assistant")).toContainText(
    "personally trained by [NAME]",
  );
  await expect(page.locator("#assistant")).toContainText(
    "The final decision always stays with the trader.",
  );
  for (const name of ["Rithmic", "CQG", "dxFeed"])
    await expect(
      page.locator(".connection-card").filter({ hasText: name }),
    ).toHaveCount(1);
  await expect(page.locator(".pricing-card")).toHaveCount(4);
  await expect(page.locator(".popular-plan")).toContainText("Full");
  await expect(page.locator(".popular-plan")).toContainText("MOST POPULAR");
  await expect(page.locator(".risk-disclosure")).toHaveText(
    "Futures trading involves a high risk of loss. The AI Assistant does not provide investment advice. Past performance does not guarantee future results.",
  );
  expect(await page.locator("main").innerText()).not.toMatch(
    /Bitcoin|Tether|Crypto Planet|USDT/,
  );
});

test("futures contracts, timeframes, footprint, and Recharts modes are interactive", async ({
  page,
}) => {
  await page.goto("/");
  const terminal = page.locator(".terminal-large");
  await terminal
    .getByRole("combobox", { name: "Futures contract" })
    .selectOption("NQ");
  await expect(terminal.locator(".pair-price")).toContainText("20,416.50");
  const before = await terminal.locator(".footprint-candles").innerText();
  await terminal.getByRole("button", { name: "4H", exact: true }).click();
  await expect(
    terminal.getByRole("button", { name: "4H", exact: true }),
  ).toHaveClass("selected");
  await expect(terminal.locator(".footprint-candles")).not.toHaveText(before);
  await terminal.getByRole("button", { name: "Toggle chart type" }).click();
  await expect(terminal.locator(".chart-kind")).toContainText("Candles");
  await expect(terminal.locator(".recharts-surface")).toBeVisible();
  await terminal.getByRole("button", { name: "Toggle chart type" }).click();
  await expect(terminal.locator(".chart-kind")).toContainText("Area");
  await expect(terminal.locator(".recharts-area")).toHaveCount(1);
  await terminal.getByRole("button", { name: "Toggle chart type" }).click();
  await expect(terminal.locator(".footprint-view")).toBeVisible();
});

test("AI examples change context and remain explicitly simulated", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Explain the delta", exact: false })
    .click();
  await expect(page.locator(".assistant-answer")).toContainText(
    "positive delta",
  );
  await expect(page.locator(".assistant-source")).toContainText("Footprint");
  await page
    .getByRole("button", { name: "Help me review a setup", exact: false })
    .click();
  await expect(page.locator(".assistant-answer")).toContainText(
    "not a trade signal",
  );
  await expect(page.locator(".assistant-disclosure")).toContainText(
    "No live AI connection.",
  );
});

test("each pricing plan opens its own access preview and submits honestly", async ({
  page,
}) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog");
  for (const plan of ["Orderflow", "Full", "Pro", "DeepDOM"]) {
    await page
      .getByRole("button", { name: `Choose ${plan}`, exact: true })
      .click();
    await expect(
      dialog.getByRole("combobox", { name: "Your toolkit" }),
    ).toHaveValue(plan);
    await expect(dialog.getByRole("heading")).toHaveText(`Explore ${plan}.`);
    await page.keyboard.press("Escape");
  }
  await page.getByRole("button", { name: "Choose Full", exact: true }).click();
  await dialog
    .getByRole("combobox", { name: "Your toolkit" })
    .selectOption("Pro");
  await expect(dialog.getByRole("heading")).toHaveText("Explore Pro.");
  await dialog
    .getByRole("textbox", { name: "Email address" })
    .fill("trader@example.com");
  await dialog.getByRole("button", { name: "Continue to preview" }).click();
  await expect(dialog).toContainText("the Pro access flow");
  await expect(dialog).toContainText("No account was created");
  await dialog.getByRole("button", { name: "Explore the workspace" }).click();
  await expect(dialog).not.toBeVisible();
});

test("feature details, lessons, and the final CTA are usable", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Explore DeepGamma", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("SPX gamma levels");
  await page.getByRole("button", { name: "Got it", exact: false }).click();
  await page.locator(".learn-card").first().click();
  await expect(page.getByRole("dialog")).toContainText("bid and ask volume");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Get started", exact: false }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("mobile navigation scrolls to pricing and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Toggle navigation" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Pricing" })
    .click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#pricing$/);
});

test("motion, card tilt, parallax, and live reduced-motion changes remain functional", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors: string[] = [];
  const warnings: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "warn" && message.text().includes("GSAP target"))
      warnings.push(message.text());
  });
  await page.goto("/");
  await expect(page.locator(".headline-word").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await expect
    .poll(() => page.locator(".motion-word").count())
    .toBeGreaterThan(0);
  const orbit = page.locator(".parallax-orbit");
  const initial = await orbit.evaluate((el) => getComputedStyle(el).transform);
  await page.locator("#features").scrollIntoViewIfNeeded();
  await expect
    .poll(() => orbit.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(initial);
  const card = page.locator(".feature-card").first();
  await card.hover({ position: { x: 25, y: 25 } });
  await expect(card).toHaveCSS("opacity", "1");
  await expect
    .poll(() =>
      card.evaluate((el) =>
        parseFloat(el.style.getPropertyValue("--tilt-angle")),
      ),
    )
    .toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".motion-word")).toHaveCount(0);
  await expect(card).toHaveCSS("rotate", "none");
  expect(errors).toEqual([]);
  expect(warnings).toEqual([]);
});

test("market lab contracts and sessions update all linked charts", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const lab = page.locator("#analytics");
  await expect(lab.locator(".analysis-card")).toHaveCount(3);
  await lab
    .getByRole("combobox", { name: "Analysis contract" })
    .selectOption("NQ");
  await expect(lab.locator(".lab-metrics")).toContainText("NQ");
  await expect(lab.locator(".profile-inspector")).toContainText("20,416.50");
  const profile = await lab.locator(".profile-inspector output").innerText();
  await lab
    .getByRole("combobox", { name: "Analysis session" })
    .selectOption("Midday");
  await expect(lab.locator(".lab-metrics")).toContainText("13:02");
  await expect(lab.locator(".profile-inspector output")).not.toHaveText(
    profile,
  );
  await expect(
    lab.getByRole("slider", { name: "Replay position" }),
  ).toHaveValue("32");
  expect(errors).toEqual([]);
});

test("replay scrubs, steps, plays, pauses, and stops at the end", async ({
  page,
}) => {
  await page.goto("/");
  const lab = page.locator("#analytics");
  const slider = lab.getByRole("slider", { name: "Replay position" });
  const initial = await lab.locator(".profile-inspector output").innerText();
  await lab.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(slider).toHaveValue("1");
  await expect(lab.locator(".profile-inspector output")).not.toHaveText(
    initial,
  );
  await expect(lab.getByRole("grid")).toHaveAttribute("aria-colcount", "1");
  await lab.getByRole("button", { name: "Step replay forward" }).click();
  await expect(slider).toHaveValue("2");
  await lab.getByRole("combobox", { name: "Replay speed" }).selectOption("4");
  await lab.getByRole("button", { name: "Play replay" }).click();
  await expect.poll(() => slider.inputValue().then(Number)).toBeGreaterThan(2);
  await lab.getByRole("button", { name: "Pause replay" }).click();
  await expect(lab.getByRole("button", { name: "Play replay" })).toBeVisible();
  await slider.focus();
  await slider.press("End");
  await expect(slider).toHaveValue("48");
  await expect(
    lab.getByRole("button", { name: "Step replay forward" }),
  ).toBeDisabled();
  await expect(lab.locator(".heatmap-times")).toContainText("11:04");
});

test("volume and delta charts expose selection, mode, and series controls", async ({
  page,
}) => {
  await page.goto("/");
  const profile = page.locator(".profile-card");
  await profile.getByRole("button", { name: "Delta", exact: true }).click();
  await expect(
    profile.getByRole("button", { name: "Delta", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await profile
    .getByRole("combobox", { name: "Inspect profile price" })
    .selectOption("0");
  await expect(
    profile.getByRole("combobox", { name: "Inspect profile price" }),
  ).toHaveValue("0");
  await expect(profile.locator(".profile-inspector")).toContainText("Δ");
  const delta = page.locator(".delta-card");
  await delta
    .getByRole("combobox", { name: "Delta chart window" })
    .selectOption("12");
  await expect(
    delta
      .getByRole("combobox", { name: "Inspect delta bar" })
      .locator("option"),
  ).toHaveCount(12);
  await delta.getByRole("button", { name: "Show cumulative delta" }).click();
  await expect(delta.locator(".recharts-line")).toHaveCount(0);
  await expect(
    delta.getByRole("button", { name: "Show per-bar delta" }),
  ).toBeDisabled();
  await delta.getByRole("button", { name: "Show cumulative delta" }).click();
  await expect(delta.locator(".recharts-line")).toHaveCount(1);
});

test("liquidity heatmap supports click, keyboard inspection, and size filtering", async ({
  page,
}) => {
  await page.goto("/");
  const heatmap = page.locator(".liquidity-card");
  await expect(heatmap.getByRole("gridcell")).toHaveCount(312);
  const cell = heatmap.getByRole("gridcell").nth(20);
  const label = await cell.getAttribute("aria-label");
  await cell.click();
  await expect(cell).toHaveAttribute("aria-selected", "true");
  expect(label).toContain(
    await heatmap.locator(".heatmap-inspector output > strong").innerText(),
  );
  const before = await heatmap.locator(".heatmap-inspector output").innerText();
  await cell.press("ArrowDown");
  await expect(heatmap.locator(".heatmap-inspector output")).not.toHaveText(
    before,
  );
  const active = heatmap.locator("[role=gridcell][aria-selected=true]");
  await expect(active).toBeFocused();
  const filter = heatmap.getByRole("slider", {
    name: "Minimum liquidity size",
  });
  await filter.focus();
  await filter.press("End");
  await expect(filter).toHaveValue("400");
  await expect(heatmap.locator(".liquidity-toolbar output")).toHaveText(
    "400 ct",
  );
  await heatmap.screenshot({
    path: "/tmp/execordustrade-liquidity-interactive.png",
  });
});

test("collaborator carousel shows official local logos and only four accessible company links", async ({
  page,
}) => {
  await page.goto("/");
  const carousel = page.getByRole("region", {
    name: "Companies we collaborate with.",
  });
  await expect(carousel).toBeVisible();
  await expect(carousel.getByRole("link")).toHaveCount(4);
  for (const name of ["Hugging Face", "Microsoft", "Modal", "Shadeform"]) {
    await expect(
      carousel.getByRole("img", { name: `${name} logo`, exact: true }),
    ).toHaveCount(1);
    const image = carousel.getByRole("img", {
      name: `${name} logo`,
      exact: true,
    });
    await expect
      .poll(() =>
        image.evaluate(
          (element) =>
            (element as HTMLImageElement).complete &&
            (element as HTMLImageElement).naturalWidth > 0,
        ),
      )
      .toBe(true);
    await expect(
      carousel.getByRole("link", { name: new RegExp(`^${name} —`) }),
    ).toHaveAttribute("target", "_blank");
  }
  await expect(
    page.getByText("YOUR ORDER-FLOW WORKSPACE", { exact: true }),
  ).toHaveCount(0);
  await expect(
    carousel.locator(".collaborator-group[aria-hidden=true] a").first(),
  ).toHaveAttribute("tabindex", "-1");
  await page.setViewportSize({ width: 390, height: 844 });
  await carousel.screenshot({
    path: "/tmp/execordustrade-collaborators-mobile.png",
  });
});

test("collaborator carousel supports dragging, automatic motion, and keyboard access without controls or scrollbars", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const carousel = page.locator("#collaborators");
  const viewport = carousel.locator(".collaborator-viewport");
  await carousel.scrollIntoViewIfNeeded();
  await expect(carousel.getByRole("button")).toHaveCount(0);
  await expect(viewport).toHaveCSS("scrollbar-width", "none");
  for (const slug of ["microsoft", "modal"]) {
    await expect(carousel.locator(`.logo-${slug}`).first()).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
  }
  await page.mouse.move(0, 0);
  const before = await viewport.evaluate((element) => element.scrollLeft);
  await expect
    .poll(() => viewport.evaluate((element) => element.scrollLeft))
    .not.toBe(before);
  await viewport.hover();
  // Drag across a company link: move the strip without opening that link.
  const bounds = (await viewport.boundingBox())!;
  const startX = bounds.x + bounds.width * 0.6;
  const y = bounds.y + 120;
  await page.mouse.move(startX, y);
  const dragStart = await viewport.evaluate((element) => element.scrollLeft);
  await page.mouse.down();
  await page.mouse.move(startX - 180, y, { steps: 12 });
  await expect(viewport).toHaveAttribute("data-dragging", "true");
  await page.mouse.up();
  await expect(viewport).toHaveAttribute("data-dragging", "false");
  const dragEnd = await viewport.evaluate((element) => element.scrollLeft);
  expect(Math.abs(dragEnd - dragStart)).toBeGreaterThan(150);
  expect(page.context().pages()).toHaveLength(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.mouse.move(0, 0);
  await expect(carousel).toHaveAttribute("data-paused", "true");
  const stopped = await viewport.evaluate((element) => element.scrollLeft);
  await page.waitForTimeout(150);
  expect(await viewport.evaluate((element) => element.scrollLeft)).toBe(
    stopped,
  );
  await viewport.focus();
  await page.keyboard.press("ArrowRight");
  expect(await viewport.evaluate((element) => element.scrollLeft)).not.toBe(
    stopped,
  );
  await page.keyboard.press("Tab");
  await expect(
    carousel.getByRole("link", { name: /^Hugging Face —/ }),
  ).toBeFocused();
  // All four original links remain keyboard reachable after looping.
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(
    carousel.getByRole("link", { name: /^Shadeform —/ }),
  ).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 900 });
  await carousel.screenshot({
    path: "/tmp/execordustrade-collaborators-desktop.png",
  });
});

test("collaborator cards follow a touch swipe without scrolling the page vertically", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/");
  const viewport = page.locator(".collaborator-viewport");
  await viewport.scrollIntoViewIfNeeded();
  const bounds = (await viewport.boundingBox())!;
  const x = bounds.x + 280;
  const y = bounds.y + 100;
  const before = await viewport.evaluate((element) => element.scrollLeft);
  const top = await page.evaluate(() => window.scrollY);
  const session = await context.newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y }],
  });
  for (let step = 1; step <= 10; step++) {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x - step * 16, y }],
    });
  }
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  expect(
    Math.abs(
      (await viewport.evaluate((element) => element.scrollLeft)) - before,
    ),
  ).toBeGreaterThan(120);
  expect(
    Math.abs((await page.evaluate(() => window.scrollY)) - top),
  ).toBeLessThan(3);
  await expect(viewport).toHaveCSS("scrollbar-width", "none");
  expect(context.pages()).toHaveLength(1);
  await context.close();
});
