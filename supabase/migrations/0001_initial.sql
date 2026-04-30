create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  is_owner boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.config_drafts (
  id uuid primary key default gen_random_uuid(),
  draft_key text not null unique default 'main',
  config jsonb not null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.config_versions (
  id uuid primary key default gen_random_uuid(),
  version integer not null unique,
  config jsonb not null,
  status text not null default 'superseded' check (status in ('active', 'superseded')),
  published_by uuid references auth.users(id) on delete set null,
  published_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists config_drafts_touch_updated_at on public.config_drafts;
create trigger config_drafts_touch_updated_at
before update on public.config_drafts
for each row execute function public.touch_updated_at();

create or replace function public.is_config_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and is_owner = true
  );
$$;

alter table public.admin_users enable row level security;
alter table public.config_drafts enable row level security;
alter table public.config_versions enable row level security;
alter table public.audit_events enable row level security;

drop policy if exists "admins can read admin users" on public.admin_users;
create policy "admins can read admin users"
on public.admin_users for select
to authenticated
using (public.is_config_admin());

drop policy if exists "admins can manage drafts" on public.config_drafts;
create policy "admins can manage drafts"
on public.config_drafts for all
to authenticated
using (public.is_config_admin())
with check (public.is_config_admin());

drop policy if exists "public can read active config versions" on public.config_versions;
create policy "public can read active config versions"
on public.config_versions for select
to anon, authenticated
using (status = 'active');

drop policy if exists "admins can manage config versions" on public.config_versions;
create policy "admins can manage config versions"
on public.config_versions for all
to authenticated
using (public.is_config_admin())
with check (public.is_config_admin());

drop policy if exists "admins can read audit events" on public.audit_events;
create policy "admins can read audit events"
on public.audit_events for select
to authenticated
using (public.is_config_admin());

drop policy if exists "admins can create audit events" on public.audit_events;
create policy "admins can create audit events"
on public.audit_events for insert
to authenticated
with check (public.is_config_admin());

create index if not exists config_versions_status_published_at_idx
on public.config_versions (status, published_at desc);

create index if not exists audit_events_created_at_idx
on public.audit_events (created_at desc);

-- Bootstrap after creating your Supabase Auth user:
-- insert into public.admin_users (email, is_owner)
-- values ('you@example.com', true)
-- on conflict (email) do update set is_owner = true;
