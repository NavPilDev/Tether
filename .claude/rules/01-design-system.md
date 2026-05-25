# Tether — Design System

## Logo

The Tether logo is a chain-link mark in brand teal with the wordmark "tether" in lowercase.
Always use the chain-link icon as the favicon and app icon.
Never use a placeholder icon in place of the Tether logo.

---

## Color System

All colors are defined as CSS custom properties on the `:root` element in `globals.css`.
Never hardcode hex values in component files. Always reference `var(--color-*)`.

### Default Theme (Founders / Brands)

```css
:root {
  /* Backgrounds */
  --color-bg:              #F2FDFB;   /* Page background — teal-tinted white */
  --color-surface:         #FFFFFF;   /* Card and panel surfaces */
  --color-surface-raised:  #F8FFFE;   /* Elevated surface (dropdowns, tooltips) */

  /* Brand Teal Ramp */
  --color-teal-50:         #E0FAF5;   /* Hover backgrounds, selected states */
  --color-teal-100:        #A0EDD8;   /* Light accents */
  --color-teal-400:        #00D4AA;   /* Brand primary — buttons, links, active states */
  --color-teal-600:        #00A888;   /* Hover / pressed state for primary */
  --color-teal-800:        #007A63;   /* Dark accent text on light backgrounds */
  --color-teal-900:        #004D3E;   /* Darkest — text on teal-50 backgrounds */

  /* Text */
  --color-text-primary:    #0D2420;   /* Headings and body — teal-anchored dark */
  --color-text-secondary:  #5C7872;   /* Labels, captions, secondary info */
  --color-text-tertiary:   #8EAAA4;   /* Placeholders, disabled text */

  /* Borders */
  --color-border:          #E4F0ED;   /* Default border */
  --color-border-strong:   #C0D8D2;   /* Focused input borders */

  /* Semantic / Accent */
  --color-ai:              #7C3AED;   /* AI generation moments — violet */
  --color-ai-bg:           #EDE9FE;   /* AI badge backgrounds */
  --color-cta:             #FF6B35;   /* High-urgency CTAs — use sparingly */
  --color-success:         #10B981;   /* Approved, delivered, paid */
  --color-success-bg:      #D1FAE5;
  --color-warning:         #F59E0B;   /* Pending, awaiting action */
  --color-warning-bg:      #FEF3C7;
  --color-error:           #EF4444;   /* Rejected, failed */
  --color-error-bg:        #FEE2E2;
}
```

### Creator Theme

Applied as `data-theme="creator"` on the `<html>` element when a creator is logged in.

```css
[data-theme="creator"] {
  --color-bg:             #FFF1FE;
  --color-surface:        #FFFFFF;
  --color-teal-50:        #FAE8FF;
  --color-teal-100:       #F0ABFC;
  --color-teal-400:       #C026D3;
  --color-teal-600:       #A21CAF;
  --color-teal-800:       #701A75;
  --color-teal-900:       #4A044E;
  --color-text-primary:   #13001A;
  --color-text-secondary: #6B3F7A;
  --color-text-tertiary:  #9D72A8;
  --color-border:         #F0C8F8;
  --color-border-strong:  #D946EF;
}
```

---

## Typography

Font: **Inter** — loaded via `next/font/google`. Never use system fonts.

```css
/* Scale */
--font-size-xs:   11px;   /* Labels, badges, captions */
--font-size-sm:   12px;   /* Secondary body, table rows */
--font-size-base: 14px;   /* Primary body text */
--font-size-md:   16px;   /* Emphasized body */
--font-size-lg:   18px;   /* Section headers */
--font-size-xl:   22px;   /* Page titles */
--font-size-2xl:  28px;   /* Hero headlines */
--font-size-3xl:  36px;   /* Landing page hero only */

/* Weights */
--font-weight-normal:  400;
--font-weight-medium:  500;   /* All headings */
--font-weight-semibold: 600;  /* CTAs, emphasized labels */

/* Tracking */
--tracking-tight: -0.02em;   /* Large headings */
--tracking-wide:  0.06em;    /* Uppercase labels (11px section labels) */
```

