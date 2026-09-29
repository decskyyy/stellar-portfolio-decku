import { createClient } from '@/lib/supabase/server';
import type { Skill } from '@/lib/types';
import SkillManager from '@/components/admin/SkillManager';

export const dynamic = 'force-dynamic';

export default async function AdminSkillsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('skills')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-admin-text">Keahlian</h1>
        <p className="mt-1.5 font-body text-sm text-admin-muted">
          Dikelompokkan per kategori di halaman utama, diurutkan sesuai nomor urutan.
        </p>
      </div>
      <SkillManager initialSkills={(data as Skill[] | null) ?? []} />
    </div>
  );
}
