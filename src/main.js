import "./styles.css";
import { categories, products } from "./data/products.js";

const app = document.querySelector("#app");
const page = document.body.dataset.page;

const categoryCopy = {
  Snacks: "Savory favorites for neighborhood stores and everyday snacking.",
  Beverages: "Refreshing drinks and water for coolers, counters, and shelves.",
  "Instant Beverages": "Convenient coffee, milk tea, and cocoa selections.",
  "Cookies & Wafers": "Shareable cookies, wafers, and filled snack treats.",
  Chocolates: "Chocolate bars, spreads, and sweet impulse favorites.",
  Bread: "Familiar loaf flavors for breakfast and merienda shelves.",
};

const categoryImages = {
  Snacks: "original-flavor",
  Beverages: "apple",
  "Instant Beverages": "brown-coffee",
  "Cookies & Wafers": "chocolate-chip-1",
  Chocolates: "dark-chocolate-bar",
  Bread: "ube-bread",
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function productById(id) {
  return products.find((product) => product.id === id);
}

function header() {
  const prefix = page === "home" ? "" : "/";
  return `
    <header class="site-header" data-header>
      <div class="container nav-shell">
        <a class="brand" href="/" aria-label="Marketlink Distribution Inc. home">
          <span class="brand-emblem" aria-hidden="true"><img src="/assets/brand/mklink.png" alt="" /></span>
          <span class="brand-name"><strong>Marketlink</strong><small>Distribution Inc.</small></span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation">
          <span class="sr-only">Toggle navigation</span><span></span><span></span><span></span>
        </button>
        <nav id="primary-navigation" class="primary-nav" aria-label="Primary navigation">
          <a href="/" ${page === "home" ? 'aria-current="page"' : ""}>Home</a>
          <a href="/products/" ${page === "products" ? 'aria-current="page"' : ""}>Products</a>
          <a href="${prefix}#categories">Categories</a>
          <a href="${prefix}#about">About us</a>
          <a href="${prefix}#wholesale">Wholesale</a>
          <a href="${prefix}#contact">Contact</a>
          <a class="button button-small" href="${prefix}#contact">Inquire now</a>
        </nav>
      </div>
    </header>`;
}

function footer() {
  const prefix = page === "home" ? "" : "/";
  return `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <img src="/assets/brand/mklinkname.png" alt="Marketlink Distribution Inc." width="220" height="120" />
          <p>Quality product distribution for retail buyers, resellers, and growing businesses.</p>
        </div>
        <div>
          <h2>Explore</h2>
          <a href="/products/">All products</a>
          <a href="${prefix}#categories">Categories</a>
          <a href="${prefix}#about">About Marketlink</a>
        </div>
        <div>
          <h2>For business</h2>
          <a href="${prefix}#wholesale">Wholesale</a>
          <a href="${prefix}#contact">Reseller inquiry</a>
          <a href="${prefix}#contact">Contact us</a>
        </div>
        <div class="footer-note">
          <h2>Supplier acknowledgment</h2>
          <p>Marketlink Distribution Inc. distributes selected products sourced from established suppliers, including YanYan International.</p>
        </div>
      </div>
      <div class="container footer-bottom">
        <p>&copy; ${new Date().getFullYear()} Marketlink Distribution Inc. All rights reserved.</p>
        <p>Independent distributor website.</p>
      </div>
    </footer>`;
}

function sectionHeading(eyebrow, title, copy = "", align = "left") {
  return `
    <div class="section-heading section-heading-${align}">
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <h2>${escapeHtml(title)}</h2>
      ${copy ? `<p class="section-copy">${escapeHtml(copy)}</p>` : ""}
    </div>`;
}

function productCard(product, priority = false) {
  const label = `${product.brand} ${product.name}`;
  return `
    <article class="product-card" data-product-card data-name="${escapeHtml(label.toLowerCase())}" data-category="${escapeHtml(product.category)}">
      <button class="product-image-wrap" type="button" data-open-product="${escapeHtml(product.id)}" aria-label="View ${escapeHtml(label)}">
        <span class="product-category">${escapeHtml(product.category)}</span>
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(label)} product packaging" width="${product.width}" height="${product.height}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />
      </button>
      <div class="product-card-body">
        <p class="product-brand">${escapeHtml(product.brand)}</p>
        <h3>${escapeHtml(product.name)}</h3>
        <button class="text-link" type="button" data-open-product="${escapeHtml(product.id)}">View &amp; inquire <span aria-hidden="true">→</span></button>
      </div>
    </article>`;
}

function categoryCards() {
  return categories.map((category) => {
    const count = products.filter((product) => product.category === category).length;
    const product = productById(categoryImages[category]);
    return `
      <a class="category-card" href="/products/?category=${encodeURIComponent(category)}">
        <div class="category-card-content">
          <span>${String(count).padStart(2, "0")} selections</span>
          <h3>${escapeHtml(category)}</h3>
          <p>${escapeHtml(categoryCopy[category])}</p>
          <strong>Explore category <span aria-hidden="true">→</span></strong>
        </div>
        <div class="category-card-image">
          <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.brand)} ${escapeHtml(product.name)}" width="${product.width}" height="${product.height}" loading="lazy" decoding="async" />
        </div>
      </a>`;
  }).join("");
}

function inquiryForm() {
  const productOptions = products
    .map((product) => `<option value="${escapeHtml(product.id)}">${escapeHtml(product.brand)} — ${escapeHtml(product.name)}</option>`)
    .join("");
  return `
    <form class="inquiry-form" data-inquiry-form>
      <div class="form-grid">
        <label><span>Name <b aria-hidden="true">*</b></span><input type="text" name="name" autocomplete="name" required /></label>
        <label><span>Business / company name</span><input type="text" name="business" autocomplete="organization" /></label>
        <label><span>Email <b aria-hidden="true">*</b></span><input type="email" name="email" autocomplete="email" required /></label>
        <label><span>Contact number</span><input type="tel" name="phone" autocomplete="tel" /></label>
        <label><span>Inquiry type <b aria-hidden="true">*</b></span>
          <select name="inquiryType" required>
            <option value="">Select inquiry type</option>
            <option>Retail Inquiry</option><option>Wholesale Inquiry</option><option>Reseller Inquiry</option><option>General Inquiry</option>
          </select>
        </label>
        <label><span>Product interested in</span>
          <select name="product"><option value="">Select a product</option>${productOptions}</select>
        </label>
        <label><span>Estimated quantity</span><input type="text" name="quantity" inputmode="numeric" placeholder="e.g. cases or units" /></label>
        <label class="form-full"><span>Message <b aria-hidden="true">*</b></span><textarea name="message" rows="5" required placeholder="Tell us what products or business support you are looking for."></textarea></label>
      </div>
      <div class="form-submit">
        <button class="button" type="submit">Prepare inquiry <span aria-hidden="true">→</span></button>
        <p>Required fields are marked with an asterisk. Product availability is confirmed during inquiry.</p>
      </div>
      <p class="form-status" role="status" aria-live="polite" hidden></p>
    </form>`;
}

function productDialog() {
  return `
    <dialog class="product-dialog" data-product-dialog aria-labelledby="dialog-product-name">
      <button class="dialog-close" type="button" data-close-dialog aria-label="Close product details">×</button>
      <div class="dialog-content" data-dialog-content></div>
    </dialog>`;
}

function homePage() {
  const heroProducts = ["original-flavor", "apple", "dark-chocolate-bar"].map(productById);
  const featured = products.filter((product) => product.featured);
  return `
    ${header()}
    <main id="main-content">
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">Pampanga product distribution</p>
            <h1>Quality products.<br /><em>Ready for your shelves.</em></h1>
            <p class="hero-lead">Marketlink connects stores, resellers, and business buyers with a broad selection of dependable everyday products.</p>
            <div class="hero-actions">
              <a class="button" href="/products/">Browse products <span aria-hidden="true">→</span></a>
              <a class="button button-quiet" href="#wholesale">Wholesale inquiries</a>
            </div>
            <div class="buyer-list" aria-label="Who we serve">
              <span>Retailers</span><span>Resellers</span><span>Grocery stores</span><span>Food businesses</span>
            </div>
          </div>
          <div class="hero-visual" aria-label="Featured product selection">
            <div class="hero-seal"><img src="/assets/brand/mklink.png" alt="" /><span>Marketlink<br />Distribution</span></div>
            ${heroProducts.map((product, index) => `
              <figure class="hero-product hero-product-${index + 1}">
                <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.brand)} ${escapeHtml(product.name)}" width="${product.width}" height="${product.height}" ${index ? 'loading="eager"' : 'fetchpriority="high"'} decoding="async" />
              </figure>`).join("")}
            <p class="hero-caption">Products shown are available for inquiry. Selection may vary.</p>
          </div>
        </div>
        <div class="container fact-strip">
          <div><strong>${products.length}</strong><span>Product selections</span></div>
          <div><strong>${categories.length}</strong><span>Core categories</span></div>
          <div><strong>Retail + wholesale</strong><span>Inquiry support</span></div>
        </div>
      </section>

      <section class="section featured-section" aria-labelledby="featured-title">
        <div class="container">
          <div class="section-row">
            <div>${sectionHeading("Featured selection", "Products buyers reach for", "A focused look at snack, beverage, chocolate, and pantry selections available through Marketlink.")}</div>
            <a class="text-link text-link-large" href="/products/">View all ${products.length} products <span aria-hidden="true">→</span></a>
          </div>
          <div class="product-grid featured-grid">${featured.map((product) => productCard(product)).join("")}</div>
        </div>
      </section>

      <section class="section categories-section" id="categories" aria-labelledby="categories-title">
        <div class="container">
          ${sectionHeading("Shop by category", "A practical range for every kind of shelf", "Browse the catalog using the supplier's established product groupings.", "center")}
          <div class="category-grid">${categoryCards()}</div>
        </div>
      </section>

      <section class="section wholesale-section" id="wholesale" aria-labelledby="wholesale-title">
        <div class="container wholesale-grid">
          <div class="wholesale-copy">
            <p class="eyebrow">For business buyers</p>
            <h2 id="wholesale-title">Stock products your customers already understand.</h2>
            <p>Whether you operate one neighborhood store or source for a growing retail network, Marketlink makes it easier to discuss product selection and volume requirements in one place.</p>
            <ul class="check-list">
              <li>Broad multi-category selection</li>
              <li>Wholesale and reseller inquiries welcome</li>
              <li>Product availability confirmed before ordering</li>
              <li>One inquiry for multiple product lines</li>
            </ul>
            <a class="button button-light" href="#contact">Start a wholesale inquiry <span aria-hidden="true">→</span></a>
          </div>
          <div class="buyer-panel">
            <p class="panel-kicker">Built for the way you sell</p>
            <div class="buyer-grid">
              <div><span>01</span><strong>Grocery stores</strong></div>
              <div><span>02</span><strong>Sari-sari stores</strong></div>
              <div><span>03</span><strong>Convenience stores</strong></div>
              <div><span>04</span><strong>Online sellers</strong></div>
              <div><span>05</span><strong>Resellers</strong></div>
              <div><span>06</span><strong>Food businesses</strong></div>
            </div>
            <p class="buyer-panel-note">Share the products and estimated quantities you need. Specific terms are confirmed directly during the inquiry process.</p>
          </div>
        </div>
      </section>

      <section class="section about-section" id="about" aria-labelledby="about-title">
        <div class="container about-grid">
          <div class="about-mark"><img src="/assets/brand/mklinkname.png" alt="Marketlink Distribution Inc." width="676" height="369" loading="lazy" /></div>
          <div class="about-copy">
            <p class="eyebrow">About Marketlink</p>
            <h2 id="about-title">An independent distributor focused on better access.</h2>
            <p>Marketlink Distribution Inc. supplies quality consumer products for retail and business buyers. Our catalog includes selected products sourced from established suppliers such as YanYan International.</p>
            <p>Marketlink is the distributor presented on this website. Product brand ownership and manufacturing remain with their respective companies.</p>
            <a class="text-link text-link-large" href="#contact">Talk to our team <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>

      <section class="section reasons-section" aria-labelledby="reasons-title">
        <div class="container">
          ${sectionHeading("Why Marketlink", "Straightforward distribution support", "Practical service built around product choice and clear business inquiries.")}
          <div class="reason-grid">
            <article><span>01</span><h3>Trusted sourcing</h3><p>Products sourced from established suppliers and represented with clear brand attribution.</p></article>
            <article><span>02</span><h3>Wide selection</h3><p>A single catalog spanning snacks, drinks, breads, cookies, and chocolates.</p></article>
            <article><span>03</span><h3>Wholesale-friendly</h3><p>A focused inquiry path for stores, resellers, and other volume buyers.</p></article>
            <article><span>04</span><h3>Responsive process</h3><p>Product needs, availability, and order details can be discussed before committing.</p></article>
          </div>
        </div>
      </section>

      <section class="section contact-section" id="contact" aria-labelledby="contact-title">
        <div class="container contact-grid">
          <div class="contact-copy">
            <p class="eyebrow">Product &amp; business inquiries</p>
            <h2 id="contact-title">Tell us what you need on your shelves.</h2>
            <p>Send Marketlink your product interests and estimated quantity. Exact availability, ordering terms, and next steps can then be confirmed directly.</p>
            <div class="contact-guidance"><strong>Useful details to include</strong><span>Products or categories</span><span>Approximate quantities</span><span>Retail or wholesale need</span></div>
          </div>
          ${inquiryForm()}
        </div>
      </section>
    </main>
    ${footer()}
    ${productDialog()}`;
}

