import { Heart, ShoppingBag, Star } from "lucide-react";
import { type JSX, type MouseEvent } from "react";

import type { ShowcaseItem } from "../data/mocks";
import { useLocale } from "../i18n/useLocale";
import { getResponsiveImageAttrs } from "../lib/image";
import { formatMoney, formatUsdWhole } from "../lib/money";
import { cn } from "../lib/cn";
import { useCartStore } from "../stores/cartStore";
import { useFavoritesStore } from "../stores/favoritesStore";
import { selectIsFavoriteByProductId } from "../stores/selectors";
import { Stars, STORE_STAR_HEX } from "./Stars";
import {
  relatedRailIcon,
  relatedRailBtn,
  relatedRailGridClass,
  relatedTooltipBase,
  relatedTrayVisibilityClass,
  relatedViewAllLinkClass,
} from "./variants/productRails.variants";

type Props = {
  eyebrow?: string;
  headline: string;
  items: ShowcaseItem[];
  anchorId: string;
  /** Default: editorial rail (serif title, reviews, horizontal scroll). Related: Figma PDP strip. */
  variant?: "default" | "related";
  /** Same cards/grid as Related; applies Popular eyebrow/title sizing. Pair with distinct `items` vs Related. */
  popularWeek?: boolean;
};

/** Related rail: ~80% scale of gallery `railBtn` (44×44 / 22px icon) — icon-only + peer tooltips */
const relatedRailStroke = 1.35;
export function ProductRails({
  eyebrow,
  headline,
  items,
  anchorId,
  variant = "default",
  popularWeek = false,
}: Props): JSX.Element {
  const { t } = useLocale();
  const isRelated = variant === "related";

  return (
    <section
      id={anchorId}
      className={cn(
        "space-y-10 sm:space-y-5",
        isRelated
          ? cn(
              "dash-color-bbb pt-16 pb-20",
              /* Popular sits above footer — no bottom rule in design */
              popularWeek ? "dash-top" : "dash-y",
            )
          : "border-t border-jl-border/80 pt-10",
      )}
    >
      <div
        className={cn(
          "flex flex-wrap gap-6",
          isRelated
            ? eyebrow
              ? "items-start justify-between"
              : "items-end justify-between"
            : "items-baseline md:justify-between",
        )}
      >
        <div className={cn(isRelated && "min-w-0")}>
          {eyebrow ? (
            <p
              className={cn(
                "text-[11px] uppercase tracking-[0.45em]",
                isRelated && popularWeek
                  ? "mb-2 font-medium text-neutral-600"
                  : isRelated
                    ? "mb-1.5 font-semibold text-neutral-900"
                    : "font-semibold text-neutral-900",
              )}
            >
              {eyebrow}
            </p>
          ) : null}
          <h2
            className={cn(
              isRelated &&
                popularWeek &&
                "font-sans text-[28px] font-semibold tracking-[-0.02em] text-black sm:text-[28px]",
              isRelated &&
                !popularWeek &&
                "font-sans text-[28px] font-semibold tracking-normal text-black",
              !isRelated &&
                "font-serif text-[28px] font-semibold tracking-[0.04em] sm:text-[32px] md:text-[36px]",
            )}
          >
            {headline}
          </h2>
        </div>

        {isRelated ? (
          <button
            type="button"
            className={cn(
              relatedViewAllLinkClass,
              eyebrow && popularWeek && "shrink-0 self-start pt-[22px]",
            )}
          >
            {t("rails.viewAll")}
          </button>
        ) : (
          <button
            type="button"
            className="rounded-full px-10 py-[9px] text-[11px] font-semibold uppercase tracking-[0.4em]"
          >
            {t("rails.viewAllAz")}
          </button>
        )}
      </div>

      <div className="relative">
        <div
          className={cn(
            relatedRailGridClass({ variant: isRelated ? "related" : "default" }),
          )}
        >
          {items.map((item) => (
            <article
              key={item.id}
              className={cn(
                "flex shrink-0 flex-col border border-transparent bg-transparent",
                isRelated && "group/related",
                !isRelated &&
                  "group transition hover:bg-white md:w-[18.5vw] xl:w-[calc((100%/5)-38px)]",
              )}
            >
              <div
                className={cn(
                  "relative isolate bg-jl-gray",
                  isRelated && "aspect-[3/4] overflow-visible rounded-md",
                  !isRelated &&
                    "overflow-hidden aspect-[3/5] md:aspect-[120/208] xl:aspect-[148/258]",
                )}
              >
                {isRelated ? (
                  <>
                    <div className="absolute inset-0 overflow-hidden rounded-md">
                      <RailItemImage src={item.image} alt="" />
                    </div>
                    <RelatedImageHoverTray item={item} />
                  </>
                ) : (
                  <div className="h-full w-full overflow-hidden">
                    <RailItemImage
                      src={item.image}
                      alt=""
                      className="transition duration-[1200ms] group-hover:scale-105"
                    />
                  </div>
                )}
              </div>

              <RailCardBody item={item} isRelated={isRelated} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RailItemImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}): JSX.Element {
  const attrs = getResponsiveImageAttrs(src, {
    widths: [280, 420, 620, 820],
    sizes: "(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 20vw",
  });

  return (
    <img
      src={attrs.src}
      srcSet={attrs.srcSet}
      sizes={attrs.sizes}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn("h-full w-full rounded-md object-cover", className)}
    />
  );
}

function RelatedImageHoverTray({ item }: { item: ShowcaseItem }): JSX.Element {
  const { t } = useLocale();
  const addItem = useCartStore((s) => s.addItem);
  const toggleFavorite = useFavoritesStore((s) => s.toggleProduct);
  const saved = useFavoritesStore(selectIsFavoriteByProductId(item.id));
  const slug = item.slug ?? `related-${item.id}`;
  const displayName = `${item.brand} ${item.name}`.trim();
  const favLabel = saved ? t("rails.favAriaRemove") : t("rails.favAriaAdd");
  const favTip = saved ? t("rails.favTipSaved") : t("rails.favTipAdd");

  const stopCard = (e: MouseEvent) => {
    // Action buttons live inside a clickable card surface; stop bubbling to prevent accidental navigation.
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={relatedTrayVisibilityClass}
    >
      <div className="pointer-events-auto relative z-[11] flex flex-col items-end gap-2">
        <div className="relative shrink-0">
          <button
            type="button"
            className={cn("peer/rel-rail-fav", relatedRailBtn)}
            aria-label={favLabel}
            onClick={(e) => {
              stopCard(e);
              toggleFavorite({
                productId: item.id,
                slug,
                name: displayName,
                image: item.image,
              });
            }}
          >
            <Heart
              className={cn(
                relatedRailIcon,
                saved ? "fill-black text-black" : "fill-none text-black",
              )}
              strokeWidth={relatedRailStroke}
              aria-hidden
            />
          </button>
          <span
            role="tooltip"
            aria-hidden
            className={cn(
              relatedTooltipBase,
              "peer-hover/rel-rail-fav:visible peer-hover/rel-rail-fav:opacity-100",
              "peer-focus-visible/rel-rail-fav:visible peer-focus-visible/rel-rail-fav:opacity-100",
            )}
          >
            {favTip}
          </span>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            className={cn("peer/rel-rail-cart", relatedRailBtn)}
            aria-label={t("rails.addToCartAria")}
            onClick={(e) => {
              stopCard(e);
              addItem({
                productId: item.id,
                slug,
                name: displayName,
                image: item.image,
                // Rail cards are SKU-agnostic promos, so we add a generic line identity.
                selections: {},
                variantId: null,
                unitPrice: item.price,
              });
            }}
          >
            <ShoppingBag
              className={relatedRailIcon}
              strokeWidth={relatedRailStroke}
              aria-hidden
            />
          </button>
          <span
            role="tooltip"
            aria-hidden
            className={cn(
              relatedTooltipBase,
              "peer-hover/rel-rail-cart:visible peer-hover/rel-rail-cart:opacity-100",
              "peer-focus-visible/rel-rail-cart:visible peer-focus-visible/rel-rail-cart:opacity-100",
            )}
          >
            {t("pdp.addToCart")}
          </span>
        </div>
      </div>
    </div>
  );
}

function RailCardBody({
  item,
  isRelated,
}: {
  item: ShowcaseItem;
  isRelated: boolean;
}): JSX.Element {
  if (!isRelated) {
    return (
      <div className="flex flex-col gap-[8px] py-6 text-neutral-950">
        <p className="text-[13px] font-semibold">{item.brand}</p>
        <p className="font-serif text-[18px] font-medium leading-snug">
          {item.name}
        </p>
        <p className="text-[13px] text-neutral-600">{item.snippet}</p>
        <div className="flex flex-wrap gap-3 text-[17px] font-semibold tracking-tight">
          {typeof item.catalogue === "number" &&
            item.catalogue > item.price && (
              <span className="text-neutral-600 line-through">
                {formatMoney(item.catalogue)}
              </span>
            )}
          <span>{formatMoney(item.price)}</span>
        </div>

        <div className="flex items-center gap-2 pt-2 text-neutral-950">
          <Stars value={item.rating} />
          <span className="text-[13px] font-semibold text-neutral-950">
            {item.rating.toFixed(1)} ·{" "}
            <span className="text-neutral-600">{item.reviewCount} reviews</span>
          </span>
        </div>
      </div>
    );
  }

  const sold = item.soldCount ?? 0;
  const { t } = useLocale();
  return (
    <div className="flex flex-col gap-[5px] pt-3 font-sans text-black">
      <p className="text-[18px] font-semibold leading-tight">{item.brand}</p>
      <p className="text-[20px] font-semibold leading-tight tracking-tight">
        {formatUsdWhole(item.price)}
      </p>
      <p className="text-[16px] leading-snug text-[#7A7A7A]">{item.name}</p>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] leading-tight text-[#7A7A7A]">
        <Star
          className="h-[24px] w-[24px]"
          fill={STORE_STAR_HEX}
          stroke={STORE_STAR_HEX}
          strokeWidth={0}
          aria-hidden
        />
        <span className="text-[16px] text-[#0B0F0E] font-normal tabular-nums">
          {item.rating.toFixed(1)}
        </span>
        <span
          className="inline-block h-1 w-1 shrink-0 rounded-full bg-[#BBBBBB]"
          aria-hidden
        />
        <span className="font-normal text-[#666666] text-[16px] tabular-nums">
          {sold.toLocaleString("en-US")} {t("pdp.soldSuffix")}
        </span>
      </div>
    </div>
  );
}
