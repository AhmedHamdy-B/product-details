import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useMemo, useState, type JSX, type ReactNode } from "react";

import {
  reviewFilterTopics,
  reviewInsights,
  reviewsIncludeTopicFacets,
  sampleReviews,
  type UiReview,
} from "../data/mocks";
import { cn } from "../lib/cn";
import { Stars, STORE_STAR_HEX } from "./Stars";

const tabs = ["All Reviews", "With Photo & Video", "With Description"] as const;

const reviewTooltip =
  "pointer-events-none invisible absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-900 px-2 py-1 text-[10px] font-semibold tracking-tight text-white shadow-lg opacity-0 transition-[opacity,visibility] duration-150";

export function ReviewsSection(): JSX.Element {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0]);

  const [starSelections, toggleStarSelection] = useBooleanMap({
    5: true,
    4: true,
    3: true,
    2: true,
    1: true,
  });

  const [topicSelections, toggleTopicSelection] =
    useTopicSelections(reviewFilterTopics);

  const hasTopicFacets = useMemo(
    () => reviewsIncludeTopicFacets(sampleReviews),
    [],
  );

  const filtered = useMemo(
    () =>
      applyReviewFilters(
        sampleReviews,
        activeTab,
        starSelections,
        topicSelections,
        hasTopicFacets,
      ),
    [activeTab, starSelections, topicSelections, hasTopicFacets],
  );

  const histogramMax = Math.max(
    ...reviewInsights.histogram.map((r) => r.count),
  );

  return (
    <section className="border-t border-dashed border-[#D1D1D1] bg-white py-12 xl:py-14">
      <h2 className="font-sans text-[22px] font-bold tracking-[-0.02em] text-black xl:text-[26px]">
        Product Reviews
      </h2>

      <ReviewsSummaryBanner
        average={reviewInsights.average}
        histogram={reviewInsights.histogram}
        histogramMax={histogramMax}
        subtitleReviewTotal={reviewInsights.reviewsSubtitleTotal}
      />

      <div className="mt-10 flex flex-col gap-10 lg:mt-12 lg:grid lg:grid-cols-[minmax(240px,_28%)_minmax(0,1fr)] lg:items-start lg:gap-x-14 lg:gap-y-10">
        <aside className="min-w-0 rounded-xl border border-dashed border-[#D1D1D1] bg-white px-5 py-5 lg:px-6 lg:py-6">
          <p className="font-sans text-[18px] font-bold tracking-tight text-black">
            Reviews Filter
          </p>

          <div className="mt-5 space-y-0 border-t border-dashed border-[#D1D1D1] pt-5">
            <Disclosure defaultOpen>
              {({ open }) => (
                <div>
                  <DisclosureButton className="flex w-full items-center justify-between pb-4 text-left">
                    <span className="font-sans text-[14px] font-semibold text-black">
                      Rating
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200",
                        open ? "rotate-180" : "rotate-0",
                      )}
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="-mt-1 pb-6">
                    <div className="space-y-3.5">
                      {[5, 4, 3, 2, 1].map((grade) => (
                        <SidebarRatingCheckboxRow
                          key={`star-${grade}`}
                          checked={starSelections.get(grade) ?? false}
                          grade={grade}
                          onToggle={() => toggleStarSelection(grade)}
                        />
                      ))}
                    </div>
                  </DisclosurePanel>
                </div>
              )}
            </Disclosure>

            <Disclosure defaultOpen>
              {({ open }) => (
                <div className="border-t border-dashed border-[#D1D1D1] pt-5">
                  <DisclosureButton className="flex w-full items-center justify-between pb-4 text-left">
                    <span className="font-sans text-[14px] font-semibold text-black">
                      Review Topics
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200",
                        open ? "rotate-180" : "rotate-0",
                      )}
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="-mt-1 pb-1">
                    {hasTopicFacets ? (
                      <div className="space-y-3.5">
                        {reviewFilterTopics.map((topic) => (
                          <SidebarCheckboxRow
                            key={topic}
                            checked={topicSelections.get(topic) ?? false}
                            onChange={() => toggleTopicSelection(topic)}
                          >
                            {topic}
                          </SidebarCheckboxRow>
                        ))}
                      </div>
                    ) : (
                      <p className="font-sans text-[12px] font-normal leading-relaxed text-neutral-500">
                        Topic filters need per-review tags from the API (for
                        example{" "}
                        <code className="font-mono text-[11px] text-neutral-700">
                          topicTags
                        </code>{" "}
                        matching these labels). They are not applied until the
                        backend returns that data.
                      </p>
                    )}
                  </DisclosurePanel>
                </div>
              )}
            </Disclosure>
          </div>
        </aside>

        <div className="min-w-0">
          <div>
            <p className="font-sans text-[18px] font-bold tracking-tight text-black">
              Review Lists
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "rounded-[9px] border-[2px] border-black px-5 py-2.5 font-sans text-[12px] font-semibold tracking-tight transition",
                    tab === activeTab
                      ? "border-neutral-400 bg-neutral-200 text-black"
                      : "border-neutral-100 bg-white text-black hover:bg-neutral-50",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="border-t border-dashed border-[#D1D1D1] pt-10 font-sans text-[14px] text-neutral-600">
              No reviews match your filters.
            </p>
          ) : (
            <ul aria-busy={false}>
              {filtered.map((review, index) => (
                <li
                  key={review.id}
                  className={cn(
                    /* Figma: separators are between items only — no rule above the first review */
                    index > 0 && "border-t border-dashed border-[#D1D1D1]",
                    /* Consistent vertical padding; lighter top on first row under pills */
                    "pb-8 pt-8 first:pt-6",
                  )}
                >
                  <ReviewCard review={review} />
                </li>
              ))}
            </ul>
          )}

          {filtered.length > 0 ? <Pagination /> : null}
        </div>
      </div>
    </section>
  );
}

