export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    const missing = [
      !url && "NEXT_PUBLIC_SUPABASE_URL",
      !anonKey && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ].filter(Boolean);
    throw new Error(
      `Missing required Supabase environment variable(s): ${missing.join(", ")}. Configure them in .env.local or your deployment environment.`,
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be a valid absolute URL, such as https://your-project.supabase.co.",
    );
  }

  if (
    (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") ||
    !parsedUrl.hostname
  ) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must use a valid http or https URL.",
    );
  }

  return { url, anonKey };
}
