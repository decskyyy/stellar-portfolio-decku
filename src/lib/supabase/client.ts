'use client';

import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseConfig } from './config';

/** Client Supabase untuk komponen browser (form admin, auth, upload). */
export function createClient() {
  const { url, anonKey } = getSupabaseConfig();
  return createBrowserClient(
    url,
    anonKey
  );
}
