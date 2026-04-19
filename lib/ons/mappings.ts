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
  /**
   * Optional multiplier applied to every value after parsing.
   * Use to convert raw API units to the display unit, e.g. 0.001 to convert
   * thousands → millions.
   */
  valueScale?: number;
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

  // GDP: quarter-on-quarter growth, chained volume measures, seasonally adjusted
  // Source: https://www.ons.gov.uk/economy/grossdomesticproductgdp/timeseries/IHYQ/pn2
  "uk-gdp-growth-rate": {
    cdid: "IHYQ",
    path: "economy/grossdomesticproductgdp",
    chartPeriod: "quarters",
    chartCount: 20,
  },

  // Unemployment rate (aged 16+, seasonally adjusted), 3-month rolling average
  // Source: https://www.ons.gov.uk/employmentandlabourmarket/peoplenotinwork/unemployment/timeseries/MGSX/lms
  "uk-unemployment-rate": {
    cdid: "MGSX",
    path: "employmentandlabourmarket/peoplenotinwork/unemployment",
    chartPeriod: "months",
    chartCount: 24,
  },

  // UK mid-year population estimate
  // Source: https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/timeseries/UKPOP/pop
  "uk-population-estimate": {
    cdid: "UKPOP",
    path: "peoplepopulationandcommunity/populationandmigration/populationestimates",
    chartPeriod: "years",
    chartCount: 20,
    // ONS returns UKPOP in thousands; divide by 1000 to display in millions
    valueScale: 0.001,
  },

  // Public sector net debt (excl. public sector banks) as % of GDP, NSA
  // Source: https://www.ons.gov.uk/economy/governmentpublicsectorandtaxes/publicsectorfinance/timeseries/HF6X/pusf
  "uk-public-sector-net-debt": {
    cdid: "HF6X",
    path: "economy/governmentpublicsectorandtaxes/publicsectorfinance",
    chartPeriod: "months",
    chartCount: 24,
  },
};
