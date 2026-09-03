alter table public.clients
  add column if not exists recurring_amount numeric(12,2) not null default 0
  check (recurring_amount >= 0);

alter table public.invoices
  add column if not exists recurring_amount numeric(12,2) not null default 0
  check (recurring_amount >= 0),
  add column if not exists extras jsonb not null default '[]'::jsonb;

alter table public.invoices
  drop constraint if exists invoices_extras_is_array,
  add constraint invoices_extras_is_array check (jsonb_typeof(extras) = 'array');

alter table public.invoices drop constraint if exists invoices_status_check;

update public.invoices
set
  recurring_amount = amount,
  status = case
    when status = 'pending_send' and invoice_path is null then 'pending_creation'
    when status = 'pending_send' then 'ready'
    else status
  end;

alter table public.invoices
  alter column status set default 'pending_creation',
  add constraint invoices_status_check
  check (status in ('pending_creation', 'ready', 'sent', 'paid'));
