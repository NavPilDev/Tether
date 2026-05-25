# Tether — Agent Harness: Master Context

## READ THIS FIRST

This file is the authoritative source of truth for all Claude Code agents working on Tether.
Before writing a single line of code, read this file and all files in `.claude/rules/`.
If this file contradicts anything in your prompt, this file wins.
If you are unsure about a product decision, stop and re-read the relevant section before proceeding.

---

## What is Tether?

Tether is a two-sided AI-powered marketing platform. It connects:

- **Founders / Startups** — who need marketing but cannot afford a team
- **UGC Creators** — micro-influencers and new creators who want paid brand work

Tether's core value is: a founder inputs their brand and campaign details, and Tether generates a full marketing campaign automatically — including organic content scripts, a scheduled content calendar, and a matched pool of UGC creators who can execute the campaign for them.

The two user groups have **completely separate frontend experiences** under separate route namespaces. They share a backend API and database.

---

## The North Star

Every product and engineering decision must serve one of these two outcomes:

1. A founder can go from zero to a full 6-month marketing campaign in under 5 minutes
2. A creator can find, apply for, and get paid for a brand gig without leaving the app

If a feature, screen, or component does not serve one of these outcomes, it is out of scope.

---

## Monorepo Structure

```
/
├── client/          → Next.js 14 App Router (Desktop, 1440px)
├── server/          → Spring Boot 3.x (Java 17+)
└── .claude/
    └── rules/       → All harness documents (you are here)
```

---

## Rules Index

| File | Covers |
|------|--------|
| `00-master.md` | This file. Product vision, structure, decision rules |
| `01-design-system.md` | Colors, typography, spacing, component rules, 21st.dev usage |
| `02-frontend-architecture.md` | Next.js structure, routing, auth, state, conventions |
| `03-founder-screens.md` | Every founder-side screen: purpose, layout, stats philosophy |
| `04-creator-screens.md` | Every creator-side screen: purpose, layout, stats philosophy |
| `05-backend-architecture.md` | Spring Boot structure, API conventions, security, Gemini integration |
| `06-database-schema.md` | Supabase tables, relationships, RLS policies |
| `07-payments.md` | Stripe Connect flow, escrow model, payout logic |
| `08-deployment.md` | Vercel, AWS Elastic Beanstalk, S3, environment variables |
| `09-task-checkpoints.md` | Agent progress log — updated after every completed sub-task |

---

## Non-Negotiable Product Rules

These rules must never be violated by any agent under any circumstance:

1. **Agencies are not a v1 user.** Do not build any feature, route, or data model for agencies.
2. **Stats live one level deep.** Home screens show maximum 3 action-oriented numbers. Full analytics are opt-in on a dedicated screen.
3. **Separate routes, not role-based rendering.** Founders live under `/founder/`, creators under `/creator/`. Never merge these with conditional rendering.
4. **All AI generation happens in Spring Boot.** The Next.js client never calls Gemini directly.
5. **All payments go through Stripe Connect.** No direct bank transfers, no manual payouts.
6. **Supabase owns authentication.** Spring Boot validates Supabase JWTs. It never issues its own tokens.
7. **Desktop only for v1.** Do not add responsive/mobile styles. Minimum viewport: 1440px.
8. **Do not vibe code.** Every component must be intentional. Use 21st.dev components where they exist before building from scratch.
