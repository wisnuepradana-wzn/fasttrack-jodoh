-- =========================================================
-- Fast Track Jodoh MVP - Supabase schema
-- =========================================================

create extension if not exists "pgcrypto";

-- -------------------------
-- ENUMS
-- -------------------------
do $$ begin
  create type public.gender as enum ('male', 'female');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.user_role as enum ('user', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.access_status as enum ('pending', 'active', 'suspended');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.assessment_type as enum ('self', 'candidate');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.assessment_status as enum ('in_progress', 'completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.program_status as enum ('not_started', 'active', 'completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.candidate_status as enum ('active', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.export_type as enum ('assessment', 'candidate', 'comparison');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.admin_action_type as enum ('activate', 'suspend', 'reactivate');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.pillar_key as enum ('personal', 'relational', 'opportunity', 'compatibility', 'readiness');
exception when duplicate_object then null; end $$;

-- -------------------------
-- updated_at helper
-- -------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -------------------------
-- profiles
-- -------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  username text unique,
  gender public.gender,
  role public.user_role not null default 'user',
  access_status public.access_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- auto-create profile when auth user is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, username, gender, role, access_status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email, 'User'),
    coalesce(new.raw_user_meta_data->>'username', null),
    coalesce(nullif(new.raw_user_meta_data->>'gender', '')::public.gender, null),
    'user',
    'pending'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- -------------------------
-- assessment_templates
-- -------------------------
create table if not exists public.assessment_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  type public.assessment_type not null,
  description text,
  version text not null default 'v1',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- -------------------------
-- assessment_questions
-- -------------------------
create table if not exists public.assessment_questions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.assessment_templates(id) on delete cascade,
  pillar public.pillar_key not null,
  question_text text not null,
  weight numeric(10,2) not null default 1,
  order_index integer not null,
  min_value integer not null default 1,
  max_value integer not null default 5,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_assessment_questions_template on public.assessment_questions(template_id);
create index if not exists idx_assessment_questions_pillar on public.assessment_questions(pillar);

-- -------------------------
-- candidates
-- -------------------------
create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  display_name text not null,
  gender public.gender,
  notes text,
  status public.candidate_status not null default 'active',
  latest_score numeric(10,2),
  last_evaluated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_candidates_updated_at on public.candidates;
create trigger trg_candidates_updated_at
before update on public.candidates
for each row execute function public.set_updated_at();

create index if not exists idx_candidates_user_id on public.candidates(user_id);

-- -------------------------
-- assessment_sessions
-- -------------------------
create table if not exists public.assessment_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  template_id uuid not null references public.assessment_templates(id) on delete restrict,
  session_name text,
  candidate_id uuid references public.candidates(id) on delete set null,
  status public.assessment_status not null default 'in_progress',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_assessment_sessions_user_id on public.assessment_sessions(user_id);
create index if not exists idx_assessment_sessions_template_id on public.assessment_sessions(template_id);
create index if not exists idx_assessment_sessions_candidate_id on public.assessment_sessions(candidate_id);

-- -------------------------
-- assessment_answers
-- -------------------------
create table if not exists public.assessment_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.assessment_sessions(id) on delete cascade,
  question_id uuid not null references public.assessment_questions(id) on delete cascade,
  answer_value integer not null check (answer_value between 1 and 5),
  created_at timestamptz not null default now(),
  unique (session_id, question_id)
);

create index if not exists idx_assessment_answers_session_id on public.assessment_answers(session_id);

-- -------------------------
-- assessment_results
-- -------------------------
create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.assessment_sessions(id) on delete cascade,
  total_score numeric(10,2) not null,
  pillar_scores jsonb not null default '{}'::jsonb,
  recommendation_summary text,
  recommendation_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- -------------------------
-- program_days
-- -------------------------
create table if not exists public.program_days (
  id uuid primary key default gen_random_uuid(),
  day_number integer not null unique check (day_number between 1 and 30),
  week_number integer not null check (week_number between 1 and 5),
  title text not null,
  objective text not null,
  content text not null,
  action_items jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- -------------------------
-- user_program_progress
-- -------------------------
create table if not exists public.user_program_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  current_day integer not null default 1 check (current_day between 1 and 30),
  progress_percent numeric(5,2) not null default 0,
  status public.program_status not null default 'not_started',
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_user_program_progress_updated_at on public.user_program_progress;
create trigger trg_user_program_progress_updated_at
before update on public.user_program_progress
for each row execute function public.set_updated_at();

-- -------------------------
-- program_day_completions
-- -------------------------
create table if not exists public.program_day_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  day_id uuid not null references public.program_days(id) on delete cascade,
  is_completed boolean not null default false,
  notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, day_id)
);

create index if not exists idx_program_day_completions_user_id on public.program_day_completions(user_id);

-- -------------------------
-- badges
-- -------------------------
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text not null,
  icon text,
  created_at timestamptz not null default now()
);

-- -------------------------
-- user_badges
-- -------------------------
create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

-- -------------------------
-- pdf_exports
-- -------------------------
create table if not exists public.pdf_exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  export_type public.export_type not null,
  reference_id uuid,
  file_url text not null,
  created_at timestamptz not null default now()
);

