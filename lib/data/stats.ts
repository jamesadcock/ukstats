import "server-only";
import {
  economyStats,
  employmentStats,
  healthStats,
  populationStats,
  housingStats,
  educationStats,
} from "../../content/stats";
import { type Stat, type Category } from "../../types";
import {
  fetchOnsTimeseries,
  transformTimeseries,
  ONS_TIMESERIES_MAP,
  OnsApiError,
} from "../ons";

const ALL_STATS: Stat[] = [
  ...economyStats,
  ...employmentStats,
  ...healthStats,
  ...populationStats,
  ...housingStats,
  ...educationStats,
];

// ─── Synchronous helpers (safe for generateStaticParams) ─────────────────────

export function getAllStats(): Stat[] {
  return ALL_STATS;
}

export function getStatBySlug(slug: string): Stat | undefined {
  return ALL_STATS.find((s) => s.slug === slug);
}

export function getStatsByCategory(category: Category): Stat[] {
  return ALL_STATS.filter((s) => s.category === category);
}

export function getFeaturedStats(): Stat[] {
  return ALL_STATS.filter((s) => s.featured === true);
}

export function getAllSlugs(): string[] {
  return ALL_STATS.map((s) => s.slug);
}

// ─── Live data ────────────────────────────────────────────────────────────────

/**
 * Returns the stat for `slug`, merging live ONS data over the static baseline
 * when a mapping exists in ONS_TIMESERIES_MAP.
 *
 * Falls back to the static value silently if the ONS API is unreachable or
 * returns an error — the site never breaks due to an upstream failure.
 */
export async function getStatBySlugWithLiveData(
  slug: string,
): Promise<Stat | undefined> {
  const base = getStatBySlug(slug);
  if (!base) return undefined;

  const config = ONS_TIMESERIES_MAP[slug];
  if (!config) return base; // no live source configured — return static

  try {
    const response = await fetchOnsTimeseries(config.path, config.cdid);
    const overrides = transformTimeseries(response, config);
    return { ...base, ...overrides };
  } catch (err) {
    if (err instanceof OnsApiError) {
      console.warn(
        `[ukstats] ONS live fetch failed for "${slug}" — using static data. Reason: ${err.message}`,
      );
    } else {
      console.warn(
        `[ukstats] Unexpected error fetching live data for "${slug}" — using static data.`,
        err,
      );
    }
    return base; // silent fallback
  }
}
