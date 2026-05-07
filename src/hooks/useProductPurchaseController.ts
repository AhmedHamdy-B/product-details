import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";

import { productKeys } from "../api/product.keys";
import { variationKey } from "../lib/variants";
import type { Product } from "../types/product";
import {
  getProductPrices,
  isVariantSelectionComplete,
  selectVariantForProduct,
} from "../stores/productStore";
import { useCartStore } from "../stores/cartStore";
import type { MessageKey } from "../i18n/messages";

type Translate = (key: MessageKey) => string;

type SelectionUpdater = (variationType: string, value: string) => void;

export function useProductPurchaseController(
  product: Product,
  t: Translate,
  selectedVariations: Record<string, string>,
  setVariation: SelectionUpdater,
) {
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { addLine, openDrawer } = useCartStore(
    useShallow((state) => ({
      addLine: state.addItem,
      openDrawer: state.openDrawer,
    })),
  );

  const selectedVariant = selectVariantForProduct(product, selectedVariations);
  const combosAvailable = isVariantSelectionComplete(
    product,
    selectedVariations,
    selectedVariant,
  );
  const { catalog: catalogue, payable } = getProductPrices(product, selectedVariant);

  const colorKey = variationKey("color");
  const colorVar = product.variations.find((variation) => variationKey(variation.name) === colorKey);

  // Prefer color swatch media for cart preview so the drawer reflects the chosen variant;
  // fallback to product thumb for products without color media.
  const heroImageSelection = (): string => {
    const selectedColour = selectedVariations[colorKey];
    const match = colorVar?.props.find((prop) => prop.name === selectedColour);
    if (match?.value) return match.value;
    return product.thumb;
  };

  const clearValidationAndSetVariation = (variationType: string, value: string) => {
    setValidationMessage(null);
    setVariation(variationType, value);
  };

  const handleAddToCart = () => {
    // Validation order matters:
    // 1) block incomplete option selection first
    // 2) then apply stock checks for the resolved variant.
    if (!combosAvailable || !selectedVariant) {
      setValidationMessage(t("pdp.validationIncomplete"));
      return;
    }

    const stockIssues = product.track_stock && (selectedVariant.quantity ?? 0) <= 0;
    if (stockIssues) {
      setValidationMessage(t("pdp.validationRestock"));
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
      // Persist the payable unit price (after discount), not catalog price.
      unitPrice: payable,
      quantity: 1,
    });
    // Keep product query observers in sync after local cart mutations.
    void queryClient.invalidateQueries({ queryKey: productKeys.detail(product.slug) });
  };

  return {
    selectedVariant,
    catalogue,
    payable,
    validationMessage,
    clearValidationAndSetVariation,
    handleAddToCart,
    openDrawer,
  };
}
