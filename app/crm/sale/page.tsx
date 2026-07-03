import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import SaleToolApp from '@/components/crm/sale/SaleToolApp';

export const metadata: Metadata = {
  title: 'Maida Lodge — Công cụ tạm tính (Nội bộ Sale)',
  robots: { index: false, follow: false },
};

export default function SalePage() {
  return (
    <>
      <SiteNav />
      <SaleToolApp />
    </>
  );
}
