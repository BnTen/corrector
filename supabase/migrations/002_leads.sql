-- Lead capture for acquisition funnel (email gate on /try)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'try_gate',
  credits_granted integer not null default 30,
  created_at timestamptz not null default now(),
  constraint leads_email_unique unique (email)
);

create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

alter table public.leads enable row level security;

-- No public policies: inserts/reads go through service role in API routes only.
