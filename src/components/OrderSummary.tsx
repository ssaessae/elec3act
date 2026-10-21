import type { ReactNode } from 'react';
import { STORE } from '../config/store';
import { formatMoney } from '../lib/format';
import { freeShippingRemaining } from '../lib/pricing';
import type { OrderTotals } from '../types';

interface Props {
  totals: OrderTotals;
  itemCount: number;
  /** Slot for the "Place order" button. */
  children?: ReactNode;
}

function Row({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between text-sm ${muted ? 'text-muted' : ''}`}>
      <dt>{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}

/** Price breakdown sidebar: subtotal, shipping, tax and final total. */
export default function OrderSummary({ totals, itemCount, children }: Props) {
  const { freeShippingThreshold, taxRate, taxLabel } = STORE.pricing;
  const remaining = freeShippingRemaining(totals.subtotal);
  const progress = Math.min(100, (totals.subtotal / freeShippingThreshold) * 100);
  const taxName = `${taxLabel} (${Math.round(taxRate * 100)}%)`;

  return (
    <section aria-labelledby="summary-heading" className="glass rounded-3xl p-6 shadow-card">
      <h2 id="summary-heading" className="font-display text-2xl font-semibold tracking-tight">
        Order summary
      </h2>

      {/* Free shipping progress */}
      <div className="mt-4 rounded-2xl bg-leaf-soft p-3.5">
        <p className="text-xs font-medium text-leaf-dark">
          {remaining > 0
            ? `Add ${formatMoney(remaining)} more for free delivery`
            : 'You’ve unlocked free delivery 🎉'}
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/80" aria-hidden="true">
          <div
            className="h-full rounded-full bg-leaf transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <dl className="mt-5 space-y-2.5">
        <Row label={`Subtotal (${itemCount} ${itemCount === 1 ? 'item' : 'items'})`} value={formatMoney(totals.subtotal)} />
        <Row label="Shipping" value={totals.shipping === 0 ? 'Free' : formatMoney(totals.shipping)} />
        {totals.taxIncluded ? (
          <Row label={`${taxName} · included`} value={formatMoney(totals.tax)} muted />
        ) : (
          <Row label={taxName} value={formatMoney(totals.tax)} />
        )}
        <div className="flex items-baseline justify-between border-t border-line pt-4">
          <dt className="font-semibold">Total</dt>
          <dd className="font-display text-3xl font-semibold tabular-nums">{formatMoney(totals.total)}</dd>
        </div>
      </dl>

      {children && <div className="mt-6">{children}</div>}
    </section>
  );
}
