import { useQuery } from "@tanstack/react-query";
import { Suspense, lazy, useEffect, useMemo, useState, type JSX } from "react";
import { useParams } from "react-router-dom";

import { TASK_PRODUCT_SLUG } from "../api/product";
import { productDetailQuery } from "../api/product.queries";
import { CartDrawer } from "../components/CartDrawer";
import { ProductBuyingSection } from "../components/ProductBuyingSection";
import { ProductGallery } from "../components/ProductGallery";
import { Reveal } from "../components/Reveal";
import { PageContainer } from "../components/PageContainer";
import { SiteHeader } from "../components/SiteHeader";
import { ToastBanner } from "../components/ToastBanner";
import type { Product } from "../types/product";
import { FavoritesDrawer } from "../components/FavoritesDrawer";
import {
  buildProductGallery,
  getInitialSelectionsForProduct,
} from "../stores/productStore";
import { variationKey } from "../lib/variants";
import { useFavoritesStore } from "../stores/favoritesStore";
import { selectIsFavoriteByProductId } from "../stores/selectors";
import { useLocale } from "../i18n/useLocale";
import type { MessageKey } from "../i18n/messages";
import { Button } from "../components/ui/Button";
import {
  pdpBuyingColClass,
  pdpGalleryColClass,
  pdpLayoutRowClass,
} from "./variants/productDetailPage.variants";

const ProductDetailBelowFold = lazy(async () => {
  const mod = await import("../components/ProductDetailBelowFold");
  return { default: mod.ProductDetailBelowFold };
});

const SiteFooter = lazy(async () => {
  const mod = await import("../components/SiteFooter");
  return { default: mod.SiteFooter };
});

export function ProductDetailPage(): JSX.Element {
  const { t } = useLocale();
  const { slug: rawSlug } = useParams<{ slug: string }>();
  const slug = rawSlug ?? TASK_PRODUCT_SLUG;
  const [selectedVariations, setSelectedVariations] = useState<
    Record<string, string>
  >({});

  const productQuery = useQuery(productDetailQuery(slug));
  useEffect(() => {
    if (!productQuery.data) return;
    setSelectedVariations(getInitialSelectionsForProduct(productQuery.data));
  }, [productQuery.data?.id]);

  const product = productQuery.data ?? null;
  const loading = productQuery.isPending;
  const errorMessage = productQuery.isError
    ? productQuery.error instanceof Error
      ? productQuery.error.message
      : t("error.productNotFound")
    : null;

  const gallery = useMemo(() => {
    if (!product) return [];
    return buildProductGallery(product, selectedVariations);
  }, [product, selectedVariations]);

  const wishlistedGallery = useFavoritesStore(
    product?.id ? selectIsFavoriteByProductId(product.id) : () => false,
  );
  const toggleFavoriteProduct = useFavoritesStore((s) => s.toggleProduct);

  const crumbs = useMemo(() => buildCrumbs(product, t), [product, t]);

  let bodyContent: JSX.Element;

  if (loading && !product) {
    bodyContent = (
      <Reveal>
        <LoadingPanels />
      </Reveal>
    );
  } else if (!product || errorMessage) {
    bodyContent = (
      <Reveal>
        <ErrorPanels
          message={errorMessage ?? t("error.productNotFound")}
          onRetry={() => void productQuery.refetch()}
        />
      </Reveal>
    );
  } else {
    bodyContent = (
      <>
        <Reveal delayMs={50}>
          <section className="border-y border-transparent bg-white">
            <div className={pdpLayoutRowClass}>
              <div className={pdpGalleryColClass}>
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
              <div className={pdpBuyingColClass}>
                <ProductBuyingSection
                  product={product}
                  selectedVariations={selectedVariations}
                  onSelectVariation={(variationType, value) => {
                    setSelectedVariations((current) => ({
                      ...current,
                      [variationKey(variationType)]: value,
                    }));
                  }}
                />
              </div>
            </div>
          </section>
        </Reveal>

        <div className="bg-white">
          <Suspense fallback={null}>
            <ProductDetailBelowFold
              relatedHeadline={t("rails.relatedProduct")}
              popularHeadline={t("rails.popularThisWeek")}
            />
          </Suspense>
        </div>
      </>
    );
  }

  return (
    <div className="bg-jl-white text-neutral-950">
      <Reveal>
        <SiteHeader crumbs={crumbs} />
      </Reveal>

      <main
        id="main-content"
        tabIndex={-1}
        className="main-focus-ring"
      >
        <PageContainer className="pb-24">{bodyContent}</PageContainer>
      </main>

      <Suspense fallback={null}>
        <Reveal>
          <SiteFooter />
        </Reveal>
      </Suspense>

      <CartDrawer />
      <FavoritesDrawer />
      <ToastBanner />
    </div>
  );
}

function buildCrumbs(
  product: Product | null,
  t: (key: MessageKey) => string,
): string[] {
  const trail = [t("crumb.homepage"), t("crumb.women")];
  const categorySlug = product?.categories?.find((category) =>
    Boolean(category.slug),
  );

  const dynamicBranch = categorySlug?.name ?? t("crumb.sneakersFallback");
  return [
    ...trail,
    dynamicBranch,
    product?.name ?? t("crumb.productDetailFallback"),
  ].filter(Boolean);
}

function LoadingPanels(): JSX.Element {
  const pulseRows = Array.from({ length: 12 }).map(
    (_, index) => `pulse-${index}`,
  );

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
  );
}

function ErrorPanels({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}): JSX.Element {
  const { t } = useLocale();
  return (
    <div className="space-y-[18px] py-32 text-neutral-950">
      <div className="space-y-[22px] border border-black px-14 py-[46px] text-center lg:text-start">
        <h2 className="font-serif text-[38px] font-medium">{message}</h2>
        <p className="text-[15px] leading-relaxed text-neutral-600">
          {t("error.feedUnreachableBody")}
        </p>
        <Button type="button" onClick={onRetry} size="sm" rounded="full">
          {t("error.retryButton")}
        </Button>
      </div>
    </div>
  );
}
