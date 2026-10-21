import { useEffect, useState } from 'react';

/**
 * Tiny hash router - the app only has two views, so no router library is needed.
 *   #/      -> catalog
 *   #/cart  -> transaction page (cart + checkout)
 */
export type Route = 'catalog' | 'checkout';

function currentRoute(): Route {
  return window.location.hash.startsWith('#/cart') ? 'checkout' : 'catalog';
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(currentRoute);

  useEffect(() => {
    function onHashChange() {
      setRoute(currentRoute());
      window.scrollTo({ top: 0 });
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}
