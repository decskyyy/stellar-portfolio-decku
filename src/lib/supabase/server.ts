import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/** Client Supabase untuk Server Component / Route Handler (sadar sesi login). */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Dipanggil dari Server Component — refresh sesi ditangani middleware.
          }
        },
      },
    }
  );
}
