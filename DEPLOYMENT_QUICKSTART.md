# 🚀 Quick Deployment Guide

## TL;DR - Deploy in 10 Minutes

### **Step 1: Deploy Backend (Railway) - 5 min**

1. Go to [railway.app](https://railway.app) and sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway auto-detects Python
5. Set **Root Directory** to: `backend`
6. Railway will auto-deploy!
7. Copy your backend URL (e.g., `https://your-app.railway.app`)

### **Step 2: Deploy Frontend (Vercel) - 5 min**

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **"New Project"**
3. Import your repository
4. Set **Root Directory** to: `frontend`
5. Add Environment Variable:
   - **Key**: `NEXT_PUBLIC_API_BASE`
   - **Value**: `https://your-app.railway.app/api/v1` (use your Railway URL)
6. Click **"Deploy"**

### **Step 3: Update Backend CORS**

1. Go to Railway dashboard → Your service → Variables
2. Add environment variable:
   - **Key**: `CORS_ORIGINS`
   - **Value**: `https://your-frontend.vercel.app` (use your Vercel URL)
3. Redeploy backend

### **Done! 🎉**

Your app is now live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`

---

## 📋 Files Already Created

✅ `backend/requirements.txt` - Python dependencies
✅ `backend/Procfile` - Railway deployment config
✅ `backend/runtime.txt` - Python version
✅ `backend/.gitignore` - Git ignore rules
✅ `frontend/.env.example` - Environment template

---

## 🔧 Manual Steps

### Update Backend CORS (if needed)

Edit `backend/main.py` and add your frontend URL:

```python
ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Keep for local dev
    "https://your-frontend.vercel.app",  # Add your Vercel URL
]
```

Or use environment variable (recommended):
```bash
# In Railway dashboard, add:
CORS_ORIGINS=https://your-frontend.vercel.app
```

---

## ✅ Test Deployment

1. **Backend Health Check**:
   ```
   https://your-backend.railway.app/health
   ```

2. **Frontend**:
   - Visit your Vercel URL
   - Try uploading a file
   - Check if dashboard loads

---

## 🆘 Troubleshooting

**CORS Error?**
- Update `CORS_ORIGINS` in Railway environment variables
- Include both `http://` and `https://` if needed

**API Not Working?**
- Check `NEXT_PUBLIC_API_BASE` in Vercel environment variables
- Ensure backend URL ends with `/api/v1`

**Build Fails?**
- Check logs in Vercel/Railway dashboard
- Ensure all dependencies are in `requirements.txt`

---

## 📚 Full Guide

See `DEPLOYMENT.md` for detailed instructions and alternative platforms.

