import type { JSX } from "react";

import { popularShowcase, relatedShowcase } from "../data/mocks";
import { ProductRails } from "./ProductRails";
import { ReviewsSection } from "./ReviewsSection";
import { Reveal } from "./Reveal";

type Props = {
  relatedHeadline: string;
  popularHeadline: string;
};

export function ProductDetailBelowFold({
  relatedHeadline,
  popularHeadline,
}: Props): JSX.Element {
  return (
    <>
      <Reveal>
        <ProductRails
          variant="related"
          headline={relatedHeadline}
          items={relatedShowcase}
          anchorId="related"
        />
      </Reveal>

      <Reveal>
        <ReviewsSection />
      </Reveal>

      <Reveal>
        <ProductRails
          variant="related"
          popularWeek
          headline={popularHeadline}
          items={popularShowcase}
          anchorId="popular-week"
        />
      </Reveal>
    </>
  );
}
