import clsx from "clsx";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Maximize2,
  Share,
  X,
} from "lucide-react";
import { memo, useEffect, useState, type JSX } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

import { useLocale } from "../i18n/useLocale";
import { cn } from "../lib/cn";

const galleryIcon = "h-5 w-5";
const galleryStroke = 1.5;

const railBtn =
  "inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[8px]  bg-[#F2F2F2] text-black transition active:scale-[0.97] hover:bg-[#ebebeb]";

type Props = {
  images: string[];
  productTitle: string;
  wishlisted: boolean;
  onToggleWishlist: () => void;
};

export const ProductGallery = memo(function ProductGallery({
  images,
  productTitle,
  wishlisted,
  onToggleWishlist,
}: Props): JSX.Element | null {
  const safeImages = images.length ? images : [];
  const [active, setActive] = useState(0);

  /* Clamp active index when the gallery list shrinks (e.g. colour swap removes frames). */
  /* eslint-disable react-hooks/set-state-in-effect -- keep selected slide in-range when urls length drops */
  useEffect(() => {
    if (active > safeImages.length - 1) {
      setActive(0);
    }
  }, [active, safeImages.length]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!safeImages.length) return null;

  return (
    <GalleryInterior
      title={productTitle}
      urls={safeImages}
      selectedIndex={Math.min(active, safeImages.length - 1)}
      onSelect={setActive}
      wishlisted={wishlisted}
      toggleWishlisted={onToggleWishlist}
    />
  );
});

type InteriorProps = {
  title: string;
  urls: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  wishlisted: boolean;
  toggleWishlisted: () => void;
};

