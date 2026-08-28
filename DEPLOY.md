# Deploying SARNSARENE to Vercel

The app is Vercel-ready. It needs one thing Vercel doesn't provide on its
own: a **PostgreSQL** database (the serverless filesystem is ephemeral, so
SQLite is not an option). These steps provision **Neon** Postgres straight
from the Vercel dashboard (free tier).

Roughly 5–10 minutes.

---

## 1. Create the database (Vercel Storage → Neon)

1. Vercel dashboard → project **`sarnsareneweb`** → **Storage** tab →
   **Create Database** → **Neon** (Postgres).
2. Region: pick the one closest to your Vercel region (e.g. Singapore).
3. On **Connect Project**, select `sarnsareneweb` and **All Environments**
   (Production + Preview + Development) → **Connect**.

Vercel now injects the connection env vars automatically — `DATABASE_URL`
(pooled) and `DATABASE_URL_UNPOOLED` (direct, used by `prisma migrate`),
plus a set of `POSTGRES_*` / `PG*` aliases the app doesn't use. Nothing to
copy by hand.

> Prefer a standalone Neon project instead? Create it at <https://neon.tech>,
> then add `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct)
> yourself in step 3.

---

## 2. Production branch

The e-commerce system lives on `feat/ecommerce-system`. Either merge it into
`main` (the default production branch), or point Vercel at the feature
branch: **Settings → Git → Production Branch**. Pushes to any other branch
deploy as **Preview** only.

Framework preset is **Next.js** (auto-detected); leave build & output
settings default — `package.json` already runs
`prisma generate && prisma migrate deploy && next build`.

---

## 3. Environment variables

The database vars come from step 1. Add the rest under **Settings →
Environment Variables** for **Production _and_ Preview**:

| Name | Value |
|---|---|
| `AUTH_SECRET` | a long random string — `openssl rand -base64 32` |
| `ADMIN_EMAIL` | `admin@sarnsarene.com` (or your email) |
| `ADMIN_PASSWORD` | a strong password |
| `NEXT_PUBLIC_SITE_URL` | your production URL, e.g. `https://sarnsareneweb.vercel.app` |
| `PAYMENT_PROVIDER` | `mock` |

Redeploy (Deployments → ⋯ → Redeploy, or push a commit). The build runs
`prisma migrate deploy`, which creates every table in the database.

---

## 4. Seed the database (one time)

The build creates the schema but not the starting data (6 products + the
admin account). Run the seed once against the production database from your
machine (from the repo root):

Grab the connection strings from **Storage → your database → `.env.local`
tab** (or `vercel env pull`), then:

```bash
# point at the production DB just for this command
DATABASE_URL="<pooled url>" DATABASE_URL_UNPOOLED="<direct url>" \
ADMIN_EMAIL="admin@sarnsarene.com" ADMIN_PASSWORD="<the password you set>" \
npm run db:seed
```

On Windows PowerShell:

```powershell
$env:DATABASE_URL="<pooled url>"; $env:DATABASE_URL_UNPOOLED="<direct url>"
$env:ADMIN_EMAIL="admin@sarnsarene.com"; $env:ADMIN_PASSWORD="<the password>"
npm run db:seed
```

The seed is idempotent — safe to re-run. It upserts categories/collections,
skips products that already exist, and upserts the admin user (without
overwriting a changed password).

---

## 5. Done

- Storefront: `https://<your-domain>/shop`
- Admin: `https://<your-domain>/admin` → sign in with `ADMIN_EMAIL` /
  `ADMIN_PASSWORD`
- Health check: `https://<your-domain>/api/health` → `{ "ok": true, "db": "up" }`

---

## Local development

Local dev now needs a Postgres URL too. Easiest path: `vercel env pull .env`
(pulls `DATABASE_URL` + `DATABASE_URL_UNPOOLED` from the linked project), or
create a Neon **branch** for development. `.env.example` shows the shape.
Then:

```bash
npm install
npm run db:deploy   # apply migrations
npm run db:seed     # starting data
npm run dev
```

---

## Notes / follow-ups before a real launch

- **Payments are mocked.** Set `PAYMENT_PROVIDER` + `PAYMENT_SECRET_KEY` and
  implement the four methods in `lib/commerce/payment/gateway.ts`. Checkout
  and order code don't change.
- **Rate limiting is in-memory**, so it's per-serverless-instance on Vercel.
  For real protection move it to Upstash Redis (same `rateLimit()` call
  site in `lib/security/rate-limit.ts`).
- **`/admin/site`** (the landing-page content editor) writes to source files
  and is disabled in production by design — edit `lib/content.ts` +
  `public/images/*` in code and redeploy.
- **Product photography** in `public/images/` is large (some > 2 MB).
  `next/image` optimises delivery automatically, but consider shrinking the
  source files.
- The Nav link to `/shop` is hidden for now — restore it in
  `components/Nav.tsx` (there's a comment marking the two spots).
