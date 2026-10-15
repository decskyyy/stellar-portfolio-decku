import ExperienceSlideshow from "@/components/site/ExperienceSlideshow";
import Hero from "@/components/site/Hero";
import PublicShell from "@/components/site/PublicShell";
import { getExperience, getProfile } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, experiences] = await Promise.all([
    getProfile(),
    getExperience(),
  ]);

  return (
    <PublicShell profile={profile}>
      <Hero profile={profile} />
      <ExperienceSlideshow items={experiences} />
    </PublicShell>
  );
}
