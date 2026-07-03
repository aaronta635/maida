'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import '@/app/crm/sale/sale.css';

export default function SaleLegacyHost() {
  const hostRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  function mountApp() {
    if (scriptLoadedRef.current || !hostRef.current) return;
    scriptLoadedRef.current = true;
    const s = document.createElement('script');
    s.src = '/crm/sale-app.js';
    s.async = false;
    document.body.appendChild(s);
  }

  useEffect(() => {
    fetch('/crm/sale-body.html')
      .then((r) => r.text())
      .then((html) => {
        if (!hostRef.current) return;
        hostRef.current.innerHTML = html;
        if (typeof window !== 'undefined' && (window as unknown as { supabase?: unknown }).supabase) {
          mountApp();
        }
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <div ref={hostRef} id="sale-root" />
      <Script
        src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
        strategy="afterInteractive"
        onLoad={() => {
          if (hostRef.current?.innerHTML) mountApp();
        }}
      />
    </>
  );
}
