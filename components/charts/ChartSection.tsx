"use client";

import { useState, useMemo } from "react";
import { type DataPoint, type Stat } from "../../types";
import {
  type Interval,
  aggregateChartData,
  getAvailableIntervals,
} from "../../lib/aggregateChartData";
import LineChart from "./LineChart";
import ChartFallback from "./ChartFallback";

interface ChartSectionProps {
  data: DataPoint[];
  title: string;
  unit: string;
  frequency: Stat["frequency"];
}

const INTERVAL_LABELS: Record<Interval, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  annual: "Annual",
};

export default function ChartSection({
  data,
  title,
  unit,
  frequency,
}: ChartSectionProps) {
  const availableIntervals = useMemo(
    () => getAvailableIntervals(frequency),
    [frequency],
  );

  const defaultInterval: Interval = availableIntervals.includes("annual")
    ? "annual"
    : (frequency ?? "annual");
  const [selectedInterval, setSelectedInterval] =
    useState<Interval>(defaultInterval);

  const aggregatedData = useMemo(
    () => aggregateChartData(data, selectedInterval),
    [data, selectedInterval],
  );

  return (
    <div>
      {availableIntervals.length > 1 && (
        <div
          className="mb-4 flex flex-wrap gap-1"
          role="group"
          aria-label="Select data interval"
        >
          {availableIntervals.map((interval) => {
            const active = selectedInterval === interval;
            return (
              <button
                key={interval}
                onClick={() => setSelectedInterval(interval)}
                aria-pressed={active}
                className={[
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500",
                  active
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                ].join(" ")}
              >
                {INTERVAL_LABELS[interval]}
              </button>
            );
          })}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <LineChart data={aggregatedData} unit={unit} />
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-slate-500 hover:text-indigo-600 transition-colors">
          View as table
        </summary>
        <div className="mt-3">
          <ChartFallback data={aggregatedData} title={title} unit={unit} />
        </div>
      </details>
    </div>
  );
}
