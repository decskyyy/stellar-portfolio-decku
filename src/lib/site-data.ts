import { createClient } from "@/lib/supabase/server";
import type { Experience, Profile, Project, Skill } from "@/lib/types";

export const fallbackProfile: Profile = {
  id: "fallback",
  full_name: "Aristo Decky Susilo",
  role_title: "IT Support & Application Support",
  tagline:
    "Dukungan yang jelas untuk pengguna dan aplikasi yang menopang operasional.",
  bio: "",
  location: null,
  email: null,
  phone: null,
  github_url: null,
  linkedin_url: null,
  avatar_url: null,
  cv_url: null,
  updated_at: new Date(0).toISOString(),
};

export async function getProfile(): Promise<Profile> {
  const supabase = createClient();
  const { data } = await supabase
    .from("profile")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data as Profile | null) ?? fallbackProfile;
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });

  return (data as Skill[] | null) ?? [];
}

export async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (data as Project[] | null) ?? [];
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return (data as Project | null) ?? null;
}

export async function getExperience(): Promise<Experience[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("experience")
    .select("*")
    .order("is_current", { ascending: false })
    .order("start_date", { ascending: false });

  return (data as Experience[] | null) ?? [];
}
