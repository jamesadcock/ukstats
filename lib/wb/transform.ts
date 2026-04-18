import { type Stat } from "../../types";
import { type WbDatapoint } from "./types";

/**
 * Transforms World Bank life expectancy datapoints (newest-first) into a
 * Partial<Stat> that can be merged over the static baseline.
 *
 * chartData uses the male series only (oldest-first), consistent with the
 * existing static chartData on this stat.
 *
 * currentValue is formatted as "Male X.X / Female X.X" to match the
 * existing static baseline string format.
 */
export function transformWbLifeExpectancy(
  malePoints: WbDatapoint[],
  femalePoints: WbDatapoint[],
): Partial<Stat> {
  if (malePoints.length === 0 || femalePoints.length === 0) return {};

  const latestMale = malePoints[0];
  const latestFemale = femalePoints[0];
  const maleVal = latestMale.value as number;
  const femaleVal = latestFemale.value as number;

  // Trend: compare latest male value to 5 years prior (index 4)
  let trend: Stat["trend"] = "flat";
  if (malePoints.length >= 5) {
    const prev = malePoints[4].value as number;
    const diff = maleVal - prev;
    if (diff > 0.2) trend = "up";
    else if (diff < -0.2) trend = "down";
  }

  const year = latestMale.date;
  const trendDescription = `Male ${maleVal.toFixed(1)} / Female ${femaleVal.toFixed(1)} years (${year})`;

  // chartData: male series reversed to oldest-first
  const chartData = [...malePoints].reverse().map((pt) => ({
    date: `${pt.date}-01-01`,
    value: pt.value as number,
    label: `Male ${pt.date}`,
  }));

  return {
    currentValue: `Male ${maleVal.toFixed(1)} / Female ${femaleVal.toFixed(1)}`,
    lastUpdated: `${year}-12-31`,
    trend,
    trendDescription,
    chartData,
  };
}
