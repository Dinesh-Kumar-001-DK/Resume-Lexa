# Installation & Setup Guide

This guide will walk you through setting up Resume Lexa locally on your machine.

## Prerequisites

Ensure you have the following installed on your operating system:
- **Node.js** (v18.0.0 or higher recommended)
- **Git**

You also need active accounts for the following services to obtain API keys:
1. **Google AI Studio** (for the Gemini API Key)
2. **MongoDB Atlas** (for your MongoDB URI connection string)
3. **Supabase** (for the Project URL and Anon Key)
4. **Google Cloud Console** (for Google OAuth Client ID/Secret)

---

## 1. Cloning the Repository

```bash
git clone https://github.com/Dinesh-Kumar-001-DK/Resume-Lexa.git
cd Resume-Lexa
```

## 2. Environment Variables

You must create two `.env` files (one for the server, and one for the client).

**`server/.env`**
Create a new file called `.env` in the `server` folder, and add the following:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_project_url (e.g. https://xyz.supabase.co)
SUPABASE_ANON_KEY=your_supabase_anon_key
```

**`client/.env`**
Create a new file called `.env` in the `client` folder:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Install Dependencies

You can install all frontend and backend dependencies using the helper script provided in the root `package.json`:

```bash
npm run install:all
```
*(Alternatively, you can manually `cd` into both `client/` and `server/` and run `npm install`)*

## 4. Supabase Provider Settings

You must go to your Supabase Dashboard -> **Authentication** -> **Providers**, and enable the Google Provider:
- Provide your **Client ID** and **Client Secret** obtained from Google Cloud Console.
- In Google Cloud Console, ensure your **Authorized Redirect URIs** contains your exact Supabase callback URL.

## 5. Starting the Development Server

Execute the following from the root repository directory:

```bash
npm run dev
```

This will run `concurrently` and automatically boot both servers simultaneously.
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
