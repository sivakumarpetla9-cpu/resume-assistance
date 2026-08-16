# STITCH Production Deployment Checklist

## Pre-Deployment Verification

### 1. Backend Configuration (.env for Render)
```
# Database
DATABASE_URL=postgresql://user:pass@host:port/stitch_db

# Redis
REDIS_URL=redis://host:port/0

# Security
SECRET_KEY=<generate-strong-random-key>

# AI Configuration
OPENAI_API_KEY=sk-...  (only if using OpenAI)
AI_PROVIDER=openai     (or "development" for fallback)
OPENAI_MODEL=gpt-4o-mini

# CORS
ALLOWED_ORIGINS=https://stitch-career.vercel.app,https://www.stitch-career.vercel.app

# Environment
APP_ENV=production
```

### 2. Frontend Configuration (Vercel)
```
VITE_API_BASE_URL=https://stitch-career-api.onrender.com/api/v1
```

**CRITICAL: Do NOT set OPENAI_API_KEY in Vercel**

### 3. Code Changes Made
- ✅ Removed all hard-coded default scores from models (profile.py, job.py, application.py, interview.py)
- ✅ Implemented real OpenAI methods (analyze_job, run_ats_diagnostic, tailor_resume, generate_interview_question)
- ✅ Fixed error handling to return actual errors, not fake responses
- ✅ Removed DEV MODE markers
- ✅ Fallback provider returns reasonable defaults, not fabricated data
- ✅ Career readiness service uses only real database data
- ✅ All endpoints verify user ownership for cross-user isolation

### 4. Production Build
```bash
# Frontend
npm run build

# Verify no secrets in build
grep -r "OPENAI_API_KEY" dist/ || echo "OK: No API keys in build"
```

### 5. Backend Compilation
```bash
python -m compileall server/app/
```

### 6. Database Migrations
```bash
# Verify migration status
python -m alembic current

# Do NOT reset PostgreSQL in production
```

## Deployment Steps

### Step 1: Vercel Frontend Deployment
1. Connect repository to Vercel
2. Set build command: `npm run build`
3. Set environment variable:
   - `VITE_API_BASE_URL=https://stitch-career-api.onrender.com/api/v1`
4. Deploy and verify:
   - Frontend loads without errors
   - Console has no API key references
   - Network requests go to correct backend URL

### Step 2: Render Backend Deployment
1. Connect repository to Render
2. Set build command: `pip install -r requirements.txt && python -m alembic upgrade head`
3. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
4. Set environment variables (use Render secrets):
   - DATABASE_URL
   - SECRET_KEY
   - OPENAI_API_KEY (if using real AI)
   - AI_PROVIDER
   - OPENAI_MODEL
   - ALLOWED_ORIGINS
   - APP_ENV=production
5. Deploy and verify:
   - Server starts without errors
   - Health endpoint works: GET /api/v1/health
   - No secrets in logs

### Step 3: CORS Verification
```bash
curl -X OPTIONS https://stitch-career-api.onrender.com/api/v1/assistant/chat \
  -H "Origin: https://stitch-career.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

## Production E2E Test Workflow

### User Registration & Login
1. Navigate to https://stitch-career.vercel.app
2. Register new account
3. Verify JWT token received
4. Login with credentials
5. Verify auth/me returns correct user

### Resume Upload
1. Upload PDF resume
2. Verify file stored and extracted
3. Check parsed_summary in database

### Job Target Creation
1. Create target job with description
2. Verify job requirements extracted
3. Verify job_id returned

### ATS Analysis
1. Run ATS analysis for job
2. Verify real scores calculated (not 82.0, 81.0, etc.)
3. Check skill gaps generated
4. Verify learning roadmap created

### Skill Verification
1. Verify skill from gap
2. Check skill added to UserSkill table
3. Verify gap status updated to "strong"

### Resume Tailoring
1. Request resume tailoring for job
2. Verify only approved (verified) skills included
3. Check guardrail audit log
4. Verify no fabricated skills

### AI Assistant
1. Ask question: "What skills should I learn?"
2. Verify response based on real user data
3. Check AI uses actual missing skills, not fake data
4. Verify error message if no resume uploaded

### Skill Gaps & Roadmap
1. View skill gaps (should match ATS missing_keywords)
2. View learning roadmap (should match missing skills)
3. Verify all items point to actual user data

### Interview Preparation
1. Start interview session
2. Receive first question
3. Submit answer
4. Receive feedback
5. Verify interview_readiness_score is calculated (not default 80.0)

### Applications
1. Create application
2. Verify match_score is calculated or NULL (not 82.0)
3. Track stage updates

### Cross-User Data Isolation Test
1. Create USER A with:
   - Resume A
   - Job A
   - ATS A
   - Skills A
2. Create USER B with:
   - Resume B
   - Job B
   - ATS B
   - Skills B
3. Ask AI question as USER A
4. Verify response uses only USER A data
5. Ask AI question as USER B
6. Verify response uses only USER B data
7. Verify USER A cannot see USER B job targets
8. Verify USER B cannot see USER A resumes

## Production Verification Checklist

- [ ] Frontend builds without warnings
- [ ] Frontend bundle has no API keys
- [ ] Frontend loads on Vercel
- [ ] Backend starts on Render
- [ ] Health endpoint works
- [ ] CORS allows Vercel origin
- [ ] User can register
- [ ] User can login
- [ ] JWT tokens work
- [ ] Resume upload works
- [ ] Resume extraction works
- [ ] Job creation works
- [ ] ATS analysis works with real data
- [ ] Skill gaps created from real ATS data
- [ ] Roadmap created from real skill gaps
- [ ] Skill verification works
- [ ] Resume tailoring works (no fabricated skills)
- [ ] AI assistant provides personalized responses
- [ ] AI assistant rejects missing data appropriately
- [ ] Interview sessions work
- [ ] Cross-user data isolation verified
- [ ] All scores are real, not defaults
- [ ] No fake data visible in UI
- [ ] No debug/mock responses in production
- [ ] Errors are meaningful, not generic

## Rollback Plan

If production deployment fails:
1. Render: Redeploy previous successful build
2. Vercel: Redeploy previous successful build
3. Database: Restore from backup (no schema changes in this deployment)
4. Verify health endpoints work
5. Run basic smoke tests

## Post-Deployment Monitoring

- Monitor logs for errors
- Check error rates on Sentry (if configured)
- Monitor response times
- Verify AI API rate limits not exceeded
- Check database query performance
- Monitor storage usage
- Set up alerts for 5xx errors
