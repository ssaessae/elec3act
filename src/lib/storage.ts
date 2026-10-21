import { STORE } from '../config/store';
import type { CartItem, Order } from '../types';

/**
 * localStorage layer.
 *
 * HOW SYNC WORKS
 * --------------
 * 1. On first render, `usePersistentState` (hooks/usePersistentState.ts) reads the key
 *    from localStorage and passes the raw JSON through a *sanitizer* below, so corrupt
 *    or outdated data can never crash the app.
 * 2. Every time the state changes, the hook writes it back with `writeStored`.
 * 3. A `storage` event listener keeps other open tabs in sync.
 *
 * All access is wrapped in try/catch because localStorage can throw
 * (private mode, quota exceeded, blocked cookies).
 */

const prefix = `${STORE.storage.prefix}:${STORE.storage.version}`;

export const STORAGE_KEYS = {
  /** Active cart: CartItem[] (ids + quantities only). */
  cart: `${prefix}:cart`,
  /** Order history / saved receipts: Order[] (newest first). */
  orders: `${prefix}:orders`,
} as const;

export function parseJSON(raw: string | null): unknown {
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function readStored(key: string): unknown {
  try {
    return parseJSON(window.localStorage.getItem(key));
  } catch {
    return null;
  }
}

export function writeStored(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable or full - the app keeps working in-memory */
  }
}

/* ----------------------------- Sanitizers ----------------------------- */

export function sanitizeCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const items: CartItem[] = [];

  for (const entry of raw) {
    if (typeof entry !== 'object' || entry === null) continue;
    const { productId, quantity } = entry as Record<string, unknown>;
    if (typeof productId !== 'string' || typeof quantity !== 'number' || !Number.isFinite(quantity)) continue;
    const qty = Math.floor(quantity);
    if (qty < 1 || seen.has(productId)) continue;
    seen.add(productId);
    items.push({ productId, quantity: qty });
  }
  return items;
}

export function sanitizeOrders(raw: unknown): Order[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((entry): entry is Order => {
    if (typeof entry !== 'object' || entry === null) return false;
    const order = entry as Partial<Order>;
    return (
      typeof order.id === 'string' &&
      typeof order.createdAt === 'string' &&
      Array.isArray(order.lines) &&
      typeof order.totals === 'object' &&
      order.totals !== null &&
      typeof order.customer === 'object' &&
      order.customer !== null &&
      typeof order.payment === 'object' &&
      order.payment !== null
    );
  });
}
