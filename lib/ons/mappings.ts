/**
 * Maps our stat slugs to ONS timeseries configuration.
 *
 * To add a new live stat:
 *  1. Find the CDID on www.ons.gov.uk (shown on any timeseries page)
 *  2. Note the URL path segment (the part between ons.gov.uk and /timeseries)
 *  3. Decide whether to chart months, quarters, or years, and how many periods
 *  4. Add an entry below — no other changes required
 */

export type ChartPeriod = "months" | "quarters" | "years";

export interface OnsTimeseriesConfig {
  /** ONS CDID identifier, e.g. "L55O" */
  cdid: string;
  /** Topic path segment, e.g. "economy/inflationandpriceindices" */
  path: string;
  /** Which time period granularity to use for the chart */
  chartPeriod: ChartPeriod;
  /** How many recent periods to include in chartData */
  chartCount: number;
}

export const ONS_TIMESERIES_MAP: Record<string, OnsTimeseriesConfig> = {
  // CPIH 12-month rate — all items, 2015=100
  // Source: https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/L55O
  "uk-inflation-rate-cpi": {
    cdid: "L55O",
    path: "economy/inflationandpriceindices",
    chartPeriod: "months",
    chartCount: 24,
  },
};
