import { useEffect, useRef, useState } from 'react';
import { STORE } from '../config/store';
import { getCategory, getSubcategory } from '../data/products';
import { formatMoney } from '../lib/format';
import type { AddResult } from '../context/StoreContext';
import type { Product } from '../types';
import { CheckIcon, PlusIcon } from './icons';
import ProductImage from './ProductImage';

interface Props {
  product: Product;
  /** Quantity of this product currently in the cart. */
  inCartQty: number;
  /** Returns what happened so the card can show matching feedback. */
  onAdd: (product: Product) => AddResult;
  /** Delay (ms) for the staggered entrance animation. */
  animationDelay?: number;
}

function StockIndicator({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-danger">
        <span className="h-1.5 w-1.5 rounded-full bg-danger" aria-hidden="true" />
        Out of stock
      </span>
    );
  }
  if (stock <= STORE.inventory.lowStockThreshold) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-600" aria-hidden="true" />
        Only {stock} left
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-leaf">
      <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden="true" />
      In stock
    </span>
  );
}

export default function ProductCard({ product, inCartQty, onAdd, animationDelay = 0 }: Props) {
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const outOfStock = product.stock <= 0;
  const categoryName = getCategory(product.categoryId)?.name ?? '';
  const subcategoryName = getSubcategory(product.categoryId, product.subcategoryId)?.name ?? '';

  function handleAdd() {
    const result = onAdd(product);
    if (result !== 'added') return;
    setJustAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <article
      className="group flex w-full animate-fade-up flex-col rounded-3xl border border-line bg-white/80 p-3 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-paper">
        <ProductImage
          src={product.image}
          alt={`${product.reference}, ${product.name}`}
          className={`h-full w-full transition duration-500 group-hover:scale-105 ${outOfStock ? 'opacity-50 grayscale' : ''}`}
        />
        <span
          title={`${categoryName} › ${subcategoryName}`}
          className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold text-ink"
        >
          {subcategoryName}
        </span>
        {inCartQty > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-leaf px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            {inCartQty} in cart
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">{product.name}</h3>
        <p className="mt-0.5 text-sm text-muted">
          <span className="sr-only">Example: </span>
          {product.reference}
        </p>
        <p className="mt-0.5 text-xs text-muted">{product.size}</p>

        <div className="mt-4 flex items-end justify-between gap-2">
          <p className="text-xl font-semibold tabular-nums">{formatMoney(product.price)}</p>
          <StockIndicator stock={product.stock} />
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          aria-label={outOfStock ? `${product.reference} is out of stock` : `Add ${product.reference} to cart`}
          className={`btn mt-4 w-full ${justAdded ? 'bg-leaf-dark text-white' : 'btn-primary'}`}
        >
          {outOfStock ? (
            'Out of stock'
          ) : justAdded ? (
            <>
              <CheckIcon width={16} height={16} /> Added
            </>
          ) : (
            <>
              <PlusIcon width={16} height={16} /> Add to cart
            </>
          )}
        </button>
      </div>
    </article>
  );
}
