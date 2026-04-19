"use client";

import { useState, useMemo } from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { type DataPoint } from "../../types";

interface LineChartProps {
  data: DataPoint[];
  unit: string;
  colour?: string;
}

type RangeKey = "1Y" | "2Y" | "5Y" | "10Y" | "Max";

const RANGES: { label: RangeKey; years: number | null }[] = [
  { label: "1Y", years: 1 },
  { label: "2Y", years: 2 },
  { label: "5Y", years: 5 },
  { label: "10Y", years: 10 },
  { label: "Max", years: null },
];

function filterByRange(data: DataPoint[], years: number | null): DataPoint[] {
  if (years === null || data.length === 0) return data;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - years);
  return data.filter((d) => new Date(d.date) >= cutoff);
}

export default function LineChart({
  data,
  unit,
  colour = "#2563eb",
}: LineChartProps) {
  const [range, setRange] = useState<RangeKey>("Max");

  // Determine which range buttons are meaningful given the data span
  const oldestDate = useMemo(() => {
    if (data.length === 0) return null;
    return data.reduce((min, d) => (d.date < min ? d.date : min), data[0].date);
  }, [data]);

  const isRangeAvailable = (years: number | null) => {
    if (years === null || !oldestDate) return true;
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - years);
    return new Date(oldestDate) < cutoff;
  };

  const visibleRanges = RANGES.filter(({ years }) => isRangeAvailable(years));

  const selectedRange = RANGES.find((r) => r.label === range)!;
  const filteredData = useMemo(
    () => filterByRange(data, selectedRange.years),
    [data, selectedRange.years],
  );

  return (
    <div>
      {/* Range selector — only shown when there are multiple meaningful options */}
      {visibleRanges.length > 1 && (
        <div
          className="mb-3 flex flex-wrap gap-1"
          role="group"
          aria-label="Select date range"
        >
          {visibleRanges.map(({ label }) => {
            const active = range === label;
            return (
              <button
                key={label}
                onClick={() => setRange(label)}
                aria-pressed={active}
                className={[
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500",
                  active
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <ResponsiveContainer width="100%" height={280}>
        <RechartsLineChart
          data={filteredData}
          margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#71717a" }}
            tickLine={false}
            axisLine={{ stroke: "#e4e4e7" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#71717a" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${v}`}
          />
          <Tooltip
            formatter={(value) => [`${value} ${unit}`, "Value"]}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid #e4e4e7",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={colour}
            strokeWidth={2}
            dot={{ r: 3, fill: colour }}
            activeDot={{ r: 5 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
