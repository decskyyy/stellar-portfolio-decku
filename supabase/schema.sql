-- =====================================================================
--  STELLAR PORTFOLIO — Skema Supabase
--  Jalankan seluruh file ini di Supabase Dashboard > SQL Editor > Run
--  Aman dijalankan ulang (idempotent).
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. TABEL
-- ---------------------------------------------------------------------

-- Profil (hanya 1 baris dipakai, selalu baris terbaru)
create table if not exists public.profile (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null default '',
  role_title   text not null default '',
  tagline      text not null default '',
  bio          text not null default '',
  location     text default '',
  email        text default '',
  phone        text default '',
  github_url   text default '',
  linkedin_url text default '',
  avatar_url   text default '',
  cv_url       text default '',
  updated_at   timestamptz not null default now()
);

create table if not exists public.skills (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  category   text not null default 'General',
  level      smallint not null default 3 check (level between 1 and 5),
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  tech_stack  text[] not null default '{}',
  github_url  text default '',
  demo_url    text default '',
  image_url   text default '',
  rating      smallint not null default 5 check (rating between 1 and 5),
  featured    boolean not null default false,
  sort_order  smallint not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists projects_sort_idx on public.projects (sort_order asc, created_at desc);
create index if not exists skills_sort_idx  on public.skills  (sort_order asc, created_at asc);

-- ---------------------------------------------------------------------
-- 2. TRIGGER updated_at
-- ---------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
  before update on public.projects
  for each row execute function public.touch_updated_at();

drop trigger if exists profile_touch_updated_at on public.profile;
create trigger profile_touch_updated_at
  before update on public.profile
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
--    Publik boleh baca (halaman portfolio), hanya user dengan email
--    admin yang boleh tulis.
--    Set admin email via Postgres setting atau pakai default di bawah.
--    Untuk ganti admin:
--      (a) Ubah default email hardcoded di bawah, ATAU
--      (b) Set `app.admin_email` via Supabase Dashboard > SQL Editor:
--          alter role authenticator set app.admin_email = 'admin@mail.com';
--          select pg_reload_conf();
-- ---------------------------------------------------------------------

alter table public.profile  enable row level security;
alter table public.skills   enable row level security;
alter table public.projects enable row level security;
alter table public.experience enable row level security;

-- profile
drop policy if exists "profile_public_read"  on public.profile;
drop policy if exists "profile_admin_write"  on public.profile;
create policy "profile_public_read" on public.profile
  for select using (true);
create policy "profile_admin_write" on public.profile
  for all to authenticated
  using (
    auth.jwt() ->> 'email' = coalesce(
      nullif(current_setting('app.admin_email', true), ''),
      'deckysusilo7@gmail.com'
    )
  )
  with check (
    auth.jwt() ->> 'email' = coalesce(
      nullif(current_setting('app.admin_email', true), ''),
      'deckysusilo7@gmail.com'
    )
  );

-- skills
drop policy if exists "skills_public_read" on public.skills;
drop policy if exists "skills_admin_write" on public.skills;
create policy "skills_public_read" on public.skills
  for select using (true);
create policy "skills_admin_write" on public.skills
  for all to authenticated
  using (
    auth.jwt() ->> 'email' = coalesce(
      nullif(current_setting('app.admin_email', true), ''),
      'deckysusilo7@gmail.com'
    )
  )
  with check (
    auth.jwt() ->> 'email' = coalesce(
      nullif(current_setting('app.admin_email', true), ''),
      'deckysusilo7@gmail.com'
    )
  );

-- projects
drop policy if exists "projects_public_read" on public.projects;
drop policy if exists "projects_admin_write" on public.projects;
create policy "projects_public_read" on public.projects
  for select using (true);
create policy "projects_admin_write" on public.projects
  for all to authenticated
  using (
    auth.jwt() ->> 'email' = coalesce(
      nullif(current_setting('app.admin_email', true), ''),
      'deckysusilo7@gmail.com'
    )
  )
  with check (
    auth.jwt() ->> 'email' = coalesce(
      nullif(current_setting('app.admin_email', true), ''),
      'deckysusilo7@gmail.com'
    )
  );

-- experience
drop policy if exists "experience_public_read" on public.experience;
drop policy if exists "experience_admin_write" on public.experience;
create policy "experience_public_read" on public.experience
  for select using (true);
create policy "experience_admin_write" on public.experience
  for all to authenticated
  using (
    auth.jwt() ->> 'email' = coalesce(
      nullif(current_setting('app.admin_email', true), ''),
      'deckysusilo7@gmail.com'
    )
  )
  with check (
    auth.jwt() ->> 'email' = coalesce(
      nullif(current_setting('app.admin_email', true), ''),
      'deckysusilo7@gmail.com'
    )
  );

-- ---------------------------------------------------------------------
-- 4. STORAGE — bucket untuk gambar proyek & avatar
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "assets_public_read"   on storage.objects;
drop policy if exists "assets_admin_insert"  on storage.objects;
drop policy if exists "assets_admin_update"  on storage.objects;
drop policy if exists "assets_admin_delete"  on storage.objects;

create policy "assets_public_read" on storage.objects
  for select using (bucket_id = 'portfolio-assets');

create policy "assets_admin_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'portfolio-assets' and
    auth.jwt() ->> 'email' = coalesce(
      nullif(current_setting('app.admin_email', true), ''),
      'deckysusilo7@gmail.com'
    )
  );

