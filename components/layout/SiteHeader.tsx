import Link from "next/link";
import { CATEGORIES, CATEGORY_META } from "../../types";

export default function SiteHeader() {
  return (
    <header className="bg-slate-950 shadow-md" role="banner">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white hover:text-indigo-300 transition-colors"
          aria-label="UK Stats – home"
        >
          UK Stats
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-300">
            {CATEGORIES.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/categories/${slug}`}
                  className="hover:text-white transition-colors"
                >
                  {CATEGORY_META[slug].label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/methodology"
                className="hover:text-white transition-colors"
              >
                Methodology
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
