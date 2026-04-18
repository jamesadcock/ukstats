import { type Stat } from "../../types";
import { type HoSmallBoatRow } from "./types";

const MONTH_LABELS = [
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

interface MonthlyBucket {
  /** "YYYY-MM" */
  key: string;
  /** First day of the month as ISO date string */
  firstDay: string;
  label: string;
  total: number;
  year: number;
  month: number;
}

/**
 * Groups daily rows into monthly buckets, sorted oldest → newest.
 */
function buildMonthlyBuckets(rows: HoSmallBoatRow[]): MonthlyBucket[] {
  const map = new Map<string, MonthlyBucket>();

  for (const row of rows) {
    const [yearStr, monthStr] = row.date.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const key = `${year}-${String(month).padStart(2, "0")}`;

    if (!map.has(key)) {
      map.set(key, {
        key,
        firstDay: `${year}-${String(month).padStart(2, "0")}-01`,
        label: `${MONTH_LABELS[month - 1]} ${year}`,
        total: 0,
        year,
        month,
      });
    }
    map.get(key)!.total += row.arrived;
  }

  return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Returns the most recent **complete** calendar month — i.e. any month that
 * is not the current in-progress month.
 */
function latestCompleteMonth(
  buckets: MonthlyBucket[],
): MonthlyBucket | undefined {
  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const complete = buckets.filter((b) => b.key < currentKey);
  return complete[complete.length - 1];
}

/**
 * Transforms daily row data into a `Partial<Stat>` representing the most
 * recent complete calendar month's total arrivals.
 *
 * Trend is compared to the same month in the prior year.
 */
export function transformSmallBoatMonthly(
  rows: HoSmallBoatRow[],
): Partial<Stat> {
  if (rows.length === 0) return {};

  const buckets = buildMonthlyBuckets(rows);
  const latest = latestCompleteMonth(buckets);
  if (!latest) return {};

  // Same month last year
  const priorKey = `${latest.year - 1}-${String(latest.month).padStart(2, "0")}`;
  const prior = buckets.find((b) => b.key === priorKey);

  let trend: Stat["trend"] = "flat";
  let trendDescription: string | undefined;
  if (prior) {
    const diff = latest.total - prior.total;
    // Treat ±5% as flat
    const threshold = prior.total * 0.05;
    if (diff > threshold) trend = "up";
    else if (diff < -threshold) trend = "down";
    const direction =
      trend === "up" ? "up" : trend === "down" ? "down" : "unchanged";
    trendDescription = `${direction} from ${prior.total.toLocaleString()} in ${prior.label}`;
  }

  // Chart: last 24 complete months, oldest-first
  const chartBuckets = buckets.filter((b) => b.key <= latest.key).slice(-24);

  const chartData = chartBuckets.map((b) => ({
    date: b.firstDay,
    value: b.total,
    label: b.label,
  }));

  return {
    currentValue: latest.total,
    lastUpdated: latest.firstDay,
    trend,
    trendDescription,
    chartData,
  };
}

/**
 * Transforms daily row data into a `Partial<Stat>` representing the
 * year-to-date cumulative arrivals for the current calendar year.
 *
 * The chart shows the full annual total for each prior year for comparison.
 */
export function transformSmallBoatYtd(rows: HoSmallBoatRow[]): Partial<Stat> {
  if (rows.length === 0) return {};

  const now = new Date();
  const currentYear = now.getFullYear();

  // Sum YTD for current year
  const ytdRows = rows.filter((r) => r.date.startsWith(`${currentYear}-`));
  const ytdTotal = ytdRows.reduce((sum, r) => sum + r.arrived, 0);

  if (ytdTotal === 0) return {};

  // Latest date in current year
  const lastYtdDate =
    ytdRows.length > 0
      ? ytdRows[ytdRows.length - 1].date
      : now.toISOString().slice(0, 10);

  // Same-point comparison: sum of prior year up to same day-of-year
  const lastYtdDateObj = new Date(lastYtdDate);
  const dayOfYear = Math.floor(
    (lastYtdDateObj.getTime() - new Date(`${currentYear}-01-01`).getTime()) /
      86_400_000,
  );
  const priorYearCutoff = new Date(
    currentYear - 1,
    lastYtdDateObj.getMonth(),
    lastYtdDateObj.getDate(),
  )
    .toISOString()
    .slice(0, 10);
  const priorYearStart = `${currentYear - 1}-01-01`;
  const priorYtdTotal = rows
    .filter((r) => r.date >= priorYearStart && r.date <= priorYearCutoff)
    .reduce((sum, r) => sum + r.arrived, 0);

  let trend: Stat["trend"] = "flat";
  let trendDescription: string | undefined;
  if (priorYtdTotal > 0) {
    const diff = ytdTotal - priorYtdTotal;
    const threshold = priorYtdTotal * 0.05;
    if (diff > threshold) trend = "up";
    else if (diff < -threshold) trend = "down";
    const direction =
      trend === "up" ? "up" : trend === "down" ? "down" : "unchanged";
    trendDescription = `${direction} from ${priorYtdTotal.toLocaleString()} at the same point last year`;
  }

  // Chart: annual totals for each prior complete year, then current YTD
  const annualTotals = new Map<number, number>();
  for (const row of rows) {
    const yr = parseInt(row.date.slice(0, 4), 10);
    if (yr < currentYear) {
      annualTotals.set(yr, (annualTotals.get(yr) ?? 0) + row.arrived);
    }
  }

  const chartData = Array.from(annualTotals.entries())
    .sort(([a], [b]) => a - b)
    .map(([yr, total]) => ({
      date: `${yr}-01-01`,
      value: total,
      label: `${yr} (full year)`,
    }));

  // Append current YTD bar
  chartData.push({
    date: `${currentYear}-01-01`,
    value: ytdTotal,
    label: `${currentYear} (Jan–${MONTH_LABELS[lastYtdDateObj.getMonth()]})`,
  });

  void dayOfYear; // suppress unused warning

  return {
    currentValue: ytdTotal,
    lastUpdated: lastYtdDate,
    trend,
    trendDescription,
    chartData,
  };
}
