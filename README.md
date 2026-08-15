# Capesee DMS

Capesee is a place-led destination management system for discovering the Cape, booking local experiences, managing trips, and contributing traveler discoveries.

## Stack

- React 19 + TypeScript
- Vite 8
- TanStack Router and Query
- Zustand
- Supabase Auth, Postgres, Data API, and RLS
- Playwright E2E tests

## Local setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Copy `.env.example` to `.env.local` and add the Supabase project URL and publishable key.

3. Start the application:

   ```bash
   npm run dev
   ```

## Quality commands

```bash
npm run lint
npm run build
npm run test:e2e
npm run test:release
```

Playwright runs the critical traveler journey on desktop Chromium and a Pixel 7 viewport. Failed runs retain screenshots, video, and traces under `test-results/`.

## Backend

The applied schema is tracked in `supabase/migrations/`; repeatable catalog content is in `supabase/seed.sql`. All exposed tables have explicit Data API grants and Row Level Security.

The generated database contract lives in `src/types/database.generated.ts`. Regenerate it after every schema migration.

## Production configuration

Required:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Optional:

- `VITE_MAPBOX_ACCESS_TOKEN`

`VITE_ENABLE_PAYMENT_SIMULATION` must remain `false` in production. Development builds allow the simulated checkout journey, but production builds fail closed when a live payment integration is unavailable.

Paynow credentials are server-only Supabase Edge Function secrets:

```bash
npx supabase secrets set APP_URL=https://your-domain.example
npx supabase secrets set PAYNOW_INTEGRATION_ID=your-id
npx supabase secrets set PAYNOW_INTEGRATION_KEY=your-secret-key
npx supabase secrets set WORKER_SECRET=a-long-random-secret
npx supabase secrets set RESEND_API_KEY=your-resend-api-key
npx supabase secrets set EMAIL_FROM="Capesee <bookings@your-domain.example>"
```

Never add the integration key to a `VITE_` variable. Production checkout creates a capacity-reserved booking through the `create_booking` RPC, initiates payment through `paynow-create`, and confirms it only after the hash-validated `paynow-webhook` updates Supabase.

The `notifications-dispatch` Edge Function safely claims queued messages in batches. Schedule an authenticated `POST` to it with the `x-worker-secret` header after the email secrets are activated; failed sends retry with a bounded attempt count.

## Remaining launch integrations

- Add and certify the live Paynow credentials against a merchant test account.
- Configure Supabase Auth redirect URLs, OAuth providers, and custom SMTP.
- Configure Mapbox for the live geospatial map.
- Add production observability and deployment environment secrets.
