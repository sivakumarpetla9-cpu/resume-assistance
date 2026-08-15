from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models import User, CareerProfile, UserSkill
from app.schemas.schemas import ProfileUpdate

router = APIRouter(prefix="/profile", tags=["Career Profile"])

@router.get("")
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(CareerProfile).filter(CareerProfile.user_id == current_user.id).first()
    skills = []
    if profile:
        skill_recs = db.query(UserSkill).filter(UserSkill.profile_id == profile.id).all()
        skills = [s.skill_name for s in skill_recs]

    return {
        "name": current_user.name,
        "target_role": current_user.target_role or "Software Engineer",
        "experience_level": current_user.experience_level or "Mid",
        "skills": skills,
        "location": current_user.location or "Remote",
        "career_goal": current_user.career_goal or "Advance software engineering career",
        "verified_experience_count": len(skills),
        "overall_readiness_score": profile.overall_readiness_score if profile else 80.0
    }

@router.put("")
def update_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_in.name:
        current_user.name = profile_in.name
    if profile_in.target_role:
        current_user.target_role = profile_in.target_role
    if profile_in.experience_level:
        current_user.experience_level = profile_in.experience_level
    if profile_in.location:
        current_user.location = profile_in.location
    if profile_in.career_goal:
        current_user.career_goal = profile_in.career_goal

    profile = db.query(CareerProfile).filter(CareerProfile.user_id == current_user.id).first()
    if not profile:
        profile = CareerProfile(user_id=current_user.id)
        db.add(profile)

    if profile_in.skills is not None:
        db.query(UserSkill).filter(UserSkill.profile_id == profile.id).delete()
        for s_name in profile_in.skills:
            db.add(UserSkill(profile_id=profile.id, skill_name=s_name, is_verified=True))

    db.commit()

    return {
        "status": "updated",
        "profile": profile_in
    }
