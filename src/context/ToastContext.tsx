import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { CheckIcon, InfoIcon } from '../components/icons';

type ToastTone = 'success' | 'info' | 'error';

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastApi {
  push: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const TOAST_DURATION_MS = 2400;
const MAX_VISIBLE = 3;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const push = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = nextId.current++;
    setToasts((current) => [...current.slice(-(MAX_VISIBLE - 1)), { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, TOAST_DURATION_MS);
  }, []);

  const api = useMemo<ToastApi>(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Polite live region so screen readers announce "added to cart" feedback. */}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex max-w-sm animate-toast-in items-center gap-2.5 rounded-full bg-ink/90 px-4 py-2.5 text-sm font-medium text-white shadow-lift backdrop-blur-md"
          >
            <span
              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                toast.tone === 'success' ? 'bg-leaf' : toast.tone === 'error' ? 'bg-danger' : 'bg-white/25'
              }`}
            >
              {toast.tone === 'success' ? <CheckIcon width={12} height={12} /> : <InfoIcon width={12} height={12} />}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
