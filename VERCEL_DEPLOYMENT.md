# Vercel Deployment Guide for Edu2Medu

## 📋 Overview

Your project has two parts:
1. **Frontend** (React + Vite) - Deploy as separate project
2. **Backend** (Node.js + Express) - Deploy as separate project

You need to create **TWO separate projects** on Vercel.

---

## 🚀 Step 1: Deploy Frontend

### On Vercel Dashboard:

1. **Import Repository**
   - Click "New Project"
   - Select `edu2medu/edu2medu` repository
   - Click "Import"

2. **Configure Frontend Project:**
   - **Project Name**: `edu2medu-frontend` (or your choice)
   - **Framework Preset**: Select **"Vite"** (or "Other" if Vite not available)
   - **Root Directory**: Click "Edit" → Enter `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

3. **Environment Variables** (Click "Environment Variables"):
   ```
   VITE_BASEURI=https://your-backend-url.vercel.app
   ```
   Replace `your-backend-url.vercel.app` with your actual backend URL after deploying backend.

4. **Click "Deploy"**

---

## 🔧 Step 2: Deploy Backend

### On Vercel Dashboard:

1. **Create Another Project**
   - Click "New Project" again
   - Select `edu2medu/edu2medu` repository
   - Click "Import"

2. **Configure Backend Project:**
   - **Project Name**: `edu2medu-backend` (or your choice)
   - **Framework Preset**: Select **"Other"**
   - **Root Directory**: Click "Edit" → Enter `backend`
   - **Build Command**: Leave empty (or `npm install`)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

3. **Environment Variables** (Click "Environment Variables"):
   ```
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret_key
   SECRET_KEY=your_jwt_secret_key
   EMAIL=your_email@gmail.com
   PASSWORD=your_email_app_password
   ALLOWED_ORIGINS=https://your-frontend-url.vercel.app,http://localhost:5173
   APP_PORT=8002
   ```
   **Important**: Replace all placeholder values with your actual values.

4. **Click "Deploy"**

---

## 🔄 Step 3: Update Environment Variables

After both deployments:

1. **Update Frontend Environment Variable:**
   - Go to Frontend project → Settings → Environment Variables
   - Update `VITE_BASEURI` with your actual backend URL:
     ```
     VITE_BASEURI=https://edu2medu-backend.vercel.app
     ```
   - Redeploy frontend

2. **Update Backend CORS:**
   - Go to Backend project → Settings → Environment Variables
   - Update `ALLOWED_ORIGINS` with your frontend URL:
     ```
     ALLOWED_ORIGINS=https://edu2medu-frontend.vercel.app,http://localhost:5173
     ```
   - Redeploy backend

---

## 📝 Quick Reference

### Frontend Settings:
```
Root Directory: frontend
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

### Backend Settings:
```
Root Directory: backend
Framework: Other
Build Command: (empty)
Output Directory: (empty)
```

---

## ✅ Verification

After deployment:

1. **Frontend URL**: `https://your-frontend-name.vercel.app`
2. **Backend URL**: `https://your-backend-name.vercel.app`

Test:
- Visit frontend URL
- Check browser console for API calls
- Verify backend API endpoints work

---

## 🔧 Troubleshooting

### Issue: Build fails
- Check Root Directory is correct (`frontend` or `backend`)
- Verify `package.json` exists in root directory
- Check build logs in Vercel dashboard

### Issue: API calls fail
- Verify `VITE_BASEURI` is set correctly in frontend
- Check CORS settings in backend
- Verify backend URL is correct

### Issue: Environment variables not working
- Make sure variables are added to correct project
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

---

## 📚 Additional Notes

- **Custom Domains**: Add your domain in Project Settings → Domains
- **Automatic Deployments**: Every push to `main` branch auto-deploys
- **Preview Deployments**: Pull requests get preview URLs automatically

