import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { products } from "../src/data/products.js";

const baseUrl = process.env.SITE_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const failures = [];
const report = [];

function check(condition, message) {
  report.push({ check: message, passed: Boolean(condition) });
  if (!condition) failures.push(message);
}

async function inspectPage(page, label) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  check(overflow.scrollWidth <= overflow.clientWidth, `${label}: no horizontal overflow`);
  check(await page.locator(".vite-error-overlay, #webpack-dev-server-client-overlay").count() === 0, `${label}: no framework error overlay`);
  const brokenImages = await page.locator("img").evaluateAll((images) => images
    .filter((image) => image.complete && image.naturalWidth === 0)
    .map((image) => image.getAttribute("src")));
  check(brokenImages.length === 0, `${label}: all rendered images load`);
}

async function revealLazyImages(page) {
  await page.evaluate(async () => {
    const distance = Math.max(500, window.innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += distance) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 70));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(180);
}

await mkdir("qa", { recursive: true });

const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const desktopPage = await desktop.newPage();
const desktopErrors = [];
desktopPage.on("console", (message) => { if (message.type() === "error") desktopErrors.push(message.text()); });
desktopPage.on("pageerror", (error) => desktopErrors.push(error.message));

let response = await desktopPage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
check(response?.status() === 200, "desktop home: responds with HTTP 200");
check((await desktopPage.locator("h1").innerText()).includes("Quality products"), "desktop home: hero renders");
check(await desktopPage.locator(".featured-grid .product-card").count() === 8, "desktop home: eight featured products render");
check(await desktopPage.locator(".category-card").count() === 6, "desktop home: six category cards render");
const failedCatalogImages = await desktopPage.evaluate(async (sources) => {
  const results = await Promise.all(sources.map((source) => new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(null);
    image.onerror = () => resolve(source);
    image.src = source;
  })));
  return results.filter(Boolean);
}, products.map((product) => product.image));
check(failedCatalogImages.length === 0, `full image audit: all ${products.length} product images decode in browser`);
await revealLazyImages(desktopPage);
await inspectPage(desktopPage, "desktop home");
await desktopPage.screenshot({ path: "qa/home-desktop.png", fullPage: true });

await desktopPage.locator("[data-open-product]").first().click();
check(await desktopPage.locator("[data-product-dialog]").evaluate((dialog) => dialog.open), "product dialog: opens from a product card");
check((await desktopPage.locator("#dialog-product-name").innerText()).length > 0, "product dialog: contains a product name");
await desktopPage.locator("[data-close-dialog]").click();

response = await desktopPage.goto(`${baseUrl}/products/`, { waitUntil: "networkidle" });
check(response?.status() === 200, "desktop catalog: responds with HTTP 200");
check(await desktopPage.locator(".catalog-grid .product-card").count() === 24, "desktop catalog: initial 24 products render");
await desktopPage.locator("[data-product-search]").fill("Koolers");
check((await desktopPage.locator("[data-results-count]").innerText()) === "5 products", "catalog search: filters Koolers products");
check(await desktopPage.locator(".catalog-grid .product-card").count() === 5, "catalog search: displays five Koolers cards");
await desktopPage.locator("[data-product-search]").fill("");
await desktopPage.locator('[data-filter="Chocolates"]').click();
check((await desktopPage.locator("[data-results-count]").innerText()) === "13 products", "category filter: reports 13 chocolates");
check(await desktopPage.locator(".catalog-grid .product-card").count() === 13, "category filter: displays 13 chocolate cards");
await revealLazyImages(desktopPage);
await inspectPage(desktopPage, "desktop catalog");
await desktopPage.screenshot({ path: "qa/catalog-desktop.png", fullPage: true });
check(desktopErrors.length === 0, `desktop console: no errors${desktopErrors.length ? ` (${desktopErrors.join(" | ")})` : ""}`);
await desktop.close();

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const mobilePage = await mobile.newPage();
const mobileErrors = [];
mobilePage.on("console", (message) => { if (message.type() === "error") mobileErrors.push(message.text()); });
mobilePage.on("pageerror", (error) => mobileErrors.push(error.message));

response = await mobilePage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
check(response?.status() === 200, "mobile home: responds with HTTP 200");
await mobilePage.locator(".menu-toggle").click();
check(await mobilePage.locator(".menu-toggle").getAttribute("aria-expanded") === "true", "mobile navigation: menu opens");
check(await mobilePage.locator(".primary-nav").evaluate((nav) => nav.classList.contains("is-open")), "mobile navigation: menu is visible");
await mobilePage.locator(".menu-toggle").click();
await revealLazyImages(mobilePage);
await inspectPage(mobilePage, "mobile home");
await mobilePage.screenshot({ path: "qa/home-mobile.png", fullPage: true });

await mobilePage.locator("#contact").scrollIntoViewIfNeeded();
await mobilePage.locator('input[name="name"]').fill("QA Test");
await mobilePage.locator('input[name="email"]').fill("qa@example.com");
await mobilePage.locator('select[name="inquiryType"]').selectOption({ label: "Wholesale Inquiry" });
await mobilePage.locator('textarea[name="message"]').fill("Product availability inquiry.");
await mobilePage.locator('[data-inquiry-form] button[type="submit"]').click();
check(await mobilePage.locator(".form-status").isVisible(), "inquiry form: validated submission state appears");
check(await mobilePage.evaluate(() => Boolean(localStorage.getItem("marketlink-inquiry-draft"))), "inquiry form: draft saves locally");

response = await mobilePage.goto(`${baseUrl}/products/?category=Snacks`, { waitUntil: "networkidle" });
check(response?.status() === 200, "mobile catalog: responds with HTTP 200");
check((await mobilePage.locator("[data-results-count]").innerText()) === "57 products", "mobile catalog: category query initializes Snacks filter");
await inspectPage(mobilePage, "mobile catalog");
await mobilePage.screenshot({ path: "qa/catalog-mobile.png", fullPage: false });
check(mobileErrors.length === 0, `mobile console: no errors${mobileErrors.length ? ` (${mobileErrors.join(" | ")})` : ""}`);

await mobile.close();
await browser.close();

for (const item of report) console.log(`${item.passed ? "PASS" : "FAIL"}  ${item.check}`);
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${report.length} browser checks passed.`);
