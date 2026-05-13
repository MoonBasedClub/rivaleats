# Rival Eats Repository Review

Reviewed on: 2026-05-13  
Repository root: `c:\Users\micha\Desktop\Rival Eats v2\rivaleats`

## Executive Summary

Rival Eats is a small Next.js App Router project for a home-based weekly meal prep business in Broward County, Florida. The live app is already partway through a shift from a legacy fixed weekly package order flow to an item-based cart and checkout flow. The public site includes landing, menu, checkout, confirmation, and contact pages; backend API routes accept subscriptions and orders; Supabase is intended as the data source; and an admin area exists for login, menu management, and order review.

The highest-priority revamp blockers are not UI polish. They are data-contract mismatches between the current code and `supabase/schema.sql`, plus a production build failure on `/admin/login`. The public `npm run test` script passes after dependencies are installed, but `npm run build` fails. Several admin queries and the subscribe API are currently pointed at table/column names that do not match the schema in the repository.

## Repository Layout

```text
.
+-- README.md
+-- projectrequirements.md
+-- REPOSITORY_REVIEW.md
+-- docs/
|   +-- milestones/
|       +-- README.md
|       +-- completed.md
|       +-- 01-foundation.md
|       +-- 02-business-rules.md
|       +-- 03-item-based-ordering.md
|       +-- 04-data-ops-analytics.md
+-- rivaleats/
    +-- package.json
    +-- package-lock.json
    +-- next.config.ts
    +-- eslint.config.mjs
    +-- postcss.config.mjs
    +-- tsconfig.json
    +-- README.md
    +-- public/
    +-- supabase/
    |   +-- schema.sql
    +-- src/
        +-- app/
        +-- components/
        +-- lib/
        +-- types/
```

Important note: the actual Next.js application lives in the nested `rivaleats/` folder. Commands such as `npm run dev`, `npm run test`, and `npm run build` should be run from `rivaleats/rivaleats`, not the repository root.

## Tech Stack

| Layer | Technology | Notes |
| --- | --- | --- |
| Framework | Next.js 16.1.1 | App Router, Turbopack build |
| UI | React 19.2.3 | Client cart, forms, modals |
| Language | TypeScript 5 | `strict: true` |
| Styling | Tailwind CSS 4 | Uses `@theme inline` in `globals.css` |
| Backend routes | Next.js route handlers | `/api/order`, `/api/subscribe` |
| Validation | Zod 4.2.1 | API request validation |
| Database/Auth | Supabase | Postgres, RLS, Supabase Auth |
| Linting | ESLint 9 + Next config | `npm run lint` |
| Tests | No unit/integration tests | `npm run test` is lint + typecheck only |

## Commands

From `rivaleats/`:

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

Observed results:

- `npm run test` passes after `npm install`.
- `npm run build` initially failed in sandbox due Google font fetches, then with network allowed it compiled but failed during prerender of `/admin/login`.
- `npm audit --audit-level=moderate` reports 7 vulnerabilities: 3 moderate and 4 high. The most important is `next@16.1.1`, with fixes available through `npm audit fix --force`, which would move Next to `16.2.6` outside the current stated package range.

## Environment Variables

The app expects:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Behavior when missing:

- Menu fetch falls back to hardcoded sample menu data.
- `/api/order` returns `202` dry-run success.
- `/api/subscribe` returns `202` dry-run success.
- Admin login cannot authenticate and shows "Supabase env vars are missing."
- Admin protected pages require server auth and service-role-backed reads for data views.

## Product Intent From Docs

The planning docs describe Rival Eats as a Broward County weekly meal prep ordering MVP.

Core goals:

- Present the Rival Eats brand clearly.
- Let customers sign up for weekly menu updates.
- Let customers place weekly orders.
- Capture allergies, dietary preferences, and notes.
- Enforce Friday 7pm ET cutoff.
- Handle Broward delivery versus pickup.
- Store operational data in Supabase.
- Prepare for a future admin surface.

Milestone state:

