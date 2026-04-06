# Deploying SignalLens on Vercel

SignalLens is designed as a high-performance monorepo. For the best experience on Vercel, we recommend deploying the **Frontend** and **Backend** as two separate projects linked to the same repository.

---

## 1. Deploy the Backend (api)

1. **Create a New Project** on Vercel and import your repository.
2. Set the **Root Directory** to `api`.
3. **Framework Preset**: Other (it will detect `vercel.json`).
4. **Environment Variables**:
   - `SUPABASE_URL`: Your Supabase URL.
   - `SUPABASE_KEY`: Your Supabase logic key.
   - `NODE_ENV`: `production` (highly recommended).
5. **Deploy**. Note the URL (e.g., `https://signallens-api.vercel.app`).

---

## 2. Deploy the Frontend (web)

1. **Create another New Project** on Vercel and import the same repository.
2. Set the **Root Directory** to `web`.
3. **Framework Preset**: Next.js.
4. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: The URL of your **Backend** project from step 1, including the `/api` suffix (e.g., `https://signallens-api.vercel.app/api`).
5. **Deploy**.

---

## Configuration Summary

The application has been prepared with the following:
- **`api/vercel.json`**: Handles serverless routing for the Express server.
- **`api/src/server.ts`**: Refactored to export the app for Vercel's serverless runtime.
- **`web/src/lib/api.ts`**: Flexible API pathing that supports both local development and production environments.

> [!TIP]
> Ensure that your Supabase instance allows connections from your production Vercel IP addresses or has open access for the duration of the deployment.
