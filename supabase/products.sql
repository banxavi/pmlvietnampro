-- Sản phẩm của từng khách hàng, gắn vào yêu cầu mẫu đã có trên project.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  name text not null,
  summary text,
  created_at timestamptz not null default now(),
  unique (client_id, name)
);

alter table public.leads
  add column if not exists product_id uuid references public.products (id);

alter table public.leads
  add column if not exists is_sample boolean not null default false;
