import { STORE } from '../config/store';
import { getCategory, getSubcategory } from '../data/products';
import type { Product, SortKey } from '../types';

/** The most a shopper can put in the cart for this product. */
export function maxPurchasable(product: Product): number {
  return Math.max(0, Math.min(product.stock, STORE.inventory.maxQuantityPerItem));
}

export interface CatalogFilters {
  query: string;
  categoryId: string; // 'all' or a category id
  subcategoryId: string; // 'all' or a subcategory id
  sort: SortKey;
}

/** Everything the live search looks at for one product. */
function searchText(product: Product): string {
  return [
    product.name,
    product.reference,
    product.size,
    getCategory(product.categoryId)?.name,
    getSubcategory(product.categoryId, product.subcategoryId)?.name,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function filterAndSort(products: Product[], filters: CatalogFilters): Product[] {
  const query = filters.query.trim().toLowerCase();
  const terms = query.split(/\s+/).filter(Boolean);

  const filtered = products.filter((product) => {
    if (filters.categoryId !== 'all' && product.categoryId !== filters.categoryId) return false;
    if (filters.subcategoryId !== 'all' && product.subcategoryId !== filters.subcategoryId) return false;
    if (terms.length === 0) return true;
    const text = searchText(product);
    return terms.every((term) => text.includes(term));
  });

  const byName = (a: Product, b: Product) => a.reference.localeCompare(b.reference);
  switch (filters.sort) {
    case 'price-asc':
      return [...filtered].sort((a, b) => a.price - b.price || byName(a, b));
    case 'price-desc':
      return [...filtered].sort((a, b) => b.price - a.price || byName(a, b));
    case 'name-asc':
      return [...filtered].sort(byName);
    case 'name-desc':
      return [...filtered].sort((a, b) => byName(b, a));
    default:
      return filtered; // 'featured' = order in data/products.ts
  }
}
