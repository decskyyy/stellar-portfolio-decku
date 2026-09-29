import PublicShell from "@/components/site/PublicShell";
import Skills from "@/components/site/Skills";
import { getProfile, getSkills } from "@/lib/site-data";

export const revalidate = 60;

export default async function SkillsPage() {
  const [profile, skills] = await Promise.all([getProfile(), getSkills()]);

  return (
    <PublicShell profile={profile}>
      <Skills skills={skills} />
    </PublicShell>
  );
}
