from fastapi import FastAPI, WebSocket, Depends, HTTPException, status
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json

from app.core.config import settings
from app.db.database import engine
from app.db.base import Base
from app.db.session import get_db
from app.core.dependencies import get_current_user, verify_owner
from app.models import User, Resume
from app.websocket.interview import InterviewWebSocketHandler
from app.api import (
    auth, profile, resumes, jobs, ats,
    tailoring, interviews, skills, learning,
    applications, cover_letter, portfolio, linkedin, health, assistant
)

# Automatically create database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="STITCH — AI Career Intelligence Operating System Production API Suite",
    version="2.4.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

# CORS configuration
origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Health & API v1 Routers
app.include_router(health.router)

api_v1 = settings.API_V1_STR
app.include_router(auth.router, prefix=api_v1)
app.include_router(profile.router, prefix=api_v1)
app.include_router(resumes.router, prefix=api_v1)
app.include_router(jobs.router, prefix=api_v1)
app.include_router(ats.router, prefix=api_v1)
app.include_router(tailoring.router, prefix=api_v1)
app.include_router(interviews.router, prefix=api_v1)
app.include_router(skills.router, prefix=api_v1)
app.include_router(learning.router, prefix=api_v1)
app.include_router(applications.router, prefix=api_v1)
app.include_router(cover_letter.router, prefix=api_v1)
app.include_router(portfolio.router, prefix=api_v1)
app.include_router(linkedin.router, prefix=api_v1)
app.include_router(assistant.router, prefix=api_v1)

# Authorized File Download Endpoint (Per-User Security Ownership Verification)
@app.get(f"{settings.API_V1_STR}/resumes/{{resume_id}}/file")
def get_resume_file(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Enforce Phase 5 & 32 User Authorization Check (Returns 403 Forbidden if accessed by another user)
    verify_owner(resume.user_id, current_user.id)

    dummy_pdf_bytes = f"%PDF-1.4 STITCH Export Document: {resume.file_name}".encode('utf-8')
    return Response(content=dummy_pdf_bytes, media_type="application/pdf")

# Real-Time WebSocket Interview Room Endpoint
@app.websocket("/ws/interviews/{session_id}")
async def interview_websocket(websocket: WebSocket, session_id: str):
    await InterviewWebSocketHandler.handle_connection(websocket, session_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
