/**
 * Parser CV berbasis aturan (regex + kamus kata kunci) — TANPA panggilan AI.
 * Dirancang sebagai "tebakan awal yang bisa diedit", bukan hasil final.
 * Akurasi bergantung banyak pada seberapa standar format CV yang diunggah.
 */

// ---------------------------------------------------------------------
// 1. Kamus kata kunci skill (IT Support / Application Support domain)
// ---------------------------------------------------------------------
const SKILL_KEYWORDS = [
  // Ticketing / ITSM
  'Freescout', 'Zendesk', 'Jira Service Management', 'Jira', 'ServiceNow', 'OTRS',
  'Incident Management', 'Problem Management', 'Change Management', 'SLA', 'ITIL',
  // ERP / POS / CRM / HRIS
  'SAP', 'Odoo', 'Oracle ERP', 'Gripstore', 'Ismaya+', 'Fooma', 'Salesforce', 'HubSpot',
  'HRIS', 'CRM', 'POS',
  // Database
  'SQL', 'MySQL', 'PostgreSQL', 'SQL Server', 'MongoDB', 'Oracle Database',
  'pgAdmin', 'DBeaver', 'phpMyAdmin', 'Database',
  // OS & infra
  'Windows Server', 'Windows', 'Linux', 'Ubuntu', 'macOS', 'Active Directory',
  'Virtual Machine', 'VMware',
  // Jaringan
  'TCP/IP', 'VPN', 'Firewall', 'DNS', 'DHCP', 'LAN', 'WAN', 'Mikrotik', 'Cisco',
  'Network Troubleshooting',
  // Web / programming
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Python', 'PHP', 'Git',
  // Cloud & office
  'AWS', 'Azure', 'Google Workspace', 'Microsoft 365', 'Excel', 'Google Sheets',
  // Remote support
  'AnyDesk', 'TeamViewer', 'Remote Desktop', 'RDP', 'VNC',
  // Sertifikasi
  'ISO 27001', 'CompTIA', 'SAP Certified Application Associate',
  // Soft/process
  'Dokumentasi', 'User Training', 'Root Cause Analysis', 'Troubleshooting',
] as const;

export function extractSkills(text: string): string[] {
  const found = new Set<string>();
  for (const term of SKILL_KEYWORDS) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\b${escaped}\\b`, 'i');
    if (pattern.test(text)) found.add(term);
  }
  return Array.from(found);
}

// ---------------------------------------------------------------------
// 2. Deteksi rentang tanggal pengalaman kerja
// ---------------------------------------------------------------------
const MONTHS: Record<string, number> = {
  jan: 1, januari: 1, january: 1,
  feb: 2, peb: 2, februari: 2, february: 2,
  mar: 3, maret: 3, march: 3,
  apr: 4, april: 4,
  mei: 5, may: 5,
  jun: 6, juni: 6, june: 6,
  jul: 7, juli: 7, july: 7,
  agu: 8, ags: 8, agustus: 8, aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  okt: 10, oktober: 10, oct: 10, october: 10,
  nov: 11, november: 11,
  des: 12, desember: 12, dec: 12, december: 12,
};
const MONTH_NAMES = Object.keys(MONTHS).sort((a, b) => b.length - a.length).join('|');
const ONGOING_WORDS = 'sekarang|saat ini|present|current|now|ongoing';

// "Jan 2022", "Januari 2022", "2022"
const DATE_TOKEN = `(?:(?:${MONTH_NAMES})\\s+)?\\d{4}`;
const SEPARATOR = '\\s*(?:-|–|—|s\\/d|s\\.d\\.|sampai|to)\\s*';
const DATE_RANGE_RE = new RegExp(
  `(${DATE_TOKEN})${SEPARATOR}(${DATE_TOKEN}|${ONGOING_WORDS})`,
  'gi'
);

function parseDateToken(token: string): string | null {
  const t = token.trim().toLowerCase();
  const yearMatch = t.match(/\d{4}/);
  if (!yearMatch) return null;
  const year = yearMatch[0];
  const monthWord = t.replace(year, '').trim();
  const month = monthWord && MONTHS[monthWord] ? MONTHS[monthWord] : 1;
  return `${year}-${String(month).padStart(2, '0')}-01`;
}

function isOngoing(token: string): boolean {
  return new RegExp(`^(?:${ONGOING_WORDS})$`, 'i').test(token.trim());
}

export type ExperienceDraft = {
  company: string;
  role_title: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string;
  raw_date_text: string;
};

export function extractExperience(text: string): ExperienceDraft[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const matches: { lineIndex: number; start: string | null; end: string | null; current: boolean; raw: string }[] = [];

  lines.forEach((line, i) => {
    DATE_RANGE_RE.lastIndex = 0;
    const m = DATE_RANGE_RE.exec(line);
    if (m) {
      const ongoing = isOngoing(m[2]);
      matches.push({
        lineIndex: i,
        start: parseDateToken(m[1]),
        end: ongoing ? null : parseDateToken(m[2]),
        current: ongoing,
        raw: m[0],
      });
    }
  });

  const results: ExperienceDraft[] = [];

  matches.forEach((match, idx) => {
    // Asumsi urutan paling umum: [Jabatan] lalu [Perusahaan] lalu [Tanggal].
    // Urutan sebaliknya juga sering dipakai CV lain — makanya field ini WAJIB dicek manual.
    const roleLine = lines[match.lineIndex - 2] ?? '';
    const companyLine = lines[match.lineIndex - 1] ?? '';

    // Deskripsi: baris setelah tanggal, berhenti sebelum 2 baris terakhir menjelang
    // tanggal berikutnya (2 baris itu biasanya jabatan+perusahaan entri selanjutnya).
    const nextMatchLine = matches[idx + 1]?.lineIndex ?? lines.length;
    const descEnd = Math.max(match.lineIndex + 1, Math.min(nextMatchLine - 2, match.lineIndex + 7));
    const descLines = lines.slice(match.lineIndex + 1, descEnd);

    results.push({
      company: companyLine || 'Isi nama perusahaan',
      role_title: roleLine || 'Isi jabatan',
      start_date: match.start,
      end_date: match.end,
      is_current: match.current,
      description: descLines.join(' ').slice(0, 500),
      raw_date_text: match.raw,
    });
  });

  return results;
}

export function parseCvText(text: string) {
  return {
    skills: extractSkills(text),
    experiences: extractExperience(text),
  };
}
