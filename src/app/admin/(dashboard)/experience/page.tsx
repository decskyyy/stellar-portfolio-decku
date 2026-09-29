import { createClient } from '@/lib/supabase/server';
import type { Experience } from '@/lib/types';
import ExperienceManager from '@/components/admin/ExperienceManager';

export const dynamic = 'force-dynamic';

export default async function AdminExperiencePage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('experience')
    .select('*')
    .order('is_current', { ascending: false })
    .order('start_date', { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-admin-text">Pengalaman</h1>
        <p className="mt-1.5 font-body text-sm text-admin-muted">
          Riwayat pekerjaan yang tampil di halaman utama, bisa diisi manual atau lewat deteksi CV.
        </p>
      </div>
      <ExperienceManager initialExperience={(data as Experience[] | null) ?? []} />
    </div>
  );
}
