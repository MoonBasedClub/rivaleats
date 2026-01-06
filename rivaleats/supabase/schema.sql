-- Rival Eats Supabase schema (Phase 1 / current)
-- Run in Supabase SQL editor or CLI after replacing placeholders as needed.

-- Menu items: used for the Menu page (public read).
create table if not exists public.menu_items (
  id uuid not null default extensions.uuid_generate_v4 (),
  name text not null,
  description text null,
  price numeric(10, 2) null,
  category public.menu_category_enum not null,
  image_url text null,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  constraint menu_items_pkey primary key (id)
) tablespace pg_default;

create index if not exists menu_items_category_active_idx
  on public.menu_items using btree (category, is_active) tablespace pg_default;

-- Analytics events (Phase 1 tracking).
create table if not exists public.analytics_events (
  id uuid not null default extensions.uuid_generate_v4 (),
  event_type text not null,
  metadata jsonb null,
  created_at timestamp with time zone not null default now(),
  constraint analytics_events_pkey primary key (id)
) tablespace pg_default;

-- Weekly menu signup list.
create table if not exists public.subscribers (
  id uuid not null default extensions.uuid_generate_v4 (),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text null,
  contact_preference public.contact_preference_enum not null default 'email'::contact_preference_enum,
  sms_consent boolean not null default false,
  created_at timestamp with time zone not null default now(),
  constraint subscribers_pkey primary key (id)
) tablespace pg_default;

create unique index if not exists subscribers_email_idx
  on public.subscribers using btree (lower(email)) tablespace pg_default;

-- Orders captured from checkout (item-based ordering).
create table if not exists public.orders (
  id uuid not null default extensions.uuid_generate_v4 (),
  customer_name text not null,
  email text not null,
  phone text null,
  contact_preference public.contact_preference_enum not null default 'email'::contact_preference_enum,
  sms_consent boolean not null default false,
  delivery_type public.delivery_type_enum not null,
  address_line1 text null,
  address_line2 text null,
  city text null,
  state text null,
  zip text null,
  delivery_day public.delivery_day_enum not null,
  time_window text not null,
  allergies text[] null,
  allergy_notes text null,
  dietary_preferences text[] null,
  spice_level public.spice_level_enum null,
  notes text null,
  cart_items jsonb not null default '[]'::jsonb,
  package_price numeric(10, 2) not null default 0,
  delivery_fee numeric(10, 2) not null default 0,
  out_of_zone_fee numeric(10, 2) not null default 0,
  outside_zone_accepted boolean not null default false,
  total_price numeric(10, 2) not null default 0,
  is_late_order boolean not null default false,
  scheduled_week_start date not null,
  submission_source text not null default 'web',
  created_at timestamp with time zone not null default now(),
  constraint orders_pkey primary key (id),
  constraint orders_delivery_address_required check (
    (
      (delivery_type = 'pickup'::delivery_type_enum)
      or (
        (address_line1 is not null)
        and (city is not null)
        and (state is not null)
        and (zip is not null)
      )
    )
  )
) tablespace pg_default;

create index if not exists orders_created_at_idx
  on public.orders using btree (created_at) tablespace pg_default;

create index if not exists orders_email_idx
  on public.orders using btree (lower(email)) tablespace pg_default;

-- Row Level Security
alter table public.menu_items enable row level security;
alter table public.subscribers enable row level security;
alter table public.orders enable row level security;

-- Policies
create policy "Public read menu items" on public.menu_items
  for select using (true);

create policy "Admins can manage menu" on public.menu_items
  for all using (
    auth.role() = 'service_role'
    or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  with check (
    auth.role() = 'service_role'
    or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

create policy "Public can submit signups" on public.subscribers
  for insert with check (true);

create policy "Admins can manage signups" on public.subscribers
  for all using (
    auth.role() = 'service_role'
    or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

create policy "Public can submit orders" on public.orders
  for insert with check (true);

create policy "Admins can read orders" on public.orders
  for select using (
    auth.role() = 'service_role'
    or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
