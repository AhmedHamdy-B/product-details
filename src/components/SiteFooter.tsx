import type { JSX } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";

import johnLewisLogo from "../assets/john_lewis.png";
import { cn } from "../lib/cn";
import { useLocale } from "../i18n/useLocale";
import { PageContainer } from "./PageContainer";
import { footerColumns } from "./config/siteFooter.config";
import {
  currencyButtonClass,
  footerBottomClass,
  footerGridClass,
  footerLinkButtonClass,
  langMenuButtonClass,
  languageMenuItemsClass,
  newsletterRowClass,
  socialCircleClass,
} from "./variants/siteFooter.variants";

function NewsletterField(): JSX.Element {
  const { t } = useLocale();
  return (
    <div className="w-full max-w-full font-sans md:max-w-[80%] xl:max-w-[45.5%]">
      <form
        aria-label={t("footer.newsletterAria")}
        className="w-full"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="jl-footer-email" className="sr-only">
          {t("footer.newsletterLabel")}
        </label>
        <div className={newsletterRowClass}>
          <input
            id="jl-footer-email"
            data-jl-newsletter-input=""
            name="jl-footer-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t("footer.newsletterPlaceholder")}
            className="footer-newsletter-input"
          />
          <button
            type="submit"
            aria-label={t("footer.newsletterSubmit")}
            className="footer-newsletter-submit"
          >
            <FooterNewsletterArrow />
          </button>
        </div>
      </form>
    </div>
  );
}

function FooterNewsletterArrow(): JSX.Element {
  return (
    <ChevronRight
      size={20}
      strokeWidth={1.8}
      className="shrink-0 rtl:rotate-180"
      aria-hidden
    />
  );
}

/** Compact US stripes + canton for English option */
function USFlagSvg({ className }: { className?: string }): JSX.Element {
  const w = 30;
  const h = 20;
  return (
    <svg className={className} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <rect width={w} height={h} fill="#B22234" />
      <path
        fill="#fff"
        d="M0 2 h30 V4 H0z M0 6 h30 V8 H0z M0 10 h30 V12 H0z M0 14 h30 V16 H0z M0 18 h30 V20 H0z"
      />
      <rect width={12} height={11} fill="#3C3B6E" x={0} y={0} />
    </svg>
  );
}

/** Egypt stripes — distinguishes Arabic locale in the picker */
function EgyptFlagSvg({ className }: { className?: string }): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 90 60" aria-hidden>
      <rect fill="#CE1126" width="90" height="20" />
      <rect fill="#FFF" width="90" height="20" y="20" />
      <rect fill="#000" width="90" height="20" y="40" />
    </svg>
  );
}

function LanguageMenu(): JSX.Element {
  const { locale, setLocale, t } = useLocale();
  const currentLabel =
    locale === "ar"
      ? t("footer.localeArabicShort")
      : t("footer.localeEnglishShort");

  return (
    <Menu as="div" className="relative inline-block text-start">
      <MenuButton
        type="button"
        aria-label={t("footer.langMenu")}
        className={langMenuButtonClass}
      >
        {locale === "ar" ? (
          <EgyptFlagSvg className="h-[14px] w-[18px] shrink-0 rounded-[2px] ring-[0.5px] ring-black/12" />
        ) : (
          <USFlagSvg className="h-[14px] w-[18px] shrink-0 rounded-[2px] ring-[0.5px] ring-black/12" />
        )}
        <span className="font-medium text-[14px]">{currentLabel}</span>
        <ChevronDownTiny />
      </MenuButton>

      <MenuItems
        transition
        modal={false}
        anchor="bottom end"
        className={languageMenuItemsClass}
      >
        <MenuItem>
          {({ close, focus }) => (
            <button
              type="button"
              onClick={() => {
                setLocale("en");
                close();
              }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-start text-[12px]",
                locale === "en"
                  ? "bg-neutral-100 font-semibold text-black"
                  : "text-neutral-800",
                focus && "outline-none bg-neutral-50",
              )}
            >
              <USFlagSvg className="h-[11px] w-[17px] shrink-0 rounded-sm ring-[0.5px] ring-black/10" />
              {t("footer.langEnglish")}
            </button>
          )}
        </MenuItem>
        <MenuItem>
          {({ close, focus }) => (
            <button
              type="button"
              onClick={() => {
                setLocale("ar");
                close();
              }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-start text-[12px]",
                locale === "ar"
                  ? "bg-neutral-100 font-semibold text-black"
                  : "text-neutral-800",
                focus && "outline-none bg-neutral-50",
              )}
            >
              <EgyptFlagSvg className="h-[11px] w-[17px] shrink-0 rounded-sm ring-[0.5px] ring-black/10" />
              {t("footer.langArabic")}
            </button>
          )}
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}

