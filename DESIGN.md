# Rival Eats Customer Design System

## Design Direction

Rival Eats should feel like a trusted local meal-prep kitchen, not a generic AI-generated food startup page. The customer site should be warm, operational, and direct: customers need to understand what is available this week, when orders close, whether delivery or pickup works for them, and what happens after checkout.

The visual system should support appetite and confidence without decorative noise. Use fewer floating cards, fewer pills, fewer gradients, and more clear ordering surfaces.

## Current Design Diagnosis

The current customer UI has a solid functional shape: clear navigation, menu and checkout paths, Broward service details, delivery/pickup choices, and simple brand colors. The issue is that the presentation leans heavily on common AI-generated patterns.

Primary AI-slop signals to remove:

- Radial gradient washes in the root layout and homepage hero.
- Large rounded cards used for nearly every section.
- Pill buttons and pill badges used as the default shape.
- Heavy red and green colored shadows on actions.
- Generic Inter plus Poppins pairing without much brand character.
- Repeated card grids that make homepage, menu, FAQ, and summaries feel interchangeable.
- Vague marketing copy such as "brings the heat" and "fast glide from craving to table."
- Decorative elevation where simple borders and clear hierarchy would work better.

Keep these strengths:

- Warm cream base.
- Tomato red as the main ordering action.
- Herb green as a secondary success/subscription cue.
- Direct menu and checkout routes.
- Concrete operational details: Friday cutoff, Sunday/Monday windows, Broward delivery, pickup option, and payment after submission.

## Core Principles

1. Operational First
   Every page should answer a practical ordering question before adding brand flavor.

2. Local, Not Glossy
   Use grounded language, food-service cues, and restrained texture. Avoid SaaS-like hero treatments.

3. Appetite Through Specificity
   Let menu item names, descriptions, prices, weekly timing, and real food imagery carry the experience.

4. Clear Commerce
   Checkout, cart controls, forms, totals, fees, and alerts should feel calm and exact.

5. Fewer Shapes, More Hierarchy
   Use consistent rectangular surfaces, compact sections, and strong typographic rhythm instead of decoration.

## Design Tokens

These names are intended to map cleanly to the existing Tailwind v4 `@theme inline` block in `rivaleats/src/app/globals.css`.

### Color

Use a warm, food-service palette with neutral structure and restrained brand accents.

```css
:root {
  --background: #f7f1e6;
  --foreground: #191713;
}

@theme inline {
  --color-paper: #f7f1e6;
  --color-surface: #fffaf2;
  --color-surface-strong: #ffffff;
  --color-ink: #191713;
  --color-muted: #625a4f;
  --color-border: #d8cbb7;
  --color-border-strong: #b9aa93;

  --color-action: #b42318;
  --color-action-hover: #941b13;
  --color-success: #3f7d37;
  --color-success-hover: #32652c;
  --color-warning-bg: #fff2d8;
  --color-warning-text: #6f4a00;
  --color-danger-bg: #fff0ed;
  --color-danger-text: #9f1f17;

  --shadow-subtle: 0 1px 2px rgba(25, 23, 19, 0.08);
  --shadow-raised: 0 8px 18px rgba(25, 23, 19, 0.10);
}
```

Usage rules:

- `paper` is the page background.
- `surface` is for soft panels and form groups.
- `surface-strong` is for active cards, forms, and summaries.
- `action` is only for primary ordering actions and destructive/error emphasis.
- `success` is for subscription success, positive status, and secondary food-service cues.
- Avoid colored drop shadows. Use color in the element itself, not in the glow around it.

### Typography

The current Inter/Poppins pairing is serviceable but generic. If no new font is introduced, reduce Poppins usage and let hierarchy come from weight, size, and spacing instead of display styling everywhere.

Recommended system:

- Body: Inter or another highly readable sans.
- Display: use sparingly for brand/logo and top-level page headings only.
- Page H1: `text-4xl font-semibold leading-tight` on desktop, `text-3xl` on mobile.
- Section headings: `text-xl` or `text-2xl`, not oversized.
- Labels: `text-sm font-semibold`.
- Eyebrows: use rarely; avoid excessive letter spacing above `0.12em`.

