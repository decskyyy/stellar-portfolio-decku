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
    <div className="admin-shell px-3 py-3 sm:px-4 lg:px-6">
      <div className="mx-auto flex max-w-7xl gap-4">
        <aside className="sticky top-3 hidden h-[calc(100vh-1.5rem)] w-64 shrink-0 flex-col rounded-[26px] border border-admin-border bg-admin-panel/85 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:flex">
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-slate-950/5 px-3 py-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-admin-accent to-admin-accentHover font-display text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
              A
            </span>
            <div>
              <p className="font-display text-sm font-bold text-admin-text">Panel admin</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-admin-muted">Portfolio</p>
            </div>
          </div>

          <Sidebar />

          <div className="mt-auto space-y-3 border-t border-admin-border pt-4">
            <AdminThemeToggle />
            <p className="truncate font-body text-xs text-admin-muted">{user.email}</p>
            <div className="flex gap-2">
              <Link href="/" target="_blank" className="admin-btn-secondary flex-1 !px-3 !py-1.5 !text-xs">
                Lihat situs
              </Link>
              <SignOutButton />
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-3 z-10 flex items-center justify-between rounded-[22px] border border-admin-border bg-admin-panel/85 px-4 py-3 shadow-[0_12px_32px_rgba(15,23,42,0.06)] backdrop-blur-xl md:hidden">
            <span className="font-display text-sm font-bold text-admin-text">Panel admin</span>
            <div className="flex gap-2">
              <AdminThemeToggle />
              <Link href="/" target="_blank" className="admin-btn-secondary !px-3 !py-1 !text-xs">
                Situs
              </Link>
              <SignOutButton />
            </div>
          </header>

          <div className="mt-3 rounded-[22px] border border-admin-border bg-admin-panel/85 px-4 py-2 shadow-[0_12px_32px_rgba(15,23,42,0.04)] backdrop-blur-xl md:hidden">
            <Sidebar />
          </div>

          <main className="pt-4 sm:pt-5">{children}</main>
        </div>
      </div>
    </div>
  );
}
