import type { AddResult } from '../context/StoreContext';
import type { Product } from '../types';
import ProductCard from './ProductCard';

interface Props {
  products: Product[];
  getQuantity: (productId: string) => number;
  onAdd: (product: Product) => AddResult;
  onResetFilters: () => void;
}

export default function ProductGrid({ products, getQuantity, onAdd, onResetFilters }: Props) {
  if (products.length === 0) {
    return (
      <div className="animate-fade-up rounded-3xl border border-dashed border-line bg-white/60 px-6 py-16 text-center">
        <p className="font-display text-2xl font-semibold">Nothing matches that search</p>
        <p className="mt-2 text-sm text-muted">Try a different word, or clear the filters to see everything.</p>
        <button type="button" onClick={onResetFilters} className="btn btn-ghost mt-6">
          Clear search &amp; filters
        </button>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <li key={product.id} className="flex">
          <ProductCard
            product={product}
            inCartQty={getQuantity(product.id)}
            onAdd={onAdd}
            animationDelay={Math.min(index, 12) * 35}
          />
        </li>
      ))}
    </ul>
  );
}