- `completed.md` says marketing pages, subscriber capture, admin surface, and the old weekly package form exist.
- `03-item-based-ordering.md` says the old base package flow should be replaced with item-based ordering.
- The current code mostly implements item-based ordering on `/menu` and `/checkout`, while the old `OrderForm` component remains in the repo unused.

## Public Feature Map

### Global Layout

Files:

- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/components/NavBar.tsx`
- `src/components/Footer.tsx`
- `src/components/LogoMark.tsx`
- `src/components/cart/CartProvider.tsx`

Behavior:

- Loads Inter and Poppins through `next/font/google`.
- Wraps the whole site in `CartProvider`.
- Shows a sticky navigation bar with Home, Menu, Checkout, and Contact / FAQ.
- Shows a footer with Menu, Checkout, and Contact links.
- Uses a Rival Eats logo image if `public/rival-eats-logo.png` exists; otherwise falls back to a red circular `RE` mark.

Revamp notes:

- The mobile nav button is visual only. It has an accessible label but does not open a menu.
- The layout uses decorative radial gradients and very rounded containers. A revamp could simplify this depending on brand direction.
- Google font fetching can break production builds in restricted/offline environments. Vercel should fetch fine, but local CI without network will fail unless fonts are self-hosted or swapped to CSS/system fonts.

### Home Page

File: `src/app/page.tsx`

Features:

- Hero section with CTAs to `/checkout` and `/menu`.
- Highlights: per-item ordering, Sunday/Monday windows, free pickup, $10 Broward delivery.
- Embedded compact weekly menu signup form.
- "How it works" steps.
- Service area section with a full signup form.
- FAQ cards about cutoff, delivery, and payment.

Logic:

- Mostly static content.
- Uses `SubscribeForm` twice.
- Directs ordering traffic to `/checkout`, not `/order`.

Content issues:

- Some copy appears to have lost punctuation or apostrophes, for example "well show you" and "submitno surprises."
- Several files contain mojibake-style characters from encoding issues, such as garbled apostrophes, separators, and dashes.

### Menu Page

Files:

- `src/app/menu/page.tsx`
- `src/app/menu/MenuClient.tsx`
- `src/lib/menu.ts`

Features:

- Server fetches menu data, revalidated every 900 seconds.
- If Supabase env vars are missing or fetch fails, it displays hardcoded sample menu data.
- Displays Breakfast and Dinner sections.
- Each item card has add, increment, decrement, and edit-note controls.
- Item notes can include allergies, dietary preferences, and special requests.
- Checkout CTA takes user to `/checkout`.

Menu data flow:

1. `MenuPage` calls `fetchMenuData()`.
2. `fetchMenuData()` checks `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. If env is configured, it selects active records from `menu_items`.
4. It maps Supabase `category` into local `section`.
5. It passes `MenuData` into `MenuClient`.
6. `MenuClient` reads/writes cart state through `useCart()`.

Sample fallback:

- 3 breakfast items.
- 3 dinner items.
- All sample prices are `0`, which means the cart can produce a `$0.00` subtotal unless real Supabase data is present.

Revamp notes:

- `image_url` is fetched but not rendered, so menu cards are currently text-only.
- Real menu tags are ignored by the public menu fetch because `fetchMenuData()` sets `tags: null`.
- Menu cards only show price if `price > 0`.
- Cart state is in memory only; it is lost on refresh, tab close, or hard navigation.

### Cart System

File: `src/components/cart/CartProvider.tsx`

Features:

- Holds cart state in React component state.
- `addItem()` adds a new item or increments an existing item.
- `increment()` increases quantity.
- `decrement()` lowers quantity and removes the item when quantity reaches 0.
- `updateNotes()` stores item-specific notes.
- `subtotal` is derived from `price * quantity`.
- `totalItems` is derived from quantities.

Cart item shape:

```ts
{
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  notes: {
    allergies: string;
    dietaryPreferences: string;
    specialRequests: string;
  }
}
```

Revamp notes:

