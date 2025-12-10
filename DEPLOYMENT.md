# 🚀 Deployment Guide - AP FraudShield

This guide covers deploying both the **Frontend (Next.js)** and **Backend (FastAPI)** applications.

---

## 📋 Prerequisites

- Git repository set up
- Accounts on deployment platforms (Vercel/Railway/Render/etc.)
- Domain name (optional but recommended)
- Environment variables ready

---

## 🎯 Deployment Options

### **Recommended Stack:**

| Component | Platform | Why |
|-----------|----------|-----|
| **Frontend** | Vercel | Optimized for Next.js, free tier, automatic deployments |
| **Backend** | Railway / Render | Easy Python deployment, free tier, good for FastAPI |

### **Alternative Options:**

- **Frontend**: Netlify, AWS Amplify, Cloudflare Pages
- **Backend**: Heroku, AWS EC2, DigitalOcean, Fly.io

---

## 🎨 Part 1: Deploy Frontend (Next.js)

### **Option A: Vercel (Recommended - Easiest)**

#### Step 1: Prepare Frontend
```bash
cd frontend
```

#### Step 2: Create `vercel.json` (Optional)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

#### Step 3: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Import your repository
5. Select the `frontend` folder as root
6. Add environment variables:
   ```
   NEXT_PUBLIC_API_BASE=https://your-backend-url.com/api/v1
   ```
7. Click **"Deploy"**

#### Step 4: Deploy via CLI (Alternative)
```bash
npm install -g vercel
cd frontend
vercel login
vercel
```

### **Option B: Netlify**

1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/.next`
4. Add environment variable: `NEXT_PUBLIC_API_BASE`

---

## ⚙️ Part 2: Deploy Backend (FastAPI)

### **Option A: Railway (Recommended - Easiest)**

#### Step 1: Prepare Backend
```bash
cd backend
```

#### Step 2: Create `Procfile` (for Railway)
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

#### Step 3: Create `requirements.txt`
```bash
pip freeze > requirements.txt
```

Or create manually:
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-multipart==0.0.6
pypdf==3.17.0
```

#### Step 4: Create `runtime.txt` (Optional - specify Python version)
```
python-3.11.0
```

#### Step 5: Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway auto-detects Python
6. Set root directory to `backend`
7. Add environment variables (if needed)
8. Railway automatically deploys!

#### Step 6: Get Backend URL
- Railway provides a URL like: `https://your-app.railway.app`
- Update frontend env: `NEXT_PUBLIC_API_BASE=https://your-app.railway.app/api/v1`

### **Option B: Render**

