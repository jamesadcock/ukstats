import { type Stat } from "../../types";
import StatCard from "./StatCard";

interface StatGridProps {
  stats: Stat[];
  columns?: 2 | 3 | 4;
}

const GRID_COLS = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export default function StatGrid({ stats, columns = 3 }: StatGridProps) {
  if (stats.length === 0) {
    return (
      <p className="text-slate-500 text-sm">No statistics available yet.</p>
    );
  }
  return (
    <ul
      className={`grid grid-cols-1 gap-4 ${GRID_COLS[columns]}`}
      aria-label="Statistics"
    >
      {stats.map((stat) => (
        <li key={stat.slug}>
          <StatCard stat={stat} />
        </li>
      ))}
    </ul>
  );
}