- There is no persistence to `localStorage`, URL state, user account, or backend draft order.
- There is no clear-cart action after successful order submission.
- Since confirmation is reached via router push, the in-memory cart can remain populated after order completion until refresh.

### Edit Item Notes Modal

File: `src/components/cart/EditItemNotesModal.tsx`

Features:

- Opens as a fixed overlay.
- Edits per-item allergies, dietary preferences, and special requests.
- Keeps draft state inside the modal.
- Saves notes back to cart through parent callback.

Revamp notes:

- No Escape key handling.
- No focus trap.
- No click-outside-to-close behavior.
- The modal is good enough for MVP but should be hardened for accessibility before launch.

### Checkout Page

File: `src/app/checkout/page.tsx`

Features:

- Shows cart summary.
- Allows quantity edits.
- Allows per-item note editing.
- Collects full name, email, optional phone, contact preference, and SMS consent.
- Supports delivery or pickup.
- Supports Sunday or Monday delivery day.
- Supports four time windows:
  - `8:00am - 10:00am`
  - `10:00am - 12:00pm`
  - `12:00pm - 2:00pm`
  - `4:00pm - 6:00pm`
- Collects delivery address when delivery is selected.
- Performs a simple Broward/out-of-zone check.
- Adds `$10` delivery fee for delivery.
- Adds `$12.50` outside-zone fee only after customer accepts it.
- Shows cutoff prompt after Friday 7pm ET.
- Builds order payload and POSTs to `/api/order`.
- Redirects to `/confirmation?total=...&day=...` on success.

Frontend validation:

- Requires at least one cart item.
- Requires full name and email.
- Requires address fields for delivery.
- Requires next-window confirmation if after cutoff.
- Requires outside-zone confirmation if the address appears out of zone.

Cutoff logic:

- `getEasternNow()` converts current time to `America/New_York`.
- `isAfterCutoff()` returns true if day is after Friday, or Friday at/after 7pm.
- This means Saturday is always "after cutoff."
- Sunday is not "after cutoff" because `getDay()` returns `0`, so Sunday orders would be treated as inside the current ordering window. This may or may not match the business rule.

Zone logic:

- County containing "broward" is in-zone.
- ZIP prefixes `330` or `333` are in-zone.
- Non-FL state is out-of-zone.
- Any other ZIP is out-of-zone.

Revamp notes:

- The frontend sends `county` in the old `OrderForm`, but the current `/checkout` payload does not include `county`, so backend never receives county info.
- Phone is optional in code, while milestone 03 says checkout collects phone with same requirement as old form. The old form also marks phone optional, so docs are inconsistent.
- The app does not validate phone format.
- Contact preference can be `phone` without requiring a phone number.
- SMS consent is not enforced for phone/either contact preference in checkout.
- The cart is not cleared after successful order.

### Legacy Order Page

Files:

- `src/app/order/page.tsx`
- `src/components/forms/OrderForm.tsx`

Behavior:

- `/order` immediately redirects to `/checkout`.
- `OrderForm` remains in the codebase but is no longer mounted.

Legacy `OrderForm` features:

- Weekly Full Package at `$79.99`.
- Delivery/pickup.
- Delivery day/time window.
- Full-order allergies, dietary preferences, and notes.
- Same cutoff and zone logic shape as checkout.

Important incompatibility:

- The legacy `OrderForm` sends `basePrice`, `allergies`, and `dietaryPreferences`, but the current `/api/order` schema requires `cartItems` and `subtotal`. If `OrderForm` were ever mounted again, submission would fail validation.

Revamp notes:

- Decide whether to delete this component or preserve it behind a clearly named legacy route. Right now it creates confusion.

### Confirmation Page

File: `src/app/confirmation/page.tsx`

Features:

- Reads `total` and `day` from query parameters.
- Shows order total, selected day, and "watch your inbox" next steps.

Revamp notes:

