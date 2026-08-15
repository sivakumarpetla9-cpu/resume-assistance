from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models import User, CareerProfile, UserSkill

router = APIRouter(prefix="/cover-letters", tags=["Cover Letters"])

class CoverLetterReq(BaseModel):
    company: str
    role: str

@router.post("/generate")
def generate_cover_letter(
    req: CoverLetterReq,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(CareerProfile).filter(CareerProfile.user_id == current_user.id).first()
    skills = db.query(UserSkill).filter(UserSkill.career_profile_id == profile.id).all() if profile else []
    
    skill_names = [s.skill_name for s in skills if s.is_verified]
    skills_str = ", ".join(skill_names[:4]) if skill_names else "modern software engineering tools"

    content = (
        f"Dear Hiring Team at {req.company},\n\n"
        f"I am writing to express my strong interest in the {req.role} position. "
        f"With hands-on proficiency in {skills_str} and a commitment to high-quality code delivery, "
        f"I am eager to contribute to the software initiatives at {req.company}.\n\n"
        f"I look forward to discussing how my background aligns with your engineering goals.\n\n"
        f"Sincerely,\n{current_user.name}"
    )

    return {
        "company": req.company,
        "role": req.role,
        "content": content
    }
