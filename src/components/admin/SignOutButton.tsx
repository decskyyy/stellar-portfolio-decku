'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    if (busy) return;
    setBusy(true);
    try {
      const { error } = await createClient().auth.signOut();
      if (error) {
        toast.error(`Sign out failed: ${error.message}`);
        return;
      }
      router.replace('/admin/login');
      router.refresh();
    } catch (error) {
      toast.error(`Sign out failed: ${error instanceof Error ? error.message : 'Unexpected error.'}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button onClick={signOut} disabled={busy} className="admin-btn-secondary !px-3 !py-1.5 !text-xs">
      {busy ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
