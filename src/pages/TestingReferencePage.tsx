import type { JSX } from "react";
import { Link } from "react-router-dom";

import { PageContainer } from "../components/PageContainer";
import { Reveal } from "../components/Reveal";
import { CartDrawer } from "../components/CartDrawer";
import { FavoritesDrawer } from "../components/FavoritesDrawer";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { ToastBanner } from "../components/ToastBanner";

type ReferenceRow = {
  topic: string;
  applied: string;
  verify: string;
  locations: readonly string[];
};

const rows = [
  {
    topic: "Unit tests (Vitest)",
    applied:
      "Store logic for cart and product ingestion, helpers (variants, pricing), and CartDrawer rendering smoke.",
    verify: `Run \`npm run test:run\`. Uses jsdom.`,
    locations: ["vitest.config.ts", "src/tests/"],
  },
  {
    topic: "E2E PDP smoke (Playwright)",
    applied:
      "Headless Chromium against the dev URL; mocks Easy Orders; exercises gallery, drawer, toast, persisted cart cleanup.",
    verify: `With dev ready on port 5199, run \`npm run test:e2e\`. (Playwright launches or reuses server per config.)`,
    locations: [
      "playwright.config.ts",
      "e2e/pdp.smoke.spec.ts",
      "e2e/helpers/mock-easyorders.ts",
      "e2e/fixtures/sneakers12.json",
      "e2e/helpers/clear-site-data.ts",
    ],
  },
  {
    topic: "Automated axe scan (Playwright)",
    applied:
      "axe-core scans `main#main-content` after the PDP mock settles. Colour-contrast is disabled intentionally (fixture palette).",
    verify: `\`npm run test:e2e\` runs \`accessibilityaxe.spec.ts\`.`,
    locations: ["e2e/accessibilityaxe.spec.ts"],
  },
  {
    topic: "Lighthouse accessibility gate",
    applied:
      "Desktop preset, accessibility category only, CLI bundle for stable scores on Windows. Default pass threshold MIN_A11Y_SCORE=0.86 (env override).",
    verify: `\`npm run lh:a11y\` serves on :5199 then runs \`lh:a11y:run\`. Direct run: \`npm run lh:a11y:run\` against LH_URL.`,
    locations: ["scripts/lighthouse-a11y.mjs"],
  },
  {
    topic: "CI pipeline",
    applied: "Lint, Vitest unit run, Playwright chromium with system deps.",
    verify: `See workflow on push / pull_request to main.`,
    locations: [".github/workflows/validate.yml"],
  },
  {
    topic: "Runtime accessibility (manual)",
    applied:
      "Skip link to `#main-content`, focus ring on `<main>`, dialogs from Headless UI, `motion-safe:` on gallery zoom, `aria-live` toast region.",
    verify:
      "Tab once from load: skip link appears; activate to move focus into main. Open cart drawer: labelled dialog. Add item: polite live region announces basket update.",
    locations: [
      "src/components/SkipToMain.tsx",
      "src/pages/ProductDetailPage.tsx",
      "src/components/ToastBanner.tsx",
      "src/components/ProductGallery.tsx",
    ],
  },
  {
    topic: "Resilience",
    applied: "React error boundary around routed pages.",
    verify:
      "(Optional destructive test) Simulate child throw in devtools — fallback UI renders.",
    locations: ["src/components/ErrorBoundary.tsx", "src/App.tsx"],
  },
  {
    topic: "Type safety",
    applied: "`strict` TypeScript.",
    verify: `\`npm run build\` (tsc --noEmit + Vite bundle).`,
    locations: ["tsconfig.app.json"],
  },
] as const satisfies readonly ReferenceRow[];

function PathCell({ paths }: { paths: readonly string[] }): JSX.Element {
  return (
    <ul className="m-0 list-none space-y-1 p-0">
      {paths.map((location) => (
        <li key={location}>
          <code className="break-all rounded bg-neutral-100 px-1 py-0.5 text-[12px] text-neutral-900">
            {location}
          </code>
        </li>
      ))}
    </ul>
  );
}

export function TestingReferencePage(): JSX.Element {
  return (
    <div className="bg-jl-white text-neutral-950">
      <Reveal>
        <SiteHeader crumbs={["Homepage", "Testing reference"]} />
      </Reveal>

      <main
        id="main-content"
        tabIndex={-1}
        className="min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-4"
      >
        <PageContainer className="pb-24 pt-8 sm:pt-10 lg:pb-36">
          <div className="mx-auto  space-y-6">
            <p className="text-[13px] text-neutral-600">
              <Link
                to="/"
                className="font-semibold text-neutral-900 underline-offset-4 hover:underline"
              >
                ← Back to product page
              </Link>
            </p>

            <header className="space-y-2">
              <h1 className="font-serif text-[32px] font-medium tracking-tight sm:text-[38px]">
                Testing & QA reference
              </h1>
              <p className="max-w-[70ch] text-[15px] leading-relaxed text-neutral-700">
                This page lists tooling, automated checks, and product
                behaviours added for ElegantSoft parity and rubric alignment.
                Give testers a single checklist of what shipped and where it
                lives in the repo.
              </p>
              <p className="text-[13px] text-neutral-600">
                Open this sheet anytime at{" "}
                <strong className="font-semibold text-neutral-800">
                  /testing
                </strong>{" "}
                (SPA: configure host rewrites on static deploy).
              </p>
            </header>

            <div className="mx-auto w-[80vw] max-w-full overflow-x-auto rounded-md border border-neutral-200 shadow-sm">
              <table className="w-full min-w-[720px] table-fixed border-collapse text-left text-[13px]">
                <caption className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-left text-[13px] font-semibold text-neutral-900">
                  Applied quality layers — how to rerun or spot-check them
                </caption>
                <colgroup>
                  <col className="w-[17%]" />
                  <col className="w-[26%]" />
                  <col className="w-[27%]" />
                  <col className="min-w-[20%] w-[20%]" />
                </colgroup>
                <thead>
                  <tr className="bg-neutral-100 text-neutral-900">
                    <th
                      scope="col"
                      className="border-b border-neutral-200 px-3 py-2.5 font-semibold"
                    >
                      Area
                    </th>
                    <th
                      scope="col"
                      className="border-b border-neutral-200 px-3 py-2.5 font-semibold"
                    >
                      What was applied
                    </th>
                    <th
                      scope="col"
                      className="border-b border-neutral-200 px-3 py-2.5 font-semibold"
                    >
                      How to verify
                    </th>
                    <th
                      scope="col"
                      className="border-b border-neutral-200 px-3 py-2.5 font-semibold"
                    >
                      Repo paths
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.topic}
                      className="align-top odd:bg-white even:bg-neutral-50/80"
                    >
                      <th
                        scope="row"
                        className="border-b border-neutral-200 px-3 py-3 font-semibold text-neutral-900"
                      >
                        {row.topic}
                      </th>
                      <td className="border-b border-neutral-200 px-3 py-3 text-neutral-800">
                        {row.applied}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-3">
                        <span className="whitespace-pre-line text-neutral-800">
                          {row.verify}
                        </span>
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-3">
                        <PathCell paths={row.locations} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </PageContainer>
      </main>

      <Reveal>
        <SiteFooter />
      </Reveal>

      <CartDrawer />
      <FavoritesDrawer />
      <ToastBanner />
    </div>
  );
}