-- -------------------------
-- admin_actions
-- -------------------------
create table if not exists public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id) on delete cascade,
  target_user_id uuid not null references public.profiles(id) on delete cascade,
  action_type public.admin_action_type not null,
  notes text,
  created_at timestamptz not null default now()
);

-- -------------------------
-- RLS
-- -------------------------
alter table public.profiles enable row level security;
alter table public.assessment_templates enable row level security;
alter table public.assessment_questions enable row level security;
alter table public.assessment_sessions enable row level security;
alter table public.assessment_answers enable row level security;
alter table public.assessment_results enable row level security;
alter table public.candidates enable row level security;
alter table public.program_days enable row level security;
alter table public.user_program_progress enable row level security;
alter table public.program_day_completions enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.pdf_exports enable row level security;
alter table public.admin_actions enable row level security;

-- helper functions for RLS
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.is_active_user()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.access_status = 'active'
  );
$$;

-- profiles
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "profiles_admin_update_any" on public.profiles;
create policy "profiles_admin_update_any"
on public.profiles for update
using (public.is_admin())
with check (public.is_admin());

-- assessment_templates
drop policy if exists "templates_select_active" on public.assessment_templates;
create policy "templates_select_active"
on public.assessment_templates for select
using (is_active = true and public.is_active_user());

drop policy if exists "templates_admin_all" on public.assessment_templates;
create policy "templates_admin_all"
on public.assessment_templates for all
using (public.is_admin())
with check (public.is_admin());

-- assessment_questions
drop policy if exists "questions_select_active" on public.assessment_questions;
create policy "questions_select_active"
on public.assessment_questions for select
using (is_active = true and public.is_active_user());

drop policy if exists "questions_admin_all" on public.assessment_questions;
create policy "questions_admin_all"
on public.assessment_questions for all
using (public.is_admin())
with check (public.is_admin());

-- assessment_sessions
drop policy if exists "sessions_select_own" on public.assessment_sessions;
create policy "sessions_select_own"
on public.assessment_sessions for select
using (user_id = auth.uid() and public.is_active_user());

drop policy if exists "sessions_insert_own" on public.assessment_sessions;
create policy "sessions_insert_own"
on public.assessment_sessions for insert
with check (user_id = auth.uid() and public.is_active_user());

drop policy if exists "sessions_update_own" on public.assessment_sessions;
create policy "sessions_update_own"
on public.assessment_sessions for update
using (user_id = auth.uid() and public.is_active_user())
with check (user_id = auth.uid() and public.is_active_user());

drop policy if exists "sessions_admin_all" on public.assessment_sessions;
create policy "sessions_admin_all"
on public.assessment_sessions for all
using (public.is_admin())
with check (public.is_admin());

-- assessment_answers
drop policy if exists "answers_select_own" on public.assessment_answers;
create policy "answers_select_own"
on public.assessment_answers for select
using (
  exists (
    select 1 from public.assessment_sessions s
    where s.id = session_id and s.user_id = auth.uid()
  ) and public.is_active_user()
);

drop policy if exists "answers_insert_own" on public.assessment_answers;
create policy "answers_insert_own"
on public.assessment_answers for insert
with check (
  exists (
    select 1 from public.assessment_sessions s
    where s.id = session_id and s.user_id = auth.uid()
  ) and public.is_active_user()
);

drop policy if exists "answers_update_own" on public.assessment_answers;
create policy "answers_update_own"
on public.assessment_answers for update
using (
  exists (
    select 1 from public.assessment_sessions s
    where s.id = session_id and s.user_id = auth.uid()
  ) and public.is_active_user()
)
with check (
  exists (
    select 1 from public.assessment_sessions s
    where s.id = session_id and s.user_id = auth.uid()
  ) and public.is_active_user()
);

drop policy if exists "answers_admin_all" on public.assessment_answers;
create policy "answers_admin_all"
on public.assessment_answers for all
using (public.is_admin())
with check (public.is_admin());

-- assessment_results
drop policy if exists "results_select_own" on public.assessment_results;
create policy "results_select_own"
on public.assessment_results for select
using (
  exists (
    select 1 from public.assessment_sessions s
    where s.id = session_id and s.user_id = auth.uid()
  ) and public.is_active_user()
);

drop policy if exists "results_admin_all" on public.assessment_results;
create policy "results_admin_all"
on public.assessment_results for all
using (public.is_admin())
with check (public.is_admin());

-- candidates
drop policy if exists "candidates_select_own" on public.candidates;
create policy "candidates_select_own"
on public.candidates for select
using (user_id = auth.uid() and public.is_active_user());

drop policy if exists "candidates_insert_own" on public.candidates;
create policy "candidates_insert_own"
on public.candidates for insert
with check (user_id = auth.uid() and public.is_active_user());

drop policy if exists "candidates_update_own" on public.candidates;
create policy "candidates_update_own"
on public.candidates for update
using (user_id = auth.uid() and public.is_active_user())
with check (user_id = auth.uid() and public.is_active_user());

drop policy if exists "candidates_delete_own" on public.candidates;
create policy "candidates_delete_own"
on public.candidates for delete
using (user_id = auth.uid() and public.is_active_user());

