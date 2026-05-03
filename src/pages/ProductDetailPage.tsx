import { useEffect, useMemo, type JSX } from 'react'

import { PRODUCT_ENDPOINT } from '../api/product'
import { CartDrawer } from '../components/CartDrawer'
import { ProductBuyingSection } from '../components/ProductBuyingSection'
import { ProductGallery } from '../components/ProductGallery'
import { ProductRails } from '../components/ProductRails'
import { Reveal } from '../components/Reveal'
import { ReviewsSection } from '../components/ReviewsSection'
import { PageContainer } from '../components/PageContainer'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { ToastBanner } from '../components/ToastBanner'
import { popularShowcase, relatedShowcase } from '../data/mocks'
import { buildGallery } from '../lib/variants'
import type { Product } from '../types/product'
import { FavoritesDrawer } from '../components/FavoritesDrawer'
import { useProductStore } from '../stores/productStore'
import { useFavoritesStore } from '../stores/favoritesStore'

export function ProductDetailPage(): JSX.Element {
  const product = useProductStore((state) => state.product)
  const loading = useProductStore((state) => state.loading)
  const errorMessage = useProductStore((state) => state.error)
  const selections = useProductStore((state) => state.selectedVariations)
  const hydrate = useProductStore((state) => state.fetchProduct)

  useEffect(() => {
    hydrate(PRODUCT_ENDPOINT)
  }, [hydrate])

  const gallery = useMemo(() => {
    if (!product) return []
    return buildGallery(product, selections)
  }, [product, selections])

  const wishlistedGallery = useFavoritesStore((s) =>
    product?.id ? s.isFavorite(product.id) : false,
  )
  const toggleFavoriteProduct = useFavoritesStore((s) => s.toggleProduct)

  const crumbs = useMemo(() => buildCrumbs(product), [product])

  let bodyContent: JSX.Element

  if (loading && !product) {
    bodyContent = (
      <Reveal>
        <LoadingPanels />
      </Reveal>
    )
  } else if (!product || errorMessage) {
    bodyContent = (
      <Reveal>
        <ErrorPanels message={errorMessage ?? 'We could not find that product anymore.'} />
      </Reveal>
    )
  } else {
    bodyContent = (
      <>
        <Reveal delayMs={50}>
          <section className="border-y border-transparent bg-white">
            <div className="flex flex-col gap-12 py-12 md:gap-14 xl:flex-row xl:items-start xl:justify-between xl:gap-16">
              <div className="w-full xl:max-w-[52%]">
                <ProductGallery
                  images={gallery}
                  productTitle={product.name}
                  wishlisted={wishlistedGallery}
                  onToggleWishlist={() =>
                    toggleFavoriteProduct({
                      productId: product.id,
                      slug: product.slug,
                      name: product.name,
                      image: gallery[0] ?? product.thumb,
                    })
                  }
                />
              </div>
              <div className="w-full flex-1 space-y-[26px]">
                <ProductBuyingSection product={product} />
              </div>
            </div>
          </section>
        </Reveal>

        <div className="bg-white">
          <Reveal>
            <ProductRails
              variant="related"
              headline="Related Product"
              items={relatedShowcase}
              anchorId="related"
            />
          </Reveal>

          <Reveal>
            <ReviewsSection />
          </Reveal>

          <Reveal>
            <ProductRails
              variant="related"
              popularWeek
              headline="Popular this week"
              items={popularShowcase}
              anchorId="popular-week"
            />
          </Reveal>
        </div>
      </>
    )
  }

  return (
    <div className="bg-jl-white text-neutral-950">
      <Reveal>
        <SiteHeader crumbs={crumbs} />
      </Reveal>

      <main className="min-w-0">
        <PageContainer className="pb-24">{bodyContent}</PageContainer>
      </main>

      <Reveal>
        <SiteFooter />
      </Reveal>

      <CartDrawer />
      <FavoritesDrawer />
      <ToastBanner />
    </div>
  )
}

function buildCrumbs(product: Product | null): string[] {
  const trail = ['Homepage', 'Women', 'Fashion']
  const categorySlug = product?.categories?.find((category) =>
    Boolean(category.slug),
  )

  const dynamicBranch = categorySlug?.name ?? "Women's Sneakers Lab"
  return [...trail.slice(0, 2), dynamicBranch, product?.name ?? 'Product detail'].filter(Boolean)
}

function LoadingPanels(): JSX.Element {
  const pulseRows = Array.from({ length: 12 }).map((_, index) => `pulse-${index}`)

  return (
    <div className="space-y-[18px] pb-36 pt-24 lg:pb-52">
      <div className="grid gap-[18px] lg:grid-cols-2 lg:gap-16">
        <div className="aspect-[3/5] w-full animate-pulse bg-jl-gray" />
        <div className="space-y-[18px]">
          {pulseRows.map((label) => (
            <div key={label} className="h-6 w-[75%] rounded bg-jl-gray" />
          ))}
        </div>
      </div>
    </div>
  )
}

function ErrorPanels({ message }: { message: string }): JSX.Element {
  const retry = useProductStore((store) => store.fetchProduct)

  return (
    <div className="space-y-[18px] py-32 text-neutral-950">
      <div className="space-y-[22px] border border-black px-14 py-[46px] text-center lg:text-left">
        <h2 className="font-serif text-[38px] font-medium">{message}</h2>
        <p className="text-[15px] leading-relaxed text-neutral-600">
          The Easy Orders reference feed may be unreachable. Confirm connectivity in devtools networking or retry.
        </p>
        <button
          type="button"
          onClick={() => retry(PRODUCT_ENDPOINT)}
          className="inline-flex rounded-full border border-transparent bg-black px-16 py-4 text-[12px] font-semibold uppercase tracking-[0.43em] text-white"
        >
          Retry retrieval
        </button>
      </div>
    </div>
  )
}
