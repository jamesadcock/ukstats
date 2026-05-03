"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { type Category } from "../../types";

export interface StatNavItem {
  slug: string;
  title: string;
}

export interface CategoryNavGroup {
  slug: Category;
  label: string;
  stats: StatNavItem[];
}

interface Props {
  groups: CategoryNavGroup[];
}

export default function StatsNavDropdown({ groups }: Props) {
  const firstSlug = groups[0]?.slug ?? null;
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(
    firstSlug,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveCategory(firstSlug);
  }, [firstSlug]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      close();
      containerRef.current?.querySelector("button")?.focus();
    }
  }

  const activeGroup =
    groups.find((g) => g.slug === activeCategory) ?? groups[0] ?? null;

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={close}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-indigo-500"
      >
        Statistics
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          role="menu"
          aria-label="Statistics navigation"
          className="absolute left-0 top-full flex w-[520px] rounded-lg border border-slate-700 bg-slate-900 shadow-2xl ring-1 ring-black/20"
        >
          {/* Left column — categories */}
          <ul className="w-44 shrink-0 border-r border-slate-700 py-2">
            {groups.map((group) => (
              <li key={group.slug}>
                <button
                  type="button"
                  role="menuitem"
                  onMouseEnter={() => setActiveCategory(group.slug)}
                  onFocus={() => setActiveCategory(group.slug)}
                  onClick={() => setActiveCategory(group.slug)}
                  className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                    activeCategory === group.slug
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {group.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right column — stats for active category */}
          <div
            className="flex-1 py-2"
            aria-label={
              activeGroup ? `${activeGroup.label} statistics` : "Statistics"
            }
          >
            {activeGroup ? (
              <ul>
                {activeGroup.stats.map((stat) => (
                  <li key={stat.slug}>
                    <Link
                      href={`/stats/${stat.slug}`}
                      role="menuitem"
                      onClick={close}
                      className="block px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      {stat.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-4 text-sm text-slate-500">
                No statistics available
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
