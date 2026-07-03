import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import CrmCaptureApp from '@/components/crm/CrmCaptureApp';

export const metadata: Metadata = {
  title: 'Maida · Nhập liệu CRM',
  robots: { index: false, follow: false },
};

export default function CapturePage() {
  return (
    <>
      <SiteNav />
      <CrmCaptureApp />
    </>
  );
}
