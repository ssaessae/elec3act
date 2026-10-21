import { formatDateTime, formatMoney } from '../lib/format';
import type { Order } from '../types';

interface Props {
  orders: Order[];
  onView: (order: Order) => void;
  onClear: () => void;
}

/** Saved receipts (persisted in localStorage). Hidden when there are none. */
export default function OrderHistory({ orders, onView, onClear }: Props) {
  if (orders.length === 0) return null;

  return (
    <section aria-labelledby="history-heading" className="mt-16">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 id="history-heading" className="font-display text-2xl font-semibold tracking-tight">
          Past orders
        </h2>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Delete all saved receipts from this browser?')) onClear();
          }}
          className="rounded-full px-3 py-1.5 text-sm font-medium text-muted underline-offset-4 transition hover:text-danger hover:underline"
        >
          Clear history
        </button>
      </div>

      <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white shadow-card">
        {orders.map((order) => {
          const count = order.lines.reduce((sum, line) => sum + line.quantity, 0);
          return (
            <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="font-mono text-sm font-semibold">{order.id}</p>
                <p className="text-xs text-muted">
                  {formatDateTime(order.createdAt)} · {count} {count === 1 ? 'item' : 'items'} · {order.payment.label}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-semibold tabular-nums">{formatMoney(order.totals.total)}</p>
                <button
                  type="button"
                  onClick={() => onView(order)}
                  aria-label={`View receipt for order ${order.id}`}
                  className="btn btn-ghost px-4 py-2"
                >
                  View receipt
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
