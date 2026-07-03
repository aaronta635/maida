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
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Orders & leads |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | |
| `NEXT_PUBLIC_CRM_ENDPOINT` | No | Webhook for TSV/CRM rows (optional) |

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

Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

If deploy fails with `path0/path0/.next/routes-manifest.json`:

1. Clear **Output Directory** if it was set to `.next` (common mistake).
2. Clear **Root Directory** if it was set to `frontend` (only for monorepos).
3. Redeploy with **Clear build cache** enabled, or set env `VERCEL_FORCE_NO_BUILD_CACHE=1` once.
4. If it still fails, delete the Vercel project and re-import from GitHub (stale path metadata).
