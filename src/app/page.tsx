import Hero from "@/components/site/Hero";
import PublicShell from "@/components/site/PublicShell";
import { getProfile, getSkills } from "@/lib/site-data";

export const revalidate = 60;

export default async function HomePage() {
  const [profile, skills] = await Promise.all([getProfile(), getSkills()]);

  return (
    <PublicShell profile={profile}>
      <Hero profile={profile} skills={skills} />
    </PublicShell>
  );
}
