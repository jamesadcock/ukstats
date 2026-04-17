import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "../../lib/data/categories";
import { getStatsByCategory } from "../../lib/data/stats";

export const metadata: Metadata = {
  title: "All Topics",
  description:
    "Browse all UK statistics topics — economy, employment, health, population, housing and education.",
};

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
        All Topics
      </h1>
      <p className="mb-10 text-slate-600">
        Select a topic to browse the latest UK statistics.
      </p>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const stats = getStatsByCategory(cat.slug);
          return (
            <li key={cat.slug}>
              <Link
                href={`/categories/${cat.slug}`}
                className="group block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100 focus-visible:outline-2 focus-visible:outline-indigo-500"
              >
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.colour}`}
                >
                  {cat.label}
                </span>
                <p className="mt-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  {cat.description}
                </p>
                <p className="mt-3 text-xs font-medium text-slate-400">
                  {stats.length} {stats.length === 1 ? "stat" : "stats"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
