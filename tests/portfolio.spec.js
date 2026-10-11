import { test, expect } from "@playwright/test";

test("intro hover and touch reveal seven graphics without navigating", async ({ page }, testInfo) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  const intro = page.locator(".intro");
  const machine = page.getByRole("button", { name: "주변 작업물 그래픽 펼치기" });
  const orbs = page.locator(".intro-orb");
  await expect(intro).toHaveAttribute("data-active", "false");
  await expect(page.locator(".intro-background")).toHaveCSS("opacity", "0.5");
  await expect(orbs).toHaveCount(7);
  await expect(page.locator(".header-caption, .header-work, .intro-hint, .intro-bottom")).toHaveCount(0);
  await expect(page.locator(".lottery-ball, .handle-layer, .glass-target")).toHaveCount(0);
  await page.evaluate(() => {
    window.introStates = [];
    new MutationObserver(() => window.introStates.push(document.querySelector(".intro").dataset.active))
      .observe(document.querySelector(".intro"), { attributes: true, attributeFilter: ["data-active"] });
  });
  if (testInfo.project.name === "mobile") await machine.tap();
  else await machine.hover();
  await expect(machine).toHaveAttribute("aria-pressed", "true");
  await expect(orbs.first()).toHaveCSS("opacity", "1");
  await expect(orbs.last()).toHaveCSS("opacity", "1");
  await expect(page.locator(".intro-background")).toHaveCSS("opacity", "1");
  await expect(page.locator(".intro-machine-art")).toHaveCSS("transform", "matrix(0.94, 0, 0, 0.94, 0, 0)");
  // Remain active after the final stagger and float have started.
  await page.waitForTimeout(1000);
  await expect(intro).toHaveAttribute("data-active", "true");
  await expect(page).not.toHaveURL(/#work/);
  const floatBefore = await page.locator(".intro-orb-float").first().evaluate(el => getComputedStyle(el).transform);
  await page.waitForTimeout(150);
  const floatAfter = await page.locator(".intro-orb-float").first().evaluate(el => getComputedStyle(el).transform);
  expect(floatBefore).not.toBe(floatAfter);
  if (testInfo.project.name === "mobile") {
    await machine.tap();
    await expect(intro).toHaveAttribute("data-active", "false");
    await machine.tap();
    await expect(intro).toHaveAttribute("data-active", "true");
    await page.touchscreen.tap(page.viewportSize().width - 8, 10);
  } else {
    const bounds = await page.locator(".intro-interaction").boundingBox();
    // The visual shrinks, but its original hit area remains stable at its edges.
    for (const x of [bounds.x + 2, bounds.x + bounds.width - 2, bounds.x + bounds.width / 2]) {
      await page.mouse.move(x, bounds.y + bounds.height / 2);
      await expect(intro).toHaveAttribute("data-active", "true");
    }
    await machine.click();
    await expect(intro).toHaveAttribute("data-active", "true");
    expect(await page.evaluate(() => window.introStates)).toEqual(["true"]);
    await page.mouse.move(5, 5);
  }
  await expect(intro).toHaveAttribute("data-active", "false");
  await expect(orbs.first()).toHaveCSS("opacity", "0");
  await expect(orbs.last()).toHaveCSS("opacity", "0");
  await expect(page.locator(".intro-background")).toHaveCSS("opacity", "0.5");
  await expect(page.locator(".intro-machine-art")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  await expect(page).not.toHaveURL(/#work/);
  expect(errors).toEqual([]);
});

test("intro logo crossfades without layout shift and rapid hover reverses cleanly", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Hover is desktop-only.");
  await page.goto("/");
  const logo = page.locator(".intro-logo");
  const before = await logo.boundingBox();
  await logo.hover();
  await expect(page.locator(".intro-logo-image--default")).toHaveCSS("opacity", "0");
  await expect(page.locator(".intro-logo-image--hover")).toHaveCSS("opacity", "1");
  await expect(page.locator(".intro-logo-images")).toHaveCSS("transform", "matrix(1.07, 0, 0, 1.07, 0, 0)");
  expect(await logo.boundingBox()).toEqual(before);
  await page.mouse.move(5, 5);
  await expect(page.locator(".intro-logo-image--default")).toHaveCSS("opacity", "1");
  await expect(page.locator(".intro-logo-image--hover")).toHaveCSS("opacity", "0");
  const machine = page.locator(".machine");
  for (let index = 0; index < 4; index++) {
    await machine.hover();
    await page.waitForTimeout(80);
    await page.mouse.move(5, 5);
  }
  await expect(page.locator(".intro")).toHaveAttribute("data-active", "false");
  await expect(page.locator(".intro-orb").first()).toHaveCSS("opacity", "0");
  await machine.hover();
  await expect(page.locator(".intro-orb").last()).toHaveCSS("opacity", "1");
  await expect(page).not.toHaveURL(/#work/);
});

test("keyboard toggles and reduced motion avoids travel and floating", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const machine = page.getByRole("button", { name: "주변 작업물 그래픽 펼치기" });
  const firstOrb = page.locator(".intro-orb").first();
  const initialBox = await firstOrb.boundingBox();
  await machine.focus();
  await page.keyboard.press("Enter");
  await expect(machine).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".intro-orb").last()).toHaveCSS("opacity", "1");
  const activeBox = await firstOrb.boundingBox();
  expect(Math.abs((initialBox.x + initialBox.width / 2) - (activeBox.x + activeBox.width / 2))).toBeLessThan(1);
  expect(Math.abs((initialBox.y + initialBox.height / 2) - (activeBox.y + activeBox.height / 2))).toBeLessThan(1);
  await expect(page.locator(".intro-orb-float").first()).toHaveCSS("animation-name", "none");
  await page.keyboard.press("Space");
  await expect(machine).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("Space");
  await expect(machine).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Enter");
  await expect(machine).toHaveAttribute("aria-pressed", "false");
  await expect(page).not.toHaveURL(/#work/);
});

