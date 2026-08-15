# Marketlink Distribution Inc. website

A responsive distributor website built with Vite and framework-free JavaScript. It uses Marketlink's supplied logo files and a local, optimized copy of the YanYan product catalog—no product images are hotlinked.

## Routes

- `/` — home, featured products, categories, wholesale, About, credibility, and inquiry sections
- `/products/` — searchable and filterable 114-product catalog

## Commands

```bash
npm install
npm run dev
npm run build
npm run qa
```

To refresh product names, categories, and local images from the adjacent `Yanyan` archive:

```bash
npm run import-products
```

The import command copies local images into this project and optimizes them to a maximum 1200 px dimension. Product data is centralized in `src/data/products.js`.

## Before public launch

The inquiry form is fully validated and saves a draft in the visitor's browser. Connect the form to Marketlink's approved email address or form endpoint once those details are provided. Add the final public domain to deployment configuration before generating a production sitemap or canonical URLs.

No address, phone number, email, social account, pricing, MOQ, shipping promise, exclusivity, or authorized-distributor claim has been invented.