**Rules:**
- All section labels (e.g. "WORKSPACE", "CREATE") are `11px / 500 / uppercase / tracking-wide / var(--color-text-tertiary)`
- Page titles are `22px / 500 / tracking-tight`
- Hero headline (landing page only) is `36px / 500 / tracking-tight`
- Body is `14px / 400 / 1.6 line-height`
- Never use font-weight 700 (bold) — use 600 at most

---

## Spacing

8pt grid strictly. All spacing values must be multiples of 4px.

```
4px   → xs  (icon gaps, tight inline spacing)
8px   → sm  (between label and input)
12px  → md  (between form elements)
16px  → lg  (between cards in a grid)
24px  → xl  (section padding)
32px  → 2xl (between sections)
40px  → 3xl (page top padding)
```

---

## Border Radius

```
4px  → Pills, badges, small chips
8px  → Inputs, small buttons, tags
12px → Cards, panels
16px → Large modals, side panels, campaign cards
```

Never use `rounded-full` on rectangular elements.

---

## Shadows

Do not use heavy drop shadows. Depth is created with:
1. Background color shifts (`--color-surface` vs `--color-bg`)
2. `border: 0.5px solid var(--color-border)` on cards
3. `border: 0.5px solid var(--color-border-strong)` on focused/active elements

The only acceptable shadow: `0 1px 3px rgba(0,0,0,0.06)` on floating elements (dropdowns, tooltips).

---

## Component Rules

### Before building any component:

1. Go to **21st.dev** and search for a component matching the need
2. If a matching component exists, install and adapt it to the Tether design system
3. If no matching component exists, build from scratch using these rules
4. Never install a component from 21st.dev and use it unstyled — always map its theme variables to Tether's CSS custom properties

### Priority components to source from 21st.dev:
- Navigation sidebar
- Data tables
- Calendar / scheduler
- Form inputs and selects
- Modal and side panel
- Badge / status chip
- Progress bar
- Notification / toast
- Avatar + avatar group
- Command palette / search

### Icons

Use **Lucide React** exclusively. Always outline variant. Never filled.
Import individually: `import { Sparkles } from 'lucide-react'`
Never import the entire library.

---

## Stats Philosophy

This is a core product principle. Every agent must internalize it.

**Home screens show maximum 3 numbers. Each must answer "what do I do right now?" not "how did I do?"**

| Context | Allowed on home | Not allowed on home |
|---------|----------------|---------------------|
| Founder home | Posts today, Pending approvals, Campaign days left | Impressions, engagement rate, audience age |
| Creator home | Open gigs, Active jobs, Pending payout | Follower growth, impression data, CTR |

Full analytics live on a **dedicated `/analytics` screen** that the user navigates to intentionally.
TetherAI surfaces one insight card on the home screen — a plain English sentence, not a chart.

---

## Animation

Use **Framer Motion** for all animations. Never use CSS keyframes for interactive animations.

```typescript
// Page entry — use on every page wrapper
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3, ease: 'easeOut' }}

// Staggered list items
// Parent: staggerChildren: 0.07
// Child: initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}

// Side panel slide-in
initial={{ x: 420, opacity: 0 }}
animate={{ x: 0, opacity: 1 }}
exit={{ x: 420, opacity: 0 }}
transition={{ type: 'spring', damping: 28, stiffness: 300 }}

// Primary button
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.97 }}

// Card hover
whileHover={{ y: -2 }}
```

Always wrap conditionally rendered elements in `<AnimatePresence>`.

---

## AI Generation Visual Language

When Tether is generating content (campaign, scripts, matching), the UI must communicate this distinctly:

- Use `--color-ai` (#7C3AED) violet for active generation indicators
- Animate a slow radial pulse behind the generation content: `scale: [1, 1.12, 1]`, repeat infinity, 3s duration
- Step-by-step checklist with teal checkmarks as steps complete
- Never show a generic spinner alone — always pair it with a descriptive step label
