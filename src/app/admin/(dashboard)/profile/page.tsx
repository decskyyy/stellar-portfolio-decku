import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/types';
import ProfileForm from '@/components/admin/ProfileForm';
import { normalizePortfolioCopy } from '@/lib/portfolio-copy';

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
        <h1 className="font-display text-2xl font-bold text-admin-text">Profile</h1>
        <p className="mt-1.5 font-body text-sm text-admin-muted">
          Edit the name, title, home introduction, professional summary, and contact details shown on your portfolio.
        </p>
      </div>
      <ProfileForm
        initialProfile={
          data ? normalizePortfolioCopy(data as Profile) : null
        }
      />
    </div>
  );
}
