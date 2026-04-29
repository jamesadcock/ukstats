/**
 * Public API types for the ukstats machine-readable data API.
 * Consumed by GET /api/v1/stats and GET /api/v1/stats/[slug].
 */

/** Native data collection frequency */
export type StatFrequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "irregular";

/** Thematic category for a statistic */
export type StatCategory =
  | "economy"
  | "inflation"
  | "employment"
  | "housing"
  | "health"
  | "population"
  | "transport"
  | "crime"
  | "education"
  | "environment"
  | "immigration";

/** Data quality / revision status of a data point */
export type StatStatus = "final" | "provisional" | "revised" | "estimated";

/** Source / publisher information */
export interface ApiStatSource {
  name: string;
  publisher: string;
  url: string;
}

/** A single time-series observation */
export interface StatDataPoint {
  /** Human-readable period label, e.g. "Q1 2024", "Jan 2024", "2024" */
  period: string;
  /** ISO date string for the first day of the period */
  periodStart: string;
  /** ISO date string for the last day of the period */
  periodEnd: string;
  /** Canonical date for this observation — equals periodEnd */
  date: string;
  value: number;
  status: StatStatus;
}

/** Metadata-only representation used in the list endpoint */
export interface StatSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: StatCategory;
  geography: string;
  frequency: StatFrequency;
  unit: string;
  source: ApiStatSource;
  lastUpdated: string;
}

/** Full time-series dataset returned by the detail endpoint */
export interface StatSeries extends StatSummary {
  data: StatDataPoint[];
}
