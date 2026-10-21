import type { ReactNode } from 'react';
import type { Category } from '../types';

interface Props {
  categories: Category[];
  categoryId: string; // 'all' or id
  subcategoryId: string; // 'all' or id
  /** product counts per category id (+ 'all') and subcategory id */
  counts: Record<string, number>;
  onCategoryChange: (id: string) => void;
  onSubcategoryChange: (id: string) => void;
}

function Chip({
  active,
  onClick,
  size = 'md',
  children,
}: {
  active: boolean;
  onClick: () => void;
  size?: 'md' | 'sm';
  children: ReactNode;
}) {
  const sizing = size === 'md' ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`${sizing} shrink-0 whitespace-nowrap rounded-full border font-medium transition duration-200 active:scale-95 ${
        active
          ? 'border-ink bg-ink text-white shadow-sm'
          : 'border-line bg-white text-ink hover:border-ink/40 hover:bg-paper'
      }`}
    >
      {children}
    </button>
  );
}

const Count = ({ n, active }: { n: number; active: boolean }) => (
  <span className={`ml-1.5 tabular-nums ${active ? 'text-white/70' : 'text-muted'}`}>{n}</span>
);

export default function CategoryBar({
  categories,
  categoryId,
  subcategoryId,
  counts,
  onCategoryChange,
  onSubcategoryChange,
}: Props) {
  const activeCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="space-y-3">
      <div
        role="group"
        aria-label="Categories"
        className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        <Chip active={categoryId === 'all'} onClick={() => onCategoryChange('all')}>
          All products
          <Count n={counts.all ?? 0} active={categoryId === 'all'} />
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category.id}
            active={categoryId === category.id}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
            <Count n={counts[category.id] ?? 0} active={categoryId === category.id} />
          </Chip>
        ))}
      </div>

      {/* Subcategories slide in whenever a category is selected. key= replays the animation. */}
      {activeCategory && activeCategory.subcategories.length > 1 && (
        <div
          key={activeCategory.id}
          role="group"
          aria-label={`${activeCategory.name} subcategories`}
          className="no-scrollbar -mx-4 flex animate-fade-up gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          <Chip size="sm" active={subcategoryId === 'all'} onClick={() => onSubcategoryChange('all')}>
            All {activeCategory.name}
          </Chip>
          {activeCategory.subcategories.map((sub) => (
            <Chip
              key={sub.id}
              size="sm"
              active={subcategoryId === sub.id}
              onClick={() => onSubcategoryChange(sub.id)}
            >
              {sub.name}
              <Count n={counts[sub.id] ?? 0} active={subcategoryId === sub.id} />
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
