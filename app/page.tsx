import Link from "next/link";
import { getFeaturedStats } from "../lib/data/stats";
import { getAllCategories } from "../lib/data/categories";
import StatGrid from "../components/stats/StatGrid";

export default function Home() {
  const featured = getFeaturedStats();
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <section className="mb-14 max-w-2xl" aria-labelledby="hero-heading">
        <h1
          id="hero-heading"
          className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl"
        >
          UK Statistics
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Clear, unbiased data on the UK economy, health, employment, housing
          and more — sourced directly from ONS and other official bodies.
        </p>
      </section>

      {/* Featured stats */}
      <section className="mb-16" aria-labelledby="featured-heading">
        <h2
          id="featured-heading"
          className="mb-6 text-xl font-semibold text-slate-900"
        >
          Key indicators
        </h2>
        <StatGrid stats={featured} columns={3} />
      </section>

      {/* Category grid */}
      <section aria-labelledby="categories-heading">
        <h2
          id="categories-heading"
          className="mb-6 text-xl font-semibold text-slate-900"
        >
          Browse by topic
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/categories/${cat.slug}`}
                className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100 focus-visible:outline-2 focus-visible:outline-indigo-500"
              >
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.colour}`}
                >
                  {cat.label}
                </span>
                <p className="mt-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  {cat.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
