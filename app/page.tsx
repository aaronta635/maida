import type { Metadata } from 'next';
import HomeHub from '@/components/HomeHub';

export const metadata: Metadata = {
  title: 'Maida Lodge',
  description: 'Điều hướng — đặt phòng, CRM nội bộ, quản lý đơn',
};

export default function HomePage() {
  return <HomeHub />;
}
