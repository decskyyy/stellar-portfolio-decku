import { createClient } from '@/lib/supabase/server';
import type { Project } from '@/lib/types';
import ProjectManager from '@/components/admin/ProjectManager';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-admin-text">Projects</h1>
        <p className="mt-1.5 font-body text-sm text-admin-muted">
          Add, edit, and remove projects displayed on your portfolio.
        </p>
      </div>
      <ProjectManager initialProjects={(data as Project[] | null) ?? []} />
    </div>
  );
}
