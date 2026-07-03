import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import { hubSections } from '@/lib/site-links';

export default function HomeHub() {
  return (
    <>
      <SiteNav />
      <main
        style={{
          minHeight: '100vh',
          background: '#F5F0E8',
          maxWidth: 720,
          margin: '0 auto',
          padding: '32px 16px 48px',
          fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
        }}
      >
        <header style={{ marginBottom: 32 }}>
          <h1
            style={{
              margin: '0 0 8px',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 32,
              fontWeight: 700,
              color: '#2C3E2D',
            }}
          >
            Maida Lodge
          </h1>
          <p style={{ margin: 0, color: '#6b6555', fontSize: 15, lineHeight: 1.6 }}>
            Hồ Hoà Bình · Tiền Phong · Phú Thọ — chọn trang bên dưới.
          </p>
        </header>

        {hubSections.map((section) => (
          <section key={section.title} style={{ marginBottom: 28 }}>
            <h2
              style={{
                margin: '0 0 12px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#B8965A',
              }}
            >
              {section.title}
            </h2>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      display: 'block',
                      padding: '14px 16px',
                      background: '#fff',
                      border: '1px solid #e3dccb',
                      borderRadius: 12,
                      textDecoration: 'none',
                      color: '#2b2b26',
                      boxShadow: '0 1px 6px rgba(44,62,45,.06)',
                    }}
                  >
                    <span style={{ display: 'block', fontWeight: 600, fontSize: 15 }}>
                      {link.label}
                    </span>
                    <span style={{ display: 'block', marginTop: 4, fontSize: 13, color: '#8a8472' }}>
                      {link.desc}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </>
  );
}
