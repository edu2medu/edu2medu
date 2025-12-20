# 🚀 Quick Vercel Deployment Steps

## Current Setup on Vercel Dashboard

Based on your screenshot, here's what to configure:

### ✅ Current Settings (Keep These):
- **Repository**: `edu2medu/edu2medu` ✓
- **Branch**: `main` ✓
- **Vercel Team**: Edu2Medu's projects ✓
- **Project Name**: `edu2medu` ✓

### ⚙️ Settings to Configure:

#### 1. Framework Preset
- **Change from**: "Other"
- **Change to**: **"Vite"** (for frontend) or keep "Other" if deploying backend

#### 2. Root Directory
- **Current**: `./`
- **For Frontend**: Click "Edit" → Change to `frontend`
- **For Backend**: Click "Edit" → Change to `backend`

#### 3. Build Settings (Auto-detected, but verify):
- **Build Command**: `npm run build` (for frontend)
- **Output Directory**: `dist` (for frontend)
- **Install Command**: `npm install`

---

## 📋 Step-by-Step for Your Current Screen:

### For Frontend Deployment:

1. **Root Directory**: Click "Edit" → Type `frontend` → Save
2. **Framework Preset**: Select **"Vite"** from dropdown
3. **Expand "Build and Output Settings"**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. **Expand "Environment Variables"**:
   - Add: `VITE_BASEURI` = `https://your-backend-url.vercel.app`
   - (You'll update this after backend deploys)
5. **Click "Deploy"**

### For Backend Deployment (Create Separate Project):

1. **Create New Project** (repeat import process)
2. **Root Directory**: `backend`
3. **Framework Preset**: **"Other"**
4. **Build Command**: Leave empty
5. **Environment Variables** (add all):
   ```
   MONGO_URI=your_mongodb_uri
   SESSION_SECRET=your_secret
   SECRET_KEY=your_jwt_secret
   EMAIL=your_email@gmail.com
   PASSWORD=your_app_password
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   APP_PORT=8002
   ```
6. **Click "Deploy"**

---

## 🎯 Recommended: Deploy Backend First

1. Deploy backend first
2. Copy backend URL (e.g., `https://edu2medu-backend.vercel.app`)
3. Use that URL in frontend's `VITE_BASEURI` environment variable
4. Deploy frontend

---

## ✅ After Deployment

1. **Frontend URL**: `https://edu2medu.vercel.app` (or your custom name)
2. **Backend URL**: `https://edu2medu-backend.vercel.app` (or your custom name)
3. Update frontend environment variable with backend URL
4. Redeploy frontend

---

## 🔍 Quick Checklist

- [ ] Root Directory set correctly (`frontend` or `backend`)
- [ ] Framework Preset selected
- [ ] Environment Variables added
- [ ] Build settings verified
- [ ] Deploy button clicked
- [ ] Deployment successful
- [ ] URLs tested

