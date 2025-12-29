-- Rival Eats Supabase schema (Phase 1)
-- Run in Supabase SQL editor or CLI after replacing placeholders as needed.

-- Menu items: used for the Menu page (public read).
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name text not null,
  description text not null,
  section text not null check (section in ('breakfast', 'dinner')),
  price numeric(10,2),
  image_url text,
  tags text[]
);

-- Track when the menu was last published.
create table if not exists public.menu_updates (
  id uuid primary key default gen_random_uuid(),
  published_at timestamptz not null default now(),
  notes text
);

-- Weekly menu signup list.
create table if not exists public.menu_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text not null,
  phone text,
  contact_preference text not null default 'email',
  sms_consent boolean default false,
  source text default 'web'
);

-- Orders captured from the Order page.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  full_name text not null,
  email text not null,
  phone text,
  contact_preference text not null default 'email',
  sms_consent boolean default false,
  fulfillment text not null check (fulfillment in ('delivery', 'pickup')),
  delivery_day text check (delivery_day in ('sunday', 'monday')),
  time_window text not null,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  county text,
  allergies text,
  dietary_preferences text,
  notes text,
  base_price numeric(10,2) not null default 79.99,
  delivery_fee numeric(10,2) not null default 0,
  outside_zone_fee numeric(10,2) not null default 0,
  outside_zone_accepted boolean not null default false,
  after_cutoff boolean default false,
  schedule_next_window boolean default false,
  submission_source text default 'web'
);

-- Indexes for admin querying.
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_menu_items_section on public.menu_items(section);

-- Row Level Security
alter table public.menu_items enable row level security;
alter table public.menu_signups enable row level security;
alter table public.orders enable row level security;

-- Policies
create policy "Public read menu items" on public.menu_items
  for select using (true);

create policy "Allow menu inserts via service role" on public.menu_items
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "Public can submit signups" on public.menu_signups
  for insert with check (true);

create policy "Service role can manage signups" on public.menu_signups
  for all using (auth.role() = 'service_role');

create policy "Public can submit orders" on public.orders
  for insert with check (true);

create policy "Service role can read orders" on public.orders
  for select using (auth.role() = 'service_role');

-- Storage bucket for menu images (optional)
-- Execute once:
-- select storage.create_bucket('menu-images', public => true);
-- To limit writes to service role only:
-- select storage.set_bucket_public('menu-images', true);
-- create policy "Public read menu images" on storage.objects for select using (bucket_id = 'menu-images');
-- create policy "Service role writes menu images" on storage.objects for insert with check (bucket_id = 'menu-images' and auth.role() = 'service_role');
