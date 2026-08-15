from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models import (
    User,
    CareerProfile,
    UserSkill,
    JobTarget,
    JobRequirement,
    ATSAnalysis,
    SkillGap,
    InterviewSession,
    InterviewFeedback,
    Resume,
    ResumeVersion,
    Experience,
    Project,
    LearningRoadmap,
    LearningItem,
    Application
)
from app.core.config import settings
from app.services.ai_providers import OpenAIProvider, DevelopmentAIProvider


router = APIRouter(
    prefix="/assistant",
    tags=["AI Career Assistant"]
)


class ChatRequest(BaseModel):
    page: str = "command-center"
    message: str


class ChatResponse(BaseModel):
    page: str
    reply: str
    context_used: dict


class CareerContextBuilder:

    @staticmethod
    def build_context(
        user_id: str,
        page: str,
        db: Session
    ) -> Dict[str, Any]:

        user = db.query(User).filter(User.id == user_id).first()
        profile = db.query(CareerProfile).filter(CareerProfile.user_id == user_id).first()
        
        user_skills = []
        if profile:
            skills_recs = db.query(UserSkill).filter(UserSkill.profile_id == profile.id).all()
            user_skills = [{"name": s.skill_name, "verified": s.is_verified} for s in skills_recs]

        job = (
            db.query(JobTarget)
            .filter(JobTarget.user_id == user_id)
            .order_by(JobTarget.created_at.desc())
            .first()
        )

        resume = (
            db.query(Resume)
            .filter(Resume.user_id == user_id)
            .order_by(Resume.created_at.desc())
            .first()
        )

        version = None
        experiences = []
        projects = []
        if resume:
            version = (
                db.query(ResumeVersion)
                .filter(ResumeVersion.resume_id == resume.id)
                .order_by(ResumeVersion.created_at.desc())
                .first()
            )
            if version:
                exp_recs = db.query(Experience).filter(Experience.version_id == version.id).all()
                experiences = [{"title": e.title, "company": e.company, "period": e.period} for e in exp_recs]

                proj_recs = db.query(Project).filter(Project.version_id == version.id).all()
                projects = [{"name": p.name, "tech_stack": p.tech_stack} for p in proj_recs]

        ats = (
            db.query(ATSAnalysis)
            .filter(ATSAnalysis.job_target_id == job.id)
            .first()
            if job else None
        )

        gaps = (
            db.query(SkillGap)
            .filter(SkillGap.job_target_id == job.id)
            .all()
            if job else []
        )
        skill_gaps = [
            {
                "skillName": g.skill_name,
                "status": g.status,
                "priority": g.priority or "HIGH"
            }
            for g in gaps
        ]

        roadmap = db.query(LearningRoadmap).filter(LearningRoadmap.user_id == user_id).first()
        roadmap_items = []
        if roadmap:
            items = db.query(LearningItem).filter(LearningItem.roadmap_id == roadmap.id).order_by(LearningItem.order).all()
            roadmap_items = [
                {
                    "title": item.title,
                    "category": item.category,
                    "status": item.status
                }
                for item in items
            ]

        interview = (
            db.query(InterviewSession)
            .filter(InterviewSession.job_target_id == job.id)
            .first()
            if job else None
        )

        apps = db.query(Application).filter(Application.user_id == user_id).all()
        applications = [{"company": a.company, "role": a.role, "stage": a.stage} for a in apps]

        # Truncate summary snippet safely for context efficiency
        resume_summary = version.summary if version and version.summary else (resume.parsed_summary if resume else None)
        if resume_summary and len(resume_summary) > 300:
            resume_summary = resume_summary[:300] + "..."

        job_desc_summary = job.description[:250] + "..." if job and job.description and len(job.description) > 250 else (job.description if job else None)

        return {
            "user": {
                "name": user.name if user else "Candidate",
                "target_role": user.target_role if user else "Software Engineer"
            },
            "career_profile": {
                "overall_readiness": profile.overall_readiness_score if profile else None,
                "resume_score": profile.resume_score if profile else None
            },
            "resume": {
                "available": bool(resume),
                "file_name": resume.file_name if resume else None,
                "extracted_text_summary": resume_summary
            },
            "skills": user_skills,
            "experience": experiences,
            "projects": projects,
            "job_target": {
                "title": job.title if job else None,
                "company": job.company if job else None,
                "description_summary": job_desc_summary
            },
            "ats": {
                "score": ats.overall_score if ats else None,
                "matched_skills": ats.matched_keywords if ats else [],
                "missing_skills": ats.missing_keywords if ats else []
            },
            "skill_gaps": skill_gaps,
            "roadmap": roadmap_items,
            "interview": {
                "readiness": interview.overall_readiness_score if interview else None
            },
            "applications": applications
        }


@router.post(
    "/chat",
    response_model=ChatResponse
)
def assistant_chat(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ctx = CareerContextBuilder.build_context(
        current_user.id,
        req.page,
        db
    )

    is_openai_mode = settings.AI_PROVIDER.lower() == "openai" or bool(settings.AI_API_KEY and settings.AI_API_KEY.strip())

    if is_openai_mode:
        if not settings.AI_API_KEY or not settings.AI_API_KEY.strip():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI service is temporarily unavailable. OPENAI_API_KEY is not configured on the backend."
            )

        try:
            provider = OpenAIProvider(api_key=settings.AI_API_KEY)
            reply = provider.chat_assistant(req.page, req.message, ctx)
        except Exception as exc:
            print(f"OpenAI Assistant Error: {exc}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI service is temporarily unavailable. Please try again."
            )
    else:
        # Development mode fallback
        provider = DevelopmentAIProvider()
        reply = provider.chat_assistant(req.page, req.message, ctx)

    # Clean context_used for response (excluding verbose data)
    clean_ctx = {
        "user_name": ctx["user"]["name"],
        "target_role": ctx["job_target"]["title"] or ctx["user"]["target_role"],
        "target_company": ctx["job_target"]["company"],
        "ats_score": ctx["ats"]["score"],
        "missing_skills": ctx["ats"]["missing_skills"],
        "skill_gaps_count": len(ctx["skill_gaps"])
    }

    return {
        "page": req.page,
        "reply": reply,
        "context_used": clean_ctx
    }