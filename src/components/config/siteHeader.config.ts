import type { MessageKey } from "../../i18n/messages";

export const DESKTOP_MOBILE_ENTRIES: MessageKey[] = [
  "header.link.womenNav",
  "header.link.beauty",
  "header.link.homeGarden",
  "header.link.babyChild",
  "header.link.menNav",
  "header.link.offers",
];

export type HeaderNavCluster = {
  headingKey: MessageKey;
  links: readonly MessageKey[];
};

export const navClusters: ReadonlyArray<HeaderNavCluster> = [
  {
    headingKey: "header.nav.shopHeading",
    links: [
      "headerCLUSTER.shop.links.women",
      "headerCLUSTER.shop.links.men",
      "headerCLUSTER.shop.links.kids",
      "headerCLUSTER.shop.links.home",
    ],
  },
  {
    headingKey: "header.nav.informationHeading",
    links: [
      "header.footerLink.delivery",
      "header.footerLink.returns",
      "header.footerLink.contact",
      "header.footerLink.trackOrder",
    ],
  },
  {
    headingKey: "header.nav.companyHeading",
    links: [
      "header.footerLink.about",
      "header.footerLink.careers",
      "header.footerLink.press",
      "header.footerLink.sustainability",
    ],
  },
] as const;
