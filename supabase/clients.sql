-- Bảng khách hàng và cột gắn yêu cầu. Đã áp dụng trên project PMLWeb Pro.

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  site text not null,
  note text,
  created_at timestamptz not null default now()
);

alter table public.leads
  add column if not exists client_id uuid references public.clients (id);

create index if not exists leads_client_id_idx on public.leads (client_id);

alter table public.clients enable row level security;

grant select on public.clients to anon, authenticated;
grant insert, update, delete on public.clients to authenticated;

drop policy if exists "Public can read clients" on public.clients;
create policy "Public can read clients"
  on public.clients
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins manage clients" on public.clients;
create policy "Admins manage clients"
  on public.clients
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into public.clients (slug, name, site, note)
values
  ('kh1', 'Quản lý web - khách hàng 1', 'Website doanh nghiệp của khách hàng 1', 'Yêu cầu tư vấn chỉ thuộc khách hàng 1.'),
  ('kh2', 'Quản lý web - khách hàng 2', 'Website doanh nghiệp của khách hàng 2', 'Yêu cầu tư vấn chỉ thuộc khách hàng 2.'),
  ('kh3', 'Quản lý web - khách hàng 3', 'Website doanh nghiệp của khách hàng 3', 'Yêu cầu tư vấn chỉ thuộc khách hàng 3.')
on conflict (slug) do update
set name = excluded.name,
    site = excluded.site,
    note = excluded.note;
