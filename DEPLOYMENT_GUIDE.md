# 🚀 Deployment Guide for Movie Plus

This guide will help you deploy your MERN stack application. We will deploy the **Backend** to **Render** and the **Frontend** to **Vercel**.

---

## 🏗️ 1. Prerequisites

Make sure you have a GitHub repository for your project.
1.  Initialize git if you haven't: `git init`
2.  Commit all changes:
    ```bash
    git add .
    git commit -m "Ready for deploy"
    ```
3.  Push to GitHub.

---

## 🔙 2. Deploy Backend (Render)

Render is great for Node.js backends.

1.  Go to [Render.com](https://render.com) and sign up/login.
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    *   **Name**: `movie-plus-api` (or similar)
    *   **Root Directory**: `server`
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install && npm run build`
        *   *(Note: verified `package.json` has these scripts now)*
    *   **Start Command**: `npm start`
5.  **Environment Variables** (Scroll down to "Environment"):
    *   Add `MONGO_URI`: Your MongoDB connection string (from Atlas).
    *   Add `JWT_SECRET`: A strong secret key.
    *   Add `PORT`: `10000` (Render default).
6.  Click **Create Web Service**.

> **Wait for it to deploy.** Once live, copy the **URL** (e.g., `https://movie-plus-api.onrender.com`). You will need this for the frontend.

---

## 🎨 3. Deploy Frontend (Vercel)

Vercel is optimized for Vite/React.

1.  Go to [Vercel.com](https://vercel.com) and sign up/login.
2.  Click **Add New** -> **Project**.
3.  Import your GitHub repository.
4.  Configure the project:
    *   **Framework Preset**: Vite (should detect auto).
    *   **Root Directory**: Click `Edit` and select `client`.
    *   **Build Command**: `npm run build` (default).
    *   **Output Directory**: `dist` (default).
5.  **Environment Variables**:
    *   Ideally, your frontend should look for an API URL environment variable (e.g., `VITE_API_URL`).
    *   *If your code currently hardcodes `localhost:5000`*, you will need to find and replace it with your new Render Backend URL before deploying, OR refactor to use an ENV variable.
6.  Click **Deploy**.

---

## 🔗 4. Final Connection Steps

### Fix Frontend API Calls
If your frontend code (e.g., in `api-client.ts` or `axios.get` calls) points to `localhost:5000`:

1.  Open `client/src/services/api-client.ts` (or wherever your base URL is).
2.  Change the base URL to use an environment variable:
    ```typescript
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    ```
3.  In Vercel **Settings** -> **Environment Variables**, add:
    *   `VITE_API_URL`: `https://your-backend-url.onrender.com/api`
4.  Redeploy Vercel.

### Allow Frontend in Backend CORS
If your backend uses `cors`:
1.  Open `server/src/server.ts` (or wherever CORS is configured).
2.  Ensure `cors` is enabled for your Vercel URL.
    ```typescript
    app.use(cors({
        origin: ["http://localhost:5173", "https://your-vercel-project.vercel.app"],
        credentials: true
    }));
    ```
3.  Commit and Push changes to update the backend.

---

🎉 **Done!** Your Movie Plus app should now be live users can access it without VPN/DNS issues.
