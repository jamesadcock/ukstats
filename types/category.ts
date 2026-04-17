export const CATEGORIES = [
  "economy",
  "employment",
  "health",
  "population",
  "housing",
  "education",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface CategoryMeta {
  slug: Category;
  label: string;
  description: string;
  colour: string; // Tailwind bg colour class
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  economy: {
    slug: "economy",
    label: "Economy",
    description: "GDP, inflation, trade, public finances and economic output.",
    colour: "bg-blue-600 text-white",
  },
  employment: {
    slug: "employment",
    label: "Employment",
    description: "Labour market, wages, unemployment and working conditions.",
    colour: "bg-emerald-600 text-white",
  },
  health: {
    slug: "health",
    label: "Health",
    description: "NHS, life expectancy, disease prevalence and wellbeing.",
    colour: "bg-rose-600 text-white",
  },
  population: {
    slug: "population",
    label: "Population",
    description: "Census data, demographics, migration and births/deaths.",
    colour: "bg-violet-600 text-white",
  },
  housing: {
    slug: "housing",
    label: "Housing",
    description: "House prices, rents, homelessness and housing supply.",
    colour: "bg-orange-600 text-white",
  },
  education: {
    slug: "education",
    label: "Education",
    description: "Schools, higher education, attainment and skills.",
    colour: "bg-cyan-700 text-white",
  },
};
