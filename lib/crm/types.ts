export type OrderStatus = 'pending' | 'confirmed' | 'done' | 'cancelled';
export type RoomRateType = 'wd' | 'we' | 'hol';

export interface Order {
  id: string;
  created_at: string;
  customer_name: string | null;
  customer_phone: string | null;
  pax: number | null;
  dates: string | null;
  note: string | null;
  room_rate_type: RoomRateType | null;
  subtotal: number;
  has_contact_items: boolean;
  status: OrderStatus;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  zone_id: string;
  zone_name: string;
  item_name_vi: string;
  item_name_en: string | null;
  unit: string | null;
  unit_price: number | null;
  quantity: number;
  line_total: number | null;
}

export interface CreateOrderInput {
  customer_name?: string | null;
  customer_phone: string;
  pax?: string | number | null;
  dates?: string | null;
  note?: string | null;
  room_rate_type?: RoomRateType | null;
  subtotal: number;
  has_contact_items?: boolean;
  status?: OrderStatus;
}

export interface CreateOrderItemInput {
  zone_id: string;
  zone_name: string;
  item_name_vi: string;
  item_name_en?: string | null;
  unit?: string | null;
  unit_price?: number | null;
  quantity: number;
  line_total?: number | null;
}

export interface LeadInput {
  customerName: string;
  customerPhone: string;
  source: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  roomTier?: RoomRateType | null;
  subtotal: number;
  lines: CreateOrderItemInput[];
}
