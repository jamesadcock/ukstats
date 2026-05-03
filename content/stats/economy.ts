import { type Stat } from "../../types";

export const economyStats: Stat[] = [
  {
    slug: "uk-gdp-growth-rate",
    title: "UK GDP Growth Rate",
    category: "economy",
    summary:
      "The percentage change in the UK's Gross Domestic Product compared with the previous quarter.",
    currentValue: 0.1,
    unit: "%",
    trend: "flat",
    trendDescription: "unchanged from previous quarter",
    source: {
      name: "Office for National Statistics (ONS)",
      url: "https://www.ons.gov.uk/economy/grossdomesticproductgdp",
      publishedAt: "2025-02-12",
    },
    lastUpdated: "2025-02-12",
    methodology: `GDP is measured using three approaches — output, expenditure and income — which are then balanced to produce a single estimate. The quarterly growth rate compares the latest quarter's chained volume measure with the preceding quarter. Figures are seasonally adjusted and expressed in constant (2019) prices.

Source methodology: [ONS GDP methodology](https://www.ons.gov.uk/economy/grossdomesticproductgdp/methodologies/grossdomesticproductgdpqmi).`,
    frequency: "quarterly",
    tags: ["gdp", "growth", "economy", "quarterly"],
    featured: true,
  },
  {
    slug: "uk-inflation-rate-cpi",
    title: "UK Inflation Rate (CPI)",
    category: "economy",
    summary:
      "The Consumer Prices Index (CPI) 12-month rate measures the percentage change in the price of goods and services over the past year.",
    currentValue: 2.8,
    unit: "%",
    trend: "down",
    trendDescription: "down from 3.0% in the previous month",
    source: {
      name: "Office for National Statistics (ONS)",
      url: "https://www.ons.gov.uk/economy/inflationandpriceindices",
      publishedAt: "2025-03-26",
    },
    lastUpdated: "2025-03-26",
    methodology: `CPI measures the average change in prices paid by consumers for a basket of goods and services. The basket is updated annually to reflect changing spending patterns. The 12-month rate compares the current month's index value to the same month in the previous year.

The ONS follows the [European System of Accounts](https://ec.europa.eu/eurostat/web/esa-2010) harmonised methodology, allowing international comparisons.`,
    frequency: "monthly",
    tags: ["inflation", "cpi", "prices", "economy"],
    featured: true,
  },
  {
    slug: "uk-public-sector-net-debt",
    title: "UK Public Sector Net Debt",
    category: "economy",
    summary:
      "Public sector net debt as a percentage of GDP, a key measure of the government's overall debt burden.",
    currentValue: 97.2,
    unit: "% of GDP",
    trend: "up",
    trendDescription: "up 1.4pp year-on-year",
    source: {
      name: "Office for National Statistics (ONS)",
      url: "https://www.ons.gov.uk/economy/governmentpublicsectorandtaxes/publicspending",
      publishedAt: "2025-03-25",
    },
    lastUpdated: "2025-03-25",
    methodology: `Public sector net debt is calculated as total financial liabilities minus liquid financial assets. It excludes the Bank of England unless stated. Expressed as a percentage of GDP using the latest ONS GDP estimate. Revisions are routine as GDP estimates are updated.`,
    frequency: "monthly",
    tags: ["debt", "public finances", "gdp", "economy"],
    featured: true,
  },
];
