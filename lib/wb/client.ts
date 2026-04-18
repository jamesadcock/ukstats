import { type WbResponse, type WbDatapoint, WbApiError } from "./types";

const WB_BASE = "https://api.worldbank.org/v2";
const FETCH_TIMEOUT_MS = 8_000;

/**
 * Fetches the most recent `mrv` years of data for a World Bank indicator.
 *
 * URL: https://api.worldbank.org/v2/country/{countryCode}/indicator/{indicatorId}
 *      ?format=json&mrv={mrv}
 *
 * Returns data points newest-first with null values filtered out.
 *
 * Uses Next.js ISR via fetch `next.revalidate` so data is refreshed daily
 * in production without a full rebuild.
 *
 * Throws WbApiError on non-2xx response or network failure so callers
 * can catch and fall back gracefully.
 */
export async function fetchWbIndicator(
  countryCode: string,
  indicatorId: string,
  mrv: number,
): Promise<WbDatapoint[]> {
  const url =
    `${WB_BASE}/country/${countryCode}/indicator/${indicatorId}` +
    `?format=json&mrv=${mrv}`;

  let res: Response;
  try {
    res = await fetch(url, {
      next: { revalidate: 86_400 },
      headers: {
        "User-Agent": "ukstats/1.0 (+https://ukstats.info)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (err) {
    throw new WbApiError(url, err);
  }

  if (!res.ok) {
    throw new WbApiError(url, new Error(`HTTP ${res.status}`));
  }

  const json = (await res.json()) as WbResponse;
  // Filter out null-value entries (years with no data yet)
  return json[1].filter((d) => d.value !== null);
}
