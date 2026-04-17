import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, CATEGORY_META } from "../../../types";
import { getStatsByCategory } from "../../../lib/data/stats";
import StatGrid from "../../../components/stats/StatGrid";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((slug) => ({ category: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return {};
  }
  const meta = CATEGORY_META[category as (typeof CATEGORIES)[number]];
  return {
    title: meta.label,
    description: meta.description,
    openGraph: {
      title: `${meta.label} | UK Stats`,
      description: meta.description,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    notFound();
  }

  const cat = category as (typeof CATEGORIES)[number];
  const meta = CATEGORY_META[cat];
  const stats = getStatsByCategory(cat);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/categories"
              className="hover:text-indigo-600 transition-colors"
            >
              Topics
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-slate-800">
            {meta.label}
          </li>
        </ol>
      </nav>

      <header className="mb-10">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.colour}`}
        >
          {meta.label}
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          {meta.label} Statistics
        </h1>
        <p className="mt-2 text-slate-600">{meta.description}</p>
      </header>

      <StatGrid stats={stats} columns={3} />
    </div>
  );
}
