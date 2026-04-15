<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/910cc2b6-ad96-461e-8528-2b7fa245a7ec

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Configure env vars (see `.env.example`)
3. Run the app:
   `npm run dev`

## Test GitHub CMS Locally

Vercel serverless routes under `api/` are not served by Vite dev by default. To test `/admin` saves locally:

1. Start the local API server (Terminal 1): `npm run dev:api`
2. Start Vite (Terminal 2): `npm run dev`

Vite proxies `/api/*` to `http://localhost:3001` via `vite.config.ts`.

## Client-Editable Content (No Supabase)

This repo supports a free, simple CMS flow on Vercel:

- Admin edits content at `/admin`
- Saving writes to `src/data/siteDetails.json` in GitHub via `api/site-details.ts`
- Vercel redeploys (or you can also fetch latest via `GET /api/site-details`)

**Required Vercel env vars**

- Client: `VITE_CMS_BACKEND=github`
- Server: `ADMIN_PASSWORD`, `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO` (optional: `GITHUB_BRANCH`, `GITHUB_CONTENT_PATH`)
