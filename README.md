# ElegantSoft frontend task · Product detail experience

Implementing the [Frontend Engineering Task (ElegantSoft)](https://github.com/ElegantSoft/frontend-task-2025) brief: modular PDP, EasyOrders-driven catalogue data, persisted basket, JL-inspired visuals (mobile & desktop references), and tooling that maps to the evaluator checklist.

## Stack

| Area | Choice |
| --- | --- |
| UI | React 19 · TypeScript · Vite 8 · Tailwind 3 (+ forms & typography plugins) · [Lucide](https://lucide.dev/) (UI strokes) · [react-icons `si`](https://react-icons.github.io/react-icons/) (footer brand marks) |
| PDP state | **Zustand + Immer** (`useProductStore` mirrors the readme contract incl. getters) |
| Cart | **Zustand + Immer + `persist`** (localStorage, partialised lines only) |
| Data layer | `@tanstack/react-query` fetches the task SKU (`useQuery`), then mirrors into `useProductStore` for the readme contract + selectors |
| Quality gates | **[Playwright](https://playwright.dev/)** Chromium E2E + **[axe-core](https://github.com/dequelabs/axe-core)** · **Lighthouse** accessibility smoke (CLI bridge in [`scripts/lighthouse-a11y.mjs`](scripts/lighthouse-a11y.mjs)) |

## Prerequisites

Node 22+ recommended (matching the toolchain used while authoring).

## Scripts

```bash
npm install
npx playwright install chromium   # first time only (Pulls Chromium for `@playwright/test`)

npm run dev        # Human loop — http://localhost:5173
npm run build      # Production bundle

npm run test:run           # Vitest (unit/integration-style; excludes `e2e/`)
npm run test:e2e           # Playwright — dedicated Vite on http://localhost:5199 via webServer hook
npm run test:e2e:ui        # Playwright inspector UI
npm run lh:a11y            # Spins Vite :5199, runs Lighthouse Accessibility category (default MIN_A11Y_SCORE=0.86)
npm run test:coverage-matrix # Vitest then Playwright in one sweep
```

**E2E hardening:** Playwright mocks the EasyOrders JSON response from [`e2e/fixtures/sneakers12.json`](e2e/fixtures/sneakers12.json) so CI/local runs avoid flaky WAN dependencies.

**Lighthouse:** `npm run lh:a11y` runs against the ordinary dev bundle and **hits the live EasyOrders API** (no route mocking). Offline or flaky networks should skip Lighthouse and lean on Vitest + Playwright; override the audited URL via `LH_URL` if needed.

No `.env` is required—the reference product is fetched from EasyOrders publicly.

## Evaluation rubric alignment (typical ElegantSoft scoring — four ×25% pillars)

Criteria usually mirror the recruitment brief ([task repo README](https://github.com/ElegantSoft/frontend-task-2025)). This project maps evidence as follows so reviewers can navigate quickly:

| Pillar | What they look for | Where it shows up here |
| --- | --- | --- |
| **Code quality (25%)** | Readable structure, modular components, TypeScript soundness, edge cases | `src/components/` slices, **`strict: true`** in [`tsconfig.app.json`](tsconfig.app.json), [`src/lib/*.ts`](src/lib/), shared test fixtures [`src/tests/fixtures/`](src/tests/fixtures/) |
| **State management (25%)** | Zustand + Immer patterns, persistence + hydration, sane update flow | [`src/stores/productStore.ts`](src/stores/productStore.ts), [`src/stores/cartStore.ts`](src/stores/cartStore.ts) (`persist` + `partialize`), granular selectors (`useCartStore`, `useProductStore`) |
| **UI implementation (25%)** | Design fidelity, responsive behaviour, UX polish, accessibility | JL-inspired PDP/footer/header, breakpoints in Tailwind, [`ProductGallery.tsx`](src/components/ProductGallery.tsx) / drawers / toasts; **keyboard**: [`SkipToMain`](src/components/SkipToMain.tsx) + `#main-content`; **`prefers-reduced-motion`**: `motion-safe` zoom in gallery; dialogs & `aria-live` toast |
| **Technical implementation (25%)** | Solid API integration, performance awareness, automated tests, documentation | [`api/product.ts`](api/product.ts), React Query in [`App.tsx`](src/App.tsx), Vitest [`src/tests/`](src/tests/), Playwright [`e2e/`](e2e/) + axe main-landmark scan [`e2e/accessibilityaxe.spec.ts`](e2e/accessibilityaxe.spec.ts), Lighthouse script, this README |

**Still subjective / optional polish:** Lighthouse *performance* & *best-practices* buckets (heavy third-party rails), axe `color-contrast` (disabled briefly for JL greys pending token audit — see axe spec comment), exhaustive keyboard coverage of mega-menu chrome.

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

| Layer | Command | Notes |
| --- | --- | --- |
| Unit / RTL | [`npm run test:run`](package.json) | Vitest excludes `e2e/**` · stores, pricing, variants, `CartDrawer` smoke |
| E2E | [`npm run test:e2e`](package.json) | Chromium · [`playwright.config.ts`](playwright.config.ts) boots Vite **`localhost:5199`** (keeps `:5173` free for humans) · [`mockEasyOrdersProductPayload`](e2e/helpers/mock-easyorders.ts) |
| Deep a11y | same Playwright suite | axe `critical`/`serious` on `main#main-content`, `color-contrast` currently opt-out ([`accessibilityaxe.spec.ts`](e2e/accessibilityaxe.spec.ts)) |
| Lighthouse | [`npm run lh:a11y`](package.json) | Accessibility category threshold via `MIN_A11Y_SCORE` env (defaults `0.86`) |

HTML reports land in `playwright-report/` · failures capture traces under `test-results/` (both gitignored).

**Lighthouse troubleshooting:** `npm run lh:a11y` reserves **port 5199**. If you see `Port 5199 is already in use`, stop the other Vite first or run `npm run lh:a11y:run` while you already have `npm run dev -- --host localhost --strictPort --port 5199` running. On Windows, `start-server-and-test` may log a noisy `taskkill` line after the audit even when the script printed a passing score—use the **exit code** and the `Lighthouse accessibility score:` line as the source of truth.

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