test("all popup formats, dismissal methods, focus and scroll restoration", async ({
  page,
}) => {
  await page.goto("/#work");
  await page.evaluate(() => window.scrollTo(0, 380));
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page
    .locator('.project-card[data-project-type="scroll"]')
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".project-modal__story img")).toHaveCount(3);
  await page.getByTestId("project-media").evaluate((element) => {
    element.scrollTop = 250;
  });
  expect(
    await page
      .getByTestId("project-media")
      .evaluate((element) => element.scrollTop),
  ).toBeGreaterThan(0);
  await expect(
    page.getByRole("button", { name: "작업 설명 닫기" }),
  ).toBeFocused();
  const bodyBefore = await page.evaluate(() => document.body.style.top);
  await page.mouse.wheel(0, 400);
  expect(await page.evaluate(() => document.body.style.position)).toBe("fixed");
  expect(await page.evaluate(() => document.body.style.top)).toBe(bodyBefore);
  await page.getByRole("button", { name: "작업 설명 닫기" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBe(scrollBefore);
  await expect(
    page.locator('.project-card[data-project-type="scroll"]').first(),
  ).toBeFocused();

  await page
    .locator('.project-card[data-project-type="carousel"]')
    .first()
    .click();
  await expect(page.getByTestId("slide-count")).toHaveText("01 / 03");
  await page.getByRole("button", { name: "다음 이미지" }).click();
  await expect(page.getByTestId("slide-count")).toHaveText("02 / 03");
  await page.getByRole("button", { name: "이전 이미지" }).click();
  await expect(page.getByTestId("slide-count")).toHaveText("01 / 03");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("slide-count")).toHaveText("02 / 03");
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByTestId("slide-count")).toHaveText("01 / 03");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.locator('.project-card[data-project-type="reel"]').first().click();
  const reel = await page.getByTestId("reel-frame").boundingBox();
  expect(reel.width / reel.height).toBeCloseTo(9 / 16, 2);
  await page
    .getByTestId("project-modal-backdrop")
    .click({ position: { x: 3, y: 3 } });
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("modal history, direct links and keyboard focus trap", async ({
  page,
}) => {
  await page.goto("/#work");
  await page
    .locator('.project-card[data-project-type="carousel"]')
    .first()
    .click();
  await expect(
    page.getByRole("button", { name: "작업 설명 닫기" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  expect(
    await page
      .getByRole("dialog")
      .evaluate((dialog) => dialog.contains(document.activeElement)),
  ).toBe(true);
  await expect(
    page.getByRole("button", { name: "작업 설명 닫기" }),
  ).not.toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "작업 설명 닫기" }),
  ).toBeFocused();
  await page.goBack();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goForward();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.goto("/#work/orbit-studio");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "작업 설명 닫기" }).click();
  await expect(page).toHaveURL(/#work$/);
});

