import Link from "next/link";
import { type Stat } from "../../types";
import CategoryBadge from "./CategoryBadge";

interface StatCardProps {
  stat: Stat;
}

const TREND_ICON: Record<NonNullable<Stat["trend"]>, string> = {
  up: "↑",
  down: "↓",
  flat: "→",
};

const TREND_COLOUR: Record<NonNullable<Stat["trend"]>, string> = {
  up: "text-emerald-600",
  down: "text-rose-600",
  flat: "text-slate-400",
};

export default function StatCard({ stat }: StatCardProps) {
  return (
    <Link
      href={`/stats/${stat.slug}`}
      className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100 focus-visible:outline-2 focus-visible:outline-indigo-500"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <CategoryBadge category={stat.category} />
        {stat.trend && (
          <span
            className={`text-sm font-semibold ${TREND_COLOUR[stat.trend]}`}
            aria-label={`Trend: ${stat.trendDescription ?? stat.trend}`}
          >
            {TREND_ICON[stat.trend]}
          </span>
        )}
      </div>
      <p className="mb-1 text-sm font-medium text-slate-500 group-hover:text-slate-800 transition-colors line-clamp-2">
        {stat.title}
      </p>
      <p className="text-3xl font-bold tracking-tight text-slate-900">
        {stat.currentValue}
        <span className="ml-1 text-base font-normal text-slate-500">
          {stat.unit}
        </span>
      </p>
      {stat.trendDescription && (
        <p className="mt-2 text-xs text-slate-400">{stat.trendDescription}</p>
      )}
    </Link>
  );
}
