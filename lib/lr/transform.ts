import { type Stat } from "../../types";
import { type LrItem } from "./types";

const MONTH_LABELS: Record<string, string> = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec",
};

/** "2026-01" → "Jan 2026" */
function refMonthToLabel(refMonth: string): string {
  const [year, mm] = refMonth.split("-");
  return `${MONTH_LABELS[mm] ?? mm} ${year}`;
}

/**
 * Transforms Land Registry house price items (newest-first) into a
 * Partial<Stat> that can be merged over the static baseline.
 */
export function transformLrHousePrices(items: LrItem[]): Partial<Stat> {
  if (items.length === 0) return {};

  const latest = items[0];

  // Trend: compare latest price to 12 months prior (index 11)
  let trend: Stat["trend"] = "flat";
  let trendDescription: string | undefined;
  if (items.length >= 12) {
    const prev = items[11].averagePrice;
    const curr = latest.averagePrice;
    const pct = ((curr - prev) / prev) * 100;
    if (pct > 0.5) {
      trend = "up";
    } else if (pct < -0.5) {
      trend = "down";
    } else {
      trend = "flat";
    }
    const direction =
      trend === "up" ? "up" : trend === "down" ? "down" : "flat";
    trendDescription = `${direction} ${Math.abs(pct).toFixed(1)}% in the 12 months to ${refMonthToLabel(latest.refMonth)}`;
  }

  // chartData: oldest first
  const chartData = [...items].reverse().map((item) => ({
    date: `${item.refMonth}-01`,
    value: item.averagePrice,
    label: refMonthToLabel(item.refMonth),
  }));

  return {
    currentValue: latest.averagePrice,
    lastUpdated: `${latest.refMonth}-01`,
    trend,
    trendDescription,
    chartData,
  };
}
