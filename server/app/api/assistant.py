from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from openai import OpenAI

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models import (
    User,
    CareerProfile,
    JobTarget,
    ATSAnalysis,
    SkillGap,
    InterviewSession,
    Resume,
    ResumeVersion,
    LearningRoadmap
)
from app.core.config import settings


router = APIRouter(
    prefix="/assistant",
    tags=["AI Career Assistant"]
)


class ChatRequest(BaseModel):
    page: str = "dashboard"
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
    ) -> dict:

        user = db.query(User).filter(User.id == user_id).first()
        profile = db.query(CareerProfile).filter(CareerProfile.user_id == user_id).first()
        job = db.query(JobTarget).filter(JobTarget.user_id == user_id).first()
        resume = db.query(Resume).filter(Resume.user_id == user_id).first()
        version = (
            db.query(ResumeVersion)
            .filter(ResumeVersion.resume_id == resume.id)
            .first()
            if resume else None
        )

        ats = (
            db.query(ATSAnalysis)
            .filter(ATSAnalysis.job_target_id == job.id)
            .first()
            if job else None
        )

        gaps = db.query(SkillGap).filter(SkillGap.user_id == user_id).all()
        interview = (
            db.query(InterviewSession)
            .filter(InterviewSession.job_target_id == job.id)
            .first()
            if job else None
        )

        return {
            "user_name": user.name if user else "Candidate",
            "page": page,
            "overall_readiness": profile.overall_readiness_score if profile else None,
            "target_job": job.title if job else "Not set",
            "target_company": job.company if job else "Not set",
            "resume_summary": version.summary if version and version.summary else (resume.parsed_summary if resume else None),
            "ats_score": ats.overall_score if ats else None,
            "interview_score": interview.overall_readiness_score if interview else None,
            "skill_gaps_count": len(gaps),
            "missing_skills": [g.skill_name for g in gaps if g.status == "missing"]
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

    # If OpenAI API Key is configured, use OpenAI
    if settings.AI_API_KEY and settings.AI_API_KEY.strip():
        try:
            client = OpenAI(api_key=settings.AI_API_KEY)
            
            missing_skills_str = ", ".join(ctx["missing_skills"]) if ctx["missing_skills"] else "None identified"
            readiness_str = f"{ctx['overall_readiness']}%" if ctx['overall_readiness'] is not None else "Not calculated"
            ats_str = f"{ctx['ats_score']}%" if ctx['ats_score'] is not None else "Not calculated"
            resume_info = ctx["resume_summary"] if ctx["resume_summary"] else "No resume uploaded yet"

            system_prompt = f"""You are STITCH AI Career Assistant, an intelligent career strategist.

User Information:
- Candidate Name: {ctx["user_name"]}
- Active Workspace Page: {ctx["page"]}
- Target Role: {ctx["target_job"]}
- Target Company: {ctx["target_company"]}
- Resume Summary: {resume_info}
- Overall Readiness: {readiness_str}
- ATS Score: {ats_str}
- Missing Skills: {missing_skills_str}

Rules:
- Give practical, professional answers tailored to the user's active page ({ctx['page']}).
- Do NOT fabricate candidate experience or claim skills that are not present.
- If data (like resume or ATS score) is unavailable, politely inform the user to upload their resume or set a job target.
"""

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": req.message}
                ],
                temperature=0.7,
                max_tokens=600
            )

            reply = response.choices[0].message.content
            if reply:
                return {
                    "page": req.page,
                    "reply": reply,
                    "context_used": ctx
                }
        except Exception as exc:
            print("OpenAI API call failed, using intelligent context fallback:", exc)

    # Contextual structured fallback when OpenAI key is unconfigured or call fails
    page_lower = req.page.lower()
    msg_lower = req.message.lower()

    if "ats" in page_lower or "ats" in msg_lower:
        if ctx["ats_score"] is not None:
            reply = f"Your current ATS score for {ctx['target_job']} at {ctx['target_company']} is {ctx['ats_score']}%. Verifying missing core skills like {', '.join(ctx['missing_skills'][:2]) if ctx['missing_skills'] else 'key requirements'} will boost your match fit."
        else:
            reply = f"To generate your ATS diagnostic score for {ctx['target_job']}, please upload your resume and set a primary target job."
    elif "interview" in page_lower or "interview" in msg_lower:
        reply = f"In the AI Interview Room for {ctx['target_job']}, we evaluate speech telemetry (130-160 WPM), filler word count, and structural clarity. Practice your STAR method responses to boost readiness."
    elif "resume" in page_lower or "resume" in msg_lower:
        if ctx["resume_summary"]:
            reply = f"Your uploaded resume summary is indexed: '{ctx['resume_summary'][:150]}...'. In Resume Studio, we tailor bullet points against target job requirements with non-fabrication guardrails."
        else:
            reply = "Upload your PDF or DOCX resume document in the Resume Upload workspace to begin semantic keyword parsing and automated bullet tailoring."
    elif "skill" in page_lower or "roadmap" in page_lower:
        if ctx["missing_skills"]:
            reply = f"We have identified {ctx['skill_gaps_count']} skill gaps for {ctx['target_job']}: {', '.join(ctx['missing_skills'])}. Completing practice tasks on your roadmap will convert these into verified skills."
        else:
            reply = "No active skill gaps identified. Continue completing roadmap practice tasks to maintain high candidate readiness."
    else:
        reply = f"Hello {ctx['user_name']}! I am tracking your context for {ctx['target_job']} on the {req.page} workspace. How can I assist you with your resume, ATS diagnostic, or interview preparation today?"

    return {
        "page": req.page,
        "reply": reply,
        "context_used": ctx
    }