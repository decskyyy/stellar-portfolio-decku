'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { STORAGE_BUCKET, type Project } from '@/lib/types';
import StarRating from '@/components/site/StarRating';

type FormState = {
  id: string | null;
  title: string;
  description: string;
  tech_stack: string;
  github_url: string;
  demo_url: string;
  image_url: string;
  rating: number;
  featured: boolean;
  sort_order: number;
};

const EMPTY: FormState = {
  id: null,
  title: '',
  description: '',
  tech_stack: '',
  github_url: '',
  demo_url: '',
  image_url: '',
  rating: 5,
  featured: false,
  sort_order: 0,
};

export default function ProjectManager({ initialProjects }: { initialProjects: Project[] }) {
  const router = useRouter();
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const editing = form.id !== null;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function resetForm() {
    setForm(EMPTY);
    if (fileRef.current) fileRef.current.value = '';
  }

  function startEdit(p: Project) {
    setForm({
      id: p.id,
      title: p.title,
      description: p.description ?? '',
      tech_stack: (p.tech_stack ?? []).join(', '),
      github_url: p.github_url ?? '',
      demo_url: p.demo_url ?? '',
      image_url: p.image_url ?? '',
      rating: p.rating,
      featured: p.featured,
      sort_order: p.sort_order,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function uploadImage(file: File) {
    setUploading(true);

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `projects/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (error) {
      toast.error(`Gambar gagal diunggah: ${error.message}`);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    set('image_url', data.publicUrl);
    toast.success('Gambar terunggah. Jangan lupa simpan proyeknya.');
    setUploading(false);
  }

  async function save() {
    if (!form.title.trim()) {
      toast.error('Judul proyek wajib diisi.');
      return;
    }

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      tech_stack: form.tech_stack
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      github_url: form.github_url.trim(),
      demo_url: form.demo_url.trim(),
      image_url: form.image_url.trim(),
      rating: form.rating,
      featured: form.featured,
      sort_order: Number(form.sort_order) || 0,
    };

    const query = editing
      ? supabase.from('projects').update(payload).eq('id', form.id!)
      : supabase.from('projects').insert(payload);

    const { error } = await query;
    setSaving(false);

    if (error) {
      toast.error(`Gagal menyimpan: ${error.message}`);
      return;
    }

    toast.success(editing ? 'Proyek diperbarui.' : 'Proyek ditambahkan.');
    resetForm();
    router.refresh();
  }

  async function remove(id: string) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    setConfirmId(null);

    if (error) {
      toast.error(`Gagal menghapus: ${error.message}`);
      return;
    }

    if (form.id === id) resetForm();
    toast.success('Proyek dihapus.');
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
      {/* ---------------- Form ---------------- */}
      <div className="admin-card h-fit">
        <div className="admin-section-header">
          <h2 className="font-display text-lg font-bold text-admin-text">
            {editing ? 'Ubah proyek' : 'Tambah proyek'}
          </h2>
          {editing && (
            <button onClick={resetForm} className="font-body text-xs font-medium text-admin-muted hover:text-admin-text">
              Batal
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="admin-label">
              Judul
            </label>
            <input
              id="title"
              className="admin-input"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Job Application Tracker"
            />
          </div>

          <div>
            <label htmlFor="description" className="admin-label">
              Deskripsi
            </label>
            <textarea
              id="description"
              rows={4}
              className="admin-input resize-y"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Apa yang proyek ini lakukan dan untuk siapa."
            />
          </div>

          <div>
            <label htmlFor="tech" className="admin-label">
              Teknologi (pisahkan dengan koma)
            </label>
            <input
              id="tech"
              className="admin-input"
              value={form.tech_stack}
              onChange={(e) => set('tech_stack', e.target.value)}
              placeholder="Next.js, Supabase, Tailwind CSS"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="github" className="admin-label">
                Link GitHub
              </label>
              <input
                id="github"
                className="admin-input"
                value={form.github_url}
                onChange={(e) => set('github_url', e.target.value)}
                placeholder="https://github.com/…"
              />
            </div>
            <div>
              <label htmlFor="demo" className="admin-label">
                Link demo
              </label>
              <input
                id="demo"
                className="admin-input"
                value={form.demo_url}
                onChange={(e) => set('demo_url', e.target.value)}
                placeholder="https://…"
              />
            </div>
          </div>

          <div>
            <span className="admin-label">Rating</span>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set('rating', n)}
                    aria-label={`Beri rating ${n}`}
                    aria-pressed={form.rating === n}
                    className="p-0.5 transition hover:scale-110"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M12 2.6l2.65 6.03 6.55.56-4.96 4.3 1.49 6.41L12 16.5l-5.73 3.4 1.49-6.41-4.96-4.3 6.55-.56L12 2.6z"
                        fill={n <= form.rating ? '#FBBF24' : 'none'}
                        stroke={n <= form.rating ? '#F59E0B' : '#CBD5E1'}
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ))}
              </div>
              <span className="font-body text-xs font-semibold text-admin-muted">{form.rating} / 5</span>
            </div>
          </div>

          <div>
            <span className="admin-label">Gambar proyek</span>
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file);
                }}
                className="w-full max-w-xs rounded-lg border border-admin-border bg-white px-3 py-2 font-body text-sm text-admin-muted
                           file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-admin-accent/10 file:px-3 file:py-1.5
                           file:font-body file:text-xs file:font-medium file:text-admin-accent"
              />
              {uploading && <span className="font-body text-xs text-admin-muted">Mengunggah…</span>}
            </div>

            {form.image_url && (
              <div className="mt-3 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image_url} alt="Pratinjau" className="h-16 w-28 rounded-lg border border-admin-border object-cover" />
                <button onClick={() => set('image_url', '')} className="font-body text-xs font-medium text-admin-muted hover:text-admin-danger">
                  Hapus gambar
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="order" className="admin-label">
                Urutan tampil
              </label>
              <input
                id="order"
                type="number"
                className="admin-input"
                value={form.sort_order}
                onChange={(e) => set('sort_order', Number(e.target.value))}
              />
            </div>
            <label className="flex cursor-pointer items-center gap-3 self-end pb-2.5">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="h-4 w-4 rounded accent-admin-accent"
              />
              <span className="font-body text-sm font-medium text-admin-text">Tandai unggulan</span>
            </label>
          </div>

          <button onClick={save} disabled={saving || uploading} className="admin-btn-primary w-full">
            {saving ? 'Menyimpan…' : editing ? 'Simpan perubahan' : 'Tambahkan proyek'}
          </button>
        </div>
      </div>

      {/* ---------------- Daftar ---------------- */}
      <div>
        <div className="admin-section-header mb-4">
          <h2 className="font-display text-lg font-bold text-admin-text">Daftar proyek</h2>
          <span className="admin-chip">{initialProjects.length} entri</span>
        </div>

        {initialProjects.length === 0 ? (
          <div className="admin-card text-center">
            <p className="font-body text-sm text-admin-muted">Belum ada proyek. Isi formulir di samping untuk memulai.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {initialProjects.map((p) => (
              <li key={p.id} className="admin-list-item">
                <div className="flex items-start gap-4">
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_url} alt="" className="h-16 w-24 shrink-0 rounded-lg border border-admin-border object-cover" />
                  ) : (
                    <div className="h-16 w-24 shrink-0 rounded-lg border border-admin-border bg-slate-50" />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-sm font-bold text-admin-text">{p.title}</h3>
                      {p.featured && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wide text-amber-700">
                          Unggulan
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 font-body text-sm text-admin-muted">{p.description}</p>
                    <div className="mt-2">
                      <StarRating value={p.rating} size={13} />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-1.5">
                    <button onClick={() => startEdit(p)} className="admin-btn-secondary !px-3 !py-1 !text-xs">
                      Ubah
                    </button>
                    {confirmId === p.id ? (
                      <div className="flex gap-1.5">
                        <button onClick={() => remove(p.id)} className="admin-btn-danger !px-2 !py-1 !text-[11px]">
                          Yakin
                        </button>
                        <button onClick={() => setConfirmId(null)} className="admin-btn-secondary !px-2 !py-1 !text-[11px]">
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmId(p.id)} className="admin-btn-danger !px-3 !py-1 !text-xs">
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
  );
}
