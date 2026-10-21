import { useRef } from 'react';
import { STORE } from '../config/store';
import { useModalBehavior } from '../hooks/useModalBehavior';
import { formatDateTime, formatMoney } from '../lib/format';
import type { OrderReceipt } from '../types';
import { CloseIcon } from './icons';
import DeliveryTracker from './DeliveryTracker';

interface Props {
  receipt: OrderReceipt;
  /** true right after checkout -> shows the animated "Order confirmed" header. */
  isNew?: boolean;
  onClose: () => void;
}

/** Animated success screen + itemised invoice. Also used to re-open saved receipts. */
export default function ReceiptModal({ receipt, isNew = false, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useModalBehavior(dialogRef, onClose);

  const { order, tracking } = receipt;
  const { totals } = order;
  const firstName = order.customer.name.split(' ')[0];
  const taxName = `${STORE.pricing.taxLabel} (${Math.round(STORE.pricing.taxRate * 100)}%)`;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 animate-fade-in bg-ink/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="receipt-title"
        tabIndex={-1}
        className="relative max-h-[92vh] w-full max-w-xl animate-modal-in overflow-y-auto rounded-t-[2rem] bg-white shadow-lift outline-none sm:rounded-[2rem]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close receipt"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-paper text-ink transition hover:bg-line"
        >
          <CloseIcon width={18} height={18} />
        </button>

        {/* Header */}
        <div className="bg-leaf-soft px-6 pb-6 pt-8 text-center">
          {isNew && (
            <svg
              viewBox="0 0 56 56"
              className="mx-auto mb-4 h-16 w-16 text-leaf"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle className="check-circle" cx="28" cy="28" r="26" />
              <path className="check-mark" d="M16 29.500 24.500 38 40 20" />
            </svg>
          )}
          <h2 id="receipt-title" className="font-display text-3xl font-semibold tracking-tight">
            {isNew ? 'Order confirmed' : 'Receipt'}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            {isNew
              ? `Thank you, ${firstName}! Your groceries are being prepared for delivery.`
              : `Placed on ${formatDateTime(order.createdAt)}`}
          </p>
          <p className="mt-3 inline-block rounded-full bg-white px-4 py-1.5 font-mono text-xs font-semibold tracking-wider">
            {order.id}
          </p>
        </div>

        <div className="space-y-6 px-6 py-6">
          <DeliveryTracker tracking={tracking} />

          {/* Meta */}
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Date</dt>
              <dd className="mt-1">{formatDateTime(order.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Payment</dt>
              <dd className="mt-1">
                {order.payment.label}
                {order.payment.detail && <span className="text-muted"> · {order.payment.detail}</span>}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Deliver to</dt>
              <dd className="mt-1">
                {order.customer.name} · {order.customer.contact}
                <br />
                <span className="text-muted">{order.customer.address}</span>
                {order.customer.notes && (
                  <>
                    <br />
                    <span className="text-muted">Note: {order.customer.notes}</span>
                  </>
                )}
              </dd>
            </div>
          </dl>

          {/* Invoice */}
          <table className="w-full text-sm">
            <caption className="sr-only">Itemised invoice</caption>
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th scope="col" className="pb-2 font-semibold">
                  Item
                </th>
                <th scope="col" className="pb-2 text-center font-semibold">
                  Qty
                </th>
                <th scope="col" className="pb-2 text-right font-semibold">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {order.lines.map((line) => (
                <tr key={line.productId}>
                  <td className="py-3 pr-3">
                    <p className="font-medium">{line.reference}</p>
                    <p className="text-xs text-muted">
                      {line.name} · {line.size} · {formatMoney(line.unitPrice)} each
                    </p>
                  </td>
                  <td className="py-3 text-center tabular-nums">{line.quantity}</td>
                  <td className="py-3 text-right font-medium tabular-nums">{formatMoney(line.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <dl className="space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="tabular-nums">{formatMoney(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="tabular-nums">{totals.shipping === 0 ? 'Free' : formatMoney(totals.shipping)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">
                {taxName}
                {totals.taxIncluded ? ' · included' : ''}
              </dt>
              <dd className="tabular-nums">{formatMoney(totals.tax)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-3">
              <dt className="font-semibold">Total paid</dt>
              <dd className="font-display text-2xl font-semibold tabular-nums">{formatMoney(totals.total)}</dd>
            </div>
          </dl>

          <p className="rounded-2xl bg-paper px-4 py-3 text-xs text-muted">
            Simulated order - no payment was processed. This receipt is saved only in this browser.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#/" onClick={onClose} className="btn btn-primary flex-1">
              Continue shopping
            </a>
            <button type="button" onClick={onClose} className="btn btn-ghost flex-1">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