drop policy if exists "candidates_admin_all" on public.candidates;
create policy "candidates_admin_all"
on public.candidates for all
using (public.is_admin())
with check (public.is_admin());

-- program_days
drop policy if exists "program_days_select_active" on public.program_days;
create policy "program_days_select_active"
on public.program_days for select
using (is_active = true and public.is_active_user());

drop policy if exists "program_days_admin_all" on public.program_days;
create policy "program_days_admin_all"
on public.program_days for all
using (public.is_admin())
with check (public.is_admin());

-- progress
drop policy if exists "progress_select_own" on public.user_program_progress;
create policy "progress_select_own"
on public.user_program_progress for select
using (user_id = auth.uid() and public.is_active_user());

drop policy if exists "progress_insert_own" on public.user_program_progress;
create policy "progress_insert_own"
on public.user_program_progress for insert
with check (user_id = auth.uid() and public.is_active_user());

drop policy if exists "progress_update_own" on public.user_program_progress;
create policy "progress_update_own"
on public.user_program_progress for update
using (user_id = auth.uid() and public.is_active_user())
with check (user_id = auth.uid() and public.is_active_user());

drop policy if exists "progress_admin_all" on public.user_program_progress;
create policy "progress_admin_all"
on public.user_program_progress for all
using (public.is_admin())
with check (public.is_admin());

-- completions
drop policy if exists "completions_select_own" on public.program_day_completions;
create policy "completions_select_own"
on public.program_day_completions for select
using (user_id = auth.uid() and public.is_active_user());

drop policy if exists "completions_insert_own" on public.program_day_completions;
create policy "completions_insert_own"
on public.program_day_completions for insert
with check (user_id = auth.uid() and public.is_active_user());

drop policy if exists "completions_update_own" on public.program_day_completions;
create policy "completions_update_own"
on public.program_day_completions for update
using (user_id = auth.uid() and public.is_active_user())
with check (user_id = auth.uid() and public.is_active_user());

drop policy if exists "completions_admin_all" on public.program_day_completions;
create policy "completions_admin_all"
on public.program_day_completions for all
using (public.is_admin())
with check (public.is_admin());

-- badges
drop policy if exists "badges_select_active" on public.badges;
create policy "badges_select_active"
on public.badges for select
using (public.is_active_user());

drop policy if exists "badges_admin_all" on public.badges;
create policy "badges_admin_all"
on public.badges for all
using (public.is_admin())
with check (public.is_admin());

-- user_badges
drop policy if exists "user_badges_select_own" on public.user_badges;
create policy "user_badges_select_own"
on public.user_badges for select
using (user_id = auth.uid() and public.is_active_user());

drop policy if exists "user_badges_admin_all" on public.user_badges;
create policy "user_badges_admin_all"
on public.user_badges for all
using (public.is_admin())
with check (public.is_admin());

-- pdf_exports
drop policy if exists "exports_select_own" on public.pdf_exports;
create policy "exports_select_own"
on public.pdf_exports for select
using (user_id = auth.uid() and public.is_active_user());

drop policy if exists "exports_insert_own" on public.pdf_exports;
create policy "exports_insert_own"
on public.pdf_exports for insert
with check (user_id = auth.uid() and public.is_active_user());

drop policy if exists "exports_admin_all" on public.pdf_exports;
create policy "exports_admin_all"
on public.pdf_exports for all
using (public.is_admin())
with check (public.is_admin());

-- admin_actions
drop policy if exists "admin_actions_admin_only" on public.admin_actions;
create policy "admin_actions_admin_only"
on public.admin_actions for all
using (public.is_admin())
with check (public.is_admin());

-- -------------------------
-- seed data
-- -------------------------
insert into public.assessment_templates (slug, name, type, description, version)
values
  ('self-assessment-v1', 'Assessment Diri', 'self', 'Mengukur kesiapan pribadi dan peluang jodoh.', 'v1'),
  ('candidate-assessment-v1', 'Evaluasi Kandidat', 'candidate', 'Mengevaluasi kecocokan calon pasangan.', 'v1')
on conflict (slug) do nothing;

insert into public.badges (code, name, description, icon)
values
  ('first_assessment', 'Assessment Pertama', 'Berhasil menyelesaikan assessment pertama.', 'sparkles'),
  ('day_7_completed', 'Minggu 1 Selesai', 'Menyelesaikan 7 hari pertama program.', 'calendar-check'),
  ('day_14_completed', 'Minggu 2 Selesai', 'Menyelesaikan 14 hari pertama program.', 'calendar-check-2'),
  ('day_30_completed', 'Program Selesai', 'Menyelesaikan seluruh program 30 hari.', 'trophy'),
  ('candidate_created', 'Kandidat Pertama', 'Membuat kandidat pertama.', 'users'),
  ('first_pdf_export', 'Export Pertama', 'Berhasil mengekspor laporan PDF pertama.', 'file-text')
on conflict (code) do nothing;

-- NOTE: program_days and questions are intentionally left for app-side seed or later migration,
-- because the exact final copy can be refined after UI copy lock.