- It trusts query params from the URL, so users can alter the displayed total/day.
- It does not fetch the saved order by ID.
- No order number is shown.
- In Next 16, `searchParams` may need to be awaited/typed differently depending on route rendering mode. Typecheck passes, but this is worth retesting after fixing the build.

### Contact Page

File: `src/app/contact/page.tsx`

Features:

- Static contact/FAQ page.
- Shows `hello@rivaleats.com`.
- Links to checkout and menu.
- Reiterates cutoff, pickup, allergies, and Broward/outside-zone rules.

Revamp notes:

- There is no actual contact form.
- Email address is static and not configured.

## Forms and API Routes

### Subscribe Form

File: `src/components/forms/SubscribeForm.tsx`

Fields:

- First name
- Last name
- Email
- Optional phone
- Contact preference: email, SMS, either
- SMS consent

Behavior:

- Compact mode hides phone/contact preference/SMS consent.
- Validates first name, last name, and email client-side.
- Requires SMS consent when phone is provided and preference is SMS/either.
- POSTs to `/api/subscribe`.
- Resets on success.

Potential issue:

- In compact mode, only name/email are sent and contact preference stays `email`, which is fine.
- Error messages from the API can include technical details.

### Subscribe API

File: `src/app/api/subscribe/route.ts`

Validation:

- Zod requires first name, last name, valid email.
- Phone optional.
- Contact preference can be `email`, `sms`, or `either`.
- SMS consent optional.
- Enforces SMS consent when phone is present and preference is not email.

Storage behavior:

- Uses service role client if available, otherwise anon client.
- If no Supabase env vars exist, returns `202` dry-run success.
- Attempts to insert into `menu_signups`.

Critical issue:

- `supabase/schema.sql` defines `subscribers`, not `menu_signups`.
- The app README says schema creates `menu_signups`, but the SQL does not.
- Result: with the included schema applied as-is, live subscription saves will fail.

### Order API

File: `src/app/api/order/route.ts`

Validation:

- Zod requires:
  - fullName
  - email
  - fulfillment
  - deliveryDay
  - timeWindow
  - at least one cart item
  - subtotal
  - deliveryFee
  - outsideZoneFee
  - afterCutoff
  - scheduleNextWindow

Storage behavior:

- Uses service role client if available, otherwise anon client.
- If no Supabase env vars exist, returns `202` dry-run success.
- Calculates `totalPrice = subtotal + deliveryFee + outsideZoneFee`.
- Computes scheduled week start.
- Inserts into `orders`.

Order insert columns:

- `customer_name`
- `email`
- `phone`
- `contact_preference`
- `sms_consent`
- `delivery_type`
- `delivery_day`
- `time_window`
- `address_line1`
- `address_line2`
- `city`
- `state`
- `zip`
- `notes`
- `package_price`
- `delivery_fee`
- `out_of_zone_fee`
- `outside_zone_accepted`
- `total_price`
- `is_late_order`
- `scheduled_week_start`
- `cart_items`
- `submission_source`

Potential issue:

- The API trusts client-submitted prices, subtotal, deliveryFee, outsideZoneFee, and afterCutoff. A user can modify these in the browser. For real commerce, the backend should re-fetch active menu item prices, recompute totals, recompute cutoff, and recompute zone fees.

## Supabase Schema Review

File: `rivaleats/supabase/schema.sql`

Tables defined:

- `menu_items`
- `analytics_events`
- `subscribers`
- `orders`

RLS:

- Public can read `menu_items`.
- Admin/service role can manage `menu_items`.
- Public can insert `subscribers`.
- Admin/service role can manage `subscribers`.
- Public can insert `orders`.
- Admin/service role can select `orders`.

Schema dependencies not defined in this file:

- `extensions.uuid_generate_v4()` assumes the UUID extension exists.
- `public.menu_category_enum`
- `public.contact_preference_enum`
- `public.delivery_type_enum`
- `public.delivery_day_enum`
- `public.spice_level_enum`

Critical issue:

- The schema cannot be applied cleanly to a brand-new Supabase project unless those enums and extension setup already exist. They are referenced but not created.

