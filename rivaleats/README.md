# Rival Eats — Next.js + Tailwind v4 + Supabase

Phase 1 build for Rival Eats: public marketing pages, weekly menu, and order form with delivery/pickup logic. Tailwind v4 (postcss plugin) and App Router.

## Quickstart
1) `npm install`
2) Add `.env.local` (see below).
3) `npm run dev` → http://localhost:3000

## Env vars (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```
If these are not set, API routes respond in “dry-run” mode so you can still test the UI.

## Supabase schema
- Apply `supabase/schema.sql` in the Supabase SQL editor (creates `menu_items`, `menu_updates`, `menu_signups`, `orders`, and basic RLS policies).
- Optional: create a public storage bucket `menu-images` for menu photos (policies are noted in the SQL file).

## Logo
Place the provided logo at `public/rival-eats-logo.png` (used in the header). Use the round badge for favicon/social and the wordmark in the header if you have both variants.

## Pages & flows
- `/` Landing with hero, how-it-works, service area, and signup CTA.
- `/menu` Weekly menu (pulls Supabase `menu_items`, falls back to sample data).
- `/order` Order form with delivery vs pickup, cutoff + outside-zone prompts, fee calculation, and submission to `/api/order`.
- `/confirmation` Success state after order submit.
- `/contact` Contact/FAQ summary.
- `/api/order` and `/api/subscribe` save to Supabase (service role) or return dry-run responses.

## Deployment
Deploy to Vercel. Ensure env vars are set and the `rival-eats-logo.png` lives in `/public` (plus update `favicon.ico` with the round badge).