Copy direction:

- Prefer concrete wording: "Order by Friday at 7pm" instead of "Checkout without the chaos."
- Prefer service facts: "Sunday and Monday delivery windows" instead of "Pick your drop."
- Avoid vague premium-food phrases unless they describe a real dish or process.

### Spacing

Use an 8px rhythm.

- Page padding: `px-4 sm:px-6 lg:px-8`.
- Section spacing: `space-y-10` or `space-y-12`, not `space-y-16` by default.
- Panel padding: `p-4` for compact content, `p-6` for forms and summaries.
- Menu card padding: `p-4` or `p-5`.
- Form field spacing: `gap-3` inside groups, `gap-6` between major checkout sections.

### Radius

Reduce inflated roundness.

- Default panel/card radius: `rounded-lg` or `rounded-xl`.
- Form inputs: `rounded-md`.
- Buttons: `rounded-md`.
- Small tags/badges: `rounded-full` allowed.
- Modal: `rounded-xl`.
- Avoid `rounded-3xl` on major page sections.

### Elevation

Use elevation sparingly.

- Default surfaces should rely on `border border-border`.
- Use `shadow-subtle` only when a panel needs separation from the page.
- Use `shadow-raised` for modals and sticky order summaries.
- Remove large generic shadows such as `shadow-[var(--shadow-card)]`, `shadow-2xl`, and colored shadows on CTAs.

## Component Rules

### Navigation

The nav should feel stable and service-oriented.

- Use solid `surface` or `paper`, not translucent gradient-backed glass.
- Keep the logo mark, brand name, and short service line.
- Mobile menu control should be a real menu pattern when implemented; until then, avoid a button labeled "Menu" that does not open anything.
- Primary nav action should be rectangular: `rounded-md bg-action px-4 py-2`.

### Buttons

Buttons should communicate commerce actions clearly.

- Primary: tomato red background, white text, no colored shadow, `rounded-md`.
- Secondary: ink border, surface background, ink text.
- Tertiary: text link or quiet border button.
- Hover should use color and border changes, not vertical translation.
- Reserve full-width buttons for form submission and checkout progress.

Suggested classes:

```tsx
className="inline-flex items-center justify-center rounded-md bg-action px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-action-hover focus:outline-none focus:ring-2 focus:ring-action focus:ring-offset-2"
```

### Badges and Tags

Badges should be small information markers, not decorative pills everywhere.

- Use `rounded-full` only for compact metadata: item count, dietary tags, status.
- Keep badge colors neutral unless the state is important.
- Avoid uppercase tracking on every badge; use it for status labels only.

### Cards and Panels

Cards should represent real items or grouped tasks.

- Menu items can be cards.
- Checkout groups can be panels.
- Whole page sections should not all be framed as floating cards.
- Use white/surface panels with borders and minimal shadow.
- Avoid nested cards inside cards; use dividers, rows, or section headings instead.

### Menu Cards

The menu page should feel like a browsable ordering surface.

- Use denser menu cards with name, price, description, tags, and quantity controls in predictable positions.
- If `image_url` is available, use real food images with fixed aspect ratio.
- If no image is available, avoid decorative placeholders; let typography and structure carry the card.
- Quantity controls should be square or softly rounded buttons, not tiny circles.
- Price should be visible and aligned with the item name.

### Forms

Checkout should be the clearest surface in the app.

- Inputs use `rounded-md`, `bg-surface-strong`, and clear focus rings.
- Radios and checkboxes should be grouped in bordered fieldsets where possible.
- Long forms should be divided by purpose: contact, fulfillment, address, item notes, pricing.
- Error and cutoff messages should use calm alert panels with a clear heading and next action.
- Avoid cream-on-cream nesting that makes field boundaries muddy.

### Alerts

Alerts should be functional, not dramatic.

- Cutoff and outside-zone alerts use warning or danger tokens.
- Include the problem, the consequence, and the required action.
- Do not use display font for alert headings unless it improves scanability.

### Order Summary

Order totals are commerce UI, not decorative content.

