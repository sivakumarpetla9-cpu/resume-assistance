from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user, verify_owner
from app.models import User, JobTarget, InterviewSession, InterviewFeedback
from app.schemas.schemas import InterviewStartRequest, InterviewFinishRequest
import uuid

router = APIRouter(prefix="/interviews", tags=["Interviews"])

@router.post("")
def start_interview(
    req: InterviewStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(JobTarget).filter(JobTarget.id == req.job_target_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job target not found.")
    verify_owner(job.user_id, current_user.id)

    session_id = f"int-{uuid.uuid4().hex[:8]}"
    session = InterviewSession(
        id=session_id,
        job_target_id=job.id,
        type=req.type,
        difficulty=req.difficulty,
        status="active"
    )
    db.add(session)
    db.commit()

    job_title = job.title or "Software Engineer"

    return {
        "session_id": session_id,
        "job_target_id": req.job_target_id,
        "type": req.type,
        "difficulty": req.difficulty,
        "status": "active",
        "questions": [
            {
                "id": "q1",
                "text": f"How would you optimize performance and state architecture for a key component in a {job_title} application?",
                "category": "Technical",
                "difficulty": req.difficulty,
                "expectedConcepts": ["Memoization", "Code Splitting", "Virtualization", "State Normalization"]
            },
            {
                "id": "q2",
                "text": f"Explain how you handle edge cases and connection failures in a high-throughput {job_title} system.",
                "category": "Architecture",
                "difficulty": req.difficulty,
                "expectedConcepts": ["Exponential Backoff", "Optimistic Updates", "Reconnection Queue", "Error Boundaries"]
            }
        ]
    }

@router.post("/{session_id}/finish")
def finish_interview(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    job = db.query(JobTarget).filter(JobTarget.id == session.job_target_id).first()
    if job:
        verify_owner(job.user_id, current_user.id)

    session.status = "completed"
    session.overall_readiness_score = 82.0

    feedback = InterviewFeedback(
        session_id=session.id,
        summary="Solid STAR structural alignment with clear technical vocabulary.",
        strengths=["Clear technical explanations", "Strong STAR pacing", "Good domain vocabulary"],
        improvements=["Detail concrete performance metrics", "Expand on edge-case error recovery"],
        pacing_wpm=145,
        filler_words_count=3,
        technical_depth_score=80.0
    )
    db.add(feedback)
    db.commit()

    return {
        "session_id": session_id,
        "status": "completed",
        "overall_readiness_score": 82.0,
        "score_breakdown": {
            "technical": 80.0,
            "communication": 85.0,
            "confidence": 82.0,
            "structure": 80.0,
            "relevance": 83.0
        },
        "what_went_well": feedback.strengths,
        "what_needs_work": feedback.improvements
    }
