import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { maxPurchasable } from '../lib/catalog';
import { formatMoney } from '../lib/format';
import { TrashIcon } from './icons';
import ProductImage from './ProductImage';
import QuantityStepper from './QuantityStepper';

interface Props {
  /** Locks the controls while an order is being processed. */
  disabled?: boolean;
}

/** Cart line items with thumbnail, unit price, quantity controls and removal. */
export default function CartView({ disabled = false }: Props) {
  const { lines, itemCount, setQuantity, removeItem } = useStore();
  const toast = useToast();

  return (
    <section aria-labelledby="cart-heading">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 id="cart-heading" className="font-display text-2xl font-semibold tracking-tight">
          Your basket
        </h2>
        <p className="text-sm text-muted">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
      </div>

      <ul className="space-y-3">
        {lines.map(({ product, quantity, lineTotal }) => (
          <li
            key={product.id}
            className="flex animate-fade-up gap-4 rounded-3xl border border-line bg-white p-3 shadow-card"
          >
            <ProductImage
              src={product.image}
              alt={`${product.reference}, ${product.name}`}
              className="h-20 w-20 shrink-0 rounded-2xl bg-paper sm:h-24 sm:w-24"
            />

            <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="min-w-0">
                <h3 className="truncate font-display text-base font-semibold sm:text-lg">{product.reference}</h3>
                <p className="truncate text-sm font-light text-neutral-500">{product.name}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {product.size} · {formatMoney(product.price)} each
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
                <QuantityStepper
                  quantity={quantity}
                  max={maxPurchasable(product)}
                  label={product.reference}
                  disabled={disabled}
                  onChange={(next) => setQuantity(product.id, next)}
                />
                <div className="flex items-center gap-3">
                  <p className="min-w-[5rem] text-right font-semibold tabular-nums">{formatMoney(lineTotal)}</p>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      removeItem(product.id);
                      toast.push(`${product.reference} removed`, 'info');
                    }}
                    aria-label={`Remove ${product.reference} from cart`}
                    className="grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-red-50 hover:text-danger disabled:opacity-40"
                  >
                    <TrashIcon width={18} height={18} />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
