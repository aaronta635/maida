-- Maida Lodge · Production RLS (zero anon access)
-- Run in Supabase SQL Editor AFTER creating staff users in Authentication.
--
-- Prerequisites:
--   1. Authentication → Email provider enabled
--   2. Authentication → Users → add staff accounts
--   3. Deploy Next.js with middleware auth + /api/orders (service_role on server)

-- Remove open / transitional policies
drop policy if exists "Anyone can insert orders" on orders;
drop policy if exists "Anyone can read orders" on orders;
drop policy if exists "Anyone can update order status" on orders;
drop policy if exists "Anyone can insert order_items" on order_items;
drop policy if exists "Anyone can read order_items" on order_items;
drop policy if exists "anon_insert_orders" on orders;
drop policy if exists "anon_insert_order_items" on order_items;
drop policy if exists "staff_select_orders" on orders;
drop policy if exists "staff_insert_orders" on orders;
drop policy if exists "staff_update_orders" on orders;
drop policy if exists "staff_select_order_items" on order_items;
drop policy if exists "staff_insert_order_items" on order_items;

alter table orders enable row level security;
alter table order_items enable row level security;

-- NO policies for role `anon` → REST API with anon key cannot read or write.

-- Staff (authenticated via Supabase Auth session in browser)
create policy "staff_select_orders" on orders
  for select to authenticated using (true);

create policy "staff_insert_orders" on orders
  for insert to authenticated with check (true);

create policy "staff_update_orders" on orders
  for update to authenticated using (true) with check (true);

create policy "staff_select_order_items" on order_items
  for select to authenticated using (true);

create policy "staff_insert_order_items" on order_items
  for insert to authenticated with check (true);

-- Guest orders go through Next.js /api/orders using service_role (bypasses RLS).
