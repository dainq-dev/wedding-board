/**
 * QA §6 cho các mẫu 2D: đo tràn ngang ở 360px, bắt lỗi console/page,
 * bấm mở thiệp để chụp trạng thái sau khi mở, và chụp full-page 3 kích thước.
 *
 * Chạy: bun scripts/qa-2d.ts [--base http://localhost:3212] [--out /tmp/opencode/shots6]
 * Dùng Chrome hệ thống (channel chrome) nên không cần tải browser của Playwright.
 */
import { mkdir } from "node:fs/promises";
import { chromium, type Page } from "playwright";

const arg = (name: string, fallback: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};

const BASE = arg("base", "http://localhost:3212");
const OUT = arg("out", "/tmp/opencode/shots6");
const SLUGS = [
  "sakura-2d",
  "letter-2d",
  "polaroid-2d",
  "film-2d",
  "editorial-2d",
  "song-hy-2d",
  "ao-dai-2d",
  "swiss-2d",
  "botanical-2d",
  "boho-2d",
];

type Result = {
  route: string;
  overflow360: number;
  consoleErrors: string[];
  pageErrors: string[];
  gateClicked: boolean;
};

const GATE = [
  'div[role="button"]',
  "button:has-text('Mở thiệp')",
  "button:has-text('Bấm máy')",
  "button:has-text('Mở sổ')",
];

async function watch(page: Page) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text().slice(0, 160));
  });
  page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 160)));
  return { consoleErrors, pageErrors };
}

async function audit(route: string): Promise<Result> {
  const browser = await chromium.launch({
    channel: "chrome",
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });
  const page = await browser.newPage({ viewport: { width: 360, height: 740 } });
  const { consoleErrors, pageErrors } = await watch(page);

  await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(2200);

  const overflow360 = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );

  let gateClicked = false;
  for (const sel of GATE) {
    const el = page.locator(sel).first();
    if ((await el.count()) > 0) {
      try {
        await el.click({ timeout: 4000 });
        gateClicked = true;
        await page.waitForTimeout(1600);
        break;
      } catch {
        /* gate không bấm được: ghi nhận false */
      }
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: `${OUT}/${route.replace(/\//g, "_")}-390.png`,
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({
    path: `${OUT}/${route.replace(/\//g, "_")}-1440.png`,
    fullPage: true,
  });

  await browser.close();
  return { route, overflow360, consoleErrors, pageErrors, gateClicked };
}

await mkdir(OUT, { recursive: true });

const routes = ["/", ...SLUGS.map((s) => `/mau-thiep-cuoi/${s}`)];
const results: Result[] = [];
for (const route of routes) {
  const r = await audit(route);
  results.push(r);
  console.log(
    `${r.route.padEnd(28)} overflow360=${String(r.overflow360).padStart(4)} gate=${r.gateClicked ? "y" : "n"} consoleErr=${r.consoleErrors.length} pageErr=${r.pageErrors.length}`,
  );
  for (const e of r.consoleErrors.slice(0, 2)) console.log(`    console: ${e}`);
  for (const e of r.pageErrors.slice(0, 2)) console.log(`    page: ${e}`);
}

await Bun.write(`${OUT}/report.json`, JSON.stringify(results, null, 2));
console.log(`\nScreenshots + report.json: ${OUT}`);
