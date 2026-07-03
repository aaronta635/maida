import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import OrderApp from '@/components/order/OrderApp';

export const metadata: Metadata = {
  title: 'Maida Lodge — Đặt phòng · Gọi món · Dịch vụ',
};

export default function OrderPage() {
  return (
    <>
      <SiteNav />
      <OrderApp />
    </>
  );
}
