import Link from 'next/link';
import SiteNav from '@/components/SiteNav';

export default function CrmHomePage() {
  return (
    <>
      <SiteNav />
      <main style={{ maxWidth: 680, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui' }}>
        <h1 style={{ color: '#2C3E2D' }}>CRM Maida Lodge</h1>
        <p style={{ color: '#6b6555' }}>Công cụ nội bộ — báo giá, nhập liệu khách, đồng bộ Supabase.</p>
        <ul style={{ lineHeight: 2 }}>
          <li><Link href="/crm/sale">Công cụ báo giá / tạm tính (Sale)</Link></li>
          <li><Link href="/crm/capture">Nhập liệu CRM (cọc · check-in · đánh giá)</Link></li>
          <li><Link href="/staff">Quản lý đơn (realtime)</Link></li>
        </ul>
      </main>
    </>
  );
}
