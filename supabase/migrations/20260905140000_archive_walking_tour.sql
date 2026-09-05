begin;
update public.products
set status = 'archived', updated_at = now()
where slug = 'cape-town-walking-tour' and product_type = 'tour';
commit;
