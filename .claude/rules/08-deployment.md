# Tether — Deployment

## Infrastructure Overview

| Service | Platform | Notes |
|---------|----------|-------|
| Next.js frontend | Vercel | Purpose-built for Next.js App Router |
| Spring Boot backend | AWS Elastic Beanstalk | Java 17 platform, auto-scaling |
| File storage | AWS S3 | Promotional media, logo uploads |
| Database + Auth | Supabase | Managed Postgres + Auth + Realtime |
| Payments | Stripe Connect | No self-hosted infrastructure needed |
| Domain | Route 53 (optional) or registrar DNS | Point to Vercel + Beanstalk |

---

## Frontend — Vercel

**Setup:**
1. Connect GitHub repo to Vercel
2. Set root directory to `client/`
3. Framework preset: Next.js (auto-detected)
4. Build command: `npm run build`
5. Output directory: `.next`

**Environment variables in Vercel dashboard:**
```
NEXT_PUBLIC_API_URL=https://api.tether.app    (Beanstalk URL)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PK=
```

**Deployment:**
- Push to `main` → auto-deploy to production
- Push to `dev` → auto-deploy to preview URL
- Never commit `.env.local` to the repo

---

## Backend — AWS Elastic Beanstalk

**Platform:** Java 17 running on Corretto
**Application type:** Web server environment (single instance for MVP, load-balanced for v1 launch)

**Setup:**
1. Create Elastic Beanstalk application: `tether-api`
2. Create environment: `tether-api-prod`
3. Platform: Java 17 (Corretto)
4. Upload: JAR file produced by `mvn clean package -DskipTests`

**Procfile (at server/ root):**
```
web: java -jar target/tether-*.jar
```

**Environment variables in Beanstalk console:**
```
SPRING_DATASOURCE_URL=jdbc:postgresql://...supabase.co:5432/postgres
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=
SUPABASE_JWKS_URI=
GEMINI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
S3_BUCKET_NAME=tether-media-uploads
SERVER_PORT=5000
```

**Health check:**
- Path: `/actuator/health`
- Spring Boot Actuator must be enabled and publicly accessible on this path only

**CORS configuration (SecurityConfig.java):**
```java
@Bean
CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of(
        "https://tether.app",
        "https://*.vercel.app"  // For preview deployments
    ));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    // ...
}
```

---

## AWS S3 — File Storage

**Bucket name:** `tether-media-uploads`
**Region:** `us-east-1`

**Bucket policy:** Private. All access via pre-signed URLs only.

**Upload flow (pre-signed URL pattern):**
```
1. Client requests pre-signed URL: POST /api/uploads/presign { filename, contentType }
2. Spring generates S3 pre-signed PUT URL (15 min expiry)
3. Client uploads directly to S3 using the pre-signed URL (bypasses Spring)
4. Client confirms upload: POST /api/uploads/confirm { s3Key }
5. Spring stores the S3 key/URL in the DB record
```

**CORS on S3 bucket (for direct browser uploads):**
```json
[{
  "AllowedHeaders": ["*"],
  "AllowedMethods": ["PUT"],
  "AllowedOrigins": ["https://tether.app", "https://*.vercel.app"],
  "ExposeHeaders": ["ETag"]
}]
```

**IAM policy for Beanstalk role:**
```json
{
  "Effect": "Allow",
  "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject", "s3:GeneratePresignedUrl"],
  "Resource": "arn:aws:s3:::tether-media-uploads/*"
}
```

---

## CI/CD (GitHub Actions)

Create `.github/workflows/` with two workflows:

### `deploy-frontend.yml`
Triggered by push to `main`. Vercel handles this automatically via GitHub integration — no custom workflow needed unless adding pre-deploy tests.

### `deploy-backend.yml`
```yaml
name: Deploy Backend
on:
  push:
    branches: [main]
    paths: ['server/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '17', distribution: 'corretto' }
      - run: cd server && mvn clean package -DskipTests
      - name: Deploy to Elastic Beanstalk
        uses: einaregilsson/beanstalk-deploy@v22
        with:
          aws_access_key: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          region: us-east-1
          application_name: tether-api
          environment_name: tether-api-prod
          version_label: ${{ github.sha }}
          deployment_package: server/target/tether-*.jar
```

---

## Environments

| Environment | Frontend | Backend | Database |
|-------------|----------|---------|----------|
| Local dev | localhost:3000 | localhost:8080 | Supabase dev project |
| Preview | Vercel preview URL | Beanstalk staging env | Supabase dev project |
| Production | tether.app | api.tether.app | Supabase prod project |

**Use separate Supabase projects for dev and prod.** Never point local dev at the production database.

---

## Pre-Launch Checklist

- [ ] Supabase RLS enabled on all tables
- [ ] Stripe webhook endpoint registered and secret configured
- [ ] S3 bucket policy verified (private, pre-signed only)
- [ ] CORS restricted to production domains
- [ ] Beanstalk health check passing
- [ ] Gemini API key usage limits set in Google Cloud console
- [ ] Environment variables verified in all three environments
- [ ] SSL certificates active on custom domain
- [ ] Flyway migrations run successfully on production DB
