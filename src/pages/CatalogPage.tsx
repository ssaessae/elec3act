import { useCallback, useMemo, useState } from 'react';
import CategoryBar from '../components/CategoryBar';
import ProductGrid from '../components/ProductGrid';
import SearchSortBar from '../components/SearchSortBar';
import { HERO_BANNER_IMAGE_URL, STORE } from '../config/store';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { filterAndSort } from '../lib/catalog';
import type { AddResult } from '../context/StoreContext';
import type { Product, SortKey } from '../types';

/** Page 1 - browse, search, filter, sort and add to cart. */
export default function CatalogPage() {
  const { addToCart, getQuantity } = useStore();
  const toast = useToast();

  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [subcategoryId, setSubcategoryId] = useState('all');
  const [sort, setSort] = useState<SortKey>('featured');

  // Static product counts shown on the filter chips.
  const counts = useMemo(() => {
    const result: Record<string, number> = { all: PRODUCTS.length };
    for (const product of PRODUCTS) {
      result[product.categoryId] = (result[product.categoryId] ?? 0) + 1;
      result[product.subcategoryId] = (result[product.subcategoryId] ?? 0) + 1;
    }
    return result;
  }, []);

  const results = useMemo(
    () => filterAndSort(PRODUCTS, { query, categoryId, subcategoryId, sort }),
    [query, categoryId, subcategoryId, sort],
  );

  const handleCategoryChange = useCallback((id: string) => {
    setCategoryId(id);
    setSubcategoryId('all'); // subcategory belongs to the previous category
  }, []);

  const resetFilters = useCallback(() => {
    setQuery('');
    setCategoryId('all');
    setSubcategoryId('all');
    setSort('featured');
  }, []);

  const handleAdd = useCallback(
    (product: Product): AddResult => {
      const result = addToCart(product.id);
      if (result === 'added') toast.push(`${product.reference} added to cart`);
      else if (result === 'limit') toast.push(`That’s the maximum available for ${product.reference}`, 'info');
      else toast.push(`${product.reference} is out of stock`, 'error');
      return result;
    },
    [addToCart, toast],
  );

  return (
    <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pb-8 outline-none sm:px-6">
      {/* Editorial hero */}
      <section
        aria-labelledby="hero-heading"
        className="relative isolate my-8 min-h-[390px] overflow-hidden rounded-[2rem] bg-ink shadow-lift animate-fade-up sm:my-12 sm:min-h-[430px]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url("${HERO_BANNER_IMAGE_URL}")` }}
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/65 to-ink/15" />
        <div className="flex min-h-[390px] max-w-3xl flex-col items-start justify-center px-6 py-12 text-white sm:min-h-[430px] sm:px-12">
          <p className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur">
            {STORE.heroEyebrow}
          </p>
          <h1 id="hero-heading" className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            {STORE.heroTitle}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">{STORE.heroSubtitle}</p>
          <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-card">
            <span aria-hidden="true">⚡</span> 30-minute express delivery
          </span>
        </div>
      </section>

      {/* Controls */}
      <div className="space-y-5">
        <SearchSortBar query={query} sort={sort} onQueryChange={setQuery} onSortChange={setSort} />
        <CategoryBar
          categories={CATEGORIES}
          categoryId={categoryId}
          subcategoryId={subcategoryId}
          counts={counts}
          onCategoryChange={handleCategoryChange}
          onSubcategoryChange={setSubcategoryId}
        />
      </div>

      {/* Results */}
      <p className="mb-5 mt-8 text-sm text-muted" aria-live="polite">
        Showing <span className="font-semibold text-ink">{results.length}</span> of {PRODUCTS.length} products
      </p>

      <ProductGrid products={results} getQuantity={getQuantity} onAdd={handleAdd} onResetFilters={resetFilters} />
    </main>
  );
}
