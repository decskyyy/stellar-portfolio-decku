'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { Experience } from '@/lib/types';
import type { ExperienceDraft } from '@/lib/cv-parser';
import CvImport from './CvImport';

type FormState = {
  id: string | null;
  company: string;
  role_title: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  sort_order: number;
};

const EMPTY: FormState = {
  id: null,
  company: '',
  role_title: '',
  location: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
  sort_order: 0,
};

type DraftRow = ExperienceDraft & { key: string };

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
}

export default function ExperienceManager({ initialExperience }: { initialExperience: Experience[] }) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [savingDraftKey, setSavingDraftKey] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const editing = form.id !== null;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function reset() {
    setForm(EMPTY);
  }

  function startEdit(e: Experience) {
    setForm({
      id: e.id,
      company: e.company,
      role_title: e.role_title,
      location: e.location ?? '',
      start_date: e.start_date ?? '',
      end_date: e.end_date ?? '',
      is_current: e.is_current,
      description: e.description ?? '',
      sort_order: e.sort_order,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function save() {
    if (!form.company.trim() || !form.role_title.trim()) {
      toast.error('Nama perusahaan dan jabatan wajib diisi.');
      return;
    }
    setSaving(true);

    const payload = {
      company: form.company.trim(),
      role_title: form.role_title.trim(),
      location: form.location.trim(),
      start_date: form.start_date || null,
      end_date: form.is_current ? null : form.end_date || null,
      is_current: form.is_current,
      description: form.description.trim(),
      sort_order: Number(form.sort_order) || 0,
    };

    const query = editing
      ? supabase.from('experience').update(payload).eq('id', form.id!)
      : supabase.from('experience').insert(payload);

    const { error } = await query;
    setSaving(false);

    if (error) {
      toast.error(`Gagal menyimpan: ${error.message}`);
      return;
    }

    toast.success(editing ? 'Pengalaman diperbarui.' : 'Pengalaman ditambahkan.');
    reset();
    router.refresh();
  }

  async function remove(id: string) {
    const { error } = await supabase.from('experience').delete().eq('id', id);
    setConfirmId(null);
    if (error) {
      toast.error(`Gagal menghapus: ${error.message}`);
      return;
    }
    if (form.id === id) reset();
    toast.success('Pengalaman dihapus.');
    router.refresh();
  }

  // --- Integrasi CV import ---
  function addDrafts(newDrafts: ExperienceDraft[]) {
    setDrafts((prev) => [
      ...prev,
      ...newDrafts.map((d, i) => ({ ...d, key: `${Date.now()}-${i}` })),
    ]);
  }

  function updateDraft(key: string, patch: Partial<DraftRow>) {
    setDrafts((prev) => prev.map((d) => (d.key === key ? { ...d, ...patch } : d)));
  }

  function discardDraft(key: string) {
    setDrafts((prev) => prev.filter((d) => d.key !== key));
  }

  async function saveDraft(draft: DraftRow) {
    if (!draft.company.trim() || !draft.role_title.trim()) {
      toast.error('Lengkapi nama perusahaan dan jabatan dulu.');
      return;
    }
    setSavingDraftKey(draft.key);

    const { error } = await supabase.from('experience').insert({
      company: draft.company.trim(),
      role_title: draft.role_title.trim(),
      start_date: draft.start_date,
      end_date: draft.is_current ? null : draft.end_date,
      is_current: draft.is_current,
      description: draft.description.trim(),
    });

    setSavingDraftKey(null);

    if (error) {
      toast.error(`Gagal menyimpan: ${error.message}`);
      return;
    }

    toast.success('Pengalaman dari CV tersimpan.');
    discardDraft(draft.key);
    router.refresh();
  }

  async function addSkillsFromCv(skillNames: string[]) {
    const rows = skillNames.map((name) => ({ name, category: 'Terdeteksi dari CV', level: 3, sort_order: 0 }));
    const { error } = await supabase.from('skills').insert(rows);
    if (error) {
      toast.error(`Sebagian/semua skill gagal ditambahkan: ${error.message}`);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <CvImport onApplyExperiences={addDrafts} onApplySkills={addSkillsFromCv} />

      {drafts.length > 0 && (
        <div className="space-y-3">
          <div className="admin-section-header">
            <h2 className="font-display text-lg font-bold text-admin-text">Draf dari CV</h2>
            <span className="admin-chip">{drafts.length} perlu review</span>
          </div>
          {drafts.map((d) => (
            <div key={d.key} className="admin-card admin-status-warning">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="admin-label">Jabatan</label>
                  <input className="admin-input" value={d.role_title} onChange={(e) => updateDraft(d.key, { role_title: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label">Perusahaan</label>
                  <input className="admin-input" value={d.company} onChange={(e) => updateDraft(d.key, { company: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label">Mulai</label>
                  <input type="date" className="admin-input" value={d.start_date ?? ''} onChange={(e) => updateDraft(d.key, { start_date: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label">Selesai</label>
                  <input
                    type="date"
                    className="admin-input"
                    disabled={d.is_current}
                    value={d.end_date ?? ''}
                    onChange={(e) => updateDraft(d.key, { end_date: e.target.value })}
                  />
                  <label className="mt-1.5 flex items-center gap-2 font-body text-xs text-admin-muted">
                    <input type="checkbox" checked={d.is_current} onChange={(e) => updateDraft(d.key, { is_current: e.target.checked })} className="accent-admin-accent" />
                    Masih berlangsung
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="admin-label">Deskripsi (teks mentah hasil deteksi, edit bebas)</label>
                  <textarea rows={2} className="admin-input resize-y" value={d.description} onChange={(e) => updateDraft(d.key, { description: e.target.value })} />
                </div>
              </div>
              <p className="mt-2 font-body text-[11px] text-admin-muted">Pola tanggal asli: “{d.raw_date_text}” — cek lagi kalau ada yang aneh.</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => saveDraft(d)} disabled={savingDraftKey === d.key} className="admin-btn-primary !px-3 !py-1.5 !text-xs">
                  {savingDraftKey === d.key ? 'Menyimpan…' : 'Simpan pengalaman ini'}
                </button>
                <button onClick={() => discardDraft(d.key)} className="admin-btn-secondary !px-3 !py-1.5 !text-xs">
                  Buang
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
        <div className="admin-card h-fit">
          <div className="admin-section-header">
            <h2 className="font-display text-lg font-bold text-admin-text">{editing ? 'Ubah pengalaman' : 'Tambah pengalaman'}</h2>
            {editing && (
              <button onClick={reset} className="font-body text-xs font-medium text-admin-muted hover:text-admin-text">
                Batal
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="admin-label">Jabatan</label>
              <input className="admin-input" value={form.role_title} onChange={(e) => set('role_title', e.target.value)} placeholder="IT Support" />
            </div>
            <div>
              <label className="admin-label">Perusahaan</label>
              <input className="admin-input" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="PT Contoh Sejahtera" />
            </div>
            <div>
              <label className="admin-label">Lokasi (opsional)</label>
              <input className="admin-input" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Jakarta" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="admin-label">Mulai</label>
                <input type="date" className="admin-input" value={form.start_date} onChange={(e) => set('start_date', e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Selesai</label>
                <input
                  type="date"
                  className="admin-input"
                  disabled={form.is_current}
                  value={form.end_date}
                  onChange={(e) => set('end_date', e.target.value)}
                />
              </div>
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_current} onChange={(e) => set('is_current', e.target.checked)} className="h-4 w-4 accent-admin-accent" />
              <span className="font-body text-sm font-medium text-admin-text">Masih bekerja di sini</span>
            </label>

            <div>
              <label className="admin-label">Deskripsi</label>
              <textarea rows={4} className="admin-input resize-y" value={form.description} onChange={(e) => set('description', e.target.value)} />
            </div>

            <div>
              <label className="admin-label">Urutan tampil</label>
              <input type="number" className="admin-input" value={form.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} />
            </div>

            <button onClick={save} disabled={saving} className="admin-btn-primary w-full">
              {saving ? 'Menyimpan…' : editing ? 'Simpan perubahan' : 'Tambahkan pengalaman'}
            </button>
          </div>
        </div>

        <div>
          <div className="admin-section-header mb-4">
            <h2 className="font-display text-lg font-bold text-admin-text">Riwayat tersimpan</h2>
            <span className="admin-chip">{initialExperience.length} entri</span>
          </div>

          {initialExperience.length === 0 ? (
            <div className="admin-card text-center">
              <p className="font-body text-sm text-admin-muted">Belum ada riwayat pekerjaan. Isi manual atau upload CV di atas.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {initialExperience.map((e) => (
                <li key={e.id} className="admin-list-item">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-bold text-admin-text">{e.role_title}</h3>
                      <p className="font-body text-sm text-admin-muted">{e.company}</p>
                      <p className="mt-1 font-body text-xs text-admin-muted">
                        {formatDate(e.start_date)} – {e.is_current ? 'Sekarang' : formatDate(e.end_date)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1.5">
                      <button onClick={() => startEdit(e)} className="admin-btn-secondary !px-3 !py-1 !text-xs">
                        Ubah
                      </button>
                      {confirmId === e.id ? (
                        <div className="flex gap-1.5">
                          <button onClick={() => remove(e.id)} className="admin-btn-danger !px-2 !py-1 !text-[11px]">Yakin</button>
                          <button onClick={() => setConfirmId(null)} className="admin-btn-secondary !px-2 !py-1 !text-[11px]">Batal</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmId(e.id)} className="admin-btn-danger !px-3 !py-1 !text-xs">
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
