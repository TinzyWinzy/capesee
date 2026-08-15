-- ============================================================
-- Capesee catalog seed
--
-- To apply on a live Supabase project:
--   1. Open Supabase Dashboard > SQL Editor
--   2. Paste this file (runs as postgres, bypassing RLS)
--   3. Run. Re-running is safe — inserts are idempotent.
--
-- Facts for places/timeline are curated from well-documented history
-- (VOC settlement, Robben Island, cableway dates, etc.). Community
-- discoveries are only inserted when a profile exists.
-- ============================================================

insert into public.regions (slug, name, description, status)
values (
  'western-cape',
  'Western Cape',
  'Coast, mountains, winelands and layered cultural history at Africa''s south-western edge.',
  'published'
)
on conflict (slug) do nothing;

insert into public.places (
  region_id, slug, name, place_type, location_name, latitude, longitude,
  summary, description, rating, verified, status
)
select r.id, v.slug, v.name, v.place_type, v.location_name, v.latitude, v.longitude,
  v.summary, v.description, v.rating, true, 'published'
from public.regions r
cross join (
  values
    ('castle-of-good-hope', 'Castle of Good Hope', 'Historical Site', 'Cape Town', -33.9259::double precision, 18.4277::double precision,
      'South Africa''s oldest surviving colonial building.',
      'A pentagonal fort built by the Dutch East India Company between 1666 and 1679.', 4.7::numeric),
    ('kirstenbosch', 'Kirstenbosch National Botanical Garden', 'Nature', 'Cape Town', -33.9877::double precision, 18.4324::double precision,
      'A botanical garden set against Table Mountain.',
      'A world-renowned garden dedicated to the extraordinary indigenous flora of southern Africa.', 4.9::numeric),
    ('stellenbosch', 'Stellenbosch', 'Town & Wine Region', 'Stellenbosch', -33.9364::double precision, 18.8616::double precision,
      'Historic streets and celebrated Cape winelands.',
      'One of South Africa''s oldest towns and a gateway to the Cape winelands.', 4.6::numeric),
    ('hermanus', 'Hermanus', 'Coastal Town', 'Hermanus', -34.4187::double precision, 19.2345::double precision,
      'A cliff-lined town known for land-based whale watching.',
      'A coastal destination famous for southern right whale sightings between June and November.', 4.8::numeric),
    ('table-mountain', 'Table Mountain', 'Nature & Landmark', 'Cape Town', -33.9628::double precision, 18.4098::double precision,
      'The flat-topped mountain above Cape Town.',
      'The defining summit of the Cape Peninsula, at the heart of the Table Mountain National Park, with its first aerial cableway opened in 1929.', 4.9::numeric),
    ('robben-island', 'Robben Island', 'Historical Site', 'Cape Town', -33.8069::double precision, 18.3666::double precision,
      'The island prison that became a symbol of the anti-apartheid struggle.',
      'For centuries a place of banishment, it held Nelson Mandela from 1964 to 1982 and became a UNESCO World Heritage Site in 1999.', 4.8::numeric),
    ('bo-kaap', 'Bo-Kaap', 'Neighbourhood & History', 'Cape Town', -33.9210::double precision, 18.4153::double precision,
      'The colourful historic quarter on the slopes of Signal Hill.',
      'One of Cape Town''s oldest surviving neighbourhoods, home to the Cape Malay community and its celebrated brightly painted terraces.', 4.6::numeric),
    ('va-waterfront', 'Victoria & Alfred Waterfront', 'Harbour & Precinct', 'Cape Town', -33.9035::double precision, 18.4190::double precision,
      'A working harbour remade as the city''s most visited precinct.',
      'Cape Town''s harbour district, developed around the 1860 Alfred Basin and now home to Table Mountain views, markets and maritime heritage.', 4.5::numeric),
    ('cape-point', 'Cape Point', 'Nature & Landmark', 'Table Mountain National Park', -34.3570::double precision, 18.4960::double precision,
      'The dramatic southern tip of the Cape Peninsula.',
      'A rugged headland at the edge of the Cape of Good Hope, first lit by a lighthouse in 1859 and framed by fynbos and Atlantic swell.', 4.8::numeric),
    ('franschhoek', 'Franschhoek', 'Town & Wine Region', 'Franschhoek', -33.9150::double precision, 19.1220::double precision,
      'The French corner of the Cape winelands.',
      'Settled by Huguenot refugees from 1688 and set in a valley known for some of South Africa''s finest wine estates.', 4.7::numeric),
    ('paarl', 'Paarl', 'Town & Wine Region', 'Paarl', -33.7339::double precision, 18.9620::double precision,
      'Historic winelands town beneath a giant granite outcrop.',
      'A Cape winelands town dating to the 1600s, marked by the Paarl Rock outcrop and the Afrikaans Language Monument.', 4.5::numeric)
) as v(slug, name, place_type, location_name, latitude, longitude, summary, description, rating)
where r.slug = 'western-cape'
on conflict (slug) do nothing;

