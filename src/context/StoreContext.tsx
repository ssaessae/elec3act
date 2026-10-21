import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { STORE } from '../config/store';
import { PRODUCTS_BY_ID } from '../data/products';
import { usePersistentState } from '../hooks/usePersistentState';
import { maxPurchasable } from '../lib/catalog';
import { computeTotals, round2 } from '../lib/pricing';
import { STORAGE_KEYS, sanitizeCart, sanitizeOrders } from '../lib/storage';
import type { CartItem, CartLine, Order, OrderLine, OrderTotals, PlaceOrderInput } from '../types';

export type AddResult = 'added' | 'limit' | 'out-of-stock';

interface StoreContextValue {
  /* Cart (derived from the persisted CartItem[] + product data) */
  lines: CartLine[];
  itemCount: number;
  totals: OrderTotals;
  getQuantity: (productId: string) => number;
  addToCart: (productId: string, quantity?: number) => AddResult;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;

  /* Orders */
  orders: Order[];
  placeOrder: (input: PlaceOrderInput) => Promise<Order>;
  clearOrderHistory: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const pad = (n: number) => String(n).padStart(2, '0');

/** e.g. "PL-261021-K3F9" (prefix from config/store.ts). */
function generateOrderId(): string {
  const now = new Date();
  const stamp = `${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${STORE.checkout.orderIdPrefix}-${stamp}-${suffix}`;
}

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export function StoreProvider({ children }: { children: ReactNode }) {
  // Both pieces of state are mirrored to localStorage automatically (see usePersistentState).
  const [cart, setCart] = usePersistentState<CartItem[]>(STORAGE_KEYS.cart, sanitizeCart);
  const [orders, setOrders] = usePersistentState<Order[]>(STORAGE_KEYS.orders, sanitizeOrders);

  /**
   * Join persisted ids with live product data. Items whose product was removed from
   * products.ts (or is now out of stock) silently drop out; quantities are clamped to stock.
   */
  const lines = useMemo<CartLine[]>(() => {
    const result: CartLine[] = [];
    for (const item of cart) {
      const product = PRODUCTS_BY_ID.get(item.productId);
      if (!product || product.stock <= 0) continue;
      const quantity = Math.min(item.quantity, maxPurchasable(product));
      result.push({ product, quantity, lineTotal: round2(product.price * quantity) });
    }
    return result;
  }, [cart]);

  const itemCount = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines]);
  const totals = useMemo(
    () => computeTotals(lines.reduce((sum, line) => sum + line.lineTotal, 0)),
    [lines],
  );

  const getQuantity = useCallback(
    (productId: string) => lines.find((line) => line.product.id === productId)?.quantity ?? 0,
    [lines],
  );

  const addToCart = useCallback(
    (productId: string, quantity = 1): AddResult => {
      const product = PRODUCTS_BY_ID.get(productId);
      if (!product || product.stock <= 0) return 'out-of-stock';

      const limit = maxPurchasable(product);
      const current = cart.find((item) => item.productId === productId)?.quantity ?? 0;
      if (current >= limit) return 'limit';

      const next = Math.min(limit, current + quantity);
      setCart((prev) =>
        prev.some((item) => item.productId === productId)
          ? prev.map((item) => (item.productId === productId ? { ...item, quantity: next } : item))
          : [...prev, { productId, quantity: next }],
      );
      return 'added';
    },
    [cart, setCart],
  );

  const removeItem = useCallback(
    (productId: string) => setCart((prev) => prev.filter((item) => item.productId !== productId)),
    [setCart],
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      const product = PRODUCTS_BY_ID.get(productId);
      if (!product || quantity <= 0) {
        removeItem(productId);
        return;
      }
      const clamped = Math.min(Math.floor(quantity), maxPurchasable(product));
      setCart((prev) => prev.map((item) => (item.productId === productId ? { ...item, quantity: clamped } : item)));
    },
    [removeItem, setCart],
  );

  const placeOrder = useCallback(
    async (input: PlaceOrderInput): Promise<Order> => {
      // Snapshot now, so edits made while "processing" can't change what was bought.
      const orderLines: OrderLine[] = lines.map(({ product, quantity, lineTotal }) => ({
        productId: product.id,
        name: product.name,
        reference: product.reference,
        size: product.size,
        unitPrice: product.price,
        quantity,
        lineTotal,
      }));
      const orderTotals = totals;

      // Simulated payment processing (1.2 - 2.0 s by default).
      const { minSimulatedDelayMs, maxSimulatedDelayMs } = STORE.checkout;
      await wait(minSimulatedDelayMs + Math.random() * (maxSimulatedDelayMs - minSimulatedDelayMs));

      const order: Order = {
        id: generateOrderId(),
        createdAt: new Date().toISOString(),
        customer: input.customer,
        payment: input.payment,
        lines: orderLines,
        totals: orderTotals,
        status: 'confirmed',
      };

      setOrders((prev) => [order, ...prev]); // save receipt
      setCart([]); // clear the active cart (also clears it from localStorage)
      return order;
    },
    [lines, totals, setOrders, setCart],
  );

  const clearOrderHistory = useCallback(() => setOrders([]), [setOrders]);

  const value = useMemo<StoreContextValue>(
    () => ({
      lines,
      itemCount,
      totals,
      getQuantity,
      addToCart,
      setQuantity,
      removeItem,
      orders,
      placeOrder,
      clearOrderHistory,
    }),
    [lines, itemCount, totals, getQuantity, addToCart, setQuantity, removeItem, orders, placeOrder, clearOrderHistory],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
