import { CATEGORY_META, type Category } from "../../types";

interface CategoryBadgeProps {
  category: Category;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.colour}`}
    >
      {meta.label}
    </span>
  );
}
