# 🔄 URLs Update Checklist After Deployment

## ✅ Updated Files

### 1. Backend (`backend/index.js`)
- ✅ Updated CORS allowed origins to include new URLs
- ✅ Now includes: `https://edu2medu-frontend.vercel.app`

### 2. Frontend (`frontend/vite.config.js`)
- ✅ Updated proxy target to use environment variable
- ✅ Falls back to: `https://edu2medu-backend.onrender.com`

---

## 📋 Environment Variables to Set

### On Vercel (Frontend):
Go to: https://vercel.com → Your Project → Settings → Environment Variables

Add/Update:
```
VITE_BASEURI=https://edu2medu-backend.onrender.com
```

### On Render (Backend):
Go to: https://dashboard.render.com → Your Service → Environment

Add/Update:
```
ALLOWED_ORIGINS=https://edu2medu-frontend.vercel.app,http://localhost:5173
```

---

## 🔍 What Was Updated

### Backend Changes:
- CORS configuration now includes frontend URL
- Environment variable `ALLOWED_ORIGINS` should be set in Render dashboard

### Frontend Changes:
- Vite proxy now uses `VITE_BASEURI` environment variable
- Falls back to Render backend URL if env var not set
- Environment variable `VITE_BASEURI` should be set in Vercel dashboard

---

## ✅ Final Checklist

### Vercel (Frontend):
- [ ] Environment Variable: `VITE_BASEURI=https://edu2medu-backend.onrender.com`
- [ ] Redeploy frontend after setting variable

### Render (Backend):
- [ ] Environment Variable: `ALLOWED_ORIGINS=https://edu2medu-frontend.vercel.app,http://localhost:5173`
- [ ] Redeploy backend after setting variable

### Code Changes:
- [x] Backend CORS updated
- [x] Frontend vite.config.js updated
- [ ] Commit and push changes to GitHub

---

## 🚀 Next Steps

1. **Set Environment Variables** in both platforms
2. **Redeploy** both services
3. **Test** the deployment:
   - Visit: https://edu2medu-frontend.vercel.app
   - Check browser console for API calls
   - Verify login/registration works

---

## 📝 Important Notes

- **Environment Variables** are the primary way to configure URLs
- **Hardcoded URLs** in code are now fallbacks only
- **Always use environment variables** for production
- **CORS** must include your frontend URL
- **API calls** will use `VITE_BASEURI` from environment

---

## 🔧 If Issues Occur

1. Check environment variables are set correctly
2. Verify CORS includes frontend URL
3. Check browser console for errors
4. Verify backend URL is accessible
5. Check Render/Vercel deployment logs

