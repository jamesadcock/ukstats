import Link from "next/link";
import { CATEGORIES, CATEGORY_META } from "../../types";
import { getAllStats } from "../../lib/data/stats";
import MobileMenu from "./MobileMenu";
import StatsNavDropdown, { type CategoryNavGroup } from "./StatsNavDropdown";

export default function SiteHeader() {
  const allStats = getAllStats();

  const groups: CategoryNavGroup[] = CATEGORIES.map((slug) => ({
    slug,
    label: CATEGORY_META[slug].label,
    stats: allStats
      .filter((s) => s.category === slug)
      .map((s) => ({ slug: s.slug, title: s.title })),
  }));

  return (
    <header className="sticky top-0 z-50 bg-slate-950 shadow-md" role="banner">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-white hover:text-indigo-300 transition-colors"
          aria-label="UK Stats – home"
        >
          UK Stats
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-x-1 text-sm font-medium text-slate-300">
            <li>
              <StatsNavDropdown groups={groups} />
            </li>
            <li className="ml-2 h-4 w-px bg-slate-700" aria-hidden="true" />
            <li>
              <Link
                href="/about"
                className="rounded-md px-3 py-2 hover:bg-slate-800 hover:text-white transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/methodology"
                className="rounded-md px-3 py-2 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Methodology
              </Link>
            </li>
            <li>
              <Link
                href="/newsletter"
                className="rounded-md px-3 py-2 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Newsletter
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile burger + drawer */}
        <MobileMenu groups={groups} />
      </div>
    </header>
  );
}