insert into public.timeline_events (
  place_id, event_year, title, description, event_kind, source_backed, confidence, status
)
select p.id, v.event_year, v.title, v.description, v.event_kind, v.source_backed, v.confidence, 'published'
from public.places p
cross join (
  values
    ('castle-of-good-hope', 1666, 'Construction begins', 'The Dutch East India Company begins building the fort under Commander Zacharias Wagenaer.', 'history', true, 0.95::numeric),
    ('castle-of-good-hope', 1679, 'Castle completed', 'The pentagonal fortress is completed after thirteen years of construction.', 'history', true, 0.95::numeric),
    ('castle-of-good-hope', 1936, 'Declared a national monument', 'The Castle becomes one of South Africa''s early declared heritage sites.', 'history', true, 0.90::numeric),
    ('kirstenbosch', 1913, 'Garden established', 'Kirstenbosch is founded to preserve the indigenous flora of southern Africa on the eastern slopes of Table Mountain.', 'history', true, 0.95::numeric),
    ('hermanus', 1992, 'First Whale Crier appointed', 'Hermanus appoints the world''s first official Whale Crier to herald whale sightings along the cliffs.', 'history', true, 0.90::numeric),
    ('table-mountain', 1929, 'First cableway opens', 'The Table Mountain Aerial Cableway carries its first passengers to the summit.', 'history', true, 0.95::numeric),
    ('robben-island', 1964, 'Mandela imprisoned on the island', 'Nelson Mandela arrives at Robben Island prison, where he will be held until 1982.', 'history', true, 0.95::numeric),
    ('robben-island', 1999, 'Declared a World Heritage Site', 'Robben Island is inscribed by UNESCO as a symbol of the triumph of freedom over oppression.', 'history', true, 0.95::numeric),
    ('bo-kaap', 1658, 'Cape Malay community takes root', 'Enslaved and free people from the VOC''s eastern colonies shape the neighbourhood beneath Signal Hill.', 'history', true, 0.85::numeric),
    ('va-waterfront', 1860, 'Alfred Basin opened', 'The Alfred Basin, named for Prince Alfred, opens the working harbour of Cape Town.', 'history', true, 0.95::numeric),
    ('cape-point', 1859, 'First lighthouse lit', 'A lighthouse is lit at Cape Point to guide ships around the treacherous tip of the peninsula.', 'history', true, 0.90::numeric),
    ('cape-point', 1919, 'New lighthouse on Dias Point', 'A second, lower lighthouse begins operation at the point, still in service today.', 'history', true, 0.85::numeric),
    ('franschhoek', 1688, 'Huguenot settlers arrive', 'French Huguenot refugees settle in the valley, bringing wine-making craft to the Cape.', 'history', true, 0.95::numeric),
    ('paarl', 1975, 'Afrikaans Language Monument unveiled', 'The monument at Paarl Mountain is unveiled as a tribute to the Afrikaans language.', 'history', true, 0.90::numeric)
) as v(place_slug, event_year, title, description, event_kind, source_backed, confidence)
where p.slug = v.place_slug
  and not exists (
    select 1 from public.timeline_events existing
    where existing.place_id = p.id
      and existing.event_year = v.event_year
      and existing.title = v.title
  );

insert into public.products (
  region_id, place_id, product_type, slug, title, description, price, currency,
  price_unit, duration_hours, pickup_included, guide_included, rating, review_count, status
)
select r.id, p.id, v.product_type, v.slug, v.title, v.description, v.price, 'ZAR',
  v.price_unit, v.duration_hours, v.pickup_included, v.guide_included, v.rating, v.review_count, 'published'
