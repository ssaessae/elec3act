import type { Category, Product, Subcategory } from '../types';
import { initialsOf, placeholderImage } from '../lib/placeholder';

/* =========================================================================
 *  PRODUCT DATA  -  edit names, prices, stock and categories right here.
 * =========================================================================
 *
 *  IMAGES - where to replace the placeholders
 *  ------------------------------------------
 *  Product photos are served from public/images/products/ using each product's
 *  `slug` and the configured image extension.
 *  Prefer a CDN/Unsplash URL for a single product? Add `imageUrl: 'https://...'`
 *  to that product's entry in SEED_PRODUCTS; it overrides everything else.
 *  Missing files fall back to a neutral placeholder automatically.
 */
export const USE_PLACEHOLDER_IMAGES = true;
export const IMAGE_BASE_PATH = '/images/products/'; // served from /public
export const IMAGE_EXTENSION = 'png';

/** Shown when any image fails to load. */
export const FALLBACK_IMAGE = placeholderImage('—', 150);

/* ------------------------------ Categories ------------------------------ */

export const CATEGORIES: Category[] = [
  {
    id: 'snacks',
    name: 'Snacks',
    subcategories: [
      { id: 'instant-noodles', name: 'Instant Noodles' },
      { id: 'chips', name: 'Chips' },
      { id: 'chocolates', name: 'Chocolates' },
      { id: 'cookies', name: 'Cookies' },
      { id: 'wafers', name: 'Wafers' },
      { id: 'crackers', name: 'Crackers' },
    ],
  },
  {
    id: 'breakfast',
    name: 'Breakfast Foods',
    subcategories: [
      { id: 'cereals', name: 'Cereals' },
      { id: 'oatmeal', name: 'Oatmeal' },
    ],
  },
  {
    id: 'beverages',
    name: 'Beverages',
    subcategories: [
      { id: 'coffee', name: 'Coffee' },
      { id: 'tea', name: 'Tea' },
      { id: 'milk-dairy', name: 'Milk and Dairy Alternatives' },
      { id: 'chocolate-drinks', name: 'Chocolate Drinks' },
      { id: 'water', name: 'Water' },
      { id: 'soft-drinks', name: 'Soft Drinks' },
      { id: 'sports-drinks', name: 'Sports Drinks' },
      { id: 'juice', name: 'Juice' },
    ],
  },
  {
    id: 'canned',
    name: 'Canned and Packaged Goods',
    subcategories: [
      { id: 'canned-seafood', name: 'Canned Seafood' },
      { id: 'canned-meat', name: 'Canned Meat' },
    ],
  },
  {
    id: 'spreads-condiments',
    name: 'Spreads and Condiments',
    subcategories: [
      { id: 'spreads', name: 'Spreads' },
      { id: 'condiments', name: 'Condiments' },
    ],
  },
  {
    id: 'cooking',
    name: 'Cooking Essentials',
    subcategories: [{ id: 'cooking-oils', name: 'Cooking Oils' }],
  },
];

/* ------------------------------ Seed data ------------------------------ */

/** Authoring shape: compact, one line of meaning per product. */
interface SeedProduct {
  /** URL-safe unique id; also the image file name. */
  slug: string;
  /** Generic title. */
  name: string;
  /** Real-world example reference (brand + product). */
  reference: string;
  size: string;
  categoryId: string;
  subcategoryId: string;
  /** Mock price in PHP. */
  price: number;
  /** Mock stock. Includes some low/zero values to demo the stock indicator. */
  stock: number;
  /** Placeholder colour (0-360). Only used for generated placeholders. */
  hue: number;
  /** Optional explicit image URL for this product only. */
  imageUrl?: string;
}

