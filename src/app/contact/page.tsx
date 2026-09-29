import Contact from "@/components/site/Contact";
import PublicShell from "@/components/site/PublicShell";
import { getProfile } from "@/lib/site-data";

export const revalidate = 60;

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <PublicShell profile={profile}>
      <Contact profile={profile} />
    </PublicShell>
  );
}
