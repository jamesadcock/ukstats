"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, CATEGORY_META } from "../../types";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Burger button — visible on mobile only */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="md:hidden flex h-9 w-9 items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-indigo-500"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
      >
        {open ? (
          // X icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          // Hamburger icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Mobile drawer */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="md:hidden fixed inset-0 top-[57px] z-40 bg-slate-950 overflow-y-auto"
        >
          <ul className="flex flex-col divide-y divide-slate-800 px-4 py-2">
            {CATEGORIES.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/categories/${slug}`}
                  className="flex items-center gap-3 py-3.5 text-base font-medium text-slate-200 hover:text-white transition-colors"
                >
                  {CATEGORY_META[slug].label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/about"
                className="flex items-center py-3.5 text-base font-medium text-slate-200 hover:text-white transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/methodology"
                className="flex items-center py-3.5 text-base font-medium text-slate-200 hover:text-white transition-colors"
              >
                Methodology
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
