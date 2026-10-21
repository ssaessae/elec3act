import { useEffect, useRef, useState } from 'react';
import { STORE } from '../config/store';
import type { Route } from '../hooks/useRoute';
import { CartIcon, LeafIcon } from './icons';

interface Props {
  route: Route;
  itemCount: number;
}

export default function Navbar({ route, itemCount }: Props) {
  // "Bump" the cart button whenever the count goes up (instant visual feedback).
  const previousCount = useRef(itemCount);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (itemCount > previousCount.current) {
      setBump(true);
      const timer = window.setTimeout(() => setBump(false), 450);
      previousCount.current = itemCount;
      return () => window.clearTimeout(timer);
    }
    previousCount.current = itemCount;
    setBump(false);
  }, [itemCount]);

  const linkBase = 'rounded-full px-4 py-2 text-sm font-medium transition';

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <a href="#/" className="flex items-center gap-2.5 rounded-full">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-leaf text-white">
            <LeafIcon width={20} height={20} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">{STORE.name}</span>
        </a>

        <div className="flex items-center gap-1.5">
          <a
            href="#/"
            aria-current={route === 'catalog' ? 'page' : undefined}
            className={`${linkBase} ${route === 'catalog' ? 'bg-ink text-white' : 'text-ink hover:bg-white'}`}
          >
            Shop
          </a>

          <a
            href="#/cart"
            aria-current={route === 'checkout' ? 'page' : undefined}
            aria-label={`Cart and checkout, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            className={`${linkBase} relative inline-flex items-center gap-2 ${bump ? 'animate-bump' : ''} ${
              route === 'checkout' ? 'bg-ink text-white' : 'bg-white text-ink shadow-sm hover:shadow-card'
            }`}
          >
            <CartIcon width={18} height={18} />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span
                key={itemCount}
                className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 animate-pop place-items-center rounded-full bg-clay px-1 text-[11px] font-bold leading-none text-white ring-2 ring-paper"
              >
                {itemCount}
              </span>
            )}
          </a>
        </div>
      </nav>
    </header>
  );
}
