import { Heart, ShoppingBag, Star } from "lucide-react";
import { type JSX, type MouseEvent } from "react";

import type { ShowcaseItem } from "../data/mocks";
import { useLocale } from "../i18n/useLocale";
import { formatMoney, formatUsdWhole } from "../lib/money";
import { cn } from "../lib/cn";
import { useCartStore } from "../stores/cartStore";
import { useFavoritesStore } from "../stores/favoritesStore";
import { Stars, STORE_STAR_HEX } from "./Stars";

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
const relatedRailIcon = "h-[18px] w-[18px]";
const relatedRailStroke = 1.35;
const relatedRailBtn =
  "pointer-events-auto relative z-[12] inline-flex h-[35px] w-[35px] shrink-0 cursor-pointer items-center justify-center rounded-md border border-black/18 bg-[#f1f0ea] text-black shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition hover:bg-[#e6e5dd] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1";

const relatedTooltipBase =
  "pointer-events-none invisible absolute bottom-full end-0 z-[25] mb-2 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-[10px] font-semibold tracking-tight text-white shadow-lg opacity-0 transition-[opacity,visibility] duration-150 motion-reduce:transition-none";

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
        "space-y-5",
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
              "text-[16px] font-medium text-[#525252] underline decoration-black underline-offset-[3px] transition hover:text-neutral-700 hover:decoration-neutral-700",
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
            isRelated
              ? "grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-5 lg:gap-[18px] xl:gap-9"
              : "grid grid-cols-2 gap-[18px] sm:gap-8 md:flex md:flex-nowrap md:gap-10 md:overflow-x-auto md:no-scrollbar md:scroll-smooth lg:justify-between xl:justify-start",
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
                      <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full rounded-md object-cover"
                      />
                    </div>
                    <RelatedImageHoverTray item={item} />
                  </>
                ) : (
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "h-full w-full object-cover",
                      "transition duration-[1200ms] group-hover:scale-105",
                    )}
                  />
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

function RelatedImageHoverTray({ item }: { item: ShowcaseItem }): JSX.Element {
  const { t } = useLocale();
  const addItem = useCartStore((s) => s.addItem);
  const toggleFavorite = useFavoritesStore((s) => s.toggleProduct);
  const saved = useFavoritesStore((s) => s.isFavorite(item.id));
  const slug = item.slug ?? `related-${item.id}`;
  const displayName = `${item.brand} ${item.name}`.trim();
  const favLabel = saved ? t("rails.favAriaRemove") : t("rails.favAriaAdd");
  const favTip = saved ? t("rails.favTipSaved") : t("rails.favTipAdd");

  const stopCard = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-10 flex flex-col items-end justify-start p-2",
        /* Below `md`: phones — keep actions visible (hover unreliable) */
        "visible opacity-100 max-md:motion-safe:transition-none",
        /* md+: desktop-style reveal on hover / keyboard focus inside card */
        "md:invisible md:opacity-0 md:motion-safe:transition-[opacity,visibility]",
        "md:motion-safe:duration-200 md:motion-safe:ease-out",
        "md:group-hover/related:visible md:group-hover/related:opacity-100",
        "md:group-focus-within/related:visible md:group-focus-within/related:opacity-100",
      )}
    >
      <div className="pointer-events-auto relative z-[11] flex flex-col items-end gap-2">
        <div className="relative shrink-0">
          <button
            type="button"
            className={`peer/rel-rail-fav ${relatedRailBtn}`}
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
            className={`peer/rel-rail-cart ${relatedRailBtn}`}
            aria-label={t("rails.addToCartAria")}
            onClick={(e) => {
              stopCard(e);
              addItem({
                productId: item.id,
                slug,
                name: displayName,
                image: item.image,
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
        <span className="font-regular text-[#666666] text-[16px] tabular-nums">
          {sold.toLocaleString("en-US")} Sold
        </span>
      </div>
    </div>
  );
}