Public menu columns:

- SQL has `category`, `image_url`, `is_active`, `created_at`.
- Public `fetchMenuData()` matches these columns.

Admin menu columns:

- Admin menu code expects `section`, `tags`, and `updated_at`.
- SQL does not define `section`, `tags`, or `updated_at`.
- Admin inserts/updates also write `section`, `tags`, and `updated_at`.
- Result: admin menu page will not work against this schema.

Orders columns:

- SQL has `customer_name`, `delivery_type`, `zip`, `out_of_zone_fee`, `is_late_order`, `scheduled_week_start`, `cart_items`.
- Order API insert matches these names.
- Admin orders page expects `full_name`, `fulfillment`, `postal_code`, `after_cutoff`, `outside_zone_fee`, and `schedule_next_window`.
- Result: admin orders page will not work against this schema or the current order insert shape.

Subscriber columns:

- SQL has `subscribers`.
- Subscribe API writes `menu_signups`.
- Result: subscription API will fail against this schema.

Analytics:

- SQL defines `analytics_events`.
- `src/lib/monitoring.ts` only logs to console.
- No code inserts menu signup or order events into `analytics_events`.

## Admin Feature Map

### Admin Shell and Auth

Files:

- `src/app/admin/layout.tsx`
- `src/app/admin/login/page.tsx`
- `src/app/admin/(protected)/layout.tsx`
- `src/lib/supabase/auth-browser.ts`
- `src/lib/supabase/auth-server.ts`

Features:

- `/admin/login` signs in with Supabase email/password.
- Protected admin routes use server-side Supabase auth.
- Admin check requires `user.user_metadata.role === "admin"`.
- Non-admin users redirect to `/admin/login?error=not_admin`.

Critical build issue:

- `/admin/login` uses `useSearchParams()` directly in the page component.
- `npm run build` fails with: `useSearchParams() should be wrapped in a suspense boundary at page "/admin/login"`.
- Fix direction: move the client form that calls `useSearchParams()` under a `<Suspense>` boundary or read the error param on the server and pass it to a client child.

### Admin Home

File: `src/app/admin/(protected)/page.tsx`

Features:

- Shows links to menu manager and orders.
- Warns that service role key should be set for production data reliance.

### Admin Menu Manager

File: `src/app/admin/(protected)/menu/page.tsx`

Intended features:

- Fetch menu items.
- Add menu item.
- Update menu item.
- Delete menu item.
- Edit section, price, tags.

Critical issue:

- Uses `section`, `tags`, and `updated_at` columns that are absent from `schema.sql`.
- Public menu uses `category` instead of `section`.
- Admin-created records would not match the public menu query unless schema/code are reconciled.

### Admin Orders

File: `src/app/admin/(protected)/orders/page.tsx`

Intended features:

- Fetch latest 50 orders.
- Show name, email, phone, fulfillment, cutoff flags, outside-zone fee, next-window flag, delivery day/time, and address.

Critical issue:

- Selects columns not present in `schema.sql`.
- Does not select `cart_items`, `total_price`, `package_price`, `delivery_fee`, `out_of_zone_fee`, `is_late_order`, or `scheduled_week_start`, which are the actual useful order fields in current SQL/API.

## Business Logic Details

### Pricing

Constants:

- `WEEKLY_BASE_PRICE = 79.99`
- `DELIVERY_FEE = 10`
- `OUTSIDE_ZONE_FEE = 12.5`

Current live checkout:

- Uses item subtotal from cart.
- Adds delivery fee when fulfillment is delivery.
- Adds outside-zone fee only after acceptance.
- Does not use `WEEKLY_BASE_PRICE`.

Legacy form:

- Still uses `WEEKLY_BASE_PRICE`.
- Not reachable because `/order` redirects to `/checkout`.

### Cutoff

Constants:

- `CUTOFF_DAY = 5`
- `CUTOFF_HOUR_ET = 19`

Frontend:

- Implemented in both `OrderForm` and `/checkout`.
- Shows prompt after cutoff.

Backend:

- Does not independently compute whether request is after cutoff.
- Accepts `afterCutoff` and `scheduleNextWindow` from the browser.

Revamp recommendation:

- Move cutoff calculation into a shared server-safe utility.
- Frontend can use it for display, but backend should be source of truth.

### Scheduled Week Start

File: `src/app/api/order/route.ts`

Current behavior:

- Finds upcoming Sunday from current ET date.
- If after cutoff and scheduling next window, adds 7 days.
- Returns the Sunday date whether delivery day is Sunday or Monday.

Observations:

- The function receives `deliveryDay`, but both branches return the same Sunday date.
- This may be intentional if `scheduled_week_start` means week start, not actual delivery date.
- If the business needs actual delivery date, Monday orders need a separate date calculation.

### Delivery Zone

Frontend only:

- Broward county string means in-zone.
- ZIP prefix `330` or `333` means in-zone.
- Non-FL state means out-of-zone.
- Other ZIP means out-of-zone.

Backend:

- Does not recompute zone.
- Accepts fee and acceptance flags from browser.

Revamp recommendation:

- Keep the friendly frontend prompt, but recompute zone/fee server-side.
- Consider a maintained ZIP list for Broward instead of prefix-only matching.

## Conventions

Code style:

- TypeScript with App Router.
- Server components by default; `"use client"` for forms, cart, modal, menu client, checkout, and login.
- Tailwind utility classes inline in JSX.
- Shared aliases via `@/*`.
- API handlers validate payloads using Zod.
- Supabase helper functions live under `src/lib/supabase`.

Naming:

- React components use PascalCase files/components.
- Route folders use lowercase App Router names.
- Data fields are camelCase in frontend payloads and snake_case in Supabase.

Git:

- Recent commit messages are short and generic: `Update`, `added UI fixes and supabase`, `First Draft`, `Initial commit`.
- No strong branch or commit convention is detectable.

Testing:

- No real tests found.
- `npm run test` currently means lint + TypeScript typecheck.

## Verification Results

Commands run from `rivaleats/`:

```bash
npm install
npm run test
npm run build
npm audit --audit-level=moderate
```

Results:

- `npm install`: succeeded after allowing npm to write cache/dependencies.
- `npm run test`: passed.
- `npm run build`: failed.
- `npm audit --audit-level=moderate`: failed because vulnerabilities exist; report lists 7 total.

Production build failure:

```text
useSearchParams() should be wrapped in a suspense boundary at page "/admin/login".
Error occurred prerendering page "/admin/login".
```

Dependency security report:

- `ajv`: moderate
- `brace-expansion`: moderate
- `flatted`: high
- `minimatch`: high
- `next`: high
- `picomatch`: high
- `postcss`: moderate

## Highest-Priority Issues Before Revamp

1. Production build is currently broken.
   - File: `src/app/admin/login/page.tsx`
   - Cause: `useSearchParams()` needs a Suspense boundary or server param handoff in Next 16.

2. Subscribe API writes to a table that does not exist in the included schema.
   - API: `menu_signups`
   - SQL: `subscribers`
   - Impact: real weekly signup saves fail unless the deployed database has an older table not represented here.

3. Admin menu manager does not match schema.
   - Admin expects `section`, `tags`, `updated_at`.
   - SQL defines `category`, `image_url`, `is_active`, `created_at`.
   - Impact: admin menu fetch/add/update/delete likely fails.

4. Admin order review does not match schema or order API inserts.
   - Admin expects old names such as `full_name`, `fulfillment`, `postal_code`, `after_cutoff`.
   - SQL/API use `customer_name`, `delivery_type`, `zip`, `is_late_order`.
   - Impact: admin order review likely fails.

5. Supabase schema omits enum and extension setup.
   - Impact: fresh database setup is incomplete.

6. Backend trusts client-calculated pricing, cutoff, and fees.
   - Impact: users can tamper with totals or flags before submission.

