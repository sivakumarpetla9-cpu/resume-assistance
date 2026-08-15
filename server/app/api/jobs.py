from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.models import JobTarget
from app.schemas.schemas import JobTargetCreate, JobTargetResponse
from app.services.orchestrator import orchestrator
import uuid

router = APIRouter(prefix="/jobs", tags=["Job Targets"])

@router.post("", response_model=JobTargetResponse)
def create_job_target(job_in: JobTargetCreate, db: Session = Depends(get_db)):
    job_id = f"job-{uuid.uuid4().hex[:8]}"
    
    # Process through Orchestrator
    result = orchestrator.process_new_job_target(
        title=job_in.title,
        company=job_in.company,
        description=job_in.description,
        candidate_skills=["React", "JavaScript", "Tailwind CSS", "REST APIs", "Redux"]
    )
    
    new_job = JobTarget(
        id=job_id,
        user_id="demo-user-1",
        title=job_in.title,
        company=job_in.company,
        location=job_in.location or "Remote",
        description=job_in.description,
        match_score=result["match_score"],
        ats_score=result["ats_result"]["overall_score"]
    )
    
    try:
        db.add(new_job)
        db.commit()
        db.refresh(new_job)
    except Exception:
        db.rollback()

    return {
        "id": job_id,
        "title": job_in.title,
        "company": job_in.company,
        "location": job_in.location or "Remote",
        "description": job_in.description,
        "match_score": result["match_score"],
        "ats_score": result["ats_result"]["overall_score"],
        "created_at": "Just now"
    }

@router.get("", response_model=list)
def get_job_targets(db: Session = Depends(get_db)):
    jobs = db.query(JobTarget).all()
    if not jobs:
        return [
            {
                "id": "job-1",
                "title": "Frontend Developer",
                "company": "XYZ Technology",
                "location": "San Francisco, CA",
                "description": "Build real-time React web apps with WebSockets and TypeScript.",
                "match_score": 78.0,
                "ats_score": 82.0,
                "created_at": "2026-08-10"
            }
        ]
    return [
        {
            "id": j.id,
            "title": j.title,
            "company": j.company,
            "location": j.location,
            "description": j.description,
            "match_score": j.match_score,
            "ats_score": j.ats_score,
            "created_at": str(j.created_at)
        }
        for j in jobs
    ]

@router.post("/{job_id}/analyze")
def analyze_job(job_id: str, db: Session = Depends(get_db)):
    return orchestrator.process_new_job_target(
        title="Frontend Developer",
        company="XYZ Technology",
        description="React, TypeScript, WebSockets",
        candidate_skills=["React", "JavaScript", "Tailwind CSS"]
    )
