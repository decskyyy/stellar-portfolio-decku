# Stellar Portfolio

Portfolio pribadi dengan panel admin terintegrasi. Halaman publik mengambil data langsung dari Supabase, semua isinya dikelola lewat `/admin` tanpa menyentuh kode.

Stack: Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Supabase (Auth, Postgres, Storage) · sonner (toast)

Dua bahasa visual yang sengaja dipisah:
- **Situs publik** — dark editorial yang ringkas: halaman terpisah untuk beranda, proyek, pengalaman, keahlian, dan kontak; tiap proyek punya halaman detail sendiri. Diagram fokus empat lingkaran merespons hover/fokus pada foto tengah. Dock desktop, jam/tanggal lokal, ukuran layar, dan menu mobile melengkapi navigasi.
- **Panel admin** — clean & minimal, sengaja tanpa ornamen: sidebar netral, latar putih/abu-abu, satu aksen indigo, notifikasi toast saat simpan/hapus.

---

## 1. Siapkan Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor** → **New query** → tempel seluruh isi `supabase/schema.sql` → **Run**.
   Skrip ini membuat tabel `profile`, `skills`, `projects`, mengaktifkan RLS, membuat bucket storage `portfolio-assets`, dan mengisi data awal.
3. Buat akun admin: **Authentication** → **Users** → **Add user** → isi email + password, centang *Auto Confirm User*.
   Tidak ada halaman pendaftaran publik — akun hanya dibuat dari dashboard ini.
4. Salin kredensial dari **Project Settings** → **API**: `Project URL` dan `anon public key`.

## 2. Jalankan di lokal

```bash
cp .env.local.example .env.local   # lalu isi URL + anon key
npm install
npm run dev
```

- Portfolio publik: http://localhost:3000
- Panel admin: http://localhost:3000/admin

## 3. Variabel lingkungan

| Variabel | Wajib | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ya | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ya | Anon public key |
| `NEXT_PUBLIC_ADMIN_EMAIL` | tidak | Kalau diisi, hanya email ini yang boleh masuk `/admin` meski ada akun Supabase lain |

## 4. Deploy ke Vercel

1. Push ke GitHub, lalu **Import Project** di Vercel.
2. Tambahkan ketiga variabel di atas pada **Environment Variables**.
3. Deploy. Tidak ada langkah build tambahan.
4. Di Supabase → **Authentication** → **URL Configuration**, tambahkan domain Vercel ke *Site URL* dan *Redirect URLs*.

---

## Struktur

```
src/
├─ app/
│  ├─ page.tsx                     Beranda portfolio
│  ├─ projects/                    Daftar proyek dan halaman detail tiap proyek
│  ├─ experience/page.tsx          Halaman pengalaman
│  ├─ skills/page.tsx              Halaman keahlian
│  ├─ contact/page.tsx             Halaman kontak
│  ├─ layout.tsx                   Font, metadata Open Graph, skip link
│  ├─ globals.css                  Gaya publik dan komponen panel admin
│  └─ admin/
│     ├─ login/page.tsx            Login email + password
│     └─ (dashboard)/              Area terkunci: ringkasan, proyek, profil, keahlian
├─ components/
│  ├─ site/                        Hero, About, Skills, ProjectCard, StarRating, Backdrop
│  └─ admin/                       ProjectManager, ProfileForm, SkillManager, AdminNav
├─ lib/supabase/                   Client browser, server, dan middleware
└─ middleware.ts                   Kunci /admin, refresh sesi
supabase/schema.sql                Skema, RLS, storage, data awal
```

## Cara kerja keamanan

- Row Level Security aktif di ketiga tabel: siapa pun boleh **membaca** (halaman publik butuh ini), hanya user terautentikasi yang boleh menulis, mengubah, dan menghapus.
- Bucket `portfolio-assets` publik untuk dibaca, upload dan hapus hanya untuk user login.
- `middleware.ts` mengalihkan setiap kunjungan ke `/admin/*` tanpa sesi valid ke halaman login, sekaligus merefresh token Supabase.
- Anon key memang aman dipakai di browser — RLS yang menjaga datanya. Jangan pernah menaruh `service_role` key di project ini.

## Catatan pemakaian

- **Rating** dipakai sebagai indikator rarity 5-bintang di kartu proyek; klik bintangnya di form admin untuk mengatur.
- **Tandai unggulan** mengubah warna bingkai kartu jadi oranye dan menaikkannya ke urutan teratas.
- **Urutan tampil** angka kecil tampil lebih dulu.
- **Teknologi** diketik dipisah koma, otomatis jadi chip di kartu.
- Gambar diunggah ke Supabase Storage; URL publiknya disimpan di kolom `image_url`.
- Nomor WhatsApp di profil otomatis jadi tautan `wa.me` — tulis `08…`, konversi ke `62…` ditangani kode.
- Setelah menyimpan di admin, halaman utama langsung ikut berubah (`dynamic = 'force-dynamic'`, tanpa cache).

## Menyesuaikan tema

Palet tersedia di `tailwind.config.ts`. Lebar kolom, latar, dan pemisah bagian situs publik ada di `src/app/globals.css`; komponen per bagian berada di `src/components/site/`. Gaya panel admin di file CSS yang sama tetap terpisah.
