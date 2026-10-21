import { STORE } from '../config/store';

const moneyFormatter = new Intl.NumberFormat(STORE.currency.locale, {
  style: 'currency',
  currency: STORE.currency.code,
  minimumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat(STORE.currency.locale, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

/** 1234.5 -> "₱1,234.50" (driven by STORE.currency). */
export function formatMoney(amount: number): string {
  return moneyFormatter.format(amount);
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : dateFormatter.format(date);
}