function productsPage() {
  return `
    ${header()}
    <main id="main-content">
      <section class="catalog-hero">
        <div class="container catalog-hero-grid">
          <div>
            <p class="eyebrow">Marketlink product catalog</p>
            <h1>Find the right products for your customers.</h1>
            <p>Browse ${products.length} selections across ${categories.length} established categories. Use search and filters to create a focused shortlist.</p>
          </div>
          <div class="catalog-hero-note">
            <span>For every shelf</span>
            <strong>Snacks. Drinks.<br />Sweets. Staples.</strong>
            <p>Product availability and commercial terms are confirmed through inquiry.</p>
          </div>
        </div>
      </section>
      <section class="catalog-section" aria-labelledby="catalog-title">
        <div class="container">
          <div class="catalog-toolbar">
            <div class="catalog-heading">
              <p class="eyebrow">Full selection</p>
              <h2 id="catalog-title">Products</h2>
            </div>
            <label class="search-field">
              <span class="sr-only">Search products</span>
              <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg>
              <input type="search" data-product-search placeholder="Search brand or product" autocomplete="off" />
            </label>
          </div>
          <div class="filter-row" role="group" aria-label="Filter by product category">
            <button type="button" class="filter-button is-active" data-filter="All" aria-pressed="true">All <span>${products.length}</span></button>
            ${categories.map((category) => `<button type="button" class="filter-button" data-filter="${escapeHtml(category)}" aria-pressed="false">${escapeHtml(category)} <span>${products.filter((product) => product.category === category).length}</span></button>`).join("")}
          </div>
          <div class="catalog-meta"><p data-results-count>${products.length} products</p><p>Images shown are product references.</p></div>
          <div class="product-grid catalog-grid" data-catalog-grid></div>
          <div class="empty-state" data-empty-state hidden><h3>No products found</h3><p>Try another search term or category.</p><button type="button" class="text-link" data-clear-filters>Clear filters</button></div>
          <div class="load-more-wrap" data-load-more-wrap><button class="button button-outline" type="button" data-load-more>Load more products</button></div>
        </div>
      </section>
      <section class="catalog-cta" id="contact">
        <div class="container catalog-cta-grid">
          <div><p class="eyebrow">Need several products?</p><h2>Build a wholesale inquiry with Marketlink.</h2></div>
          <div><p>Tell us which items interest you and your estimated quantities. Availability and terms are confirmed directly.</p><a class="button button-light" href="/?inquiry=wholesale#contact">Start an inquiry <span aria-hidden="true">→</span></a></div>
        </div>
      </section>
    </main>
    ${footer()}
    ${productDialog()}`;
}

