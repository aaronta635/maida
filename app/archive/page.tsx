import Link from 'next/link';
import SiteNav from '@/components/SiteNav';

const archives = [
  { href: '/archive/menu', label: 'Thực đơn (bản lưu)' },
  { href: '/archive/gallery', label: 'Gallery ảnh' },
  { href: '/archive/anh', label: 'Album ảnh' },
  { href: '/archive/dich-vu', label: 'Hoạt động dịch vụ' },
  { href: '/archive/duong-di', label: 'Đường đi' },
];

export default function ArchiveIndexPage() {
  return (
    <>
      <SiteNav />
      <main style={{ maxWidth: 680, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui' }}>
        <h1>Archive</h1>
        <p style={{ color: '#6b6555' }}>Các trang HTML cũ được giữ lại để tham khảo.</p>
        <ul style={{ lineHeight: 2 }}>
          {archives.map((a) => (
            <li key={a.href}><Link href={a.href}>{a.label}</Link></li>
          ))}
        </ul>
      </main>
    </>
  );
}