type SummaryBannerProps = {
  average: number;
  histogram: readonly { stars: number; count: number }[];
  histogramMax: number;
  subtitleReviewTotal: number;
};

const reviewRingTrack = "#eaeaea";

function ReviewsSummaryBanner({
  average,
  histogram,
  histogramMax,
  subtitleReviewTotal,
}: SummaryBannerProps): JSX.Element {
  const avgLabel = average.toFixed(1);

  return (
    <div className="mt-8 rounded-xl border border-dashed border-[#D1D1D1] bg-white px-5 py-6 sm:px-7 sm:py-8 lg:px-4 lg:py-6">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center  sm:justify-center sm:gap-7 lg:justify-center lg:gap-8">
          <AvgScoreRing score={average} label={avgLabel} />
          <div className="flex flex-col items-center gap-2 sm:items-start sm:gap-2.5">
            {/* Figma: five solid orange stars (decorative row next to ring) */}
            <Stars variant="review" value={5} starSizePx={20} />
            <p className="text-center font-sans text-[14px] font-normal leading-snug text-[#717171] sm:text-left">
              {formatSubtitleKReviews(subtitleReviewTotal)}
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2.5 lg:max-w-[min(100%,820px)] lg:justify-self-end xl:max-w-[880px]">
          {histogram.map((row) => {
            const pct = histogramMax > 0 ? (row.count / histogramMax) * 100 : 0;
            return (
              <div
                key={row.stars}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 text-[13px] font-medium"
              >
                <span className="flex items-center gap-1.5 tabular-nums text-black">
                  <span>{row.stars}.0</span>
                  {/* Figma: one accent star per row (not a 5-star row) */}
                  <Star
                    className="shrink-0"
                    width={18}
                    height={18}
                    fill={STORE_STAR_HEX}
                    color={STORE_STAR_HEX}
                    strokeWidth={0}
                    aria-hidden
                  />
                </span>
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full bg-black transition-[width] duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-right tabular-nums text-neutral-700">
                  {row.count.toLocaleString("en-US")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** “from 1,25k reviews” — comma as decimal separator to match Figma */
function formatSubtitleKReviews(total: number): string {
  if (total < 1000) {
    return `from ${total.toLocaleString("en-US")} reviews`;
  }
  const k = total / 1000;
  const part = k.toFixed(2).replace(".", ",");
  return `from ${part}k reviews`;
}

/** SVG ring progress = score / maxScore (gap at end of arc); overlays Inter label */
function AvgScoreRing({
  score,
  label,
  sizePx = 85,
  strokeWidth = 4,
}: {
  score: number;
  label: string;
  sizePx?: number;
  strokeWidth?: number;
}): JSX.Element {
  const maxScore = 5;
  const clamped = Math.min(Math.max(score / maxScore, 0), 1);
  const c = sizePx / 2;
  const radius = Math.max(c - strokeWidth / 2 - 1.5, 1);
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped);

  return (
    <div
      className="relative shrink-0 [&_circle]:motion-reduce:transition-none"
      style={{ width: sizePx, height: sizePx }}
      role="img"
      aria-label={`Average rating ${label} out of 5`}
    >
      <svg
        className="-rotate-90"
        width={sizePx}
        height={sizePx}
        viewBox={`0 0 ${sizePx} ${sizePx}`}
      >
        <circle
          cx={c}
          cy={c}
          r={radius}
          fill="none"
          stroke={reviewRingTrack}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={c}
          cy={c}
          r={radius}
          fill="none"
          stroke={STORE_STAR_HEX}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none"
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="font-sans text-[34px] font-semibold tracking-tight text-black sm:text-[36px]">
          {label}
        </span>
      </div>
    </div>
  );
}

type SidebarRatingCheckboxRowProps = {
  grade: number;
  checked: boolean;
  onToggle: () => void;
};

function SidebarRatingCheckboxRow({
  grade,
  checked,
  onToggle,
}: SidebarRatingCheckboxRowProps): JSX.Element {
  const id = `review-filter-grade-${grade}`;
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-3.5">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={() => onToggle()}
        className="h-4 w-4 shrink-0 rounded-[3px] border border-neutral-500 text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 checked:border-black checked:bg-black"
      />
      {/* Figma: one filled star + grade digit (not a 5-star row) */}
      <span className="inline-flex shrink-0 items-center gap-[5px]" aria-hidden>
        <Star
          className="shrink-0"
          width={17}
          height={17}
          fill={STORE_STAR_HEX}
          color={STORE_STAR_HEX}
          strokeWidth={0}
        />
        <span className="font-sans text-[13px] font-bold tabular-nums text-[#818b9c]">
          {grade}
        </span>
      </span>
    </label>
  );
}

type SidebarCheckboxRowProps = {
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
};

function SidebarCheckboxRow({
  checked,
  onChange,
  children,
}: SidebarCheckboxRowProps): JSX.Element {
  return (
    <label className="flex cursor-pointer items-center gap-3.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange()}
        className="h-4 w-4 shrink-0 rounded-[3px] border border-neutral-500 text-black checked:border-black checked:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      />
      <span className="font-sans text-[13px] font-bold text-[#818b9c]">
        {children}
      </span>
    </label>
  );
}

function filterReviews(
  kind: (typeof tabs)[number],
  reviews: UiReview[],
): UiReview[] {
  switch (kind) {
    case "With Photo & Video":
      return reviews.filter((_, index) => index % 2 === 0);
    case "With Description":
      return reviews.slice(0, Math.max(reviews.length - 1, 1));
    default:
      return reviews;
  }
}

/** Map raw rating into integer star bucket used by the Rating filter checkboxes */
function normalizedStarBucket(rating: number): number {
  return Math.min(5, Math.max(1, Math.round(rating)));
}

function applyReviewFilters(
  reviews: UiReview[],
  tab: (typeof tabs)[number],
  starSelections: Map<number, boolean>,
  topicSelections: ReadonlyMap<string, boolean>,
  hasTopicFacets: boolean,
): UiReview[] {
  let list = filterReviews(tab, reviews);

  const activeGrades = [5, 4, 3, 2, 1].filter((grade) =>
    starSelections.get(grade),
  );
  if (activeGrades.length === 0) return [];

  list = list.filter((review) =>
    activeGrades.includes(normalizedStarBucket(review.rating)),
  );

  if (!hasTopicFacets) return list;

  const activeTopics = reviewFilterTopics.filter((topic) =>
    topicSelections.get(topic),
  );
  if (activeTopics.length === 0) return list;

  return list.filter((review) =>
    (review.topicTags ?? []).some((tag) => activeTopics.some((t) => t === tag)),
  );
}

type ReviewProps = {
  review: UiReview;
};

function ReviewCard({ review }: ReviewProps): JSX.Element {
  const initials =
    review.author
      ?.split(" ")
      ?.slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") ?? "";

  return (
    <article>
      {/* Figma rhythm: stars 10→ title 8→ date; optional body +12; footer +28 */}
      <div className="flex flex-col">
        <div className="min-w-0">
          <Stars variant="review" value={review.rating} starSizePx={15} />
          <h3 className="mt-[10px] font-sans text-[16px] font-bold leading-[1.35] tracking-[-0.02em] text-black sm:text-[17px]">
            {review.title}
          </h3>
          <p className="mt-2 font-sans text-[12px] font-normal leading-[1.5] text-neutral-500">
            {review.dateLabel}
          </p>
          {review.body.trim() ? (
            <p className="mt-3 font-sans text-[14px] font-normal leading-relaxed text-neutral-800">
              {review.body}
            </p>
          ) : null}
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
          <button
            type="button"
            className="flex max-w-max min-w-0 items-center gap-[10px] rounded-sm text-left font-sans text-[14px] font-bold leading-tight text-black transition hover:opacity-80"
          >
            {review.avatarSrc ? (
              <img
                src={review.avatarSrc}
                alt=""
                className="size-9 shrink-0 rounded-full object-cover sm:size-10"
              />
            ) : (
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-black text-[12px] text-white sm:size-10 sm:text-[13px]">
                {initials}
              </span>
            )}
            {review.author}
          </button>

          <HelpfulVoteChips yes={review.helpfulYes} no={review.helpfulNo} />
        </div>
      </div>
    </article>
  );
}

const reviewVoteCountClass =
  "font-sans text-[12px] font-bold tabular-nums leading-none text-[#818b9c] sm:text-[13px]";

/** Outlined ↔ solid (#818b9c) — same Lucide glyphs; stroke when idle, filled when chosen */
const VOTE_ICON_HEX = "#000000" as const;

type HelpfulChoice = null | "up" | "down";

function HelpfulVoteChips({
  yes: initialYes,
  no: initialNo,
}: {
  yes: number;
  no: number;
}): JSX.Element {
  const [choice, setChoice] = useState<HelpfulChoice>(null);
  const [yesCount, setYesCount] = useState(initialYes);
  const [noCount, setNoCount] = useState(initialNo);

  const chipBase =
    "peer inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[8px] border border-[#e8e8e8] bg-white transition hover:border-neutral-300 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2";

  const onLike = () => {
    if (choice === "up") {
      setChoice(null);
      setYesCount((c) => Math.max(0, c - 1));
      return;
    }
    if (choice === "down") {
      setChoice("up");
      setNoCount((c) => Math.max(0, c - 1));
      setYesCount((c) => c + 1);
      return;
    }
    setChoice("up");
    setYesCount((c) => c + 1);
  };

  const onDislike = () => {
    if (choice === "down") {
      setChoice(null);
      setNoCount((c) => Math.max(0, c - 1));
      return;
    }
    if (choice === "up") {
      setChoice("down");
      setYesCount((c) => Math.max(0, c - 1));
      setNoCount((c) => c + 1);
      return;
    }
    setChoice("down");
    setNoCount((c) => c + 1);
  };

  const upChosen = choice === "up";
  const downChosen = choice === "down";

  return (
    <div className="flex shrink-0 flex-row items-center gap-2">
      <div className="relative">
        <button
          type="button"
          aria-pressed={upChosen || undefined}
          aria-label={
            upChosen
              ? `Helpful selected (${yesCount}), press to remove`
              : `Mark helpful (${yesCount})`
          }
          className={`peer/helpful-chip-yes ${chipBase} h-9 gap-[7px] px-2.5 sm:h-10 sm:gap-2 sm:px-3`}
          onClick={onLike}
        >
          <ThumbsUp
            className="size-4 shrink-0 transition-[fill,stroke-width] sm:size-[18px]"
            strokeWidth={upChosen ? 0 : 1.75}
            fill={upChosen ? VOTE_ICON_HEX : "none"}
            stroke={VOTE_ICON_HEX}
            aria-hidden
          />
          <span className={reviewVoteCountClass}>{yesCount}</span>
        </button>
        <span
          role="tooltip"
          aria-hidden
          className={cn(
            reviewTooltip,
            "peer-hover/helpful-chip-yes:visible peer-hover/helpful-chip-yes:opacity-100",
            "peer-focus-visible/helpful-chip-yes:visible peer-focus-visible/helpful-chip-yes:opacity-100",
          )}
        >
          Like
        </span>
      </div>
      <div className="relative">
        <button
          type="button"
          aria-pressed={downChosen || undefined}
          aria-label={
            downChosen
              ? `Not helpful selected (${noCount}), press to remove`
              : `Mark not helpful (${noCount})`
          }
          className={`peer/helpful-chip-no ${chipBase} h-9 gap-[7px] px-2.5 sm:h-10 sm:gap-2 sm:px-3`}
          onClick={onDislike}
        >
          <ThumbsDown
            className="size-4 shrink-0 transition-[fill,stroke-width] sm:size-[18px]"
            strokeWidth={downChosen ? 0 : 1.75}
            fill={downChosen ? VOTE_ICON_HEX : "none"}
            stroke={VOTE_ICON_HEX}
            aria-hidden
          />
          <span className={reviewVoteCountClass}>{noCount}</span>
        </button>
        <span
          role="tooltip"
          aria-hidden
          className={cn(
            reviewTooltip,
            "peer-hover/helpful-chip-no:visible peer-hover/helpful-chip-no:opacity-100",
            "peer-focus-visible/helpful-chip-no:visible peer-focus-visible/helpful-chip-no:opacity-100",
          )}
        >
          Dislike
        </span>
      </div>
    </div>
  );
}

/** Figma review pagination: uniform rounded-square tiles; active = black stroke; idle = neutral stroke + muted label; chevrons standalone. */
const pgCell =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-solid bg-white text-[15px] font-semibold tabular-nums leading-none tracking-normal antialiased outline-none transition-[color,border-color,background-color] focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white";

function Pagination(): JSX.Element {
  const lastPage = 19;
  const current = 1;

  const idleCell = cn(
    pgCell,
    "cursor-pointer border-[#E0E0E0] text-[#757575]",
    "hover:border-[#BDBDBD] hover:text-neutral-900",
  );

  return (
    <nav
      className="mt-6 flex flex-wrap items-center justify-center gap-2 pb-2 pt-6 font-sans lg:mt-7"
      aria-label="Review pagination"
    >
      {current > 1 && (
        <button
          type="button"
          aria-label="Previous page"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] text-black outline-none transition-colors hover:bg-black/[0.03] focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <ChevronLeft className="size-5" strokeWidth={1.5} aria-hidden />
        </button>
      )}
      <button
        type="button"
        aria-current="page"
        className={cn(
          pgCell,
          "cursor-default border-black text-black hover:border-black hover:bg-black/[0.02]",
        )}
      >
        {current}
      </button>
      <button type="button" className={idleCell}>
        2
      </button>
      <span
        aria-hidden="true"
        className={cn(
          pgCell,
          "pointer-events-none cursor-default select-none border-[#E0E0E0] text-[#757575]",
        )}
      >
        …
      </span>
      <button type="button" className={idleCell}>
        {lastPage}
      </button>
      <button
        type="button"
        aria-label="Next page"
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] text-black outline-none transition-colors hover:bg-black/[0.03] focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        <ChevronRight className="size-5" strokeWidth={1.5} aria-hidden />
      </button>
    </nav>
  );
}

function useBooleanMap(
  record: Record<number, boolean>,
): [Map<number, boolean>, (key: number) => void] {
  const starter = Object.entries(record).map(
    ([entryKey, flag]) => [Number(entryKey), flag] as const,
  );
  const [mapEntries, setter] = useState(
    () => new Map<number, boolean>(starter),
  );

  const toggleStar = (key: number) => {
    setter((prev) => {
      const cloned = new Map(prev);
      cloned.set(key, !cloned.get(key));
      return cloned;
    });
  };

  return [mapEntries, toggleStar];
}

function useTopicSelections(
  topics: readonly string[],
): readonly [ReadonlyMap<string, boolean>, (key: string) => void] {
  const [mapEntries, setter] = useState(
    (): Map<string, boolean> => new Map(topics.map((topic) => [topic, true])),
  );

  const toggle = (key: string) => {
    setter((prev) => {
      const cloned = new Map(prev);
      cloned.set(key, !(cloned.get(key) ?? false));
      return cloned;
    });
  };

  return [mapEntries, toggle] as const;
}
