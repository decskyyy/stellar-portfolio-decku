export type Profile = {
  id: string;
  full_name: string;
  role_title: string;
  tagline: string;
  bio: string;
  location: string | null;
  email: string | null;
  phone: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  avatar_url: string | null;
  cv_url: string | null;
  updated_at: string;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  level: number;
  sort_order: number;
  created_at: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  image_url: string | null;
  rating: number;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Experience = {
  id: string;
  company: string;
  role_title: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export const STORAGE_BUCKET = 'portfolio-assets';
