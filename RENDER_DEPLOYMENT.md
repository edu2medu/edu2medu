# Render Deployment Guide for Edu2Medu

## 📋 Overview

Render supports both frontend (Static Site) and backend (Web Service) deployments.
You'll need to create **TWO separate services** on Render.

---

## 🚀 Step 1: Deploy Backend (Web Service)

### 1. Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → Select **"Web Service"**
3. Connect your GitHub account (if not already connected)
4. Select repository: `edu2medu/edu2medu`

### 2. Configure Backend Service

**Basic Settings:**
- **Name**: `edu2medu-backend` (or your choice)
- **Region**: Choose closest to your users (e.g., Singapore, US East)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node index.js`

**Environment Variables** (Add these):
```
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret_key
SECRET_KEY=your_jwt_secret_key
EMAIL=your_email@gmail.com
PASSWORD=your_email_app_password
ALLOWED_ORIGINS=https://your-frontend-url.onrender.com,http://localhost:5173
APP_PORT=10000
NODE_ENV=production
```

**Important Notes:**
- Render uses port `10000` by default (or `PORT` env variable)
- Update `APP_PORT` to `10000` or use `process.env.PORT` in your code
- Update `ALLOWED_ORIGINS` after frontend deploys

### 3. Deploy

- Click **"Create Web Service"**
- Render will automatically build and deploy
- Wait for deployment to complete
- Copy your backend URL (e.g., `https://edu2medu-backend.onrender.com`)

---

## 🎨 Step 2: Deploy Frontend (Static Site)

### 1. Create New Static Site

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → Select **"Static Site"**
3. Select repository: `edu2medu/edu2medu`

### 2. Configure Frontend Service

**Basic Settings:**
- **Name**: `edu2medu-frontend` (or your choice)
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

**Environment Variables** (Add these):
```
VITE_BASEURI=https://your-backend-url.onrender.com
```

Replace `your-backend-url.onrender.com` with your actual backend URL from Step 1.

### 3. Deploy

- Click **"Create Static Site"**
- Render will build and deploy
- Wait for deployment to complete
- Copy your frontend URL (e.g., `https://edu2medu-frontend.onrender.com`)

---

## 🔄 Step 3: Update Environment Variables

After both deployments:

### Update Backend:
1. Go to Backend service → **Environment**
2. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=https://edu2medu-frontend.onrender.com,http://localhost:5173
   ```
3. Click **"Save Changes"** → Auto-redeploys

### Update Frontend:
1. Go to Frontend service → **Environment**
2. Verify `VITE_BASEURI` is correct:
   ```
   VITE_BASEURI=https://edu2medu-backend.onrender.com
   ```
3. Click **"Save Changes"** → Auto-redeploys

---

## 🔧 Backend Code Updates (If Needed)

If your backend uses a fixed port, update `backend/index.js`:

```javascript
const port = process.env.PORT || process.env.APP_PORT || 8002;
```

Render provides `PORT` environment variable automatically.

---

## 📝 Quick Reference

### Backend Settings:
```
Type: Web Service
Root Directory: backend
Build Command: npm install
Start Command: node index.js
Environment: Node
```

### Frontend Settings:
```
Type: Static Site
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

---

## ✅ Verification

After deployment:

1. **Backend URL**: `https://your-backend-name.onrender.com`
2. **Frontend URL**: `https://your-frontend-name.onrender.com`

Test:
- Visit frontend URL
- Check browser console for API calls
- Verify backend API endpoints work
- Test login/registration flows

---

## 🔧 Troubleshooting

### Issue: Backend deployment fails
- Check Root Directory is `backend`
- Verify `package.json` exists in backend folder
- Check build logs in Render dashboard
- Ensure all environment variables are set

### Issue: Frontend can't connect to backend
- Verify `VITE_BASEURI` is correct
- Check backend URL is accessible
- Verify CORS settings in backend
- Check `ALLOWED_ORIGINS` includes frontend URL

### Issue: Environment variables not working
- Make sure variables are added to correct service
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)
- Frontend variables must start with `VITE_` for Vite

### Issue: Backend goes to sleep (Free tier)
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Upgrade to paid plan for always-on service

---

## 💰 Render Pricing

- **Free Tier**: 
  - Services sleep after inactivity
  - Good for development/testing
- **Paid Plans**: 
  - Always-on services
  - Better for production

---

## 🔄 Auto-Deployments

Render automatically deploys when you push to `main` branch.
- Every git push triggers a new deployment
- Check deployment logs in Render dashboard
- Rollback to previous deployments if needed

---

## 📚 Additional Notes

- **Custom Domains**: Add your domain in Service Settings → Custom Domains
- **Environment Variables**: Can be different for Production/Preview
- **Build Logs**: Check logs in Render dashboard for debugging
- **Health Checks**: Render automatically monitors your services

---

## 🎯 Deployment Checklist

- [ ] Backend service created
- [ ] Backend environment variables added
- [ ] Backend deployed successfully
- [ ] Backend URL copied
- [ ] Frontend service created
- [ ] Frontend environment variables added (with backend URL)
- [ ] Frontend deployed successfully
- [ ] Backend CORS updated with frontend URL
- [ ] Both services tested and working

