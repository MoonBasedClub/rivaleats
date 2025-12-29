# Product Requirements Document (PRD)
## Rival Eats — Website & Ordering MVP (Phase 1)

**Prepared for:** Engineering / Codex  
**Platform:** Next.js (Vercel) + Supabase  
**Product Stage:** MVP (Phase 1)  
**Location:** Broward County, Florida  
**Timezone:** Eastern Time (ET)

---

## 1. Product Overview

### Product Name
**Rival Eats**

### Description
Rival Eats is a home-based meal prep service offering weekly meal packages with delivery or pickup. The website serves as the primary customer-facing platform for marketing, menu distribution, and order intake.

### Primary Goals
- Present the Rival Eats brand clearly and professionally
- Allow customers to sign up for weekly menus via email and/or SMS
- Allow customers to place weekly orders online
- Capture food allergies and dietary preferences per order
- Enforce ordering rules (cutoff, delivery zone logic)
- Store all operational data in Supabase
- Prepare the foundation for a future admin panel (Phase 2)

---

## 2. Tech Stack & Environment

### Frontend
- **Framework:** Next.js
- **Hosting:** Vercel
- **Environment:** Single production environment (MVP)

### Backend
- **Database:** Supabase (Postgres)
- **Auth:** Supabase Auth
- **Roles:** `admin`, `public`

Supabase is the **single source of truth** for all data.

---

## 3. Brand & Design Requirements

### Brand Name
**Rival Eats**

### Taglines
- **Primary:** Home-cooked, rival-worthy meals
- **Secondary:** Rival-Friendly Meals for Busy Weeks

### Color Palette
- Red (primary accent)
- Black (base)
- Green (secondary accent)

### Logos
- **Primary Logo:** Round badge (social, packaging)
- **Secondary Logo:** Flat wordmark (website header, forms)

### Typography
- Modern, clean sans-serif
- Bold headers
- High readability

---

## 4. Core Business Rules

### Pricing
- **Weekly Full Package:** $79.99  
  - Includes 3 breakfasts + 5 dinners
- **Delivery Fee:** $10 flat
- **Pickup:** Free

### Ordering Window
- Orders close **Fridays at 7:00 PM (ET)**

### Delivery & Pickup
- Available **Sunday or Monday**
- Service area: **Broward County, Florida**

---

## 5. Order Cutoff Logic (Critical)

### Standard Flow
- Orders submitted **on or before Friday 7:00 PM ET** are scheduled for the upcoming Sunday/Monday.

### Late Orders (After 7:00 PM ET)
- If an order is submitted at **7:01 PM or later**:
  - User is shown a **non-error prompt**:
    > “Orders for this week have closed. Would you like to schedule this order for the next delivery window?”
  - User may continue and schedule for the **following week**.

### Enforcement
- Cutoff enforced at both:
  - Frontend (UI messaging)
  - Backend (Supabase validation)

---

## 6. Delivery Zone Logic

### In-Zone (Broward County)
- Normal checkout flow
- $10 delivery fee applied

### Out-of-Zone Address
- No hard error
- User is prompted:
  > “Your address appears to be outside our standard delivery zone. Would you like to continue with an additional delivery charge?”

- Additional charge amount is configurable (not hardcoded in Phase 1)
- Order may proceed after user confirmation

---

## 7. Pages & Functional Requirements

### 7.1 Home / Landing Page
- Hero with brand, primary tagline, CTAs
- Secondary tagline displayed
- Announcement bar:
  > Orders close Fridays at 7 PM • Pickup/Delivery Sundays or Mondays
- About section (Chef Victor + Keisha)
- How It Works (step-based)
- Service area and delivery info
- Footer with brand + location

---

### 7.2 Weekly Menu Signup

#### Purpose
Collect subscribers for weekly menu notifications.

#### Fields
- First Name
- Last Name
- Email (required)
- Phone (optional)
- Preferred contact method: Email / Text / Both
- SMS consent checkbox (required if phone provided)

#### Data Storage
- Supabase table: `subscribers`

#### Success Message
> You’re in! Watch for the weekly menu.

---

### 7.3 Menu Page (MVP)

#### Purpose
Display the current menu.

#### Content
- Breakfasts section
- Dinners section
- Last updated date

#### Data Source
- Supabase table: `menu_items`

Menu items are stored, not hardcoded.

---

### 7.4 Order Page

#### Package Selection
- Weekly Full Package – $79.99

#### Order Form Fields
- Name
- Email
- Phone
- Delivery or Pickup (required)
- Address fields (required if delivery)
- Delivery/Pickup day: Sunday or Monday
- Time window (dropdown)
- Allergies (multi-select + free text)
- Dietary preferences (checkboxes)
- Spice level (mild / medium / hot)
- Notes

#### Price Summary
- Package: $79.99
- Delivery: $10 (if applicable)
- Total calculated dynamically

#### Payment Display (No checkout processing)
- Zelle: 954-558-9716
- Cash App: $victorrival

Payment is collected **after order review**.

---

### 7.5 Confirmation Page
> Thank you for your order!  
> We’ll review your order and send payment instructions shortly.  
> Orders are confirmed once payment is received.

---

## 8. Admin & Authorization (Phase 1 Scope)

- Admin users defined via Supabase `admin` role
- Admin panel UI **not built in Phase 1**
- Backend must support:
  - Admin-only access to menu CRUD
  - Admin-only access to orders and subscribers

Menu editing will eventually support:
- Uploading images
- Name
- Description
- Price
- Activation/deactivation

---

## 9. Data Schema (High-Level)

### Tables (Minimum)

#### `orders`
- id
- customer_name
- email
- phone
- delivery_type
- address
- delivery_day
- time_window
- allergies
- dietary_preferences
- spice_level
- notes
- total_price
- created_at

#### `subscribers`
- id
- first_name
- last_name
- email
- phone
- contact_preference
- sms_consent
- created_at

#### `menu_items`
- id
- name
- description
- price
- category (breakfast/dinner)
- image_url
- is_active
- created_at

---

## 10. Error Handling & Messaging

### Principles
- No technical error messages shown to users
- All messages must be professional and friendly

### Examples
- Submission failure:
  > Apologies, something went wrong on our end. Please try again shortly.

- Validation issues:
  > Please review the highlighted fields and try again.

---

## 11. Analytics

- Track:
  - Menu signups
  - Orders submitted
- Analytics stored and synced via Supabase
- No third-party analytics required in Phase 1

---

## 12. Out of Scope (Phase 1)

- Online card payments
- User accounts / saved profiles
- Automated SMS sending
- Subscription billing
- Admin dashboard UI

---

## 13. Success Criteria

- Orders can be placed without confusion
- Cutoff logic behaves correctly
- Allergies/preferences are captured per order
- Data is reliably stored in Supabase
- Brand experience feels professional and trustworthy
