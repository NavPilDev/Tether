# Tether — Backend Architecture (Spring Boot)

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Spring Boot 3.x |
| Language | Java 17+ |
| Security | Spring Security + OAuth2 Resource Server (Supabase JWT validation) |
| Database | Supabase (PostgreSQL) via Spring Data JPA |
| Migrations | Flyway |
| AI | Google Gemini API (via official Java SDK) |
| Payments | Stripe Java SDK (Stripe Connect) |
| File Storage | AWS S3 (via AWS SDK for Java v2) |
| Mapping | MapStruct |
| Boilerplate reduction | Lombok |
| Health checks | Spring Boot Actuator |
| Testing | JUnit 5 + Mockito + Testcontainers (PostgreSQL) |

---

## Required Dependencies (pom.xml)

```xml
<!-- Core -->
<dependency>spring-boot-starter-web</dependency>
<dependency>spring-boot-starter-data-jpa</dependency>
<dependency>spring-boot-starter-validation</dependency>
<dependency>spring-boot-starter-actuator</dependency>

<!-- Security + Auth -->
<dependency>spring-boot-starter-security</dependency>
<dependency>spring-boot-starter-oauth2-resource-server</dependency>
<dependency>io.jsonwebtoken:jjwt-api:0.12.x</dependency>
<dependency>io.jsonwebtoken:jjwt-impl:0.12.x</dependency>
<dependency>io.jsonwebtoken:jjwt-jackson:0.12.x</dependency>

<!-- Database -->
<dependency>org.postgresql:postgresql (runtime)</dependency>
<dependency>org.flywaydb:flyway-core</dependency>

<!-- AI -->
<dependency>com.google.cloud:google-cloud-vertexai</dependency>
<!-- OR: com.google.ai.client.generativeai:generativeai (Gemini API direct) -->

<!-- Payments -->
<dependency>com.stripe:stripe-java:latest</dependency>

<!-- AWS -->
<dependency>software.amazon.awssdk:s3</dependency>
<dependency>software.amazon.awssdk:sts</dependency>

<!-- Utilities -->
<dependency>org.projectlombok:lombok</dependency>
<dependency>org.mapstruct:mapstruct</dependency>

<!-- Testing -->
<dependency>spring-boot-starter-test</dependency>
<dependency>org.testcontainers:postgresql</dependency>
<dependency>org.testcontainers:junit-jupiter</dependency>
```

---

## Folder Structure

```
server/
└── src/main/java/com/tether/
    ├── TetherApplication.java
    ├── config/
    │   ├── SecurityConfig.java       → JWT validation, CORS, route protection
    │   ├── SupabaseJwtConfig.java    → JWKS endpoint config
    │   ├── StripeConfig.java         → Stripe API key init
    │   ├── GeminiConfig.java         → Gemini client config
    │   └── S3Config.java             → AWS S3 client config
    ├── controller/
    │   ├── AuthController.java       → /api/auth/* (profile sync on first login)
    │   ├── CampaignController.java   → /api/campaigns/*
    │   ├── GigController.java        → /api/gigs/*
    │   ├── CreatorController.java    → /api/creators/*
    │   ├── FounderController.java    → /api/founders/*
    │   ├── ScriptController.java     → /api/scripts/*
    │   ├── PaymentController.java    → /api/payments/*
    │   └── UploadController.java     → /api/uploads/*
    ├── service/
    │   ├── CampaignService.java
    │   ├── GeminiService.java        → All Gemini API calls live here
    │   ├── GigService.java
    │   ├── CreatorMatchingService.java → Niche + tone matching logic
    │   ├── StripeService.java
    │   ├── S3Service.java
    │   └── NotificationService.java  → Supabase Realtime triggers
    ├── repository/
    │   ├── CampaignRepository.java
    │   ├── GigRepository.java
    │   ├── ScriptRepository.java
    │   ├── CreatorRepository.java
    │   └── FounderRepository.java
    ├── model/
    │   ├── Campaign.java
    │   ├── Gig.java
    │   ├── Script.java
    │   ├── Creator.java
    │   ├── Founder.java
    │   └── enums/
    │       ├── CampaignStatus.java
    │       ├── GigStatus.java
    │       ├── ContentType.java
    │       ├── Platform.java
    │       └── Persona.java
    ├── dto/
    │   ├── request/                  → Inbound DTOs (validated with @Valid)
    │   └── response/                 → Outbound DTOs (mapped via MapStruct)
    ├── mapper/                       → MapStruct mappers (entity ↔ DTO)
    ├── exception/
    │   ├── GlobalExceptionHandler.java
    │   ├── ResourceNotFoundException.java
    │   └── UnauthorizedException.java
    └── security/
        ├── JwtAuthFilter.java
        └── SupabaseJwtValidator.java
```

---

## Authentication — Supabase JWT Validation

Spring Boot acts as an **OAuth2 Resource Server**. It never issues tokens.

```yaml
# application.yml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          jwk-set-uri: https://<your-supabase-project>.supabase.co/auth/v1/.well-known/jwks.json
```

```java
// SecurityConfig.java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/sync", "/actuator/health").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        return http.build();
    }
}
```

**Extracting user ID from token in controllers:**
```java
@GetMapping("/campaigns")
public ResponseEntity<?> getCampaigns(@AuthenticationPrincipal Jwt jwt) {
    String userId = jwt.getSubject(); // Supabase user UUID
    return ResponseEntity.ok(campaignService.getCampaignsByFounder(userId));
}
```

