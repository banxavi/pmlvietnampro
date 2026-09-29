-- Chạy một lần trong Supabase SQL Editor sau khi tạo project.
-- Sau đó tạo user trong Authentication và gán quyền admin ở cuối file.

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text not null default 'package',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  company text,
  service text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;
alter table public.leads enable row level security;
alter table public.profiles enable row level security;

grant select on public.services to anon, authenticated;
grant insert on public.leads to anon, authenticated;
grant select, update on public.leads to authenticated;
grant select on public.profiles to authenticated;

drop policy if exists "Public can read services" on public.services;
create policy "Public can read services"
  on public.services
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can submit a lead" on public.leads;
create policy "Anyone can submit a lead"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can read leads" on public.leads;
create policy "Admins can read leads"
  on public.leads
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads"
  on public.leads
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'leads'
  ) then
    alter publication supabase_realtime add table public.leads;
  end if;
end $$;

insert into public.services (title, description, icon, sort_order)
select *
from (
  values
    (
      'Cung ứng nguyên liệu',
      'Nhập và cung cấp nguyên liệu cho thực phẩm, mỹ phẩm, thực phẩm chức năng và dược, kèm hồ sơ kỹ thuật của nhà sản xuất.',
      'package',
      1
    ),
    (
      'Giải pháp xuất khẩu',
      'Mở đường hàng hóa Việt Nam ra thị trường ngoài nước: nhu cầu thị trường, đối tác và điều phối giao nhận.',
      'ship',
      2
    ),
    (
      'Kết nối sản xuất',
      'Tìm nhà máy gia công đúng năng lực, thống nhất công thức và theo dõi tiến độ sản xuất.',
      'factory',
      3
    )
) as seed(title, description, icon, sort_order)
where not exists (select 1 from public.services);

-- Sau khi tạo user trong Authentication > Users, thay USER_UUID rồi chạy:
-- insert into public.profiles (id, role)
-- values ('USER_UUID', 'admin')
-- on conflict (id) do update set role = 'admin';
