import {
  type OnsTimeseriesResponse,
  type OnsTimeseriesMonth,
  type OnsTimeseriesQuarter,
  type OnsTimeseriesYear,
} from "./types";
import { type OnsTimeseriesConfig, type ChartPeriod } from "./mappings";
import { type Stat, type DataPoint } from "../../types";

// Converts "2026 FEB" → "2026-02-01" (ISO date string)
const MONTH_TO_NUM: Record<string, string> = {
  JAN: "01",
  FEB: "02",
  MAR: "03",
  APR: "04",
  MAY: "05",
  JUN: "06",
  JUL: "07",
  AUG: "08",
  SEP: "09",
  OCT: "10",
  NOV: "11",
  DEC: "12",
};

function monthDateToIso(date: string): string {
  const [year, mon] = date.trim().split(/\s+/);
  const num = MONTH_TO_NUM[mon?.toUpperCase()] ?? "01";
  return `${year}-${num}-01`;
}

// Converts "2025 Q3" → "2025-07-01"
const QUARTER_TO_MONTH: Record<string, string> = {
  Q1: "01",
  Q2: "04",
  Q3: "07",
  Q4: "10",
};

function quarterDateToIso(date: string): string {
  const [year, q] = date.trim().split(/\s+/);
  const mon = QUARTER_TO_MONTH[q?.toUpperCase()] ?? "01";
  return `${year}-${mon}-01`;
}

// Human-readable label: "2026 FEB" → "Feb 2026"
function monthLabel(m: OnsTimeseriesMonth): string {
  const abbr = m.date.trim().split(/\s+/)[1] ?? "";
  const capitalised = abbr.charAt(0) + abbr.slice(1).toLowerCase();
  return `${capitalised} ${m.year}`;
}

// Human-readable label: "2025 Q3" → "Q3 2025"
function quarterLabel(q: OnsTimeseriesQuarter): string {
  const parts = q.date.trim().split(/\s+/);
  return `${parts[1] ?? ""} ${q.year}`;
}

function parseValue(raw: string): number | null {
  const n = parseFloat(raw);
  return isNaN(n) ? null : n;
}

function buildChartData(
  response: OnsTimeseriesResponse,
  period: ChartPeriod,
  count: number,
): DataPoint[] {
  if (period === "months") {
    return response.months.slice(-count).map((m) => ({
      date: monthDateToIso(m.date),
      value: parseValue(m.value) ?? 0,
      label: monthLabel(m),
    }));
  }
  if (period === "quarters") {
    return (response.quarters as OnsTimeseriesQuarter[])
      .slice(-count)
      .map((q) => ({
        date: quarterDateToIso(q.date),
        value: parseValue(q.value) ?? 0,
        label: quarterLabel(q),
      }));
  }
  // years
  return (response.years as OnsTimeseriesYear[]).slice(-count).map((y) => ({
    date: `${y.year}-01-01`,
    value: parseValue(y.value) ?? 0,
    label: y.year,
  }));
}

function deriveTrend(
  latest: number,
  previous: number,
): { trend: Stat["trend"]; trendDescription: string } {
  const diff = parseFloat((latest - previous).toFixed(2));
  if (diff > 0) {
    return {
      trend: "up",
      trendDescription: `up ${diff}pp from previous month`,
    };
  }
  if (diff < 0) {
    return {
      trend: "down",
      trendDescription: `down ${Math.abs(diff)}pp from previous month`,
    };
  }
  return { trend: "flat", trendDescription: "unchanged from previous month" };
}

/**
 * Transforms a raw ONS timeseries response into a Partial<Stat> that
 * can be merged over the static baseline for the same slug.
 */
export function transformTimeseries(
  response: OnsTimeseriesResponse,
  config: OnsTimeseriesConfig,
): Partial<Stat> {
  const periods =
    config.chartPeriod === "months"
      ? response.months
      : config.chartPeriod === "quarters"
        ? response.quarters
        : response.years;

  if (!periods || periods.length === 0) return {};

  const latest = periods[periods.length - 1];
  const previous = periods.length >= 2 ? periods[periods.length - 2] : null;

  const latestValue = parseValue(latest.value);
  if (latestValue === null) return {};

  const trendInfo =
    previous && parseValue(previous.value) !== null
      ? deriveTrend(latestValue, parseValue(previous.value)!)
      : {};

  const chartData = buildChartData(
    response,
    config.chartPeriod,
    config.chartCount,
  );
  const lastUpdated =
    "updateDate" in latest && latest.updateDate
      ? latest.updateDate.split("T")[0]
      : new Date().toISOString().split("T")[0];

  return {
    currentValue: latestValue,
    lastUpdated,
    chartData,
    ...trendInfo,
  };
}