const SEED_PRODUCTS: SeedProduct[] = [
  // ---- Snacks > Instant Noodles
  { slug: 'PancitCanton', name: 'Instant Noodles', reference: 'Lucky Me! Pancit Canton', size: '60 g', categoryId: 'snacks', subcategoryId: 'instant-noodles', price: 18, stock: 120, hue: 28 },
  { slug: 'nissin-cup-noodles', name: 'Instant Noodles', reference: 'Nissin Cup Noodles', size: '40 g cup', categoryId: 'snacks', subcategoryId: 'instant-noodles', price: 45, stock: 64, hue: 8 },
  { slug: 'indomie-mi-goreng', name: 'Instant Noodles', reference: 'Indomie Mi Goreng', size: '85 g', categoryId: 'snacks', subcategoryId: 'instant-noodles', price: 22, stock: 8, hue: 18 },

  // ---- Snacks > Chips
  { slug: 'lays-classic', name: 'Potato Chips', reference: "Lay's Classic", size: '60 g', categoryId: 'snacks', subcategoryId: 'chips', price: 42, stock: 75, hue: 48 },
  { slug: 'pringles-original', name: 'Potato Chips', reference: 'Pringles Original', size: '107 g can', categoryId: 'snacks', subcategoryId: 'chips', price: 119, stock: 40, hue: 2 },

  // ---- Snacks > Chocolates
  { slug: 'cadbury-dairy-milk', name: 'Chocolate Bar', reference: 'Cadbury Dairy Milk', size: '90 g', categoryId: 'snacks', subcategoryId: 'chocolates', price: 89, stock: 52, hue: 270 },
  { slug: 'kitkat', name: 'Chocolate Bar', reference: 'KitKat', size: '4-finger, 35 g', categoryId: 'snacks', subcategoryId: 'chocolates', price: 48, stock: 90, hue: 352 },
  { slug: 'snickers', name: 'Chocolate Bar', reference: 'Snickers', size: '51 g', categoryId: 'snacks', subcategoryId: 'chocolates', price: 46, stock: 7, hue: 24 },

  // ---- Snacks > Cookies / Wafers / Crackers
  { slug: 'oreo-original', name: 'Sandwich Cookies', reference: 'Oreo Original', size: '119.6 g', categoryId: 'snacks', subcategoryId: 'cookies', price: 39, stock: 110, hue: 222 },
  { slug: 'loacker-quadratini', name: 'Wafer Biscuits', reference: 'Loacker Quadratini', size: '110 g', categoryId: 'snacks', subcategoryId: 'wafers', price: 175, stock: 25, hue: 38 },
  { slug: 'skyflakes', name: 'Crackers', reference: 'SkyFlakes', size: '10 × 25 g', categoryId: 'snacks', subcategoryId: 'crackers', price: 74, stock: 80, hue: 200 },
  { slug: 'fita-crackers', name: 'Biscuits', reference: 'Fita Crackers', size: '10 × 30 g', categoryId: 'snacks', subcategoryId: 'crackers', price: 68, stock: 45, hue: 140 },

  // ---- Breakfast Foods
  { slug: 'kelloggs-corn-flakes', name: 'Breakfast Cereal', reference: "Kellogg's Corn Flakes", size: '275 g', categoryId: 'breakfast', subcategoryId: 'cereals', price: 169, stock: 34, hue: 12 },
  { slug: 'quaker-instant-oats', name: 'Oatmeal', reference: 'Quaker Instant Oats', size: '800 g', categoryId: 'breakfast', subcategoryId: 'oatmeal', price: 225, stock: 28, hue: 44 },

  // ---- Beverages > Coffee
  { slug: 'nescafe-classic', name: 'Instant Coffee', reference: 'Nescafé Classic', size: '50 g jar', categoryId: 'beverages', subcategoryId: 'coffee', price: 149, stock: 60, hue: 10 },
  { slug: 'kopiko-brown-coffee', name: 'Instant Coffee', reference: 'Kopiko Brown Coffee', size: '10 × 25 g', categoryId: 'beverages', subcategoryId: 'coffee', price: 89, stock: 95, hue: 20 },
  { slug: 'starbucks-house-blend', name: 'Ground Coffee', reference: 'Starbucks House Blend', size: '200 g', categoryId: 'beverages', subcategoryId: 'coffee', price: 595, stock: 0, hue: 158 },

  // ---- Beverages > the rest
  { slug: 'lipton-yellow-label-tea', name: 'Tea', reference: 'Lipton Yellow Label Tea', size: '25 tea bags', categoryId: 'beverages', subcategoryId: 'tea', price: 99, stock: 70, hue: 52 },
  { slug: 'bear-brand-powdered-milk', name: 'Powdered Milk', reference: 'Bear Brand Fortified Powdered Milk', size: '300 g', categoryId: 'beverages', subcategoryId: 'milk-dairy', price: 179, stock: 48, hue: 205 },
  { slug: 'milo', name: 'Chocolate Malt Drink', reference: 'Milo', size: '380 g', categoryId: 'beverages', subcategoryId: 'chocolate-drinks', price: 165, stock: 66, hue: 128 },
  { slug: 'wilkins-distilled-water', name: 'Bottled Water', reference: 'Wilkins Distilled Drinking Water', size: '1 L', categoryId: 'beverages', subcategoryId: 'water', price: 29, stock: 150, hue: 195 },
  { slug: 'coca-cola-original', name: 'Soft Drink', reference: 'Coca-Cola Original Taste', size: '1.5 L', categoryId: 'beverages', subcategoryId: 'soft-drinks', price: 79, stock: 85, hue: 358 },
  { slug: 'gatorade', name: 'Sports Drink', reference: 'Gatorade', size: '500 ml', categoryId: 'beverages', subcategoryId: 'sports-drinks', price: 49, stock: 9, hue: 188 },
  { slug: 'del-monte-pineapple-juice', name: 'Fruit Juice', reference: 'Del Monte Pineapple Juice', size: '1 L', categoryId: 'beverages', subcategoryId: 'juice', price: 85, stock: 56, hue: 46 },

  // ---- Canned and Packaged Goods
  { slug: 'century-tuna-flakes', name: 'Canned Tuna', reference: 'Century Tuna Flakes in Oil', size: '155 g', categoryId: 'canned', subcategoryId: 'canned-seafood', price: 43, stock: 130, hue: 212 },
  { slug: 'ligo-sardines-tomato', name: 'Canned Sardines', reference: 'Ligo Sardines in Tomato Sauce', size: '155 g', categoryId: 'canned', subcategoryId: 'canned-seafood', price: 29, stock: 140, hue: 4 },
  { slug: 'spam-classic', name: 'Canned Meat', reference: 'Spam Classic', size: '340 g', categoryId: 'canned', subcategoryId: 'canned-meat', price: 239, stock: 30, hue: 350 },

  // ---- Spreads and Condiments
  { slug: 'skippy-creamy-peanut-butter', name: 'Peanut Butter', reference: 'Skippy Creamy Peanut Butter', size: '340 g', categoryId: 'spreads-condiments', subcategoryId: 'spreads', price: 169, stock: 38, hue: 36 },
  { slug: 'ufc-banana-ketchup', name: 'Ketchup', reference: 'UFC Banana Ketchup', size: '320 g', categoryId: 'spreads-condiments', subcategoryId: 'condiments', price: 39, stock: 100, hue: 0 },

  // ---- Cooking Essentials
  { slug: 'golden-fiesta-canola-oil', name: 'Cooking Oil', reference: 'Golden Fiesta Canola Oil', size: '1 L', categoryId: 'cooking', subcategoryId: 'cooking-oils', price: 195, stock: 42, hue: 55 },
];

/* ------------------------------ Public API ------------------------------ */

function resolveImage(seed: SeedProduct): string {
  if (seed.imageUrl) return seed.imageUrl;
  if (USE_PLACEHOLDER_IMAGES) return placeholderImage(initialsOf(seed.reference), seed.hue);
  return `${IMAGE_BASE_PATH}${seed.slug}.${IMAGE_EXTENSION}`;
}

/** The typed product catalogue (exactly 30 items). */
export const PRODUCTS: Product[] = SEED_PRODUCTS.map((seed) => ({
  id: seed.slug,
  name: seed.name,
  reference: seed.reference,
  size: seed.size,
  categoryId: seed.categoryId,
  subcategoryId: seed.subcategoryId,
  price: seed.price,
  stock: seed.stock,
  image: resolveImage(seed),
}));

export const PRODUCTS_BY_ID: ReadonlyMap<string, Product> = new Map(PRODUCTS.map((p) => [p.id, p]));

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getSubcategory(categoryId: string, subcategoryId: string): Subcategory | undefined {
  return getCategory(categoryId)?.subcategories.find((s) => s.id === subcategoryId);
}
