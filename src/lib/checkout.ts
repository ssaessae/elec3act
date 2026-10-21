import { STORE } from '../config/store';
import type { CheckoutFormValues, PlaceOrderInput } from '../types';
import { digitsOnly } from './validation';

/**
 * Converts raw form values into the data we are willing to persist.
 * IMPORTANT: card numbers, CVC and expiry are NEVER saved - only the last 4 digits.
 */
export function buildOrderInput(values: CheckoutFormValues): PlaceOrderInput {
  const customer = {
    name: values.name.trim(),
    address: values.address.trim(),
    contact: values.contact.trim(),
    notes: values.notes.trim() || undefined,
  };

  switch (values.paymentMethod) {
    case 'ewallet': {
      const provider = STORE.ewalletProviders.find((p) => p.id === values.ewalletProvider);
      return {
        customer,
        payment: {
          method: 'ewallet',
          label: provider?.label ?? 'E-Wallet',
          detail: `•••• ${digitsOnly(values.ewalletNumber).slice(-4)}`,
        },
      };
    }
    case 'card':
      return {
        customer,
        payment: {
          method: 'card',
          label: 'Credit / Debit card',
          detail: `•••• ${digitsOnly(values.cardNumber).slice(-4)}`,
        },
      };
    default:
      return {
        customer,
        payment: { method: 'cod', label: 'Cash on delivery', detail: 'Pay when it arrives' },
      };
  }
}
