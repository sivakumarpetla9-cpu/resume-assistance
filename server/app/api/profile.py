from fastapi import APIRouter
from app.schemas.schemas import ProfileUpdate

router = APIRouter(prefix="/profile", tags=["Career Profile"])

@router.get("")
def get_profile():
    return {
        "name": "Alex Vance",
        "target_role": "Frontend Developer",
        "experience_level": "Mid",
        "skills": ["React", "JavaScript", "HTML5/CSS3", "Tailwind CSS", "REST APIs", "Redux"],
        "location": "San Francisco, CA (Hybrid)",
        "career_goal": "Land a Senior Frontend / UI Engineering role at a top tech company",
        "verified_experience_count": 2,
        "overall_readiness_score": 81.0
    }

@router.put("")
def update_profile(profile_in: ProfileUpdate):
    return {
        "status": "updated",
        "profile": profile_in
    }
