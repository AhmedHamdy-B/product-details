import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Funnel,
  Star,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type JSX,
  type ReactNode,
} from "react";

import {
  reviewFilterTopics,
  reviewInsights,
  reviewsIncludeTopicFacets,
  sampleReviews,
  type UiReview,
} from "../data/mocks";
import { useLocale } from "../i18n/useLocale";
import type { Locale, MessageKey } from "../i18n/messages";
import { cn } from "../lib/cn";
import { Stars, STORE_STAR_HEX } from "./Stars";
import {
  helpfulVoteChipBaseClass,
  pageArrowClass,
  pgCell,
  reviewCheckboxClass,
  reviewRingTrack,
  reviewTooltip,
  reviewVoteCountClass,
  VOTE_ICON_HEX,
} from "./variants/reviewsSection.variants";

const REVIEW_TAB_IDS = ["all", "photo", "desc"] as const;
type ReviewTabId = (typeof REVIEW_TAB_IDS)[number];

const REVIEW_TAB_MESSAGE: Record<
  ReviewTabId,
  "reviews.tab.all" | "reviews.tab.photo" | "reviews.tab.desc"
> = {
  all: "reviews.tab.all",
  photo: "reviews.tab.photo",
  desc: "reviews.tab.desc",
};

const VOTE_LIKE_ACTIVE_HEX = "#1D9E34" as const;
const VOTE_DISLIKE_ACTIVE_HEX = "#DC2626" as const;

const REVIEW_TAB_FADE_MS = 220;

