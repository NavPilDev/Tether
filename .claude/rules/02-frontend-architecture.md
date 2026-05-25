# Tether — Frontend Architecture

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript — strict mode, no `any` |
| Styling | Tailwind CSS + CSS custom properties |
| Animation | Framer Motion |
| Icons | Lucide React |
| UI Components | 21st.dev (sourced and adapted) |
| Auth client | Supabase JS client (`@supabase/supabase-js`) |
| State | React Context + useState (no Redux, no Zustand for v1) |
| Data fetching | Native fetch with typed API client (`/client/src/lib/api.ts`) |
| Calendar | @fullcalendar/react + dayGridPlugin |
| Font | Inter via next/font/google |

---

## Folder Structure

```
client/
├── src/
│   ├── app/
│   │   ├── (marketing)/          → Public pages (no auth required)
│   │   │   ├── page.tsx          → Landing page
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── onboarding/
│   │   │   ├── persona/page.tsx  → User type selection
│   │   │   ├── founder/          → Founder onboarding steps
│   │   │   │   ├── basics/page.tsx
│   │   │   │   ├── audience/page.tsx
│   │   │   │   ├── voice/page.tsx
│   │   │   │   ├── platforms/page.tsx
│   │   │   │   └── budget/page.tsx
│   │   │   └── creator/          → Creator onboarding steps
│   │   │       ├── basics/page.tsx
│   │   │       ├── platforms/page.tsx
│   │   │       ├── niche/page.tsx
│   │   │       ├── style/page.tsx
│   │   │       └── availability/page.tsx
│   │   ├── founder/              → All founder-authenticated screens
│   │   │   ├── layout.tsx        → Founder sidebar layout
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── campaigns/
│   │   │   │   ├── page.tsx      → Campaign list
│   │   │   │   ├── new/page.tsx  → Campaign setup
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx  → Campaign output
│   │   │   │       └── calendar/page.tsx
│   │   │   ├── gigs/page.tsx     → Gig management
│   │   │   ├── creators/page.tsx → Creator discovery
│   │   │   ├── analytics/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── creator/              → All creator-authenticated screens
│   │   │   ├── layout.tsx        → Creator sidebar layout
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── gigs/
│   │   │   │   ├── page.tsx      → Gig feed
│   │   │   │   └── [id]/page.tsx → Gig detail
│   │   │   ├── jobs/page.tsx     → My active/completed jobs
│   │   │   ├── earnings/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── tethers/page.tsx  → Brand relationships
│   │   │   └── settings/page.tsx
│   │   └── generating/page.tsx   → AI generation loading screen
│   ├── components/
│   │   ├── ui/                   → Primitive components (Button, Input, Badge, Card...)
│   │   ├── layout/               → Sidebar, TopBar, PageWrapper
│   │   ├── onboarding/           → Step components, progress bar
│   │   ├── campaign/             → CampaignCard, CalendarChip, ScriptCard, GigCard
│   │   ├── creator/              → CreatorCard, GigFeedItem, EarningsRow
│   │   └── generation/           → GenerationStep, ProgressList, AIShimmer
│   ├── lib/
│   │   ├── api.ts                → Typed fetch wrapper for Spring Boot API
│   │   ├── supabase.ts           → Supabase client singleton
│   │   ├── auth.ts               → Auth helpers (getSession, getToken)
│   │   └── utils.ts              → cn(), formatCurrency(), formatDate()
│   ├── contexts/
│   │   ├── OnboardingContext.tsx → Onboarding form state
│   │   └── UserContext.tsx       → Logged-in user, persona, theme
│   ├── types/
│   │   ├── founder.ts            → Founder, Campaign, Gig, Script types
│   │   ├── creator.ts            → Creator, Job, Earnings types
│   │   └── api.ts                → API request/response types
│   └── styles/
│       └── globals.css           → CSS custom properties, base styles
├── public/
│   └── logo.jpg                  → Tether logo
└── tailwind.config.ts
```

---

## Routing Rules

- `/` → Landing page (public)
- `/login`, `/signup` → Auth pages (public)
- `/onboarding/*` → Onboarding flow (authenticated, no sidebar)
- `/founder/*` → Founder app (authenticated as founder, founder sidebar)
- `/creator/*` → Creator app (authenticated as creator, creator sidebar)
- `/generating` → Generation loading (authenticated, no sidebar, full screen)

**Route protection:**
- Every `/founder/*` route checks: user is authenticated AND `user.persona === 'founder'`
- Every `/creator/*` route checks: user is authenticated AND `user.persona === 'creator'`
- If persona mismatch, redirect to the correct namespace
- Implement protection in `middleware.ts` using Supabase session

---

## Authentication Flow

1. User signs up / logs in via Supabase Auth (email+password for v1)
2. On signup, persona ('founder' | 'creator') is stored in Supabase `users` table
3. Supabase issues a JWT
4. Next.js stores session via `@supabase/auth-helpers-nextjs`
5. Every API call to Spring Boot includes `Authorization: Bearer <supabase_jwt>`
6. Spring Boot validates the JWT and extracts the user ID
7. Theme is applied based on persona: `data-theme="creator"` on `<html>` for creators

**Never store the JWT in localStorage.** Use Supabase's built-in session management.

---

## API Client

All calls to the Spring Boot backend go through `/client/src/lib/api.ts`.
Never use raw fetch in a component or page. Always go through the typed API client.

```typescript
// Pattern for every API function
export async function getCampaigns(): Promise<Campaign[]> {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new APIError(res.status, await res.json())
  return res.json()
}
```

---

## State Management Rules

- **Onboarding state** → `OnboardingContext` (persisted to sessionStorage)
- **User/persona/theme** → `UserContext` (initialized from Supabase session)
- **Server data** → fetched per-page, no global cache for v1
- **UI state** (open/closed panels, active filters) → local `useState` in the component

Do not introduce Redux, Zustand, or React Query for v1. Keep state simple.

---

## Tailwind Configuration

All Tailwind classes that reference theme colors must use CSS variable syntax:
```
bg-[var(--color-teal-400)]
text-[var(--color-text-secondary)]
border-[var(--color-border)]
```

Never use Tailwind's built-in color palette for brand colors (e.g. `bg-teal-400`).
Tailwind utilities for spacing, radius, and layout are fine to use directly.

---

## Page Template

Every page must follow this structure:

```tsx
'use client'
import { motion } from 'framer-motion'

export default function PageName() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="..."
    >
      {/* Page content */}
    </motion.div>
  )
}
```

---

## Environment Variables

```
NEXT_PUBLIC_API_URL=           → Spring Boot base URL
NEXT_PUBLIC_SUPABASE_URL=      → Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= → Supabase anon key
NEXT_PUBLIC_STRIPE_PK=         → Stripe publishable key
```
