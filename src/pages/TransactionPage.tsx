import { useState } from 'react';
import CaptchaModal from '../components/CaptchaModal';
import CartView from '../components/CartView';
import CheckoutForm, { CHECKOUT_FORM_ID } from '../components/CheckoutForm';
import { ArrowLeftIcon, CartIcon, SpinnerIcon } from '../components/icons';
import OrderHistory from '../components/OrderHistory';
import OrderSummary from '../components/OrderSummary';
import ReceiptModal from '../components/ReceiptModal';
import { useStore } from '../context/StoreContext';
import { buildOrderInput } from '../lib/checkout';
import { formatMoney } from '../lib/format';
import type { CheckoutFormValues, OrderReceipt } from '../types';

/** Page 2 - cart review, price breakdown, payment simulation and receipts. */
export default function TransactionPage() {
  const { lines, itemCount, totals, orders, placeOrder, getOrderReceipt, clearOrderHistory } = useStore();

  const [placing, setPlacing] = useState(false);
  const [captchaOpen, setCaptchaOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<CheckoutFormValues | null>(null);
  const [checkoutError, setCheckoutError] = useState('');
  const [receipt, setReceipt] = useState<{ receipt: OrderReceipt; isNew: boolean } | null>(null);

  function handleSubmit(values: CheckoutFormValues) {
    if (placing || captchaOpen || lines.length === 0) return;
    setCheckoutError('');
    setPendingValues(values);
    setCaptchaOpen(true);
  }

  async function handleVerified() {
    if (placing || !pendingValues) return;
    setPlacing(true);
    try {
      const orderReceipt = await placeOrder(buildOrderInput(pendingValues));
      setReceipt({ receipt: orderReceipt, isNew: true });
      setCaptchaOpen(false);
      setPendingValues(null);
    } catch {
      setCheckoutError('We couldn’t complete your order. Please try again.');
      setCaptchaOpen(false);
      setPendingValues(null);
    } finally {
      setPlacing(false);
    }
  }

  const isEmpty = lines.length === 0;

  return (
    <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pb-8 outline-none sm:px-6">
      <div className="animate-fade-up pb-8 pt-10 sm:pt-14">
        <a
          href="#/"
          className="inline-flex items-center gap-2 rounded-full text-sm font-medium text-muted transition hover:text-ink"
        >
          <ArrowLeftIcon width={16} height={16} /> Continue shopping
        </a>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Cart &amp; checkout</h1>
      </div>

      {isEmpty ? (
        <div className="animate-fade-up rounded-3xl border border-dashed border-line bg-white/60 px-6 py-16 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf-soft text-leaf">
            <CartIcon width={26} height={26} />
          </span>
          <p className="mt-5 font-display text-2xl font-semibold">Your basket is empty</p>
          <p className="mt-2 text-sm text-muted">Add a few pantry favourites and they’ll show up here.</p>
          <a href="#/" className="btn btn-primary mt-6">
            Browse the shop
          </a>
        </div>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-10">
            <CartView disabled={placing} />
            <CheckoutForm onSubmit={handleSubmit} disabled={placing} />
          </div>

          <aside className="lg:sticky lg:top-24">
            <OrderSummary totals={totals} itemCount={itemCount}>
              <button
                type="submit"
                form={CHECKOUT_FORM_ID}
                disabled={placing}
                aria-busy={placing}
                className="btn btn-primary w-full py-3.5 text-base"
              >
                {placing ? (
                  <>
                    <SpinnerIcon width={18} height={18} /> Processing payment…
                  </>
                ) : (
                  `Place order · ${formatMoney(totals.total)}`
                )}
              </button>
              <p className="mt-3 text-center text-xs text-muted">Simulated checkout · no real payment</p>
            </OrderSummary>
          </aside>
        </div>
      )}

      {checkoutError && (
        <p role="alert" className="mt-5 rounded-2xl border border-danger/20 bg-red-50 px-4 py-3 text-sm font-medium text-danger">
          {checkoutError}
        </p>
      )}

      <OrderHistory
        orders={orders}
        onView={(order) => setReceipt({ receipt: getOrderReceipt(order), isNew: false })}
        onClear={clearOrderHistory}
      />

      {receipt && (
        <ReceiptModal receipt={receipt.receipt} isNew={receipt.isNew} onClose={() => setReceipt(null)} />
      )}
      {captchaOpen && (
        <CaptchaModal
          busy={placing}
          onClose={() => {
            if (placing) return;
            setCaptchaOpen(false);
            setPendingValues(null);
          }}
          onVerified={handleVerified}
        />
      )}
    </main>
  );
}
