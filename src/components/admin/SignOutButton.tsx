'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    await createClient().auth.signOut();
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <button onClick={signOut} disabled={busy} className="admin-btn-secondary !px-3 !py-1.5 !text-xs">
      {busy ? 'Keluar…' : 'Keluar'}
    </button>
  );
}
