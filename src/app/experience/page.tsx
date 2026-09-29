import ExperienceTimeline from "@/components/site/Experience";
import PublicShell from "@/components/site/PublicShell";
import { getExperience, getProfile } from "@/lib/site-data";

export const revalidate = 60;

export default async function ExperiencePage() {
  const [profile, experience] = await Promise.all([
    getProfile(),
    getExperience(),
  ]);

  return (
    <PublicShell profile={profile}>
      <ExperienceTimeline items={experience} />
    </PublicShell>
  );
}