app.innerHTML = page === "products" ? productsPage() : homePage();

function initNavigation() {
  const headerElement = document.querySelector("[data-header]");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  toggle?.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });
  nav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    }
  });
  const updateHeader = () => headerElement.classList.toggle("is-scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function initProductDialog() {
  const dialog = document.querySelector("[data-product-dialog]");
  const content = document.querySelector("[data-dialog-content]");
  if (!dialog || !content) return;

  document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-open-product]");
    if (!opener) return;
    const product = productById(opener.dataset.openProduct);
    if (!product) return;
    const inquiryHref = page === "home" ? `#contact` : `/?product=${encodeURIComponent(product.id)}#contact`;
    content.innerHTML = `
      <div class="dialog-image"><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.brand)} ${escapeHtml(product.name)} product packaging" width="${product.width}" height="${product.height}" /></div>
      <div class="dialog-details">
        <p class="eyebrow">${escapeHtml(product.category)}</p>
        <p class="dialog-brand">${escapeHtml(product.brand)}</p>
        <h2 id="dialog-product-name">${escapeHtml(product.name)}</h2>
        <p>Available for retail, reseller, and wholesale inquiry through Marketlink Distribution Inc. Product availability is confirmed when you inquire.</p>
        <a class="button" href="${inquiryHref}" data-dialog-inquire data-product-select="${escapeHtml(product.id)}">Inquire about this product <span aria-hidden="true">→</span></a>
      </div>`;
    dialog.showModal();
  });

  document.querySelector("[data-close-dialog]")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
    const inquiry = event.target.closest("[data-dialog-inquire]");
    if (inquiry && page === "home") {
      const select = document.querySelector('select[name="product"]');
      if (select) select.value = inquiry.dataset.productSelect;
      dialog.close();
    }
  });
}

