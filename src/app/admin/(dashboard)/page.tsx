import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Profile, Project, Skill } from '@/lib/types';
import StarRating from '@/components/site/StarRating';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const supabase = createClient();

  const [profileRes, skillsRes, projectsRes] = await Promise.all([
    supabase.from('profile').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('skills').select('*'),
    supabase.from('projects').select('*').order('updated_at', { ascending: false }),
  ]);

  const profile = profileRes.data as Profile | null;
  const skills = (skillsRes.data as Skill[] | null) ?? [];
  const projects = (projectsRes.data as Project[] | null) ?? [];
  const initials = profile?.full_name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'A';

  const cards = [
    { label: 'Proyek', value: projects.length, href: '/admin/projects', action: 'Kelola proyek' },
    { label: 'Keahlian', value: skills.length, href: '/admin/skills', action: 'Kelola keahlian' },
    { label: 'Unggulan', value: projects.filter((p) => p.featured).length, href: '/admin/projects', action: 'Atur unggulan' },
  ];

  return (
    <div className="space-y-6">
      <div className="admin-card overflow-hidden">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={`Foto profil ${profile.full_name}`}
                width={72}
                height={72}
                className="h-16 w-16 shrink-0 rounded-2xl border border-admin-border object-cover shadow-md shadow-slate-200 sm:h-[4.5rem] sm:w-[4.5rem]"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-admin-accent to-admin-accentHover text-xl font-bold text-white shadow-lg shadow-indigo-500/20 sm:h-[4.5rem] sm:w-[4.5rem]"
              >
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <span className="admin-inset inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-muted">
                Dashboard
              </span>
              <h1 className="mt-2 font-display text-2xl font-bold text-admin-text">
                Halo{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}.
              </h1>
              <p className="mt-1.5 font-body text-sm text-admin-muted">
                {profile?.role_title || 'Lengkapi profil kamu'} · Semua perubahan langsung tampil di halaman utama.
              </p>
            </div>
          </div>

          <Link href="/admin/profile" className="admin-btn-primary !px-3.5 !py-2 !text-xs uppercase tracking-[0.16em]">
            Edit profil
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="admin-card flex flex-col">
            <span className="font-body text-xs font-medium uppercase tracking-[0.18em] text-admin-muted">{c.label}</span>
            <span className="mt-3 font-display text-3xl font-bold text-admin-text">{c.value}</span>
            <Link href={c.href} className="mt-5 inline-flex items-center gap-2 font-body text-sm font-medium text-admin-accent transition hover:text-admin-accentHover">
              {c.action}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-lg font-bold text-admin-text">Status profil</h2>
          <Link href="/admin/profile" className="admin-btn-secondary !px-3 !py-1.5 !text-xs">
            Ubah profil
          </Link>
        </div>

        {profile ? (
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="admin-inset rounded-2xl border p-4">
              <dt className="font-body text-xs font-medium uppercase tracking-[0.18em] text-admin-muted">Nama</dt>
              <dd className="mt-2 font-body text-sm text-admin-text">{profile.full_name || '—'}</dd>
            </div>
            <div className="admin-inset rounded-2xl border p-4">
              <dt className="font-body text-xs font-medium uppercase tracking-[0.18em] text-admin-muted">Jabatan</dt>
              <dd className="mt-2 font-body text-sm text-admin-text">{profile.role_title || '—'}</dd>
            </div>
            <div className="admin-inset rounded-2xl border p-4 sm:col-span-2">
              <dt className="font-body text-xs font-medium uppercase tracking-[0.18em] text-admin-muted">Tagline</dt>
              <dd className="mt-2 font-body text-sm text-admin-text">{profile.tagline || '—'}</dd>
            </div>
            <div className="admin-inset rounded-2xl border p-4 sm:col-span-2">
              <dt className="font-body text-xs font-medium uppercase tracking-[0.18em] text-admin-muted">Bio</dt>
              <dd className="mt-2 line-clamp-3 font-body text-sm leading-relaxed text-admin-muted">
                {profile.bio || 'Belum diisi.'}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-4 font-body text-sm text-admin-muted">
            Profil belum dibuat. Buka halaman Profil dan simpan data pertama kamu.
          </p>
        )}
      </div>

      {projects.length > 0 && (
        <div className="admin-card">
          <h2 className="font-display text-lg font-bold text-admin-text">Diubah terakhir</h2>
          <ul className="mt-4 space-y-3">
            {projects.slice(0, 5).map((p) => (
              <li key={p.id} className="admin-inset flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-3 py-3 last:border-0 last:pb-0">
                <span className="font-body text-sm text-admin-text">{p.title}</span>
                <div className="flex items-center gap-4">
                  <StarRating value={p.rating} size={13} />
                  <span className="font-body text-xs text-admin-muted">
                    {new Date(p.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
