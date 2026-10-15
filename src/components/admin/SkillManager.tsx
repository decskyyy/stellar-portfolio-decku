'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { Skill } from '@/lib/types';
import SkillLogo from '@/components/site/SkillLogo';

type Draft = { name: string; category: string; level: number; sort_order: number };

const EMPTY: Draft = { name: '', category: 'Support Operations', level: 4, sort_order: 0 };

function LevelPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`Level ${n}`}
          aria-pressed={value === n}
          className={`h-2.5 w-6 rounded-full transition ${n <= value ? 'bg-admin-accent' : 'admin-meter-off'}`}
        />
      ))}
    </div>
  );
}

export default function SkillManager({ initialSkills }: { initialSkills: Skill[] }) {
  const router = useRouter();
  const supabase = createClient();

  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const categories = Array.from(
    new Set([...initialSkills.map((s) => s.category), 'Support Operations', 'Data & Database', 'Enterprise Systems', 'Governance', 'Web'])
  ).sort();

  function reset() {
    setDraft(EMPTY);
    setEditingId(null);
  }

  async function save() {
    if (!draft.name.trim()) {
      toast.error('Skill name is required.');
      return;
    }

    setBusy(true);

    const payload = {
      name: draft.name.trim(),
      category: draft.category.trim() || 'General',
      level: draft.level,
      sort_order: Number(draft.sort_order) || 0,
    };

    const { error } = editingId
      ? await supabase.from('skills').update(payload).eq('id', editingId)
      : await supabase.from('skills').insert(payload);

    setBusy(false);

    if (error) {
      toast.error(`Save failed: ${error.message}`);
      return;
    }

    toast.success(editingId ? 'Skill updated.' : 'Skill added.');
    reset();
    router.refresh();
  }

  async function remove(id: string) {
    const { error } = await supabase.from('skills').delete().eq('id', id);

    if (error) {
      toast.error(`Delete failed: ${error.message}`);
      return;
    }

    if (editingId === id) reset();
    toast.success('Skill deleted.');
    router.refresh();
  }

  const grouped = initialSkills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ||= []).push(s);
    return acc;
  }, {});

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="admin-card h-fit">
        <div className="admin-section-header">
          <h2 className="font-display text-lg font-bold text-admin-text">
            {editingId ? 'Edit skill' : 'Add skill'}
          </h2>
          {editingId && (
            <button onClick={reset} className="font-body text-xs font-medium text-admin-muted hover:text-admin-text">
              Cancel
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="skill-name" className="admin-label">
              Skill name
            </label>
            <input
              id="skill-name"
              className="admin-input"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && save()}
              placeholder="Incident Management"
            />
            {draft.name.trim() && (
              <p className="mt-2 flex items-center gap-2 font-body text-xs text-admin-muted">
                <SkillLogo
                  name={draft.name}
                  className="h-4 w-4 shrink-0 text-admin-accent"
                />
                Logo preview
              </p>
            )}
          </div>

          <div>
            <label htmlFor="skill-category" className="admin-label">
              Category
            </label>
            <input
              id="skill-category"
              list="skill-categories"
              className="admin-input"
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            />
            <datalist id="skill-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <span className="admin-label">Proficiency</span>
            <div className="flex items-center gap-3">
              <LevelPicker value={draft.level} onChange={(n) => setDraft({ ...draft, level: n })} />
              <span className="font-body text-xs font-medium text-admin-muted">{draft.level} / 5</span>
            </div>
          </div>

          <div>
            <label htmlFor="skill-order" className="admin-label">
              Display order
            </label>
            <input
              id="skill-order"
              type="number"
              className="admin-input"
              value={draft.sort_order}
              onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
            />
          </div>

          <button onClick={save} disabled={busy} className="admin-btn-primary w-full">
            {busy ? 'Saving…' : editingId ? 'Save changes' : 'Add skill'}
          </button>
        </div>
      </div>

      <div>
        <div className="admin-section-header mb-4">
          <h2 className="font-display text-lg font-bold text-admin-text">Skills list</h2>
          <span className="admin-chip">{initialSkills.length} skills</span>
        </div>

        {initialSkills.length === 0 ? (
          <div className="admin-card text-center">
            <p className="font-body text-sm text-admin-muted">No skills have been added yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="admin-card">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="font-body text-sm font-semibold text-admin-accent">{category}</h3>
                  <span className="font-body text-[10px] uppercase tracking-[0.18em] text-admin-muted">{items.length} items</span>
                </div>
                <ul className="space-y-2">
                  {items.map((s) => (
                    <li key={s.id} className="admin-list-item flex flex-wrap items-center justify-between gap-3 rounded-xl pb-3">
                      <span className="flex min-w-0 items-center gap-2 font-body text-sm text-admin-text">
                        <SkillLogo
                          name={s.name}
                          className="h-4 w-4 shrink-0 text-admin-accent"
                        />
                        <span className="break-words">{s.name}</span>
                      </span>
                      <div className="flex items-center gap-3">
                        <LevelPicker value={s.level} onChange={() => {}} />
                        <button
                          onClick={() => {
                            setEditingId(s.id);
                            setDraft({ name: s.name, category: s.category, level: s.level, sort_order: s.sort_order });
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="font-body text-xs font-medium text-admin-muted hover:text-admin-accent"
                        >
                          Edit
                        </button>
                        <button onClick={() => remove(s.id)} className="font-body text-xs font-medium text-admin-muted hover:text-admin-danger">
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