function GalleryInterior({
  title,
  urls,
  selectedIndex,
  onSelect,
  wishlisted,
  toggleWishlisted,
}: InteriorProps): JSX.Element {
  const { t } = useLocale();
  const [zoomOpen, setZoomOpen] = useState(false);
  const [hoverPulse, setHoverPulse] = useState(false);
  const current = urls[Math.min(selectedIndex, urls.length - 1)];

  const goto = (direction: -1 | 1) => {
    const nextIndex = selectedIndex + direction;
    const wrapped = ((nextIndex % urls.length) + urls.length) % urls.length;
    onSelect(wrapped);
  };

  const handleShare = () => {
    const payload = { title, text: title, url: window.location.href };
    void (async () => {
      try {
        if (navigator.share) await navigator.share(payload);
        else if (navigator.clipboard?.writeText)
          await navigator.clipboard.writeText(payload.url);
      } catch {
        /* user dismissed share sheet or clipboard blocked */
      }
    })();
  };

  return (
    <div className="space-y-3">
      {/*
        Main row: image + right rail (same column for share, favourite, and carousel arrows).
        Rail is only as tall as the hero image; arrows sit at the bottom of that column, outside the image.
        Thumbnails sit below in a second row, width-matched to the image (spacer under the rail).
        Fullscreen: phone = top-right on image; md+ = centered on hover/focus.
      */}
      <div className="flex items-stretch gap-2.5 sm:gap-3 md:gap-3.5 lg:gap-4 min-[1300px]:max-[1620px]:gap-[31px] 2xl:gap-[31px]">
        <div className="min-w-0 flex-1 min-[1300px]:max-[1620px]:w-[458px] min-[1300px]:max-[1620px]:max-w-[458px] min-[1300px]:max-[1620px]:flex-none min-[1300px]:max-[1620px]:shrink-0 2xl:w-[458px] 2xl:max-w-[458px] 2xl:flex-none 2xl:shrink-0">
          <div
            className="group relative isolate aspect-[3/5] w-full overflow-hidden rounded-xl bg-jl-gray min-[1300px]:max-[1620px]:aspect-auto min-[1300px]:max-[1620px]:h-[610px] min-[1300px]:max-[1620px]:max-w-[458px] 2xl:aspect-auto 2xl:h-[610px] 2xl:max-w-[458px]"
            onMouseEnter={() => setHoverPulse(true)}
            onMouseLeave={() => setHoverPulse(false)}
          >
            <div
              className={cn(
                "absolute inset-0 transition-[transform] duration-[1300ms] ease-out",
                hoverPulse && "motion-safe:scale-[1.06]",
              )}
            >
              <img
                key={current}
                src={current}
                alt={title}
                loading={selectedIndex === 0 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full select-none object-contain"
              />
            </div>

            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              className={cn(railBtn, "absolute end-3 top-3 z-20 md:hidden")}
              aria-label={t("gallery.enlarge")}
            >
              <Maximize2
                className={galleryIcon}
                strokeWidth={galleryStroke}
                aria-hidden
              />
            </button>

            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              className={cn(
                railBtn,
                "pointer-events-none absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200 md:flex",
                "group-hover:pointer-events-auto group-hover:opacity-100",
                "group-focus-within:pointer-events-auto group-focus-within:opacity-100",
                "focus-visible:pointer-events-auto focus-visible:opacity-100",
              )}
              aria-label={t("gallery.enlarge")}
            >
              <Maximize2
                className={galleryIcon}
                strokeWidth={galleryStroke}
                aria-hidden
              />
            </button>
          </div>
        </div>

        <aside
          className={cn(
            "flex w-12 shrink-0 flex-col py-0.5 sm:w-[52px] md:w-14",
            urls.length > 1 ? "justify-between" : "justify-start gap-2",
          )}
          aria-label={t("gallery.controls")}
        >
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleShare}
              className={railBtn}
              aria-label={t("gallery.share")}
            >
              <Share
                className={galleryIcon}
                strokeWidth={galleryStroke}
                aria-hidden
              />
            </button>
            <button
              type="button"
              onClick={toggleWishlisted}
              className={railBtn}
              aria-label={
                wishlisted ? t("gallery.removeSaved") : t("gallery.saveLater")
              }
              aria-pressed={wishlisted}
            >
              <Heart
                className={galleryIcon}
                strokeWidth={galleryStroke}
                fill={wishlisted ? "currentColor" : "none"}
                aria-hidden
              />
            </button>
          </div>

          {urls.length > 1 ? (
            <div
              className="flex flex-col gap-2 pb-0.5"
              role="group"
              aria-label={t("gallery.carouselNav")}
            >
              <CarouselArrow direction="previous" onClick={() => goto(-1)} />
              <CarouselArrow direction="next" onClick={() => goto(1)} />
            </div>
          ) : null}
        </aside>
      </div>

      {urls.length > 1 ? (
        <div className="flex gap-2.5 sm:gap-3 md:gap-3.5 lg:gap-4 min-[1300px]:max-[1620px]:gap-[31px] 2xl:gap-[31px]">
          <div className="min-w-0 flex-1 min-[1300px]:max-[1620px]:w-[458px] min-[1300px]:max-[1620px]:max-w-[458px] min-[1300px]:max-[1620px]:flex-none min-[1300px]:max-[1620px]:shrink-0 2xl:w-[458px] 2xl:max-w-[458px] 2xl:flex-none 2xl:shrink-0">
            <ThumbnailStrip
              urls={urls}
              selectedIndex={selectedIndex}
              onSelect={onSelect}
            />
          </div>
          <div className="w-12 shrink-0 sm:w-[52px] md:w-14" aria-hidden />
        </div>
      ) : null}

      <Dialog
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        className="relative z-[85]"
      >
        <DialogBackdrop transition className="fixed inset-0 bg-black/85" />
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-6">
          <DialogPanel
            transition
            className="relative w-full max-w-4xl overflow-hidden bg-white px-4 py-12 shadow-2xl outline-none data-[closed]:opacity-0 lg:rounded-sm"
          >
            <button
              type="button"
              aria-label={t("gallery.closeZoom")}
              onClick={() => setZoomOpen(false)}
              className="absolute end-4 top-3 inline-flex text-black"
            >
              <X className="h-7 w-7" strokeWidth={1.75} aria-hidden />
            </button>
            <img
              src={current}
              alt={`${title}${t("gallery.enlargedAltSuffix")}`}
              decoding="async"
              className="mx-auto max-h-[70vh] w-auto object-contain"
            />
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}

type ArrowProps = {
  direction: "previous" | "next";
  onClick: () => void;
};

function CarouselArrow({ direction, onClick }: ArrowProps): JSX.Element {
  const { t } = useLocale();
  const label =
    direction === "previous" ? t("gallery.prevSlide") : t("gallery.nextSlide");

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={cn(railBtn, "pointer-events-auto")}
    >
      {direction === "previous" ? (
        <ChevronLeft className="h-6 w-6" strokeWidth={1.6} aria-hidden />
      ) : (
        <ChevronRight className="h-6 w-6" strokeWidth={1.6} aria-hidden />
      )}
    </button>
  );
}

type ThumbProps = {
  urls: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

function ThumbnailStrip({
  urls,
  selectedIndex,
  onSelect,
}: ThumbProps): JSX.Element | null {
  if (urls.length <= 1) return null;

  return (
    <div className="no-scrollbar overflow-x-auto pb-3">
      <div className="flex gap-2 md:gap-2.5">
        {urls.map((thumb, idx) => {
          const selected = idx === selectedIndex;
          return (
            <button
              type="button"
              key={`${thumb}-${idx}`}
              onClick={() => onSelect(idx)}
              className="group relative h-[84px] w-[66px] shrink-0 overflow-hidden rounded-md bg-jl-gray sm:h-[104px] sm:w-[76px]"
              aria-current={selected}
            >
              <img
                src={thumb}
                alt=""
                decoding="async"
                loading="lazy"
                className="h-full w-full "
              />
              <span
                className={clsx(
                  "pointer-events-none absolute inset-[2px] rounded-md border border-transparent transition-colors group-hover:border-black/55",
                  selected &&
                    "border border-black shadow-[inset_0_0_0_1px_rgba(255,255,255,1)]",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
