type BrandSkillLogo = {
  matches: RegExp;
  src: string;
  className?: string;
};

const brandSkillLogos: BrandSkillLogo[] = [
  {
    matches: /\bgithub\b/i,
    src: "/icons/skills/github.svg",
    className: "skill-brand-icon-github",
  },
  {
    matches: /\bnode(?:\.?js)?\b/i,
    src: "/icons/skills/nodejs.svg",
  },
  { matches: /\bvite\b/i, src: "/icons/skills/vite.svg" },
  { matches: /\bnpm\b/i, src: "/icons/skills/npm.svg" },
  { matches: /\bsupabase\b/i, src: "/icons/skills/supabase.svg" },
  {
    matches: /\btailwind(?:\s*css)?\b/i,
    src: "/icons/skills/tailwindcss.svg",
  },
  { matches: /\bsap\b/i, src: "/icons/skills/sap.svg" },
  {
    matches: /\bgoogle(?:\s+workspace)?\b/i,
    src: "/icons/skills/google.svg",
  },
  {
    matches: /\b(postgresql|postgres)\b/i,
    src: "/icons/skills/postgresql-original.svg",
  },
  {
    matches: /\b(microsoft sql server|sql server|mssql)\b/i,
    src: "/icons/skills/microsoftsqlserver-original.svg",
  },
  { matches: /\bpython\b/i, src: "/icons/skills/python-original.svg" },
  { matches: /\bmysql\b/i, src: "/icons/skills/mysql-original.svg" },
  { matches: /\bsql\b/i, src: "/icons/skills/microsoftsqlserver-original.svg" },
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

export function getBrandSkillLogo(name: string): Omit<BrandSkillLogo, "matches"> | undefined {
  const match = brandSkillLogos.find(({ matches }) => matches.test(name));

  if (!match) return undefined;

  const { matches: _matches, ...logo } = match;
  return logo;
}
