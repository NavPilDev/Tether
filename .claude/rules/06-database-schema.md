# Tether — Database Schema (Supabase / PostgreSQL)

## Rules

- Supabase manages authentication. The `auth.users` table is owned by Supabase.
- All application tables live in the `public` schema.
- Every table has `created_at` and `updated_at` timestamps (auto-managed).
- All primary keys are UUIDs matching Supabase auth UUIDs where applicable.
- Row Level Security (RLS) is enabled on all tables.
- Flyway manages all schema migrations in `server/src/main/resources/db/migration/`.

---

## Tables

### `public.founders`
Extends Supabase auth user for founder-specific profile data.

```sql
CREATE TABLE public.founders (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name      TEXT NOT NULL,
  product_description TEXT,
  stage             TEXT,                        -- 'idea' | 'pre_launch' | 'live' | 'scaling'
  target_audience   TEXT,
  problem_solved    TEXT,
  niches            TEXT[],                      -- ['fitness', 'tech', ...]
  tone_tags         TEXT[],                      -- ['bold', 'playful', ...]
  admired_brand     TEXT,
  negative_guardrails TEXT,
  platforms         TEXT[],                      -- ['tiktok', 'instagram', ...]
  post_frequency    TEXT,                        -- 'daily' | '3x_week' | 'weekly' | 'auto'
  primary_goal      TEXT,
  open_to_creators  BOOLEAN DEFAULT true,
  monthly_creator_budget TEXT,
  logo_url          TEXT,
  wallet_balance    DECIMAL(10,2) DEFAULT 0.00,
  stripe_customer_id TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### `public.creators`
Extends Supabase auth user for creator-specific profile data.

```sql
CREATE TABLE public.creators (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  handle            TEXT NOT NULL,
  location          TEXT,
  profile_photo_url TEXT,
  niches            TEXT[] NOT NULL,             -- Primary matching key
  content_description TEXT,
  best_content_url  TEXT,
  style_tags        TEXT[],                      -- ['energetic', 'funny', ...]
  content_types     TEXT[],                      -- ['short_form_video', 'carousels', ...]
  platforms         TEXT[] NOT NULL,
  follower_range    TEXT,                        -- 'under_1k' | '1k_10k' | '10k_100k' | '100k_plus'
  max_gigs_per_month INT DEFAULT 3,
  min_rate_cents    INT DEFAULT 0,               -- stored in cents
  stripe_account_id TEXT,                        -- Stripe Connect account ID
  stripe_onboarded  BOOLEAN DEFAULT false,
  tiktok_url        TEXT,
  instagram_url     TEXT,
  youtube_url       TEXT,
  twitter_url       TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### `public.campaigns`

```sql
CREATE TABLE public.campaigns (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id        UUID NOT NULL REFERENCES public.founders(id),
  name              TEXT NOT NULL,
  highlight         TEXT NOT NULL,               -- What to highlight (campaign brief)
  path              TEXT NOT NULL,               -- 'organic' | 'gigs' | 'both'
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  post_frequency    TEXT NOT NULL,
  budget_cents      INT DEFAULT 0,
  status            TEXT DEFAULT 'pending',      -- 'pending' | 'generating' | 'ready' | 'active' | 'completed' | 'failed'
  promotional_media_urls TEXT[],
  gemini_job_id     TEXT,                        -- For tracking async generation
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### `public.scripts`
Each script is one piece of generated content (one post, one reel, one carousel, etc.)

```sql
CREATE TABLE public.scripts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id       UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  platform          TEXT NOT NULL,               -- 'tiktok' | 'instagram' | 'twitter' | 'linkedin' | 'youtube'
  content_type      TEXT NOT NULL,               -- 'sponsor_read' | 'skit' | 'think_piece' | 'tutorial' | 'carousel' | 'caption'
  hook_line         TEXT NOT NULL,               -- First line / title of the script
  full_script       TEXT NOT NULL,
  slides            JSONB,                       -- [{slide: 1, copy: "..."}, ...] for carousels
  music_suggestion  TEXT,
  hashtags          TEXT[],
  suggested_post_time TIMESTAMPTZ,
  status            TEXT DEFAULT 'draft',        -- 'draft' | 'approved' | 'scheduled' | 'posted'
  gig_id            UUID REFERENCES public.gigs(id),  -- Set if this script became a gig
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### `public.gigs`

```sql
CREATE TABLE public.gigs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id       UUID NOT NULL REFERENCES public.campaigns(id),
  script_id         UUID REFERENCES public.scripts(id),
  founder_id        UUID NOT NULL REFERENCES public.founders(id),
  creator_id        UUID REFERENCES public.creators(id),  -- null until applied
  title             TEXT NOT NULL,
  content_type      TEXT NOT NULL,
  platform          TEXT NOT NULL,
  budget_cents      INT NOT NULL,
  deadline          DATE NOT NULL,
  status            TEXT DEFAULT 'open',         -- 'open' | 'applied' | 'approved' | 'active' | 'delivered' | 'paid' | 'rejected'
  auto_approve      BOOLEAN DEFAULT false,
  delivery_url      TEXT,                        -- URL submitted by creator on delivery
  stripe_payment_intent_id TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### `public.tethers`
Represents an ongoing preferred relationship between a founder and creator.

```sql
CREATE TABLE public.tethers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id        UUID NOT NULL REFERENCES public.founders(id),
  creator_id        UUID NOT NULL REFERENCES public.creators(id),
  status            TEXT DEFAULT 'pending',      -- 'pending' | 'active' | 'declined'
  initiated_by      TEXT NOT NULL,               -- 'founder' | 'creator'
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(founder_id, creator_id)
);
```

### `public.favorites`
Founders can favorite creators for priority matching.

```sql
CREATE TABLE public.favorites (
  founder_id        UUID REFERENCES public.founders(id),
  creator_id        UUID REFERENCES public.creators(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (founder_id, creator_id)
);
```

### `public.notifications`
Used with Supabase Realtime to push notifications to clients.

```sql
CREATE TABLE public.notifications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id),
  type              TEXT NOT NULL,               -- 'gig_applied' | 'gig_approved' | 'gig_rejected' | 'payment_released' | 'campaign_ready' | 'tether_request'
  title             TEXT NOT NULL,
  body              TEXT,
  read              BOOLEAN DEFAULT false,
  metadata          JSONB,                       -- { gigId, campaignId, creatorId, amount... }
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Row Level Security Policies

```sql
-- Founders can only see their own data
ALTER TABLE public.founders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "founders_own_data" ON public.founders
  FOR ALL USING (auth.uid() = id);

-- Creators can only see their own data
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creators_own_data" ON public.creators
  FOR ALL USING (auth.uid() = id);

-- Founders see their own campaigns; service role sees all
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "founders_own_campaigns" ON public.campaigns
  FOR ALL USING (auth.uid() = founder_id);

-- Gigs: founders see their own; creators see open gigs + their own applied gigs
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "founders_gigs" ON public.gigs
  FOR ALL USING (auth.uid() = founder_id);
CREATE POLICY "creators_gigs" ON public.gigs
  FOR SELECT USING (status = 'open' OR auth.uid() = creator_id);

-- Notifications: users see only their own
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);
```

---

## Supabase Realtime Subscriptions

Enable realtime on these tables in Supabase dashboard:
- `public.notifications` — for in-app notification delivery to both user types
- `public.campaigns` — for founder to receive campaign ready signal
- `public.gigs` — for creator to receive approval notification

Frontend subscribes via:
```typescript
supabase
  .channel('notifications')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications',
      filter: `user_id=eq.${userId}` }, handleNotification)
  .subscribe()
```
