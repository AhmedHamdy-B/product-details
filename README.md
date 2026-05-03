# ElegantSoft frontend task · Product detail experience

Implementing the [Frontend Engineering Task (ElegantSoft)](https://github.com/ElegantSoft/frontend-task-2025) brief: modular PDP, EasyOrders-driven catalogue data, persisted basket, JL-inspired visuals (mobile & desktop references), and tooling that maps to the evaluator checklist.

## Stack

| Area | Choice |
| --- | --- |
| UI | React 19 · TypeScript · Vite 8 · Tailwind 3 (+ forms & typography plugins) · [Lucide](https://lucide.dev/) (UI strokes) · [react-icons `si`](https://react-icons.github.io/react-icons/) (footer brand marks) |
| PDP state | **Zustand + Immer** (`useProductStore` mirrors the readme contract incl. getters) |
| Cart | **Zustand + Immer + `persist`** (localStorage, partialised lines only) |
| Data layer readiness | `@tanstack/react-query` wired at the root for cache-friendly extensions |

## Prerequisites

Node 22+ recommended (matching the toolchain used while authoring).

## Scripts

```bash
npm install
npm run dev        # Vite dev server (http://localhost:5173)
npm run build      # Production bundle
npm run test:run   # Vitest suite (pricing + variation matrix helpers)
```

No `.env` is required—the reference product is fetched from EasyOrders publicly.

### Product API

Configured in [`src/api/product.ts`](src/api/product.ts):

`https://api.easy-orders.net/api/v1/products/slug/clear-theme/Sneakers12?join=reviews`

> The live payload still omits nested `reviews` today, so the reviews rail uses curated mocks that follow the JL frames you supplied; swap the section to Live data once the backend joins hydrate.

### Design fidelity

Layouts, hierarchy, typography (Playfair for hero brand lockups / Helvetica-esque system stack), monochrome palette, carousel rails, review chrome, drawers, CTAs and spacing hew to the exported Figma stills—the hero gallery and buying column pull **real SKU imagery + variations** so colour/size permutations remain faithful to catalogue data rather than placeholders.

### State architecture

1. **`useProductStore`** — remote fetch (`fetchProduct`), selection map, resolver helpers (`getGallery`, catalogue/payable getters, `isVariantAvailable`).
2. **`useCartStore`** — hydrated basket lines, totals, optimistic toast banner, drawer visibility.
3. **Utilities** (`src/lib/variants.ts`) — deterministic variant matrix checks used by selectors + Vitest fixtures.

Refer to [`src/pages/ProductDetailPage.tsx`](src/pages/ProductDetailPage.tsx) for orchestration plus [`src/components/`](src/components/) for individual UI slices.

### Testing & quality gates

Vitest exercises pricing deltas and SKU permutation maths; extend [`src/tests/`](src/tests/) whenever new store primitives land.

## Deployment notes

After `npm run build`, publish the `dist/` folder to any static host (Netlify Drop, Azure Static Web Apps, Cloudflare Pages, S3 static site, …). Configure SPA rewrites so client routes resolve to `index.html` if you add routing later.

## Hand-off checklist vs readme

| Requirement | Implementation pointer |
| --- | --- |
| Modular PDP | `components/` + focused hooks/stores |
| Zustand + Immer PDP | `stores/productStore.ts` |
| Persisted basket | `stores/cartStore.ts` |
| API integration | `api/product.ts` + store fetch |
| Gallery / zoom | `ProductGallery.tsx` |
| Variations UX | Colour swatches · size lattice · disabled states |
| Cart drawer · totals | `CartDrawer.tsx` + badge in `SiteHeader.tsx` |
| Responsive rails & reviews | `ProductRails.tsx` (`relatedShowcase` ≠ `popularShowcase` mocks until APIs split) · `ReviewsSection.tsx` |

Optional extras from the readme (comparison mode, analytics, keyboard nav tightening) remain future backlog items—call them out explicitly if you pitch this build to ElegantSoft recruiters.
