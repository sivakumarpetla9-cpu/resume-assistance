from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models import User, CareerProfile, JobTarget, ATSAnalysis, SkillGap, LearningRoadmap, InterviewSession
from app.core.config import settings

router = APIRouter(prefix="/assistant", tags=["AI Career Assistant"])

class ChatRequest(BaseModel):
    page: str = "dashboard"
    message: str

class ChatResponse(BaseModel):
    page: str
    reply: str
    context_used: dict

class CareerContextBuilder:
    @staticmethod
    def build_context(user_id: str, page: str, db: Session) -> dict:
        profile = db.query(CareerProfile).filter(CareerProfile.user_id == user_id).first()
        job = db.query(JobTarget).filter(JobTarget.user_id == user_id).first()
        ats = db.query(ATSAnalysis).first()
        gaps = db.query(SkillGap).all()
        interview = db.query(InterviewSession).first()

        return {
            "page": page,
            "overall_readiness": profile.overall_readiness_score if profile else 78.0,
            "target_job": job.title if job else "Frontend Developer",
            "target_company": job.company if job else "XYZ Technology",
            "ats_score": ats.overall_score if ats else 82.0,
            "interview_score": interview.overall_readiness_score if interview else 80.0,
            "skill_gaps_count": len(gaps),
            "missing_skills": [g.skill_name for g in gaps if g.status == "missing"] or ["TypeScript", "Docker"]
        }

@router.post("/chat", response_model=ChatResponse)
def assistant_chat(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ctx = CareerContextBuilder.build_context(current_user.id, req.page, db)
    
    # Check production AI provider error handling rule
    if settings.APP_ENV == "production" and settings.AI_PROVIDER == "openai" and not settings.AI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service is temporarily unavailable. Please configure OPENAI_API_KEY in environment settings."
        )

    # Contextual Assistant logic based on active page route & user's stored database context
    user_msg = req.message.lower()
    page = req.page.lower()
    
    if "ats" in page or "score" in user_msg:
        reply = f"Based on your ATS analysis for {ctx['target_job']} at {ctx['target_company']}, your score is currently {ctx['ats_score']}%. To increase it, consider resolving missing keyword gaps like {', '.join(ctx['missing_skills'][:2])}."
    elif "interview" in page or "prep" in user_msg:
        reply = f"Your current interview readiness is {ctx['interview_score']}%. I recommend practicing questions focused on React memoization and real-time WebSocket state resynchronization."
    elif "skill" in page or "gap" in user_msg:
        reply = f"You currently have {ctx['skill_gaps_count']} identified skill gaps for {ctx['target_job']}. Completing the TypeScript & WebSocket learning roadmap items will boost your readiness score."
    else:
        reply = f"Hello {current_user.name}! Your overall Career Readiness is {ctx['overall_readiness']}%. You are actively tracking towards the {ctx['target_job']} role at {ctx['target_company']}. What would you like to optimize today?"

    return {
        "page": req.page,
        "reply": reply,
        "context_used": ctx
    }
