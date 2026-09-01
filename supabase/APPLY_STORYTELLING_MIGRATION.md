# Apply Storytelling Migration (past_experiences)

Remote Supabase: https://bwsgdcnptssmeohpszzl.supabase.co

## 1. Apply migration via Dashboard SQL Editor
1. Open Supabase Dashboard → SQL Editor → New query
2. Paste entire file `supabase/migrations/20260901120000_past_experiences_storytelling.sql`
3. Run. Verify:
   ```sql
   select table_name from information_schema.tables where table_name like 'past_experience%';
   select id, name from storage.buckets where id in ('past-experience-media','place-media');
   ```

If pg_cron/cron.schedule errors (extension not permitted on free tier), ignore or comment those lines — not required for storytelling.

## 2. Create client admin account
In Dashboard → Authentication → Users → Invite user (or let client sign up at /auth/signup):

Then run as postgres in SQL Editor:
```sql
-- Replace email with client's email
update auth.users
set raw_app_meta_data = jsonb_set(coalesce(raw_app_meta_data,'{}'::jsonb), '{role}', '"admin"')
where email = 'client@example.com';
-- Verify
select email, raw_app_meta_data->>'role' as role from auth.users where email='client@example.com';
```
Alternative via SQL if user already logged in and you have their id:
```sql
update auth.users set raw_app_meta_data = jsonb_set(raw_app_meta_data,'{role}','"admin"') where id='UUID';
```

Client logs out/in, then can access /admin/past-experiences → New Story → publish.

## 3. Regenerate types (optional, already patched)
```bash
npx supabase login
npx supabase link --project-ref bwsgdcnptssmeohpszzl
npx supabase gen types typescript --linked --schema public > src/types/database.generated.ts
```
Current `src/types/database.generated.ts` already includes past_experiences locally, so builds pass without this.

## 4. Test
- Visit /discover/gallery → 84 images + 15 videos
- Visit /discover/stories → 2 mock stories (until migration applied)
- As admin, create story at /admin/past-experiences/new with cover + gallery, link to product tour-1, Publish → appears at /discover/stories and Discover home No.04 teaser.
