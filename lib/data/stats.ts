import "server-only";
import {
  economyStats,
  employmentStats,
  healthStats,
  populationStats,
  housingStats,
  educationStats,
} from "../../content/stats";
import { type Stat, type Category } from "../../types";

const ALL_STATS: Stat[] = [
  ...economyStats,
  ...employmentStats,
  ...healthStats,
  ...populationStats,
  ...housingStats,
  ...educationStats,
];

export function getAllStats(): Stat[] {
  return ALL_STATS;
}

export function getStatBySlug(slug: string): Stat | undefined {
  return ALL_STATS.find((s) => s.slug === slug);
}

export function getStatsByCategory(category: Category): Stat[] {
  return ALL_STATS.filter((s) => s.category === category);
}

export function getFeaturedStats(): Stat[] {
  return ALL_STATS.filter((s) => s.featured === true);
}

export function getAllSlugs(): string[] {
  return ALL_STATS.map((s) => s.slug);
}
