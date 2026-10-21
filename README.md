# Pantry Lane - grocery storefront

A modern two-page grocery e-commerce demo built with **React 18 + TypeScript + Vite + Tailwind CSS**.
No backend: the cart, order history and receipts live in the browser's `localStorage`.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
```

## The two pages

| Route    | Page            | What it does |
|----------|-----------------|--------------|
| `#/`     | `CatalogPage`   | Category + subcategory chips, live search, sorting, 30-product grid, add-to-cart with toast and cart-badge bounce |
| `#/cart` | `TransactionPage` | Cart lines with quantity controls, price breakdown, payment simulation form, order confirmation modal, saved receipts |

Routing is a ~20-line hash router (`src/hooks/useRoute.ts`), so there is no router dependency.

## Project structure

```
src/
  config/store.ts          <- store name, copy, currency, shipping, tax, payment options
  data/products.ts         <- categories + the 30 products (prices, stock, images)
  types/index.ts           <- Product, CartItem, Order, Category, ...
  lib/                     <- pricing, formatting, validation, storage, search/sort helpers
  hooks/                   <- usePersistentState, useRoute, useModalBehavior
  context/                 <- StoreContext (cart + orders), ToastContext
  components/              <- Navbar, CategoryBar, SearchSortBar, ProductCard, ProductGrid,
                              CartView, OrderSummary, CheckoutForm, ReceiptModal, OrderHistory, ...
  pages/                   <- CatalogPage, TransactionPage
```

## Customising

| I want to change...            | Edit |
|--------------------------------|------|
| Store name, tagline, hero copy | `src/config/store.ts` (also the `<title>` in `index.html`) |
| Currency symbol / locale       | `STORE.currency` in `src/config/store.ts` |
| Shipping fee, free-shipping threshold, VAT rate, VAT included vs. added | `STORE.pricing` |
| Payment options, e-wallet providers | `STORE.paymentMethods`, `STORE.ewalletProviders` |
| Checkout delay, order-ID prefix | `STORE.checkout` |
| Low-stock threshold, max qty per item | `STORE.inventory` |
| Product names, prices, stock, sizes | `SEED_PRODUCTS` in `src/data/products.ts` |
| Categories / subcategories     | `CATEGORIES` in `src/data/products.ts` |
| Colours and fonts              | `tailwind.config.js` |
| Mobile number format           | `MOBILE_PATTERN` in `src/lib/validation.ts` |

## Replacing the placeholder images

Every product currently shows a generated SVG placeholder (no network needed).

1. Put your photos in `public/images/products/`, named after each product's `slug`
   (e.g. `lucky-me-pancit-canton.jpg`).
2. In `src/data/products.ts` set `USE_PLACEHOLDER_IMAGES = false`.
3. Using `.webp`/`.png`? Change `IMAGE_EXTENSION`.
4. Want a hosted image for just one item? Add `imageUrl: 'https://...'` to that product's entry.

Any image that fails to load falls back to a neutral placeholder, so you can swap them gradually.

## How localStorage sync works

Two keys are used (prefix/version come from `STORE.storage`):

- `pantrylane:v1:cart`   - `CartItem[]`, i.e. `{ productId, quantity }` only
- `pantrylane:v1:orders` - `Order[]`, newest first (saved receipts)

`usePersistentState` (`src/hooks/usePersistentState.ts`) does the work:

1. **Load** - reads the key on first render and passes it through a sanitizer (`src/lib/storage.ts`), so corrupt or outdated data can't crash the app.
2. **Save** - every state change is written back automatically.
3. **Cross-tab sync** - a `storage` event listener updates other open tabs.

Design notes:

- The cart stores ids + quantities only, so price/name edits in `products.ts` apply to existing carts immediately. Products that no longer exist, or are out of stock, silently drop out of the cart; quantities are clamped to stock.
- Orders store a **snapshot** (names, unit prices, totals), so old receipts never change when you edit prices later.
- Card numbers, expiry and CVC are **never stored** - only the last 4 digits for display.
- If you change the shape of stored data, bump `STORE.storage.version` to start from a clean slate.
- On "Place order" the app waits 1.2-2.0 s, saves the order, clears the cart key, and opens the animated confirmation + itemised invoice.

## Demo input for the checkout form

- Mobile number: `0917 123 4567`
- Card: `4242 4242 4242 4242`, any future expiry (e.g. `12/30`), any 3-digit CVC

## Notes

- Two items demonstrate the stock states: *Starbucks House Blend* is out of stock; *Indomie*, *Snickers* and *Gatorade* show "Only N left". Edit `stock` in `products.ts` to change that.
- Stock is not decremented after an order (there is no backend).
- Fonts (Inter, Fraunces) load from Google Fonts in `index.html`; the app falls back to system fonts offline.
