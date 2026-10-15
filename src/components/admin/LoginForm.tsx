'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(
          authError.message.toLowerCase().includes('invalid')
            ? 'Email or password is incorrect. Please try again.'
            : authError.message
        );
        return;
      }

      router.replace(next);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-card w-full">
      <div className="mb-8">
        <span className="font-body text-xs font-semibold uppercase tracking-wide text-admin-accent">Restricted access</span>
        <h1 className="mt-2 font-display text-2xl font-bold text-admin-text">Admin sign in</h1>
        <p className="mt-2 font-body text-sm text-admin-muted">
          Sign in with your registered account to manage your portfolio.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="admin-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className="admin-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
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
            required
            className="admin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="admin-status-error rounded-lg border px-4 py-2.5 font-body text-sm" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading || !email || !password} className="admin-btn-primary w-full">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
