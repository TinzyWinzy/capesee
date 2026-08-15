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
      'A coastal destination famous for southern right whale sightings between June and November.', 4.8::numeric)
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
    (1666, 'Construction begins', 'The Dutch East India Company begins building the fort under Commander Zacharias Wagenaer.', 'history', true, 0.95::numeric),
    (1679, 'Castle completed', 'The pentagonal fortress is completed after thirteen years of construction.', 'history', true, 0.95::numeric),
    (1936, 'Declared a national monument', 'The Castle becomes one of South Africa''s early declared heritage sites.', 'history', true, 0.90::numeric)
) as v(event_year, title, description, event_kind, source_backed, confidence)
where p.slug = 'castle-of-good-hope'
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
