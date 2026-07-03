import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Maida Lodge',
  description: 'Đặt phòng · Gọi món · Dịch vụ · CRM nội bộ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const env = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  };

  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,600&family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__MAIDA_ENV=${JSON.stringify(env)};`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
