import uuid
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models import User, JobTarget, SkillGap, CareerProfile, UserSkill

router = APIRouter(prefix="/skills", tags=["Skills & Skill Gaps"])

class SkillVerifyReq(BaseModel):
    skill_name: str

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
            "priority": g.priority or ("HIGH" if g.status == "missing" else "MEDIUM"),
            "jobRequirement": g.job_requirement,
            "candidateEvidence": g.candidate_evidence,
            "whyItMatters": g.why_it_matters,
            "howToImprove": g.how_to_improve,
            "practiceProject": g.practice_project
        }
        for g in gaps
    ]

@router.post("/verify")
def verify_skill(
    req: SkillVerifyReq,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(CareerProfile).filter(CareerProfile.user_id == current_user.id).first()
    if not profile:
        profile = CareerProfile(id=f"prof-{uuid.uuid4().hex[:8]}", user_id=current_user.id)
        db.add(profile)

    # Check if skill already exists in UserSkill table
    skill = (
        db.query(UserSkill)
        .filter(UserSkill.profile_id == profile.id, UserSkill.skill_name == req.skill_name)
        .first()
    )
    if not skill:
        skill = UserSkill(
            id=f"sk-{uuid.uuid4().hex[:8]}",
            profile_id=profile.id,
            skill_name=req.skill_name,
            proficiency="Intermediate",
            is_verified=True
        )
        db.add(skill)
    else:
        skill.is_verified = True

    # Update associated SkillGap records to 'strong'
    jobs = db.query(JobTarget).filter(JobTarget.user_id == current_user.id).all()
    job_ids = [j.id for j in jobs]
    if job_ids:
        gaps = db.query(SkillGap).filter(SkillGap.job_target_id.in_(job_ids), SkillGap.skill_name == req.skill_name).all()
        for gap in gaps:
            gap.status = "strong"
            gap.priority = "LOW"
            gap.candidate_evidence = f"Verified by candidate on workspace."

    db.commit()

    return {
        "message": f"Successfully verified skill: {req.skill_name}",
        "skill_name": req.skill_name,
        "is_verified": True
    }
