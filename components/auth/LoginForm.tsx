'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/crm/supabase/client';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/staff';
  const authError = searchParams.get('error') === 'auth';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(authError ? 'Đăng nhập thất bại. Thử lại.' : '');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (signInError) {
      setError('Email hoặc mật khẩu không đúng.');
      return;
    }

    router.push(next.startsWith('/') ? next : '/staff');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="login-form">
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="sale@maidalodge.com"
        />
      </div>
      <div className="field">
        <label htmlFor="password">Mật khẩu</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="login-err">{error}</p>}
      <button type="submit" className="login-btn" disabled={loading}>
        {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
      </button>
      <p className="login-hint">Chỉ dành cho nhân viên Maida (Sale · Lễ tân).</p>
    </form>
  );
}
