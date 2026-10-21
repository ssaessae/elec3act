import type { CheckoutErrors, CheckoutFormValues } from '../types';

/**
 * Philippine mobile numbers: 09XXXXXXXXX, +639XXXXXXXXX or 639XXXXXXXXX.
 * Edit this pattern if you localise the store for another country.
 */
const MOBILE_PATTERN = /^(09|\+639|639)\d{9}$/;

const cleanPhone = (value: string) => value.replace(/[\s-]/g, '');
export const digitsOnly = (value: string) => value.replace(/\D/g, '');

/** "4242424242424242" -> "4242 4242 4242 4242" (max 19 digits). */
export function formatCardNumber(value: string): string {
  return digitsOnly(value)
    .slice(0, 19)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

/** "1228" -> "12/28" */
export function formatExpiry(value: string): string {
  const digits = digitsOnly(value).slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function isFutureExpiry(value: string): boolean {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  // A card is valid through the last day of its expiry month.
  return new Date(year, month, 1).getTime() > Date.now();
}

/**
 * Validates only the fields relevant to the chosen payment method.
 * Returns an object keyed by field name; an empty object means "valid".
 */
export function validateCheckout(values: CheckoutFormValues): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (values.name.trim().length < 2) errors.name = 'Please enter your full name.';
  if (!MOBILE_PATTERN.test(cleanPhone(values.contact))) {
    errors.contact = 'Enter a valid mobile number, e.g. 0917 123 4567.';
  }
  if (values.address.trim().length < 10) {
    errors.address = 'Please enter a complete address (street, barangay, city).';
  }

  if (values.paymentMethod === 'ewallet') {
    if (!MOBILE_PATTERN.test(cleanPhone(values.ewalletNumber))) {
      errors.ewalletNumber = 'Enter the mobile number linked to your wallet.';
    }
  }

  if (values.paymentMethod === 'card') {
    const cardDigits = digitsOnly(values.cardNumber);
    if (cardDigits.length < 13 || cardDigits.length > 19) {
      errors.cardNumber = 'Card number should be 13 to 19 digits.';
    }
    if (values.cardName.trim().length < 2) errors.cardName = 'Enter the name printed on the card.';
    if (!isFutureExpiry(values.cardExpiry)) errors.cardExpiry = 'Use a future date as MM/YY.';
    if (!/^\d{3,4}$/.test(values.cardCvc)) errors.cardCvc = '3 or 4 digits.';
  }

  return errors;
}

/** Field order used to focus the first invalid input on submit. */
export const FIELD_ORDER: (keyof CheckoutFormValues)[] = [
  'name',
  'contact',
  'address',
  'ewalletNumber',
  'cardNumber',
  'cardName',
  'cardExpiry',
  'cardCvc',
];