---

## API Conventions

- Base path: `/api`
- All responses wrapped in a standard envelope:
```json
{
  "data": { ... },
  "error": null,
  "timestamp": "2025-01-01T00:00:00Z"
}
```
- All errors return the envelope with `data: null` and `error: { code, message }`
- HTTP status codes used correctly: 200, 201, 400, 401, 403, 404, 409, 500
- All list endpoints support `page`, `size`, `sort` query params

---

## Core API Endpoints

### Campaigns
```
POST   /api/campaigns                    → Create campaign, trigger Gemini generation
GET    /api/campaigns                    → List founder's campaigns
GET    /api/campaigns/{id}               → Get campaign with all scripts + gigs
GET    /api/campaigns/{id}/status        → Poll generation status (PENDING/GENERATING/READY/FAILED)
PUT    /api/campaigns/{id}               → Update campaign details
DELETE /api/campaigns/{id}               → Archive campaign
```

### Gigs
```
GET    /api/gigs                         → List gigs (founders: their gigs, creators: matched gigs)
GET    /api/gigs/{id}                    → Get gig detail
POST   /api/gigs/{id}/apply              → Creator applies for gig
PUT    /api/gigs/{id}/approve            → Founder approves creator application
PUT    /api/gigs/{id}/reject             → Founder rejects creator application
POST   /api/gigs/{id}/deliver            → Creator marks content as delivered (+ URL)
PUT    /api/gigs/{id}/release-payment    → Founder approves delivery, releases escrow
```

### Creators
```
GET    /api/creators                     → Browse creators (founders only, filterable)
GET    /api/creators/{id}               → Creator profile
GET    /api/creators/me                  → Authenticated creator's own profile
PUT    /api/creators/me                  → Update creator profile
POST   /api/creators/{id}/favorite       → Founder favorites a creator
POST   /api/creators/{id}/tether        → Send tether request
```

### Scripts
```
GET    /api/scripts?campaignId={id}      → Get all scripts for a campaign
GET    /api/scripts/{id}                 → Get single script
POST   /api/scripts/{id}/regenerate      → Trigger Gemini to regenerate one script
PUT    /api/scripts/{id}                 → Edit script copy manually
PUT    /api/scripts/{id}/approve         → Founder approves script
```

### Payments
```
POST   /api/payments/wallet/topup        → Founder adds to creator wallet (Stripe)
GET    /api/payments/wallet              → Get wallet balance
GET    /api/payments/history             → Payout history
POST   /api/payments/stripe/onboard      → Trigger Stripe Connect onboarding for creator
GET    /api/payments/stripe/status        → Check Stripe Connect account status
```

### Uploads
```
POST   /api/uploads/presign              → Get pre-signed S3 URL for direct upload
POST   /api/uploads/confirm              → Confirm upload and store file record
```

---

## Gemini Integration (GeminiService)

All Gemini calls happen asynchronously. Campaign generation runs in a background thread.
Campaign status is polled by the frontend until status === 'READY'.

```java
@Service
public class GeminiService {

    // Campaign generation prompt structure:
    // 1. System context: Tether is a marketing platform
    // 2. Brand profile: name, product description, audience, niche, tone, negative guardrails
    // 3. Campaign brief: what to highlight, duration, frequency, path (organic/gigs/both)
    // 4. Output format: strict JSON schema with scripts array, each containing:
    //    - platform, contentType, hookLine, fullScript, musicSuggestion,
    //      slidesBreakdown (if carousel), hashtags, suggestedPostTime

    public CompletableFuture<GeneratedCampaign> generateCampaign(Campaign campaign, Founder founder) {
        // Build prompt from campaign + founder profile
        // Call Gemini API
        // Parse JSON response
        // Save scripts to DB
        // Update campaign status to READY
        // Trigger notification to founder
    }

    public Script regenerateScript(Script script, Founder founder) {
        // Single-script regeneration with same brand context
    }
}
```

**Gemini output must be valid JSON.** Use response schema enforcement if the SDK supports it.
Always include error handling for malformed Gemini responses — retry up to 3 times before marking campaign as FAILED.

---

## Creator Matching (CreatorMatchingService)

Matching is niche + tone based for v1. No ML. Pure database query logic.

```java
// Matching criteria (all weighted):
// 1. Niche overlap: creator niches ∩ founder target niches (primary key)
// 2. Content style overlap: creator style tags ∩ founder tone tags
// 3. Platform overlap: creator platforms ∩ campaign platforms
// 4. Follower range: any range accepted in v1 (filter added in v2)
// 5. Availability: creator max_gigs_per_month > current active gig count
// 6. Minimum rate: creator min_rate <= gig budget
// 7. Tethered / favorited creators: shown first

// Returns: ordered list of CreatorMatchDTO with match score
```

---

## Environment Variables (server)

```
SUPABASE_JWT_ISSUER=         → https://<project>.supabase.co/auth/v1
SUPABASE_JWKS_URI=           → https://<project>.supabase.co/auth/v1/.well-known/jwks.json
DATABASE_URL=                → Supabase PostgreSQL connection string
GEMINI_API_KEY=              → Google AI Studio API key
STRIPE_SECRET_KEY=           → Stripe secret key (sk_live_ or sk_test_)
STRIPE_WEBHOOK_SECRET=       → Stripe webhook signing secret
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=                  → us-east-1
S3_BUCKET_NAME=              → tether-media-uploads
```
