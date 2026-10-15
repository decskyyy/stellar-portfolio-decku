import {
  BookOpen,
  Braces,
  Briefcase,
  ChartNoAxesCombined,
  Cloud,
  Code2,
  Database,
  Monitor,
  Network,
  Server,
  ShieldCheck,
  ShoppingCart,
  Terminal,
  Ticket,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type BrandSkillLogo = {
  matches: RegExp;
  src: string;
  className?: string;
  remote?: boolean;
};

const brandSkillLogos: BrandSkillLogo[] = [
  {
    matches: /\bgithub\b/i,
    src: "/icons/skills/github.svg",
    className: "skill-brand-icon-github",
  },
  { matches: /\bnode(?:\.?js)?\b/i, src: "/icons/skills/nodejs.svg" },
  { matches: /\bvite\b/i, src: "/icons/skills/vite.svg" },
  { matches: /\bnpm\b/i, src: "/icons/skills/npm.svg" },
  { matches: /\bsupabase\b/i, src: "/icons/skills/supabase.svg" },
  { matches: /\btailwind(?:\s*css)?\b/i, src: "/icons/skills/tailwindcss.svg" },
  { matches: /\bsap\b/i, src: "/icons/skills/sap.svg" },
  { matches: /\bgoogle(?:\s+workspace)?\b/i, src: "/icons/skills/google.svg" },
  {
    matches: /\b(postgresql|postgres)\b/i,
    src: "/icons/skills/postgresql-original.svg",
  },
  {
    matches: /\b(microsoft sql server|sql server|mssql)\b/i,
    src: "/icons/skills/microsoftsqlserver-original.svg",
  },
  { matches: /\baws\b/i, src: "https://cdn.simpleicons.org/amazonaws", remote: true },
  { matches: /\bpower\s*bi\b/i, src: "https://cdn.simpleicons.org/microsoftpowerbi", remote: true },
  { matches: /\bjira\b/i, src: "https://cdn.simpleicons.org/jira", remote: true },
  { matches: /\batlassian\b/i, src: "https://cdn.simpleicons.org/atlassian", remote: true },
  { matches: /\bservicenow\b/i, src: "https://cdn.simpleicons.org/servicenow", remote: true },
  { matches: /\bfigma\b/i, src: "https://cdn.simpleicons.org/figma", remote: true },
  { matches: /\bslack\b/i, src: "https://cdn.simpleicons.org/slack", remote: true },
  { matches: /\bnotion\b/i, src: "https://cdn.simpleicons.org/notion", remote: true },
  { matches: /\bpython\b/i, src: "/icons/skills/python-original.svg" },
  { matches: /\bmysql\b/i, src: "/icons/skills/mysql-original.svg" },
  { matches: /\bsqlite\b/i, src: "/icons/skills/sqlite-original.svg" },
  { matches: /\bjavascript\b/i, src: "/icons/skills/javascript-original.svg" },
  { matches: /\btypescript\b/i, src: "/icons/skills/typescript-original.svg" },
  { matches: /\bhtml5?\b/i, src: "/icons/skills/html5-original.svg" },
  { matches: /\bcss3?\b/i, src: "/icons/skills/css3-original.svg" },
  { matches: /\breact\b/i, src: "/icons/skills/react-original.svg" },
  {
    matches: /\bnext\.?js\b/i,
    src: "/icons/skills/nextjs-original.svg",
    className: "skill-brand-icon-nextjs",
  },
  { matches: /\blinux\b/i, src: "/icons/skills/linux-plain.svg" },
  { matches: /\bwindows\b/i, src: "/icons/skills/windows8-original.svg" },
  { matches: /\bdocker\b/i, src: "/icons/skills/docker-original.svg" },
  { matches: /\bgit\b/i, src: "/icons/skills/git-original.svg" },
];

const skillFallbackIcons: Array<{ matches: RegExp; icon: LucideIcon }> = [
  { matches: /\b(sap|erp|enterprise)\b/i, icon: Briefcase },
  { matches: /\b(postgresql|postgres|mysql|sql|pgadmin|dbeaver|database|query)\b/i, icon: Database },
  { matches: /\b(windows|macos|operating systems?)\b/i, icon: Monitor },
  { matches: /\blinux\b/i, icon: Terminal },
  { matches: /\b(html|css|javascript|typescript|react|next\.?js|web|programming|coding)\b/i, icon: Code2 },
  { matches: /\b(cloud|google workspace|microsoft 365)\b/i, icon: Cloud },
  { matches: /\b(network|tcp\/?ip|lan|wan)\b/i, icon: Network },
  { matches: /\b(server|infrastructure|virtuali[sz]ation)\b/i, icon: Server },
  { matches: /\b(hris|crm|collaboration|team)\b/i, icon: Users },
  { matches: /\bpos\b/i, icon: ShoppingCart },
  { matches: /\b(incident|ticket|freescout|sla|service desk)\b/i, icon: Ticket },
  { matches: /\b(recharts|chart|data visualization)\b/i, icon: ChartNoAxesCombined },
  { matches: /\b(rest\s*api|api|json)\b/i, icon: Braces },
  { matches: /\b(training|documentation|dokumentasi)\b/i, icon: BookOpen },
  { matches: /\b(iso|security|governance|compliance)\b/i, icon: ShieldCheck },
  { matches: /\b(troubleshooting|support|service)\b/i, icon: Wrench },
];

export function getBrandSkillLogo(
  name: string,
): Omit<BrandSkillLogo, "matches"> | undefined {
  const match = brandSkillLogos.find(({ matches }) => matches.test(name));

  if (match) {
    const { matches: _matches, ...logo } = match;
    return logo;
  }

  return undefined;
}

export function getSkillFallbackIcon(name: string): LucideIcon {
  return skillFallbackIcons.find(({ matches }) => matches.test(name))?.icon ?? Wrench;
}