type SiteFooterProps = {
  className?: string;
};

export function SiteFooter({ className }: SiteFooterProps): JSX.Element {
  const { locale, t } = useLocale();
  const currentYear = new Date().getFullYear();

  /** © line: keep brand English; localize surrounding word order lightly */
  const copyrightLine =
    locale === "ar"
      ? `حقوق النشر © ${t("footer.copyrightBrand")} 2001 – ${currentYear}`
      : `© ${t("footer.copyrightBrand")}\u00a02001\u00a0–\u00a0${currentYear}`;

  return (
    <footer className={cn("bg-[#f3f3f3] font-sans text-black", className)}>
      <PageContainer className="pb-10 pt-10 md:pb-11 md:pt-11 xl:pb-12 xl:pt-12">
        <div className={footerGridClass}>
          <div className="min-w-0 space-y-[22px] lg:col-span-6">
            <div className="flex items-center">
              <img
                src={johnLewisLogo}
                alt="John Lewis & Partners"
                width={170}
                height={32.03}
                decoding="async"
                className="block h-[32.03px] w-[170px] max-w-full object-contain object-start"
              />
            </div>

            <NewsletterField />

            <div className="flex flex-wrap gap-2.5">
              <SocialCircle label="Facebook" href="#">
                <SiFacebook size={16} className="shrink-0" aria-hidden />
              </SocialCircle>
              <SocialCircle label="Instagram" href="#">
                <SiInstagram size={16} className="shrink-0" aria-hidden />
              </SocialCircle>
              <SocialCircle label="TikTok" href="#">
                <SiTiktok size={16} className="shrink-0" aria-hidden />
              </SocialCircle>
              <SocialCircle label="YouTube" href="#">
                <SiYoutube size={16} className="shrink-0" aria-hidden />
              </SocialCircle>
            </div>
          </div>

          {footerColumns.map((column) => (
            <nav
              key={column.headingKey}
              aria-label={t(column.headingKey)}
              className="min-w-0 lg:col-span-2"
            >
              <FooterLinkColumn
                heading={t(column.headingKey)}
                links={column.links.map((lk) => t(lk))}
              />
            </nav>
          ))}
        </div>

        <div className={footerBottomClass}>
          <p className="order-2 text-[14px] font-normal leading-[22px] tracking-[0] text-[#3E3E59] sm:order-1">
            {copyrightLine}
          </p>

          <div className="order-1 flex flex-wrap items-center gap-6 sm:order-2 sm:justify-end sm:gap-8">
            <LanguageMenu />
            <button
              type="button"
              className={currencyButtonClass}
              disabled
              aria-disabled
            >
              <span>{t("footer.currencyUsd")}</span>
              <ChevronDownTiny />
            </button>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}

function FooterLinkColumn({
  heading,
  links,
}: {
  heading: string;
  links: readonly string[];
}): JSX.Element {
  return (
    <div>
      <p className="text-[14px] font-semibold leading-tight text-black">
        {heading}
      </p>
      <ul className="mt-3 space-y-2 text-[14px] font-normal leading-normal text-black">
        {links.map((label) => (
          <li key={label}>
            <button
              type="button"
              className={footerLinkButtonClass}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialCircle({
  children,
  label,
  href,
}: {
  children: JSX.Element;
  label: string;
  href: string;
}): JSX.Element {
  return (
    <a
      href={href}
      aria-label={label}
      className={socialCircleClass}
    >
      <span className="flex items-center justify-center">{children}</span>
    </a>
  );
}

function ChevronDownTiny(): JSX.Element {
  return (
    <ChevronDown
      width={18}
      height={18}
      strokeWidth={1.35}
      className="shrink-0"
      aria-hidden
    />
  );
}
