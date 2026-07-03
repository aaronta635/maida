'use client';

import { useEffect, useRef } from 'react';
import { buildVietQR } from '@/lib/crm/sale/engine';

declare global {
  interface Window {
    qrcode?: (type: number, level: string) => {
      addData: (d: string) => void;
      make: () => void;
      createImgTag: (cell: number, margin: number) => string;
    };
  }
}

function loadQrLib(): Promise<void> {
  if (typeof window !== 'undefined' && window.qrcode) return Promise.resolve();
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
    s.onload = () => res();
    s.onerror = () => rej();
    document.head.appendChild(s);
  });
}

export default function VietQr({ payload }: { payload: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!payload || !ref.current) return;
    loadQrLib()
      .then(() => {
        if (!ref.current || !window.qrcode) return;
        try {
          const qr = window.qrcode(0, 'M');
          qr.addData(payload);
          qr.make();
          ref.current.innerHTML = qr.createImgTag(8, 0);
        } catch {
          ref.current.innerHTML =
            '<div class="ph">Quét STK bên cạnh để chuyển khoản</div>';
        }
      })
      .catch(() => {
        if (ref.current)
          ref.current.innerHTML =
            '<div class="ph">Quét STK bên cạnh để chuyển khoản</div>';
      });
  }, [payload]);

  return (
    <div className="inv-qr" ref={ref}>
      <div className="ph">Đang tạo mã QR…</div>
    </div>
  );
}
