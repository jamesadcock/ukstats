import { type DataPoint } from "../../types";

interface ChartFallbackProps {
  data: DataPoint[];
  title: string;
  unit: string;
}

export default function ChartFallback({
  data,
  title,
  unit,
}: ChartFallbackProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border border-slate-200 rounded-lg overflow-hidden">
        <caption className="sr-only">{title} — historical data</caption>
        <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
          <tr>
            <th scope="col" className="px-4 py-2 font-medium">
              Period
            </th>
            <th scope="col" className="px-4 py-2 font-medium text-right">
              Value ({unit})
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map((point) => (
            <tr key={point.date} className="hover:bg-slate-50">
              <td className="px-4 py-2 text-slate-700">
                {point.label ??
                  new Date(point.date).toLocaleDateString("en-GB", {
                    month: "short",
                    year: "numeric",
                  })}
              </td>
              <td className="px-4 py-2 text-right font-medium text-slate-900">
                {point.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
