import { Star } from "lucide-react";
import { useState, type JSX } from "react";

import type { Product, Variation } from "../types/product";
import { formatMoney } from "../lib/money";
import {
  isOptionSelectable,
  variationKey as variationKeyNormalize,
} from "../lib/variants";
import { STORE_STAR_HEX } from "./Stars";
import { cn } from "../lib/cn";
import { useProductStore } from "../stores/productStore";
import { useCartStore } from "../stores/cartStore";
/** Figma PDP header defaults when API omits social-proof fields */
const HEADER_DEFAULTS = { sold_count: 1238, rating_avg: 4.5 } as const;

function formatSold(count: number) {
  return new Intl.NumberFormat("en-GB").format(Math.max(0, Math.round(count)));
}

function humanizeVariationLabel(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function titleCasePhrase(raw: string) {
  const s = raw.replace(/-/g, " ").trim();
  if (!s) return s;
  return s
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** Color names use title case; size options stay uppercase like the selectable chips. */
function formatSelectionLabel(selection: string, variation: Variation): string {
  const raw = selection.replace(/-/g, " ").trim();
  if (!raw) return "Choose";
  if (variation.type === "image") return titleCasePhrase(raw);
  return raw.toUpperCase();
}

function VariationHeading({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-[15px] leading-tight">
      <span className="font-normal text-[#999999]">{label}: </span>
      <span className="font-bold tracking-tight text-black">{value}</span>
    </p>
  );
}

type BuyingProps = {
  product: Product;
};

export function ProductBuyingSection({ product }: BuyingProps): JSX.Element {
  const selectedVariations = useProductStore(
    (state) => state.selectedVariations,
  );
  const selectedVariant = useProductStore((state) => state.selectedVariant);
  const combosAvailable = useProductStore((state) =>
    state.isVariantAvailable(),
  );

  const setVariation = useProductStore((state) => state.setSelectedVariation);
  const addLine = useCartStore((state) => state.addItem);
  const openDrawer = useCartStore((state) => state.openDrawer);

  const catalogue = useProductStore((state) => state.getCurrentPrice());
  const payable = useProductStore((state) => state.getCurrentSalePrice());
  const showDiscount = payable < catalogue;

  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );

  const heroImageSelection = (): string => {
    const colorKey = variationKeyNormalize("color");
    const colorVar = product.variations.find(
      (v) => variationKeyNormalize(v.name) === colorKey,
    );
    const selectedColour = selectedVariations[colorKey];
    const match = colorVar?.props.find((prop) => prop.name === selectedColour);
    if (match?.value) return match.value;
    return product.thumb;
  };

  const handleAddToCart = () => {
    if (!combosAvailable || !selectedVariant) {
      setValidationMessage("Select every variation before continuing.");
      return;
    }

    const stockIssues =
      product.track_stock && (selectedVariant.quantity ?? 0) <= 0;
    if (stockIssues) {
      setValidationMessage("This pairing is awaiting restock.");
      return;
    }

    setValidationMessage(null);

    addLine({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: heroImageSelection(),
      selections: { ...selectedVariations },
      variantId: selectedVariant.id,
      unitPrice: payable,
      quantity: 1,
    });
  };

  const soldCount = product.sold_count ?? HEADER_DEFAULTS.sold_count;
  const ratingAvg = product.rating_avg ?? HEADER_DEFAULTS.rating_avg;

  return (
    <div className="space-y-9">
      <header className="border-b border-dashed border-[#D1D1D1] pb-5">
        <p className="text-[13px] font-normal leading-[1.25] text-[#717171]">
          John Lewis <span className="uppercase">ANYDAY</span>
        </p>
        <h1 className="mt-1 font-sans text-[24px] font-bold leading-[1.25] tracking-[-0.02em] text-black sm:text-[28px]">
          {product.name}
        </h1>

        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
            {showDiscount ? (
              <span className="text-[15px] font-normal leading-none text-[#999999] line-through decoration-[#999999]">
                {formatMoney(catalogue)}
              </span>
            ) : null}
            <span className="text-[22px] font-bold leading-none tracking-[-0.02em] text-black sm:text-[24px]">
              {formatMoney(payable)}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-[6px] text-[14px] leading-none">
            <span className="font-normal whitespace-nowrap text-[#999999]">
              {formatSold(soldCount)} Sold
            </span>
            <span className="text-[12px] text-[#CCCCCC]" aria-hidden>
              •
            </span>
            <Star
              className="h-[17px] w-[17px] shrink-0"
              fill={STORE_STAR_HEX}
              color={STORE_STAR_HEX}
              strokeWidth={0}
              aria-hidden
            />
            <span className="font-bold tabular-nums text-black">
              {ratingAvg.toFixed(1)}
            </span>
          </div>
        </div>
      </header>

      <ExpandableRichDescription html={product.description} />

      <div className="space-y-10 pt-2">
        {product.variations.map((variation) => (
          <div key={variation.id} className="space-y-4">
            <div className="flex items-baseline justify-between gap-x-8">
              <VariationHeading
                label={humanizeVariationLabel(variation.name)}
                value={formatSelectionLabel(
                  selectedVariations[variationKeyNormalize(variation.name)] ??
                    "",
                  variation,
                )}
              />
              {variationKeyNormalize(variation.name) ===
                variationKeyNormalize("size") && (
                <SizeGuideTooltip className="hidden md:inline-flex" />
              )}
            </div>

            {variation.type === "image" ? (
              <ColorSwatches
                variation={variation}
                selections={selectedVariations}
                product={product}
                select={(value) => {
                  setValidationMessage(null);
                  setVariation(variation.name, value);
                }}
              />
            ) : (
              <SizeButtons
                variation={variation}
                selections={selectedVariations}
                product={product}
                select={(value) => {
                  setValidationMessage(null);
                  setVariation(variation.name, value);
                }}
              />
            )}
          </div>
        ))}
      </div>

      {validationMessage && (
        <p className="text-[14px] font-semibold text-red-600" role="status">
          {validationMessage}
        </p>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          disabled={Boolean(
            product.track_stock && (selectedVariant?.quantity ?? 0) <= 0,
          )}
          onClick={handleAddToCart}
          className="min-h-[52px] min-w-0 flex-[3] rounded-lg bg-black px-5 text-[15px] font-bold leading-tight text-white transition hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add To Cart
        </button>

        <button
          type="button"
          onClick={() => openDrawer()}
          className="min-h-[52px] min-w-0 flex-[2] rounded-lg border border-[#D1D1D1] bg-white px-5 text-[15px] font-normal leading-tight text-black transition hover:border-[#B0B0B0]"
        >
          Checkout Now
        </button>
      </div>

      <div className="border-t border-dashed border-[#D1D1D1] pt-5">
        <DeliveryTermsTooltip />
      </div>
    </div>
  );
}

type SelectorProps = {
  variation: Variation;
  selections: Record<string, string>;
  product: Product;
  select: (value: string) => void;
};

/** Figma: ~48×48 thumb; selected = same inner image (+ 48) inside 60 frame = 5px white + 1px black per side */
const SWATCH_GAP = "gap-[14px]";
const swatchCell =
  "flex h-[60px] min-h-[60px] w-[60px] min-w-[60px] shrink-0 items-center justify-center";

function ColorSwatches({
  variation,
  selections,
  product,
  select,
}: SelectorProps): JSX.Element {
  const key = variationKeyNormalize(variation.name);
  return (
    <div className={cn("flex flex-wrap items-center", SWATCH_GAP)}>
      {variation.props.map((prop) => {
        const selectedValue = selections[key] === prop.name;
        const available = isOptionSelectable(
          product,
          variation.name,
          prop.name,
          selections,
        );
        const thumbStyle = prop.value
          ? ({
              backgroundImage: `url("${prop.value}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            } as const)
          : undefined;

        return (
          <div key={prop.id} className={cn(swatchCell)}>
            <button
              type="button"
              disabled={!available}
              onClick={() => select(prop.name)}
              aria-pressed={selectedValue}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-[10px] transition outline-none ring-0 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
                selectedValue
                  ? "h-[60px] w-[60px] border border-black bg-white shadow-none"
                  : "h-[48px] w-[48px] border-0 shadow-none hover:opacity-95",
                !available && "cursor-not-allowed opacity-[0.35]",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute overflow-hidden bg-jl-gray",
                  selectedValue
                    ? "inset-[5px] rounded-[7px]"
                    : "inset-0 rounded-[10px]",
                )}
                style={thumbStyle}
              />
              <span className="sr-only capitalize">{prop.name}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

function SizeButtons({
  variation,
  selections,
  product,
  select,
}: SelectorProps): JSX.Element {
  const key = variationKeyNormalize(variation.name);
  const ordered = [...variation.props];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-2.5">
      {ordered.map((prop) => {
        const selectedValue = selections[key] === prop.name;
        const available = isOptionSelectable(
          product,
          variation.name,
          prop.name,
          selections,
        );
        return (
          <button
            type="button"
            disabled={!available}
            key={prop.id}
            onClick={() => select(prop.name)}
            className={cn(
              "inline-flex h-9 min-h-[38px] min-w-[72px] shrink-0 items-center justify-center rounded-[8px] px-3.5 text-[14px] font-bold tabular-nums tracking-tight transition outline-none",
              "focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
              selectedValue
                ? "border-2 border-black bg-jl-gray text-black"
                : "border border-[#D1D1D1] bg-white text-black hover:border-[#B0B0B0]",
              !available && "cursor-not-allowed opacity-35",
            )}
            aria-pressed={selectedValue}
          >
            {prop.name.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

const descriptionCopyClass =
  "text-[14px] leading-[1.65] text-[#666666] [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0" +
  " [&_ul]:my-2 [&_ul]:list-none [&_ul]:space-y-2 [&_ul]:pl-0 [&_ul]:leading-[1.65]" +
  " [&_li]:relative [&_li]:my-0 [&_li]:py-0 [&_li]:pl-[18px]" +
  " [&_li]:before:pointer-events-none [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[10px]" +
  " [&_li]:before:h-[5px] [&_li]:before:w-[5px] [&_li]:before:rounded-full [&_li]:before:bg-[#CCCCCC]" +
  " [&_ol]:my-2 [&_ol]:list-none [&_ol]:space-y-2 [&_ol]:pl-0 [&_ol]:leading-[1.65]" +
  " [&_ol>li]:relative [&_ol>li]:pl-[18px]" +
  " [&_ol>li]:before:pointer-events-none [&_ol>li]:before:absolute [&_ol>li]:before:left-0 [&_ol>li]:before:top-[10px]" +
  " [&_ol>li]:before:h-[5px] [&_ol>li]:before:w-[5px] [&_ol>li]:before:rounded-full [&_ol>li]:before:bg-[#CCCCCC]" +
  " [&_strong]:font-semibold [&_strong]:text-[#555555]" +
  " [&_a]:font-bold [&_a]:text-black";

function ExpandableRichDescription({ html }: { html: string }): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  if (!html) return <></>;

  return (
    <section className="mb-10">
      <h2 className="text-[15px] font-bold leading-tight tracking-[-0.01em] text-black">
        Description:
      </h2>
      <div className="relative mt-2">
        <div
          className={cn(descriptionCopyClass, !expanded && "line-clamp-6")}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {!expanded ? (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="mt-3 inline-flex text-[14px] font-bold leading-none tracking-[-0.01em] text-black underline decoration-black underline-offset-4 hover:text-neutral-800"
          >
            See&nbsp;More....
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="mt-4 inline-flex text-[14px] font-bold leading-none tracking-[-0.01em] text-black underline decoration-black underline-offset-4 hover:text-neutral-800"
          >
            Show&nbsp;less
          </button>
        )}
      </div>
    </section>
  );
}

const DELIVERY_POINTS = [
  "£3.95 click & collect from store",
  "Next-day delivery (£6.95)",
] as const;

/** PDP size guide — EU-style labels with approximate UK pairing and fit meaning */
const SIZE_GUIDE_ROWS: ReadonlyArray<{
  size: string;
  ukApprox: string;
  meaning: string;
}> = [
  {
    size: "36",
    ukApprox: "UK 3",
    meaning: "Extra small · narrow forefoot · ~22.5 cm foot",
  },
  { size: "37", ukApprox: "UK 4", meaning: "Small · standard width · ~23 cm" },
  {
    size: "38",
    ukApprox: "UK 5",
    meaning: "Small–medium · true-to-size for slim feet",
  },
  {
    size: "39",
    ukApprox: "UK 5½–6",
    meaning: "Medium · roomy toe on narrow lasts",
  },
  {
    size: "40",
    ukApprox: "UK 6½–7",
    meaning: "Most common women's EU · balanced width",
  },
  {
    size: "41",
    ukApprox: "UK 7½",
    meaning: "Medium–large · half-step up if you prefer slack",
  },
  {
    size: "42",
    ukApprox: "UK 8–8½",
    meaning: "Large · extra room in toe box · ~26.5 cm",
  },
  {
    size: "43",
    ukApprox: "UK 9",
    meaning: "Large · men's transitional · wide-ready",
  },
  {
    size: "44",
    ukApprox: "UK 9½–10",
    meaning: "Extra large · order half-size down for narrow feet",
  },
  {
    size: "45",
    ukApprox: "UK 10½",
    meaning: "XL · roomy mid-foot · athletic sock allowance",
  },
  {
    size: "46",
    ukApprox: "UK 11",
    meaning: "XXL · maximise with insole removed if tight",
  },
] as const;

const pdpPopoverPanelClass =
  "relative overflow-hidden rounded-lg border border-neutral-200/95 bg-white px-4 py-3.5 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.1)]";

/** Shared hover/reveal tooltip shell (delivery uses group, size guide uses group/sizeguide). */
function pdpPopoverRevealClass(extra: string) {
  return cn(
    "pointer-events-none invisible absolute top-full z-[60] mt-2.5 origin-top translate-y-1 scale-[0.98]",
    "opacity-0 transition-all duration-200 ease-out",
    extra,
  );
}

function SizeGuideTooltip({ className }: { className?: string }): JSX.Element {
  const revealTail =
    "group-hover/sizeguide:pointer-events-auto group-hover/sizeguide:visible group-hover/sizeguide:translate-y-0 group-hover/sizeguide:scale-100 group-hover/sizeguide:opacity-100 group-focus-within/sizeguide:pointer-events-auto group-focus-within/sizeguide:visible group-focus-within/sizeguide:translate-y-0 group-focus-within/sizeguide:scale-100 group-focus-within/sizeguide:opacity-100";

  return (
    <div className={cn("group/sizeguide relative isolate", className)}>
      <button
        type="button"
        className={cn(
          "bg-transparent px-0 py-0 text-right font-sans text-[13px] font-semibold tracking-normal text-black",
          "underline decoration-black decoration-1 underline-offset-[6px]",
          "transition hover:text-neutral-700 hover:decoration-neutral-700",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
        )}
        aria-describedby="size-guide-tooltip-panel"
      >
        View size chart
      </button>

      <div
        id="size-guide-tooltip-panel"
        role="tooltip"
        className={cn(
          pdpPopoverRevealClass("right-0 w-[min(calc(100vw-2rem),380px)]"),
          revealTail,
        )}
      >
        <div className={pdpPopoverPanelClass}>
          <div
            className="absolute -top-[5px] right-6 left-auto h-2.5 w-2.5 rotate-45 border-l border-t border-neutral-200/95 bg-white"
            aria-hidden
          />
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-900">
            Size guide
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-500">
            Tag numbers follow continental EU lasts. Half-sizes bridge UK
            fittings; lace styles tighten for narrow feet.
          </p>
          <div className="mt-3 max-h-[min(50vh,320px)] overflow-y-auto rounded-lg border border-neutral-100">
            <table className="w-full border-collapse text-left text-[11px] text-neutral-700">
              <thead className="sticky top-0 z-[1] border-b border-neutral-200 bg-neutral-50 font-semibold text-neutral-900">
                <tr>
                  <th className="px-2 py-2.5 sm:px-3">Size tag</th>
                  <th className="px-2 py-2.5 sm:px-3">UK (approx.)</th>
                  <th className="px-2 py-2.5 pr-3 sm:px-3">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_GUIDE_ROWS.map((row) => (
                  <tr
                    key={row.size}
                    className="border-b border-neutral-100 last:border-0 [&:nth-child(even)]:bg-neutral-50/60"
                  >
                    <td className="whitespace-nowrap px-2 py-2 font-semibold tabular-nums text-black sm:px-3">
                      {row.size}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 tabular-nums sm:px-3">
                      {row.ukApprox}
                    </td>
                    <td className="px-2 py-2 pr-3 leading-snug sm:px-3">
                      {row.meaning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 border-t border-neutral-100 pt-2.5 text-[11px] leading-relaxed text-neutral-500">
            Measure barefoot at evening; standing weight on paper. Sizes vary by
            maker—swap in store if between rows.
          </p>
        </div>
      </div>
    </div>
  );
}

function DeliveryTermsTooltip(): JSX.Element {
  const revealTail =
    "group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100";

  return (
    <div className="group relative isolate inline-flex">
      <button
        type="button"
        className={cn(
          "bg-transparent px-0 py-0 text-left font-sans text-[13px] font-medium leading-snug tracking-normal text-[#707070]",
          "underline decoration-[#707070] decoration-1 underline-offset-[3px]",
          "transition hover:text-[#555555] hover:decoration-[#555555]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
        )}
        aria-describedby="delivery-tooltip-panel"
      >
        Delivery T&amp;C
      </button>

      <div
        id="delivery-tooltip-panel"
        role="tooltip"
        className={cn(
          pdpPopoverRevealClass("left-0 w-[min(calc(100vw-2rem),288px)]"),
          revealTail,
        )}
      >
        <div className={pdpPopoverPanelClass}>
          <div
            className="absolute -top-[5px] left-4 h-2.5 w-2.5 rotate-45 border-l border-t border-neutral-200/95 bg-white"
            aria-hidden
          />
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-900">
            Delivery info
          </p>
          <ul className="mt-2.5 space-y-2 text-[13px] leading-snug text-neutral-600">
            {DELIVERY_POINTS.map((line) => (
              <li key={line} className="flex gap-2">
                <span
                  className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-neutral-400"
                  aria-hidden
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-neutral-100 pt-2.5 text-[11px] leading-relaxed text-neutral-500">
            Taxes and delivery options are confirmed at checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
