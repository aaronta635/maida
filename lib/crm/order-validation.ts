import type { CreateOrderInput, CreateOrderItemInput } from './types';

const MAX_ITEMS = 50;
const MAX_NAME = 200;
const MAX_NOTE = 2000;
const MAX_SUBTOTAL = 500_000_000;

export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15) return null;
  return digits;
}

export function validateGuestOrderPayload(
  order: CreateOrderInput,
  items: CreateOrderItemInput[],
): string | null {
  if (!order.customer_name?.trim()) return 'Missing customer name';
  if (order.customer_name.length > MAX_NAME) return 'Name too long';
  if (!normalizePhone(order.customer_phone)) return 'Invalid phone number';
  if (!Array.isArray(items) || items.length === 0) return 'No items';
  if (items.length > MAX_ITEMS) return 'Too many items';
  if (order.subtotal < 0 || order.subtotal > MAX_SUBTOTAL) return 'Invalid subtotal';
  if (order.note && order.note.length > MAX_NOTE) return 'Note too long';
  if (order.room_rate_type && !['wd', 'we', 'hol'].includes(order.room_rate_type)) {
    return 'Invalid room rate type';
  }

  for (const item of items) {
    if (!item.zone_id || !item.zone_name || !item.item_name_vi) return 'Invalid item';
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
      return 'Invalid quantity';
    }
  }

  return null;
}
