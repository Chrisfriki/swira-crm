alter table public.clients
  add column if not exists is_active boolean not null default true,
  add column if not exists vat_enabled boolean not null default false,
  add column if not exists vat_rate numeric(5,2) not null default 21
  check (vat_rate >= 0 and vat_rate <= 100);

alter table public.invoices
  add column if not exists vat_enabled boolean not null default false,
  add column if not exists vat_rate numeric(5,2) not null default 21
  check (vat_rate >= 0 and vat_rate <= 100);

create index if not exists clients_is_active_idx on public.clients(is_active);