create policy "assets_admin_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'portfolio-assets' and
    auth.jwt() ->> 'email' = coalesce(
      nullif(current_setting('app.admin_email', true), ''),
      'deckysusilo7@gmail.com'
    )
  );

create policy "assets_admin_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'portfolio-assets' and
    auth.jwt() ->> 'email' = coalesce(
      nullif(current_setting('app.admin_email', true), ''),
      'deckysusilo7@gmail.com'
    )
  );

-- ---------------------------------------------------------------------
-- 5. SEED — data awal supaya halaman tidak kosong saat pertama dibuka.
--    Semuanya bisa diubah lewat /admin.
-- ---------------------------------------------------------------------

insert into public.profile (full_name, role_title, tagline, bio, location, email, github_url, linkedin_url)
select
  'Aristo Decky Susilo',
  'IT Support & Application Support',
  'Menjaga sistem tetap menyala, tiket tetap bergerak, pengguna tetap tenang.',
  'IT Support dan Application Support dengan pengalaman 2+ tahun menangani sistem POS, ERP, HRIS, dan middleware untuk operasional multi-outlet. Terbiasa dengan incident management, kepatuhan SLA, query database untuk investigasi data, serta pelatihan dan dokumentasi untuk pengguna non-teknis.',
  'Sunter, Jakarta Utara',
  'deckysusilo@gmail.com',
  'https://github.com/',
  'https://linkedin.com/in/'
where not exists (select 1 from public.profile);

insert into public.skills (name, category, level, sort_order)
select * from (values
  ('Incident Management',      'Support Operations', 5, 1),
  ('SLA & Ticketing (Freescout)', 'Support Operations', 5, 2),
  ('User Training & Dokumentasi', 'Support Operations', 4, 3),
  ('Eskalasi Lintas Tim',      'Support Operations', 4, 4),
  ('SQL / PostgreSQL',         'Data & Database',    4, 5),
  ('pgAdmin & DBeaver',        'Data & Database',    4, 6),
  ('SAP ERP',                  'Enterprise Systems', 4, 7),
  ('POS (Gripstore, Ismaya+, Fooma)', 'Enterprise Systems', 5, 8),
  ('HRIS & CRM',               'Enterprise Systems', 3, 9),
  ('ISO 27001 Foundation',     'Governance',         3, 10),
  ('Remote Support Tools',     'Support Operations', 4, 11),
  ('HTML, CSS, JavaScript',    'Web',                3, 12)
) as seed(name, category, level, sort_order)
where not exists (select 1 from public.skills);

insert into public.projects (title, description, tech_stack, github_url, demo_url, rating, featured, sort_order)
select * from (values
  (
    'Job Application Tracker',
    'Aplikasi satu-file untuk memantau lamaran kerja lintas platform. Menyimpan status (Applied sampai Offered), catatan per lamaran, dan bertahan di localStorage tanpa backend.',
    array['HTML', 'Tailwind CSS', 'JavaScript', 'localStorage'],
    'https://github.com/', '', 5, true, 1
  ),
  (
    'REELM — Streaming Platform UI',
    'Antarmuka platform streaming bergaya sinematik: hero carousel, baris rekomendasi, dan halaman detail judul. Dibangun sebagai latihan komposisi komponen React.',
    array['React', 'Tailwind CSS'],
    'https://github.com/', '', 4, false, 2
  ),
  (
    'JIHYOSHOP — K-Pop Store Demo',
    'Demo e-commerce merchandise K-Pop dengan katalog produk, keranjang belanja, dan alur checkout sederhana.',
    array['HTML', 'CSS', 'JavaScript'],
    'https://github.com/', '', 4, false, 3
  )
) as seed(title, description, tech_stack, github_url, demo_url, rating, featured, sort_order)
where not exists (select 1 from public.projects);

-- ---------------------------------------------------------------------
-- 6. EXPERIENCE — riwayat pekerjaan, ditambahkan belakangan (idempotent)
-- ---------------------------------------------------------------------

create table if not exists public.experience (
  id           uuid primary key default gen_random_uuid(),
  company      text not null,
  role_title   text not null,
  location     text default '',
  start_date   date,
  end_date     date,
  is_current   boolean not null default false,
  description  text not null default '',
  sort_order   smallint not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists experience_sort_idx on public.experience (start_date desc nulls last, sort_order asc);

drop trigger if exists experience_touch_updated_at on public.experience;
create trigger experience_touch_updated_at
  before update on public.experience
  for each row execute function public.touch_updated_at();

-- =====================================================================
--  SELESAI.
--  Langkah terakhir: buat akun admin di
--  Authentication > Users > Add user (email + password, centang auto-confirm).
-- =====================================================================
