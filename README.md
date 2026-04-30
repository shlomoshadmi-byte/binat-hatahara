# Binat Hatahara Next.js Rebuild

This is a clean Next.js + Supabase rebuild with:

- Public app at `/`
- Admin panel at `/admin`
- Supabase Auth magic-link owner login
- Draft/publish configuration flow
- Versioned published configs
- Local-only user period entries
- Timezone-safe date-only storage

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Fill in:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   NEXT_PUBLIC_ADMIN_EMAIL=
   ```

4. Run the Supabase migration in `supabase/migrations/0001_initial.sql`.

5. Bootstrap the owner email in Supabase SQL:

   ```sql
   insert into public.admin_users (email, is_owner)
   values ('you@example.com', true)
   on conflict (email) do update set is_owner = true;
   ```

6. Start the app:

   ```bash
   npm run dev
   ```

## Admin Flow

1. Visit `/admin/login`.
2. Sign in with the configured owner email.
3. Edit draft configuration from `/admin`.
4. Save the draft.
5. Publish when ready.
6. Public users receive the active published config from `/api/config/active`.

## Privacy Model

User period entries are stored only in browser local storage under:

- `period_entries`
- `user_preferences`
- `active_config_version`

They are not sent to Supabase by the public app.

## Verification

```bash
npm run typecheck
npm test
npm run build
```
