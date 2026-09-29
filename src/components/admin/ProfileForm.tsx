'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { STORAGE_BUCKET, type Profile } from '@/lib/types';

type Draft = Omit<Profile, 'id' | 'updated_at'>;

const EMPTY: Draft = {
  full_name: '',
  role_title: '',
  tagline: '',
  bio: '',
  location: '',
  email: '',
  phone: '',
  github_url: '',
  linkedin_url: '',
  avatar_url: '',
  cv_url: '',
};

export default function ProfileForm({ initialProfile }: { initialProfile: Profile | null }) {
  const router = useRouter();
  const supabase = createClient();

  const [draft, setDraft] = useState<Draft>(() => {
    if (!initialProfile) return EMPTY;
    const { id, updated_at, ...rest } = initialProfile;
    return { ...EMPTY, ...rest };
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'avatar' | 'cv' | null>(null);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function upload(kind: 'avatar' | 'cv', file: File) {
    setUploading(kind);

    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const path = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: false });

    if (error) {
      toast.error(`Berkas gagal diunggah: ${error.message}`);
      setUploading(null);
      return;
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    set(kind === 'avatar' ? 'avatar_url' : 'cv_url', data.publicUrl);
    toast.success('Berkas terunggah. Simpan profil untuk menerapkannya.');
    setUploading(null);
  }

  async function save() {
    if (!draft.full_name.trim()) {
      toast.error('Nama wajib diisi.');
      return;
    }

    setSaving(true);

    const payload = { ...draft, full_name: draft.full_name.trim() };

    const { error } = initialProfile
      ? await supabase.from('profile').update(payload).eq('id', initialProfile.id)
      : await supabase.from('profile').insert(payload);

    setSaving(false);

    if (error) {
      toast.error(`Gagal menyimpan: ${error.message}`);
      return;
    }

    toast.success('Profil tersimpan dan sudah tampil di halaman utama.');
    router.refresh();
  }

  const text = (
    key: keyof Draft,
    label: string,
    placeholder = '',
    type: 'text' | 'email' | 'tel' = 'text'
  ) => (
    <div>
      <label htmlFor={key} className="admin-label">
        {label}
      </label>
      <input
        id={key}
        type={type}
        className="admin-input"
        value={(draft[key] as string) ?? ''}
        onChange={(e) => set(key, e.target.value as Draft[typeof key])}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="admin-card">
        <h2 className="mb-5 font-display text-lg font-bold text-admin-text">Identitas</h2>

        <div className="space-y-4">
          {text('full_name', 'Nama lengkap', 'Aristo Decky Susilo')}
          {text('role_title', 'Jabatan', 'IT Support & Application Support')}

          <div>
            <label htmlFor="tagline" className="admin-label">
              Tagline
            </label>
            <input
              id="tagline"
              className="admin-input"
              value={draft.tagline}
              onChange={(e) => set('tagline', e.target.value)}
              placeholder="Satu kalimat yang menggambarkan cara kamu bekerja."
            />
          </div>

          <div>
            <label htmlFor="bio" className="admin-label">
              Bio
            </label>
            <textarea
              id="bio"
              rows={7}
              className="admin-input resize-y leading-relaxed"
              value={draft.bio}
              onChange={(e) => set('bio', e.target.value)}
              placeholder="Ringkasan pengalaman, sistem yang pernah ditangani, dan kekuatan utama."
            />
            <p className="mt-1.5 font-body text-xs text-admin-muted">{draft.bio.length} karakter</p>
          </div>

          <button onClick={save} disabled={saving || uploading !== null} className="admin-btn-primary w-full">
            {saving ? 'Menyimpan…' : 'Simpan profil'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="admin-card">
          <h2 className="mb-5 font-display text-lg font-bold text-admin-text">Kontak</h2>
          <div className="space-y-4">
            {text('location', 'Lokasi', 'Sunter, Jakarta Utara')}
            {text('email', 'Email', 'nama@email.com', 'email')}
            {text('phone', 'WhatsApp', '08xxxxxxxxxx', 'tel')}
            {text('github_url', 'GitHub', 'https://github.com/…')}
            {text('linkedin_url', 'LinkedIn', 'https://linkedin.com/in/…')}
          </div>
        </div>

        <div className="admin-card">
          <h2 className="mb-5 font-display text-lg font-bold text-admin-text">Berkas</h2>

          <div className="space-y-5">
            <div>
              <span className="admin-label">Foto profil</span>
              <div className="flex items-center gap-3">
                {draft.avatar_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={draft.avatar_url} alt="Pratinjau foto" className="h-14 w-14 rounded-full border border-admin-border object-cover" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) upload('avatar', f);
                  }}
                  className="flex-1 rounded-lg border border-admin-border bg-white px-3 py-2 font-body text-sm text-admin-muted
                             file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-admin-accent/10 file:px-3 file:py-1.5
                             file:font-body file:text-xs file:font-medium file:text-admin-accent"
                />
              </div>
            </div>

            <div>
              <span className="admin-label">CV (PDF)</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload('cv', f);
                }}
                className="w-full rounded-lg border border-admin-border bg-white px-3 py-2 font-body text-sm text-admin-muted
                           file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-admin-accent/10 file:px-3 file:py-1.5
                           file:font-body file:text-xs file:font-medium file:text-admin-accent"
              />
              {draft.cv_url && (
                <a href={draft.cv_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-body text-xs text-admin-accent hover:underline">
                  Lihat CV yang terunggah
                </a>
              )}
              {uploading === 'cv' && <p className="mt-2 font-body text-xs text-admin-muted">Mengunggah…</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
