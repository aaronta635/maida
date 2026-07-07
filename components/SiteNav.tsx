'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/crm/supabase/client';
import { navLinks } from '@/lib/site-links';

export default function SiteNav() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user.email ?? null);
      setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    setEmail(null);
    router.push('/');
    router.refresh();
  }

  return (
    <nav
      style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        alignItems: 'center',
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
      <span style={{ flex: 1 }} />
      {ready && (
        <>
          {email ? (
            <>
              <span style={{ color: '#9a9484', fontSize: 11 }}>{email}</span>
              <button
                type="button"
                onClick={signOut}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,.25)',
                  color: '#ddecd4',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: 11,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link
              href="/login"
              style={{
                color: '#B8965A',
                textDecoration: 'none',
                fontWeight: 600,
                border: '1px solid rgba(184,150,90,.5)',
                borderRadius: 6,
                padding: '4px 10px',
              }}
            >
              Đăng nhập
            </Link>
          )}
        </>
      )}
    </nav>
  );
}
