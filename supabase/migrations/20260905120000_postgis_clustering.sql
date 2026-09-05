begin;

-- PostGIS for server-side clustering and geo search
create extension if not exists postgis;
create extension if not exists earthdistance cascade;

-- GIS column derived from latitude/longitude for clustering
alter table public.places add column if not exists geom geometry(Point, 4326);

update public.places
set geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
where geom is null;

create index if not exists places_geom_gix on public.places using gist (geom);
create index if not exists discoveries_geom_gix on public.discoveries using gist (ST_SetSRID(ST_MakePoint(longitude, latitude),4326));

-- Keep geom in sync
create or replace function public.places_set_geom()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.geom := ST_SetSRID(ST_MakePoint(new.longitude, new.latitude), 4326);
  return new;
end; $$;

drop trigger if exists places_geom_sync on public.places;
create trigger places_geom_sync before insert or update of latitude, longitude on public.places
for each row execute function public.places_set_geom();

-- Clustered places RPC: grid snap clustering by zoom
create or replace function public.get_clustered_places(
  min_lat double precision,
  max_lat double precision,
  min_lng double precision,
  max_lng double precision,
  zoom_level integer
)
returns table (
  cluster_count integer,
  cluster_lat double precision,
  cluster_lng double precision,
  id uuid,
  place_name text,
  slug text,
  place_type text
)
language sql stable set search_path = '' as $$
  with params as (
    select
      case
        when zoom_level <= 5 then 0.5
        when zoom_level <= 8 then 0.2
        when zoom_level <= 11 then 0.05
        else 0.01
      end as grid
  ),
  bounds as (
    select ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326) as env
  ),
  grid as (
    select
      ST_SnapToGrid(p.geom, (select grid from params)) as cell,
      count(*)::int as cnt,
      avg(ST_Y(p.geom)) as avg_lat,
      avg(ST_X(p.geom)) as avg_lng
    from public.places p, bounds
    where p.status = 'published' and ST_Within(p.geom, bounds.env)
    group by cell
  )
  -- clusters (cnt > 1)
  select cnt, avg_lat, avg_lng, null::uuid, null::text, null::text, null::text
  from grid where cnt > 1
  union all
  -- singleton places not in a cluster cell
  select 1, ST_Y(p.geom), ST_X(p.geom), p.id, p.name, p.slug, p.place_type
  from public.places p, bounds, params
  where p.status = 'published'
    and ST_Within(p.geom, bounds.env)
    and not exists (
      select 1 from grid g where g.cnt > 1 and ST_Within(p.geom, g.cell)
    );
$$;

revoke all on function public.get_clustered_places(double precision,double precision,double precision,double precision,integer) from public, anon, authenticated;
grant execute on function public.get_clustered_places(double precision,double precision,double precision,double precision,integer) to anon, authenticated, service_role;

-- Nearby helper using earthdistance
create or replace function public.nearby_places(
  user_lat double precision,
  user_lng double precision,
  radius_meters integer default 10000
)
returns table (
  id uuid,
  name text,
  slug text,
  distance_meters double precision
)
language sql stable set search_path = '' as $$
  select p.id, p.name, p.slug,
    (point(user_lng, user_lat) <@> point(p.longitude, p.latitude)) * 1609.34
  from public.places p
  where p.status = 'published'
    and (point(user_lng, user_lat) <@> point(p.longitude, p.latitude)) * 1609.34 <= radius_meters
  order by 4 asc
  limit 50;
$$;

revoke all on function public.nearby_places(double precision,double precision,integer) from public, anon, authenticated;
grant execute on function public.nearby_places(double precision,double precision,integer) to anon, authenticated, service_role;

commit;
