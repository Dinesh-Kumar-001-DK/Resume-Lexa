# Deployment Guide (Render & Vercel)

This document maps out the exact step-by-step instructions to take this application out of local development and put it live onto the internet. We will deploy the **Backend Server to Render** and the **Frontend React App to Vercel**.

---

## Phase 1: Deploying the Backend (Node.js API) to Render

Render is a straightforward host for Node.js backends.

1. Create a free account at [Render.com](https://render.com/).
2. On the dashboard, click **"New +"** and select **"Web Service"**.
3. Connect your GitHub account, and find/select your `Resume-Lexa` repository.
4. **Configuration Fields:**
   - **Name:** `resume-lexa-api` (or a name you prefer)
   - **Root Directory:** Type `server` in the box. *(This is crucial! It tells Render to only build the backend folder)*
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. **Environment Variables:**
   Scroll down to the "Environment Variables" section and add the exact contents of your `server/.env` file:
   - `PORT`: `5000`
   - `MONGODB_URI`: (Your Mongo string)
   - `GEMINI_API_KEY`: (Your Gemini key)
   - `SUPABASE_URL`: (Your Supabase URL)
   - `SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
6. Click **Create Web Service**. 
7. Sit back and watch it deploy! Once it finishes, look at the top-left of the page. You will see your live URL (something like `https://resume-lexa-api.onrender.com`). **Copy this URL**.

---

## Phase 2: Deploying the Frontend (React App) to Vercel

Vercel is the ultimate optimized host for front-end interface deployments.

1. Go to [Vercel.com](https://vercel.com/) and log in with your GitHub account.
2. Click **"Add New"** > **"Project"**.
3. Import your `Resume-Lexa` repository from the list.
4. Expand the **"Build and Output Settings"** and **"Configure Project"** parameters:
   - **Framework Preset:** Create React App (or Vite, depending on if you switch to Vite later). It usually auto-detects.
   - **Root Directory:** Click the Edit button, and choose `client`. *(Crucial!)*
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
5. **Environment Variables:**
   Open up the Environment Variables dropdown and add the variables necessary for the frontend to connect:
   - `VITE_SUPABASE_URL`: (Your Supabase URL)
   - `VITE_SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
6. **Wait!** Before clicking deploy, you need to point your frontend to your newly live Render API. The easiest way without hard-coding it in the script is setting standard API proxy mechanisms, but for full production, modify your deployed `client/src/utils/api.ts` base-url to:
   - `baseURL: 'https://resume-lexa-api.onrender.com/api'` *(You can either do this via code push, or setting an ENV param in Vercel like `REACT_APP_API_URL`)*.
7. Click **Deploy**! Wait for Vercel to give you your new `.vercel.app` frontend domain.

---

## Phase 3: Update Supabase Authentication Domains (Critical!)

Now that your app lives on real production domains, Supabase needs authorization to interact with those new homes!

### Add the Vercel Domain to Site URL
1. Go to your **Supabase Dashboard** > **Authentication** > **URL Configuration**.
2. Under **Site URL**, paste your fresh Vercel Application URL (e.g. `https://resume-lexa-front.vercel.app`).
3. Under **Redirect URLs**, click "Add URL" and type: `https://resume-lexa-front.vercel.app/*` (This allows redirects to `/dashboard`).

### Update your Google Cloud Redirect URI
Google isn't involved with your Vercel URL directly, but if you change any Supabase callbacks, you don't need to change much.
- However, since you are routing users through Vercel entirely now, those OAuth parameters remain identical because your Supabase Project `bghbxjsvfnixmxwjqdau.supabase.co` remains identical!

**That's it! Your application is officially live and production-ready!**
