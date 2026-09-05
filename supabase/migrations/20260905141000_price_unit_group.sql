begin;
alter table public.products drop constraint if exists products_price_unit_check;
alter table public.products add constraint products_price_unit_check check (price_unit in ('person','night','trip','group'));
-- optional group size for private tours (null = not private)
alter table public.products add column if not exists group_size integer check (group_size is null or group_size between 1 and 30);
commit;
