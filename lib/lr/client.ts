import { type LrListResponse, type LrItem, LrApiError } from "./types";

const LR_BASE = "https://landregistry.data.gov.uk";
const FETCH_TIMEOUT_MS = 8_000;

/**
 * Fetches the most recent `count` months of UK average house price data from
 * the HM Land Registry Linked Data API.
 *
 * URL: https://landregistry.data.gov.uk/data/ukhpi/region/united-kingdom.json
 *      ?_pageSize={count}&_sort=-refMonth&_properties=averagePrice,refMonth
 *
 * Uses Next.js ISR via fetch `next.revalidate` so data is refreshed daily
 * in production without a full rebuild.
 *
 * Throws LrApiError on non-2xx response or network failure so callers
 * can catch and fall back gracefully.
 */
export async function fetchLrHousePrices(
  region: string,
  count: number,
): Promise<LrItem[]> {
  const url =
    `${LR_BASE}/data/ukhpi/region/${region}.json` +
    `?_pageSize=${count}&_sort=-refMonth&_properties=averagePrice,refMonth`;

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
    throw new LrApiError(url, err);
  }

  if (!res.ok) {
    throw new LrApiError(url, new Error(`HTTP ${res.status}`));
  }

  const json = (await res.json()) as LrListResponse;
  return json.result.items;
}
