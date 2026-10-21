import { useMemo, useState, type FormEvent } from 'react';
import { STORE } from '../config/store';
import { FIELD_ORDER, formatCardNumber, formatExpiry, validateCheckout } from '../lib/validation';
import type { CheckoutFormValues, EwalletProviderId, PaymentMethodId } from '../types';
import TextField from './TextField';

/** The "Place order" button lives in OrderSummary and points at this form via the `form` attribute. */
export const CHECKOUT_FORM_ID = 'checkout-form';

const INITIAL_VALUES: CheckoutFormValues = {
  name: '',
  contact: '',
  address: '',
  notes: '',
  paymentMethod: 'ewallet',
  ewalletProvider: 'gcash',
  ewalletNumber: '',
  cardNumber: '',
  cardName: '',
  cardExpiry: '',
  cardCvc: '',
};

interface Props {
  onSubmit: (values: CheckoutFormValues) => void;
  /** Locks every field while the order is processing. */
  disabled?: boolean;
}

const fieldId = (key: keyof CheckoutFormValues) => `checkout-${key}`;

export default function CheckoutForm({ onSubmit, disabled = false }: Props) {
  const [values, setValues] = useState<CheckoutFormValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutFormValues, boolean>>>({});
  const [attempted, setAttempted] = useState(false);

  const errors = useMemo(() => validateCheckout(values), [values]);

  function set<K extends keyof CheckoutFormValues>(key: K, value: CheckoutFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }
  const touch = (key: keyof CheckoutFormValues) => setTouched((current) => ({ ...current, [key]: true }));
  // Errors appear after a field is left, or for every field once submit was attempted.
  const errorFor = (key: keyof CheckoutFormValues) => (attempted || touched[key] ? errors[key] : undefined);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const firstInvalid = FIELD_ORDER.find((key) => errors[key]);
    if (firstInvalid) {
      setAttempted(true);
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }
    onSubmit(values);
  }

  return (
    <form id={CHECKOUT_FORM_ID} onSubmit={handleSubmit} noValidate aria-label="Checkout">
      {/* `disabled` on a fieldset disables every control inside it. */}
      <fieldset disabled={disabled} className="space-y-8 disabled:opacity-70">
        {/* ------------------------- Delivery details ------------------------- */}
        <section aria-labelledby="delivery-heading" className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6">
          <h2 id="delivery-heading" className="font-display text-2xl font-semibold tracking-tight">
            Delivery details
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <TextField
              id={fieldId('name')}
              label="Full name"
              value={values.name}
              onChange={(v) => set('name', v)}
              onBlur={() => touch('name')}
              error={errorFor('name')}
              autoComplete="name"
              placeholder="Juan Dela Cruz"
            />
            <TextField
              id={fieldId('contact')}
              label="Mobile number"
              type="tel"
              inputMode="tel"
              value={values.contact}
              onChange={(v) => set('contact', v)}
              onBlur={() => touch('contact')}
              error={errorFor('contact')}
              autoComplete="tel"
              placeholder="0917 123 4567"
            />
            <div className="sm:col-span-2">
              <TextField
                id={fieldId('address')}
                label="Delivery address"
                multiline
                value={values.address}
                onChange={(v) => set('address', v)}
                onBlur={() => touch('address')}
                error={errorFor('address')}
                autoComplete="street-address"
                placeholder="Unit / street, barangay, city, province"
              />
            </div>
            <div className="sm:col-span-2">
              <TextField
                id={fieldId('notes')}
                label="Delivery notes"
                optional
                value={values.notes}
                onChange={(v) => set('notes', v)}
                maxLength={200}
                placeholder="Landmarks, gate code, preferred time…"
              />
            </div>
          </div>
        </section>

        {/* ----------------------------- Payment ----------------------------- */}
        <section aria-labelledby="payment-heading" className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6">
          <h2 id="payment-heading" className="font-display text-2xl font-semibold tracking-tight">
            Payment
          </h2>
          <p className="mt-1 text-sm text-muted">This is a simulation - no money moves and nothing is sent anywhere.</p>

          <div role="radiogroup" aria-label="Payment method" className="mt-5 grid gap-3 sm:grid-cols-3">
            {STORE.paymentMethods.map((method) => (
              <label key={method.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={values.paymentMethod === method.id}
                  onChange={() => set('paymentMethod', method.id as PaymentMethodId)}
                  className="peer sr-only"
                />
                <span className="block h-full rounded-2xl border border-line bg-white p-4 transition peer-checked:border-leaf peer-checked:bg-leaf-soft peer-checked:ring-2 peer-checked:ring-leaf/30 peer-focus-visible:ring-2 peer-focus-visible:ring-leaf peer-focus-visible:ring-offset-2 hover:border-ink/30">
                  <span className="block text-sm font-semibold">{method.label}</span>
                  <span className="mt-0.5 block text-xs text-muted">{method.description}</span>
                </span>
              </label>
            ))}
          </div>

          {/* E-wallet */}
          {values.paymentMethod === 'ewallet' && (
            <div key="ewallet" className="mt-5 animate-fade-up space-y-4">
              <div role="radiogroup" aria-label="E-wallet provider" className="flex gap-2">
                {STORE.ewalletProviders.map((provider) => (
                  <label key={provider.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="ewalletProvider"
                      value={provider.id}
                      checked={values.ewalletProvider === provider.id}
                      onChange={() => set('ewalletProvider', provider.id as EwalletProviderId)}
                      className="peer sr-only"
                    />
                    <span className="block rounded-full border border-line px-5 py-2 text-sm font-medium transition peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-leaf peer-focus-visible:ring-offset-2">
                      {provider.label}
                    </span>
                  </label>
                ))}
              </div>
              <TextField
                id={fieldId('ewalletNumber')}
                label="Wallet mobile number"
                type="tel"
                inputMode="tel"
                value={values.ewalletNumber}
                onChange={(v) => set('ewalletNumber', v)}
                onBlur={() => touch('ewalletNumber')}
                error={errorFor('ewalletNumber')}
                hint="Demo only - try 0917 123 4567."
                placeholder="0917 123 4567"
              />
            </div>
          )}

          {/* Card */}
          {values.paymentMethod === 'card' && (
            <div key="card" className="mt-5 grid animate-fade-up gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextField
                  id={fieldId('cardNumber')}
                  label="Card number"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  value={values.cardNumber}
                  onChange={(v) => set('cardNumber', formatCardNumber(v))}
                  onBlur={() => touch('cardNumber')}
                  error={errorFor('cardNumber')}
                  hint="Demo only - try 4242 4242 4242 4242. Only the last 4 digits are ever saved."
                  placeholder="4242 4242 4242 4242"
                />
              </div>
              <div className="sm:col-span-2">
                <TextField
                  id={fieldId('cardName')}
                  label="Name on card"
                  autoComplete="cc-name"
                  value={values.cardName}
                  onChange={(v) => set('cardName', v)}
                  onBlur={() => touch('cardName')}
                  error={errorFor('cardName')}
                  placeholder="JUAN DELA CRUZ"
                />
              </div>
              <TextField
                id={fieldId('cardExpiry')}
                label="Expiry (MM/YY)"
                inputMode="numeric"
                autoComplete="cc-exp"
                value={values.cardExpiry}
                onChange={(v) => set('cardExpiry', formatExpiry(v))}
                onBlur={() => touch('cardExpiry')}
                error={errorFor('cardExpiry')}
                placeholder="12/30"
                maxLength={5}
              />
              <TextField
                id={fieldId('cardCvc')}
                label="CVC"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={values.cardCvc}
                onChange={(v) => set('cardCvc', v.replace(/\D/g, '').slice(0, 4))}
                onBlur={() => touch('cardCvc')}
                error={errorFor('cardCvc')}
                placeholder="123"
                maxLength={4}
              />
            </div>
          )}

          {/* Cash on delivery */}
          {values.paymentMethod === 'cod' && (
            <p key="cod" className="mt-5 animate-fade-up rounded-2xl bg-paper p-4 text-sm text-muted">
              Please prepare the exact amount if you can. Our rider will hand you a receipt on delivery.
            </p>
          )}
        </section>
      </fieldset>
    </form>
  );
}