function subscribePrefersReducedMotion(onStoreChange: () => void): () => void {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getPrefersReducedMotionSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getPrefersReducedMotionServerSnapshot(): boolean {
  return false;
}

export function ReviewsSection(): JSX.Element {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<ReviewTabId>(REVIEW_TAB_IDS[0]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  /** Tab used for list content; trails `activeTab` while cross-fading. */
  const [displayTab, setDisplayTab] = useState<ReviewTabId>(activeTab);
  const [listFadeIn, setListFadeIn] = useState(true);

  const reduceMotion = useSyncExternalStore(
    subscribePrefersReducedMotion,
    getPrefersReducedMotionSnapshot,
    getPrefersReducedMotionServerSnapshot,
  );

  const fadeMs = reduceMotion ? 0 : REVIEW_TAB_FADE_MS;

  useEffect(() => {
    if (activeTab === displayTab) {
      queueMicrotask(() => {
        setListFadeIn(true);
      });
      return;
    }
    if (fadeMs === 0) {
      queueMicrotask(() => {
        setDisplayTab(activeTab);
        setListFadeIn(true);
      });
      return;
    }
    queueMicrotask(() => {
      setListFadeIn(false);
    });
    const id = window.setTimeout(() => {
      setDisplayTab(activeTab);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setListFadeIn(true));
      });
    }, fadeMs);
    return () => window.clearTimeout(id);
  }, [activeTab, displayTab, fadeMs]);

  useEffect(() => {
    document.body.dataset.reviewsFilterOpen = mobileFiltersOpen
      ? "true"
      : "false";
    if (!mobileFiltersOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.dataset.reviewsFilterOpen = "false";
    };
  }, [mobileFiltersOpen]);

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
        displayTab,
        starSelections,
        topicSelections,
        hasTopicFacets,
      ),
    [displayTab, starSelections, topicSelections, hasTopicFacets],
  );

  const histogramMax = reviewInsights.histogram.reduce(
    (sum, row) => sum + row.count,
    0,
  );

  return (
    <section className="dash-top dash-color-bbb bg-white py-12 pt-[75px] mb-0">
      <h2 className="font-sans text-[28px] font-semibold tracking-[-0.02em] text-black xl:text-[28px]">
        {t("reviews.sectionTitle")}
      </h2>

      <ReviewsSummaryBanner
        average={reviewInsights.average}
        histogram={reviewInsights.histogram}
        histogramMax={histogramMax}
        subtitleReviewTotal={reviewInsights.reviewsSubtitleTotal}
      />

      <div className=" flex flex-col gap-10 mt-6 lg:grid lg:grid-cols-[minmax(210px,_22%)_minmax(0,1fr)] lg:items-start  lg:gap-y-10">
        <aside className="dash-border dash-color-bbb hidden min-w-0 rounded-xl bg-white px-5 py-5 lg:block lg:px-6 lg:py-6">
          <ReviewFiltersPanel
            starSelections={starSelections}
            toggleStarSelection={toggleStarSelection}
            hasTopicFacets={hasTopicFacets}
            topicSelections={topicSelections}
            toggleTopicSelection={toggleTopicSelection}
          />
        </aside>

        <div className="min-w-0">
          <div>
            <p className="font-sans text-[20px] font-semibold tracking-tight text-black">
              {t("reviews.listsHeading")}
            </p>
            <div className="mt-5 flex items-start justify-between gap-3">
              <div className="flex flex-wrap gap-3">
                {REVIEW_TAB_IDS.map((tabId) => (
                  <button
                    key={tabId}
                    type="button"
                    onClick={() => setActiveTab(tabId)}
                    className={cn(
                      "rounded-[9px] border border-[#E6E6E6] px-5 py-2.5 font-sans text-[14px] font-medium tracking-tight transition",
                      tabId === activeTab
                        ? "border-[#333333] bg-neutral-200 text-black"
                        : "border-[#E6E6E6] bg-white text-black hover:bg-neutral-50",
                    )}
                  >
                    {t(REVIEW_TAB_MESSAGE[tabId])}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="inline-flex h-[43px] w-[43px] p-[6px] shrink-0 items-center justify-center rounded-[11px] border border-[#E4E9EE] bg-white text-black transition hover:bg-neutral-50 lg:hidden"
                aria-label={t("reviews.filterHeading")}
                aria-expanded={mobileFiltersOpen}
                onClick={() => setMobileFiltersOpen((open) => !open)}
              >
                <Funnel
                  className="h-[22px] w-[22px]"
                  strokeWidth={1.9}
                  aria-hidden
                />
              </button>
            </div>
            <div className="lg:hidden">
              <div
                className={cn(
                  "fixed inset-0 z-[140] bg-black/35 transition-opacity duration-200 ease-out",
                  mobileFiltersOpen
                    ? "opacity-100"
                    : "pointer-events-none opacity-0",
                )}
                onClick={() => setMobileFiltersOpen(false)}
                aria-hidden
              />
              <aside
                className={cn(
                  "fixed inset-y-0 end-0 z-[150] w-[min(86vw,360px)] overflow-y-auto border-s border-neutral-200 bg-white px-5 py-5 shadow-2xl transition-transform duration-300 ease-out",
                  mobileFiltersOpen ? "translate-x-0" : "translate-x-full",
                )}
                aria-label={t("reviews.filterHeading")}
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-sans text-[20px] font-semibold tracking-tight text-black">
                    {t("reviews.filterHeading")}
                  </p>
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-neutral-200 text-black transition hover:bg-neutral-50"
                    onClick={() => setMobileFiltersOpen(false)}
                    aria-label={t("reviews.closeFilters")}
                  >
                    <X className="h-5 w-5" strokeWidth={1.9} aria-hidden />
                  </button>
                </div>
                <div className="dash-top dash-color-bbb pt-4">
                  <ReviewFiltersPanel
                    starSelections={starSelections}
                    toggleStarSelection={toggleStarSelection}
                    hasTopicFacets={hasTopicFacets}
                    topicSelections={topicSelections}
                    toggleTopicSelection={toggleTopicSelection}
                  />
                </div>
              </aside>
            </div>
          </div>

          <div
            className={cn(
              "opacity-100 motion-safe:transition-opacity motion-safe:duration-200 motion-safe:ease-out",
              !listFadeIn && "motion-safe:opacity-0",
            )}
          >
            {filtered.length === 0 ? (
              <p className="dash-top dash-color-bbb pt-10 font-sans text-[14px] text-neutral-600">
                {t("reviews.emptyFilters")}
              </p>
            ) : (
              <ul aria-busy={false} className="mt-[4px]">
                {filtered.map((review, index) => (
                  <li
                    key={review.id}
                    className={cn(
                      /* Figma: separators are between items only — no rule above the first review */
                      index > 0 && "dash-top dash-color-bbb",
                      /* Consistent vertical padding; lighter top on first row under pills */
                      "py-[32px]  first:pt-6",
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

type ReviewFiltersPanelProps = {
  starSelections: ReadonlyMap<number, boolean>;
  toggleStarSelection: (grade: number) => void;
  hasTopicFacets: boolean;
  topicSelections: ReadonlyMap<string, boolean>;
  toggleTopicSelection: (topic: string) => void;
};

function ReviewFiltersPanel({
  starSelections,
  toggleStarSelection,
  hasTopicFacets,
  topicSelections,
  toggleTopicSelection,
}: ReviewFiltersPanelProps): JSX.Element {
  const { t } = useLocale();

  return (
    <>
      <p className="font-sans text-[20px] font-semibold tracking-tight text-black">
        {t("reviews.filterHeading")}
      </p>

      <div className="dash-top dash-color-bbb mt-5 space-y-0 pt-5">
        <Disclosure defaultOpen>
          {({ open }) => (
            <div>
              <DisclosureButton className="flex w-full items-center justify-between pb-4 text-start">
                <span className="font-sans text-[16px] font-semibold text-black">
                  {t("reviews.filterRating")}
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
            <div className="dash-top dash-color-bbb pt-5">
              <DisclosureButton className="flex w-full items-center justify-between pb-4 text-start">
                <span className="font-sans text-[20px] font-semibold text-black">
                  {t("reviews.filterTopics")}
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
                    {t("reviews.topicFacetHint")}
                  </p>
                )}
              </DisclosurePanel>
            </div>
          )}
        </Disclosure>
      </div>
    </>
  );
}

function ReviewsSummaryBanner({
  average,
  histogram,
  histogramMax,
  subtitleReviewTotal,
}: SummaryBannerProps): JSX.Element {
  const { locale, tf } = useLocale();
  const avgLabel = average.toFixed(1);
  const histogramNumLoc = locale === "ar" ? "ar-SA" : "en-US";

  return (
    <div className="dash-border dash-color-bbb mt-5 rounded-xl bg-white px-[23px] md:px-[12px] py-6 sm:py-8 lg:py-6">
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start lg:gap-x-[125px]">
        <div className="flex items-center justify-start gap-5 lg:justify-center">
          <span className="sm:hidden">
            <AvgScoreRing score={average} label={avgLabel} strokeWidth={6} />
          </span>
          <span className="hidden sm:inline-flex">
            <AvgScoreRing score={average} label={avgLabel} strokeWidth={4} />
          </span>
          <div className="flex flex-col items-start gap-0 sm:gap-2.5">
            {/* Figma: five solid orange stars (decorative row next to ring) */}
            <span className="sm:hidden">
              <Stars variant="review" value={5} starSizePx={27} />
            </span>
            <span className="hidden sm:inline-flex">
              <Stars variant="review" value={5} starSizePx={20} />
            </span>
            <p className="text-start font-sans text-[16px] font-medium leading-snug text-[#0B0F0E] sm:text-[#525252]">
              {formatSubtitleKReviews(subtitleReviewTotal, locale, tf)}
            </p>
          </div>
        </div>

        <div className="min-w-0 space-y-2.5">
          {histogram.map((row) => {
            const pct = histogramMax > 0 ? (row.count / histogramMax) * 100 : 0;
            return (
              <div
                key={row.stars}
                className="grid grid-cols-[56px_minmax(0,1fr)_43px] items-center gap-x-0 text-[13px] font-medium sm:grid-cols-[56px_minmax(0,1fr)_70px]"
              >
                <span className="flex items-center gap-1.5 tabular-nums text-[#0B0F0E] text-[13px] font-medium">
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
                <div className="h-2 w-full overflow-hidden rounded-none bg-neutral-200 sm:rounded-full">
                  <div
                    className="h-full rounded-none bg-black transition-[width] duration-500 sm:rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="whitespace-nowrap text-end ps-2 text-[#0B0F0E] text-[13px] font-medium sm:text-start sm:ps-4">
                  {row.count.toLocaleString(histogramNumLoc)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** “from N reviews” / “from 1,25k reviews” — English keeps comma fractional k; Arabic uses locale punctuation */
function formatSubtitleKReviews(
  total: number,
  locale: Locale,
  tf: (key: MessageKey, vars: Record<string, string | number>) => string,
): string {
  const numLoc = locale === "ar" ? "ar-SA" : "en-US";
  if (total < 1000) {
    return tf("reviews.subtitleReviews", {
      count: total.toLocaleString(numLoc),
    });
  }
  const k = total / 1000;
  const part =
    locale === "ar"
      ? k.toFixed(2).replace(".", "٫")
      : k.toFixed(2).replace(".", ",");
  return tf("reviews.subtitleReviewsK", { part });
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
  const { tf } = useLocale();
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
      aria-label={tf("reviews.avgRingAria", { label })}
    >
      <svg
        className="-rotate-[70deg]"
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
        <span className=" text-[20px] font-semibold tracking-tight text-black text-[#0B0F0E]">
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
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5 ">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={() => onToggle()}
        className={reviewCheckboxClass}
      />
      {/* Figma: one filled star + grade digit (not a 5-star row) */}
      <span className="inline-flex shrink-0 items-center gap-[5px]" aria-hidden>
        <Star
          className="shrink-0"
          width={18}
          height={18}
          fill={STORE_STAR_HEX}
          color={STORE_STAR_HEX}
          strokeWidth={0}
        />
        <span className="font-sans text-[16px] font-semibold tabular-nums text-[#818b9c]">
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
        className={reviewCheckboxClass}
      />
      <span className="font-sans text-[16px] font-semibold text-[#818b9c]">
        {children}
      </span>
    </label>
  );
}

function filterReviews(kind: ReviewTabId, reviews: UiReview[]): UiReview[] {
  switch (kind) {
    case "photo":
      return reviews.filter((_, index) => index % 2 === 0);
    case "desc":
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
  tab: ReviewTabId,
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

  const authorButtonClass =
    "flex max-w-max min-w-0 items-center gap-[10px] rounded-sm text-start font-sans " +
    "text-[16px] font-medium leading-tight text-black transition hover:opacity-80";
  const initialsBadgeClass =
    "inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-black " +
    "text-[12px] text-white sm:size-10 sm:text-[13px]";

  return (
    <article>
      {/* Figma rhythm: stars 10→ title 8→ date; optional body +12; footer +28 */}
      <div className="flex flex-col">
        <div className="min-w-0">
          <Stars variant="review" value={review.rating} starSizePx={20} />
          <h3 className="mt-[8px] font-sans text-[18px] font-semibold leading-[1.35] tracking-[-0.02em] text-black sm:text-[17px]">
            {review.title}
          </h3>
          <p className="mt-1 font-sans text-[16px] font-normal leading-[1.5] text-[#818B9C]">
            {review.dateLabel}
          </p>
          {review.body.trim() ? (
            <p className="mt-3 font-sans text-[14px] font-normal leading-relaxed text-neutral-800">
              {review.body}
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
          <button type="button" className={authorButtonClass}>
            {review.avatarSrc ? (
              <img
                src={review.avatarSrc}
                alt={review.author}
                className="size-[32px] shrink-0 rounded-full object-cover "
              />
            ) : (
              <span className={initialsBadgeClass}>{initials}</span>
            )}
            {review.author}
          </button>

          <HelpfulVoteChips yes={review.helpfulYes} no={review.helpfulNo} />
        </div>
      </div>
    </article>
  );
}

/** Outlined ↔ solid (#818b9c) — same Lucide glyphs; stroke when idle, filled when chosen */

type HelpfulChoice = null | "up" | "down";

function HelpfulVoteChips({
  yes: initialYes,
  no: initialNo,
}: {
  yes: number;
  no: number;
}): JSX.Element {
  const { t, tf } = useLocale();
  const [choice, setChoice] = useState<HelpfulChoice>(null);
  const [yesCount, setYesCount] = useState(initialYes);
  const [noCount, setNoCount] = useState(initialNo);

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
              ? tf("reviews.helpful.ariaYesSelected", { count: yesCount })
              : tf("reviews.helpful.ariaYes", { count: yesCount })
          }
          className={`peer/helpful-chip-yes ${helpfulVoteChipBaseClass} h-9 gap-[7px] px-2.5 sm:h-10 sm:gap-2 sm:px-3 `}
          onClick={onLike}
        >
          <ThumbsUp
            className="size-4  shrink-0 transition-[fill,stroke-width] sm:size-[18px]"
            strokeWidth={upChosen ? 0 : 1.75}
            fill={upChosen ? VOTE_LIKE_ACTIVE_HEX : "none"}
            stroke={upChosen ? VOTE_LIKE_ACTIVE_HEX : VOTE_ICON_HEX}
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
          {t("reviews.helpful.tooltipYes")}
        </span>
      </div>
      <div className="relative">
        <button
          type="button"
          aria-pressed={downChosen || undefined}
          aria-label={
            downChosen
              ? tf("reviews.helpful.ariaNoSelected", { count: noCount })
              : tf("reviews.helpful.ariaNo", { count: noCount })
          }
          className={`peer/helpful-chip-no ${helpfulVoteChipBaseClass} h-9 gap-[7px] px-2.5 sm:h-10 sm:gap-2 sm:px-3`}
          onClick={onDislike}
        >
          <ThumbsDown
            className="size-4 shrink-0 scale-x-[-1] transition-[fill,stroke-width] sm:size-[18px]"
            strokeWidth={downChosen ? 0 : 1.75}
            fill={downChosen ? VOTE_DISLIKE_ACTIVE_HEX : "none"}
            stroke={downChosen ? VOTE_DISLIKE_ACTIVE_HEX : VOTE_ICON_HEX}
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
          {t("reviews.helpful.tooltipNo")}
        </span>
      </div>
    </div>
  );
}

/**
 * Figma review pagination: uniform rounded-square tiles.
 * Active = black stroke; idle = neutral stroke + muted label; chevrons standalone.
 */
function Pagination(): JSX.Element {
  const { t } = useLocale();
  const lastPage = 19;
  const current = 1;

  const idleCell = cn(
    pgCell,
    "cursor-pointer border-[#E4E9EE] text-[#757575]",
    "hover:border-[#BDBDBD] hover:text-neutral-900",
  );

  return (
    <nav
      className="mt-6 flex flex-wrap items-center justify-center gap-2 pb-2 pt-6 font-sans  lg:mt-7"
      aria-label={t("reviews.paginationNav")}
    >
      {current > 1 && (
        <button
          type="button"
          aria-label={t("reviews.pagePrev")}
          className={pageArrowClass}
        >
          <ChevronLeft className="size-5" strokeWidth={1.5} aria-hidden />
        </button>
      )}
      <button
        type="button"
        aria-current="page"
        className={cn(
          pgCell,
          "cursor-default border-[#333333] text-black hover:border-[#333333] hover:bg-black/[0.02]",
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
          "pointer-events-none cursor-default select-none border-[#E4E9EE] text-[#757575]",
        )}
      >
        …
      </span>
      <button type="button" className={idleCell}>
        {lastPage}
      </button>
      <button
        type="button"
        aria-label={t("reviews.pageNext")}
        className={pageArrowClass}
      >
        <ChevronRight
          className="size-[36px] ml-[8px]"
          strokeWidth={1}
          aria-hidden
        />
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
