# Deploying SARNSARENE to Vercel

The app is Vercel-ready. It needs one thing Vercel doesn't provide on its
own: a **PostgreSQL** database (the serverless filesystem is ephemeral, so
SQLite is not an option). These steps use **Neon** — a serverless Postgres
with a free tier.

Roughly 5–10 minutes.

---

## 1. Create the database (Neon)

1. Go to <https://neon.tech> → sign in → **New Project**.
   - Name: `sarnsarene`
   - Region: pick the one closest to your Vercel region (e.g. Singapore).
2. On the project dashboard, open **Connection Details** and copy **both**
   strings:
   - **Pooled connection** — has `-pooler` in the host (or `?pgbouncer=true`).
     This is your `DATABASE_URL`.
   - **Direct connection** — no `-pooler`. This is your `DIRECT_URL`.

   (Or, in the Vercel dashboard, **Storage → Create Database → Neon** and skip
   to step 2 — Vercel wires the env vars in for you; you still set the rest.)

---

## 2. Import the repo into Vercel

1. <https://vercel.com/new> → **Import** `saratkung/sarnsareneweb`.
2. **Root Directory**: leave as the default (`.`) — `package.json` is at the
   repo root.
3. **Production Branch**: set to `feat/ecommerce-system` for now (Settings →
   Git), or merge that branch into `main` first.
4. Framework preset: **Next.js** (auto-detected). Leave build & output
   settings default — `package.json` already runs
   `prisma generate && prisma migrate deploy && next build`.
5. **Don't deploy yet** — add the environment variables first (next step).

---

## 3. Environment variables

In the import screen (or later under **Settings → Environment Variables**),
add these for **Production** (and Preview, if you want preview deploys to
work):

| Name | Value |
|---|---|
| `DATABASE_URL` | Neon **pooled** connection string |
| `DIRECT_URL` | Neon **direct** connection string |
| `AUTH_SECRET` | a long random string — `openssl rand -base64 32` |
| `ADMIN_EMAIL` | `admin@sarnsarene.com` (or your email) |
| `ADMIN_PASSWORD` | a strong password |
| `NEXT_PUBLIC_SITE_URL` | your production URL, e.g. `https://sarnsarene.vercel.app` |
| `PAYMENT_PROVIDER` | `mock` |

Then click **Deploy**. The build runs `prisma migrate deploy`, which creates
every table in the Neon database.

---

## 4. Seed the database (one time)

The build creates the schema but not the starting data (6 products + the
admin account). Run the seed once against the production database from your
machine (from the repo root):

```bash
# point at the production DB just for this command
DATABASE_URL="<neon pooled url>" DIRECT_URL="<neon direct url>" \
ADMIN_EMAIL="admin@sarnsarene.com" ADMIN_PASSWORD="<the password you set>" \
npm run db:seed
```

On Windows PowerShell:

```powershell
$env:DATABASE_URL="<neon pooled url>"; $env:DIRECT_URL="<neon direct url>"
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

Local dev now needs a Postgres URL too. Easiest path: put the **same** Neon
strings in your local `.env` (`.env.example` shows the shape), or create a
Neon **branch** for development. Then:

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
