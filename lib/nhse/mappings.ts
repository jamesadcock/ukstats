/**
 * Maps stat slugs to NHS England A&E API config.
 */
export interface NhseAeConfig {
  /** How many recent months to include in chartData */
  chartCount: number;
}

export const NHSE_AE_MAP: Record<string, NhseAeConfig> = {
  // NHS England A&E 4-hour performance — all departments, England aggregate
  // Source: https://www.england.nhs.uk/statistics/statistical-work-areas/ae-waiting-times-and-activity/
  "nhs-a-and-e-4-hour-wait": {
    chartCount: 24,
  },
};
