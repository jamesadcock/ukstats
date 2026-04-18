import { type Stat } from "../../types";
import { type NhseAeDataPoint } from "./types";

/**
 * Transforms NHS England A&E performance data (newest-first) into a
 * Partial<Stat> that can be merged over the static baseline.
 */
export function transformNhseAe(points: NhseAeDataPoint[]): Partial<Stat> {
  if (points.length === 0) return {};

  const latest = points[0];

  // Trend: compare latest to 12 months prior (index 11), ±0.5% threshold
  let trend: Stat["trend"] = "flat";
  let trendDescription: string | undefined;
  if (points.length >= 12) {
    const prev = points[11].percentage;
    const curr = latest.percentage;
    const diff = curr - prev;
    if (diff > 0.5) trend = "up";
    else if (diff < -0.5) trend = "down";
    const direction =
      trend === "up" ? "up" : trend === "down" ? "down" : "unchanged";
    trendDescription = `${direction} from ${prev.toFixed(1)}% in the same month last year`;
  }

  // chartData: oldest-first
  const chartData = [...points].reverse().map((pt) => ({
    date: pt.date,
    value: pt.percentage,
    label: pt.label,
  }));

  return {
    currentValue: latest.percentage,
    lastUpdated: latest.date,
    trend,
    trendDescription,
    chartData,
  };
}
