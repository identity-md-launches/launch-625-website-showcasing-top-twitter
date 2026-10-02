import { dependencyRequire } from "./dependencies.mjs";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, extname } from "node:path";
import assert from "node:assert/strict";
const { chromium } = dependencyRequire("playwright");
const { default: AxeBuilder } = await import(
  dependencyRequire.resolve("@axe-core/playwright")
);
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".jpg": "image/webp",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
};
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (!pathname.startsWith("/preview/")) throw 0;
    const relative = pathname.slice("/preview/".length) || "index.html";
    const path = resolve("dist", relative);
    if (!path.startsWith(resolve("dist") + "/")) throw 0;
    res.writeHead(200, {
      "Content-Type": mime[extname(path)] || "application/octet-stream",
    });
    res.end(await readFile(path));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({
  headless: true,
  ...(process.env.IMD_CHROMIUM_PATH
    ? { executablePath: process.env.IMD_CHROMIUM_PATH }
    : {}),
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1050 },
});
const page = await context.newPage();
const errors = [],
  failures = [],
  checks = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("requestfailed", (r) => {
  if (r.failure()?.errorText !== "net::ERR_ABORTED")
    failures.push(r.url() + " " + r.failure()?.errorText);
});
page.on("response", (r) => {
  if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
});
const url = `http://127.0.0.1:${server.address().port}/preview/`;
const count = async (n) =>
  assert.equal(await page.locator(".post-card").count(), n);
