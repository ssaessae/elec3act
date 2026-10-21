import type { SortKey } from '../types';
import { CloseIcon, SearchIcon } from './icons';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
];

interface Props {
  query: string;
  sort: SortKey;
  onQueryChange: (value: string) => void;
  onSortChange: (value: SortKey) => void;
}

export default function SearchSortBar({ query, sort, onQueryChange, onSortChange }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <label htmlFor="catalog-search" className="sr-only">
          Search products
        </label>
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          id="catalog-search"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search noodles, coffee, KitKat…"
          autoComplete="off"
          className="input rounded-full py-3 pl-12 pr-11 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-paper hover:text-ink"
          >
            <CloseIcon width={16} height={16} />
          </button>
        )}
      </div>

      <div className="sm:w-56">
        <label htmlFor="catalog-sort" className="sr-only">
          Sort products
        </label>
        <select
          id="catalog-sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="input cursor-pointer rounded-full py-3"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
