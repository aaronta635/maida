import { createBrowserClient } from './supabase';
import type {
  CreateOrderInput,
  CreateOrderItemInput,
  LeadInput,
  Order,
  OrderStatus,
} from './types';

const PAGE_SIZE = 50;

/** Guest order intake — server-side only (no anon Supabase access). */
export async function submitGuestOrder(
  order: CreateOrderInput,
  items: CreateOrderItemInput[],
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order, items }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: (data as { error?: string }).error ?? 'Request failed' };
  }

  return { ok: true };
}

/** Staff-only: create order + items (requires authenticated session). */
export async function createOrderWithItems(
  order: CreateOrderInput,
  items: CreateOrderItemInput[],
): Promise<{ order: Order | null; error?: string }> {
  const sb = createBrowserClient();

  const { data: created, error: orderError } = await sb
    .from('orders')
    .insert({
      customer_name: order.customer_name || null,
      customer_phone: order.customer_phone,
      pax: order.pax != null ? Number(order.pax) || null : null,
      dates: order.dates || null,
      note: order.note || null,
      room_rate_type: order.room_rate_type || null,
      subtotal: order.subtotal,
      has_contact_items: order.has_contact_items ?? false,
      status: order.status ?? 'pending',
    })
    .select()
    .single();

  if (orderError || !created) {
    return { order: null, error: orderError?.message ?? 'Failed to create order' };
  }

  if (items.length) {
    const { error: itemsError } = await sb.from('order_items').insert(
      items.map((item) => ({
        order_id: created.id,
        zone_id: item.zone_id,
        zone_name: item.zone_name,
        item_name_vi: item.item_name_vi,
        item_name_en: item.item_name_en ?? null,
        unit: item.unit ?? null,
        unit_price: item.unit_price ?? null,
        quantity: item.quantity,
        line_total: item.line_total ?? null,
      })),
    );

    if (itemsError) {
      return { order: created as Order, error: itemsError.message };
    }
  }

  return { order: created as Order };
}

/** Save a sales quote as a CRM lead (orders table) — staff session required. */
export async function saveLeadToCrm(lead: LeadInput): Promise<{ ok: boolean; error?: string }> {
  const pax = (lead.adults ?? 0) + (lead.children ?? 0) || null;

  const dates =
    lead.checkIn && lead.checkOut ? `${lead.checkIn} → ${lead.checkOut}` : null;

  const { error } = await createOrderWithItems(
    {
      customer_name: lead.customerName || null,
      customer_phone: lead.customerPhone,
      pax,
      dates,
      note: lead.source,
      room_rate_type: lead.roomTier ?? null,
      subtotal: lead.subtotal,
      has_contact_items: false,
      status: 'pending',
    },
    lead.lines,
  );

  return error ? { ok: false, error } : { ok: true };
}

export async function fetchOrders(options: {
  offset?: number;
  limit?: number;
  status?: OrderStatus | 'all';
  search?: string;
  fromISO?: string | null;
}): Promise<{ orders: Order[]; hasMore: boolean; error?: string }> {
  const sb = createBrowserClient();
  const offset = options.offset ?? 0;
  const limit = options.limit ?? PAGE_SIZE;

  let q = sb
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (options.fromISO) q = q.gte('created_at', options.fromISO);
  if (options.status && options.status !== 'all') q = q.eq('status', options.status);
  if (options.search) {
    q = q.or(
      `customer_name.ilike.%${options.search}%,customer_phone.ilike.%${options.search}%`,
    );
  }

  const { data, error } = await q;
  if (error) return { orders: [], hasMore: false, error: error.message };

  const orders = (data ?? []) as Order[];
  return { orders, hasMore: orders.length === limit };
}

export async function fetchTodayStats(): Promise<{
  done: number;
  revenue: number;
  todayTotal: number;
}> {
  const sb = createBrowserClient();
  const today = new Date().toISOString().slice(0, 10) + 'T00:00:00';
  const { data } = await sb
    .from('orders')
    .select('status,subtotal')
    .gte('created_at', today);

  const rows = data ?? [];
  const done = rows.filter((o) => o.status === 'done').length;
  const revenue = rows
    .filter((o) => ['confirmed', 'done'].includes(o.status))
    .reduce((s, o) => s + (o.subtotal || 0), 0);

  return { done, revenue, todayTotal: rows.length };
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<{ ok: boolean; error?: string }> {
  const sb = createBrowserClient();
  const { error } = await sb.from('orders').update({ status }).eq('id', id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  const sb = createBrowserClient();
  const { data } = await sb
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single();
  return (data as Order) ?? null;
}

export function subscribeToOrders(callbacks: {
  onInsert: (id: string) => void;
  onUpdate: (row: Partial<Order> & { id: string }) => void;
}) {
  const sb = createBrowserClient();
  const channel = sb
    .channel('staff-orders')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      (payload) => callbacks.onInsert((payload.new as { id: string }).id),
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'orders' },
      (payload) => callbacks.onUpdate(payload.new as Partial<Order> & { id: string }),
    )
    .subscribe();

  return () => {
    sb.removeChannel(channel);
  };
}
