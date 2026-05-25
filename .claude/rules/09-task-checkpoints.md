# Tether — Task Checkpoints

## Purpose

This file is the **shared memory** for all Claude Code agents working on Tether.
After completing any sub-task, the agent MUST update this file before ending its session.
The next agent reads this file first to know exactly where to pick up.

This is the context bank described in the Agent Harness architecture.
Without keeping this file updated, context rot will occur across sessions.

---

## How to Use This File

**At the start of every session:**
1. Read `00-master.md` (product rules)
2. Read this file (`09-task-checkpoints.md`)
3. Identify what is COMPLETED, IN PROGRESS, and TODO
4. Pick up from IN PROGRESS or start the next TODO item
5. Do not re-do work marked COMPLETED

**At the end of every session:**
1. Move completed items to the COMPLETED section with a note
2. Update IN PROGRESS with exact state (what file, what function, what line)
3. Add any new TODO items discovered during the session
4. Note any blockers or decisions that need human input

---

## Status Key

- ✅ COMPLETED
- 🔄 IN PROGRESS
- ⬜ TODO
- ❌ BLOCKED (needs human decision)

---

## Infrastructure & Setup

| Task | Status | Notes |
|------|--------|-------|
| Monorepo structure (client/ + server/) | ⬜ | Scaffold exists, verify structure matches 02-frontend-architecture.md |
| CSS custom properties (globals.css) | ⬜ | All tokens from 01-design-system.md |
| Tailwind config | ⬜ | Configure to work with CSS variables |
| Inter font setup (next/font/google) | ⬜ | |
| Supabase client singleton | ⬜ | /client/src/lib/supabase.ts |
| API client (typed fetch wrapper) | ⬜ | /client/src/lib/api.ts |
| UserContext + OnboardingContext | ⬜ | |
| Next.js middleware (route protection) | ⬜ | Persona-based auth guard |
| Spring Boot SecurityConfig (JWT) | ⬜ | Supabase JWKS validation |
| Spring Boot CORS config | ⬜ | |
| Flyway migration setup | ⬜ | |
| Initial DB migration (all tables) | ⬜ | From 06-database-schema.md |
| Supabase RLS policies | ⬜ | From 06-database-schema.md |

---

## Frontend — Public / Onboarding

| Task | Status | Notes |
|------|--------|-------|
| Landing page (/) | ⬜ | |
| Login page | ⬜ | |
| Signup page | ⬜ | |
| Persona selection (/onboarding/persona) | ⬜ | Theme switch on selection |
| Founder onboarding — basics | ⬜ | |
| Founder onboarding — audience | ⬜ | |
| Founder onboarding — voice | ⬜ | |
| Founder onboarding — platforms | ⬜ | |
| Founder onboarding — budget | ⬜ | |
| Creator onboarding — basics | ⬜ | |
| Creator onboarding — platforms | ⬜ | |
| Creator onboarding — niche | ⬜ | |
| Creator onboarding — style | ⬜ | |
| Creator onboarding — availability | ⬜ | |
| Generation loading screen | ⬜ | Most important screen — see 03-founder-screens.md |

---

## Frontend — Founder App

| Task | Status | Notes |
|------|--------|-------|
| Founder sidebar layout | ⬜ | |
| Founder dashboard (home) | ⬜ | Max 3 stats — see stats philosophy |
| Campaign list | ⬜ | |
| Campaign setup (new campaign) | ⬜ | |
| Campaign output — calendar tab | ⬜ | @fullcalendar/react |
| Campaign output — scripts tab | ⬜ | |
| Campaign output — creators tab | ⬜ | |
| Script side panel | ⬜ | Framer Motion spring slide-in |
| Gig management | ⬜ | |
| Creator discovery | ⬜ | |
| Analytics page | ⬜ | |
| Brand settings | ⬜ | |

---

## Frontend — Creator App

| Task | Status | Notes |
|------|--------|-------|
| Creator sidebar layout | ⬜ | Creator theme applied |
| Creator dashboard (gig feed) | ⬜ | Max 3 stats — inbox-first |
| Browse gigs | ⬜ | |
| Gig detail | ⬜ | |
| My jobs | ⬜ | |
| Earnings | ⬜ | |
| Creator profile | ⬜ | Two-column: preview + edit |
| My tethers | ⬜ | |
| Creator settings | ⬜ | |

---

## Backend — Spring Boot

| Task | Status | Notes |
|------|--------|-------|
| CampaignController + Service | ⬜ | |
| GeminiService (async generation) | ⬜ | Prompt structure in 05-backend-architecture.md |
| GigController + Service | ⬜ | |
| CreatorMatchingService | ⬜ | Niche + tone matching logic |
| CreatorController + Service | ⬜ | |
| FounderController + Service | ⬜ | |
| ScriptController + Service | ⬜ | |
| PaymentController + StripeService | ⬜ | See 07-payments.md |
| S3Service + UploadController | ⬜ | Pre-signed URL pattern |
| NotificationService | ⬜ | Writes to notifications table for Supabase Realtime |
| Stripe webhook handler | ⬜ | |
| GlobalExceptionHandler | ⬜ | |

---

## Deployment

| Task | Status | Notes |
|------|--------|-------|
| Vercel project setup | ⬜ | |
| Elastic Beanstalk environment | ⬜ | |
| S3 bucket + CORS + IAM | ⬜ | |
| GitHub Actions — backend deploy | ⬜ | |
| Environment variables — all three envs | ⬜ | |
| Supabase prod project setup | ⬜ | Separate from dev |
| Pre-launch checklist | ⬜ | See 08-deployment.md |

---

## Decisions Needed From Human

| Question | Context |
|----------|---------|
| (Add here as blockers arise) | |

---

## Session Log

| Date | Agent | Work Done | Handed Off To |
|------|-------|-----------|---------------|
| (Agents append to this table after each session) | | | |
