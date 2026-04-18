import { type Stat } from "../../types";

export const healthStats: Stat[] = [
  {
    slug: "uk-life-expectancy-at-birth",
    title: "UK Life Expectancy at Birth",
    category: "health",
    summary:
      "Average number of years a newborn is expected to live, based on current age-specific mortality rates.",
    currentValue: "Male 79.1 / Female 83.0",
    unit: "years",
    trend: "up",
    trendDescription: "Male 79.1 / Female 83.0 years (2022–2024 average)",
    source: {
      name: "Office for National Statistics (ONS)",
      url: "https://www.ons.gov.uk/peoplepopulationandcommunity/healthandsocialcare/healthandlifeexpectancies",
      publishedAt: "2025-12-10",
    },
    lastUpdated: "2025-12-10",
    methodology: `Life expectancy is calculated using age-specific mortality rates from the ONS National Life Tables, applied to a hypothetical cohort. Figures are period life expectancies (not cohort) over a three-year rolling average. They represent the average lifespan if current conditions persisted, not a prediction of actual longevity.`,
    chartData: [
      { date: "2010-01-01", value: 78.2, label: "Male 2010" },
      { date: "2015-01-01", value: 79.0, label: "Male 2015" },
      { date: "2020-01-01", value: 78.7, label: "Male 2020" },
      { date: "2022-01-01", value: 79.1, label: "Male 2022" },
    ],
    tags: ["life expectancy", "mortality", "health", "population"],
    featured: true,
  },
  {
    slug: "nhs-a-and-e-4-hour-wait",
    title: "NHS A&E 4-Hour Wait Target",
    category: "health",
    summary:
      "Percentage of A&E attendances seen, treated, admitted or discharged within four hours.",
    currentValue: 77.1,
    unit: "%",
    trend: "up",
    trendDescription: "up from 72.3% in the same month last year",
    source: {
      name: "NHS England",
      url: "https://www.england.nhs.uk/statistics/statistical-work-areas/ae-waiting-times-and-activity/",
      publishedAt: "2026-04-16",
    },
    lastUpdated: "2026-03-01",
    methodology: `Data are collected monthly from all NHS Type 1 (major) A&E departments in England. The standard is that 95% of patients should be seen within four hours; this has not been consistently met since 2013–14. Figures exclude walk-in centres and minor injury units (Type 3 facilities).`,
    chartData: [
      { date: "2020-01-01", value: 76.3, label: "Jan 2020" },
      { date: "2021-01-01", value: 71.9, label: "Jan 2021" },
      { date: "2022-01-01", value: 65.6, label: "Jan 2022" },
      { date: "2023-01-01", value: 65.2, label: "Jan 2023" },
      { date: "2024-01-01", value: 72.3, label: "Jan 2024" },
      { date: "2025-01-01", value: 70.7, label: "Jan 2025" },
      { date: "2026-03-01", value: 77.1, label: "Mar 2026" },
    ],
    tags: ["nhs", "a&e", "waiting times", "health"],
    featured: true,
  },
];