function initInquiryForm() {
  const form = document.querySelector("[data-inquiry-form]");
  if (!form) return;
  const params = new URLSearchParams(window.location.search);
  const productSelect = form.elements.product;
  if (params.get("product") && productById(params.get("product"))) productSelect.value = params.get("product");
  if (params.get("inquiry") === "wholesale") form.elements.inquiryType.value = "Wholesale Inquiry";
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    localStorage.setItem("marketlink-inquiry-draft", JSON.stringify({ ...data, savedAt: new Date().toISOString() }));
    const status = form.querySelector(".form-status");
    status.hidden = false;
    status.textContent = "Your inquiry has been saved on this device. Connect Marketlink's preferred email or form endpoint before launch to receive online submissions.";
    status.focus?.();
  });
}

function initCatalog() {
  if (page !== "products") return;
  const grid = document.querySelector("[data-catalog-grid]");
  const search = document.querySelector("[data-product-search]");
  const filters = [...document.querySelectorAll("[data-filter]")];
  const count = document.querySelector("[data-results-count]");
  const empty = document.querySelector("[data-empty-state]");
  const loadWrap = document.querySelector("[data-load-more-wrap]");
  const loadButton = document.querySelector("[data-load-more]");
  let activeCategory = "All";
  let visibleLimit = 24;

  const initialCategory = new URLSearchParams(window.location.search).get("category");
  if (categories.includes(initialCategory)) activeCategory = initialCategory;

  function renderCatalog() {
    const query = search.value.trim().toLowerCase();
    const matches = products.filter((product) => {
      const categoryMatch = activeCategory === "All" || product.category === activeCategory;
      const searchMatch = !query || `${product.brand} ${product.name} ${product.category}`.toLowerCase().includes(query);
      return categoryMatch && searchMatch;
    });
    const visible = matches.slice(0, visibleLimit);
    grid.innerHTML = visible.map((product) => productCard(product)).join("");
    count.textContent = `${matches.length} ${matches.length === 1 ? "product" : "products"}`;
    empty.hidden = matches.length !== 0;
    loadWrap.hidden = matches.length <= visibleLimit;
    filters.forEach((filter) => {
      const active = filter.dataset.filter === activeCategory;
      filter.classList.toggle("is-active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
  }

  filters.forEach((filter) => filter.addEventListener("click", () => {
    activeCategory = filter.dataset.filter;
    visibleLimit = 24;
    renderCatalog();
  }));
  search.addEventListener("input", () => { visibleLimit = 24; renderCatalog(); });
  loadButton.addEventListener("click", () => { visibleLimit += 24; renderCatalog(); });
  document.querySelector("[data-clear-filters]").addEventListener("click", () => {
    activeCategory = "All";
    search.value = "";
    visibleLimit = 24;
    renderCatalog();
    search.focus();
  });
  renderCatalog();
}

initNavigation();
initProductDialog();
initInquiryForm();
initCatalog();
