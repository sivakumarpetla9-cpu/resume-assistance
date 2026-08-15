from fastapi import APIRouter
from app.schemas.schemas import InterviewStartRequest, InterviewFinishRequest
import uuid

router = APIRouter(prefix="/interviews", tags=["Interviews"])

@router.post("")
def start_interview(req: InterviewStartRequest):
    session_id = f"int-{uuid.uuid4().hex[:8]}"
    return {
        "session_id": session_id,
        "job_target_id": req.job_target_id,
        "type": req.type,
        "difficulty": req.difficulty,
        "status": "active",
        "questions": [
            {
                "id": "q1",
                "text": "How would you optimize a React application that is experiencing frame drops and slow rendering on large lists?",
                "category": "Technical",
                "difficulty": req.difficulty,
                "expectedConcepts": ["React.memo", "useCallback", "Virtualization (windowing)", "Code Splitting"]
            },
            {
                "id": "q2",
                "text": "Explain how you would handle real-time WebSocket connection drops and state resynchronization in a React application.",
                "category": "Architecture",
                "difficulty": req.difficulty,
                "expectedConcepts": ["Exponential Backoff", "Optimistic Updates", "Reconnection Queue", "Heartbeat"]
            }
        ]
    }

@router.post("/{session_id}/finish")
def finish_interview(session_id: str):
    return {
        "session_id": session_id,
        "status": "completed",
        "overall_readiness_score": 80.0,
        "score_breakdown": {
            "technical": 78.0,
            "communication": 84.0,
            "confidence": 81.0,
            "structure": 76.0,
            "relevance": 82.0
        },
        "what_went_well": [
            "Clear explanation of React component memoization.",
            "Strong technical vocabulary and natural speech pacing (142 WPM).",
            "Effective usage of real-world metrics from Apex Tech Labs experience."
        ],
        "what_needs_work": [
            "Mention list virtualization libraries like react-window explicitly.",
            "Practice deeper answers on TypeScript generics under pressure."
        ]
    }
