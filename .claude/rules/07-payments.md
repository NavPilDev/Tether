# Tether — Payments (Stripe Connect)

## Model

Tether uses **Stripe Connect** (not basic Stripe) because money flows between three parties:
1. **Founder** pays Tether
2. **Tether** holds funds in escrow
3. **Tether** releases payment to **Creator** on delivery approval

This is a **destination charge** model with manual transfer timing.

---

## Key Concepts

**Stripe Connect account types:**
- Creators use **Express accounts** — Stripe handles their KYC/onboarding, creators get a Stripe-hosted dashboard
- Founders use a standard Stripe Customer attached to Tether's platform account

**Escrow via payment intents:**
- When a founder approves a creator for a gig, a PaymentIntent is created and captured
- Funds are held on Tether's platform Stripe account
- On delivery approval, a Transfer is made to the creator's connected account

**When to collect payment details:**
- Founders: wallet top-up screen (Stripe Customer + card on file)
- Creators: triggered on first gig acceptance attempt — Stripe Connect Express onboarding

---

## Flows

### Founder Wallet Top-Up
```
1. Founder clicks "Add funds" on wallet screen
2. Frontend calls POST /api/payments/wallet/topup { amount }
3. Spring creates Stripe PaymentIntent for the amount
4. Frontend completes payment using Stripe.js + PaymentIntent client_secret
5. On success webhook: update founders.wallet_balance in DB
```

### Gig Payment / Escrow
```
1. Founder approves a creator for a gig
2. Spring checks: founders.wallet_balance >= gig.budget_cents
3. If sufficient: deduct from wallet, create Stripe Transfer (on hold)
   Update gig.stripe_payment_intent_id
4. If insufficient: return 402 with "Insufficient wallet balance"
5. Gig status → 'active'
```

### Payment Release on Delivery Approval
```
1. Creator marks gig as delivered (submits content URL)
2. Gig status → 'delivered', founder is notified
3. Founder reviews and approves delivery
4. Spring executes Stripe Transfer to creator's connected account (stripe_account_id)
5. Gig status → 'paid'
6. Insert notification for creator: "Payment of $X released"
```

### Creator Stripe Onboarding
```
1. Creator tries to accept their first payout
2. POST /api/payments/stripe/onboard
3. Spring creates Stripe Express account for creator
4. Returns Stripe account link URL
5. Frontend redirects creator to Stripe-hosted onboarding
6. On return: Spring checks account status, sets creators.stripe_onboarded = true
```

---

## Stripe Webhook Events to Handle

| Event | Action |
|-------|--------|
| `payment_intent.succeeded` | Credit founder wallet |
| `payment_intent.payment_failed` | Notify founder, revert gig status |
| `account.updated` | Update creator stripe_onboarded status |
| `transfer.created` | Log payout record |

All webhooks validated using Stripe webhook signing secret.

```java
// PaymentController.java
@PostMapping("/api/payments/stripe/webhook")
public ResponseEntity<?> handleWebhook(
    @RequestBody String payload,
    @RequestHeader("Stripe-Signature") String sigHeader
) {
    Event event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
    // Route to appropriate handler by event.getType()
}
```

---

## Environment Variables

```
STRIPE_SECRET_KEY=sk_test_...         (sk_live_ in production)
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PLATFORM_ACCOUNT=acct_...     (Tether's Stripe platform account ID)
```

---

## Important Rules

- Never store card numbers or bank account numbers in Tether's database
- All financial data lives in Stripe
- Tether's DB stores only: stripe_customer_id, stripe_account_id, stripe_payment_intent_id
- wallet_balance in the DB is the source of truth for founder spending power
- Always sync wallet_balance from Stripe webhook events, never trust frontend-reported amounts
