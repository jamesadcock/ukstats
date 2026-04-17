import { type Category } from "./category";

export interface DataPoint {
  date: string; // ISO date string, e.g. "2024-01-01"
  value: number;
  label?: string; // optional display label, e.g. "Q1 2024"
}

export interface StatSource {
  name: string;
  url: string;
  publishedAt: string; // ISO date
}

export interface Stat {
  slug: string;
  title: string;
  category: Category;
  summary: string; // one sentence, plain text
  currentValue: number | string;
  unit: string; // e.g. "%", "£bn", "per 100k", "million"
  source: StatSource;
  lastUpdated: string; // ISO date
  methodology: string; // Markdown prose
  chartData?: DataPoint[];
  tags: string[];
  featured?: boolean;
  trend?: "up" | "down" | "flat"; // direction of latest change
  trendDescription?: string; // e.g. "up 0.2pp from last quarter"
}
