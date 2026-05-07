import { useEffect, useState, type JSX } from "react";
import { createPortal } from "react-dom";
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
import { useLocale } from "../i18n/useLocale";
import { cn } from "../lib/cn";
import { useCartStore } from "../stores/cartStore";
import { useFavoritesStore } from "../stores/favoritesStore";
import {
  selectCartItemsCount,
  selectFavoritesCount,
} from "../stores/selectors";
import { Breadcrumbs } from "./Breadcrumbs";
import {
  DESKTOP_MOBILE_ENTRIES,
  navClusters,
} from "./config/siteHeader.config";
import { PageContainer } from "./PageContainer";
import { IconButton } from "./primitives/IconButton";
import { useShallow } from "zustand/react/shallow";
import {
  badgeClass,
  mobileMenuPanelClass,
  promoClockClass,
  promoTextClass,
  utilIcon,
  utilityLabelClass,
  utilityWideButtonClass,
} from "./variants/siteHeader.variants";

const utilStroke = 1.5;

function formatClockHM(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function useClockHM(locale: "en" | "ar"): string {
  const [label, setLabel] = useState(() => formatClockHM(new Date()));
  useEffect(() => {
    const tick = () => setLabel(formatClockHM(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [locale]);
  return label;
}

function HeaderUtilities({ className }: { className?: string }): JSX.Element {
  const { t } = useLocale();
  const { basketCount, openBasket } = useCartStore(
    useShallow((state) => ({
      basketCount: selectCartItemsCount(state),
      openBasket: state.openDrawer,
    })),
  );
  const { favCount, openSaved } = useFavoritesStore(
    useShallow((state) => ({
      favCount: selectFavoritesCount(state),
      openSaved: state.openDrawer,
    })),
  );

  const favLabel =
    favCount > 0
      ? `${t("header.savedItems")}, ${favCount}`
      : `${t("header.savedItems")}`;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-end gap-x-2 gap-y-2",
        className,
      )}
    >
      <IconButton type="button" aria-label={t("header.search")}>
        <Search className={utilIcon} strokeWidth={utilStroke} aria-hidden />
      </IconButton>

      <button
        type="button"
        className={cn(utilityWideButtonClass, "gap-[5px] ps-1 pe-2")}
        aria-label={t("header.categories")}
        aria-haspopup="true"
      >
        <span className={utilityLabelClass}>{t("header.categories")}</span>
        <ChevronDown
          className="h-[20px] w-[20px] shrink-0 text-black"
          strokeWidth={1.35}
          aria-hidden
        />
      </button>

      <button
        type="button"
        className={cn(utilityWideButtonClass, "gap-[7px] px-2")}
        aria-label={t("header.signIn")}
      >
        <User className={utilIcon} strokeWidth={utilStroke} aria-hidden />
        <span className={utilityLabelClass}>{t("header.signIn")}</span>
      </button>

      <IconButton
        type="button"
        onClick={() => openSaved()}
        className="relative"
        aria-label={favLabel}
      >
        <Heart
          className={utilIcon}
          strokeWidth={utilStroke}
          fill={favCount > 0 ? "currentColor" : "none"}
          aria-hidden
        />
        {favCount > 0 && (
          <span className={badgeClass}>{Math.min(favCount, 99)}</span>
        )}
      </IconButton>

      <IconButton
        type="button"
        onClick={() => openBasket()}
        className="relative"
        aria-label={
          basketCount > 0
            ? `${t("header.basket")}, ${basketCount}`
            : t("header.basket")
        }
      >
        <ShoppingBag
          className={utilIcon}
          strokeWidth={utilStroke}
          aria-hidden
        />
        {basketCount > 0 && (
          <span className={badgeClass}>{Math.min(basketCount, 99)}</span>
        )}
      </IconButton>
    </div>
  );
}

function MobileHeaderActions({
  mobileOpen,
  onToggleMenu,
}: {
  mobileOpen: boolean;
  onToggleMenu: () => void;
}): JSX.Element {
  const { t } = useLocale();
  const { basketCount, openBasket } = useCartStore(
    useShallow((state) => ({
      basketCount: selectCartItemsCount(state),
      openBasket: state.openDrawer,
    })),
  );

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <IconButton type="button" aria-label={t("header.search")}>
        <Search className={utilIcon} strokeWidth={utilStroke} aria-hidden />
      </IconButton>

      <IconButton
        type="button"
        onClick={() => openBasket()}
        className="relative"
        aria-label={
          basketCount > 0
            ? `${t("header.basket")}, ${basketCount}`
            : t("header.basket")
        }
      >
        <ShoppingBag
          className={utilIcon}
          strokeWidth={utilStroke}
          aria-hidden
        />
        {basketCount > 0 && (
          <span className={badgeClass}>{Math.min(basketCount, 99)}</span>
        )}
      </IconButton>

      <IconButton
        type="button"
        tone="subtle"
        aria-label={mobileOpen ? t("header.menuClose") : t("header.menuOpen")}
        onClick={onToggleMenu}
      >
        {mobileOpen ? (
          <X className="h-5 w-5" strokeWidth={1.65} aria-hidden />
        ) : (
          <Menu className="h-5 w-5" strokeWidth={1.65} aria-hidden />
        )}
      </IconButton>
    </div>
  );
}

