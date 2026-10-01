'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import AdminThemeToggle from '@/components/admin/AdminThemeToggle';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(
        authError.message.toLowerCase().includes('invalid')
          ? 'Email atau password tidak cocok. Coba lagi.'
          : authError.message
      );
      setLoading(false);
      return;
    }

    router.replace(next);
    router.refresh();
  }

  return (
    <div className="admin-card w-full max-w-md">
      <div className="mb-8">
        <span className="font-body text-xs font-semibold uppercase tracking-wide text-admin-accent">Akses terbatas</span>
        <h1 className="mt-2 font-display text-2xl font-bold text-admin-text">Masuk admin</h1>
        <p className="mt-2 font-body text-sm text-admin-muted">
          Gunakan akun Supabase yang terdaftar untuk mengelola isi portfolio.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="admin-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="admin-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="nama@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="admin-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="admin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="admin-status-error rounded-lg border px-4 py-2.5 font-body text-sm">
            {error}
          </p>
        )}

        <button onClick={handleSubmit} disabled={loading || !email || !password} className="admin-btn-primary w-full">
          {loading ? 'Memeriksa…' : 'Masuk'}
        </button>
      </div>

      <Link href="/" className="mt-6 block text-center font-body text-sm text-admin-muted transition hover:text-admin-text">
        Kembali ke portfolio
      </Link>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="admin-shell flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-5xl">
        <div className="mb-3 flex justify-end">
          <AdminThemeToggle />
        </div>
        <div className="admin-login-frame overflow-hidden rounded-[28px] border shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="hidden flex-col justify-between bg-slate-950 px-10 py-10 text-white lg:flex">
              <div>
                <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-200">
                  Admin access
                </span>
                <h2 className="mt-6 max-w-sm text-3xl font-bold tracking-tight">Kelola portfolio dengan lebih tenang dan rapi.</h2>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/30 text-xs font-semibold text-indigo-100">01</span>
                  <span>Ubah profil, proyek, dan keahlian dari satu dashboard.</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/30 text-xs font-semibold text-cyan-100">02</span>
                  <span>Perubahan langsung tercermin di halaman portfolio utama.</span>
                </div>
              </div>
            </div>

            <div className="admin-login-form-panel p-6 sm:p-8 lg:p-10">
              <Suspense fallback={null}>
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
