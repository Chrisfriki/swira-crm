create extension if not exists pgcrypto;

create table if not exists public.clients (
  id text primary key,
  name text not null,
  type text not null default 'external',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id text primary key,
  title text not null,
  description text not null default '',
  client_id text not null references public.clients(id) on delete cascade,
  assignees text[] not null default '{}',
  urgency smallint not null default 3 check (urgency between 1 and 5),
  importance smallint not null default 3 check (importance between 1 and 5),
  due_date date,
  start_time time,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'fire', 'done')),
  estimated_time text,
  quantity text,
  people smallint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  client_id text not null references public.clients(id) on delete cascade,
  billing_month date not null,
  invoice_number text,
  amount numeric(12,2) not null default 0 check (amount >= 0),
  due_date date,
  status text not null default 'pending_send' check (status in ('pending_send', 'sent', 'paid')),
  invoice_path text,
  invoice_name text,
  receipt_path text,
  receipt_name text,
  sent_at timestamptz,
  paid_at timestamptz,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, billing_month)
);

create index if not exists tasks_client_id_idx on public.tasks(client_id);
create index if not exists tasks_due_date_idx on public.tasks(due_date);
create index if not exists invoices_client_id_idx on public.invoices(client_id);
create index if not exists invoices_billing_month_idx on public.invoices(billing_month desc);
create index if not exists invoices_status_idx on public.invoices(status);

alter table public.clients enable row level security;
alter table public.tasks enable row level security;
alter table public.invoices enable row level security;

grant select, insert, update, delete on public.clients to anon, authenticated;
grant select, insert, update, delete on public.tasks to anon, authenticated;
grant select, insert, update, delete on public.invoices to anon, authenticated;

drop policy if exists "temporary public clients access" on public.clients;
create policy "temporary public clients access" on public.clients for all to anon, authenticated using (true) with check (true);
drop policy if exists "temporary public tasks access" on public.tasks;
create policy "temporary public tasks access" on public.tasks for all to anon, authenticated using (true) with check (true);
drop policy if exists "temporary public invoices access" on public.invoices;
create policy "temporary public invoices access" on public.invoices for all to anon, authenticated using (true) with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'billing-documents',
  'billing-documents',
  false,
  10485760,
  array['application/pdf', 'image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "temporary public billing select" on storage.objects;
create policy "temporary public billing select" on storage.objects for select to anon, authenticated using (bucket_id = 'billing-documents');
drop policy if exists "temporary public billing insert" on storage.objects;
create policy "temporary public billing insert" on storage.objects for insert to anon, authenticated with check (bucket_id = 'billing-documents');
drop policy if exists "temporary public billing update" on storage.objects;
create policy "temporary public billing update" on storage.objects for update to anon, authenticated using (bucket_id = 'billing-documents') with check (bucket_id = 'billing-documents');
drop policy if exists "temporary public billing delete" on storage.objects;
create policy "temporary public billing delete" on storage.objects for delete to anon, authenticated using (bucket_id = 'billing-documents');
