import { type Stat } from "../../types";

export const immigrationStats: Stat[] = [
  {
    slug: "small-boat-arrivals-monthly",
    title: "Small Boat Channel Crossings (Monthly)",
    category: "immigration",
    summary:
      "Number of people detected crossing the English Channel in small boats during the most recent calendar month.",
    currentValue: 1_341,
    unit: "people",
    trend: "down",
    trendDescription: "down from 3,456 in the same month last year",
    source: {
      name: "Home Office / Border Force",
      url: "https://www.gov.uk/government/publications/migrants-detected-crossing-the-english-channel-in-small-boats",
      publishedAt: "2026-04-18",
    },
    lastUpdated: "2026-03-01",
    methodology: `Data are collected by Border Force and published weekly by the Home Office. Figures count individuals detected arriving in the UK via small boat in the English Channel. Data are provisional and subject to revision; finalised figures are published quarterly in the Home Office Immigration System Statistics. Excludes French preventions (individuals turned back or intercepted on the French side).`,
    tags: ["immigration", "small boats", "channel crossings", "border force"],
    featured: true,
  },
  {
    slug: "small-boat-arrivals-ytd",
    title: "Small Boat Crossings — Year to Date",
    category: "immigration",
    summary:
      "Cumulative number of people detected crossing the English Channel in small boats since the start of the current calendar year.",
    currentValue: 6_600,
    unit: "people",
    trend: "down",
    trendDescription: "down from 7,758 at the same point last year",
    source: {
      name: "Home Office / Border Force",
      url: "https://www.gov.uk/government/publications/migrants-detected-crossing-the-english-channel-in-small-boats",
      publishedAt: "2026-04-18",
    },
    lastUpdated: "2026-04-12",
    methodology: `Cumulative daily arrivals from 1 January to the most recent date in the current calendar year. Raw daily data from Home Office weekly ODS time series, aggregated by the ukstats platform. Provisional figures subject to revision. The 95th percentile of detection likely understates true totals due to undetected crossings.`,
    tags: ["immigration", "small boats", "channel crossings", "annual"],
    featured: true,
  },
];
