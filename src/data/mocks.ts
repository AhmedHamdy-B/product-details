export type ShowcaseItem = {
  id: string;
  /** URL slug for cart / favourites; defaults to `related-{id}` in UI when omitted */
  slug?: string;
  brand: string;
  name: string;
  catalogue?: number;
  price: number;
  snippet: string;
  rating: number;
  reviewCount: number;
  /** Shown on Related Product (Figma) row as “1,238 Sold” */
  soldCount?: number;
  image: string;
};

/** Related Product rail — copy + metrics aligned to Figma PDP strip */
export const relatedShowcase: ShowcaseItem[] = [
  {
    id: "r1",
    brand: "Whistle",
    name: "Wide Leg Cropped Jeans, Denim",
    price: 26,
    snippet: "",
    rating: 4.8,
    reviewCount: 0,
    soldCount: 1238,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=620&q=80",
  },
  {
    id: "r2",
    brand: "John Lewis ANYDAY",
    name: "Long Sleeve Utility Shirt, Navy, 6",
    price: 26,
    snippet: "",
    rating: 4.8,
    reviewCount: 0,
    soldCount: 1238,
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=620&q=80",
  },
  {
    id: "r3",
    brand: "John Lewis ANYDAY",
    name: "Stripe Curved Hem Shirt, Blue",
    price: 32,
    snippet: "",
    rating: 4.5,
    reviewCount: 0,
    soldCount: 620,
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=620&q=80",
  },
  {
    id: "r4",
    brand: "John Lewis ANYDAY",
    name: "Denim Overshirt, Mid Wash",
    price: 40,
    snippet: "",
    rating: 4.6,
    reviewCount: 0,
    soldCount: 238,
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=620&q=80",
  },
  {
    id: "r5",
    brand: "John Lewis",
    name: "Linen Blazer, Navy",
    price: 79,
    snippet: "",
    rating: 4.8,
    reviewCount: 0,
    soldCount: 1238,
    image:
      "https://images.unsplash.com/photo-1592878904946-b765fc7c8c9c?auto=format&fit=crop&w=620&q=80",
  },
];

/** PDP “Popular this week” rail — distinct SKUs & imagery from `relatedShowcase`; swap when API adds weekly merchandising. */
export const popularShowcase: ShowcaseItem[] = [
  {
    id: "p1",
    slug: "popular-p1-wool-coat",
    brand: "ARKET",
    name: "Wool Oversized Coat",
    price: 120,
    snippet: "Double-faced wool with notch lapels for relaxed tailoring.",
    rating: 4.8,
    reviewCount: 64,
    soldCount: 512,
    image:
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=620&q=80",
  },
  {
    id: "p2",
    slug: "popular-p2-chore-jacket",
    brand: "Sézane",
    name: "Cotton Twill Chore Jacket",
    price: 95,
    snippet: "Vintage-wash cotton with roomy patch pockets and brass snaps.",
    rating: 4.4,
    reviewCount: 48,
    soldCount: 388,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=620&q=80",
  },
  {
    id: "p3",
    slug: "popular-p3-sneaker",
    brand: "Whistles",
    name: "Leather Lace-Up Sneaker",
    price: 85,
    snippet: "Cushioned footbed concealed inside a slim court profile.",
    rating: 4.5,
    reviewCount: 92,
    soldCount: 721,
    image:
      "https://images.unsplash.com/photo-1514986886522-ebc4f2d6d11f?auto=format&fit=crop&w=620&q=80",
  },
  {
    id: "p4",
    slug: "popular-p4-scarf",
    brand: "John Lewis",
    name: "Cashmere Rib Scarf",
    price: 60,
    snippet: "Spun responsibly with a supple handfeel and tonal fringe.",
    rating: 4.9,
    reviewCount: 31,
    soldCount: 204,
    image:
      "https://images.unsplash.com/photo-1575429198097-0414ec08e3cd?auto=format&fit=crop&w=620&q=80",
  },
  {
    id: "p5",
    slug: "popular-p5-trouser",
    brand: "COS",
    name: "Relaxed Barrel Trouser",
    price: 79,
    snippet: "Architectural silhouette with cropped length and pressed crease.",
    rating: 4.3,
    reviewCount: 57,
    soldCount: 445,
    image:
      "https://images.unsplash.com/photo-1542274382-0866d4d4d5c4?auto=format&fit=crop&w=620&q=80",
  },
];

/** Histogram rows (5 → 1) for reviews summary — counts match Figma-style bar chart */
export type ReviewHistogramRow = { stars: number; count: number };

export const reviewHistogram: readonly ReviewHistogramRow[] = [
  { stars: 5, count: 2823 },
  { stars: 4, count: 618 },
  { stars: 3, count: 152 },
  { stars: 2, count: 48 },
  { stars: 1, count: 24 },
] as const;

export const reviewInsights = {
  /** Large figure in summary ring — ring fill = average / 5 */
  average: 4.5,
  histogram: reviewHistogram,
  /**
   * Count shown beside stars (“from 1,25k reviews”). Figma value; histogram sums may differ.
   */
  reviewsSubtitleTotal: 1250,
} as const;

export function reviewHistogramTotal(): number {
  return reviewHistogram.reduce((sum, row) => sum + row.count, 0);
}

/** Reviews Filter › Review Topics accordion (Figma) */
export const reviewFilterTopics = [
  "Product Quality",
  "Seller Services",
  "Product Price",
  "Shipment",
  "Match with Description",
] as const;

/** @deprecated Prefer `reviewFilterTopics` */
export const reviewTopics = reviewFilterTopics;

export type UiReview = {
  id: string;
  rating: number;
  title: string;
  body: string;
  author: string;
  dateLabel: string;
  helpfulYes: number;
  helpfulNo: number;
  avatarSrc?: string;
  /** Labels matching `reviewFilterTopics`; omit when API does not return facets */
  topicTags?: readonly string[];
};

/** True when any review carries topic facets — mirrors “BE returned topic tags” */
export function reviewsIncludeTopicFacets(rows: readonly UiReview[]): boolean {
  return rows.some((r) => (r.topicTags?.length ?? 0) > 0);
}

export const sampleReviews: UiReview[] = [
  {
    id: "rev-1",
    rating: 5,
    title: "This is amazing product I have.",
    body: "",
    author: "Darrell Steward",
    dateLabel: "July 2, 2020 03:29 PM",
    helpfulYes: 128,
    helpfulNo: 12,
    avatarSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=70",
    topicTags: ["Product Quality", "Shipment", "Match with Description"],
  },
  {
    id: "rev-2",
    rating: 5,
    title: "This is amazing product I have.",
    body: "",
    author: "Jane Cooper",
    dateLabel: "July 14, 2020 06:54 PM",
    helpfulYes: 96,
    helpfulNo: 8,
    avatarSrc:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=70",
    topicTags: ["Seller Services", "Product Price"],
  },
  {
    id: "rev-3",
    rating: 4,
    title: "This is amazing product I have.",
    body: "",
    author: "Eleanor Pena",
    dateLabel: "June 29, 2020 06:54 PM",
    helpfulYes: 84,
    helpfulNo: 3,
    avatarSrc:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=70",
    topicTags: ["Product Quality", "Product Price", "Match with Description"],
  },
  {
    id: "rev-4",
    rating: 5,
    title: "This is amazing product I have.",
    body: "",
    author: "Cody Fisher",
    dateLabel: "June 8, 2020 06:54 PM",
    helpfulYes: 72,
    helpfulNo: 5,
    avatarSrc:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=70",
    topicTags: ["Shipment", "Seller Services"],
  },
];
