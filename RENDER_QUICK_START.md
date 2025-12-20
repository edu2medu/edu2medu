# 🚀 Quick Start: Deploy on Render

## Option 1: Manual Deployment (Recommended for First Time)

### Backend Deployment:

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect GitHub** → Select `edu2medu/edu2medu`
4. **Configure**:
   - Name: `edu2medu-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node index.js`
5. **Add Environment Variables**:
   ```
   MONGO_URI=your_mongodb_uri
   SESSION_SECRET=your_secret
   SECRET_KEY=your_jwt_secret
   EMAIL=your_email@gmail.com
   PASSWORD=your_app_password
   ALLOWED_ORIGINS=https://your-frontend.onrender.com
   PORT=10000
   NODE_ENV=production
   ```
6. **Click "Create Web Service"**
7. **Wait for deployment** → Copy backend URL

### Frontend Deployment:

1. **Click "New +"** → **"Static Site"**
2. **Select** `edu2medu/edu2medu` repository
3. **Configure**:
   - Name: `edu2medu-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. **Add Environment Variable**:
   ```
   VITE_BASEURI=https://your-backend-url.onrender.com
   ```
5. **Click "Create Static Site"**
6. **Update backend** `ALLOWED_ORIGINS` with frontend URL

---

## Option 2: Using Render Blueprint (Advanced)

1. **Go to Render Dashboard**
2. **Click "New +"** → **"Blueprint"**
3. **Connect GitHub** → Select `edu2medu/edu2medu`
4. **Render will detect** `render.yaml` file
5. **Review configuration** → **"Apply"**
6. **Set environment variables** manually in dashboard
7. **Deploy**

---

## ⚡ Quick Commands Reference

### Check Backend Status:
```bash
curl https://your-backend.onrender.com/
```

### Check Frontend:
Visit: `https://your-frontend.onrender.com`

---

## 🔧 Important Notes

1. **Port**: Render uses `PORT` env variable (default: 10000)
2. **Sleep**: Free tier services sleep after 15 min inactivity
3. **Build Time**: First build takes 5-10 minutes
4. **Environment Variables**: Must be set before deployment
5. **CORS**: Update `ALLOWED_ORIGINS` after both deploy

---

## ✅ Success Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables set
- [ ] CORS configured correctly
- [ ] API calls working from frontend
- [ ] Login/Registration working

---

## 🆘 Need Help?

- Check Render logs in dashboard
- Verify environment variables
- Test backend URL directly
- Check browser console for errors

