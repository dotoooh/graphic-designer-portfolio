import { test, expect } from "@playwright/test";

test("intro trigger, sequential animation, one-shot lock and history", async ({
  page,
}, testInfo) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const assets = [];
  page.on("request", (request) => assets.push(request.url()));
  await page.goto("/");
  await expect(page.locator(".intro")).toHaveAttribute("data-phase", "idle");
  // Record actual DOM phases and computed animations throughout the transition.
  await page.evaluate(() => {
    window.observedPhases = [];
    const intro = document.querySelector(".intro");
    new MutationObserver(() => {
      window.observedPhases.push({
        phase: intro.dataset.phase,
        time: performance.now(),
        ball: getComputedStyle(document.querySelector(".lottery-ball"))
          .animationName,
        handle: getComputedStyle(document.querySelector(".handle-layer"))
          .animationName,
        zoom: getComputedStyle(document.querySelector(".intro-scene"))
          .animationName,
      });
    }).observe(intro, { attributes: true, attributeFilter: ["data-phase"] });
  });
  const machine = page.getByRole("button", {
    name: "뽑기 기계를 작동하고 작업물 보기",
  });
  if (testInfo.project.name === "mobile") await machine.tap();
  else {
    // Hovering the base must not start the machine, only the glass does.
    const box = await machine.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.9);
    await expect(page.locator(".intro")).toHaveAttribute("data-phase", "idle");
    await page.locator(".glass-target").hover();
  }
  await expect(page.locator(".intro")).toHaveAttribute("data-phase", "mixing");
  await expect(page.locator(".glass-animation")).toHaveCSS("opacity", "1");
  expect(
    await page
      .locator(".lottery-ball")
      .first()
      .evaluate((ball) => getComputedStyle(ball).transform),
  ).not.toBe("none");
  await page.screenshot({
    path: `test-results/mixing-${testInfo.project.name}.png`,
  });
  await machine.dispatchEvent("click");
  await expect(page.locator(".intro")).toHaveAttribute("data-phase", "turning");
  await expect(page.locator(".intro")).toHaveAttribute("data-phase", "zooming");
  await expect(page).toHaveURL(/#work$/);
  const observed = await page.evaluate(() => window.observedPhases);
  expect(observed.map((item) => item.phase)).toEqual([
    "mixing",
    "turning",
    "zooming",
  ]);
  expect(observed[0].ball).toBe("ball-tumble");
  expect(observed[1].handle).toBe("handle-turn");
  expect(observed[2].zoom).toBe("swoosh-in");
  expect(observed[1].time - observed[0].time).toBeGreaterThan(1200);
  expect(observed[1].time - observed[0].time).toBeLessThan(1600);
  await expect(page.locator(".project-card")).toHaveCount(12);
  await page.goBack();
  await expect(page.locator(".intro")).toHaveAttribute("data-phase", "idle");
  expect(assets.some((url) => /main1\.png/.test(url))).toBe(false);
  expect(errors).toEqual([]);
});

test("keyboard activation and reduced-motion fade", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => {
    window.observedPhases = [];
    const intro = document.querySelector(".intro");
    new MutationObserver(() =>
      window.observedPhases.push(intro.dataset.phase),
    ).observe(intro, { attributes: true, attributeFilter: ["data-phase"] });
  });
  const machine = page.getByRole("button", {
    name: "뽑기 기계를 작동하고 작업물 보기",
  });
  await machine.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#work$/);
  expect(await page.evaluate(() => window.observedPhases)).toEqual(["fade"]);
  await page.goBack();
  await machine.focus();
  await page.keyboard.press("Space");
  await expect(page).toHaveURL(/#work$/);
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
  await page.getByRole("button", { name: "Selected work" }).click();
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

test("short phones, landscape and wide displays keep intro contents on screen", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "Extra viewports are checked once.",
  );
  for (const [width, height] of [
    [320, 568],
    [375, 667],
    [768, 1024],
    [1024, 768],
    [1920, 1080],
    [2560, 1080],
    [844, 390],
    [667, 375],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    const box = await page.locator(".machine").boundingBox();
    const hint = await page.locator(".intro-hint").boundingBox();
    expect(box.x).toBeGreaterThan(0);
    expect(box.y).toBeGreaterThan(0);
    expect(box.x + box.width).toBeLessThan(width);
    expect(box.y + box.height).toBeLessThan(height);
    expect(hint.y + hint.height).toBeLessThan(height);
    expect(hint.y).toBeGreaterThan(box.y + box.height - 8);
    const background = await page
      .locator(".intro-background")
      .evaluate((img) => getComputedStyle(img).objectFit);
    expect(background).toBe("contain");
    await page.screenshot({
      path: `test-results/intro-${width}x${height}.png`,
    });
    await page.goto("/#work");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  }
});