const check = (message) => {
  checks.push(message);
  console.log("PASS", message);
};
try {
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  await count(7);
  await page.waitForFunction(
    () => document.querySelector("video").currentTime > 0.1,
  );
  check("Subpath export loads seven posts, local font and playing video.");
  assert.equal(
    await page.evaluate(() => document.fonts.check('16px "Space Grotesk"')),
    true,
  );
  const source = JSON.parse(await readFile("src/posts.json", "utf8"));
  const links = await page
    .locator(".post-link")
    .evaluateAll((es) => es.map((e) => e.href));
  assert.deepEqual(
    links,
    source.map((p) => p.url),
  );
  check("All seven supplied X destinations match the curated data.");
  await page.getByRole("button", { name: "Pause background video" }).click();
  assert.equal(await page.locator("video").evaluate((v) => v.paused), true);
  await page.screenshot({
    path: "artifacts/desktop.jpg",
    type: "jpeg",
    quality: 80,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Play background video" }).click();
  await page.waitForFunction(() => !document.querySelector("video").paused);
  check("Video pause and play controls work.");
  await page.getByRole("button", { name: "Articles 4", exact: true }).click();
  await count(4);
  await page.getByRole("button", { name: "Posts 3", exact: true }).click();
  await count(3);
  await page.getByRole("button", { name: "All reads 7", exact: true }).click();
  await count(7);
  check("Article and post filters return 4 and 3 reads.");
  await page.getByLabel("Search", { exact: true }).fill("Bankless");
  await count(1);
  await page.getByLabel("Search", { exact: true }).fill("no-such-idea");
  await count(0);
  assert.equal(await page.getByText("No reads for “no-such-idea”").count(), 1);
  await page.getByRole("button", { name: "Explore all reads" }).click();
  await count(7);
  check("Search, no-result state and reset recover the full collection.");
  await page.getByLabel("Sort by").selectOption("newest");
  assert.equal(
    await page.locator(".author-name").first().innerText(),
    "washed",
  );
  await page.getByLabel("Sort by").selectOption("oldest");
  assert.equal(
    await page.locator(".author-name").first().innerText(),
    "nftimm",
  );
  await page.getByLabel("Sort by").selectOption("curated");
  check("Newest, oldest and curated sorting work.");
  await page
    .getByRole("button", { name: "Save Inside IMD", exact: false })
    .click();
  await page.getByRole("button", { name: "Saved 1", exact: true }).click();
  await count(1);
  await page.reload();
  assert.equal(
    await page.getByRole("button", { name: "Saved 1", exact: true }).count(),
    1,
  );
  await page.getByRole("button", { name: "Saved 1", exact: true }).click();
  await count(1);
  await page
    .getByRole("button", { name: "Unsave Inside IMD", exact: false })
    .click();
  await count(0);
  assert.equal(
    await page.getByText("Your next good read goes here.").count(),
    1,
  );
  await page.getByRole("button", { name: "Explore all reads" }).click();
  check(
    "Save, reload persistence, saved-only filter, unsave and empty recovery work.",
  );
  await page.getByRole("button", { name: "Dismiss save notification" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.waitForTimeout(350);
  assert.equal(await page.locator("video").evaluate((v) => v.paused), true);
  check("Reduced motion disables video autoplay.");
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent),
    "Skip to the collection",
  );
  await page.keyboard.press("Enter");
  assert.equal(new URL(page.url()).hash, "#collection");
  await page.getByRole("button", { name: "Articles 4", exact: true }).focus();
  await page.keyboard.press("Enter");
  await count(4);
  await page.getByRole("button", { name: "All reads 7", exact: true }).focus();
  await page.keyboard.press("Space");
  await count(7);
  await page.screenshot({
    path: "artifacts/keyboard-focus.jpg",
    type: "jpeg",
    quality: 80,
  });
  check(
    "Keyboard skip link, Enter/Space filter activation and visible focus captured.",
  );
  const contrast = await page.evaluate(() => {
    function luminance(color) {
      const values = color
        .match(/[\d.]+/g)
        .slice(0, 3)
        .map(Number)
        .map((v) => {
          v /= 255;
          return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        });
      return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
    }
    return [
      ["Page text", "body", "html"],
      ["Card excerpt", ".excerpt", ".post-card"],
      ["Primary button", ".primary-button", ".primary-button"],
      ["Secondary text", ".author-handle", ".post-card"],
      ["Focus ring", ".filters button", "html"],
    ].map(([role, fg, bg]) => {
      const color = getComputedStyle(document.querySelector(fg))[
        role === "Focus ring" ? "outlineColor" : "color"
      ];
      const background = getComputedStyle(
        document.querySelector(bg),
      ).backgroundColor;
      const a = luminance(color),
        b = luminance(background);
      return {
        role,
        color,
        background,
        ratio: Number(
          ((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2),
        ),
      };
    });
  });
  await writeFile("artifacts/contrast.json", JSON.stringify(contrast, null, 2));
  assert.ok(
    contrast.every(
      (pair) => pair.ratio >= (pair.role === "Focus ring" ? 3 : 4.5),
    ),
  );
  check(
    "Computed solid text/background and focus pairs meet their contrast thresholds.",
  );
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  await writeFile(
    "artifacts/accessibility.json",
    JSON.stringify(
      {
        violations: axe.violations,
        incomplete: axe.incomplete.map((x) => ({
          id: x.id,
          description: x.description,
          nodes: x.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
        passes: axe.passes.length,
      },
      null,
      2,
    ),
  );
  assert.equal(
    axe.violations.length,
    0,
    JSON.stringify(
      axe.violations.map((x) => ({
        id: x.id,
        nodes: x.nodes.map((n) => n.target),
      })),
    ),
  );
  check(
    `Axe WCAG scan: ${axe.violations.length} violations, ${axe.passes.length} passing rules.`,
  );
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width > 800 ? 1050 : 900 });
    await page.evaluate(() => window.scrollTo(0, 0));
    const size = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      width: innerWidth,
    }));
    assert.ok(
      size.scroll <= size.width,
      `Overflow at ${width}: ${size.scroll}`,
    );
    await page.screenshot({
      path: `artifacts/${width === 1440 ? "desktop" : width === 768 ? "tablet" : width === 390 ? "mobile" : "mobile-320"}.jpg`,
      type: "jpeg",
      quality: 80,
      fullPage: true,
    });
    check(
      `No horizontal overflow at ${width}px; full-page screenshot captured.`,
    );
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  check(
    "200% root text enlargement: no horizontal page overflow (not browser-native zoom).",
  );
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "";
  });
  // Static fallback when the video cannot load.
  await page.route("**/swarm.mp4", (r) => r.abort());
  await page.reload();
  await page.waitForTimeout(300);
  assert.ok(
    await page.getByText("Still illustration", { exact: true }).count(),
  );
  await count(7);
  await page.waitForLoadState("networkidle");
  await page.unroute("**/swarm.mp4");
  failures.length = 0;
  errors.length = 0;
  check("Video failure leaves the poster and collection usable.");
  await page.reload();
  await page.waitForLoadState("networkidle");
  assert.deepEqual(errors, []);
  assert.deepEqual(failures, []);
  check("Final export: no console errors or failed resources.");
  await writeFile(
    "artifacts/check-results.json",
    JSON.stringify(
      { checkedAt: new Date().toISOString(), checks, errors, failures },
      null,
      2,
    ),
  );
  console.log(`PASS ${checks.length} check groups.`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
