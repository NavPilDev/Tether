# Tether — Founder Screens

## Stats Philosophy Reminder

Founder home screen: maximum 3 numbers, all action-oriented.
Full charts and analytics: `/founder/analytics` only.
TetherAI surfaces one plain-English insight card on the home screen. Not a chart.

---

## Screen 1 — Landing Page (`/`)

**Purpose:** Communicate the core value proposition in under 5 seconds. The output sells itself.

**Layout:** Full-screen hero. No sidebar. Fixed top navbar.

**Navbar:**
- Left: Tether chain-link logo + wordmark
- Right: "Log in" ghost button + "Get started free" primary button (teal-400)

**Hero content (vertically centered):**
- Eyebrow: `"AI-powered marketing for startups"` — 11px, uppercase, teal-800
- H1: `"Your 6-month marketing plan, built in 60 seconds."` — 36px, medium, tracking-tight, max-width 640px
- Subheadline: `"Tether replaces your marketing team. Input your company details and we generate your entire campaign — posts, scripts, and schedules — automatically."` — 16px, text-secondary
- Primary CTA: "Get started free" → `/signup`
- Ghost CTA: "See how it works" (scrolls to below fold)
- Framer Motion: staggered fade-up, 100ms between each element

**Below fold:**
- A styled recreation of the founder dashboard in a browser chrome wrapper
- Shows mock campaign calendar, metric cards, and "next up" post list
- Animate: `whileInView={{ opacity: 1, y: 0 }}` slide up on scroll

---

## Screen 2 — Persona Selection (`/onboarding/persona`)

**Purpose:** Route the user to the correct onboarding flow and apply the correct theme.

**Layout:** Centered, no sidebar, no progress bar.

- Headline: `"Which of these best describes you?"` — 28px
- Subheadline: `"We'll personalize Tether based on your answer."` — text-secondary
- Two cards side by side (agencies removed from v1):
  - **Brand & Startup** — icon: `Building2` — `"I'm looking to market my product."`
  - **UGC Creator** — icon: `Video` — `"I'm looking to create more, faster."`
- Selected state: `border-2 border-[var(--color-teal-400)]` + teal-50 background tint
- On creator selection: immediately apply `data-theme="creator"` to `<html>`
- "Continue" button fades in with Framer Motion after selection

---

## Screen 3–7 — Founder Onboarding (`/onboarding/founder/*`)

5 steps. Progress bar at top fills incrementally (20% per step).
Single-column centered form, max-width 560px. No sidebar.
Each step: large label above each field, 32px gap between fields.
"Continue" button fixed to bottom-right viewport.
Fields animate in with staggered Framer Motion on mount.

### Step 1 — Basics (`/onboarding/founder/basics`)
- Company name (text input)
- What does your product do? (textarea, 4 rows)
- What stage are you at? (pill select: Idea / Pre-launch / Live / Scaling)
- Logo upload (drag-and-drop zone, preview via URL.createObjectURL)

### Step 2 — Audience (`/onboarding/founder/audience`)
- Who is your target customer? (text input, e.g. "college students, gym-goers")
- What problem do you solve for them? (textarea)
- What industry or niche are you in? (multi-select pills — use 21st.dev multi-select if available)

### Step 3 — Brand Voice (`/onboarding/founder/voice`)
- Pick words that describe your tone (multi-select pills: Bold / Playful / Professional / Witty / Minimal / Inspirational)
- A brand you admire the voice of? (text input, optional)
- Anything Tether should never say? (textarea, optional — negative guardrails for Gemini)

### Step 4 — Platforms (`/onboarding/founder/platforms`)
- Which platforms? (icon cards, multi-select: TikTok / Instagram / Twitter-X / LinkedIn / YouTube Shorts)
- How often to post? (pill select: Daily / 3x per week / Weekly / Let Tether decide)
- Primary goal? (pill select: Brand awareness / App downloads / Website traffic / Community growth)

### Step 5 — Creator Budget (`/onboarding/founder/budget`)
- Are you open to working with UGC creators? (Yes / No / Maybe later)
- If Yes: monthly creator budget (range select: Under $500 / $500–$2k / $2k–$5k / $5k+)
- If No: skip directly to dashboard after save

---

## Screen 8 — Founder Dashboard (`/founder/dashboard`)

**Purpose:** Morning briefing. What's happening today. Not an analytics dump.

**Layout:** Founder sidebar (240px) + content area (max-width 1100px, 40px top padding)

**Sidebar:**
- Tether logo at top
- Section label "WORKSPACE"
- Nav: Dashboard (active), Campaigns, Calendar (badge: post count), Scripts, Analytics
- Section label "CREATE"
- Nav: + New campaign
- Bottom: user avatar (initials), company name, settings gear icon
- Active state: teal-50 background, 2px left border teal-400, text teal-800

**Home screen content:**

*Header:*
- Greeting: "Good morning" in text-tertiary, 12px
- Date: current date in 28px medium
- Subtext: "Day X of [Campaign Name] · Y posts scheduled today"

*3 metric cards only (action-oriented):*
- Posts going out today
- Creator approvals waiting on you
- Days remaining in active campaign

*Active campaign block:*
- Campaign name + tagline
- Progress bar (posts published / total)
- Next post: platform icon, time, title
- Buttons: "Open campaign →" and "View calendar"

*Today's schedule strip:*
- Horizontal list of today's posts: time, platform icon, truncated title
- Each item is clickable → opens side panel with full script

*TetherAI insight card (one only):*
- Violet-tinted card
- Plain English sentence: e.g. "Your TikTok posts are getting 2x more engagement than Instagram this week."
- "Adjust campaign" button → navigates to analytics with suggestion pre-loaded

