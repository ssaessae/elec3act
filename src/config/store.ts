import type { StoreConfig } from '../types';

/**
 * ONE place to rebrand and tune the shop.
 * Change the store name, currency, shipping rules, tax behaviour, copy and
 * payment options here - no component needs to be touched.
 * (Product names, prices and stock live in src/data/products.ts.)
 */
export const STORE: StoreConfig = {
  /* ---------- Branding & copy ---------- */
  name: 'Pantry Lane',
  tagline: 'Everyday groceries, thoughtfully delivered.',
  heroEyebrow: 'The weekly shop, simplified',
  heroTitle: 'Good pantry staples, without the noise.',
  heroSubtitle:
    'Thirty everyday favourites - noodles, coffee, snacks and cupboard essentials - ready for your basket.',
  footerNote: 'Demo storefront. No real payments are processed and no data leaves your browser.',

  /* ---------- Currency ---------- */
  currency: { code: 'PHP', symbol: '₱', locale: 'en-PH' },

  /* ---------- Pricing rules ---------- */
  pricing: {
    shippingFlatFee: 49, // charged when subtotal is below the threshold
    freeShippingThreshold: 500, // subtotal at/above this ships free
    taxRate: 0.12, // 12% VAT
    // true  -> prices already include VAT; the tax line is informational only (typical for PH groceries)
    // false -> VAT is added on top of the subtotal at checkout
    taxIncludedInPrices: true,
    taxLabel: 'VAT',
  },

  /* ---------- localStorage ---------- */
  // Keys become `${prefix}:${version}:cart` and `${prefix}:${version}:orders`.
  // Bump `version` if you ever change the shape of stored data to start fresh.
  storage: { prefix: 'pantrylane', version: 'v1' },

  /* ---------- Checkout simulation ---------- */
  checkout: {
    minSimulatedDelayMs: 1200,
    maxSimulatedDelayMs: 2000,
    orderIdPrefix: 'PL',
  },

  /* ---------- Inventory behaviour ---------- */
  inventory: {
    lowStockThreshold: 10, // "Only N left" shows at or below this
    maxQuantityPerItem: 20, // hard cap per product in one order
  },

  /* ---------- Payment options ---------- */
  paymentMethods: [
    { id: 'ewallet', label: 'E-Wallet', description: 'GCash or Maya' },
    { id: 'card', label: 'Credit / Debit card', description: 'Visa, Mastercard' },
    { id: 'cod', label: 'Cash on delivery', description: 'Pay when it arrives' },
  ],
  ewalletProviders: [
    { id: 'gcash', label: 'GCash' },
    { id: 'maya', label: 'Maya' },
  ],
};
