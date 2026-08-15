from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user, verify_owner
from app.models import User, JobTarget, ATSAnalysis, Resume, ResumeVersion
from app.services.ai_providers import DevelopmentAIProvider
import uuid

router = APIRouter(prefix="/jobs", tags=["ATS Analysis"])

@router.post("/{job_id}/ats")
def run_ats_analysis(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(JobTarget).filter(JobTarget.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job target not found.")

    verify_owner(job.user_id, current_user.id)

    # Query candidate's uploaded resume
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    resume_summary = resume.parsed_summary if resume else ""

    ai = DevelopmentAIProvider()
    diagnostic = ai.run_ats_diagnostic({"summary": resume_summary}, job.description)

    # Save or update database record
    ats = db.query(ATSAnalysis).filter(ATSAnalysis.job_target_id == job.id).first()
    if not ats:
        ats = ATSAnalysis(
            id=f"ats-{uuid.uuid4().hex[:8]}",
            job_target_id=job.id,
            overall_score=diagnostic.get("overall_score", 82.0),
            keyword_score=diagnostic.get("keyword_score", 74.0),
            skills_score=diagnostic.get("skills_score", 80.0),
            experience_score=diagnostic.get("experience_score", 86.0),
            structure_score=diagnostic.get("structure_score", 92.0),
            language_score=diagnostic.get("language_score", 88.0),
            matched_keywords=diagnostic.get("matched_keywords", []),
            missing_keywords=diagnostic.get("missing_keywords", []),
            weak_keywords=diagnostic.get("weak_keywords", []),
            structural_issues=diagnostic.get("structural_issues", [])
        )
        db.add(ats)
    else:
        ats.overall_score = diagnostic.get("overall_score", ats.overall_score)
        ats.keyword_score = diagnostic.get("keyword_score", ats.keyword_score)
        ats.skills_score = diagnostic.get("skills_score", ats.skills_score)
        ats.matched_keywords = diagnostic.get("matched_keywords", ats.matched_keywords)
        ats.missing_keywords = diagnostic.get("missing_keywords", ats.missing_keywords)

    job.ats_score = ats.overall_score
    db.commit()
    db.refresh(ats)

    return {
        "job_id": job.id,
        "overall_score": ats.overall_score,
        "keyword_score": ats.keyword_score,
        "skills_score": ats.skills_score,
        "experience_score": ats.experience_score,
        "structure_score": ats.structure_score,
        "language_score": ats.language_score,
        "matched_keywords": ats.matched_keywords,
        "missing_keywords": ats.missing_keywords,
        "weak_keywords": ats.weak_keywords,
        "structural_issues": ats.structural_issues,
        "guardrail_alerts": diagnostic.get("guardrail_alerts", [])
    }

@router.get("/{job_id}/ats/latest")
def get_latest_ats(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(JobTarget).filter(JobTarget.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job target not found.")

    verify_owner(job.user_id, current_user.id)

    ats = db.query(ATSAnalysis).filter(ATSAnalysis.job_target_id == job.id).first()
    if not ats:
        return {
            "job_id": job.id,
            "ats_analysis": None,
            "message": "No ATS diagnostic generated yet for this job target."
        }

    return {
        "job_id": job.id,
        "overall_score": ats.overall_score,
        "keyword_score": ats.keyword_score,
        "skills_score": ats.skills_score,
        "experience_score": ats.experience_score,
        "structure_score": ats.structure_score,
        "language_score": ats.language_score,
        "matched_keywords": ats.matched_keywords,
        "missing_keywords": ats.missing_keywords,
        "weak_keywords": ats.weak_keywords,
        "structural_issues": ats.structural_issues,
        "created_at": ats.created_at
    }
