import Projects from "@/components/site/Projects";
import PublicShell from "@/components/site/PublicShell";
import { getProfile, getProjects } from "@/lib/site-data";

export const revalidate = 60;

export default async function ProjectsPage() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);

  return (
    <PublicShell profile={profile}>
      <Projects projects={projects} />
    </PublicShell>
  );
}
