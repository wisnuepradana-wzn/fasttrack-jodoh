-- =========================================================
-- Migration 005: Tambah kolom email di profiles
-- =========================================================
-- Email disimpan di profiles supaya admin bisa melihatnya
-- tanpa perlu service role key untuk query ke auth.users.
-- Kolom ini diisi otomatis oleh trigger handle_new_user
-- saat user baru mendaftar.

alter table public.profiles add column if not exists email text;

-- Update trigger agar menyimpan email juga saat user baru dibuat
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, username, gender, role, access_status, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email, 'User'),
    coalesce(new.raw_user_meta_data->>'username', null),
    coalesce(nullif(new.raw_user_meta_data->>'gender', '')::public.gender, null),
    'user',
    'pending',
    new.email
  )
  on conflict (id) do update set
    email = excluded.email;
  return new;
end;
$$;

-- Isi email untuk profil yang sudah ada (dari auth.users)
-- Jalankan sekali untuk backfill data existing
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and p.email is null;
