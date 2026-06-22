# Panduan Fast Track 30 Hari Membuka Peluang Jodoh

Starter project ini dibangun untuk:
- Next.js App Router
- Supabase Auth + PostgreSQL
- Netlify deployment
- Access control berbasis admin approval

## Fitur Phase 1
- Landing page premium
- Login / register
- Pending access gate
- Dashboard shell
- Admin panel dasar
- Supabase SQL schema + trigger
- Responsive desktop & mobile

## Setup cepat

1. Buat project Supabase
2. Jalankan SQL migration di Supabase SQL Editor, berurutan satu per satu (jangan digabung dalam satu kali run, karena migration 002 mengubah enum yang langsung dipakai migration 004):
   - `supabase/migrations/001_init.sql`
   - `supabase/migrations/002_candidate_pillars.sql`
   - `supabase/migrations/003_seed_program_days.sql`
   - `supabase/migrations/004_seed_questions.sql`
   - `supabase/migrations/005_profiles_email.sql`
3. Copy `.env.example` menjadi `.env.local`
4. Isi:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Install dependency:
   ```bash
   npm install
   ```
6. Jalankan lokal:
   ```bash
   npm run dev
   ```

## Deploy ke Netlify
- Push project ini ke GitHub (atau GitLab/Bitbucket)
- Di Netlify: "Add new site" → "Import an existing project" → pilih repo ini
- Netlify akan otomatis mendeteksi `netlify.toml` di root project ini, yang sudah berisi:
  - Build command: `npm run build`
  - Plugin `@netlify/plugin-nextjs` (wajib untuk Next.js App Router dengan middleware & server actions — Netlify akan otomatis menjalankannya sebagai Netlify Functions)
- Set Environment Variables di Netlify (Site settings → Environment variables):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL` (URL Netlify kamu, misal `https://nama-site.netlify.app`, dipakai untuk redirect Google OAuth)
- Klik Deploy. Tidak perlu setting "Publish directory" secara manual — plugin yang menentukan ini otomatis.

## Catatan
- Semua user baru berstatus `pending`
- Admin harus mengaktifkan akses agar fitur premium terbuka
- Profile dibuat otomatis lewat trigger pada tabel `auth.users`


## Important routes
- `/` landing page
- `/register` sign up
- `/login` sign in
- `/pending-access` waiting room
- `/dashboard` protected dashboard
- `/admin` admin dashboard
- `/admin/users` user management
