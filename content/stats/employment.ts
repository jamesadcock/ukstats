import { type Stat } from "../../types";

export const employmentStats: Stat[] = [
  {
    slug: "uk-unemployment-rate",
    title: "UK Unemployment Rate",
    category: "employment",
    summary:
      "The proportion of economically active people aged 16 and over who are unemployed.",
    currentValue: 4.4,
    unit: "%",
    trend: "up",
    trendDescription: "up 0.1pp from previous quarter",
    source: {
      name: "Office for National Statistics (ONS) – Labour Force Survey",
      url: "https://www.ons.gov.uk/employmentandlabourmarket/peoplenotinwork/unemployment",
      publishedAt: "2025-03-18",
    },
    lastUpdated: "2025-03-18",
    methodology: `Unemployment figures come from the Labour Force Survey (LFS), a quarterly sample survey of approximately 37,000 households. A person is classed as unemployed if they are: without a job, available to start work within two weeks, and have actively sought work in the past four weeks (ILO definition). Seasonally adjusted.`,
    chartData: [
      { date: "2023-01-01", value: 3.7, label: "Q1 2023" },
      { date: "2023-04-01", value: 4.0, label: "Q2 2023" },
      { date: "2023-07-01", value: 4.3, label: "Q3 2023" },
      { date: "2023-10-01", value: 3.8, label: "Q4 2023" },
      { date: "2024-01-01", value: 4.2, label: "Q1 2024" },
      { date: "2024-04-01", value: 4.4, label: "Q2 2024" },
      { date: "2024-07-01", value: 4.3, label: "Q3 2024" },
      { date: "2024-10-01", value: 4.4, label: "Q4 2024" },
    ],
    tags: ["unemployment", "labour market", "employment"],
    featured: true,
  },
  {
    slug: "uk-median-weekly-earnings",
    title: "UK Median Weekly Earnings",
    category: "employment",
    summary:
      "Median weekly pay for full-time employees in the UK, before tax and other deductions.",
    currentValue: 728,
    unit: "£",
    trend: "up",
    trendDescription: "up £28 (4.0%) year-on-year",
    source: {
      name: "ONS Annual Survey of Hours and Earnings (ASHE)",
      url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours",
      publishedAt: "2024-11-01",
    },
    lastUpdated: "2024-11-01",
    methodology: `The Annual Survey of Hours and Earnings (ASHE) is based on a 1% sample of employee jobs taken from HM Revenue and Customs PAYE records. Weekly earnings figures are for full-time employees on adult rates whose pay was not affected by absence. Median is used rather than mean to reduce the influence of very high earners.`,
    chartData: [
      { date: "2020-04-01", value: 586, label: "Apr 2020" },
      { date: "2021-04-01", value: 611, label: "Apr 2021" },
      { date: "2022-04-01", value: 640, label: "Apr 2022" },
      { date: "2023-04-01", value: 682, label: "Apr 2023" },
      { date: "2024-04-01", value: 728, label: "Apr 2024" },
    ],
    tags: ["wages", "earnings", "pay", "employment"],
    featured: false,
  },
];
