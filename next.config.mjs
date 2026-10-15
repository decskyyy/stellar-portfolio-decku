/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
let supabaseHost = '*.supabase.co';

if (supabaseUrl) {
  try {
    const parsedUrl = new URL(supabaseUrl);
    if (
      (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') ||
      !parsedUrl.hostname
    ) {
      throw new Error();
    }
    supabaseHost = parsedUrl.hostname;
  } catch {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL must be a valid absolute http or https URL.',
    );
  }
}

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/**' },
    ],
  },
};

export default nextConfig;
