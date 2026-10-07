import type { Skill } from "./types";

const isLegacyImportCategory = (category: string) =>
  /\b(?:ter)?deteksi\b/i.test(category) && /\bcv\b/i.test(category);

export function inferSkillCategory(name: string): string {
  const normalizedName = name.toLowerCase();

  if (/\b(postgresql|postgres|mysql|sql|pgadmin|dbeaver|database)\b/.test(normalizedName)) {
    return "Data & Database";
  }

  if (/\b(windows|linux|macos|operating systems?)\b/.test(normalizedName)) {
    return "Operating Systems";
  }

  if (/\b(html|css|javascript|typescript|react|next\.?js|web development)\b/.test(normalizedName)) {
    return "Web Technologies";
  }

  if (/\b(sap|erp|hris|crm|pos|google workspace|microsoft 365|office 365)\b/.test(normalizedName)) {
    return "Business Applications & Enterprise Systems";
  }

  if (/\b(incident|ticket|troubleshooting|user training|remote support)\b/.test(normalizedName)) {
    return "Support Operations";
  }

  if (/\b(iso|security|governance|compliance)\b/.test(normalizedName)) {
    return "Governance & Security";
  }

  return "Core Tools & Enterprise Systems";
}

export function getPublicSkillCategory(skill: Pick<Skill, "name" | "category">): string {
  const category = skill.category.trim();

  if (!category || isLegacyImportCategory(category)) {
    return inferSkillCategory(skill.name);
  }

  return category;
}
