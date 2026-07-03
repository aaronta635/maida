import Link from 'next/link';
import { navLinks } from '@/lib/site-links';

export default function SiteNav() {
  return (
    <nav
      style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        padding: '8px 14px',
        background: '#1e3320',
        fontSize: 12,
        fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
      }}
    >
      <span style={{ color: '#B8965A', fontWeight: 800, marginRight: 8 }}>Maida</span>
      {navLinks.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          style={{ color: '#ddecd4', textDecoration: 'none', opacity: 0.9 }}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
