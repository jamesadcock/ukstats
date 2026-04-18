/**
 * Maps stat slugs to World Bank life expectancy API config.
 *
 * To add a new stat:
 *  1. Find indicator IDs at https://data.worldbank.org/indicator
 *  2. Add an entry below — no other changes required
 */
export interface WbLifeExpConfig {
  /** ISO 3166-1 alpha-2 country code, e.g. "GB" */
  countryCode: string;
  /** World Bank indicator ID for male life expectancy */
  maleIndicator: string;
  /** World Bank indicator ID for female life expectancy */
  femaleIndicator: string;
  /** How many recent years to include in chartData */
  chartCount: number;
}

export const WB_LIFE_EXP_MAP: Record<string, WbLifeExpConfig> = {
  // UK life expectancy at birth — period estimate, both sexes
  // Source: https://data.worldbank.org/indicator/SP.DYN.LE00.MA.IN?locations=GB
  "uk-life-expectancy-at-birth": {
    countryCode: "GB",
    maleIndicator: "SP.DYN.LE00.MA.IN",
    femaleIndicator: "SP.DYN.LE00.FE.IN",
    chartCount: 20,
  },
};
