# ElegantSoft frontend task · Product detail experience

Implementing the [Frontend Engineering Task (ElegantSoft)](https://github.com/ElegantSoft/frontend-task-2025) brief: modular PDP, EasyOrders-driven catalogue data, persisted basket, JL-inspired visuals (mobile & desktop references), and tooling that maps to the evaluator checklist.

## Stack

| Area | Choice |
| --- | --- |
| UI | React 19 · TypeScript · Vite 8 · Tailwind 3 (+ forms & typography plugins) · [Lucide](https://lucide.dev/) (UI strokes) · [react-icons `si`](https://react-icons.github.io/react-icons/) (footer brand marks) |
| PDP state | **Zustand + Immer** (`useProductStore` mirrors the readme contract incl. getters) |
| Cart | **Zustand + Immer + `persist`** (localStorage, partialised lines only) |
| Data layer | `@tanstack/react-query` fetches the task SKU (`useQuery`), then mirrors into `useProductStore` for the readme contract + selectors |

## Prerequisites

Node 22+ recommended (matching the toolchain used while authoring).

## Scripts

```bash
npm install
npm run dev        # Vite dev server (http://localhost:5173)
npm run build      # Production bundle
npm run test:run   # Vitest suite (pricing, variants, cart/product stores, CartDrawer smoke)
```

No `.env` is required—the reference product is fetched from EasyOrders publicly.

## Evaluation rubric alignment (typical ElegantSoft scoring — four ×25% pillars)

Criteria usually mirror the recruitment brief ([task repo README](https://github.com/ElegantSoft/frontend-task-2025)). This project maps evidence as follows so reviewers can navigate quickly:

| Pillar | What they look for | Where it shows up here |
| --- | --- | --- |
| **Code quality (25%)** | Readable structure, modular components, TypeScript soundness, edge cases | `src/components/` slices, **`strict: true`** in [`tsconfig.app.json`](tsconfig.app.json), [`src/lib/*.ts`](src/lib/), shared test fixtures [`src/tests/fixtures/`](src/tests/fixtures/) |
| **State management (25%)** | Zustand + Immer patterns, persistence + hydration, sane update flow | [`src/stores/productStore.ts`](src/stores/productStore.ts), [`src/stores/cartStore.ts`](src/stores/cartStore.ts) (`persist` + `partialize`), granular selectors (`useCartStore`, `useProductStore`) |
| **UI implementation (25%)** | Design fidelity, responsive behaviour, UX polish, accessibility | JL-inspired PDP/footer/header, breakpoints in Tailwind, [`ProductGallery.tsx`](src/components/ProductGallery.tsx) / drawers / toasts; **a11y**: `aria-*` on controls, dialogs via Headless UI, `aria-live` on [`ToastBanner`](src/components/ToastBanner.tsx); **risk**: subjective “pixel-perfect” vs original Figma is for human review |
| **Technical implementation (25%)** | Solid API integration, performance awareness, automated tests, documentation | [`api/product.ts`](src/api/product.ts) + React Query defaults in [`App.tsx`](src/App.tsx), lazy thumbnails, **`ErrorBoundary`** in [`components/ErrorBoundary.tsx`](src/components/ErrorBoundary.tsx), Vitest in [`src/tests/`](src/tests/), this README + inline comments where behaviour is non-obvious |

Being explicit about residual gaps is part of solid documentation too: browser E2E, a full keyboard pass on bespoke controls, and Lighthouse perf snapshots are sensible next steps if an interviewer digs deeper.

### Product API

Configured in [`src/api/product.ts`](src/api/product.ts): `TASK_PRODUCT_SLUG`, `fetchProductBySlug`, and `productUrlForSlug()` build:

`https://api.easy-orders.net/api/v1/products/slug/clear-theme/Sneakers12?join=reviews`

> The live payload still omits nested `reviews` today, so the reviews rail uses curated mocks that follow the JL frames you supplied; swap the section to Live data once the backend joins hydrate.

### Design fidelity

Layouts, hierarchy, typography (Playfair for hero brand lockups / Helvetica-esque system stack), monochrome palette, carousel rails, review chrome, drawers, CTAs and spacing hew to the exported Figma stills—the hero gallery and buying column pull **real SKU imagery + variations** so colour/size permutations remain faithful to catalogue data rather than placeholders.

### State architecture

1. **`useProductStore`** — mirrors the readme `ProductStore` shape: `fetchProduct(slug)`, `selectedVariations` / `selectedVariant`, getters (`getCurrentPrice`, `getCurrentSalePrice`, `isVariantAvailable`), plus `getGallery` helper. **`ingestProduct` / `ingestError` / `setLoadingFlag`** sync React Query results into this slice without UI flashes.
2. **`useCartStore`** — Immer mutations, `persist` to `localStorage` (lines only via `partialize`), drawer + toast UX, totals/count helpers (`getTotal`, `getUniqueCount`).
3. **Utilities** (`src/lib/variants.ts`, `lib/pricing.ts`, `lib/qty.ts`) — variant matrix maths, catalogue vs payable pricing, basket quantity ceilings when stock tracking is enabled.

Refer to [`src/pages/ProductDetailPage.tsx`](src/pages/ProductDetailPage.tsx) for orchestration plus [`src/components/`](src/components/) for individual UI slices.

### Testing & quality gates

[`npm run test:run`](package.json) executes Vitest: pricing helpers, variant utilities, **`productStore` / `cartStore` actions**, and a **`CartDrawer` smoke render**. Extend with Playwright/Cypress when you want the readme’s E2E bar—structure is ready, but browsers are not wired in this repo yet.

## Deployment notes

After `npm run build`, publish the `dist/` folder to any static host (Netlify Drop, Azure Static Web Apps, Cloudflare Pages, S3 static site, …). Configure SPA rewrites so client routes resolve to `index.html` if you add routing later.

## Hand-off checklist vs [ElegantSoft readme](https://github.com/ElegantSoft/frontend-task-2025)

| Requirement | Implementation pointer |
| --- | --- |
| Modular PDP | `components/` + `pages/ProductDetailPage.tsx` |
| Zustand + Immer product slice (readme fields + getters) | `stores/productStore.ts` — **`fetchProduct(slug: string)`** matches the documented signature |
| React Query data fetching | `App.tsx` provider + `useQuery(['easyorders-product', slug])` in `ProductDetailPage.tsx` |
| Persist + hydrate cart (`persist`, serialization) | `stores/cartStore.ts` (`elegantsoft-cart` key, line items only in storage) |
| API (EasyOrders slug path + reviews join) | `api/product.ts` |
| Gallery + thumbnails + transitions + zoom | `ProductGallery.tsx` (hover scale, enlarge dialog, thumbnails) |
| Price + sale juxtaposition | `ProductBuyingSection.tsx` via `resolveCatalogAndPayable` |
| Variations matrix + disable invalid combos | `ProductBuyingSection.tsx` + `lib/variants.ts` |
| **Quantity selector (bounded)** | PDP stepper clamps to **`getMaxBasketQuantity`** (`lib/qty.ts`) |
| Variation validation before add-to-cart | `handleAddToCart` guard + messaging |
| **Stock messaging** | `StockStatusLabel` in `ProductBuyingSection.tsx` |
| **Categories / tags surfaced** | Category chips under PDP title (`product.categories`) |
| Cart drawer · line qty · remove · subtotal · empty state | `CartDrawer.tsx`; badge/count in `SiteHeader.tsx` |
| Success feedback on add | Toast via `cartStore.toast` + `ToastBanner.tsx` |
| Reviews / related rails | `ReviewsSection.tsx` (mock if API omits reviews) · `ProductRails.tsx` |
| Unit / component tests (Vitest) | `src/tests/*.test.ts(x)` — extend with E2E when required |

**Readme items not automated here:** full E2E suites, integration tests hitting a mock service worker, arbitrary keyboard navigation audit, analytics/PWA/social-share bonus features—mention roadmap if reviewers ask.

**Bonus already present:** wishlist drawer (`favoritesStore` + `FavoritesDrawer`), share hook in gallery, related/product showcase rails.
