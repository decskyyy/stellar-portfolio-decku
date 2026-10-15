import Link from 'next/link';
import AdminThemeToggle from '@/components/admin/AdminThemeToggle';
import LoginForm from '@/components/admin/LoginForm';

function getSafeAdminNextPath(value: string | null): string {
  const fallback = '/admin';
  if (!value?.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return fallback;
  }

  const target = new URL(value, 'https://portfolio.local');
  if (
    target.origin !== 'https://portfolio.local' ||
    (target.pathname !== '/admin' && !target.pathname.startsWith('/admin/'))
  ) {
    return fallback;
  }

  return `${target.pathname}${target.search}${target.hash}`;
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string | string[] };
}) {
  const next = getSafeAdminNextPath(
    typeof searchParams.next === 'string' ? searchParams.next : null
  );

  return (
    <main className="admin-shell flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="font-body text-sm text-admin-muted transition hover:text-admin-text">
            Back to portfolio
          </Link>
          <AdminThemeToggle />
        </div>
        <LoginForm next={next} />
      </div>
    </main>
  );
}
