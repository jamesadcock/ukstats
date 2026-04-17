import { type OnsTimeseriesResponse } from "./types";

const ONS_BASE = "https://www.ons.gov.uk";
const FETCH_TIMEOUT_MS = 8_000;

export class OnsApiError extends Error {
  constructor(
    public readonly cdid: string,
    public readonly url: string,
    cause: unknown,
  ) {
    super(`ONS API fetch failed for CDID ${cdid} at ${url}`);
    this.name = "OnsApiError";
    this.cause = cause;
  }
}

/**
 * Fetches ONS timeseries data for a given topic path and CDID.
 *
 * URL pattern: https://www.ons.gov.uk/{path}/timeseries/{cdid}/data
 *
 * Uses Next.js ISR via fetch `next.revalidate` so data is refreshed daily
 * in production without a full rebuild.
 *
 * Throws OnsApiError on non-2xx response or network failure so callers
 * can catch and fall back gracefully.
 */
export async function fetchOnsTimeseries(
  path: string,
  cdid: string,
): Promise<OnsTimeseriesResponse> {
  const url = `${ONS_BASE}/${path}/timeseries/${cdid}/data`;

  let res: Response;
  try {
    res = await fetch(url, {
      // ISR: revalidate cached response once per day
      next: { revalidate: 86_400 },
      headers: {
        "User-Agent": "ukstats/1.0 (+https://ukstats.info)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (err) {
    throw new OnsApiError(cdid, url, err);
  }

  if (!res.ok) {
    throw new OnsApiError(cdid, url, new Error(`HTTP ${res.status}`));
  }

  return res.json() as Promise<OnsTimeseriesResponse>;
}
