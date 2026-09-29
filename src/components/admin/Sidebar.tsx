'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Ringkasan', icon: 'M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z' },
  { href: '/admin/experience', label: 'Pengalaman', icon: 'M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-9 0h10a2 2 0 012 2v9a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z' },
  { href: '/admin/projects', label: 'Proyek', icon: 'M4 6h16M4 12h16M4 18h7' },
  { href: '/admin/profile', label: 'Profil', icon: 'M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0' },
  { href: '/admin/skills', label: 'Keahlian', icon: 'M13 2L3 14h7l-1 8 10-12h-7l1-8z' },
];

function Icon({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {links.map((l) => {
        const active = l.href === '/admin' ? pathname === '/admin' : pathname.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href} className={`admin-nav-link ${active ? 'admin-nav-link-active' : ''}`}>
            <Icon d={l.icon} />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
