import { useEffect, useState, type JSX } from "react";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import johnLewisLogo from "../assets/john_lewis.png";
import { cn } from "../lib/cn";
import { useCartStore } from "../stores/cartStore";
import { useFavoritesStore } from "../stores/favoritesStore";
import { Breadcrumbs } from "./Breadcrumbs";
import { PageContainer } from "./PageContainer";

const utilIcon = "h-[22px] w-[22px] shrink-0 text-current";
const utilStroke = 1.5;

const navClusters = [
  { heading: "Shop", links: ["Women", "Men", "Kids", "Home"] },
  {
    heading: "Information",
    links: ["Delivery", "Returns", "Contact", "Track order"],
  },
  {
    heading: "Company",
    links: ["About", "Careers", "Press", "Sustainability"],
  },
];

const utilityLabelClass =
  "font-sans text-[13px] font-medium leading-none tracking-normal text-black antialiased";

function formatClockHM(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function useClockHM(): string {
  const [label, setLabel] = useState(() => formatClockHM(new Date()));
  useEffect(() => {
    const tick = () => setLabel(formatClockHM(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return label;
}

/** JL retail row — utilities use Lucide outline icons at ~22px */
function HeaderUtilities({ className }: { className?: string }): JSX.Element {
  const basketCount = useCartStore((state) =>
    state.lines.reduce((sum, line) => sum + line.quantity, 0),
  );
  const openBasket = useCartStore((state) => state.openDrawer);
  const favCount = useFavoritesStore((state) => state.items.length);
  const openSaved = useFavoritesStore((state) => state.openDrawer);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-end gap-y-2 gap-x-2",
        className,
      )}
    >
      <button
        type="button"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-black transition hover:bg-neutral-100/80"
        aria-label="Search"
      >
        <Search className={utilIcon} strokeWidth={utilStroke} aria-hidden />
      </button>

      <button
        type="button"
        className="inline-flex h-10 shrink-0 items-center gap-[5px] rounded-sm pl-1 pr-2 text-black transition hover:bg-neutral-100/80"
        aria-label="Categories"
        aria-haspopup="true"
      >
        <span className={utilityLabelClass}>Categories</span>
        <ChevronDown
          className="h-[10px] w-[10px] shrink-0"
          strokeWidth={1.35}
          aria-hidden
        />
      </button>

      <button
        type="button"
        className="inline-flex h-10 shrink-0 items-center gap-[7px] rounded-sm px-2 text-black transition hover:bg-neutral-100/80"
        aria-label="Sign in"
      >
        <User className={utilIcon} strokeWidth={utilStroke} aria-hidden />
        <span className={utilityLabelClass}>Sign in</span>
      </button>

      <button
        type="button"
        onClick={() => openSaved()}
        className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-black transition hover:bg-neutral-100/80"
        aria-label={`Saved items${favCount > 0 ? `, ${favCount}` : ""}`}
      >
        <Heart
          className={utilIcon}
          strokeWidth={utilStroke}
          fill={favCount > 0 ? "currentColor" : "none"}
          aria-hidden
        />
        {favCount > 0 && (
          <span className="absolute -right-[2px] -top-[3px] flex h-4 min-w-[16px] items-center justify-center rounded-full bg-black px-[5px] text-[9px] font-semibold leading-none text-white">
            {Math.min(favCount, 99)}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => openBasket()}
        className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-black transition hover:bg-neutral-100/80"
        aria-label="Basket"
      >
        <ShoppingBag
          className={utilIcon}
          strokeWidth={utilStroke}
          aria-hidden
        />
        {basketCount > 0 && (
          <span className="absolute -right-[2px] -top-[3px] flex h-4 min-w-[16px] items-center justify-center rounded-full bg-black px-[5px] text-[9px] font-semibold leading-none text-white">
            {Math.min(basketCount, 99)}
          </span>
        )}
      </button>
    </div>
  );
}

function LogoLockup({ compact }: { compact?: boolean }): JSX.Element {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center text-left",
        compact && "min-w-0 max-w-[min(100%,200px)]",
      )}
    >
      <img
        src={johnLewisLogo}
        alt="John Lewis & Partners"
        width={320}
        height={80}
        decoding="async"
        className={cn(
          "block w-auto max-w-full object-contain object-left",
          compact ? "h-[30px]" : "h-[38px] xl:h-[40px]",
        )}
      />
    </div>
  );
}

