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
        <h1 className="font-display text-2xl font-bold text-admin-text">Experience</h1>
        <p className="mt-1.5 font-body text-sm text-admin-muted">
          Manage the roles displayed on your portfolio. Add them manually or import details from your resume.
        </p>
      </div>
      <ExperienceManager initialExperience={(data as Experience[] | null) ?? []} />
    </div>
  );
}
