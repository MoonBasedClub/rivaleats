# Milestone 03 — Item-Based Ordering + Checkout

## Goal
Remove the weekly base package flow and replace it with an item-based ordering
experience (Uber Eats style) using the existing meal card design on `/menu`.

## UX Flow (New)
1. User browses `/menu` (same layout/design as current breakfast/dinner cards).
2. User adds meals to cart via a **+** icon on each meal card.
3. After adding, the **+** icon area becomes quantity controls (minus / count / plus) + an Edit button.
4. User goes to **/checkout**.
5. Checkout collects:
   - Address (same as current requirements)
   - Phone (same requirement as current)
   - Email (same requirement as current)
6. User can open **Edit** for each cart item inside Checkout.

## Pages & Routes
### `/menu`
- Keep current meal card design.
- Add bottom-right controls:
  - **Default (qty = 0):** single “+” icon.
  - **Qty > 0:** minus / count / plus cluster + Edit button.
 - Base Package $79.99/week is removed from the purchase flow.

### `/order`
- Remove from user flow.
- Redirect to `/checkout` if route must exist.

### `/checkout`
- Replaces `/order`.
- Includes contact + address fields with same validation rules as current order form.
- Shows cart summary with per-item quantity controls and Edit button.
- Cutoff logic behavior stays identical.

## Meal Card Interaction Spec
### Quantity Behavior
- Press **+**: quantity += 1
- Press **–**: quantity -= 1
  - If quantity reaches 0, revert to single “+” icon state.
- Quantity must update cart immediately.

### Edit Button (Per Item)
Stores meal-specific inputs (from the old `/order`):
- Allergies
- Dietary preferences
- Special requests

Edit should open a UI (modal/drawer/inline panel) to capture these notes.
Notes persist per item while it remains in the cart.

## Data Model (Suggested)
### Cart Item
- `itemId`
- `name`
- `price` (if applicable)
- `quantity`
- `editNotes` (string) **or**:
  - `allergies`
  - `dietaryPreferences`
  - `specialRequests`

### Cart
- List of cart items keyed by `itemId`.

## Acceptance Criteria
- Base Package ($79.99/week) is no longer the primary purchase mechanism.
- `/menu` shows:
  - “+” icon when not in cart.
  - Quantity controls + Edit when added.
- Quantity controls revert to “+” at qty = 0.
- Edit data is stored per cart item and accessible from `/menu` and `/checkout`.
- `/order` is removed from flow (redirect or delete), replaced by `/checkout`.
- Checkout collects address/phone/email with unchanged validation rules.
- Friday 7PM cutoff logic is untouched.