type SiteHeaderProps = {
  crumbs?: string[];
  className?: string;
};

export function SiteHeader({
  crumbs = [],
  className,
}: SiteHeaderProps): JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const promoClock = useClockHM();

  return (
    <header className={cn("sticky top-0 z-40 bg-white", className)}>
      <div className="bg-black text-white">
        <PageContainer className="py-2.5">
          {/* Figma: one centred row — promo copy + pill timer (no side-aligned locale) */}
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-center sm:gap-x-3">
            <p className="max-w-[min(100%,36rem)] text-[11px] font-medium leading-snug tracking-[0.01em] text-white sm:max-w-none sm:text-xs md:text-[13px]">
              New season coming! Discount 10% for all product! Checkout Now!
            </p>
            <span
              className="inline-flex shrink-0 items-center rounded-full bg-zinc-800 px-2.5 py-0.5 text-[11px] font-medium tabular-nums tracking-normal text-white shadow-inner ring-1 ring-white/10 sm:px-3 sm:text-xs"
              aria-label={`Local time ${promoClock}`}
            >
              {promoClock}
            </span>
          </div>
        </PageContainer>
      </div>

      <div className="bg-white">
        {/*
          Dashed rules span the PageContainer content width (full bleed with responsive gutters). Top rule only under promo; no bottom rule.
        */}
        <PageContainer className="border-t border-dashed border-[#d4d4d4]">
          <div className="py-5 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:py-[22px]">
            {/* Desktop — logo left, utilities right */}
            <div className="hidden lg:flex lg:min-h-[52px] lg:w-full lg:items-center lg:justify-between">
              <LogoLockup />
              <HeaderUtilities />
            </div>

            {/* Tablet / mobile */}
            <div className="flex flex-col gap-3 lg:hidden">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <button
                    type="button"
                    className="-ml-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-black hover:bg-neutral-100"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    onClick={() => setMobileOpen((open) => !open)}
                  >
                    {mobileOpen ? (
                      <X className="h-5 w-5" strokeWidth={1.65} aria-hidden />
                    ) : (
                      <Menu
                        className="h-5 w-5"
                        strokeWidth={1.65}
                        aria-hidden
                      />
                    )}
                  </button>
                  <LogoLockup compact />
                </div>
                <div className="hidden shrink-0 sm:block">
                  <HeaderUtilities />
                </div>
              </div>
              <div className="flex justify-center sm:hidden">
                <HeaderUtilities />
              </div>
            </div>
          </div>

          {crumbs.length > 0 && (
            <div className="border-t border-dashed border-[#d4d4d4] py-[18px] lg:py-[22px]">
              <Breadcrumbs crumbs={crumbs} />
            </div>
          )}
        </PageContainer>
      </div>

      {mobileOpen && (
        <div className="fixed inset-x-0 top-0 z-50 max-h-[100dvh] overflow-y-auto border-b border-black/10 bg-white pb-8 pt-[72px] shadow-lg lg:hidden">
          <PageContainer>
            <nav className="space-y-5 text-[14px]" aria-label="Primary">
              <div className="space-y-1 border-b border-neutral-200 pb-4">
                {[
                  "Women",
                  "Beauty",
                  "Home & Garden",
                  "Baby & Child",
                  "Men",
                  "Offers",
                ].map((entry) => (
                  <button
                    key={entry}
                    type="button"
                    className="flex w-full items-center justify-between py-3 text-[15px] font-semibold"
                  >
                    {entry}
                    <span aria-hidden>›</span>
                  </button>
                ))}
              </div>
              <div className="grid gap-5">
                {navClusters.map((cluster) => (
                  <div key={cluster.heading}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-neutral-600">
                      {cluster.heading}
                    </p>
                    <div className="mt-3 space-y-2">
                      {cluster.links.map((link) => (
                        <button
                          key={link}
                          type="button"
                          className="block py-2 text-neutral-900"
                        >
                          {link}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mt-2 w-full border border-black py-3 text-sm font-semibold"
              >
                Sign in · Register
              </button>
            </nav>
          </PageContainer>
        </div>
      )}
    </header>
  );
}
