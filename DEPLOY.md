# Railway Deployment Guide

This app runs as a **single Railway service**: the NestJS API serves the Angular SPA at `/`
and all API endpoints at `/api`. No CORS configuration is needed because both are same-origin.

---

## Prerequisites

- A Railway account: https://railway.app
- The repository pushed to GitHub: `jobshimo/d-day-ltp`
- `openssl` available locally (to generate JWT_SECRET)

---

## Step-by-step deployment

### 1. Create a Railway account

Go to https://railway.app and sign up or log in with GitHub.

### 2. Create a new project from GitHub

1. Click **"+ New"** on the Railway dashboard.
2. Select **"Deploy from GitHub repo"**.
3. Authorize Railway to access your GitHub account if prompted.
4. Search for and select the `jobshimo/d-day-ltp` repository.
5. Railway detects the `nixpacks.toml` and `railway.json` automatically — no manual build
   configuration is required.

### 3. Add a PostgreSQL database

1. Inside the new project, click **"+ New"**.
2. Select **"Database"** → **"Add PostgreSQL"**.
3. Railway provisions a Postgres instance and automatically injects the `DATABASE_URL`
   environment variable into your service. You do not need to set it manually.

### 4. Set service environment variables

In the service settings, go to **Variables** and add:

| Variable | Value | Notes |
|----------|-------|-------|
| `JWT_SECRET` | `<generated>` | Generate with: `openssl rand -hex 32` |
| `NODE_ENV` | `production` | Required for fail-fast checks and security hardening |
| `NODE_OPTIONS` | `--max-old-space-size=2048` | Prevents OOM during Angular build on Railway |

`PORT` and `DATABASE_URL` are injected automatically by Railway — do not set them manually.

To generate a JWT_SECRET locally:
```
openssl rand -hex 32
```

### 5. Verify build and start commands

The repository includes `railway.json` and `nixpacks.toml`. Railway uses them automatically.
The build runs in this order:
1. `npm ci --legacy-peer-deps` — installs all dependencies
2. `npx prisma generate` — generates the Prisma client for the Railway container
3. `npx prisma migrate deploy` — runs pending SQL migrations against the Postgres database
4. `npx nx build learning-app --configuration=production` — builds the Angular SPA
5. `npx nx build api --configuration=production` — builds the NestJS API

The start command is: `node dist/apps/api/main.js`

### 6. First deploy

1. Trigger a deploy (Railway deploys automatically on push, or click **"Deploy"** manually).
2. Watch the build logs in the Railway dashboard.
3. Confirm `prisma migrate deploy` completes without errors — this creates the `users` and
   `module_progress` tables in Postgres.
4. Once the deploy is live, open the Railway-assigned URL (shown in the dashboard).
5. Verify the health endpoint: `GET <railway-url>/api/health` should return `{"status":"ok"}`.
6. Open `<railway-url>/` in a browser — the Angular app should load.

---

## Architecture notes

- **Single service**: the NestJS app serves the Angular SPA via `@nestjs/serve-static` for
  all non-`/api` routes, and handles all API calls under `/api`. This eliminates CORS entirely.
- **SPA fallback**: deep Angular routes (e.g. `/modules/1/lesson/2`) return `index.html`,
  so the Angular router handles them client-side.
- **Guest mode**: users can use the app without registering. Progress is stored in IndexedDB.
  After login, progress is synced to Postgres automatically.
- **Known limitations**: there is no password recovery. A user who forgets their password
  cannot recover their account. This is disclosed in the registration screen.

---

## Troubleshooting

### OOM during Angular build
**Symptom**: build fails with JavaScript heap out of memory.
**Fix**: `NODE_OPTIONS=--max-old-space-size=2048` is already set in step 4. If it still fails,
consider upgrading to a Railway paid plan (more memory) or reduce budget thresholds.

### Prisma openssl error
**Symptom**: `Error: Unable to find libssl` at runtime.
**Fix**: the `nixpacks.toml` includes `openssl` in `nixPkgs`. If you customized the build
config and removed it, add it back: `nixPkgs = ["nodejs_22", "openssl"]`.

### DATABASE_URL not set
**Symptom**: `prisma migrate deploy` fails with "Environment variable not found: DATABASE_URL".
**Fix**: ensure the Postgres database is linked to the service in Railway (step 3). Railway
injects `DATABASE_URL` automatically when the Postgres plugin is connected.

### JWT_SECRET not set
**Symptom**: server exits immediately with "JWT_SECRET env var is required in production".
**Fix**: set `JWT_SECRET` in the service Variables (step 4).

### App loads but API calls fail (404)
**Symptom**: `/api/health` returns 404.
**Fix**: confirm `NODE_ENV=production` is set. The `/api` global prefix is always active
regardless of environment, so this is unlikely — but verify the Railway URL and endpoint path.
