begin;

create schema if not exists private;

revoke all on schema private from public, anon, authenticated;
grant usage on schema public to anon, authenticated, service_role;

alter default privileges for role postgres in schema public
  revoke select, insert, update, delete on tables from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke usage, select on sequences from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated, service_role;

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.set_updated_at() from public, anon, authenticated, service_role;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 120),
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.regions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug = lower(slug)),
  name text not null unique,
  description text,
  cover_url text,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.places (
  id uuid primary key default gen_random_uuid(),
  region_id uuid not null references public.regions(id) on delete restrict,
  slug text not null unique check (slug = lower(slug)),
  name text not null,
  place_type text not null,
  location_name text not null,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  summary text not null,
  description text not null,
  cover_url text,
  rating numeric(2,1) not null default 0 check (rating between 0 and 5),
  verified boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.place_media (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  kind text not null check (kind in ('image', 'video', 'audio')),
  url text not null,
  alt_text text,
  credit text,
  sort_order integer not null default 0 check (sort_order >= 0),
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now()
);

create table public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  event_year integer not null check (event_year between -10000 and 9999),
  title text not null,
  description text not null,
  event_kind text not null default 'history' check (event_kind in ('history', 'traveler')),
  source_backed boolean not null default false,
  confidence numeric(4,3) check (confidence between 0 and 1),
  source_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references auth.users(id) on delete set null,
  place_id uuid references public.places(id) on delete set null,
  region_id uuid not null references public.regions(id) on delete restrict,
  product_type text not null check (product_type in ('tour', 'stay', 'transfer', 'experience')),
  slug text not null unique check (slug = lower(slug)),
  title text not null,
  description text not null,
  cover_url text,
  price numeric(12,2) not null check (price >= 0),
  currency text not null default 'ZAR' check (currency ~ '^[A-Z]{3}$'),
  price_unit text not null check (price_unit in ('person', 'night', 'trip')),
  duration_hours numeric(6,2) check (duration_hours > 0),
  pickup_included boolean not null default false,
  guide_included boolean not null default false,
  rating numeric(2,1) not null default 0 check (rating between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  availability jsonb not null default '{}'::jsonb check (jsonb_typeof(availability) = 'object'),
  status text not null default 'draft' check (status in ('draft', 'pending', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.discoveries (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  place_id uuid references public.places(id) on delete set null,
  title text not null check (char_length(title) between 1 and 160),
  description text,
  category text not null check (category in ('Wildlife', 'History', 'Food', 'Other')),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  photo_url text,
  status text not null default 'pending' check (status in ('draft', 'pending', 'approved', 'rejected')),
  likes_count integer not null default 0 check (likes_count >= 0),
  comments_count integer not null default 0 check (comments_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.saved_places (
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, place_id)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  traveler_id uuid not null references auth.users(id) on delete restrict,
  assigned_guide_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed', 'refunded')),
  currency text not null default 'ZAR' check (currency ~ '^[A-Z]{3}$'),
  total numeric(12,2) not null check (total >= 0),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  traveler_details jsonb not null default '{}'::jsonb check (jsonb_typeof(traveler_details) = 'object'),
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at >= starts_at)
);

create table public.booking_items (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  title_snapshot text not null,
  product_type text not null check (product_type in ('tour', 'stay', 'transfer', 'experience')),
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  line_total numeric(12,2) generated always as (quantity * unit_price) stored,
  service_date timestamptz,
  created_at timestamptz not null default now()
);

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function private.set_updated_at();
create trigger regions_set_updated_at before update on public.regions
for each row execute function private.set_updated_at();
create trigger places_set_updated_at before update on public.places
for each row execute function private.set_updated_at();
create trigger timeline_events_set_updated_at before update on public.timeline_events
for each row execute function private.set_updated_at();
create trigger products_set_updated_at before update on public.products
for each row execute function private.set_updated_at();
create trigger discoveries_set_updated_at before update on public.discoveries
for each row execute function private.set_updated_at();
create trigger bookings_set_updated_at before update on public.bookings
for each row execute function private.set_updated_at();

create index places_region_status_idx on public.places(region_id, status);
create index places_status_name_idx on public.places(status, name);
create index place_media_place_status_sort_idx on public.place_media(place_id, status, sort_order);
create index timeline_events_place_status_year_idx on public.timeline_events(place_id, status, event_year);
create index products_region_status_type_idx on public.products(region_id, status, product_type);
create index products_place_id_idx on public.products(place_id);
create index products_provider_status_idx on public.products(provider_id, status);
create index discoveries_place_status_created_idx on public.discoveries(place_id, status, created_at desc);
create index discoveries_author_status_created_idx on public.discoveries(author_id, status, created_at desc);
create index saved_places_place_id_idx on public.saved_places(place_id);
create index bookings_traveler_status_start_idx on public.bookings(traveler_id, status, starts_at);
create index bookings_guide_status_start_idx on public.bookings(assigned_guide_id, status, starts_at);
create index booking_items_booking_id_idx on public.booking_items(booking_id);
create index booking_items_product_id_idx on public.booking_items(product_id);

alter table public.profiles enable row level security;
alter table public.regions enable row level security;
alter table public.places enable row level security;
alter table public.place_media enable row level security;
alter table public.timeline_events enable row level security;
alter table public.products enable row level security;
alter table public.discoveries enable row level security;
alter table public.saved_places enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_items enable row level security;

create policy profiles_select_own_or_admin on public.profiles for select to authenticated
using (
  id = (select auth.uid())
  or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
);
create policy profiles_insert_own on public.profiles for insert to authenticated
with check (id = (select auth.uid()));
create policy profiles_update_own_or_admin on public.profiles for update to authenticated
using (
  id = (select auth.uid())
  or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
  id = (select auth.uid())
  or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
);

create policy regions_public_read on public.regions for select to anon, authenticated
using (status = 'published' or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy regions_admin_insert on public.regions for insert to authenticated
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy regions_admin_update on public.regions for update to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy regions_admin_delete on public.regions for delete to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy places_public_read on public.places for select to anon, authenticated
using (status = 'published' or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy places_admin_insert on public.places for insert to authenticated
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy places_admin_update on public.places for update to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy places_admin_delete on public.places for delete to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy place_media_public_read on public.place_media for select to anon, authenticated
using (status = 'published' or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy place_media_admin_all on public.place_media for all to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy timeline_events_public_read on public.timeline_events for select to anon, authenticated
using (status = 'published' or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy timeline_events_admin_all on public.timeline_events for all to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy products_public_or_owner_read on public.products for select to anon, authenticated
using (
  status = 'published'
  or provider_id = (select auth.uid())
  or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
);
create policy products_provider_or_admin_insert on public.products for insert to authenticated
with check (
  ((provider_id = (select auth.uid())) and status in ('draft', 'pending'))
  or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
);
create policy products_provider_or_admin_update on public.products for update to authenticated
using (
  provider_id = (select auth.uid())
  or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
  ((provider_id = (select auth.uid())) and status in ('draft', 'pending'))
  or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
);
create policy products_provider_or_admin_delete on public.products for delete to authenticated
using (
  (provider_id = (select auth.uid()) and status = 'draft')
  or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
);

create policy discoveries_public_approved_or_owner_read on public.discoveries for select to anon, authenticated
using (
  status = 'approved'
  or author_id = (select auth.uid())
  or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
);
create policy discoveries_owner_insert on public.discoveries for insert to authenticated
with check (author_id = (select auth.uid()) and status in ('draft', 'pending'));
create policy discoveries_owner_or_admin_update on public.discoveries for update to authenticated
using (
  (author_id = (select auth.uid()) and status in ('draft', 'pending'))
  or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
  (author_id = (select auth.uid()) and status in ('draft', 'pending'))
  or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
);
create policy discoveries_owner_or_admin_delete on public.discoveries for delete to authenticated
using (
  (author_id = (select auth.uid()) and status in ('draft', 'pending'))
  or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
);

create policy saved_places_owner_select on public.saved_places for select to authenticated
using (user_id = (select auth.uid()));
create policy saved_places_owner_insert on public.saved_places for insert to authenticated
with check (user_id = (select auth.uid()));
create policy saved_places_owner_delete on public.saved_places for delete to authenticated
using (user_id = (select auth.uid()));

create policy bookings_participant_or_admin_read on public.bookings for select to authenticated
using (
  traveler_id = (select auth.uid())
  or assigned_guide_id = (select auth.uid())
  or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
);
create policy bookings_admin_update on public.bookings for update to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy booking_items_participant_or_admin_read on public.booking_items for select to authenticated
using (
  exists (
    select 1 from public.bookings b
    where b.id = booking_items.booking_id
      and (
        b.traveler_id = (select auth.uid())
        or b.assigned_guide_id = (select auth.uid())
        or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
      )
  )
);

grant select on public.regions, public.places, public.place_media, public.timeline_events,
  public.products, public.discoveries to anon;

grant select on public.profiles to authenticated;
grant insert (id, full_name, phone, avatar_url) on public.profiles to authenticated;
grant update (full_name, phone, avatar_url) on public.profiles to authenticated;

grant select, insert, update, delete on public.regions, public.places, public.place_media,
  public.timeline_events, public.products, public.discoveries to authenticated;
grant select, insert, delete on public.saved_places to authenticated;
grant select, update on public.bookings to authenticated;
grant select on public.booking_items to authenticated;

grant select, insert, update, delete on public.profiles, public.regions, public.places,
  public.place_media, public.timeline_events, public.products, public.discoveries,
  public.saved_places, public.bookings, public.booking_items to service_role;

commit;