function LogoLockup({ compact }: { compact?: boolean }): JSX.Element {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center text-start",
        compact && "min-w-0 max-w-[min(100%,200px)]",
      )}
    >
      <img
        src={johnLewisLogo}
        alt="John Lewis & Partners"
        width={170}
        height={32.03}
        decoding="async"
        className={cn(
          "block max-w-full object-contain object-start",
          compact ? "h-[30px] w-auto" : "h-[32.03px] w-[170px]",
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
  const { locale, t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const promoClock = useClockHM(locale);
  const promoText = t("header.promo");
  const promoSplitAfterTenPercent = promoText.split("10%");
  const canSplitAfterTenPercent = promoSplitAfterTenPercent.length === 2;
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const mobileMenuOverlay =
    mobileOpen && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[260] lg:hidden">
            <button
              type="button"
              aria-label={t("header.menuClose")}
              className="absolute inset-0 z-[260] bg-black/35"
              onClick={() => setMobileOpen(false)}
            />
            <aside className={mobileMenuPanelClass}>
              <div className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-3">
                <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-neutral-800">
                  {t("header.mobilePrimaryNav")}
                </p>
                <IconButton
                  type="button"
                  tone="subtle"
                  aria-label={t("header.menuClose")}
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" strokeWidth={1.65} aria-hidden />
                </IconButton>
              </div>
              <nav
                className="space-y-5 text-[14px]"
                aria-label={t("header.mobilePrimaryNav")}
              >
                <div className="space-y-1 border-b border-neutral-200 pb-4">
                  {DESKTOP_MOBILE_ENTRIES.map((key) => (
                    <button
                      key={key}
                      type="button"
                      className="flex w-full items-center justify-between rounded-[10px] px-2 py-3 text-[24px] font-semibold transition hover:bg-neutral-100"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t(key)}
                      <span aria-hidden>›</span>
                    </button>
                  ))}
                </div>
                <div className="grid gap-5">
                  {navClusters.map((cluster) => (
                    <div key={cluster.headingKey}>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-neutral-600">
                        {t(cluster.headingKey)}
                      </p>
                      <div className="mt-3 space-y-2">
                        {cluster.links.map((lk) => (
                          <button
                            key={lk}
                            type="button"
                            className="block rounded-[10px] px-2 py-2 text-neutral-900 transition hover:bg-neutral-100"
                            onClick={() => setMobileOpen(false)}
                          >
                            {t(lk)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-2 w-full rounded-[10px] border border-black py-3 text-sm font-semibold transition hover:bg-neutral-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("header.signInRegister")}
                </button>
              </nav>
            </aside>
          </div>,
          document.body,
        )
      : null;

  return (
    <header className={cn("sticky top-0 z-40 bg-white", className)}>
      <div className="bg-black text-white">
        <PageContainer className="py-3 sm:py-2.5">
          <div className="flex items-end justify-center gap-2 text-start">
            <p className={promoTextClass}>
              {canSplitAfterTenPercent ? (
                <>
                  {promoSplitAfterTenPercent[0]}
                  10%
                  <br className="sm:hidden" />
                  {promoSplitAfterTenPercent[1].trimStart()}
                </>
              ) : (
                promoText
              )}{" "}
              <span
                className={promoClockClass}
                aria-label={`${t("header.localTimeAria")} ${promoClock}`}
              >
                {promoClock}
              </span>
            </p>
          </div>
        </PageContainer>
      </div>

      <div className="bg-white">
        <PageContainer>
          <div className="py-5 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:py-[22px]">
            <div className="hidden lg:flex lg:min-h-[52px] lg:w-full lg:items-center lg:justify-between">
              <LogoLockup />
              <HeaderUtilities />
            </div>

            <div className="flex flex-col gap-3 lg:hidden">
              <div className="flex items-center justify-between gap-3">
                <LogoLockup compact />
                <MobileHeaderActions
                  mobileOpen={mobileOpen}
                  onToggleMenu={() => setMobileOpen((open) => !open)}
                />
              </div>
            </div>
          </div>

          {crumbs.length > 0 && (
            <div className="dash-top dash-color-d4 py-[30px] lg:py-[30px]">
              <Breadcrumbs crumbs={crumbs} />
            </div>
          )}
        </PageContainer>
      </div>

      {mobileMenuOverlay}
    </header>
  );
}
