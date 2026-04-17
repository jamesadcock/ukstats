import "server-only";
import {
  CATEGORIES,
  CATEGORY_META,
  type Category,
  type CategoryMeta,
} from "../../types";

export function getAllCategories(): CategoryMeta[] {
  return CATEGORIES.map((slug) => CATEGORY_META[slug]);
}

export function getCategoryMeta(slug: Category): CategoryMeta {
  return CATEGORY_META[slug];
}
