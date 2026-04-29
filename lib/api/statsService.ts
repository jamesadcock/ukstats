import { type Stat, type DataPoint } from "../../types";
import type {
  StatSummary,
  StatSeries,
  StatDataPoint,
  StatFrequency,
  StatCategory,
  ApiStatSource,
} from "../../types/api";

// ─── Unit normalisation ──────────────────────────────────────────────────────

const UNIT_MAP: Record<string, string> = {
  "%": "percent",
  "% of GDP": "percent-of-gdp",
  "£": "gbp",
  "£bn": "gbp-billions",
  million: "million",
  people: "people",
  years: "years",
};

function mapUnit(unit: string): string {
  return UNIT_MAP[unit] ?? unit;
}

// ─── Frequency mapping ───────────────────────────────────────────────────────

function mapFrequency(freq: Stat["frequency"]): StatFrequency {
  switch (freq) {
    case "monthly":
      return "monthly";
    case "quarterly":
      return "quarterly";
    case "annual":
      return "yearly";
    default:
      return "irregular";
  }
}

// ─── Category mapping ────────────────────────────────────────────────────────

const VALID_CATEGORIES = new Set<string>([
  "economy",
  "inflation",
  "employment",
  "housing",
  "health",
  "population",
  "transport",
  "crime",
  "education",
  "environment",
  "immigration",
]);

function mapCategory(cat: string): StatCategory {
  return (VALID_CATEGORIES.has(cat) ? cat : "economy") as StatCategory;
}

// ─── Source mapping ──────────────────────────────────────────────────────────

function mapSource(source: Stat["source"]): ApiStatSource {
  // Extract publisher abbreviation from trailing "(ABC)" pattern
  const match = source.name.match(/\(([^)]+)\)\s*$/);
  const publisher = match ? match[1] : source.name;
  return { name: source.name, publisher, url: source.url };
}

// ─── Period bounds ───────────────────────────────────────────────────────────

const MONTH_ABBR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface PeriodBounds {
  periodStart: string;
  periodEnd: string;
  derivedPeriod: string;
}

function getPeriodBounds(date: string, frequency: StatFrequency): PeriodBounds {
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth(); // 0-indexed

  if (frequency === "monthly") {
    const mm = String(month + 1).padStart(2, "0");
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return {
      periodStart: `${year}-${mm}-01`,
      periodEnd: `${year}-${mm}-${String(lastDay).padStart(2, "0")}`,
      derivedPeriod: `${MONTH_ABBR[month]} ${year}`,
    };
  }

  if (frequency === "quarterly") {
    const q = Math.floor(month / 3);
    const startMonth = q * 3;
    const endMonth = startMonth + 2;
    const lastDay = new Date(Date.UTC(year, endMonth + 1, 0)).getUTCDate();
    return {
      periodStart: `${year}-${String(startMonth + 1).padStart(2, "0")}-01`,
      periodEnd: `${year}-${String(endMonth + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`,
      derivedPeriod: `Q${q + 1} ${year}`,
    };
  }

  if (frequency === "yearly") {
    return {
      periodStart: `${year}-01-01`,
      periodEnd: `${year}-12-31`,
      derivedPeriod: `${year}`,
    };
  }

  // irregular / unknown — use the raw date
  return { periodStart: date, periodEnd: date, derivedPeriod: date };
}

// ─── DataPoint → StatDataPoint ───────────────────────────────────────────────

function toStatDataPoint(
  point: DataPoint,
  frequency: StatFrequency,
): StatDataPoint {
  const { periodStart, periodEnd, derivedPeriod } = getPeriodBounds(
    point.date,
    frequency,
  );
  return {
    period: point.label ?? derivedPeriod,
    periodStart,
    periodEnd,
    date: periodEnd,
    value: point.value,
    status: "final",
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function toStatSummary(stat: Stat): StatSummary {
  return {
    id: stat.slug,
    slug: stat.slug,
    name: stat.title,
    description: stat.summary,
    category: mapCategory(stat.category),
    geography: "UK",
    frequency: mapFrequency(stat.frequency),
    unit: mapUnit(stat.unit),
    source: mapSource(stat.source),
    lastUpdated: new Date(stat.lastUpdated).toISOString(),
  };
}

export function toStatSeries(stat: Stat): StatSeries {
  const summary = toStatSummary(stat);
  const frequency = mapFrequency(stat.frequency);
  const data = (stat.chartData ?? [])
    .map((point) => toStatDataPoint(point, frequency))
    .sort((a, b) => a.date.localeCompare(b.date));
  return { ...summary, data };
}
