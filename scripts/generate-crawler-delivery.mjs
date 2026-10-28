/**
 * Generates `vercel.json` — the crawler delivery split and the canonical
 * redirects — from `src/lib/crawler-ua.js`, so the deployed config can never
 * drift from the allowlist the code and the audit both read.
 *
 *   node scripts/generate-crawler-delivery.mjs          # write vercel.json
 *   node scripts/generate-crawler-delivery.mjs --check  # exit 1 if stale
 *
 * Delivery order at `/` (first match wins):
 *   1. Denied scrapers → `/denied-bot.html` + X-Robots-Tag noindex
 *   2. Allowlisted crawlers → `/crawler-seo.html` + x-crawler-seo-page: 1
 *   3. Humans → `gate.html` (catch-all rewrite) (ReferrerGate)
 *
 * GSC / CDN note: Vercel edge previously cached one body for `/` and served it
 * to every UA (Googlebot got the human landing while still receiving the
 * crawler header stamp). `Vary: User-Agent` + `Vercel-CDN-Cache-Control:
 * no-store` on `/` force the rewrite to evaluate per request.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildCrawlerUaPattern,
  buildDeniedBotUaPattern,
} from "../src/lib/crawler-ua.js";
import { AI_REFERENCE_CRAWLER_AGENTS } from "../src/lib/ai-referral.js";
import {
  CRAWLER_SEO_PATH,
  DENIED_BOT_PATH,
  HUMAN_GATE_PATH,
  NOINDEX_PATHS,
  NOINDEX_PAGE_ROBOTS,
  robotsContent,
  SITE_ORIGIN,
} from "../src/lib/site-config.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "vercel.json");

const UA_PATTERN = buildCrawlerUaPattern(AI_REFERENCE_CRAWLER_AGENTS);
const DENIED_UA_PATTERN = buildDeniedBotUaPattern();

/** Apex hostname for permanent www lock (PROBE G.4b / Bing empty-index). */
function apexHostFromSiteOrigin() {
  try {
    const host = new URL(SITE_ORIGIN).hostname.toLowerCase();
    return host.startsWith("www.") ? host.slice(4) : host;
  } catch {
    return "";
  }
}

function uaHeaderCondition(pattern) {
  return [
    {
      type: "header",
      key: "user-agent",
      value: { re: `(?i)${pattern}` },
    },
  ];
}

function crawlerUaCondition() {
  return uaHeaderCondition(UA_PATTERN);
}

function deniedUaCondition() {
  return uaHeaderCondition(DENIED_UA_PATTERN);
}

/** Prevent CDN from mixing human/crawler/denied bodies on the same URL. */
const ROOT_CACHE_HEADERS = [
  { key: "Vary", value: "User-Agent" },
  { key: "CDN-Cache-Control", value: "no-store" },
  { key: "Vercel-CDN-Cache-Control", value: "no-store" },
];

function buildConfig() {
  return {
    $schema: "https://openapi.vercel.sh/vercel.json",

    redirects: [
      // Legacy filenames → canonical `/` (which then UA-rewrites).
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/login", destination: "/", permanent: true },
      ...(apexHostFromSiteOrigin()
        ? [
            {
              source: "/:path*",
              has: [{ type: "host", value: apexHostFromSiteOrigin() }],
              destination: `${SITE_ORIGIN}/:path*`,
              permanent: true,
            },
          ]
        : []),
    ],

    rewrites: [
      // No index.html on disk for `/` — filesystem cannot short-circuit these.
      {
        source: "/",
        destination: DENIED_BOT_PATH,
        has: deniedUaCondition(),
      },
      {
        source: "/",
        destination: CRAWLER_SEO_PATH,
        has: crawlerUaCondition(),
      },
      {
        source: "/",
        destination: HUMAN_GATE_PATH,
      },
    ],

    headers: [
      // Always vary + bypass CDN body cache for `/` (UA-conditioned rewrites).
      {
        source: "/",
        headers: ROOT_CACHE_HEADERS,
      },
      {
        source: "/",
        has: deniedUaCondition(),
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          ...ROOT_CACHE_HEADERS,
        ],
      },
      {
        source: "/",
        has: crawlerUaCondition(),
        headers: [
          { key: "x-crawler-seo-page", value: "1" },
          ...ROOT_CACHE_HEADERS,
        ],
      },
      {
        source: CRAWLER_SEO_PATH,
        headers: [
          { key: "x-crawler-seo-page", value: "1" },
          { key: "Vary", value: "User-Agent" },
        ],
      },
      {
        source: DENIED_BOT_PATH,
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Vary", value: "User-Agent" },
        ],
      },
      // Internal human file — never a second indexable URL beside `/`.
      {
        source: HUMAN_GATE_PATH,
        headers: [
          { key: "X-Robots-Tag", value: robotsContent(NOINDEX_PAGE_ROBOTS) },
        ],
      },
      ...NOINDEX_PATHS.filter((source) => source !== DENIED_BOT_PATH).map(
        (source) => ({
          source,
          headers: [
            { key: "X-Robots-Tag", value: robotsContent(NOINDEX_PAGE_ROBOTS) },
          ],
        }),
      ),
    ],
  };
}

const next = `${JSON.stringify(buildConfig(), null, 2)}\n`;
const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : null;

if (process.argv.includes("--check")) {
  if (current !== next) {
    console.error(
      "[crawler-delivery] vercel.json is stale — run `node scripts/generate-crawler-delivery.mjs`",
    );
    process.exit(1);
  }
  console.log("[crawler-delivery] vercel.json is up to date");
} else {
  fs.writeFileSync(OUT, next);
  console.log(
    `[crawler-delivery] wrote vercel.json (${UA_PATTERN.split("|").length} crawler + ${DENIED_UA_PATTERN.split("|").length} denied tokens)`,
  );
}
