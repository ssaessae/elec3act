/**
 * Central type definitions.
 * Everything the app stores in localStorage or passes between components is typed here.
 */

/* ----------------------------- Catalog ----------------------------- */

export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Product {
  /** Stable unique id (also used as the image file name, see data/products.ts). */
  id: string;
  /** Generic product title, e.g. "Instant Noodles". */
  name: string;
  /** Real-world example reference, e.g. "Lucky Me! Pancit Canton". */
  reference: string;
  /** Pack size shown to shoppers, e.g. "60 g". */
  size: string;
  categoryId: string;
  subcategoryId: string;
  /** Unit price in the store currency (see config/store.ts). */
  price: number;
  /** Units available. 0 = out of stock. */
  stock: number;
  /** Image URL / path / data-URI. Swap in data/products.ts. */
  image: string;
}

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

/* ------------------------------- Cart ------------------------------- */

/**
 * What is persisted for the cart. We deliberately store only ids + quantities
 * (not names/prices) so that edits to products.ts are reflected immediately.
 */
export interface CartItem {
  productId: string;
  quantity: number;
}

/** A cart item joined with its product (computed, never persisted). */
export interface CartLine {
  product: Product;
  quantity: number;
  lineTotal: number;
}

/* ------------------------------ Orders ------------------------------ */

export type PaymentMethodId = 'ewallet' | 'card' | 'cod';
export type EwalletProviderId = 'gcash' | 'maya';

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  /** true when `tax` is already inside the prices (not added on top). */
  taxIncluded: boolean;
  total: number;
}

/** Snapshot of a purchased item - prices are frozen at purchase time. */
export interface OrderLine {
  productId: string;
  name: string;
  reference: string;
  size: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderCustomer {
  name: string;
  address: string;
  contact: string;
  notes?: string;
}

export interface OrderPayment {
  method: PaymentMethodId;
  /** Human label, e.g. "GCash". */
  label: string;
  /** Masked detail only, e.g. "•••• 4242". Full card numbers are never stored. */
  detail?: string;
}

export interface Order {
  id: string;
  /** ISO timestamp. */
  createdAt: string;
  customer: OrderCustomer;
  payment: OrderPayment;
  lines: OrderLine[];
  totals: OrderTotals;
  status: 'confirmed';
}

export type OrderStatus = 'confirmed-packed' | 'out-for-delivery' | 'approaching' | 'delivered';

export interface CaptchaChallenge {
  prompt: string;
  answer: string;
  id: number;
}

export interface OrderTracking {
  orderId: string;
  startedAt: number;
  progress: number;
  status: OrderStatus;
}

export interface OrderReceipt {
  order: Order;
  tracking: OrderTracking;
}

export interface PlaceOrderInput {
  customer: OrderCustomer;
  payment: OrderPayment;
}

/* ------------------------------ Checkout ------------------------------ */

export interface CheckoutFormValues {
  name: string;
  contact: string;
  address: string;
  notes: string;
  paymentMethod: PaymentMethodId;
  ewalletProvider: EwalletProviderId;
  ewalletNumber: string;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvc: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutFormValues, string>>;

/* ------------------------------ Store config ------------------------------ */

export interface StoreConfig {
  name: string;
  tagline: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  footerNote: string;
  currency: { code: string; symbol: string; locale: string };
  pricing: {
    shippingFlatFee: number;
    freeShippingThreshold: number;
    taxRate: number;
    taxIncludedInPrices: boolean;
    taxLabel: string;
  };
  storage: { prefix: string; version: string };
  checkout: {
    minSimulatedDelayMs: number;
    maxSimulatedDelayMs: number;
    simulatedDeliveryDurationMs: number;
    orderIdPrefix: string;
  };
  inventory: { lowStockThreshold: number; maxQuantityPerItem: number };
  paymentMethods: { id: PaymentMethodId; label: string; description: string }[];
  ewalletProviders: { id: EwalletProviderId; label: string }[];
}
