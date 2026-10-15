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
  onApplySkills: (skills: string[]) => Promise<void>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [checkedSkills, setCheckedSkills] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [applyingSkills, setApplyingSkills] = useState(false);

  async function handleFile(file: File) {
    if (loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/parse-cv', { method: 'POST', body });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Could not process the resume.');
        return;
      }

      setResult(data);
      setCheckedSkills(new Set(data.skills));
    } catch {
      setError('Could not upload or read the file.');
    } finally {
      setLoading(false);
    }
  }

  function applyExperiences() {
    if (!result || result.experiences.length === 0) return;
    onApplyExperiences(result.experiences);
    toast.success(`${result.experiences.length} experience drafts added below. Review and complete each entry.`);
    setResult((current) => (current ? { ...current, experiences: [] } : current));
  }

  async function applySkills() {
    const chosen = Array.from(checkedSkills);
    if (chosen.length === 0 || applyingSkills) return;

    setApplyingSkills(true);
    try {
      await onApplySkills(chosen);
      toast.success(`${chosen.length} skills added.`);
      setResult((r) => (r ? { ...r, skills: [] } : r));
      setCheckedSkills(new Set());
    } catch (error) {
      toast.error(`Could not add skills: ${error instanceof Error ? error.message : 'Unexpected error.'}`);
    } finally {
      setApplyingSkills(false);
    }
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
        <h2 className="font-display text-lg font-bold text-admin-text">Import from resume</h2>
        <span className="admin-status-warning rounded-full px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wide">
          Beta, tanpa AI
        </span>
      </div>
      <p className="mb-4 font-body text-xs text-admin-muted">
        Upload a text-based PDF resume (not a scan). The parser estimates roles from date patterns and
        skills from keywords. <strong>Review every result before saving.</strong>
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="application/pdf"
        disabled={loading || applyingSkills}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
        className="admin-input w-full max-w-sm px-3 py-2 font-body text-sm text-admin-muted
                   file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-admin-accent/10 file:px-3 file:py-1.5
                   file:font-body file:text-xs file:font-medium file:text-admin-accent"
      />

      {loading && <p className="mt-3 font-body text-sm text-admin-muted" role="status">Reading and analyzing PDF…</p>}
      {error && <p className="admin-status-error mt-3 rounded-lg border px-3 py-2 font-body text-sm">{error}</p>}

      {result && (
        <div className="mt-5 space-y-5 border-t border-admin-border pt-5">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-body text-sm font-semibold text-admin-text">
                Experience found ({result.experiences.length})
              </h3>
              {result.experiences.length > 0 && (
                <button onClick={applyExperiences} className="admin-btn-primary !px-3 !py-1.5 !text-xs">
                  Add all to form ↓
                </button>
              )}
            </div>
            {result.experiences.length === 0 ? (
              <p className="mt-1.5 font-body text-xs text-admin-muted">
                No matching date patterns found. Add experience manually using the form.
              </p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {result.experiences.map((exp, i) => (
                  <li key={i} className="admin-inset rounded-lg border px-3 py-2 font-body text-xs text-admin-muted">
                    <span className="font-medium text-admin-text">{exp.role_title}</span> — {exp.company}
                    <span className="text-admin-muted/70"> ({exp.raw_date_text})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-body text-sm font-semibold text-admin-text">Skills found ({result.skills.length})</h3>
              {result.skills.length > 0 && (
                <button onClick={applySkills} disabled={checkedSkills.size === 0 || applyingSkills} className="admin-btn-primary !px-3 !py-1.5 !text-xs">
                  {applyingSkills ? 'Adding…' : 'Add selected'}
                </button>
              )}
            </div>
            {result.skills.length === 0 ? (
              <p className="mt-1.5 font-body text-xs text-admin-muted">No matching keywords found.</p>
            ) : (
              <div className="mt-2 flex flex-wrap gap-2">
                {result.skills.map((s) => (
                  <label
                    key={s}
                    className="admin-inset flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 font-body text-xs text-admin-text"
                  >
                    <input
                      type="checkbox"
                      checked={checkedSkills.has(s)}
                      disabled={applyingSkills}
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
