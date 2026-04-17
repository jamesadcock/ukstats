import { type Stat } from "../../types";

export const populationStats: Stat[] = [
  {
    slug: "uk-population-estimate",
    title: "UK Population Estimate",
    category: "population",
    summary:
      "Mid-year estimate of the total usually resident population of the United Kingdom.",
    currentValue: 68.3,
    unit: "million",
    trend: "up",
    trendDescription: "up 0.6% from the previous year",
    source: {
      name: "Office for National Statistics (ONS)",
      url: "https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates",
      publishedAt: "2024-07-15",
    },
    lastUpdated: "2024-07-15",
    methodology: `Mid-year estimates are produced annually for 30 June each year. They are based on the most recent census, updated using administrative data on births, deaths and migration. The estimates are for the usually resident population — people who have been (or intend to be) in the country for at least 12 months.`,
    chartData: [
      { date: "2011-06-01", value: 63.3, label: "2011" },
      { date: "2015-06-01", value: 65.1, label: "2015" },
      { date: "2019-06-01", value: 66.8, label: "2019" },
      { date: "2021-06-01", value: 67.0, label: "2021" },
      { date: "2022-06-01", value: 67.6, label: "2022" },
      { date: "2023-06-01", value: 68.3, label: "2023" },
    ],
    tags: ["population", "census", "demographics"],
    featured: true,
  },
];

export const housingStats: Stat[] = [
  {
    slug: "uk-average-house-price",
    title: "UK Average House Price",
    category: "housing",
    summary:
      "Average price paid for residential property in the UK, including all dwelling types.",
    currentValue: 268000,
    unit: "£",
    trend: "up",
    trendDescription: "up 4.9% year-on-year",
    source: {
      name: "HM Land Registry / ONS UK House Price Index",
      url: "https://www.gov.uk/government/collections/uk-house-price-index-reports",
      publishedAt: "2025-02-26",
    },
    lastUpdated: "2025-02-26",
    methodology: `The UK House Price Index (UK HPI) is based on completed residential property transactions registered at HM Land Registry (England and Wales), Registers of Scotland and Land and Property Services Northern Ireland. Prices are mix-adjusted and seasonally adjusted. New builds are included; cash transactions are not.`,
    chartData: [
      { date: "2020-01-01", value: 231000, label: "Jan 2020" },
      { date: "2021-01-01", value: 249000, label: "Jan 2021" },
      { date: "2022-01-01", value: 272000, label: "Jan 2022" },
      { date: "2023-01-01", value: 285000, label: "Jan 2023" },
      { date: "2024-01-01", value: 255000, label: "Jan 2024" },
      { date: "2025-01-01", value: 268000, label: "Jan 2025" },
    ],
    tags: ["house prices", "property", "housing", "real estate"],
    featured: true,
  },
];

export const educationStats: Stat[] = [
  {
    slug: "uk-gcse-grade-5-pass-rate",
    title: "GCSE Grade 5+ in English and Maths (England)",
    category: "education",
    summary:
      "Percentage of pupils in England achieving grade 5 or above in both English and mathematics GCSEs.",
    currentValue: 48.1,
    unit: "%",
    trend: "flat",
    trendDescription: "broadly stable year-on-year",
    source: {
      name: "Department for Education (DfE)",
      url: "https://explore-education-statistics.service.gov.uk/find-statistics/key-stage-4-performance",
      publishedAt: "2024-10-17",
    },
    lastUpdated: "2024-10-17",
    methodology: `Figures are for state-funded schools in England. Grade 5 is the 'strong pass' threshold introduced in 2017 (roughly equivalent to a high B/low A under the old A*–G system). Pupils are counted once regardless of the school they attended. Independent school results are excluded from headline figures.`,
    chartData: [
      { date: "2018-09-01", value: 43.3, label: "2018" },
      { date: "2019-09-01", value: 43.4, label: "2019" },
      { date: "2022-09-01", value: 44.3, label: "2022" },
      { date: "2023-09-01", value: 47.2, label: "2023" },
      { date: "2024-09-01", value: 48.1, label: "2024" },
    ],
    tags: ["gcse", "education", "schools", "attainment"],
    featured: false,
  },
];
