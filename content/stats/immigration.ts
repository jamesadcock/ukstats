import { type Stat } from "../../types";

export const immigrationStats: Stat[] = [
  {
    slug: "small-boat-arrivals-monthly",
    title: "Small Boat Channel Crossings",
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
    frequency: "monthly",
    tags: ["immigration", "small boats", "channel crossings", "border force"],
    featured: true,
  },
];
