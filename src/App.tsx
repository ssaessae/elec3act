import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { StoreProvider, useStore } from './context/StoreContext';
import { ToastProvider } from './context/ToastContext';
import { useRoute } from './hooks/useRoute';
import CatalogPage from './pages/CatalogPage';
import TransactionPage from './pages/TransactionPage';

function Shell() {
  const route = useRoute();
  const { itemCount } = useStore();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip link. Uses preventDefault because the URL hash drives routing. */}
      <a
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main')?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <Navbar route={route} itemCount={itemCount} />

      <div className="flex-1">{route === 'checkout' ? <TransactionPage /> : <CatalogPage />}</div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <StoreProvider>
        <Shell />
      </StoreProvider>
    </ToastProvider>
  );
}
