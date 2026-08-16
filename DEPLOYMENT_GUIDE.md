# STITCH Deployment Guide - Vercel & Render

Your code has been pushed to GitHub. Now deploy to **Vercel (Frontend)** and **Render (Backend)**.

---

## 🚀 Part 1: Deploy Frontend to Vercel

### Step 1: Connect Vercel to GitHub

1. Go to [**vercel.com**](https://vercel.com) and sign in (or create account)
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Search for and select: `sivakumarpetla9-cpu/resume-assistance`
5. Click **"Import"**

### Step 2: Configure Vercel Project

**Framework Preset:** Automatically detected as **Vite**

**Root Directory:** Leave as `.` (root)

**Build Command:** `npm run build` (already configured)

**Output Directory:** `dist` (already configured)

### Step 3: Set Environment Variables

Click **"Environment Variables"** and add:

```
VITE_API_BASE_URL=https://stitch-career-api.onrender.com/api/v1
```

(This URL will be your Render backend domain, update after Render deployment)

### Step 4: Deploy

Click **"Deploy"** - Vercel will build and deploy your frontend!

**Your Vercel Frontend URL:** `https://resume-assistance.vercel.app` (or similar)

---

## 🚀 Part 2: Deploy Backend to Render

### Step 1: Create PostgreSQL Database (Render)

1. Go to [**render.com**](https://render.com) and sign in
2. Click **"New +"** → **"PostgreSQL"**
3. **Name:** `stitch-career-db`
4. **Database:** `stitch_prod`
5. **Region:** Choose closest to your users (e.g., `N. Virginia`)
6. Click **"Create Database"**
7. ⏳ Wait for database to be created (~5 min)
8. Copy the **Internal Database URL** (you'll need this)

### Step 2: Create Render Web Service

1. Click **"New +"** → **"Web Service"**
2. Select **"Deploy existing repository"** or connect GitHub
3. Search for and select: `sivakumarpetla9-cpu/resume-assistance`
4. Click **"Connect"**

### Step 3: Configure Web Service

**Basic Settings:**
- **Name:** `stitch-career-api`
- **Environment:** `Python 3`
- **Region:** Same as database (e.g., `N. Virginia`)
- **Branch:** `main`

**Build & Start:**
- **Build Command:** `pip install -r server/requirements.txt && cd server && alembic upgrade head`
- **Start Command:** `uvicorn server.app.main:app --host 0.0.0.0 --port $PORT`

### Step 4: Add Environment Variables

Click **"Environment"** and add the following:

```
SECRET_KEY=your-super-secret-key-here-generate-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
APP_ENV=production
AI_PROVIDER=openai
OPENAI_API_KEY=your-openai-api-key-here
DATABASE_URL=<paste the PostgreSQL URL from Step 1>
REDIS_URL=redis://localhost:6379/0
ALLOWED_ORIGINS=https://resume-assistance.vercel.app,https://localhost:3000
```

### Step 5: Add PostgreSQL Add-on (Optional for Redis)

For production reliability, add Render's Redis:
1. Click **"Add-ons"** → **"Redis"**
2. Select **"Free Plan"** or **"Starter"**
3. Copy the Redis URL and update `REDIS_URL` in Environment

### Step 6: Deploy

Click **"Create Web Service"** - Render will build and deploy your backend!

**Your Render Backend URL:** `https://stitch-career-api.onrender.com`

---

## ✅ Part 3: Connect Frontend & Backend

### Update Vercel Environment Variable

1. Go back to **Vercel Project Settings**
2. **Environment Variables** 
3. Update `VITE_API_BASE_URL` to:
   ```
   https://stitch-career-api.onrender.com/api/v1
   ```
4. Click **"Save"** - Vercel will auto-redeploy

### Verify CORS in Render

Update `ALLOWED_ORIGINS` in Render environment variables to include your Vercel URL:

```
https://resume-assistance.vercel.app,https://localhost:3000
```

---

## 🧪 Test Your Deployment

### Frontend Test
1. Open: `https://resume-assistance.vercel.app`
2. Should load the Landing Page
3. Click "Explore Platform" → Should redirect to Login (auth working ✅)

### Backend Test
1. Visit: `https://stitch-career-api.onrender.com/api/v1/docs` 
2. Should see FastAPI OpenAPI documentation (backend running ✅)

### Full Flow Test
1. Go to: `https://resume-assistance.vercel.app`
2. Click "Explore" → Redirects to Login ✅
3. Sign up with test account ✅
4. Should land on Dashboard ✅
5. Upload a PDF resume ✅
6. Should extract text and skills ✅
7. Click Logout → Returns to Landing ✅

---

## 🔧 Troubleshooting

### **Frontend won't build**
- Check: `npm run build` runs locally without errors
- Verify: `VITE_API_BASE_URL` is set in Vercel

### **Backend deployment fails**
- Check: All environment variables are set (especially `OPENAI_API_KEY`)
- Verify: Database connection string is correct
- Check: `server/requirements.txt` has all dependencies

### **API returns 401 Unauthorized**
- Verify: JWT `SECRET_KEY` is same in frontend and backend
- Check: Token is being sent in headers correctly
- Ensure: CORS is configured (`ALLOWED_ORIGINS`)

### **Resume upload fails**
- Check: `OPENAI_API_KEY` is valid and has usage credits
- Verify: Database has proper permissions
- Ensure: File is valid PDF/DOCX under 10MB

### **Database connection error**
- Verify: `DATABASE_URL` in Render env vars is correct
- Check: PostgreSQL add-on is running
- Ensure: Connection string format is: `postgresql://user:password@host/database`

---

## 📊 Environment Variables Reference

### Frontend (Vercel)
```bash
VITE_API_BASE_URL=https://stitch-career-api.onrender.com/api/v1
```

### Backend (Render)
```bash
# Auth & Security
SECRET_KEY=<random-string-64-chars>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Database
DATABASE_URL=postgresql://user:password@host:5432/stitch_prod

# Redis Cache
REDIS_URL=redis://default:password@host:port

# AI & APIs
OPENAI_API_KEY=sk-...
AI_PROVIDER=openai

# Environment
APP_ENV=production

# CORS Origins
ALLOWED_ORIGINS=https://resume-assistance.vercel.app
```

---

## 🎯 Deployment Checklist

- [ ] Code pushed to GitHub (`main` branch)
- [ ] Vercel project created and configured
- [ ] Render PostgreSQL database created
- [ ] Render web service created
- [ ] All environment variables set correctly
- [ ] Frontend deploys successfully
- [ ] Backend deploys successfully
- [ ] Frontend can reach backend API
- [ ] Login flow works end-to-end
- [ ] Resume upload works
- [ ] Logout works
- [ ] Database persists user data

---

## 📞 Support & Monitoring

### Vercel Dashboard
- Monitor deployments: https://vercel.com/dashboard
- View logs: Project → Deployments → Click deployment → Logs
- Set up alerts: Project → Settings → Alerts

### Render Dashboard
- Monitor services: https://dashboard.render.com
- View logs: Service → Logs tab
- Check database: PostgreSQL → Logs

### Common Commands (Local Development)

```bash
# Backend logs
cd server
python -m uvicorn app.main:app --reload

# Frontend logs
npm run dev

# Database migrations
cd server
alembic upgrade head  # Apply pending migrations
alembic downgrade -1  # Rollback last migration
alembic current       # Show current version
```

---

## 🚀 Next Steps

1. **Complete deployment** using steps above
2. **Test end-to-end** authentication and resume upload
3. **Monitor logs** for any errors
4. **Set up monitoring** in Render/Vercel dashboards
5. **Configure custom domain** (optional)
6. **Set up CI/CD** for automatic deployments on GitHub push

---

**Deployment Status:** 🟢 Ready to Deploy
- ✅ Frontend code compiled
- ✅ Backend code ready
- ✅ Database migrations prepared
- ✅ Environment config documented

Start with **Part 1 (Vercel)** above!