*Trends digest (paying customers only):*
- Collapsed card: "This week in [niche] marketing — compiled by TetherAI"
- Expand to read, or click "View full digest"

---

## Screen 9 — Campaign Setup (`/founder/campaigns/new`)

**Purpose:** Capture everything needed for Gemini to generate the campaign.

**Layout:** Centered, max-width 640px, no sidebar override (sidebar still present).

- What do you want to highlight? (large textarea with example placeholder)
- Campaign name (text input)
- Start date + End date (date pickers)
- Post frequency (pills: Daily / 3x per week / Weekly — pre-filled from onboarding but editable)
- Budget for this campaign (text input, currency formatted)
- Upload promotional media (drag-and-drop, multiple files, preview thumbnails)
- Path selector (required — the user must choose before generating):
  - **Organic Content Only** — generate scripts for the founder to post themselves
  - **Creator Gigs Only** — find creators to execute the campaign
  - **Both** — generate scripts AND create gigs

- Generate button: full-width, 56px tall, teal-400, `Sparkles` icon, `whileHover={{ scale: 1.02 }}`
- On click: POST to `/api/campaigns` then navigate to `/generating?campaignId={id}`

---

## Screen 10 — Generation Screen (`/generating`)

**Purpose:** The magic moment. Must feel weighty and satisfying. This is the most important screen in the app.

**Layout:** Full-screen takeover. No sidebar. Vertically centered content.

- Tether logo mark at top (chain-link icon only, 48px)
- Headline: "Building your campaign..." — 22px medium
- Subtext: "This usually takes about 30 seconds."
- Step list (5 steps, animate in sequence):
  1. "Analyzing your brand voice..."
  2. "Mapping your target audience..."
  3. "Building your content calendar..."
  4. "Writing your post scripts..."
  5. "Matching relevant creators..." (skipped if Organic Only path)
- Each step: spinner while active → teal checkmark on complete (Framer Motion)
- Timing: 1s, 2s, 2.5s, 2.5s, 2s between step completions
- Background: white with slow violet radial pulse (5% opacity, scale 1→1.15→1, 3s loop)
- On completion: navigate to `/founder/campaigns/[id]`

**This screen polls the Spring Boot API** (`GET /api/campaigns/{id}/status`) until status === 'ready'.
Never fake the generation with a timer — always wait for the real API response.
Show the step animations as optimistic UI while waiting.

---

## Screen 11 — Campaign Output (`/founder/campaigns/[id]`)

**Purpose:** The payoff. Show everything generated. Both paths visible if "Both" was selected.

**Layout:** Sidebar present. Full content area. Tabbed interface.

**Tabs:**
- Calendar (default) — full campaign calendar view with all posts scheduled
- Scripts — all generated content pieces with full copy
- Creators — matched creator pool (hidden if Organic Only path)
- Settings — edit campaign details

**Calendar tab:**
- Use `@fullcalendar/react` with dayGridPlugin
- Each event chip: platform dot (platform color) + truncated title
- Clicking chip → side panel slides in (Framer Motion spring)
- Side panel content: platform, date/time, post type badge, full script, music suggestion, media attachments, slide breakdown if carousel, action buttons (Edit / Regenerate / Approve / Copy), hashtags

**Scripts tab:**
- Card grid, 3 columns
- Each card: platform badge, content type (Sponsor read / Skit / Think piece / Tutorial), hook line, 2-line preview, status badge (Draft / Approved / Scheduled)
- Card hover: `y: -2`
- Click → same side panel as calendar

**Creators tab:**
- "TetherAI found X creators for this campaign" header
- Creator cards in a grid: profile photo, name/handle, niche tags, platform icons, follower range, content style descriptors, "View profile" + "Invite to gig" buttons
- Toggle: "Auto-approve any qualified creator" — when on, any creator who applies is auto-approved
- Off-platform creators: "Not on Tether yet" badge + "Send DM" button with pre-written outreach message

---

## Screen 12 — Gig Management (`/founder/gigs`)

**Purpose:** Track all gigs across all campaigns. Approve or reject creator applications.

- Filter row: All / Open / Pending approval / Active / Delivered / Paid
- Gig list (not cards — use a table-style layout):
  - Campaign name, content type, creator (if applied), status badge, deadline, budget
  - "Approve" / "Reject" action buttons inline for pending items
- Budget summary bar at top: total allocated vs spent vs pending
- Auto-approve toggle per gig

---

## Screen 13 — Creator Discovery (`/founder/creators`)

**Purpose:** Browse and build preferred creator relationships.

- Search bar + filter row: niche, platform, follower range, content style
- Creator card grid: photo, handle, niche tags, style tags, follower range, "Favorite" heart, "Tether" link icon, "View profile"
- Favorited creators are highlighted and shown first in gig matching
- "Tethered" creators: established relationship, get first offer on new gigs

---

## Screen 14 — Analytics (`/founder/analytics`)

**Purpose:** Opt-in depth. The user chose to come here.

- Platform switcher tabs: All / TikTok / Instagram / Twitter / LinkedIn / YouTube
- Growth chart: impressions, signups, clicks — toggle between metrics, date range selector
- TetherAI feedback panel: bullet list of what's working / not working, each with "Fix it" button
- Top performing posts: ranked list, click to reuse or generate similar
- PostHog funnel (if connected): social → website → signup conversion rates
- "Connect PostHog" CTA if not yet connected

---

## Screen 15 — Brand Settings (`/founder/settings`)

- Brand profile: name, logo, niche, tone tags, target audience (all editable)
- Connected social accounts: connect/disconnect per platform (OAuth)
- Creator wallet: balance display, top-up button (Stripe), payout history table
- Notification preferences: toggles per event type
