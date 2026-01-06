# Milestone 04 — Data, Admin, Analytics

## Admin & Authorization (Phase 1 Scope)
- Admin users defined via Supabase `admin` role.
- Admin panel UI is out of Phase 1 scope.
- Backend supports:
  - Admin-only access to menu CRUD
  - Admin-only access to orders and subscribers

Menu editing will eventually support:
- Uploading images
- Name
- Description
- Price
- Activation/deactivation

## Data Schema (High-Level)
### `orders`
- id
- customer_name
- email
- phone
- delivery_type
- address
- delivery_day
- time_window
- cart_items (array of items with quantity + edit notes)
- order_notes (optional)
- total_price (derived from items + delivery fees)
- created_at

### `subscribers`
- id
- first_name
- last_name
- email
- phone
- contact_preference
- sms_consent
- created_at

### `menu_items`
- id
- name
- description
- price
- category (breakfast/dinner)
- image_url
- is_active
- created_at

## Error Handling & Messaging
- No technical error messages shown to users.
- Messages should be professional and friendly.
  - Submission failure:
    > Apologies, something went wrong on our end. Please try again shortly.
  - Validation issues:
    > Please review the highlighted fields and try again.

## Analytics (Phase 1)
- Track:
  - Menu signups
  - Orders submitted
- Stored and synced via Supabase.
- No third-party analytics required in Phase 1.

## Out of Scope (Phase 1)
- Online card payments
- User accounts / saved profiles
- Automated SMS sending
- Subscription billing
- Admin dashboard UI

## Success Criteria
- Orders can be placed without confusion.
- Cutoff logic behaves correctly.
- Allergies/preferences are captured per order.
- Data is reliably stored in Supabase.
- Brand experience feels professional and trustworthy.
