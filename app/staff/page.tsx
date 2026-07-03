import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import StaffDashboard from '@/components/staff/StaffDashboard';

export const metadata: Metadata = {
  title: 'Maida Lodge · Quản lý đơn',
  robots: { index: false, follow: false },
};

export default function StaffPage() {
  return (
    <>
      <SiteNav />
      <StaffDashboard />
    </>
  );
}
