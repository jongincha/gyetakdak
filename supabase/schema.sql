-- Run this once against your Supabase project to enable DB-backed inquiry storage.
-- Without it, the app falls back to a local JSON file (dev only, non-persistent in prod).

create table if not exists public.inquiries (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  region text not null,
  store text not null,
  budget text not null,
  channel text,
  memo text,
  ip text not null,
  user_agent text not null,
  device text not null,
  utm_source text,
  utm_medium text,
  utm_campaign text
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);

alter table public.inquiries enable row level security;

-- The app writes/reads via the Supabase service role key (server-side only),
-- which bypasses RLS, so no public policies are defined here on purpose.
