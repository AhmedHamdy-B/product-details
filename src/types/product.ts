export type VariationProp = {
  id: string
  name: string
  variation_id: string
  value?: string
}

export type Variation = {
  id: string
  name: string
  product_id: string
  type: string
  props: VariationProp[]
}

export type VariantVariationProp = {
  id: string
  variation: string
  variation_prop: string
  product_variant_id: string
}

export type ProductVariant = {
  id: string
  product_id: string
  price: number
  sale_price: number
  quantity: number
  variation_props: VariantVariationProp[]
}

export type Category = {
  id: string
  name: string
  slug: string
}

export type Product = {
  id: string
  name: string
  price: number
  sale_price: number
  description: string
  slug: string
  thumb: string
  images: string[]
  quantity: number
  track_stock: boolean
  variations: Variation[]
  variants: ProductVariant[]
  categories: Category[]
  /** PDP header “X,XXX Sold”; optional from API — falls back in UI when absent */
  sold_count?: number
  /** Single-line rating beside star; optional from API */
  rating_avg?: number
}