- Use table-like rows with aligned labels and values.
- Keep the total visually stronger with a top border.
- Use sticky behavior on desktop only if it does not obscure form progress.
- Make fees explicit: delivery, outside-zone, and total due.

### Footer

The footer should be quiet and useful.

- Keep brand, service area, delivery windows, and links.
- Remove pill link styling unless it matches the button system.
- Use strong contrast, but avoid excessive uppercase tracking.

## Page Guidance

### Homepage

Lead with ordering confidence.

Recommended first screen:

- Brand/service statement: "Weekly prepared meals in Broward."
- Concrete support copy: order cutoff, delivery/pickup windows, and payment expectation.
- Primary action: "Order this week."
- Secondary action: "View menu."
- A compact operations strip for Friday cutoff, Sunday/Monday windows, pickup, and delivery fee.

Avoid:

- Radial gradient hero backgrounds.
- Generic split hero card with decorative dark panel.
- Vague phrases like "brings the heat to your week."
- Excessive cards before the customer sees practical ordering details.

### Menu

Make this the core browsing page.

- Keep last updated and cutoff near the heading.
- Group breakfast and dinner clearly.
- Make item cards compact and consistent.
- Show price even when sample data uses zero; if price is unavailable, use "Price pending" rather than hiding the pricing area.
- Make cart actions easy to scan and tap.

### Checkout

Checkout should be the most utilitarian page.

- Use a two-column layout on desktop: cart/order summary and form details.
- On mobile, cart summary should appear before the form.
- Keep fields rectangular and aligned.
- Convert fulfillment/day choices into segmented or fieldset-style groups during implementation.
- Keep cutoff and outside-zone requirements visibly close to the related controls.

### Contact

Contact should answer support questions quickly.

- Keep email, service area, and timing prominent.
- Use FAQ as simple rows or compact panels.
- Avoid repeating homepage marketing language.

### Confirmation

Confirmation should reassure and instruct.

- Lead with "Order received" rather than a stylized phrase.
- Show total, selected day, and next step in a compact summary.
- Include payment and follow-up expectation.
- Keep the page calm; no large celebratory card styling required.

## AI-Slop Checklist

Before shipping customer-facing UI changes, check the page against this list.

- No decorative radial gradient washes behind the whole app or hero.
- No generic glassmorphism or translucent cards without a functional reason.
- No default purple/blue SaaS palette.
- No page-wide reliance on `rounded-3xl`.
- No full-pill buttons as the default action shape.
- No colored shadows on red or green buttons.
- No repeated card grids where rows, lists, or panels would be clearer.
- No excessive uppercase tracking on routine labels.
- No vague marketing filler in page headings or CTAs.
- No hover movement on every interactive element.
- No one-note beige/red/green palette; neutrals should provide structure and contrast.
- No image placeholders that imply food photography without showing food.

## Implementation Notes

When converting this design system into code:

- Start with `rivaleats/src/app/globals.css` and update the Tailwind `@theme inline` tokens.
- Replace class usage in customer components before admin components.
- Customer scope includes:
  - `rivaleats/src/app/page.tsx`
  - `rivaleats/src/app/menu/MenuClient.tsx`
  - `rivaleats/src/app/checkout/page.tsx`
  - `rivaleats/src/app/contact/page.tsx`
  - `rivaleats/src/app/confirmation/page.tsx`
  - shared customer components under `rivaleats/src/components`
- Leave API routes, schemas, cart behavior, and checkout submission behavior unchanged.
- Prefer small shared component patterns only after the second or third repeated use is clear.

## Acceptance Criteria

A future implementation should be considered successful when:

- The customer site feels like a local prepared-meal ordering experience rather than an AI-generated landing page.
- Customer pages use fewer large rounded cards and fewer decorative effects.
- Menu and checkout are easier to scan at mobile and desktop sizes.
- Ordering facts are visible without reading long marketing paragraphs.
- The token names and component rules are reflected consistently in Tailwind classes.
- `npm run lint`, `npm run typecheck`, and a mobile/desktop visual review pass for `/`, `/menu`, `/checkout`, `/contact`, and `/confirmation`.
