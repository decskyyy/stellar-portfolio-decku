import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/types';
import ProfileForm from '@/components/admin/ProfileForm';

export const dynamic = 'force-dynamic';

export default async function AdminProfilePage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('profile')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-admin-text">Profil</h1>
        <p className="mt-1.5 font-body text-sm text-admin-muted">
          Nama, tagline, bio, dan kanal kontak yang tampil di hero halaman utama.
        </p>
      </div>
      <ProfileForm initialProfile={(data as Profile | null) ?? null} />
    </div>
  );
}
