import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { getAllSlugs, getStatBySlug } from "../../../lib/data/stats";
import { CATEGORY_META } from "../../../types";
import { datasetJsonLd, breadcrumbJsonLd } from "../../../lib/jsonld";
import CategoryBadge from "../../../components/stats/CategoryBadge";
import SourceAttribution from "../../../components/stats/SourceAttribution";
import LineChart from "../../../components/charts/LineChart";
import ChartFallback from "../../../components/charts/ChartFallback";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const stat = getStatBySlug(slug);
  if (!stat) return {};
  return {
    title: stat.title,
    description: stat.summary,
    openGraph: {
      title: stat.title,
      description: stat.summary,
      type: "article",
    },
  };
}

export default async function StatPage({ params }: Props) {
  const { slug } = await params;
  const stat = getStatBySlug(slug);
  if (!stat) notFound();

  const catMeta = CATEGORY_META[stat.category];
  const jsonLd = datasetJsonLd(stat);
  const crumbJsonLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: catMeta.label, url: `/categories/${stat.category}` },
    { name: stat.title, url: `/stats/${stat.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbJsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-indigo-600 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/categories/${stat.category}`}
                className="hover:text-indigo-600 transition-colors"
              >
                {catMeta.label}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li
              aria-current="page"
              className="font-medium text-slate-800 truncate max-w-xs"
            >
              {stat.title}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <CategoryBadge category={stat.category} />
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {stat.title}
          </h1>
          <p className="mt-3 text-lg text-slate-600">{stat.summary}</p>
        </header>

        {/* Headline figure */}
        <section
          aria-label="Current value"
          className="mb-10 flex flex-wrap items-end gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-6 py-5"
        >
          <p className="text-5xl font-bold tracking-tight text-slate-900">
            {stat.currentValue}
          </p>
          <p className="mb-1 text-xl text-slate-500">{stat.unit}</p>
          {stat.trendDescription && (
            <p className="w-full text-sm text-slate-500">
              {stat.trendDescription}
            </p>
          )}
        </section>

        {/* Chart */}
        {stat.chartData && stat.chartData.length > 0 && (
          <section className="mb-10" aria-labelledby="chart-heading">
            <h2
              id="chart-heading"
              className="mb-4 text-lg font-semibold text-slate-900"
            >
              Historical data
            </h2>
            {/* Client chart — hidden for users with JS disabled */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <Suspense
                fallback={
                  <div className="h-[280px] animate-pulse rounded bg-slate-100" />
                }
              >
                <LineChart data={stat.chartData} unit={stat.unit} />
              </Suspense>
            </div>
            {/* Accessible table fallback (always rendered, visually hidden when chart visible) */}
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                View as table
              </summary>
              <div className="mt-3">
                <ChartFallback
                  data={stat.chartData}
                  title={stat.title}
                  unit={stat.unit}
                />
              </div>
            </details>
          </section>
        )}

        {/* Methodology */}
        <section className="mb-10" aria-labelledby="methodology-heading">
          <h2
            id="methodology-heading"
            className="mb-3 text-lg font-semibold text-slate-900"
          >
            Methodology
          </h2>
          <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-7">
            {stat.methodology.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>

        {/* Tags */}
        {stat.tags.length > 0 && (
          <section className="mb-10" aria-label="Tags">
            <ul className="flex flex-wrap gap-2">
              {stat.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-slate-200 px-3 py-0.5 text-xs text-slate-500"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Source */}
        <SourceAttribution
          name={stat.source.name}
          url={stat.source.url}
          lastUpdated={stat.lastUpdated}
          publishedAt={stat.source.publishedAt}
        />
      </div>
    </>
  );
}
