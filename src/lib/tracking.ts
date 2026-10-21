import { STORE } from '../config/store';
import type { OrderStatus, OrderTracking } from '../types';

export function trackingAt(orderId: string, startedAt: number, now = Date.now()): OrderTracking {
  const progress = Math.min(
    100,
    Math.max(0, ((now - startedAt) / STORE.checkout.simulatedDeliveryDurationMs) * 100),
  );
  let status: OrderStatus;

  if (progress < 25) status = 'confirmed-packed';
  else if (progress < 75) status = 'out-for-delivery';
  else if (progress < 100) status = 'approaching';
  else status = 'delivered';

  return { orderId, startedAt, progress, status };
}

export function trackingStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'confirmed-packed':
      return 'Order confirmed & packed';
    case 'out-for-delivery':
      return 'Out for delivery · rider assigned';
    case 'approaching':
      return 'Approaching your address';
    case 'delivered':
      return 'Delivered & completed';
  }
}
