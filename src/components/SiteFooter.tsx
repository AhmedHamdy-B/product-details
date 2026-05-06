import type { JSX } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";

import johnLewisLogo from "../assets/john_lewis.png";
import { cn } from "../lib/cn";
import { useLocale } from "../i18n/useLocale";
import type { MessageKey } from "../i18n/messages";
import { PageContainer } from "./PageContainer";

const footerColumns: ReadonlyArray<{
  headingKey: MessageKey;
  links: ReadonlyArray<MessageKey>;
}> = [
  {
    headingKey: "footer.col.shop",
    links: [
      "footer.link.myAccount",
      "footer.link.login",
      "footer.link.wishlist",
      "footer.link.cart",
    ],
  },
  {
    headingKey: "footer.col.information",
    links: [
      "footer.link.shippingPolicy",
      "footer.link.returnsRefunds",
      "footer.link.cookiesPolicy",
      "footer.link.frequentlyAsked",
    ],
  },
  {
    headingKey: "footer.col.company",
    links: [
      "footer.link.aboutUs",
      "footer.link.privacyPolicy",
      "footer.link.termsConditions",
      "footer.link.contactUs",
    ],
  },
] as const;

function NewsletterField(): JSX.Element {
  const { t } = useLocale();
  return (
    <div className="w-full max-w-full font-sans md:max-w-[80%] xl:max-w-[55%]">
      <form
        aria-label={t("footer.newsletterAria")}
        className="w-full"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="jl-footer-email" className="sr-only">
          {t("footer.newsletterLabel")}
        </label>
        <div className="flex w-full flex-nowrap items-center gap-0 border-b border-solid border-neutral-950 pb-0 transition-colors duration-150 ease-out focus-within:border-black">
          <input
            id="jl-footer-email"
            data-jl-newsletter-input=""
            name="jl-footer-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t("footer.newsletterPlaceholder")}
            className="
              min-h-0 min-w-0 flex-1
              rounded-none bg-transparent px-0 !pb-0 pt-[7px] text-[13px] font-normal !leading-[1.3]
              tracking-[0.01em] text-neutral-900 antialiased caret-neutral-950
              [appearance:textfield]
              [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:appearance-none
              border-0
              outline-none outline-0 [outline-offset:0px]
              ring-0 ring-offset-0
              placeholder:text-[#7A7A7A]
              shadow-none
              shadow-[inset_0_0_0_9999px_transparent]
              focus:border-0
              focus:!shadow-none focus:!ring-0 focus:!ring-offset-0
              focus:!outline-none focus:!outline-offset-0 focus:[outline-offset:0px]
              focus-visible:!shadow-none focus-visible:!ring-0 focus-visible:!outline-none
              [&:-webkit-autofill]:shadow-[inset_0_0_0_32px_rgb(243,243,243)]
              [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_32px_rgb(243,243,243)]
            "
          />
          <button
            type="submit"
            aria-label={t("footer.newsletterSubmit")}
            className="
              ms-1 inline-flex h-[36px] w-[52px] shrink-0 cursor-pointer
              items-center justify-center rounded-xl
              bg-black text-white outline-none ring-0
              transition-colors hover:bg-neutral-900
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950
            "
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
    <ArrowRight
      size={12}
      strokeWidth={1.35}
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
        className="inline-flex h-10 items-center gap-2 px-2 text-[12px] font-medium text-black transition hover:underline hover:underline-offset-4"
      >
        {locale === "ar" ? (
          <EgyptFlagSvg className="h-[13px] w-[20px] shrink-0 rounded-[2px] ring-[0.5px] ring-black/12" />
        ) : (
          <USFlagSvg className="h-[13px] w-[20px] shrink-0 rounded-[2px] ring-[0.5px] ring-black/12" />
        )}
        <span>{currentLabel}</span>
        <ChevronDownTiny />
      </MenuButton>

      <MenuItems
        transition
        modal={false}
        anchor="bottom end"
        className={cn(
          "z-[100] mt-1 w-44 rounded-md border border-neutral-200 bg-white py-1 shadow-lg [--anchor-gap:4px]",
          "outline-none ring-1 ring-black/5 transition [--anchor-gap:4px]",
          "data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:duration-150 data-[enter]:duration-150",
        )}
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
    <footer
      className={cn(
        "border-t border-[#d2d2d2] bg-[#f3f3f3] font-sans text-black",
        className,
      )}
    >
      <PageContainer className="pb-10 pt-10 md:pb-11 md:pt-11 xl:pb-12 xl:pt-12">
        <div className="grid grid-cols-1 gap-x-10 gap-y-11 md:gap-x-12 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-12 xl:gap-x-10">
          <div className="min-w-0 space-y-[22px] lg:col-span-6">
            <div className="flex items-center">
              <img
                src={johnLewisLogo}
                alt="John Lewis & Partners"
                width={320}
                height={80}
                decoding="async"
                className="block h-[36px] w-auto max-w-full object-contain object-start md:h-[40px]"
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

        <div className="dash-top dash-color-c7 mt-10 flex flex-col gap-5 pt-10 sm:mt-[42px] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pt-[42px] md:gap-8">
          <p className="order-2 text-[12px] font-normal leading-[1.5] text-black sm:order-1">
            {copyrightLine}
          </p>

          <div className="order-1 flex flex-wrap items-center gap-6 sm:order-2 sm:justify-end sm:gap-8">
            <LanguageMenu />
            <button
              type="button"
              className="inline-flex h-10 items-center gap-1 px-2 text-[12px] font-medium text-black opacity-85 transition hover:underline hover:underline-offset-4"
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
      <p className="text-[13px] font-bold leading-tight text-black">
        {heading}
      </p>
      <ul className="mt-3 space-y-2 text-[13px] font-normal leading-normal text-black">
        {links.map((label) => (
          <li key={label}>
            <button
              type="button"
              className="w-full py-px text-start text-black transition hover:opacity-70 hover:underline hover:underline-offset-[5px]"
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
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4e4e4] bg-white text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition hover:border-[#bdbdbd] hover:shadow"
    >
      <span className="flex items-center justify-center">{children}</span>
    </a>
  );
}

function ChevronDownTiny(): JSX.Element {
  return (
    <ChevronDown
      width={9}
      height={9}
      strokeWidth={1.35}
      className="shrink-0"
      aria-hidden
    />
  );
}