from public.regions r
cross join (
  values
    ('tour', 'stellenbosch-wine-experience', 'Stellenbosch Wine Experience', 'A guided full-day exploration of leading Stellenbosch estates.', 1250::numeric, 'person', 8::numeric, true, true, 4.9::numeric, 220, 'stellenbosch'),
    ('tour', 'cape-peninsula-tour', 'Cape Peninsula Tour', 'A scenic full-day journey around the Cape Peninsula.', 950::numeric, 'person', 9::numeric, true, true, 4.8::numeric, 310, null),
    ('tour', 'cape-town-walking-tour', 'Cape Town Walking Tour', 'Explore central Cape Town''s streets, stories and architecture on foot.', 450::numeric, 'person', 3::numeric, false, true, 4.7::numeric, 96, 'castle-of-good-hope'),
    ('tour', 'hermanus-whale-watching', 'Hermanus Whale Watching', 'Seasonal whale watching along the cliffs and waters of Walker Bay.', 880::numeric, 'person', 4::numeric, true, true, 4.9::numeric, 140, 'hermanus'),
    ('stay', 'cape-lodge', 'Cape Lodge', 'A comfortable Cape Town base for a city itinerary.', 1600::numeric, 'night', null, false, false, 4.5::numeric, 78, null),
    ('stay', 'winelands-villa', 'Winelands Villa', 'A private villa among the Stellenbosch winelands.', 2400::numeric, 'night', null, false, false, 4.8::numeric, 41, 'stellenbosch'),
    ('transfer', 'airport-to-cape-town', 'Airport to Cape Town', 'A private transfer from Cape Town International Airport.', 600::numeric, 'trip', null, true, false, 4.6::numeric, 120, null),
    ('experience', 'cape-town-sunset-sail', 'Cape Town Sunset Sail', 'An evening sail with views of the Atlantic seaboard and Table Mountain.', 720::numeric, 'person', 3::numeric, false, false, 4.9::numeric, 58, null)
) as v(product_type, slug, title, description, price, price_unit, duration_hours, pickup_included, guide_included, rating, review_count, place_slug)
left join public.places p on p.slug = v.place_slug
where r.slug = 'western-cape'
on conflict (slug) do nothing;

-- Upcoming tour & experience departures so date pickers and the admin
-- inventory panel have real slots to show. Idempotent: skips existing rows.
with tour_slots as (
  select
    pr.id as product_id,
    coalesce(pr.duration_hours, 3) as hours,
    (date_trunc('day', now()) + (v.day_offset || ' days')::interval + interval '9 hours') as starts_at,
    case when pr.product_type = 'experience' then 24 else 16 end as capacity
  from public.products pr
  cross join (values (1), (3), (6), (10), (15), (22), (30), (40)) as v(day_offset)
  where pr.product_type in ('tour', 'experience')
)
insert into public.product_slots (product_id, starts_at, ends_at, capacity, reserved, status)
select product_id, starts_at, starts_at + make_interval(hours => hours), capacity, 0, 'open'
from tour_slots
where not exists (
  select 1 from public.product_slots existing
  where existing.product_id = tour_slots.product_id
    and existing.starts_at = tour_slots.starts_at
);

-- A few approved community discoveries for the traveler feed and place pages.
-- Only inserted when a real profile exists (discoveries.author_id references it).
insert into public.discoveries (
  author_id, place_id, title, description, category, latitude, longitude,
  status, likes_count, comments_count, created_at
)
select (select id from public.profiles order by created_at limit 1), p.id, v.title, v.description, v.category,
  v.latitude, v.longitude, 'approved', v.likes, v.comments,
  now() - interval '2 days'
from public.places p
cross join (
  values
    ('kirstenbosch', 'Malachite sunbird among the proteas', 'Heard the call before I saw it — a malachite sunbird feeding on the Fynbos Walk.', 'Wildlife', -33.9872::double precision, 18.4316::double precision, 12, 3),
    ('castle-of-good-hope', 'West wall repointing in progress', 'The west wall is being repointed. Fascinating to watch the masons at work.', 'History', -33.9261::double precision, 18.4271::double precision, 8, 1),
    ('hermanus', 'Whale breach off Gearing''s Point', 'A southern right breached twice off the cliff path this morning.', 'Wildlife', -34.4217::double precision, 19.2371::double precision, 21, 4)
) as v(place_slug, title, description, category, latitude, longitude, likes, comments)
where p.slug = v.place_slug
  and exists (select 1 from public.profiles);
