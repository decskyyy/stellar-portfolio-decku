'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import type { ExperienceDraft } from '@/lib/cv-parser';

type Result = {
  skills: string[];
  experiences: ExperienceDraft[];
  charCount: number;
};

export default function CvImport({
  onApplyExperiences,
  onApplySkills,
}: {
  onApplyExperiences: (drafts: ExperienceDraft[]) => void;
  onApplySkills: (skills: string[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [checkedSkills, setCheckedSkills] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/parse-cv', { method: 'POST', body });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal memproses CV.');
        setLoading(false);
        return;
      }

      setResult(data);
      setCheckedSkills(new Set(data.skills));
    } catch {
      setError('Gagal mengunggah atau membaca file.');
    } finally {
      setLoading(false);
    }
  }

  function applyExperiences() {
    if (!result) return;
    onApplyExperiences(result.experiences);
    toast.success(`${result.experiences.length} draf pengalaman ditambahkan ke bawah — cek & lengkapi tiap entri.`);
  }

  function applySkills() {
    const chosen = Array.from(checkedSkills);
    if (chosen.length === 0) return;
    onApplySkills(chosen);
    toast.success(`${chosen.length} skill ditambahkan.`);
    setResult((r) => (r ? { ...r, skills: [] } : r));
  }

  function toggleSkill(skill: string) {
    setCheckedSkills((prev) => {
      const next = new Set(prev);
      next.has(skill) ? next.delete(skill) : next.add(skill);
      return next;
    });
  }

  return (
    <div className="admin-card border-dashed">
      <div className="mb-1 flex items-center gap-2">
        <h2 className="font-display text-lg font-bold text-admin-text">Deteksi otomatis dari CV</h2>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wide text-amber-700">
          Beta, tanpa AI
        </span>
      </div>
      <p className="mb-4 font-body text-xs text-admin-muted">
        Upload CV (PDF berisi teks, bukan hasil scan). Sistem menebak pengalaman kerja dari pola tanggal dan
        skill dari daftar kata kunci — <strong>bukan hasil final</strong>, selalu cek ulang sebelum disimpan.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
        className="w-full max-w-sm rounded-lg border border-admin-border bg-white px-3 py-2 font-body text-sm text-admin-muted
                   file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-admin-accent/10 file:px-3 file:py-1.5
                   file:font-body file:text-xs file:font-medium file:text-admin-accent"
      />

      {loading && <p className="mt-3 font-body text-sm text-admin-muted">Membaca dan menganalisis PDF…</p>}
      {error && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-body text-sm text-admin-danger">{error}</p>}

      {result && (
        <div className="mt-5 space-y-5 border-t border-admin-border pt-5">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-body text-sm font-semibold text-admin-text">
                Pengalaman terdeteksi ({result.experiences.length})
              </h3>
              {result.experiences.length > 0 && (
                <button onClick={applyExperiences} className="admin-btn-primary !px-3 !py-1.5 !text-xs">
                  Tambahkan semua ke form ↓
                </button>
              )}
            </div>
            {result.experiences.length === 0 ? (
              <p className="mt-1.5 font-body text-xs text-admin-muted">
                Nggak ketemu pola tanggal yang cocok. Isi manual di form sebelah kiri.
              </p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {result.experiences.map((exp, i) => (
                  <li key={i} className="rounded-lg border border-admin-border bg-slate-50 px-3 py-2 font-body text-xs text-admin-muted">
                    <span className="font-medium text-admin-text">{exp.role_title}</span> — {exp.company}
                    <span className="text-admin-muted/70"> ({exp.raw_date_text})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-body text-sm font-semibold text-admin-text">Skill terdeteksi ({result.skills.length})</h3>
              {result.skills.length > 0 && (
                <button onClick={applySkills} disabled={checkedSkills.size === 0} className="admin-btn-primary !px-3 !py-1.5 !text-xs">
                  Tambahkan yang dicentang
                </button>
              )}
            </div>
            {result.skills.length === 0 ? (
              <p className="mt-1.5 font-body text-xs text-admin-muted">Tidak ada kata kunci yang cocok di daftar kami.</p>
            ) : (
              <div className="mt-2 flex flex-wrap gap-2">
                {result.skills.map((s) => (
                  <label
                    key={s}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full border border-admin-border bg-white px-3 py-1 font-body text-xs text-admin-text"
                  >
                    <input
                      type="checkbox"
                      checked={checkedSkills.has(s)}
                      onChange={() => toggleSkill(s)}
                      className="h-3.5 w-3.5 accent-admin-accent"
                    />
                    {s}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
