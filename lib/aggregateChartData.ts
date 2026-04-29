import { type DataPoint, type Stat } from "../types";

export type Interval = "monthly" | "quarterly" | "annual";

/**
 * Returns the interval options available for a given native data frequency.
 * Annual data has no coarser options, so returns an empty array (no selector shown).
 * Undefined frequency also returns an empty array.
 */
export function getAvailableIntervals(
  frequency: Stat["frequency"],
): Interval[] {
  if (frequency === "monthly") return ["monthly", "quarterly", "annual"];
  if (frequency === "quarterly") return ["quarterly", "annual"];
  return [];
}

/** Returns the quarter key for an ISO date string, e.g. "2024-Q2" */
function quarterKey(isoDate: string): string {
  const d = new Date(isoDate);
  const q = Math.floor(d.getUTCMonth() / 3) + 1;
  return `${d.getUTCFullYear()}-Q${q}`;
}

/** Returns a human-readable quarterly label, e.g. "Q2 2024" */
function quarterLabel(isoDate: string): string {
  const d = new Date(isoDate);
  const q = Math.floor(d.getUTCMonth() / 3) + 1;
  return `Q${q} ${d.getUTCFullYear()}`;
}

/** Returns the year key for an ISO date string, e.g. "2024" */
function yearKey(isoDate: string): string {
  return String(new Date(isoDate).getUTCFullYear());
}

/**
 * Aggregates an array of DataPoints to a coarser interval using the
 * last value of each period. Labels are rewritten to match the interval.
 *
 * - "monthly" → no-op (returns data unchanged)
 * - "quarterly" → one point per quarter, labelled "Q1 2024"
 * - "annual" → one point per year, labelled "2024"
 */
export function aggregateChartData(
  data: DataPoint[],
  interval: Interval,
): DataPoint[] {
  if (interval === "monthly" || data.length === 0) return data;

  const getKey = interval === "quarterly" ? quarterKey : yearKey;
  const getLabel =
    interval === "quarterly"
      ? (d: DataPoint) => quarterLabel(d.date)
      : (d: DataPoint) => yearKey(d.date);

  // Use a Map to retain insertion order and keep the last point per period
  const map = new Map<string, DataPoint>();
  for (const point of data) {
    const key = getKey(point.date);
    map.set(key, { ...point, label: getLabel(point) });
  }

  return Array.from(map.values());
}
