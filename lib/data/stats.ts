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
import {
  fetchLrHousePrices,
  transformLrHousePrices,
  LR_REGION_MAP,
  LrApiError,
} from "../lr";
import {
  fetchWbIndicator,
  transformWbLifeExpectancy,
  WB_LIFE_EXP_MAP,
  WbApiError,
} from "../wb";
import {
  fetchNhseAeTimeSeries,
  transformNhseAe,
  NHSE_AE_MAP,
  NhseApiError,
} from "../nhse";

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

  // ── ONS Timeseries ────────────────────────────────────────────────────────
  const onsConfig = ONS_TIMESERIES_MAP[slug];
  if (onsConfig) {
    try {
      const response = await fetchOnsTimeseries(onsConfig.path, onsConfig.cdid);
      const overrides = transformTimeseries(response, onsConfig);
      return { ...base, ...overrides };
    } catch (err) {
      if (err instanceof OnsApiError) {
        console.warn(
          `[ukstats] ONS live fetch failed for "${slug}" — using static data. Reason: ${err.message}`,
        );
      } else {
        console.warn(
          `[ukstats] Unexpected error fetching ONS data for "${slug}" — using static data.`,
          err,
        );
      }
      return base;
    }
  }

  // ── Land Registry Linked Data ─────────────────────────────────────────────
  const lrConfig = LR_REGION_MAP[slug];
  if (lrConfig) {
    try {
      const items = await fetchLrHousePrices(
        lrConfig.region,
        lrConfig.chartCount,
      );
      const overrides = transformLrHousePrices(items);
      return { ...base, ...overrides };
    } catch (err) {
      if (err instanceof LrApiError) {
        console.warn(
          `[ukstats] Land Registry live fetch failed for "${slug}" — using static data. Reason: ${err.message}`,
        );
      } else {
        console.warn(
          `[ukstats] Unexpected error fetching LR data for "${slug}" — using static data.`,
          err,
        );
      }
      return base;
    }
  }

  // ── World Bank Open Data ──────────────────────────────────────────────────
  const wbConfig = WB_LIFE_EXP_MAP[slug];
  if (wbConfig) {
    try {
      const [malePoints, femalePoints] = await Promise.all([
        fetchWbIndicator(
          wbConfig.countryCode,
          wbConfig.maleIndicator,
          wbConfig.chartCount,
        ),
        fetchWbIndicator(
          wbConfig.countryCode,
          wbConfig.femaleIndicator,
          wbConfig.chartCount,
        ),
      ]);
      const overrides = transformWbLifeExpectancy(malePoints, femalePoints);
      return { ...base, ...overrides };
    } catch (err) {
      if (err instanceof WbApiError) {
        console.warn(
          `[ukstats] World Bank live fetch failed for "${slug}" — using static data. Reason: ${err.message}`,
        );
      } else {
        console.warn(
          `[ukstats] Unexpected error fetching WB data for "${slug}" — using static data.`,
          err,
        );
      }
      return base;
    }
  }

  // ── NHS England A&E ──────────────────────────────────────────────────────
  const nhseConfig = NHSE_AE_MAP[slug];
  if (nhseConfig) {
    try {
      const points = await fetchNhseAeTimeSeries(nhseConfig.chartCount);
      const overrides = transformNhseAe(points);
      return { ...base, ...overrides };
    } catch (err) {
      if (err instanceof NhseApiError) {
        console.warn(
          `[ukstats] NHS England live fetch failed for "${slug}" — using static data. Reason: ${err.message}`,
        );
      } else {
        console.warn(
          `[ukstats] Unexpected error fetching NHSE data for "${slug}" — using static data.`,
          err,
        );
      }
      return base;
    }
  }

  return base; // no live source configured
}
