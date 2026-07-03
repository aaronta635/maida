import { readFileSync } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import LegacyArchiveFrame from '@/components/archive/LegacyArchiveFrame';

const SLUGS = ['menu', 'gallery', 'dich-vu', 'anh', 'duong-di'] as const;
type Slug = (typeof SLUGS)[number];

const TITLES: Record<Slug, string> = {
  menu: 'Maida · Thực đơn (bản lưu)',
  gallery: 'Maida · Thư viện ảnh',
  'dich-vu': 'Maida · Hoạt động dịch vụ',
  anh: 'Maida · Album ảnh',
  'duong-di': 'Maida · Đường đi',
};

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export default async function ArchivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SLUGS.includes(slug as Slug)) notFound();

  const file = path.join(process.cwd(), 'public/archive', `${slug}.html`);
  let html = '';
  try {
    html = readFileSync(file, 'utf8');
  } catch {
    notFound();
  }

  return <LegacyArchiveFrame title={TITLES[slug as Slug]} html={html} />;
}