1. Go to [render.com](https://render.com)
2. Create new **Web Service**
3. Connect GitHub repository
4. Settings:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3
5. Add environment variables
6. Deploy!

### **Option C: Fly.io**

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Initialize (in backend folder)
cd backend
fly launch

# Deploy
fly deploy
```

---

## 🔧 Environment Variables

### **Frontend (.env.production)**
```env
NEXT_PUBLIC_API_BASE=https://your-backend-url.com/api/v1
NODE_ENV=production
```

### **Backend**
```env
# Usually not needed for basic setup, but if you add features:
# DATABASE_URL=...
# SECRET_KEY=...
# CORS_ORIGINS=https://your-frontend-url.com
```

---

## 📝 Step-by-Step: Complete Deployment

### **Quick Start (Vercel + Railway)**

#### 1. Deploy Backend First
```bash
cd backend

# Create requirements.txt
cat > requirements.txt << EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-multipart==0.0.6
pypdf==3.17.0
EOF

# Create Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Commit and push
git add .
git commit -m "Prepare for deployment"
git push
```

Then deploy on Railway (see steps above).

#### 2. Update Backend CORS
Once you have your frontend URL, update `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Keep for local dev
        "https://your-frontend.vercel.app",  # Add your production URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### 3. Deploy Frontend
```bash
cd frontend

# Create .env.production
echo "NEXT_PUBLIC_API_BASE=https://your-backend.railway.app/api/v1" > .env.production

# Commit and push
git add .
git commit -m "Add production env"
git push
```

Then deploy on Vercel (see steps above).

---

## 🐳 Docker Deployment (Alternative)

### **Backend Dockerfile**
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### **Frontend Dockerfile**
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

---

## ✅ Post-Deployment Checklist

### **Backend**
- [ ] Backend URL is accessible
- [ ] CORS allows frontend domain
- [ ] Health check endpoint works: `/api/v1/dashboard/stats`
- [ ] File upload endpoint works: `/api/v1/scan/upload`
- [ ] Environment variables are set

### **Frontend**
- [ ] Frontend URL is accessible
- [ ] `NEXT_PUBLIC_API_BASE` points to backend
- [ ] All pages load correctly
- [ ] File upload works
- [ ] API calls succeed

### **Testing**
- [ ] Upload a test file
- [ ] Check dashboard loads
- [ ] Verify analysis results page
- [ ] Test export functionality
- [ ] Check mobile responsiveness

---

## 🔒 Security Considerations

### **Production Checklist**
1. **HTTPS**: Both frontend and backend should use HTTPS
2. **CORS**: Restrict CORS to your frontend domain only
3. **Rate Limiting**: Add rate limiting to backend (use `slowapi`)
4. **File Size Limits**: Enforce file size limits
5. **Environment Variables**: Never commit `.env` files
6. **API Keys**: Use secure storage for any API keys

### **Update Backend CORS for Production**
```python
# backend/main.py
import os

ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Development
    os.getenv("FRONTEND_URL", "https://your-app.vercel.app"),  # Production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🚨 Troubleshooting

### **Backend Issues**

**Problem**: CORS errors
- **Solution**: Update `allow_origins` in `main.py` with your frontend URL

**Problem**: Port binding error
- **Solution**: Use `--host 0.0.0.0 --port $PORT` (Railway/Render set PORT)

**Problem**: Module not found
- **Solution**: Ensure `requirements.txt` includes all dependencies

### **Frontend Issues**

**Problem**: API calls fail
- **Solution**: Check `NEXT_PUBLIC_API_BASE` is set correctly

**Problem**: Build fails
- **Solution**: Check Node version (should be 18+), clear `.next` folder

**Problem**: Environment variables not working
- **Solution**: Restart deployment, ensure variables start with `NEXT_PUBLIC_`

---

## 📊 Monitoring & Logs

### **Vercel**
- View logs in Vercel dashboard → Your project → Deployments → View logs

### **Railway**
- View logs in Railway dashboard → Your service → Logs tab

### **Health Check**
Add to backend:
```python
@app.get("/health")
def health():
    return {"status": "healthy", "version": "1.0.0"}
```

---

## 🔄 Continuous Deployment

Both Vercel and Railway automatically deploy on git push to main branch!

1. Make changes locally
2. Commit and push: `git push origin main`
3. Deployment happens automatically
4. Check deployment status in dashboard

---

## 💰 Cost Estimate

### **Free Tier (Recommended for Start)**
- **Vercel**: Free (100GB bandwidth/month)
- **Railway**: $5/month free credit (usually enough for small apps)
- **Render**: Free tier available (with limitations)

### **Paid Options (When Scaling)**
- **Vercel Pro**: $20/month
- **Railway**: Pay-as-you-go (~$5-20/month for small apps)
- **Render**: $7/month per service

---

## 📚 Additional Resources

- [Vercel Next.js Docs](https://vercel.com/docs)
- [Railway Python Docs](https://docs.railway.app)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 🎯 Quick Commands Reference

```bash
# Backend - Local testing
cd backend
uvicorn main:app --reload --port 8000

# Frontend - Local testing
cd frontend
npm run dev

# Build frontend
cd frontend
npm run build
npm start

# Check backend health
curl https://your-backend.railway.app/api/v1/dashboard/stats
```

---

**Last Updated**: $(date)
**Status**: ✅ Ready for deployment

