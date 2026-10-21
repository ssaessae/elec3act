import { STORE } from '../config/store';
import type { OrderTotals } from '../types';

/** Round to 2 decimals, avoiding float artefacts like 0.1 + 0.2. */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Single source of truth for the price breakdown.
 * Rules come from STORE.pricing (flat shipping, free-shipping threshold, tax mode).
 */
export function computeTotals(subtotal: number): OrderTotals {
  const { shippingFlatFee, freeShippingThreshold, taxRate, taxIncludedInPrices } = STORE.pricing;

  const sub = round2(subtotal);
  const shipping = sub === 0 || sub >= freeShippingThreshold ? 0 : shippingFlatFee;

  // Included tax is "backed out" of the subtotal; added tax is charged on top.
  const tax = taxIncludedInPrices ? round2(sub - sub / (1 + taxRate)) : round2(sub * taxRate);
  const total = round2(sub + shipping + (taxIncludedInPrices ? 0 : tax));

  return { subtotal: sub, shipping, tax, taxIncluded: taxIncludedInPrices, total };
}

/** How much more the shopper must add to qualify for free shipping. */
export function freeShippingRemaining(subtotal: number): number {
  return Math.max(0, round2(STORE.pricing.freeShippingThreshold - subtotal));
}
