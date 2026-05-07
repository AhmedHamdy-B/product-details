import type { MessageKey } from "../../i18n/messages";

export type FooterColumn = {
  headingKey: MessageKey;
  links: ReadonlyArray<MessageKey>;
};

export const footerColumns: ReadonlyArray<FooterColumn> = [
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
