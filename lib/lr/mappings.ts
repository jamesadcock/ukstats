/**
 * Maps stat slugs to their Land Registry Linked Data API config.
 *
 * To add a new live stat:
 *  1. Find the region slug at https://landregistry.data.gov.uk/app/ukhpi
 *  2. Add an entry below — no other changes required
 */
export interface LrRegionConfig {
  /** Region slug as used in the LR Linked Data URI, e.g. "united-kingdom" */
  region: string;
  /** How many recent months to include in chartData */
  chartCount: number;
}

export const LR_REGION_MAP: Record<string, LrRegionConfig> = {
  // UK average house price (all dwellings, all buyers, non-seasonally adjusted)
  // Source: https://landregistry.data.gov.uk/app/ukhpi/browse?location=http%3A%2F%2Flandregistry.data.gov.uk%2Fid%2Fregion%2Funited-kingdom
  "uk-average-house-price": {
    region: "united-kingdom",
    chartCount: 24,
  },
};
