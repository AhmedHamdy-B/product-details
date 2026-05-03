/**
 * Lighthouse Accessibility category audit (writes JSON to stdout, parsed here).
 *
 * Uses the Lighthouse **CLI entry** (`cli/index.js`) instead of programmatic `lighthouse()`
 * because some Windows/Git-Bash setups return an empty/incomplete `lhr.categories` blob
 * when Chrome is launched independently from `chrome-launcher` — the CLI bundles the
 * canonical gather + scoring path.
 *
 * @see https://github.com/GoogleChrome/lighthouse/blob/main/readme.md#using-the-node-cli
 */

import { spawnSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.join(__dirname, '..')
const lighthouseCli = path.join(repoRoot, 'node_modules/lighthouse/cli/index.js')

const url = process.env.LH_URL ?? 'http://localhost:5199'
const minScore = Number(process.env.MIN_A11Y_SCORE ?? '0.86')

const args = [
  lighthouseCli,
  url,
  '--only-categories=accessibility',
  '--preset=desktop',
  '--quiet',
  '--output=json',
  '--output-path=stdout',
  '--chrome-flags=--headless=new --no-sandbox --disable-gpu --window-size=1280,800',
  '--throttling-method=provided',
  '--screenEmulation.disabled',
  /** Cold Vite/React hydration on modest laptops — avoid flaky NO_FCP / blank LHR */
  '--max-wait-for-load=90000',
]

const proc = spawnSync(process.execPath, args, {
  cwd: repoRoot,
  encoding: 'utf-8',
  env: process.env,
  maxBuffer: 60 * 1024 * 1024,
})

if (proc.error) {
  console.error(proc.error.message)
  process.exit(1)
}

if (proc.status !== 0) {
  console.error(proc.stderr.trim() || `Lighthouse exited with code ${proc.status}`)
  process.exit(proc.status ?? 1)
}

const raw = proc.stdout.trim()
let lhr
try {
  lhr = JSON.parse(raw)
} catch {
  console.error('Lighthouse did not emit valid JSON on stdout.')
  console.error('First ~800 chars:', raw.slice(0, 800))
  process.exit(1)
}

const acc = lhr.categories?.accessibility
const score = typeof acc?.score === 'number' ? acc.score : null

if (score === null) {
  console.error('No accessibility score in Lighthouse result — run with DEBUG=1 for detail.')
  if (process.env.DEBUG === '1') {
    console.error('runtimeError:', JSON.stringify(lhr.runtimeError, null, 2))
    console.error('category keys:', Object.keys(lhr.categories ?? {}))
  }
  process.exit(1)
}

if (score < minScore) {
  console.error(`Lighthouse accessibility score too low: ${score} (min ${minScore})`)

  /** Helpful breadcrumbs when regressing audits */
  const bad = []
  const audits = lhr.audits ?? {}
  for (const [id, audit] of Object.entries(audits)) {
    if (audit.score === null || audit.score === undefined) continue
    if (audit.score < 1) {
      bad.push({
        id,
        score: audit.score,
        title: audit.title ?? audit.description,
      })
    }
  }

  console.error(`Failing audits (${bad.length}):`, JSON.stringify(bad.slice(0, 25), null, 2))
  process.exit(1)
}

console.log(`Lighthouse accessibility score: ${score.toFixed(2)} (threshold ${minScore})`)
