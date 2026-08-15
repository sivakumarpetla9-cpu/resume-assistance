from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models import User, JobTarget, SkillGap

router = APIRouter(prefix="/skills", tags=["Skills & Skill Gaps"])

@router.get("/gaps")
def get_skill_gaps(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    jobs = db.query(JobTarget).filter(JobTarget.user_id == current_user.id).all()
    job_ids = [j.id for j in jobs]
    if not job_ids:
        return []

    gaps = db.query(SkillGap).filter(SkillGap.job_target_id.in_(job_ids)).all()
    return [
        {
            "id": g.id,
            "skillName": g.skill_name,
            "status": g.status,
            "jobRequirement": g.job_requirement,
            "candidateEvidence": g.candidate_evidence,
            "whyItMatters": g.why_it_matters,
            "howToImprove": g.how_to_improve,
            "practiceProject": g.practice_project
        }
        for g in gaps
    ]
