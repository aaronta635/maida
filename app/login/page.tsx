import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import './login.css';

export const metadata: Metadata = {
  title: 'Maida Lodge — Đăng nhập',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-card">
        <Link href="/" className="login-back">
          ← Trang chủ
        </Link>
        <h1>Maida Lodge</h1>
        <p className="login-sub">Đăng nhập nội bộ</p>
        <Suspense fallback={<p className="login-hint">Đang tải…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
