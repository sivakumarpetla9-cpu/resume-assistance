import re
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user, verify_owner
from app.models import User, JobTarget, JobRequirement
from app.schemas.schemas import JobTargetCreate, JobTargetResponse

router = APIRouter(prefix="/jobs", tags=["Job Targets"])

COMMON_TECH_SKILLS = [
    "React", "TypeScript", "JavaScript", "Python", "Java", "C++", "C#", "Go", "Rust",
    "HTML", "CSS", "Tailwind CSS", "Tailwind", "Bootstrap", "WebSockets", "Redux",
    "Node.js", "Express", "FastAPI", "Django", "Flask", "GraphQL", "REST APIs",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
    "Jest", "Cypress", "PyTest", "Vite", "Webpack", "Next.js", "Vue.js", "Angular", "CI/CD"
]

def extract_skills_from_text(text: str) -> List[str]:
    found = []
    for skill in COMMON_TECH_SKILLS:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text, re.IGNORECASE):
            found.append(skill)
    return found

@router.post("", response_model=JobTargetResponse)
def create_job_target(
    job_in: JobTargetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job_id = f"job-{uuid.uuid4().hex[:8]}"
    
    new_job = JobTarget(
        id=job_id,
        user_id=current_user.id,
        title=job_in.title,
        company=job_in.company,
        location=job_in.location or "Remote",
        description=job_in.description,
        match_score=None,
        ats_score=None
    )
    db.add(new_job)

    # Extract required skills and save JobRequirement records
    extracted_skills = extract_skills_from_text(job_in.description)
    for skill in extracted_skills:
        req = JobRequirement(
            id=f"req-{uuid.uuid4().hex[:8]}",
            job_target_id=job_id,
            skill_name=skill,
            is_required=True,
            importance_level="High"
        )
        db.add(req)

    db.commit()
    db.refresh(new_job)

    return {
        "id": new_job.id,
        "title": new_job.title,
        "company": new_job.company,
        "location": new_job.location,
        "description": new_job.description,
        "match_score": new_job.match_score or 0.0,
        "ats_score": new_job.ats_score or 0.0,
        "created_at": str(new_job.created_at)
    }

@router.get("", response_model=list)
def get_job_targets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    jobs = db.query(JobTarget).filter(JobTarget.user_id == current_user.id).order_by(JobTarget.created_at.desc()).all()
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

@router.get("/{job_id}")
def get_job_target(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(JobTarget).filter(JobTarget.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job target not found.")

    verify_owner(job.user_id, current_user.id)

    requirements = db.query(JobRequirement).filter(JobRequirement.job_target_id == job.id).all()
    req_skills = [r.skill_name for r in requirements]

    return {
        "id": job.id,
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "description": job.description,
        "match_score": job.match_score,
        "ats_score": job.ats_score,
        "required_skills": req_skills,
        "created_at": str(job.created_at)
    }
