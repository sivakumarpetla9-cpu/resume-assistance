# STITCH — AI CAREER INTELLIGENCE SaaS

> Production-grade full-stack **AI Career Intelligence Operating System** connecting Candidate Profile → Target Job → ATS Analysis → AI Resume Tailoring → Real-Time Voice Interview Room → Skill Gap → Learning Roadmap → Career Readiness.

---

## 🚀 System Architecture

```text
STITCH Frontend (Vite + React 18 + TS + Tailwind CSS)
            │
            ▼ (REST APIs & WebSockets)
FastAPI Backend Server (Python 3.14 + Uvicorn)
      ├── Core Orchestrator & AI Provider Engine (OpenAI & Development Fallback)
      ├── Truthfulness & Non-Fabrication Guardrail Service
      ├── SQLAlchemy Relational ORM (PostgreSQL & SQLite)
      └── Real-Time Voice Telemetry WebSocket Handler (/ws/interviews/{id})
```

---

## 🛠️ Quick Start Guide

### 1. Backend Setup & Database Seeding

```bash
# Navigate to server directory
cd server

# Install Python dependencies
pip install -r requirements.txt

# Seed relational database (Creates sqlite:///./stitch.db or PostgreSQL tables)
python seed.py

# Run FastAPI backend server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

FastAPI OpenAPI interactive documentation is available at:
👉 `http://127.0.0.1:8000/api/v1/docs`

### 2. Frontend Setup

```bash
# In the repository root directory
npm install

# Run Vite dev server
npm run dev -- --host 127.0.0.1 --port 5173
```

Frontend application is live at:
👉 `http://127.0.0.1:5173/`

---

## 🧪 Testing

Run backend Pytest test suite:

```bash
cd server
pytest tests/test_api.py
```

Run frontend production build verification:

```bash
npm run build
```

---

## 🛡️ Truthfulness Guardrails
STITCH strictly prohibits AI hallucination of unbacked candidate experience. The tailoring engine compares suggested skills against verified candidate profile evidence and explicitly omits unverified technologies with an audit rationale log.
