# Maida Lodge — Web app

Next.js app for Maida Lodge: guest ordering, internal CRM tools, and staff dashboard. Deployed on Netlify (target: `maidalodge.com`).

## Quick start

```bash
cp .env.example .env.local   # add Supabase keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the home page is a nav hub to all sections.

## Pages

| Route | Who | What |
|-------|-----|------|
| `/` | Everyone | Nav hub |
| `/order` | Guest | Đặt phòng · gọi món · dịch vụ |
| `/staff` | Lễ tân | Quản lý đơn (Supabase realtime) |
| `/crm/sale` | Sale | Báo giá, phiếu tạm tính / thu, lưu lead |
| `/crm/capture` | Sale, lễ tân | Cọc · check-in · đánh giá |
| `/archive/*` | Reference | Legacy HTML (menu, gallery, …) |

**CRM data flow** (by phone number, append-only):

```
Báo giá → lead → Cọc → check-in → Đánh giá
/crm/sale    /crm/capture (3 tabs)
```

## Environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Browser client (staff session only) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only — guest `/order` via `/api/orders` |
| `NEXT_PUBLIC_CRM_ENDPOINT` | No | Webhook for TSV/CRM rows (optional) |

**Never** prefix `SUPABASE_SERVICE_ROLE_KEY` with `NEXT_PUBLIC_`.

## Security (required before real guest data)

### 1. Auth — `/staff` and `/crm/*`

Middleware redirects unauthenticated users to `/login`. Create staff users in Supabase → **Authentication → Users**.

Set **URL Configuration**:

- Site URL: `https://maida-nine.vercel.app` (or your domain)
- Redirect URLs: `https://maida-nine.vercel.app/auth/callback`

### 2. RLS — block anon REST access

Run **`docs/supabase-auth-rls.sql`** in Supabase SQL Editor. This:

- Enables RLS on `orders` and `order_items`
- Grants **no** policies to `anon` (anon key cannot read/write via REST)
- Grants `authenticated` staff SELECT/INSERT/UPDATE

Verify: `GET https://<project>.supabase.co/rest/v1/orders?select=*` with anon key → empty / 401.

### 3. Guest orders — server-side intake

`/order` POSTs to `/api/orders` (Next.js route handler). The server uses `SUPABASE_SERVICE_ROLE_KEY` — guests never touch Supabase directly.

## Auth (staff / CRM)

`/staff` and `/crm/*` require login. Guests can still use `/`, `/order`, `/archive` without an account.

1. Supabase → **Authentication** → enable Email provider.
2. **Users** → Add user (email + password) for each staff member.
3. Run **`docs/supabase-auth-rls.sql`** in SQL Editor.
4. Add env vars on Vercel (including `SUPABASE_SERVICE_ROLE_KEY`).

Login page: `/login`

## Scripts

```bash
npm run dev      # local dev
npm run build    # production build
npm run start    # serve build
```

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript
- Supabase (orders, order items, realtime staff view)
- Netlify (`@netlify/plugin-nextjs`)

## Project layout

```
app/           routes
components/    UI (order, staff, crm/sale, crm/capture)
lib/crm/       Supabase client, orders, capture, sale engine
data/          menu & catalog types
public/archive legacy HTML snapshots
```

## CRM backend (planned)

Sale & capture tools can POST CRM events to an external ingest API. Today they also copy TSV rows and write leads to Supabase. The full backend contract (JSON schema, `POST /crm/ingest`, idempotency) is in **[docs/crm-backend-brief.md](./docs/crm-backend-brief.md)**.

## Notes

- Internal tools (`/crm/*`, `/staff`) — not for public indexing.
- Legacy URLs redirect via `next.config.ts` (e.g. `/crm/maida-sale-tinhgia.html` → `/crm/sale`).

## Deploy on Vercel

This repo **is** the Next.js app (files at repo root). In Vercel → **Project → Settings → General**:

| Setting | Value |
|---------|--------|
| **Root Directory** | *(leave empty)* |
| **Output Directory** | *(leave empty — do not set `.next`)* |
| **Framework Preset** | Next.js |
| **Build Command** | `npm run build` (default) |

Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

If deploy fails with `path0/path0/.next/routes-manifest.json`:

1. Clear **Output Directory** if it was set to `.next` (common mistake).
2. Clear **Root Directory** if it was set to `frontend` (only for monorepos).
3. Redeploy with **Clear build cache** enabled, or set env `VERCEL_FORCE_NO_BUILD_CACHE=1` once.
4. If it still fails, delete the Vercel project and re-import from GitHub (stale path metadata).