7. No real automated tests.
   - Impact: a revamp has little safety net beyond lint/typecheck.

8. Cart state is not persisted or cleared.
   - Impact: refresh loses cart; post-order cart can stay populated.

9. Public menu fallback prices are zero.
   - Impact: if Supabase is missing, checkout can submit a zero-dollar order.

10. Encoding issues appear in multiple files.
   - Impact: visible copy may show garbled characters in browser.

## Suggested Revamp Order

1. Stabilize build.
   - Fix `/admin/login` Suspense issue.
   - Re-run `npm run build`.

2. Reconcile Supabase schema with application code.
   - Pick canonical names for menu fields: either `category` or `section`.
   - Pick canonical subscriber table: likely `subscribers`.
   - Pick canonical order field names: current SQL/API snake_case names are reasonable.
   - Add missing enum creation and UUID extension setup.

3. Fix admin data views.
   - Make menu manager use schema fields.
   - Make order page use current `orders` fields.
   - Show cart items and totals in admin orders.

4. Harden order submission.
   - Backend recomputes prices from `menu_items`.
   - Backend recomputes cutoff.
   - Backend recomputes zone fee.
   - Return an order ID and show it on confirmation.

5. Improve cart UX.
   - Persist cart to `localStorage`.
   - Clear cart after confirmed order.
   - Add an empty-cart CTA and maybe cart count in nav.

6. Add targeted tests.
   - Unit tests for cutoff, zone, totals, and payload mapping.
   - API tests for `/api/order` and `/api/subscribe`.
   - A smoke test for build-critical routes.

7. Refresh the UI.
   - Add real menu imagery if available.
   - Fix copy encoding.
   - Improve mobile navigation.
   - Improve modal accessibility.
   - Revisit brand palette and layout density.

## Useful File Reference

| Area | Files |
| --- | --- |
| App shell | `rivaleats/src/app/layout.tsx`, `rivaleats/src/app/globals.css` |
| Navigation/footer | `rivaleats/src/components/NavBar.tsx`, `rivaleats/src/components/Footer.tsx` |
| Home | `rivaleats/src/app/page.tsx` |
| Menu | `rivaleats/src/app/menu/page.tsx`, `rivaleats/src/app/menu/MenuClient.tsx`, `rivaleats/src/lib/menu.ts` |
| Cart | `rivaleats/src/components/cart/CartProvider.tsx`, `rivaleats/src/components/cart/EditItemNotesModal.tsx` |
| Checkout | `rivaleats/src/app/checkout/page.tsx` |
| Legacy order | `rivaleats/src/app/order/page.tsx`, `rivaleats/src/components/forms/OrderForm.tsx` |
| Confirmation | `rivaleats/src/app/confirmation/page.tsx` |
| Contact | `rivaleats/src/app/contact/page.tsx` |
| Subscribe | `rivaleats/src/components/forms/SubscribeForm.tsx`, `rivaleats/src/app/api/subscribe/route.ts` |
| Order API | `rivaleats/src/app/api/order/route.ts` |
| Admin auth | `rivaleats/src/app/admin/login/page.tsx`, `rivaleats/src/app/admin/(protected)/layout.tsx` |
| Admin menu | `rivaleats/src/app/admin/(protected)/menu/page.tsx` |
| Admin orders | `rivaleats/src/app/admin/(protected)/orders/page.tsx` |
| Supabase | `rivaleats/supabase/schema.sql`, `rivaleats/src/lib/supabase/*` |
| Product docs | `docs/milestones/*.md`, `projectrequirements.md` |

## Bottom Line

The project has a solid MVP shape and the public item-based ordering flow is already mostly there. The site is not ready for a mini revamp until the build and Supabase contracts are cleaned up, because otherwise UI changes will sit on top of broken admin/subscriber functionality and a database schema that cannot be reliably recreated. Once those contracts are normalized, the revamp can move quickly: the codebase is small, readable, and already organized around the right product surfaces.
