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

  const [profileId, setProfileId] = useState<string | null>(
    initialProfile && initialProfile.id !== 'fallback' ? initialProfile.id : null
  );

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
      toast.error(`Upload failed: ${error.message}`);
      setUploading(null);
      return;
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    set(kind === 'avatar' ? 'avatar_url' : 'cv_url', data.publicUrl);
    toast.success('File uploaded. Save your profile to publish the change.');
    setUploading(null);
  }

  async function save() {
    if (!draft.full_name.trim()) {
      toast.error('Name is required.');
      return;
    }

    setSaving(true);

    const payload = {
      ...draft,
      full_name: draft.full_name.trim(),
      updated_at: new Date().toISOString(),
    };

    const query = profileId
      ? supabase.from('profile').update(payload).eq('id', profileId).select().maybeSingle()
      : supabase.from('profile').insert(payload).select().maybeSingle();

    const { data, error } = await query;

    setSaving(false);

    if (error) {
      toast.error(`Save failed: ${error.message}`);
      return;
    }

    if (data?.id) {
      setProfileId(data.id);
    }

    toast.success('Profile saved and published on the home page.');
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
        <h2 className="mb-5 font-display text-lg font-bold text-admin-text">Home page content</h2>

        <div className="space-y-4">
          {text('full_name', 'Full name', 'Aristo Decky Susilo')}
          {text('role_title', 'Professional title', 'IT Support & Application Support')}

          <div>
            <label htmlFor="tagline" className="admin-label">
              Home introduction
            </label>
            <input
              id="tagline"
              className="admin-input"
              value={draft.tagline}
              onChange={(e) => set('tagline', e.target.value)}
              placeholder="A concise, professional introduction in English."
            />
            <p className="mt-1.5 font-body text-xs text-admin-muted">
              Appears directly below your name on the home page. Keep it to one clear sentence.
            </p>
          </div>

          <div>
            <label htmlFor="bio" className="admin-label">
              Professional summary
            </label>
            <textarea
              id="bio"
              rows={7}
              className="admin-input resize-y leading-relaxed"
              value={draft.bio}
              onChange={(e) => set('bio', e.target.value)}
              placeholder="Summarize your support experience, systems you have worked with, and key strengths."
            />
            <p className="mt-1.5 font-body text-xs text-admin-muted">
              Optional supporting paragraph on the home page. {draft.bio.length} characters.
            </p>
          </div>

          <button onClick={save} disabled={saving || uploading !== null} className="admin-btn-primary w-full">
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="admin-card">
          <h2 className="mb-5 font-display text-lg font-bold text-admin-text">Contact details</h2>
          <div className="space-y-4">
            {text('location', 'Location', 'North Jakarta')}
            {text('email', 'Email', 'name@example.com', 'email')}
            {text('phone', 'WhatsApp', '08xxxxxxxxxx', 'tel')}
            {text('github_url', 'GitHub', 'https://github.com/…')}
            {text('linkedin_url', 'LinkedIn', 'https://linkedin.com/in/…')}
          </div>
        </div>

        <div className="admin-card">
          <h2 className="mb-5 font-display text-lg font-bold text-admin-text">Files</h2>

          <div className="space-y-5">
            <div>
              <span className="admin-label">Profile photo</span>
              <div className="flex items-center gap-3">
                {draft.avatar_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={draft.avatar_url} alt="Profile photo preview" className="h-14 w-14 rounded-full border border-admin-border object-cover" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) upload('avatar', f);
                  }}
                  className="admin-input flex-1 rounded-lg px-3 py-2 font-body text-sm text-admin-muted
                             file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-admin-accent/10 file:px-3 file:py-1.5
                             file:font-body file:text-xs file:font-medium file:text-admin-accent"
                />
              </div>
            </div>

            <div>
              <span className="admin-label">Resume (PDF)</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload('cv', f);
                }}
                className="admin-input w-full px-3 py-2 font-body text-sm text-admin-muted
                           file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-admin-accent/10 file:px-3 file:py-1.5
                           file:font-body file:text-xs file:font-medium file:text-admin-accent"
              />
              {draft.cv_url && (
                <a href={draft.cv_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-body text-xs text-admin-accent hover:underline">
                  View uploaded resume
                </a>
              )}
              {uploading === 'cv' && <p className="mt-2 font-body text-xs text-admin-muted">Uploading…</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
