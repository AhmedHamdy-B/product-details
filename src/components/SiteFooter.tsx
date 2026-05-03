import type { JSX } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";

import johnLewisLogo from "../assets/john_lewis.png";
import { cn } from "../lib/cn";
import { PageContainer } from "./PageContainer";

const linkColumns = [
  {
    heading: "Shop",
    links: ["My account", "Login", "Wishlist", "Cart"],
  },
  {
    heading: "Information",
    links: [
      "Shipping Policy",
      "Returns & Refunds",
      "Cookies Policy",
      "Frequently asked",
    ],
  },
  {
    heading: "Company",
    links: ["About us", "Privacy Policy", "Terms & Conditions", "Contact Us"],
  },
] as const;

/** One compound strip: underline belongs to wrapper; zero gap; no browser focus box on the input */
function NewsletterField(): JSX.Element {
  return (
    <div className="max-w-[min(100%,_420px)] font-sans">
      <form
        aria-label="Newsletter signup"
        className="w-full"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="jl-footer-email" className="sr-only">
          Email address — get latest offers to your inbox
        </label>
        <div className="flex w-full flex-nowrap items-end gap-0 border-b border-solid border-neutral-950 pb-0 transition-colors duration-150 ease-out focus-within:border-black">
          <input
            id="jl-footer-email"
            data-jl-newsletter-input=""
            name="jl-footer-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Get latest offers to your inbox"
            className="
              min-h-0 min-w-0 flex-1
              rounded-none bg-transparent px-0 !pb-0 pt-[7px] text-[13px] font-normal !leading-[1.3]
              tracking-[0.01em] text-neutral-900 antialiased caret-neutral-950
              [appearance:textfield]
              [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:appearance-none
              border-0
              outline-none outline-0 [outline-offset:0px]
              ring-0 ring-offset-0
              placeholder:text-[#707070]
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
            aria-label="Submit newsletter signup"
            className="
              ml-1 inline-flex h-[36px] w-[52px] shrink-0 cursor-pointer
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
    <ArrowRight size={12} strokeWidth={1.35} className="shrink-0" aria-hidden />
  );
}

type SiteFooterProps = {
  className?: string;
};

export function SiteFooter({ className }: SiteFooterProps): JSX.Element {
  const currentYear = new Date().getFullYear();

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
                className="block h-[36px] w-auto max-w-full object-contain object-left md:h-[40px]"
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

          {linkColumns.map((column) => (
            <nav
              key={column.heading}
              aria-label={column.heading}
              className="min-w-0 lg:col-span-2"
            >
              <FooterLinkColumn heading={column.heading} links={column.links} />
            </nav>
          ))}
        </div>

        <div className="mt-10 border-t border-dashed border-[#c7c7c7] pt-10 flex flex-col gap-5 sm:mt-[42px] sm:pt-[42px] sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:gap-8">
          <p className="order-2 text-[12px] font-normal leading-[1.5] text-black sm:order-1">
            © John Lewis plc&nbsp;2001&nbsp;–&nbsp;{currentYear}
          </p>

          <div className="order-1 flex flex-wrap items-center gap-6 sm:order-2 sm:justify-end sm:gap-8">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 px-2 text-[12px] font-medium text-black transition hover:underline hover:underline-offset-4"
            >
              <USFlagSvg className="h-[13px] w-[20px] shrink-0 rounded-[2px] ring-[0.5px] ring-black/12" />
              <span>English</span>
              <ChevronDownTiny />
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-1 px-2 text-[12px] font-medium text-black transition hover:underline hover:underline-offset-4"
            >
              <span>USD</span>
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
              className="w-full py-px text-left text-black transition hover:opacity-70 hover:underline hover:underline-offset-[5px]"
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

/** Compact US stripes + canton for footer locale control (matches Figma ref) */
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