test("responsive masonry, full image ratios and visible close controls", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await page.screenshot({
    path: `test-results/intro-${testInfo.project.name}.png`,
  });
  const introGeometry = await page.evaluate(() => {
    const machine = document.querySelector(".machine").getBoundingClientRect();
    const bg = document
      .querySelector(".intro-background")
      .getBoundingClientRect();
    return {
      machine: {
        x: machine.x,
        y: machine.y,
        width: machine.width,
        height: machine.height,
      },
      bg: { x: bg.x, width: bg.width },
      viewport: { width: innerWidth, height: innerHeight },
    };
  });
  expect(introGeometry.machine.x).toBeGreaterThanOrEqual(0);
  expect(introGeometry.machine.y).toBeGreaterThanOrEqual(0);
  expect(
    introGeometry.machine.x + introGeometry.machine.width,
  ).toBeLessThanOrEqual(introGeometry.viewport.width);
  expect(
    introGeometry.machine.y + introGeometry.machine.height,
  ).toBeLessThanOrEqual(introGeometry.viewport.height);
  expect(
    introGeometry.machine.width / introGeometry.machine.height,
  ).toBeCloseTo(435 / 740, 2);
  await page.goto("/#work");
  await page.screenshot({
    path: `test-results/work-${testInfo.project.name}.png`,
    fullPage: true,
  });
  const columns =
    page.viewportSize().width <= 760
      ? "2"
      : page.viewportSize().width <= 1100
        ? "3"
        : "4";
  expect(
    await page
      .locator(".project-grid")
      .evaluate((element) => getComputedStyle(element).columnCount),
  ).toBe(columns);
  const images = await page
    .locator(".project-cover img")
    .evaluateAll((elements) =>
      elements.map((image) => ({
        natural: image.naturalWidth / image.naturalHeight,
        rendered: image.clientWidth / image.clientHeight,
        loaded: image.complete && image.naturalWidth > 0,
      })),
    );
  for (const image of images) {
    expect(image.loaded).toBe(true);
    expect(image.rendered).toBeCloseTo(image.natural, 1);
  }
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(page.viewportSize().width);
  for (const type of ["scroll", "carousel", "reel"]) {
    await page
      .locator(`.project-card[data-project-type="${type}"]`)
      .first()
      .click();
    await expect
      .poll(() =>
        page
          .getByRole("dialog")
          .evaluate((element) => getComputedStyle(element).opacity),
      )
      .toBe("1");
    await expect
      .poll(() =>
        page
          .getByTestId("project-modal-backdrop")
          .evaluate((element) => getComputedStyle(element).opacity),
      )
      .toBe("1");
    const close = await page
      .getByRole("button", { name: "작업 설명 닫기" })
      .boundingBox();
    const viewport = page.viewportSize();
    expect(close.x).toBeGreaterThan(0);
    expect(close.y).toBeGreaterThan(0);
    expect(close.x + close.width).toBeLessThan(viewport.width);
    expect(close.y + close.height).toBeLessThan(viewport.height);
    await page.screenshot({
      path: `test-results/${type}-${testInfo.project.name}.png`,
    });
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }
  await page.getByRole("button", { name: "Branding", exact: true }).click();
  const categoryText = await page
    .locator(".project-caption > span")
    .allTextContents();
  expect(categoryText.length).toBeGreaterThan(0);
  expect(categoryText.every((text) => text.includes("Branding"))).toBe(true);
});

test("native mobile touch swipe changes carousel slides", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile",
    "Touch gesture is tested with the mobile device.",
  );
  await page.goto("/#work");
  await page
    .locator('.project-card[data-project-type="carousel"]')
    .first()
    .tap();
  const slide = await page.getByTestId("carousel-slide").boundingBox();
  const cdp = await page.context().newCDPSession(page);
  const y = slide.y + slide.height / 2;
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: slide.x + slide.width * 0.8, y }],
  });
  for (const fraction of [0.65, 0.5, 0.35, 0.2]) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: slide.x + slide.width * fraction, y }],
    });
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page.getByTestId("slide-count")).toHaveText("02 / 03");
});

test("gallery position survives back and forward, malformed hashes are harmless", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  // The new intro has no gallery link; navigate by the existing public hash route.
  await page.evaluate(() => { window.location.hash = "work"; });
  await expect(page.locator(".project-card").first()).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 540));
  await page.goBack();
  await expect(page.locator(".intro")).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(/#work$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(540);
  await page.goto("/#work/%E0%A4%A");
  await expect(page.locator(".project-card")).toHaveCount(12);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("intro fits seven circles on small, tall, landscape and wide displays", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Check the extra viewports once.");
  for (const [width, height] of [
    [320, 480], [320, 568], [375, 667], [390, 844], [430, 600], [430, 932],
    [768, 1024], [834, 1112], [1024, 768], [1440, 900],
    [1920, 1080], [2560, 1080], [844, 390], [667, 375],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page.locator(".machine").hover();
    await page.waitForTimeout(1650);
    const elements = await page.locator(".intro-orb-image, .intro-interaction, .intro-logo").evaluateAll(elements =>
      elements.map(el => {
        const r = el.getBoundingClientRect();
        return { className: el.className, x: r.x, y: r.y, right: r.right, bottom: r.bottom };
      }));
    expect(elements).toHaveLength(9);
    for (const box of elements) {
      expect(box.x, `${width}x${height} ${box.className} left`).toBeGreaterThanOrEqual(0);
      expect(box.y, `${width}x${height} ${box.className} top`).toBeGreaterThanOrEqual(0);
      expect(box.right, `${width}x${height} ${box.className} right`).toBeLessThanOrEqual(width);
      expect(box.bottom, `${width}x${height} ${box.className} bottom`).toBeLessThanOrEqual(height);
    }
    await expect(page.locator(".intro-background")).toHaveCSS("object-fit", "contain");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});
