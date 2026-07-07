import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/crm/supabase/admin';
import { normalizePhone, validateGuestOrderPayload } from '@/lib/crm/order-validation';
import type { CreateOrderInput, CreateOrderItemInput } from '@/lib/crm/types';

export async function POST(req: Request) {
  let body: { order?: CreateOrderInput; items?: CreateOrderItemInput[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const order = body.order;
  const items = body.items ?? [];

  if (!order) {
    return NextResponse.json({ error: 'Missing order' }, { status: 400 });
  }

  const validationError = validateGuestOrderPayload(order, items);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const phone = normalizePhone(order.customer_phone)!;

  try {
    const sb = createAdminClient();

    const { data: created, error: orderError } = await sb
      .from('orders')
      .insert({
        customer_name: order.customer_name!.trim(),
        customer_phone: phone,
        pax: order.pax != null ? Number(order.pax) || null : null,
        dates: order.dates?.trim() || null,
        note: order.note?.trim() || null,
        room_rate_type: order.room_rate_type || null,
        subtotal: order.subtotal,
        has_contact_items: order.has_contact_items ?? false,
        status: 'pending',
      })
      .select('id')
      .single();

    if (orderError || !created) {
      console.error('order insert:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
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
        console.error('order_items insert:', itemsError);
        return NextResponse.json({ error: 'Failed to save items' }, { status: 500 });
      }
    }

    return NextResponse.json({ id: created.id });
  } catch (e) {
    console.error('api/orders:', e);
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }
}
