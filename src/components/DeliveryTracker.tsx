import { useEffect, useState } from 'react';
import { DELIVERY_COURIER_ICON } from '../config/store';
import { STORAGE_KEYS, writeStored } from '../lib/storage';
import { trackingAt, trackingStatusLabel } from '../lib/tracking';
import type { OrderTracking } from '../types';

interface Props {
  tracking: OrderTracking;
}

export default function DeliveryTracker({ tracking: initialTracking }: Props) {
  const [tracking, setTracking] = useState(() =>
    trackingAt(initialTracking.orderId, initialTracking.startedAt),
  );

  useEffect(() => {
    let timer: number | undefined;
    const updateProgress = () => {
      const next = trackingAt(initialTracking.orderId, initialTracking.startedAt);
      setTracking(next);
      writeStored(`${STORAGE_KEYS.trackingPrefix}${initialTracking.orderId}`, next);
      if (next.status === 'delivered' && timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };

    updateProgress();
    if (trackingAt(initialTracking.orderId, initialTracking.startedAt).status !== 'delivered') {
      timer = window.setInterval(updateProgress, 250);
    }

    return () => {
      if (timer !== undefined) window.clearInterval(timer);
    };
  }, [initialTracking.orderId, initialTracking.startedAt]);

  return (
    <section aria-labelledby="delivery-tracking-heading" className="rounded-3xl border border-line bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="delivery-tracking-heading" className="font-display text-xl font-semibold">
            Your delivery journey
          </h3>
          <p className="mt-1 text-sm text-muted">We’ll keep this tracking view updated as your order moves.</p>
        </div>
        <span
          aria-live="polite"
          className="rounded-full bg-leaf-soft px-3 py-1.5 text-xs font-semibold text-leaf-dark"
        >
          {trackingStatusLabel(tracking.status)}
        </span>
      </div>

      <div className="relative mt-7 px-1">
        <div
          className="absolute left-[5%] right-[5%] top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-label="Delivery progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(tracking.progress)}
        >
          <div
            className="h-full rounded-full bg-leaf transition-[width] duration-300 ease-linear"
            style={{ width: `${tracking.progress}%` }}
          />
        </div>
        <span
          aria-hidden="true"
          className="absolute top-1/2 z-10 -translate-y-[58%] text-2xl transition-[left] duration-300 ease-linear"
          style={{ left: `calc(5% + ${tracking.progress * 0.9}% - 12px)` }}
        >
          {DELIVERY_COURIER_ICON}
        </span>
        <div className="relative flex h-10 items-center justify-between">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-leaf text-xs font-bold text-white" aria-label="Store / hub">
            S
          </span>
          <span
            className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
              tracking.progress >= 100 ? 'bg-leaf text-white' : 'border-2 border-line bg-white text-muted'
            }`}
            aria-label="Your address"
          >
            {tracking.progress >= 100 ? '✓' : '⌂'}
          </span>
        </div>
      </div>
      <div className="mt-2 flex justify-between text-xs font-medium text-muted">
        <span>Store / Hub</span>
        <span>Your address</span>
      </div>
      <p className="sr-only" aria-live="polite">
        {trackingStatusLabel(tracking.status)}. {Math.round(tracking.progress)} percent complete.
      </p>
    </section>
  );
}
