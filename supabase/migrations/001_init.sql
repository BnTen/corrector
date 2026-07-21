-- Text Corrector initial schema
create extension if not exists "pgcrypto";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  locale_pref text not null default 'fr',
  created_at timestamptz not null default now()
);

-- Documents
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null default 'Sans titre',
  content text not null default '',
  lang text not null default 'fr',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Error events (lint history)
create table if not exists public.error_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  document_id uuid references public.documents (id) on delete set null,
  rule_id text,
  category text not null,
  message text not null,
  context_snippet text,
  original text,
  replacement text,
  accepted boolean not null default false,
  created_at timestamptz not null default now()
);

-- Aggregated user stats
create table if not exists public.user_stats (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  total_checks integer not null default 0,
  total_errors integer not null default 0,
  accuracy_score numeric,
  by_category jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Quiz attempts
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  exercise_type text not null,
  category text,
  correct boolean not null default false,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists error_events_user_created_idx
  on public.error_events (user_id, created_at desc);

create index if not exists error_events_user_category_idx
  on public.error_events (user_id, category);

create index if not exists documents_user_updated_idx
  on public.documents (user_id, updated_at desc);

create index if not exists quiz_attempts_user_created_idx
  on public.quiz_attempts (user_id, created_at desc);

-- RLS
alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.error_events enable row level security;
alter table public.user_stats enable row level security;
alter table public.quiz_attempts enable row level security;

-- Profiles policies
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Documents policies
create policy "documents_select_own"
  on public.documents for select
  using (auth.uid() = user_id);

create policy "documents_insert_own"
  on public.documents for insert
  with check (auth.uid() = user_id);

create policy "documents_update_own"
  on public.documents for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "documents_delete_own"
  on public.documents for delete
  using (auth.uid() = user_id);

-- Error events policies
create policy "error_events_select_own"
  on public.error_events for select
  using (auth.uid() = user_id);

create policy "error_events_insert_own"
  on public.error_events for insert
  with check (auth.uid() = user_id);

create policy "error_events_update_own"
  on public.error_events for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "error_events_delete_own"
  on public.error_events for delete
  using (auth.uid() = user_id);

-- User stats policies
create policy "user_stats_select_own"
  on public.user_stats for select
  using (auth.uid() = user_id);

create policy "user_stats_update_own"
  on public.user_stats for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user_stats_insert_own"
  on public.user_stats for insert
  with check (auth.uid() = user_id);

-- Quiz attempts policies
create policy "quiz_attempts_select_own"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

create policy "quiz_attempts_insert_own"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

create policy "quiz_attempts_delete_own"
  on public.quiz_attempts for delete
  using (auth.uid() = user_id);

-- Auto-create profile + stats on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, locale_pref)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'locale_pref', 'fr')
  )
  on conflict (id) do nothing;

  insert into public.user_stats (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
