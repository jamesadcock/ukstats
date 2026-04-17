import Link from "next/link";
import { CATEGORIES, CATEGORY_META } from "../../types";
import MobileMenu from "./MobileMenu";

export default function SiteHeader() {
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
            {CATEGORIES.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/categories/${slug}`}
                  className="rounded-md px-3 py-2 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  {CATEGORY_META[slug].label}
                </Link>
              </li>
            ))}
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
          </ul>
        </nav>

        {/* Mobile burger + drawer */}
        <MobileMenu />
      </div>
    </header>
  );
}
