# Milestone 02 — Business Rules

## Pricing
- Item-based pricing derived from menu item prices (per-item).
- Delivery fee: $10 flat.
- Pickup: Free.

## Ordering Window
- Orders close **Fridays at 7:00 PM (ET)**.

## Delivery & Pickup
- Available **Sunday or Monday**.
- Service area: **Broward County, Florida**.

## Order Cutoff Logic (Critical)
### Standard Flow
- Orders submitted on or before Friday 7:00 PM ET are scheduled for the upcoming Sunday/Monday.

### Late Orders (After 7:00 PM ET)
- User sees a non-error prompt:
  > “Orders for this week have closed. Would you like to schedule this order for the next delivery window?”
- If confirmed, schedule for the following week.

### Enforcement
- Cutoff logic must remain unchanged and enforced in:
  - Frontend UI
  - Backend validation

## Delivery Zone Logic
### In-Zone (Broward County)
- Normal checkout flow.
- $10 delivery fee applied.

### Out-of-Zone Address
- No hard error.
- Prompt:
  > “Your address appears to be outside our standard delivery zone. Would you like to continue with an additional delivery charge?”
- Additional charge amount is configurable (Phase 1).
- Order may proceed after user confirmation.
