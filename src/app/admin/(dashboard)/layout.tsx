import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/admin/Sidebar';
import SignOutButton from '@/components/admin/SignOutButton';
import AdminThemeToggle from '@/components/admin/AdminThemeToggle';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  return (
    <div className="admin-shell min-h-screen">
      <header className="admin-topbar sticky top-0 z-20 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex min-h-16 items-center justify-between gap-4">
            <Link href="/admin" className="flex min-w-0 items-center gap-3" aria-label="Portfolio admin overview">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-admin-accent font-display text-sm font-bold text-white">
                A
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-sm font-semibold text-admin-text">Portfolio</span>
                <span className="block text-[11px] text-admin-muted">Admin workspace</span>
              </span>
            </Link>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {user.email && (
                <span className="hidden max-w-40 truncate font-body text-xs text-admin-muted md:block" title={user.email}>
                  {user.email}
                </span>
              )}
              <AdminThemeToggle />
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                className="admin-btn-secondary !px-3 !py-1.5 !text-xs"
              >
                <span className="hidden sm:inline">View site</span>
                <span className="sm:hidden">Site</span>
              </Link>
              <SignOutButton />
            </div>
          </div>

          <div className="-mx-1 overflow-x-auto pb-2">
            <Sidebar />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-10 pt-7 sm:px-6 sm:pt-9">
        {children}
      </main>
    </div>
  );
}
